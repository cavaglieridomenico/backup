// import { getMostAskedFaqs } from "../utils/FAQs";
// import { Config } from "../typings/Interfaces";
// export async function mostAskedFaqsMid(ctx: Context, next: () => Promise<any>) {
//   try {
//     ctx.set("Cache-Control", "no-store")
//     let appSettings: Config = await ctx.clients.apps.getAppSettings("" + process.env.VTEX_APP_ID)
//     await getMostAskedFaqs(ctx, appSettings.maxFeatured).then((data) => {
//       ctx.body = data
//       ctx.status = 200;
//     })
//     await next()
//   } catch (e) {
//     ctx.status = 500;
//     ctx.body = 'Internal Server Error';
//   }
// }


// //Resolver GraphQl


// export const mostAskedFaqResolver = async (
//   _: any,
//   { }: any,
//   ctx: any
// ) => {
//   let appSettings: Config = await ctx.clients.apps.getAppSettings("" + process.env.VTEX_APP_ID)
//   return getMostAskedFaqs(ctx, appSettings.maxFeatured)
// }
