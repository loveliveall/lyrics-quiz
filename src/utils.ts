export function mod(n: number, m: number) {
  // Always return positive modular
  return ((n % m) + m) % m;
}
