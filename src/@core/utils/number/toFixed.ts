export function toFixed(value: number, digit: number = 2): number {
  return parseFloat(value.toFixed(digit));
}
