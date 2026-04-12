/**
 * Builds the standard embed footer. If GraphQL response headers are passed,
 * the footer also surfaces AniList's current rate-limit status.
 * @example footer() // => { text: "Yuuko Beta" }
 * @example footer(headers) // => { text: "Yuuko Beta ( 88 / 90 )" }
 */
export function footer(headers?: Bun.__internal.BunHeadersOverride | null) {
  const footerString = headers ? `Yuuko Beta ( ${`${headers.get('x-ratelimit-remaining') || 0} / ${headers.get('x-ratelimit-limit') || 0}`} )` : `Yuuko Beta`
  return { text: footerString }
}
