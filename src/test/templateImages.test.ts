/**
 * Guardrail: template files must never reference bundler-local image paths.
 *
 * Kajabi exports run outside the Lovable preview, so any image URL that only
 * resolves through Vite (e.g. `import hero from '@/assets/foo.jpg'`) will be
 * a dead link in the exported theme. All template imagery must be a public
 * URL (Supabase `site-images` bucket, another https CDN, or a SiteImage slot
 * resolved at render time).
 *
 * See AGENTS.md §4.5.
 */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const TEMPLATES_DIR = join(process.cwd(), 'src', 'templates');

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (['.ts', '.tsx'].includes(extname(entry))) out.push(full);
  }
  return out;
}

const FORBIDDEN_IMPORT = /^\s*import\s+[^;]*?from\s+['"](?:@\/assets\/|\.{1,2}\/assets\/|\/assets\/|\/src\/)[^'"]+['"]/m;
const FORBIDDEN_URL_LITERAL = /['"`](?:blob:|data:image\/|\/src\/|lovableproject\.com|lovable\.app|localhost(?::\d+)?\/)/;

describe('template imagery guardrail', () => {
  const files = walk(TEMPLATES_DIR);

  it('finds template files', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of files) {
    const rel = file.replace(process.cwd() + '/', '');
    it(`${rel} has no bundler-local asset imports or URLs`, () => {
      const src = readFileSync(file, 'utf8');

      const importMatch = src.match(FORBIDDEN_IMPORT);
      expect(
        importMatch,
        `${rel} imports a bundler-local asset (${importMatch?.[0]}). ` +
          `Template imagery must be a public URL — see AGENTS.md §4.5.`,
      ).toBeNull();

      // Strip line comments before scanning for URL literals so docs/examples
      // in comments don't trip the check.
      const codeOnly = src
        .split('\n')
        .map((line) => line.replace(/\/\/.*$/, ''))
        .join('\n');
      const urlMatch = codeOnly.match(FORBIDDEN_URL_LITERAL);
      expect(
        urlMatch,
        `${rel} contains a non-public image URL (${urlMatch?.[0]}). ` +
          `Use a Supabase site-images URL or an image slot — see AGENTS.md §4.5.`,
      ).toBeNull();
    });
  }
});
