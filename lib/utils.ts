export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}
