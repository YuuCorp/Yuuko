import { Buffer } from "node:buffer";

/**
 * Decodes a JWT's header and payload from base64 without verifying the
 * signature. Use only for inspection (e.g. checking expiry), never for trust.
 * @example decodeJWT(token).payload.exp // => 1735689600
 */
export function decodeJWT(JWT: string) {
    const splitJWT = JWT.split(".");
    const decodeBase64 = (a: string) => Buffer.from(a, "base64").toString()
    const header = JSON.parse(decodeBase64(splitJWT[0]!)) as JWTHeader;
    const payload = JSON.parse(decodeBase64(splitJWT[1]!)) as JWTPayload;

    return { header, payload };
}

export type JWTHeader = {
    typ: string,
    alg: string,
    jti: string,
}

export type JWTPayload = {
    aud: string,
    jti: string,
    iat: number,
    nbf: number,
    exp: number,
    sub: string,
    scopes: string[];
}
