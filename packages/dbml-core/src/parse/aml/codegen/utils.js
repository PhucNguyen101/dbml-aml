export function escapeSpecialCharacter (str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'");
}
