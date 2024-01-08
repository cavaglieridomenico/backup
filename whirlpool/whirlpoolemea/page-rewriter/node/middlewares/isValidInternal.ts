import { json } from "co-body";
import { CreateRequest, DeleteRequest } from "../typings/request";
import { isValid } from "../utils/functions";

export async function createInternalCheck(ctx: Context, next: () => Promise<any>) {

  let createInternalRequest: CreateRequest = await json(ctx.req);
  ctx.state.createInternalRequest = createInternalRequest;

  if (isValid(createInternalRequest.from) && isValid(createInternalRequest.resolveAs) && isAllowedCreateReq(ctx)) {
    await next();
  } else {
    ctx.status = 400;
    ctx.body = " Error creating internal: -Invalid request for From string => " + createInternalRequest.from + " resolveAs => " + createInternalRequest.resolveAs;
  }

}

export async function deleteInternalCheck(ctx: Context, next: () => Promise<any>) {

  let deleteInternalRequest: DeleteRequest = await json(ctx.req);
  ctx.state.deleteInternalRequest = deleteInternalRequest;

  if (isValid(ctx.state.deleteInternalRequest.from) && isAllowedDeleteReq(ctx)) {
    await next()
  } else {
    ctx.status = 400;
    ctx.body = " Error deleting internal: -Invalid request for From string => " + deleteInternalRequest.from;
  }

}

//return true if the from string and the resolveAs are correct compared to appSettings (allowed from and resolveAs)
function isAllowedCreateReq(ctx: Context): Boolean {

  let isValidReq = false;

  let from = ctx.state.createInternalRequest!.from;
  let resolveAs = ctx.state.createInternalRequest!.resolveAs;

  let fromSplitted = from.split("/");
  let resolveAsSplitted = resolveAs.split("/");

  if (fromSplitted[0] == "" && isValid(fromSplitted[1]) && resolveAsSplitted[0] == "" && !isValid(resolveAsSplitted[2])) {
    ctx.state.appSettings.allowedPage.forEach(el => {
      if (el.fromPath == fromSplitted[1] && el.resolveAsPath.includes(resolveAsSplitted[1])) {
        isValidReq = true;
      }
    })
  }

  return isValidReq;
}

//return true if the from string is correct compared to appSettings (allowed from)
function isAllowedDeleteReq(ctx: Context): Boolean {

  let isValidReq = false;

  let from = ctx.state.deleteInternalRequest!.from;
  let fromSplitted = from.split("/");

  if (fromSplitted[0] == "" && isValid(fromSplitted[1])) {
    ctx.state.appSettings.allowedPage.forEach(el => {
      if (el.fromPath == fromSplitted[1]) {
        isValidReq = true;
      }
    })
  }

  return isValidReq;
}


