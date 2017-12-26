export function format (n, float) {
  return n && (float ? parseFloat(n.toFixed(2)) : n.toFixed(2))
}
