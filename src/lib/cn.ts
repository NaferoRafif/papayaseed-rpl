/** Tiny conditional className helper (clsx-style). */
export function cn(
  ...args: Array<string | false | null | undefined>
): string {
  return args.filter(Boolean).join(' ');
}
