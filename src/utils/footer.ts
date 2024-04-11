/**
 * Returns the footer string.
 * @param [headers=null] Optional HTTP headers to get the ratelimit values.
 * @returns {object} The footer object.
 */
interface Headers {
  [key: string]: string
  'x-ratelimit-remaining': string
  'x-ratelimit-limit': string
}
export function footer(headers?: Headers | null) {
  const footerString = headers ? `Yuuko Beta ( ${`${headers['x-ratelimit-remaining'] || 0} / ${headers['x-ratelimit-limit'] || 0}`} )` : `Yuuko Beta`
  return { text: footerString }
}
