import { VBaseBucket } from "./constants";

export async function wait(time: number): Promise<Boolean> {
  return new Promise<Boolean>((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time);
  });
}

export function getIdByFromString(fromString: string) {

  let id = fromString.replace(/\//g, "-").substring(1, fromString.length)

  return id
  
}

export function isValid(param: any): Boolean {
  return param != undefined && param != null && param != "undefined" && param != "null" && param != "" && param != " " && param != "-" && param != "_";
}

export async function saveQueryParameter(ctx: Context, key: string, body: any) {


  console.log()
  await ctx.clients.vbase.saveJSON(VBaseBucket, key, body);




}

export async function getQueryParameters(ctx: Context, key: string): Promise<string> {
  let response:any = await ctx.clients.vbase.getJSON(VBaseBucket, key, true);

  response = JSON.stringify(response)
  return response
}
