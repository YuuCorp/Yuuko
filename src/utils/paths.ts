import path from "path";

/**
 * Resolves a path relative to the project's src/ directory.
 * @example srcPath("commands", "anime.ts") // => "/.../src/commands/anime.ts"
 */
export function srcPath(...segments: string[]): string {
  return path.join(import.meta.dir, "..", ...segments);
}
