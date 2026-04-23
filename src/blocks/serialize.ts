/**
 * Tree walker — converts a JSX <Section> tree into Kajabi settings_data.json.
 *
 * Usage:
 *   const data = serializeTree(
 *     <>
 *       <HeaderSection>...</HeaderSection>
 *       <ContentSection>...</ContentSection>
 *       <FooterSection>...</FooterSection>
 *     </>
 *   );
 *
 * The walker:
 * 1. Iterates children of the root fragment
 * 2. For each Section element, reads layout props → section.settings
 * 3. For each Block child, calls Block.serialize(props) → block.settings
 * 4. Generates stable IDs (header/footer fixed, content sections get unique ids)
 * 5. Assembles content_for_index (the homepage order)
 * 6. Returns { current: { sections: {...}, content_for_index: [...] } }
 */
import { Children, Fragment, isValidElement, type ReactNode, type ReactElement } from 'react';
import type {
  KajabiBlock,
  KajabiSection,
  BlockComponent,
  SectionFlavor,
  SectionLayoutProps,
  PaddingObject,
} from './types';
import { SECTION_FLAVOR_TO_KAJABI_TYPE } from './types';

// ---- ID generation ----

// Kajabi IDs are 13-digit numeric strings (millisecond timestamps).
// We seed from Date.now() and increment to guarantee uniqueness within an export.
let idCounter = 0;
let idSeed = 0;

function nextNumericId(): string {
  idCounter += 1;
  return String(idSeed + idCounter);
}

function nextBlockId(): string {
  return nextNumericId();
}

function nextSectionId(): string {
  return nextNumericId();
}

// ---- External background-image override collection ----
//
// Kajabi's `bg_image` field is an `image_picker` — its value is run through
// the `image_picker_url` Liquid filter, which assumes an internal Kajabi
// asset id. When we save an external URL (e.g. our Supabase storage URL)
// straight into `bg_image`, that filter mangles the URL into a broken
// `kajabi-storefronts-production.kajabi-cdn.com/.../<full-original-url>.png`
// path that 404s.
//
// Workaround: keep `bg_type: 'image'` so `section.liquid` still renders the
// overlay + sizing branch correctly, but blank out `bg_image` so the broken
// proxy URL never lands in the rendered CSS. Then inject a real CSS rule
// `#section-<id> { background-image: url(<external-url>) !important; ... }`
// into the global theme CSS at export time.
//
// `serializeTree` resets this on every call and exposes it on the result so
// `export.ts` can fold it into `current.css`.
export interface SectionBackgroundOverride {
  url: string;
  position: string;
  fixed: boolean;
}
let externalBgOverrides = new Map<string, SectionBackgroundOverride>();

/**
 * Returns true if `url` looks like an external image URL we should NOT pass
 * to Kajabi's `image_picker_url` filter. We treat anything that isn't a
 * Kajabi-hosted asset path / id as external.
 */
function isExternalImageUrl(url: string): boolean {
  if (!url) return false;
  // Kajabi's image_picker stores values as either numeric asset ids or
  // theme-relative `assets/<file>` paths produced by the asset manager.
  if (/^\d+$/.test(url)) return false;
  if (url.startsWith('assets/')) return false;
  // Anything Kajabi-hosted is also fine to leave alone.
  if (/^https?:\/\/[^/]*kajabi(-cdn)?\.com\//i.test(url)) return false;
  // Everything else (https://*.supabase.co/..., other CDNs, data:, blob:)
  // would be mangled by image_picker_url — treat as external.
  return /^(https?:|data:|blob:)/i.test(url);
}

// ---- Section component marker ----

/**
 * Section components attach this marker via a static field so the
 * walker can identify them and read their flavor.
 */
export interface SectionComponent {
  (props: { children?: ReactNode } & SectionLayoutProps): JSX.Element | null;
  __kajabiSectionFlavor: SectionFlavor;
  /** Set of allowed kajabi block types for runtime validation */
  __allowedBlockTypes: Set<string>;
}

// ---- Settings assembly helpers ----

function paddingToKajabi(p?: PaddingObject): Record<string, string> | undefined {
  if (!p) return undefined;
  return {
    top: p.top ?? '',
    right: p.right ?? '',
    bottom: p.bottom ?? '',
    left: p.left ?? '',
  };
}

/**
 * Section-level defaults required by `sections/section.liquid`.
 * Missing any of these can cause sections to render as empty containers
 * because the template references them unconditionally.
 */
const SECTION_DEFAULTS: Record<string, unknown> = {
  bg_type: 'none',
  bg_image: '',
  bg_video: '',
  bg_position: 'center',
  background_color: '',
  background_fixed: 'false',
  vertical: 'center',
  horizontal: 'center',
  full_width: 'false',
  full_height: 'false',
  equal_height: 'false',
  // NOTE: reveal_event/reveal_units/reveal_offset are block-level fields in the
  // Kajabi schema validator; they must NOT appear in section settings.
  hide_on_mobile: 'false',
  hide_on_desktop: 'false',
  padding_desktop: { top: '', right: '', bottom: '', left: '' },
  padding_mobile: { top: '', right: '', bottom: '', left: '' },
};

function buildSectionSettings(layout: SectionLayoutProps, flavor: SectionFlavor): Record<string, unknown> {
  const settings: Record<string, unknown> = { ...SECTION_DEFAULTS };

  // ---- Common: background ----
  // Precedence: explicit bgType > backgroundVideo > backgroundImage > background.
  // section.liquid renders different markup based on bg_type, so it must be
  // accurate or the wrong template branch fires.
  //
  // SAFETY: if bgType says 'image'/'video' but the corresponding URL is
  // missing/empty (e.g. an unresolved SiteDesign slot ref), demote rather
  // than emit a broken section that renders as a black void in Kajabi.
  const hasImgUrl = typeof layout.backgroundImage === 'string' && layout.backgroundImage.length > 0;
  const hasVidUrl = typeof layout.backgroundVideo === 'string' && layout.backgroundVideo.length > 0;
  let effectiveBgType = layout.bgType;
  if (effectiveBgType === 'image' && !hasImgUrl) {
    console.warn('[serialize] bgType="image" with no backgroundImage — demoting to color');
    effectiveBgType = undefined;
  }
  if (effectiveBgType === 'video' && !hasVidUrl) {
    console.warn('[serialize] bgType="video" with no backgroundVideo — demoting to color');
    effectiveBgType = undefined;
  }
  if (effectiveBgType) {
    settings.bg_type = effectiveBgType;
  } else if (hasVidUrl) {
    settings.bg_type = 'video';
  } else if (hasImgUrl) {
    settings.bg_type = 'image';
  } else if (layout.background) {
    settings.bg_type = 'color';
  }
  if (layout.backgroundImage) {
    // Write the URL straight into `bg_image` — same as block images
    // (e.g. block_image.liquid → block.settings.image | image_picker_url).
    // Kajabi's image_picker_url filter passes external https:// URLs through
    // unchanged, so no CSS-injection workaround is needed.
    settings.bg_image = layout.backgroundImage;
  }
  if (layout.backgroundVideo) settings.bg_video = layout.backgroundVideo;
  if (layout.bgPosition) settings.bg_position = layout.bgPosition;
  if (layout.backgroundFixed) settings.background_fixed = 'true';
  if (layout.background) settings.background_color = layout.background;
  if (layout.textColor) settings.text_color = layout.textColor;

  // ---- Common: layout ----
  if (layout.maxWidth != null) settings.max_width = String(layout.maxWidth);
  if (layout.hideOnMobile) settings.hide_on_mobile = 'true';
  if (layout.hideOnDesktop) settings.hide_on_desktop = 'true';

  const pd = paddingToKajabi(layout.paddingDesktop);
  const pm = paddingToKajabi(layout.paddingMobile);
  if (pd) settings.padding_desktop = pd;
  if (pm) settings.padding_mobile = pm;

  // ---- Content-only fields ----
  if (flavor === 'content') {
    if (layout.vertical) settings.vertical = layout.vertical;
    if (layout.horizontal) settings.horizontal = layout.horizontal;
    if (layout.equalHeight) settings.equal_height = 'true';
    if (layout.fullWidth) settings.full_width = 'true';
    if (layout.fullHeight) settings.full_height = 'true';
  }

  // ---- Header-only fields ----
  if (flavor === 'header') {
    // Header doesn't use section.liquid layout fields — strip them so
    // section.liquid-only keys don't leak in.
    delete settings.bg_type;
    delete settings.bg_image;
    delete settings.bg_video;
    delete settings.bg_position;
    delete settings.background_fixed;
    delete settings.vertical;
    delete settings.horizontal;
    delete settings.full_width;
    delete settings.full_height;
    delete settings.equal_height;

    if (layout.position) settings.position = layout.position;
    if (layout.sticky) settings.sticky = 'true';
    if (layout.stickyTextColor) settings.sticky_text_color = layout.stickyTextColor;
    if (layout.stickyBackgroundColor) settings.sticky_background_color = layout.stickyBackgroundColor;
    if (layout.cart) settings.cart = 'true';
    if (layout.horizontalAlignment) settings.horizontal = layout.horizontalAlignment;
    if (layout.fontSizeDesktop) settings.font_size_desktop = layout.fontSizeDesktop;
    if (layout.fontSizeMobile) settings.font_size_mobile = layout.fontSizeMobile;
    if (layout.mobileHeaderTextColor) settings.mobile_header_text_color = layout.mobileHeaderTextColor;
    if (layout.mobileHeaderBackgroundColor) settings.mobile_header_background_color = layout.mobileHeaderBackgroundColor;
    if (layout.hamburgerColor) settings.hamburger_color = layout.hamburgerColor;
    if (layout.stickyHamburgerColor) settings.sticky_hamburger_color = layout.stickyHamburgerColor;
    if (layout.closeOnScroll != null) settings.close_on_scroll = layout.closeOnScroll ? 'true' : 'false';
    if (layout.mobileMenuTextAlignment) settings.mobile_menu_text_alignment = layout.mobileMenuTextAlignment;
  }

  // ---- Footer-only fields ----
  if (flavor === 'footer') {
    // Footer doesn't use section.liquid layout fields either.
    delete settings.bg_type;
    delete settings.bg_image;
    delete settings.bg_video;
    delete settings.bg_position;
    delete settings.background_fixed;
    delete settings.vertical;
    delete settings.horizontal;
    delete settings.full_width;
    delete settings.full_height;
    delete settings.equal_height;

    if (layout.verticalLayout) settings.vertical_layout = 'true';
    if (layout.copyrightTextColor) settings.copyright_text_color = layout.copyrightTextColor;
    if (layout.poweredByTextColor) settings.powered_by_text_color = layout.poweredByTextColor;
    if (layout.fontSizeDesktop) settings.font_size_desktop = layout.fontSizeDesktop;
    if (layout.fontSizeMobile) settings.font_size_mobile = layout.fontSizeMobile;
  }

  return settings;
}

// ---- Content-grid field stripper (for header/footer blocks) ----

/**
 * Fields injected by `withBlockDefaults` that only apply to content blocks
 * rendered through `snippets/block.liquid`. Header/footer blocks render through
 * their own templates and must not carry these.
 */
const CONTENT_GRID_ONLY_FIELDS = [
  'width', 'text_align', 'box_shadow', 'animation_type', 'animation_direction',
  'delay', 'duration', 'hide_on_desktop', 'hide_on_mobile', 'make_block',
] as const;

function stripContentGridFields(settings: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(settings)) {
    if ((CONTENT_GRID_ONLY_FIELDS as readonly string[]).includes(k)) continue;
    out[k] = v;
  }
  return out;
}

// ---- Tree walking ----

interface SerializedSection {
  /** Stable id used as the key in settings.sections and (for content) in content_for_index */
  id: string;
  flavor: SectionFlavor;
  section: KajabiSection;
}

function isSectionComponent(type: unknown): type is SectionComponent {
  return (
    typeof type === 'function' &&
    '__kajabiSectionFlavor' in (type as object)
  );
}

/**
 * Raw Kajabi section component (e.g. <RawSection type="products" .../>).
 * Detected via the static `__rawKajabiSection` marker; settings/blocks pass
 * straight through to `settings_data.json` so dynamic Kajabi sections
 * (products, blog_listings, blog_post_body, etc.) can sit inside our
 * `content_for_<template>` array alongside our composed content sections.
 */
interface RawSectionLike {
  __rawKajabiSection: true;
}
function isRawSectionComponent(type: unknown): type is RawSectionLike {
  return (
    typeof type === 'function' &&
    '__rawKajabiSection' in (type as object) &&
    (type as unknown as RawSectionLike).__rawKajabiSection === true
  );
}

function isBlockComponent(type: unknown): type is BlockComponent {
  return (
    typeof type === 'function' &&
    'kajabiType' in (type as object) &&
    'serialize' in (type as object)
  );
}

interface RawSectionProps {
  type: string;
  name?: string;
  settings?: Record<string, unknown>;
  blocks?: Record<string, KajabiBlock>;
  blockOrder?: string[];
  hidden?: 'true' | 'false';
}

function walkRawSection(el: ReactElement): SerializedSection {
  const props = (el.props ?? {}) as RawSectionProps;
  const blocks = props.blocks ?? {};
  const blockOrder = props.blockOrder ?? Object.keys(blocks);
  return {
    id: nextSectionId(),
    flavor: 'content',
    section: {
      type: props.type,
      name: props.name ?? props.type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      hidden: props.hidden ?? 'false',
      settings: { ...(props.settings ?? {}) },
      blocks,
      block_order: blockOrder,
    },
  };
}

function walkSection(el: ReactElement): SerializedSection {
  const SectionType = el.type as SectionComponent;
  const flavor = SectionType.__kajabiSectionFlavor;
  const allowed = SectionType.__allowedBlockTypes;
  const props = (el.props || {}) as { children?: ReactNode } & SectionLayoutProps;

  const sectionSettings = buildSectionSettings(props, flavor);
  const blocks: Record<string, KajabiBlock> = {};
  const blockOrder: string[] = [];

  // Recursively walk the section's subtree so block components nested inside
  // layout wrappers (e.g. <div style={{display:'grid'}}>...</div>) are still
  // collected. Preview wrappers are presentational only — they don't exist in
  // the Kajabi output, which is a flat block list inside the section.
  function collectBlocks(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;
      const ChildType = child.type;

      if (isBlockComponent(ChildType)) {
        if (!allowed.has(ChildType.kajabiType)) {
          console.warn(
            `[serialize] Block type "${ChildType.kajabiType}" is not allowed in <${flavor}Section>. Skipping.`
          );
          return;
        }
        let blockSettings = ChildType.serialize(child.props as Record<string, unknown>);
        if (flavor === 'header' || flavor === 'footer') {
          blockSettings = stripContentGridFields(blockSettings);
        }
        const blockId = nextBlockId();
        blocks[blockId] = {
          type: ChildType.kajabiType,
          settings: blockSettings,
        };
        blockOrder.push(blockId);
        return;
      }

      // Not a block — descend into its children (handles <div>, <Fragment>, etc.)
      const childProps = (child.props ?? {}) as { children?: ReactNode };
      if (childProps.children != null) {
        collectBlocks(childProps.children);
      }
    });
  }
  collectBlocks(props.children);

  // Header and footer use fixed keys; content sections always get numeric IDs.
  // Kajabi requires numeric (timestamp-style) section IDs in content_for_index.
  const id =
    flavor === 'header' ? 'header' :
    flavor === 'footer' ? 'footer' :
    nextSectionId();

  // (Section background images now ride directly in `bg_image` — no
  // CSS-injection workaround needed; Kajabi's image_picker_url filter
  // passes external https:// URLs through.)

  return {
    id,
    flavor,
    section: {
      type: SECTION_FLAVOR_TO_KAJABI_TYPE[flavor],
      // Kajabi shows `name` in the editor sidebar. Templates can pass a friendly
      // label (e.g. "Hero", "Community", "FAQ") via the `name` prop on the
      // section wrapper; otherwise fall back to the flavor's default.
      name: props.name ?? (flavor === 'header' ? 'Header' : flavor === 'footer' ? 'Footer' : 'Section'),
      hidden: 'false',
      settings: sectionSettings,
      blocks,
      block_order: blockOrder,
    },
  };
}

// ---- Public API ----

export interface SerializeTreeResult {
  /** The full settings_data.json payload (with `current` wrapper) */
  settingsData: Record<string, unknown>;
  /**
   * Per-section background-image overrides for URLs that Kajabi's
   * `image_picker_url` filter would mangle (Supabase storage, etc.).
   * Keyed by section id; export.ts injects matching CSS into current.css.
   */
  externalBackgrounds: Map<string, SectionBackgroundOverride>;
}

/**
 * A multi-page input: a map of template name → tree.
 *
 * Supported template keys mirror the Kajabi base theme's `templates/*.liquid`
 * files that use `{% dynamic_sections_for "<name>" %}` (or `content_for_index`
 * for the homepage):
 *   - index       → content_for_index
 *   - about       → content_for_about
 *   - page        → content_for_page
 *   - contact     → content_for_contact
 *   - blog        → content_for_blog
 *   - blog_post   → content_for_blog_post
 *   - thank_you   → content_for_thank_you
 *   - 404         → content_for_404
 *
 * Header/footer are SHARED across all templates — Kajabi renders them from
 * `sections.header` / `sections.footer` via `{% section "header" %}` in the
 * shared layout, regardless of which template is active. If multiple trees
 * include a HeaderSection / FooterSection, the LAST one wins (with a warning).
 */
export type PageTrees = Record<string, ReactNode>;

/**
 * Kajabi system templates that ship in the base theme zip. Anything outside
 * this list is treated as a custom page — the export engine will materialize
 * `templates/<name>.liquid` + a `content_for_<name>` array in settings_data.
 *
 * Per `mem://reference/kajabi-page-creation.md`, never route new pages
 * through the `(page)` or `(sales_page)` slots — give them custom names.
 */
export const SYSTEM_TEMPLATES = [
  // Pages we compose
  'index', 'about', 'page', 'contact', 'blog', 'blog_post', 'thank_you', '404',
  // Pages Kajabi renders dynamically — base zip ships their .liquid templates
  // with dynamic product/library/store/login/member-directory/announcements
  // logic. Listing them here means the export engine WON'T overwrite those
  // .liquid files with a generic `dynamic_sections_for` shim.
  'library', 'store', 'login', 'member_directory', 'announcements',
  'newsletter', 'newsletter_post', 'newsletter_subscribe', 'blog_search',
  // These still ship as dedicated base-theme templates we preserve as-is.
  'forgot_password', 'forgot_password_edit', 'sales_page',
] as const;
export type SystemTemplate = typeof SYSTEM_TEMPLATES[number];

/** @deprecated kept for backward compatibility — use SYSTEM_TEMPLATES. */
export const SUPPORTED_TEMPLATES = SYSTEM_TEMPLATES;
export type SupportedTemplate = SystemTemplate;

/**
 * Page-name validator: lowercase letters, digits, underscores, hyphens, 1–48 chars.
 * Hyphens are valid in Kajabi template filenames (e.g. `navigating-autism.liquid`).
 */
const VALID_TEMPLATE_NAME = /^[a-z0-9_-]{1,48}$/;

function contentForKey(template: string): string {
  return `content_for_${template}`;
}

function isPageTreesMap(input: ReactNode | PageTrees): input is PageTrees {
  // A ReactNode is either a primitive, an array, or a React element/fragment.
  // A PageTrees map is a plain object whose keys are strings (system or custom
  // page names) and whose values are React nodes.
  if (input == null) return false;
  if (typeof input !== 'object') return false;
  if (Array.isArray(input)) return false;
  if (isValidElement(input as object)) return false;
  const keys = Object.keys(input as Record<string, unknown>);
  if (keys.length === 0) return false;
  // Any plain object with at least one key is treated as a page-tree map.
  // Per-key validation runs in serializeTree.
  return true;
}

export function serializeTree(input: ReactNode | PageTrees): SerializeTreeResult {
  // Reset counters so output is deterministic per call (when paired with mocked Date.now in tests).
  // Seed from Date.now() to produce 13-digit numeric IDs matching Kajabi convention.
  idCounter = 0;
  idSeed = Date.now();
  externalBgOverrides = new Map();

  const sections: Record<string, KajabiSection> = {};
  // Per-template content_for_<name> arrays, populated as we walk each tree.
  const contentForByTemplate: Record<string, string[]> = {};
  // Track header/footer collisions across pages.
  let headerSeenIn: string | null = null;
  let footerSeenIn: string | null = null;

  function visit(node: ReactNode, contentOrder: string[], templateName: string) {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;
      if (child.type === Fragment) {
        visit((child.props as { children?: ReactNode }).children, contentOrder, templateName);
        return;
      }
      if (isRawSectionComponent(child.type)) {
        const ser = walkRawSection(child);
        sections[ser.id] = ser.section;
        contentOrder.push(ser.id);
        return;
      }
      if (isSectionComponent(child.type)) {
        const ser = walkSection(child);
        if (ser.flavor === 'header') {
          if (headerSeenIn && headerSeenIn !== templateName) {
            console.warn(
              `[serialize] HeaderSection found in template "${templateName}" but already defined by "${headerSeenIn}". Last one wins (header is shared site-wide).`,
            );
          }
          headerSeenIn = templateName;
        } else if (ser.flavor === 'footer') {
          if (footerSeenIn && footerSeenIn !== templateName) {
            console.warn(
              `[serialize] FooterSection found in template "${templateName}" but already defined by "${footerSeenIn}". Last one wins (footer is shared site-wide).`,
            );
          }
          footerSeenIn = templateName;
        }
        sections[ser.id] = ser.section;
        if (ser.flavor === 'content') {
          contentOrder.push(ser.id);
        }
        return;
      }
      // Custom function component (e.g. a user's <Page />) — invoke it and
      // recurse into its rendered output so its Section children are picked up.
      if (typeof child.type === 'function') {
        try {
          const Comp = child.type as (p: unknown) => ReactNode;
          const rendered = Comp(child.props ?? {});
          visit(rendered, contentOrder, templateName);
          return;
        } catch (err) {
          console.warn('[serialize] Failed to render wrapper component:', child.type, err);
          return;
        }
      }
      console.warn('[serialize] Top-level child is not a Section component:', child.type);
    });
  }

  // Normalize input into a PageTrees map.
  const trees: PageTrees = isPageTreesMap(input)
    ? (input as PageTrees)
    : { index: input as ReactNode };

  // A few Kajabi-managed pages still rely on their base-theme Liquid and
  // should not receive composed `content_for_*` payloads.
  const NON_COMPOSABLE_TEMPLATES = new Set([
    'forgot_password', 'forgot_password_edit', 'sales_page',
  ]);

  for (const [templateName, tree] of Object.entries(trees)) {
    if (!VALID_TEMPLATE_NAME.test(templateName) && templateName !== '404') {
      console.warn(
        `[serialize] Invalid template name "${templateName}" — must match ${VALID_TEMPLATE_NAME}. Skipping.`,
      );
      continue;
    }
    if (NON_COMPOSABLE_TEMPLATES.has(templateName)) {
      console.warn(
        `[serialize] Skipping "${templateName}" — Kajabi auth/checkout templates can't be composed; their built-in Liquid is preserved.`,
      );
      continue;
    }
    const contentOrder: string[] = [];
    visit(tree, contentOrder, templateName);
    contentForByTemplate[contentForKey(templateName)] = contentOrder;
  }

  // Always guarantee a content_for_index key (even if empty) so the homepage
  // template doesn't render stale data from the original settings_data.
  if (!contentForByTemplate['content_for_index']) {
    contentForByTemplate['content_for_index'] = [];
  }

  return {
    settingsData: {
      current: {
        sections,
        ...contentForByTemplate,
      },
    },
    externalBackgrounds: externalBgOverrides,
  };
}
