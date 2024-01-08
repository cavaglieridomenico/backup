//@ts-ignore
//@ts-nocheck

import { emailMapper, orderDetailsMapper, isValid } from "./orderDetailsAndEmailMapper";
import { UserInputErrore, NotFoundError, AuthenticationError, ForbiddenError } from '@vtex/api';


async function isServedZipCode(ctx: Context, zip: string): Promise<Boolean> {
  return new Promise<any>((resolve, reject) => {
    ctx.clients.masterdata.searchDocuments({ dataEntity: "ZI", fields: ["department", "zipCodeFrom", "zipCodeTo"], pagination: { page: 1, pageSize: 1000 } })
      .then(res => {
        let found = false;
        for (let i = 0; i < res.length && !found; i++) {
          let from = parseInt(res[i].zipCodeFrom);
          let to = parseInt(res[i].zipCodeTo);
          zip = parseInt(zip);
          if (zip >= from && zip <= to) {
            found = true;
          }
        }
        resolve(found);
      })
      .catch(err => {
        reject(err);
      })
  });
}

function alignServiceNames(order: Object, services: string): Object {
  services = services.split(",").map((s: String) => s.trim())
  for (let i = 0; i < order.items.length; i++) {
    for (let j = 0; j < order.items[i].bundleItems.length; j++) {
      for (let service of services) {
        service = service.split("|").map((s: String) => s.trim())
        if (service[0] == order.items[i].bundleItems[j].additionalInfo.offeringTypeId) {
          order.items[i].bundleItems[j].name = service[1];
        }
      }
    }
  }
  return order;
}

export async function createOrCancelOrder(ctx: Context | StatusChangeContext, servicesName: string, key: string, keyMail: string, orderOp: number, id: string, tokenCredential: Object, baseURL: string): Promise<Object> {
  return new Promise<String>(async (resolve, reject) => {
    let accessTokenPromise = new Promise<any>((resolve, reject) => {
      ctx.clients.SFMC.getAccessToken(tokenCredential)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          switch (orderOp) {
            case 0:
              reject({ status: err?.response?.status, message: "Cancel " + id + " - get access token: " + (err?.response?.data?.message != "undefined" ? err?.response?.data?.message : err?.response?.data?.error_description) });
              break;
            case 1:
              reject({ status: err?.response?.status, message: "Create " + id + " - get access token: " + (err?.response?.data?.message != "undefined" ? err?.response?.data?.message : err?.response?.data?.error_description) });
          }
        });
    });
    let orderPromise = new Promise<any>((resolve, reject) => {
      ctx.clients.Vtex.getOrder(id)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          switch (orderOp) {
            case 0:
              reject({ status: err?.response?.status, message: "Cancel " + id + " - get order data: " + JSON.stringify(err?.response?.data).replace(/\\/g, "").replace(/"/g, " ") });
              break;
            case 1:
              reject({ status: err?.response?.status, message: "Create " + id + " - get order data: " + JSON.stringify(err?.response?.data).replace(/\\/g, "").replace(/"/g, " ") });
          }
        });
    });
    try {
      let AccTokOrdResults = await Promise.all([accessTokenPromise, orderPromise]);
      let accessToken = AccTokOrdResults[0].access_token;
      let order = AccTokOrdResults[1].data;
      let skuContextImagesEmailPromises = [];
      let distinctSkus = [];
      order.items.forEach(i => {
        if (!distinctSkus.includes(i.id)) {
          distinctSkus.push(i.id);
        }
      })
      distinctSkus.forEach(s => {
        skuContextImagesEmailPromises.push(new Promise<any>((resolve, reject) => {
          ctx.clients.Vtex.getSkuContext(s)
            .then(res => {
              resolve({ skuId: s, context: res.data });
            })
            .catch(err => {
              switch (orderOp) {
                case 0:
                  reject({ status: err?.response?.status, message: "Cancel " + id + " - get sku context data: " + err?.response?.data });
                  break;
                case 1:
                  reject({ status: err?.response?.status, message: "Create " + id + " - get sku context data: " + err?.response?.data });
              }
            })
        }));
        skuContextImagesEmailPromises.push(new Promise<any>((resolve, reject) => {
          ctx.clients.Vtex.getImages(s)
            .then(res => {
              resolve({ skuId: s, images: res.data });
            })
            .catch(err => {
              switch (orderOp) {
                case 0:
                  reject({ status: err?.response?.status, message: "Cancel " + id + " - get sku images: " + err?.response?.data });
                  break;
                case 1:
                  reject({ status: err?.response?.status, message: "Create " + id + " - get sku images: " + err?.response?.data });
              }
            })
        }));
      })
      skuContextImagesEmailPromises.push(new Promise<any>((resolve, reject) => {
        ctx.clients.Vtex.getEmail(order.clientProfileData.userProfileId)
          .then(res => {
            resolve({ email: res.data[0] });
          })
          .catch(err => {
            switch (orderOp) {
              case 0:
                reject({ status: err?.response?.status, message: "Cancel " + id + " - get customer email: " + err?.response?.data });
                break;
              case 1:
                reject({ status: err?.response?.status, message: "Create " + id + " - get customer email: " + err?.response?.data });
            }
          });
      }));
      let skuContextImagesEmailResponses = await Promise.all(skuContextImagesEmailPromises);
      let skuContexts = skuContextImagesEmailResponses.filter(f => f.context != undefined);
      let skuImages = skuContextImagesEmailResponses.filter(f => f.images != undefined);
      let email = skuContextImagesEmailResponses.find(f => f.email != undefined).email;
      let ecofeeTotal = 0;
      let premiumProducts = [];
      let nPremium = 0;
      order.items.forEach(i => {
        let ecofee = skuContexts.find(f => f.skuId == i.id)?.context?.ProductSpecifications?.find(f => f.FieldName == "ecofee")?.FieldValues[0];
        let premium = skuContexts.find(f => f.skuId == i.id)?.context?.ProductSpecifications?.find(f => f.FieldName == "PRODOTTI PREMIUM")?.FieldValues[0];
        if (isValid(ecofee)) {
          ecofeeTotal = ecofeeTotal + (parseFloat(ecofee) * i.quantity);
        }
        if (premium + "".toLowerCase() == "whirlpool club") {
          nPremium = nPremium + i.quantity;
          if (!premiumProducts.includes(i.productId)) {
            premiumProducts.push(i.productId);
          }
        }
      });
      let coupons = [];
      let zipCouponPromises = [];
      distinctSkus.forEach(s => {
        let sku = order.items.find(f => f.id == s);
        let constructionType = skuContexts.find(f => f.skuId == s)?.context?.ProductSpecifications?.find(f => f.FieldName == "constructionType")?.FieldValues[0];
        if ((constructionType + "").toLowerCase() == "built in") {
          if (sku.bundleItems.find(f => f.additionalInfo.offeringTypeId == "1") != undefined) {
            zipCouponPromises.push({ skuId: sku.id, hasInstallation: true });
            // PL_WHP France zip code
            /*isServedZipCode(ctx, order.shippingData.address.postalCode)
             .then(res => {
               resolve({skuId: sku.id, hasInstallation: res});
             })
             .catch(err => {
               switch(orderOp){
                 case 0:
                   reject({status: err?.response?.status, message: "Cancel "+id+" - get served zip codes: "+err?.response?.data});
                   break;
                 case 1:
                   reject({status: err?.response?.status, message: "Create "+id+" - get served zip codes: "+err?.response?.data});
               }
             });*/
          }
        }
      });
      let couponPromise = new Promise<any>((resolve, reject) => {
        ctx.clients.Vtex.createCoupons(nPremium)
          .then(res => {
            resolve({ coupons: res })
          })
          .catch(err => {
            switch (orderOp) {
              case 0:
                reject({ status: err?.response?.status, message: "Cancel " + id + " - generate coupons: " + err.response?.data })
                break;
              case 1:
                reject({ status: err?.response?.status, message: "Create " + id + " - generate coupons: " + err.response?.data })
            }
          });
      });
      zipCouponPromises.push(couponPromise);
      let zipCouponResponses = await Promise.all(zipCouponPromises);
      coupons = zipCouponResponses.find(f => f.coupons != undefined)?.coupons;
      let zipCodeData = zipCouponResponses.filter(f => f.hasInstallation != undefined);
      for (let i = 0; i < order.items.length; i++) {
        let item = zipCodeData.find(f => f.skuId == order.items[i].id);
        if (item != undefined) {
          if (!item.hasInstallation) {
            order.items[i].bundleItems = order.items[i]?.bundleItems?.filter(f => f.additionalInfo.offeringTypeId != "1");
          }
        }
      }
      // PL_WHP alignServiceNames
      if (servicesName != undefined && servicesName != "") {
        order = alignServiceNames(order, servicesName);
      }
      let orderDetails = orderDetailsMapper(order, ctx, coupons, premiumProducts, skuContexts, skuImages, baseURL);
      let objEmail = emailMapper(order, ctx, ecofeeTotal, email);
      ctx.clients.SFMC.sendOrderDetails(orderDetails, key, accessToken)
        .then(res => {
          ctx.clients.SFMC.triggerEmail(objEmail, keyMail, accessToken)  //unico punto dove manda l'email
            .then(res => {
              if (res.responses[0]?.hasErrors == false) {
                switch (orderOp) {
                  case 0:
                    resolve({ status: 200, message: "Cancel " + id + " - order details / email: data sent -- Payload order details: " + JSON.stringify(orderDetails).replace(/\\/g, "").replace(/"/g, " ") + " -- Payload email: " + JSON.stringify(objEmail).replace(/\\/g, "").replace(/"/g, " ") });
                    break;
                  case 1:
                    resolve({ status: 200, message: "Create " + id + " - order details / email: data sent -- Payload order details: " + JSON.stringify(orderDetails).replace(/\\/g, "").replace(/"/g, " ") + " -- Payload email: " + JSON.stringify(objEmail).replace(/\\/g, "").replace(/"/g, " ") });
                }
              } else {
                switch (orderOp) {
                  case 0:
                    reject({ status: 400, message: "Cancel " + id + " - email: bad request -- Payload order details: " + JSON.stringify(orderDetails).replace(/\\/g, "").replace(/"/g, " ") + " -- Payload email: " + JSON.stringify(objEmail).replace(/\\/g, "").replace(/"/g, " ") });
                    break;
                  case 1:
                    reject({ status: 400, message: "Create " + id + " - email: bad request -- Payload order details: " + JSON.stringify(orderDetails).replace(/\\/g, "").replace(/"/g, " ") + " -- Payload email: " + JSON.stringify(objEmail).replace(/\\/g, "").replace(/"/g, " ") });
                }
              }
            })
            .catch(err => {
              switch (orderOp) {
                case 0:
                  reject({ status: err?.response?.status, message: "Cancel " + id + " - email: " + err?.response?.data?.message + " -- Payload order details: " + JSON.stringify(orderDetails).replace(/\\/g, "").replace(/"/g, " ") + " -- Payload email: " + JSON.stringify(objEmail).replace(/\\/g, "").replace(/"/g, " ") });
                  break;
                case 1:
                  reject({ status: err?.response?.status, message: "Create " + id + " - email: " + err?.response?.data?.message + " -- Payload order details: " + JSON.stringify(orderDetails).replace(/\\/g, "").replace(/"/g, " ") + " -- Payload email: " + JSON.stringify(objEmail).replace(/\\/g, "").replace(/"/g, " ") });
              }
            });
        })
        .catch(err => {
          switch (orderOp) {
            case 0:
              reject({ status: err?.response?.status, message: "Cancel " + id + " - order details: " + err?.response?.data?.message + " -- Payload: " + JSON.stringify(orderDetails).replace(/\\/g, "").replace(/"/g, " ") });
              break;
            case 1:
              reject({ status: err?.response?.status, message: "Create " + id + " - order details: " + err?.response?.data?.message + " -- Payload: " + JSON.stringify(orderDetails).replace(/\\/g, "").replace(/"/g, " ") });
          }
        });
    } catch (err) {
      reject(err);
    }
  });
}
