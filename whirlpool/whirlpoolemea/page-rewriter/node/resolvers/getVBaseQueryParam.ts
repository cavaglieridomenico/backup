import { getQueryParameters } from "../utils/functions";

//useful to retrieve query parameters by VBase, passing the from string
export const getVBaseQueryParam_resolver = async (_: any, { from }: any, ctx: any) => {

  let payload;
  try {
    payload = await getQueryParameters(ctx, from)
  } catch (error) {
    ctx.body = "Error getting query parameters: " + error;
    ctx.status = 500;
  }

  //we need to stringify the payload to return a string
  payload = JSON.stringify(payload);

  return payload
}
