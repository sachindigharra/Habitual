export function createPageUrl(pageName) {
  return '/' + pageName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}