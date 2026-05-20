/** Patient-facing clinic site paths (e.g. /smilecare) */
export function clinicPath(slug: string, subpath?: string) {
  const base = `/${slug}`;
  return subpath ? `${base}/${subpath.replace(/^\//, "")}` : base;
}

/** Legacy demo paths — kept for redirects only */
export function legacyDemoPath(slug: string, subpath?: string) {
  const base = `/demo/${slug}`;
  return subpath ? `${base}/${subpath.replace(/^\//, "")}` : base;
}
