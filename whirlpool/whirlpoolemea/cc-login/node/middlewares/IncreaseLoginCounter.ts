import { CLRecord } from "../typings/MasterData";
import { CLEntityFields, CLEntityName } from "../utils/constants";
import { searchDocuments, updatePartialDocument } from "../utils/documentCRUD";

export async function IncreaseLoginCounter(ctx: Context, next: () => Promise<any>) {
  try {
    if (ctx.state.userData && ctx.state.userData.id) {
      // The user has already completed the registration (resetPassword or login)
      const currentLoginCounter = ctx.state.userData.loginCounter || 0;
      await updatePartialDocument(ctx, CLEntityName, ctx.state.userData.id, {loginCounter: currentLoginCounter + 1});
    } else {
      // The user is currently completing the registration
      const userData = await getRegisteredUserData(ctx, ctx.state.req!.email!);
      await updatePartialDocument(ctx, CLEntityName, userData!.id!, {loginCounter: 1});
    }
    await next();
  } catch(err) {
    ctx.state.llLogger.error({ status: 500, message: "Failed to update login counter" });
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
}

async function getRegisteredUserData(ctx: Context, userEmail: string): Promise<CLRecord> {
  return new Promise<CLRecord>((resolve,reject) => {
    searchDocuments(ctx, CLEntityName, CLEntityFields, "email="+userEmail, {page: 1, pageSize: 100}, [])
    .then(res => {
      if (res.length>0) {
        resolve(res[0]);
      } else {
        reject({code: 404, msg: "Email not found"});
      }
    })
    .catch(err => reject(err));
  })
}