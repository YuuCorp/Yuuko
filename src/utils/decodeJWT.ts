export function decodeJWT(JWT: string) {
    const splitJWT = JWT.split(".");
    const decodeBase64 = (a: string) => Buffer.from(a, "base64").toString()
    const header: JWTHeader = JSON.parse(decodeBase64(splitJWT[0]!));
    const payload: JWTPayload = JSON.parse(decodeBase64(splitJWT[1]!));

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