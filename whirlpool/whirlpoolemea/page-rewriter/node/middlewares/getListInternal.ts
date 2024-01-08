import { json } from "co-body";
import { ListInternalRequest } from "../typings/request";
import { ListInternalResponse } from "../typings/type";

export async function getListInternal(ctx: Context, next: () => Promise<any>) {

  let listInternalRequest: ListInternalRequest = await json(ctx.req);

  let pageTypeAllowed: string[] = [];
  ctx.state.appSettings.allowedPage.forEach(ap => {
    pageTypeAllowed.push(ap.fromPath);
  })

  try {

    if(listInternalRequest.next == undefined){
      listInternalRequest.next = "";
    }

    let listInternalResponse = await ctx.clients.Rewriter.GetListInternals(listInternalRequest.next);

    let response: ListInternalResponse = {
      next: listInternalResponse.data.internal.listInternals.next,
      routes: listInternalResponse.data.internal.listInternals.routes
    }

    let listFiltered = filterList(response.routes, pageTypeAllowed);

    let message = listFiltered.length == 0 ? "No internal allowed on this page. Insert the next string in the body, to retrieve the next page" : "Insert the next string in the body, to retrieve the next page";

    ctx.body = {
      message: message,
      routes: listFiltered,
      next: response.next
    }

    ctx.status = 200;
    next();

  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      message: ` Error getting the internal list, next string: ${listInternalRequest.next}`
    }
  }

}

//used to return only the internal created by page-rewriter, filter comparing from string to appSettings
function filterList(list: any[], allowedFrom: string[]) {
  let filteredList: any[] = [];
  let pageType = ""

  list.forEach(el => {

    pageType = el.from.split("/")[1];
    if (allowedFrom.includes(pageType)) {
      filteredList.push(el);
    }
  })

  return filteredList
}
