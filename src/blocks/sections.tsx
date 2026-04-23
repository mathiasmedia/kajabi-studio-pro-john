/**
 * Section wrappers — HeaderSection, ContentSection, FooterSection
 *
 * Each is a React component that:
 * 1. Renders its children inside a styled container (preview)
 * 2. Carries static metadata (__kajabiSectionFlavor, __allowedBlockTypes)
 *    used by the tree walker to assemble Kajabi JSON
 *
 * Allowed block types per flavor:
 * - header: logo, menu, dropdown, user, social_icons, link_list, cta
 * - content: text, cta, code, feature, image, pricing_card, social_icons,
 *            accordion, video_embed
 * - footer: copyright, logo, social_icons
 */
import { Children, Fragment, cloneElement, isValidElement, type ReactElement, type ReactNode, type CSSProperties } from 'react';
import type { BlockComponent, SectionLayoutProps } from './types';
import type { SectionComponent } from './serialize';

/**
 * Read the Kajabi column width (1-12) for a block child. Mirrors
 * `snippets/block.liquid` which wraps each block in `<div class="col-md-{width}">`.
 * Falls back to the block's serialize() output, then to '12' for safety.
 */
function getBlockColWidth(child: ReactElement): string {
  const props = (child.props ?? {}) as Record<string, unknown>;
  if (typeof props.width === 'string' && props.width) return props.width;
  if (typeof props.colWidth === 'string' && props.colWidth) return props.colWidth;
  const ChildType = child.type as Partial<BlockComponent>;
  if (typeof ChildType?.serialize === 'function') {
    try {
      const s = ChildType.serialize(props);
      if (s && typeof s.width === 'string' && s.width) return s.width;
    } catch {
      // ignore — preview-only fallback
    }
  }
  return '12';
}

function isBlockChild(child: ReactNode): child is ReactElement {
  return (
    isValidElement(child) &&
    typeof child.type === 'function' &&
    'kajabiType' in (child.type as object)
  );
}

/**
 * Wrap content-section children in a Bootstrap-style `.row` with each block
 * inside `<div class="col-md-{width}">`. Mirrors the Kajabi
 * `snippets/block.liquid` markup so multi-column layouts (features, cards,
 * pricing) reflow correctly in the live preview iframe.
 *
 * Non-block children (raw JSX) are passed through unwrapped to avoid
 * disrupting any caller that injects layout helpers directly.
 */
function wrapContentChildren(children: ReactNode): ReactNode {
  const wrapped: ReactNode[] = [];
  const counter = { i: 0 };

  // Kajabi's Bootstrap row gutter is ~30px total (15px each side). We use a
  // flex `gap` for both row + column gutters and subtract it from the column
  // basis so 2×col-6 / 3×col-4 / 4×col-3 still tile without overflow.
  const COL_GAP = 0;
  const ROW_GAP = 28;

  function pushCol(width: string, content: ReactNode) {
    const w = Number(width) || 12;
    const basis = `calc(${(w / 12) * 100}% - ${COL_GAP}px)`;
    wrapped.push(
      <div
        key={`col-${counter.i++}`}
        className={`col-md-${w}`}
        style={{
          flex: `0 0 ${basis}`,
          maxWidth: basis,
          // Center each column horizontally when it's narrower than full row.
          // Kajabi adds mx-auto via Bootstrap; we replicate it with margin auto
          // so single-block rows (e.g. a width=8 accordion) center like Kajabi.
          marginLeft: w < 12 ? 'auto' : undefined,
          marginRight: w < 12 ? 'auto' : undefined,
          boxSizing: 'border-box',
        }}
      >
        {content}
      </div>,
    );
  }

  function visit(node: ReactNode) {
    Children.forEach(node, (child) => {
      if (isValidElement(child) && child.type === Fragment) {
        visit((child.props as { children?: ReactNode }).children);
        return;
      }
      if (isValidElement(child) && (child.props as Record<string, unknown>)?.['data-block-wrapper'] === 'true') {
        const inner = (child.props as { children?: ReactNode }).children;
        const innerEl = Children.toArray(inner).find(isBlockChild) as ReactElement | undefined;
        if (innerEl) {
          pushCol(getBlockColWidth(innerEl), child);
          return;
        }
      }
      if (isBlockChild(child)) {
        pushCol(getBlockColWidth(child), cloneElement(child));
        return;
      }
      if (isValidElement(child)) {
        wrapped.push(<Fragment key={`f-${counter.i++}`}>{child}</Fragment>);
      }
    });
  }

  visit(children);
  return (
    <div
      className="row"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        columnGap: `${COL_GAP}px`,
        rowGap: `${ROW_GAP}px`,
        margin: 0,
      }}
    >
      {wrapped}
    </div>
  );
}

// ---- Allowed block type sets ----

// Source of truth: {% schema %} blocks in
// public/base-theme/streamlined-home.zip → sections/{header,footer,section}.liquid.
// Header schema also allows 'dropdown', 'user', 'hello_bar' — not in our React lib yet.
const HEADER_ALLOWED = new Set(['logo', 'menu', 'cta', 'social_icons']);
const CONTENT_ALLOWED = new Set([
  'text', 'cta', 'code', 'feature', 'image',
  'pricing', 'social_icons', 'accordion', 'video_embed',
  'video', 'card', 'form', 'link_list',
]);
const FOOTER_ALLOWED = new Set(['logo', 'link_list', 'copyright', 'social_icons']);

// ---- Shared style builder for preview ----

function buildSectionStyle(props: SectionLayoutProps): CSSProperties {
  const style: CSSProperties = {};
  if (props.background) style.backgroundColor = props.background;
  if (props.backgroundImage) {
    style.backgroundImage = `url(${props.backgroundImage})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = props.bgPosition ?? 'center';
    if (props.backgroundFixed) style.backgroundAttachment = 'fixed';
  }
  if (props.textColor) style.color = props.textColor;

  const pd = props.paddingDesktop;
  if (pd) {
    style.paddingTop = pd.top ? `${pd.top}px` : undefined;
    style.paddingRight = pd.right ? `${pd.right}px` : undefined;
    style.paddingBottom = pd.bottom ? `${pd.bottom}px` : undefined;
    style.paddingLeft = pd.left ? `${pd.left}px` : undefined;
  }

  // Vertical alignment (content sections)
  if (props.vertical) {
    style.display = 'flex';
    style.flexDirection = 'column';
    style.justifyContent =
      props.vertical === 'top' ? 'flex-start' :
      props.vertical === 'bottom' ? 'flex-end' : 'center';
  }
  if (props.fullHeight) style.minHeight = '100vh';

  return style;
}

function innerStyle(props: SectionLayoutProps): CSSProperties {
  const s: CSSProperties = {
    maxWidth: props.fullWidth ? '100%' : (props.maxWidth ? `${props.maxWidth}px` : '1170px'),
    margin: '0 auto',
    width: '100%',
  };
  if (props.horizontal) {
    s.textAlign = props.horizontal as CSSProperties['textAlign'];
  }
  return s;
}

// ---- HeaderSection ----

type SectionProps = { children?: ReactNode } & SectionLayoutProps;

export const HeaderSection: SectionComponent = (props) => {
  const base = buildSectionStyle(props);
  if (props.sticky) {
    base.position = 'sticky';
    base.top = 0;
    base.zIndex = 40;
  } else if (props.position === 'overlay') {
    base.position = 'absolute';
    base.top = 0;
    base.left = 0;
    base.right = 0;
    base.zIndex = 40;
  }
  const innerH: CSSProperties = {
    ...innerStyle(props),
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    justifyContent:
      props.horizontalAlignment === 'between' ? 'space-between' :
      props.horizontalAlignment === 'around' ? 'space-around' :
      props.horizontalAlignment === 'center' ? 'center' :
      props.horizontalAlignment === 'right' ? 'flex-end' :
      'space-between',
  };
  return (
    <header style={base}>
      <div style={innerH}>{props.children}</div>
    </header>
  );
};
HeaderSection.__kajabiSectionFlavor = 'header';
HeaderSection.__allowedBlockTypes = HEADER_ALLOWED;

// ---- ContentSection ----

export const ContentSection: SectionComponent = (props) => {
  return (
    <section style={buildSectionStyle(props)}>
      <div style={innerStyle(props)}>{wrapContentChildren(props.children)}</div>
    </section>
  );
};
ContentSection.__kajabiSectionFlavor = 'content';
ContentSection.__allowedBlockTypes = CONTENT_ALLOWED;

// ---- FooterSection ----

export const FooterSection: SectionComponent = (props) => {
  const inner: CSSProperties = {
    ...innerStyle(props),
    display: 'flex',
    flexDirection: props.verticalLayout ? 'column' : 'row',
    gap: props.verticalLayout ? 24 : 32,
    alignItems: props.verticalLayout ? 'center' : 'flex-start',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  };
  return (
    <footer style={buildSectionStyle(props)}>
      <div style={inner}>{props.children}</div>
    </footer>
  );
};
FooterSection.__kajabiSectionFlavor = 'footer';
FooterSection.__allowedBlockTypes = FOOTER_ALLOWED;
