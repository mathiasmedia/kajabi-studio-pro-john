/**
 * Template registry — maps a templateId to a builder that turns a Site
 * into a `PageTrees` map ready for `exportFromTree`.
 */
import type { ReactNode } from 'react';
import type { Site, TemplateId, PageKey } from './siteStore';
import type { SiteImage } from './imageStore';
import { pixelPerfectTemplate } from '@/templates/pixelPerfect';
import { blankTemplate } from '@/templates/blank';
import { builderProTemplate } from '@/templates/builderPro';
import { coastalCalmTemplate } from '@/templates/coastalCalm';
import { calmLedgerTemplate } from '@/templates/calmLedger';
import { sundayTableTemplate } from '@/templates/sundayTable';
import { quietTrailTemplate } from '@/templates/quietTrail';
import { cookingToOvercomeTemplate } from '@/templates/cookingToOvercome';
import { goMakeADollarTemplate } from '@/templates/goMakeADollar';
import { auticateTemplate } from '@/templates/auticate';

export interface ImageSlotDef {
  key: string;
  label: string;
  description: string;
  defaultPrompt: string;
  aspect?: string;
}

export interface TemplateDef {
  id: TemplateId;
  label: string;
  description: string;
  buildPages: (site: Site, images?: Record<string, SiteImage>) => Record<string, ReactNode>;
  renderPage: (site: Site, page: PageKey, images?: Record<string, SiteImage>) => ReactNode;
  pageKeys: PageKey[];
  imageSlots?: ImageSlotDef[];
  themeSettings?: Record<string, string>;
  customCss?: string;
  fonts?: {
    heading?: string;
    body?: string;
    extras?: string[];
  };
}

export const TEMPLATES: Record<TemplateId, TemplateDef> = {
  'pixel-perfect': pixelPerfectTemplate,
  blank: blankTemplate,
  'builder-pro': builderProTemplate,
  'coastal-calm': coastalCalmTemplate,
  'calm-ledger': calmLedgerTemplate,
  'sunday-table': sundayTableTemplate,
  'quiet-trail': quietTrailTemplate,
  'cooking-to-overcome': cookingToOvercomeTemplate,
  'go-make-a-dollar': goMakeADollarTemplate,
  auticate: auticateTemplate,
};

export function getTemplate(id: TemplateId): TemplateDef {
  return TEMPLATES[id] ?? TEMPLATES.blank;
}

export function listTemplates(): TemplateDef[] {
  return Object.values(TEMPLATES);
}
