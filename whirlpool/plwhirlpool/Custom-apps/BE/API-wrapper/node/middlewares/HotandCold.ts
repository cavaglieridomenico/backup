import { GetLoggedUserEmail } from "../utils/CommonFunctions";
export async function getHotnCold(ctx: Context, next: () => Promise<any>) {
  try {
    ctx.set("Cache-Control", "no-store");
    let isHot: any;
    let userEmail = await GetLoggedUserEmail(ctx);
    console.log(userEmail)
    let data = await ctx.clients.vtexAPI.GetUserFidelity(userEmail);
    console.log(data)
    if (!data.list[0]) {
      isHot = "prospect";
    }
    else {
      if (!data.list[0].creationDate) {
        isHot = "prospect";
      } else {
        let getDate = data.list[0].creationDate;
        let creationDate = new Date(getDate);
        const today = new Date();
        let diff = today.getTime() - creationDate.getTime();
        let diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if(isHot = diffDays <= 365){
          isHot="hot customer"
        }else{
          isHot="cold customer"
        }
      }
    }
    let obj = {
      "UserType": isHot
    }
    ctx.body = obj;
    console.log(ctx.body)
    ctx.status = 200;
    await next()
  } catch (e) {
    console.error(e);

    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}

