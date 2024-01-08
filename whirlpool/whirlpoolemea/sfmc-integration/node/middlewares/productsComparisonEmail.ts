import { json } from 'co-body'
import { productsMapperObject, htmlGenerator } from '../utils/prodComp.mapper'
import { whiteSpaceFieldCleaner, isValid } from "../utils/functions";
import { GCPSettings } from "../typings/config";

/*

bodyRequest contains:
{
  email: value
  skuIds: [id1,..,id4] --> at leat 2 max 4
  specificationsAvoided: [spec1, ..., specN]
}

*/

export async function productsComparisonEmail(ctx: Context, next: () => Promise<any>) {
  ctx.res.setHeader('Content-Type', 'application/json;charset=UTF-8')
  let bodyRequest = ctx.state.productComparisonReq ?? await json(ctx.req);
  let email: string = bodyRequest.email
  let specToAvoid: any = bodyRequest.specificationsAvoided
  let userName: string = ""
  let userSurname: string = ""


  if (isValid(email)) {

    try {
      //taking name and surname from DB
      let userData: any = await ctx.clients.masterdata.searchDocuments<any>({
        dataEntity: 'CL',
        fields: ['firstName', 'lastName'],
        pagination: {
          page: 1,
          pageSize: 1,
        },
        where: `email=${email}`,
      })

      if (userData.length > 0) {

        userName = isValid(userData[0].firstName) ? userData[0].firstName : "no-name"
        userSurname = isValid(userData[0].lastName) ? userData[0].lastName : "no-surname"


      } else {

        userName = isValid(bodyRequest.firstName) ? bodyRequest.firstName : "no-name"
        userSurname = isValid(bodyRequest.lastName) ? bodyRequest.lastName : "no-surname"

      }

      ctx.state.logger.info("[Products comparison] - get request from -- name: " + userName + ", surname: " + userSurname + ", request body: " + JSON.stringify(bodyRequest));

      let res: any = await productsComparison(ctx, bodyRequest, email, userName, userSurname, specToAvoid)

      ctx.status = res.status
      ctx.body = {
        status: res.status,
        message: res.message,
      }

    } catch (err) {
      let error
      if (err.response == undefined) {
        error = {
          status: err.status,
          message: err.message != undefined ? err.message : 'Bad Request',
          information: err.name != undefined ? err.name : err.message,
        }
      } else {
        error = {
          status: err.response.status,
          message:
            err.response.data != '' ? typeof err.response.data === 'object' ? err.response.data.message : err.response.data : err.response.statusText, information: err.name,
        }
      }
      ctx.status = 500
      ctx.body = error
      ctx.state.logger.error(error);
    }
  } else {
    ctx.status = 400
    ctx.state.logger.error(`[Products Comparison] - Empty (or bad) query email param`);
    ctx.body = {
      status: ctx.status,
      message: 'Empty (or bad) query email param',
    }
  }

  await next()
}


export async function productsComparison(ctx: Context, bodyRequest: any, email: string, userName: string, userSurname: string, specToAvoid: Object) {
  let payloadToGCP: any
  let compProdHTMLbase64: string = ""
  let comparedProducts: any
  let skuIds = bodyRequest.skuIds
  let gcpSettings: GCPSettings = ctx.state.appSettings.gcp!;

  //clean some "" fields on the array
  skuIds = whiteSpaceFieldCleaner(skuIds)


  //get of products comparation values.  Products should be min. 2 and max 4
  if (skuIds.length >= 2 && skuIds.length <= 4) {

    //mapping of the products object
    comparedProducts = await productsMapperObject(ctx, skuIds, specToAvoid);


    if (comparedProducts != undefined) {
      //generate the html(utf-8) converted in base64
      compProdHTMLbase64 = htmlGenerator(ctx, comparedProducts)
    } else {
      ctx.state.logger.error(`[Products Comparison] - Error occurs on products comparison object mapping`);
      return {
        status: 500,
        message: `Error occurs on products comparison object mapping`
      }
    }


    if (compProdHTMLbase64 != undefined) {

      payloadToGCP = {
        SubscriberKey: email,
        EmailAddress: email,
        Name: userName,
        Surname: userSurname,
        Product1: comparedProducts.refIds[0] != undefined ? comparedProducts.refIds[0] : " ", //refId1
        Product2: comparedProducts.refIds[1] != undefined ? comparedProducts.refIds[1] : " ", //refId2
        Product3: comparedProducts.refIds[2] != undefined ? comparedProducts.refIds[2] : " ", //refId3
        Product4: comparedProducts.refIds[3] != undefined ? comparedProducts.refIds[3] : " ", //refId4
        DateAdded: new Date().toISOString(),
        Country: gcpSettings.gcpCountryParams, //ex. "FR"
        Brand: gcpSettings.gcpBrandParams, //ex. "whirlpool" or "whirlpool,hotpoint,.."
        Html_base64: compProdHTMLbase64
      }

      //ctx.state.logger.info("[Products Comparison] - this is the payload generate by VTEX ready to be sent to GCP :" + JSON.stringify(payloadToGCP));

      try {

        let response: any
        await ctx.clients.GCP.triggerProductComparison(payloadToGCP)
          .then(res => {
            if (!res.ignore) {
              ctx.state.logger.info("[Products Comparison] - " + res.message);
            }
            response = {
              status: res.status,
              message: "Product comparison GCP notification correctly sent"
            }
          })
          .catch(err => {
            let errorMessage = err.message != undefined ? err.message : ("GCP notification failed -- err: " + JSON.stringify(err));
            ctx.state.logger.error("[Products Comparison] - " + errorMessage);
            response = {
              status: err.status,
              message: errorMessage
            }
          });

        return response

      } catch (err) {
        ctx.state.logger.error(err.status == 403 ? ("[Products Comparison] - unknown notification -- err: " + JSON.stringify(err)) : ("unknown error -- details: " + JSON.stringify(err)));
        return {
          status: err.status != undefined ? err.status : 500,
          message: err.message != undefined ? err.message : "Internal Server Error"
        }
      }

    } else {
      ctx.state.logger.error(`[Products Comparison] - Error occurs on html generation`);
      return {
        status: 500,
        message: `Error occurs on html generation`
      }
    }

  } else {
    ctx.state.logger.error(`[Products Comparison] - Error params: products comapared should be min. 2 and max. 4.`);
    return {
      status: 500,
      message: `Error params: products comapared should be min. 2 and max. 4.`
    }
  }
}
