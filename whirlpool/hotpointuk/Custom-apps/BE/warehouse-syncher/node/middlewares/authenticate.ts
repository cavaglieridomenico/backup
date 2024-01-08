import { DigestAuthorization } from "../typings/digestAuthorization";
import { HashAlgorithm } from "../typings/hash";
import { AES256Decode, hash } from "../utils/cryptography";
import { DigestAuth } from "../utils/DigestAuth";

export async function authenticate(ctx: Context, next: () => Promise<any>) {
  try {
    let enabledCredentials = ctx.state.appSettings.vtex.allowedCredentials?.split(";") ?? [];
    if (VtexAuthentication(enabledCredentials, ctx) || DigestAuthentication(enabledCredentials, ctx)) {
      await next();
    } else {
      ctx.status = 401;
      ctx.body = "Invalid Credentials";
    }
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

function VtexAuthentication(credentials: string[], ctx: Context): boolean {
  try {
    return credentials.find(c => c?.split(":")[0]?.toLowerCase() == ctx.get("X-VTEX-API-AppKey")?.toLowerCase() && c?.split(":")[1] == hash(ctx.get('X-VTEX-API-AppToken'), HashAlgorithm.SHA_512_256)) ? true : false;
  } catch (err) {
    return false;
  }
}

function DigestAuthentication(credentials: string[], ctx: Context): boolean {
  try {
    let authHeader = parseDigestAuthorizationHeader(ctx.get("Authorization"));
    let authDetails: { realm: string, algorithm: string, psw: string } = JSON.parse(AES256Decode(credentials.find(c => c?.split(":")[0]?.toLowerCase() == authHeader.username?.toLowerCase())?.split(":")[1]));
    let digestAuth = new DigestAuth();
    let digest = digestAuth.computeDigest(authHeader.username!, authDetails.psw, authDetails.realm, ctx.req.method!, ctx.url, authHeader.nonce!, authDetails.algorithm);
    return digest == authHeader.response;
  } catch (err) {
    return false;
  }
}

function parseDigestAuthorizationHeader(header: string): DigestAuthorization {
  let headerSlices = header?.split("Digest")[1]?.trim()?.split(",");
  let authHeader: DigestAuthorization = {};
  headerSlices?.forEach(s => {
    let slices = s.trim().split("=");
    switch (slices[0]) {
      case "username":
        authHeader.username = slices[1].substring(1, slices[1].length - 1);
        break;
      case "realm":
        authHeader.realme = slices[1].substring(1, slices[1].length - 1);
        break;
      case "uri":
        authHeader.uri = slices[1].substring(1, slices[1].length - 1);
        break;
      case "nonce":
        authHeader.nonce = slices[1].substring(1, slices[1].length - 1);
        break;
      case "algorithm":
        authHeader.algorithm = slices[1].substring(1, slices[1].length - 1);
        break;
      case "response":
        authHeader.response = slices[1].substring(1, slices[1].length - 1);
        break;
    }
  })
  return authHeader;
}
