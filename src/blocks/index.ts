/**
 * Thin re-export. The block library + export pipeline live in the engine
 * package so that fixes auto-propagate via `bun update @k-studio-pro/engine`.
 */
export * from '@k-studio-pro/engine';

import { exportThemeZip, type ExportThemeZipOptions } from '@k-studio-pro/engine';
import type { PageTrees } from '@k-studio-pro/engine';

/**
 * Wrapper for the engine's exportThemeZip that takes a PageTrees map.
 * Kept as a thin shim so existing call sites can keep importing
 * `exportFromTree` from `@/blocks`.
 */
export type ExportFromTreeOptions = ExportThemeZipOptions;

export async function exportFromTree(
  trees: PageTrees,
  options: ExportFromTreeOptions = {},
): Promise<Blob> {
  return exportThemeZip(trees, options);
}

/** Trigger a browser download for a Blob. */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
