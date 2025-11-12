export function hasHashFormat(ref: string): boolean {
  return /^[a-fA-F0-9]{40}$/.test(ref)
}
