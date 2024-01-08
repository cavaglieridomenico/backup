//@ts-nocheck
//@ts-ignore

import ApiConfig from '../clients/SFMC'
import { mapperMail, orderMapperLoad } from "./mapper.json";
import { UserInputErrore, NotFoundError, AuthenticationError, ForbiddenError } from '@vtex/api';
import { catalogSalesforce } from "../clients/maping.saleforce.catalog";
import { CustomLogger, Logger } from "../utils/Logger";

let tockenCredential = {
  grant_type: '',
  client_id: '',
  client_secret: ''
}

export async function callSalesforceTokenApi(ctx: any, options: {}, key: string, keyMail: string, id: string, orderOp: number): Promise<Object> {
  return new Promise<String>(async function (resolve, reject) {
    tockenCredential.grant_type = JSON.parse(process.env.TEST + "").granttype;
    tockenCredential.client_id = JSON.parse(process.env.TEST + "").clientid;
    tockenCredential.client_secret = JSON.parse(process.env.TEST + "").clientsecret;
    let tokenJason = "";
    ctx.vtex.logger = new CustomLogger(ctx);
    await ctx.clients.SfmcAPI.getToken(tockenCredential)
      .then(res => {
        ctx.vtex.logger.info(`[SALESFORCE TOKEN ${orderOp == 0 ? 'ORDER CANCELLATION' : 'ORDER CONFIRMATION'}] ${id} - ${JSON.stringify(res).replace(/\\/g, "").replace(/"/g, " ")}`)
        tokenJason = res.access_token;
      })
      .catch(err => {
        switch (orderOp) {
          case 0:
            reject({ status: err?.response?.status, message: "Cancel " + id + " - get access token: " + (err?.response?.data?.message != undefined ? err?.response?.data?.message : err?.response?.data?.error_description) });
            break;
          case 1:
            reject({ status: err?.response?.status, message: "Create " + id + " - get access token: " + (err?.response?.data?.message != undefined ? err?.response?.data?.message : err?.response?.data?.error_description) });
        }
        tokenJason = undefined;
      });
    if (tokenJason != undefined) {
      await postOrderPram(ctx, key, keyMail, tokenJason, id, orderOp)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    }
  });
}

async function isPremium(item: any, ctx: any): Promise<any> {
  return new Promise<any>(async function (resolve, reject) {
    try {
      let prodSpecs = (await ctx.clients.Vtex.getSpecification(item.productId)).data;
      let premium = prodSpecs.find(f => f.Name == "PRODOTTI PREMIUM")?.Value[0];
      if (premium != undefined && premium == "Whirlpool Club") {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
}

async function generateMultipleCoupon(data: any, ctx: any): Promise<any> {
  return new Promise<any>(async function (resolve, reject) {
    try {
      let couponArray = [];
      let premiumArray = [];
      let nCoupon = 0;
      for (let item of data.items) {
        let bool = await isPremium(item, ctx);
        if (bool == true) {
          premiumArray.push(item.productId);
          nCoupon = nCoupon + item.quantity;
        }
      }
      if (nCoupon > 0) {
        couponArray = await ctx.clients.Vtex.createmulipleCoupon(nCoupon);
      }
      resolve({ coupon: couponArray, premium: premiumArray });
    } catch (e) {
      reject({ status: e?.response?.status, message: e?.response?.data });
    }
  });
}

export async function postOrderPram(ctx: any, key: string, keyMail: string, tokenPass: string, id: string, orderOp: number): Promise<Object> {
  return new Promise<String>(async function (resolve, reject) {
    const options = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${tokenPass}`,
      }
    }
    let order = {};
    ctx.vtex.logger = new CustomLogger(ctx)
    await ctx.clients.Vtex.getOrder(id)
      .then(res => {
        order = res;
      })
      .catch(err => {
        switch (orderOp) {
          case 0:
            reject({ status: err?.response?.status, message: "Cancel " + id + " - get order data: " + JSON.stringify(err?.response?.data).replace(/\\/g, "").replace(/"/g, " ") });
            break;
          case 1:
            reject({ status: err?.response?.status, message: "Create " + id + " - get order data: " + JSON.stringify(err?.response?.data).replace(/\\/g, "").replace(/"/g, " ") });
        }
        order = undefined;
      });
    if (order != undefined) {
      let host = ctx.vtex.host == undefined ? ctx.vtex.account + ".myvtex.com" : ctx.vtex.host;
      let coupon = [];
      let premium = [];
      await generateMultipleCoupon(order, ctx)
        .then(res => {
          coupon = res.coupon;
          premium = res.premium;
        })
        .catch(err => {
          switch (orderOp) {
            case 0:
              reject({ status: err.status, message: "Cancel " + id + " - generate coupons: " + err.message });
              break;
            case 1:
              reject({ status: err.status, message: "Create " + id + " - generate coupons: " + err.message });
          }
          coupon = undefined;
        });
      if (coupon != undefined) {
        let services = JSON.parse(process.env.TEST + "").additionalServices.generalInfo;
        let orders = [];
        await orderMapperLoad(order, host, ctx, coupon, premium, services)
          .then(res => {
            orders = res;
          })
          .catch(err => {
            switch (orderOp) {
              case 0:
                reject({ status: err.status, message: "Cancel " + id + " - mapping order details: " + err.message });
                break;
              case 1:
                reject({ status: err.status, message: "Create " + id + " - mapping order details: " + err.message });
            }
            orders = undefined;
          });
        if (orders != undefined) {
          let orderDetailRes = "";
          await ctx.clients.SfmcAPI.passedParam(orders, key, tokenPass)
            .then(async (value: any) => {
              ctx.vtex.logger.info(`[PASSED PARAM ${orderOp == 0 ? 'ORDER CANCELLATION' : 'ORDER CONFIRMATION'}] ${id} - ${JSON.stringify(value).replace(/\\/g, "").replace(/"/g, " ")}`)
            })
            .catch(err => {
              switch (orderOp) {
                case 0:
                  reject({ status: err?.response?.status, message: "Cancel " + id + " - order details: " + err?.response?.data?.message + " -- Payload: " + JSON.stringify(orders).replace(/\\/g, "").replace(/"/g, " ") });
                  break;
                case 1:
                  reject({ status: err?.response?.status, message: "Create " + id + " - order details: " + err?.response?.data?.message + " -- Payload: " + JSON.stringify(orders).replace(/\\/g, "").replace(/"/g, " ") });
              }
              orderDetailRes = undefined;
            });
          if (orderDetailRes != undefined) {
            let emailJson = "";
            await ctx.clients.Vtex.getEmail(order.clientProfileData.userProfileId)
              .then(res => {
                emailJson = res.data[0];
              })
              .catch(err => {
                switch (orderOp) {
                  case 0:
                    reject({ status: err?.response?.status, message: "Cancel " + id + " - get cusomer email: " + err?.response?.data });
                    break;
                  case 1:
                    reject({ status: err?.response?.status, message: "Create " + id + " - get customer email: " + err?.response?.data });
                }
                emailJson = undefined;
              });
            if (emailJson != undefined) {
              let objEmail = mapperMail(order, emailJson, ctx);
              await ctx.clients.SfmcAPI.sendEmail(objEmail, keyMail, tokenPass)
                .then(res => {
                  ctx.vtex.logger.info(`[SEND EMAIL ${orderOp == 0 ? 'ORDER CANCELLATION' : 'ORDER CONFIRMATION'}] ${id} - ${JSON.stringify(res).replace(/\\/g, "").replace(/"/g, " ")}`)
                  if (res.responses[0]?.hasErrors == false) {
                    switch (orderOp) {
                      case 0:
                        resolve({ status: 200, message: "Cancel " + id + " - order details / email: data sent -- Payload order details: " + JSON.stringify(orders).replace(/\\/g, "").replace(/"/g, " ") + " -- Payload email: " + JSON.stringify(objEmail).replace(/\\/g, "").replace(/"/g, " ") });
                        break;
                      case 1:
                        resolve({ status: 200, message: "Create " + id + " - order details / email: data sent -- Payload order details: " + JSON.stringify(orders).replace(/\\/g, "").replace(/"/g, " ") + " -- Payload email: " + JSON.stringify(objEmail).replace(/\\/g, "").replace(/"/g, " ") });
                    }
                  } else {
                    switch (orderOp) {
                      case 0:
                        reject({ status: 400, message: "Cancel " + id + " - email: bad request -- Payload order details: " + JSON.stringify(orders).replace(/\\/g, "").replace(/"/g, " ") + " -- Payload email: " + JSON.stringify(objEmail).replace(/\\/g, "").replace(/"/g, " ") });
                        break;
                      case 1:
                        reject({ status: 400, message: "Create " + id + " - email: bad request -- Payload order details: " + JSON.stringify(orders).replace(/\\/g, "").replace(/"/g, " ") + " -- Payload email: " + JSON.stringify(objEmail).replace(/\\/g, "").replace(/"/g, " ") });
                    }
                  }
                })
                .catch(err => {
                  switch (orderOp) {
                    case 0:
                      reject({ status: err?.response?.status, message: "Cancel " + id + " - email: " + err?.response?.data?.message + " -- Payload order details: " + JSON.stringify(orders).replace(/\\/g, "").replace(/"/g, " ") + " -- Payload email: " + JSON.stringify(objEmail).replace(/\\/g, "").replace(/"/g, " ") });
                      break;
                    case 1:
                      reject({ status: err?.response?.status, message: "Create " + id + " - email: " + err?.response?.data?.message + " -- Payload order details: " + JSON.stringify(orders).replace(/\\/g, "").replace(/"/g, " ") + " -- Payload email: " + JSON.stringify(objEmail).replace(/\\/g, "").replace(/"/g, " ") });
                  }
                });
            }
          }
        }
      }
    }
  });
}

export async function checkTokenEvent(ctx: StatusChangeContext, key: string, keyMail: string, orderOp: number): Promise<Object> {
  let id = ctx.body.orderId;
  return new Promise<String>(async function (resolve, reject) {
    if (id == undefined) {
      reject({ state: 500, message: "Create order: undefined identifier" });
    } else {
      const options = {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
      }
      await callSalesforceTokenApi(ctx, options, key, keyMail, id, orderOp)
        .then(response => {
          resolve(response);
        })
        .catch(err => {
          reject(err);
        });
    }
  });
}

export async function checkToken(ctx: Context, key: string, keyMail: string, orderOp: number): Promise<Object> {
  return new Promise<String>(async function (resolve, reject) {
    let id = ctx.query.id;
    const options = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
    }
    await callSalesforceTokenApi(ctx, options, key, keyMail, id, orderOp)
      .then(response => {
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export async function uploadCatalog(ctx: Context): Promise<Object> {
  return new Promise<Object>(async function (resolve, reject) {
    try {
      let id = ctx.query.id;
      let sku = (await ctx.clients.Vtex.getProductSkuAlternative(id)).data;
      let product = (await ctx.clients.Vtex.getProductSingle(sku.ProductId)).data;
      let availability = product.IsActive && product.IsVisible && sku.ProductSpecifications.find(f => f.FieldName == "sellable")?.FieldValues[0] == "true" && sku.ProductSpecifications.find(f => f.FieldName == "isDiscontinued")?.FieldValues[0] == "false"
      let marketPrice = (await ctx.clients.Vtex.getMarketPrice(sku.ProductId)).data;
      let price = await new Promise<any>(async (resolve, reject) => {
        ctx.clients.Vtex.getPrice(sku.Id, ctx).then(res => { resolve(res.data) }).catch(err => {
          if (err.response?.status == 404) {
            resolve([]);
          } else {
            reject({ status: err.response?.status, message: err.response?.data });
          }
        })
      })

      let isMarketplace = JSON.parse(process.env.TEST).isMarketplace;
      let warehouses = JSON.parse(process.env.TEST).warehouses?.split(",");
      let inventory = 0;
      if (!isMarketplace) {
        let inventoriesData = await Promise.all(warehouses.map(warehouse => ctx.clients.Vtex.getInventory(sku.Id, warehouse).then(res => res.data)));
        inventory = inventoriesData.reduce((prevInv, otherInv) => prevInv + otherInv.availableQuantity, 0);
      } else {
        let sellerName = JSON.parse(process.env.TEST).sellerAccount.name;
        inventory = await ctx.clients.Vtex.getInventoryBySellerName(sku.Id, sellerName);
      }


      let category = (await ctx.clients.Vtex.getCategory(product.CategoryId)).data;
      let images = await new Promise<any>(async (resolve, reject) => {
        ctx.clients.Vtex.getImagesMain(sku.Id).then(res => { resolve(res.data) }).catch(err => {
          if (err.response?.status == 404) {
            resolve([]);
          } else {
            reject({ status: err.response?.status, message: err.response?.data });
          }
        })
      })
      let imageSingle = images?.find((image: any) => image.IsMain);
      let catalogInfo = await catalogSalesforce(sku, price, inventory, category, ctx, imageSingle, marketPrice, availability)
      resolve({ status: 200, message: catalogInfo });
    } catch (err) {
      console.log(err)
      if (err.response == undefined) {
        reject({ status: err.status, message: err.message });
      } else {
        reject({ status: err?.response?.status, message: err?.response?.data });
      }
    }
  });
}

