/**
 * @example normalize("attack ON   TiTan") => "ATTACK_ON_TITAN"
 */
export function normalize(query: string) {
  return query.toUpperCase().split(/\s+/).join("_");
}
