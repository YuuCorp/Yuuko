export function footer(headers?: Bun.__internal.BunHeadersOverride | null) {
  const footerString = headers ? `Yuuko Beta ( ${`${headers.get('x-ratelimit-remaining') || 0} / ${headers.get('x-ratelimit-limit') || 0}`} )` : `Yuuko Beta`
  return { text: footerString }
}
