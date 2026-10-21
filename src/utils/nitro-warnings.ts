interface RollupWarningLike {
  code?: string;
  id?: string;
}

/**
 * pdfmake's prebuilt bundle has `/* @__PURE__ *\/` comments in positions Rollup can't use, so every
 * Nitro build logs dozens of INVALID_ANNOTATION warnings. They are harmless: Rollup just drops the hint.
 */
export function isPdfmakeAnnotationWarning(warning: RollupWarningLike) {
  return (
    warning.code === "INVALID_ANNOTATION" &&
    /[\\/]node_modules[\\/]pdfmake[\\/]/.test(warning.id ?? "")
  );
}

/**
 * Wrap a Rollup `onwarn` so pdfmake annotation warnings are dropped while everything else, including
 * Nitro's own filtering, behaves as before.
 */
export function withoutPdfmakeAnnotationWarnings<W extends RollupWarningLike>(
  onwarn: ((warning: W, defaultHandler: (warning: W) => void) => void) | undefined,
) {
  return (warning: W, defaultHandler: (warning: W) => void) => {
    if (isPdfmakeAnnotationWarning(warning)) return;
    if (onwarn) onwarn(warning, defaultHandler);
    else defaultHandler(warning);
  };
}
