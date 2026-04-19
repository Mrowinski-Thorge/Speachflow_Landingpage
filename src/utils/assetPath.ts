const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

export function assetPath(file: string) {
  return `${base}/${file.replace(/^\/+/, '')}`;
}
