//@ts-nocheck

import { localeMap, currencyToSymbol } from "../utils/constants";
import { Invoice, Order, InvoiceSection } from "../typings/InvoiceSection";
import { getInvoiceName, isValid } from "../utils/functions";

//supposing to receive a page number as query parameter and an authentication cookie
export async function getInvoices(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-store');
  try{
    if(isValid(ctx.query.page)){
      process.env.WRAPPER = JSON.stringify(await ctx.clients.apps.getAppSettings(process.env.VTEX_APP_ID+""));
      let authToken = ctx.cookies.get(JSON.parse(process.env.WRAPPER).authcookie);
      let email = (await ctx.clients.AuthUser.GetLoggedUser(authToken)).user;
      let userOrders = (await ctx.clients.vtexAPI.getOrdersByEmail(email, ctx.query.page, 15)).data;
      let invoicePromises = [];
      userOrders.list?.forEach(o => {
        invoicePromises.push(new Promise((resolve,reject) => {
          ctx.clients.masterdata.searchDocuments({dataEntity: "IN", fields: ["id","orderId","invoiceName","invoiceContent"], where: "orderId="+o.orderId, pagination: {page: 1, pageSize: 100}, sort: "createdIn DESC"})
          .then(res => {
            if(res.length==0){
              resolve({orderId: o.orderId, invoices: []})
            }else{
              resolve({orderId: o.orderId, invoices: res});
            }
          })
          .catch(err => {
            reject(err);
          })
        })
        )
      })
      let invoices = await Promise.all(invoicePromises);
      let response: InvoiceSection = {
        orders: [],
        totalOrders: userOrders.paging.total,
        currentPage: userOrders.paging.currentPage,
        ordersPerPage: userOrders.paging.perPage,
        totalPages: userOrders.paging.pages
      }
      userOrders.list?.forEach(o => {
        let currOrder: Order = {
          id: o.orderId,
          path: "/account/#/orders/"+o.orderId,
          creationDate: formatDate(ctx, o.creationDate),
          total: formatTotal(o.totalValue+"", o.currencyCode),
          invoices: []
        }
        let orderInvoices = invoices.find(f => f.orderId==o.orderId);
        orderInvoices?.invoices?.forEach(i => {
          let currInvoice: Invoice = {
            id: i.id,
            path: "/_v/wrapper/api/invoice?id="+i.id,
            name: getInvoiceName(ctx, i.invoiceName)
          }
          currOrder.invoices.push(currInvoice);
        })
        response.orders.push(currOrder);
      })
      ctx.status = 200;
      ctx.body = response;
    }else{
      ctx.status = 400;
      ctx.body = "Bad request";
    }
  }catch(err){
    //console.log(err)
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next()
}

function formatDate(ctx: Context, date: string): string{
  return new Date(date).toLocaleDateString(localeMap[ctx.vtex.account], {day: "numeric", month: "long", year: "numeric"});
}

function formatTotal(total: string, currency: string): string{
  let a = total.substring(0,total.length-2);
  let b = total.substring(total.length-2, total.length);
  return a+","+b+" "+currencyToSymbol[currency];
}
