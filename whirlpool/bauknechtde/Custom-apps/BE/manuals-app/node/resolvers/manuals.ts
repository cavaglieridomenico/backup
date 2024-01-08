import { CustomLogger } from "../utils/Logger";
import { ManualSuggestionsQuery, ManualDocumentsQuery } from "../typings/ManualQuery";

const MINIMUM_CODE_LENGTH = 5

export const queryManualSuggestions = async (
  _: any,
  params: ManualSuggestionsQuery,
  ctx: Context
) => {
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    const {
        clients: { manual },
    } = ctx

    let responseMessage = {
      status: {},
      response: []
    }

    // get the code from which retrieve the suggestions
    let code = params.query.code

    // check over the code minimum length
    if(code && code.length >= MINIMUM_CODE_LENGTH) {

      // execute the REST request to the Sandwatch endpoint
      let response = await manual.getManualsSuggestions(code)

      ctx.status = response.status
      ctx.body = response.statusText

      responseMessage.status = {
        id: response.status,
        message: response.statusText
      }

      // check status
      if (response.status === 200) {

        responseMessage.response = response.data.products.map((suggestion: any) => ({
          brand: suggestion.brand ? suggestion.brand : "",
          code12nc: suggestion["12nc"] ? suggestion["12nc"] : "",
          f0: suggestion["F0"] ? suggestion["F0"] : "",
          code12ncHana: suggestion["12nc-hana"] ? suggestion["12nc-hana"] : "",
          ean: suggestion.brand ? suggestion.brand : "",
          commercialCode: suggestion["commercial-code"] ? suggestion["commercial-code"] : "",
          productGroup: suggestion["product-group"] ? suggestion["product-group"] : "",
          iconUri: getProductGroupIcon(suggestion["product-group"])
        }));

      } else {

        responseMessage.response = []
      }

      return responseMessage

    } else {

      ctx.body = `The code parameter should be at least ${MINIMUM_CODE_LENGTH} characters long!`;
      ctx.status = 500;
      ctx.vtex.logger.error("Internal Server Error: " + JSON.stringify(ctx.body));
      
      responseMessage = {
        status: {
          id: "500",
          message: ctx.body
        },
        response: []
      };

      return responseMessage;

    }
    
  } catch (err) {
    if (err && err.response){
      ctx.body = err.response.statusText;
      ctx.status = err.response.status;
      //console.log(err)
      ctx.vtex.logger.error("Internal Server Error: " + JSON.stringify(err));
      return {
        status: {
          id: err.response.status,
          message: err.response.statusText
        },
        response: []
      };
    } else {
      ctx.body = "Internal Server Error: " + JSON.stringify(err);
      ctx.status = 500;
      //console.log(err)
      ctx.vtex.logger.error("Internal Server Error: " + JSON.stringify(err));
      return {
        status: {
          id: 500,
          message: "Internal Server Error: " + JSON.stringify(err)
        },
        response: []
      };
    }
    
  }
};

function processManualDocumentsResponse (document: any) {

  return {

    id: document.id ? document.id : "",
    mainType: document.mainType ? document.mainType : "",
    type: document.type ? document.type : "",
    languages: document.languages ? document.languages : [],
    name: document.name ? document.name : "",
    typeId: document.typeId ? document.typeId : "",
    creationDate: document.creationDate ? document.creationDate : "",
    uri: document.uri ? document.uri : ""

  }

}

export const queryManualDocuments = async (
  _: any,
  params: ManualDocumentsQuery,
  ctx: Context
) => {
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    const {
        clients: { manual },
    } = ctx

    let responseMessage = {
      status: {},
      response: {
        documentations: [],
        pictures: []
      }
    }

    // get documentation files from the Sandwatch endpoint
    let documentationsResponse = await manual.getDocumentations(params.query)

    ctx.status = documentationsResponse.status
    ctx.body = documentationsResponse.statusText

    responseMessage.status = {
      id: documentationsResponse.status,
      message: documentationsResponse.statusText
    }

    // check status
    if (documentationsResponse.status === 200) {

      // DOCUMENTATIONS
      responseMessage.response.documentations = documentationsResponse.data.map(processManualDocumentsResponse);

      // get picture files from the Sandwatch endpoint
      let picturesResponse = await manual.getPictures(params.query)

      ctx.status = picturesResponse.status
      ctx.body = picturesResponse.statusText

      responseMessage.status = {
        id: picturesResponse.status,
        message: picturesResponse.statusText
      }

      // check status
      if(picturesResponse.status === 200) {

        // PICTURES
        responseMessage.response.pictures = picturesResponse.data.map(processManualDocumentsResponse);

      } else {

        responseMessage.response.pictures = []

      }

    } else {

      responseMessage.response.documentations = []
      responseMessage.response.pictures = []

    }

    return responseMessage
    
  } catch (err) {

    if (err && err.response){

      ctx.body = err.response.statusText;
      ctx.status = err.response.status;
      //console.log(err)
      ctx.vtex.logger.error("Internal Server Error: " + JSON.stringify(err));
      return {
        status: {
          id: err.response.status,
          message: err.response.statusText
        },
        response: {
          documentations: [],
          pictures: []
        }
      };

    } else {

      ctx.body = "Internal Server Error: " + JSON.stringify(err);
      ctx.status = 500;
      //console.log(err)
      ctx.vtex.logger.error("Internal Server Error: " + JSON.stringify(err));
      return {
        status: {
          id: 500,
          message: "Internal Server Error: " + JSON.stringify(err)
        },
        response: {
          documentations: [],
          pictures: []
        }
      };

    }
    
  }
};

function getProductGroupIcon (e: any) {
  
  var o, t, n, i, s, r, l, u, d, c, g: any, 
  
  p = (
    g = {
      "Air Conditioner": {
          token: "2a0ac5a6-d740-4b70-ad2d-ae271eaf8a40",
          fileName: "air-conditioner.png"
      },
      "Automatic tea maker": s = {
          token: "642a8738-10f8-4cdb-825d-758dc6ddba28",
          fileName: "kettle.png"
      },
      "Beverage preparation device": {
          token: "500e7cfc-6779-4950-bbea-d9627ba182d5",
          fileName: "soda-stream.png"
      },
      Block: null,
      "Built-in coffee machine": null,
      Chopper: {
          token: "24da6c89-6b34-4439-bdb0-6ef644d0c5e4",
          fileName: "chopper.png"
      },
      "Coffee grinder": {
          token: "10f4a01e-598d-489c-a245-66befb928528",
          fileName: "grinder.png"
      },
      "Coffee machine": {
          token: "fd3f93a5-2f3c-4e2a-a270-af2ba8fbf7a2",
          fileName: "coffee-maker.png"
      },
      Cooker: o = {
          token: "62065154-c24f-403a-a43d-6ba2ed5e35fe",
          fileName: "cooker.png"
      },
      Dehumidifier: null,
      Dishwasher: {
          token: "cf3ffa36-4419-436f-af54-b918dc42fbc3",
          fileName: "dishwasher.png"
      },
      "Double Cooker": {
          token: "d00c8166-9708-4544-abda-bf2030db98fd",
          fileName: "double-cooker.png"
      },
      "Double oven": {
          token: "dfb74bf6-d660-42b0-aed0-4e4a26469ca0",
          fileName: "double-oven.png"
      },
      Dryer: t = {
          token: "4948a0a0-1922-4d4d-9cce-471e826cdcd6",
          fileName: "dryer.png"
      },
      Faucet: null,
      "Food preparation appliance": null,
      "Food processor": null,
      Freezer: n = {
          token: "9205e0c4-4f67-4b46-a347-0e6df8627974",
          fileName: "freezer.png"
      },
      "Fridge/freezer combination": u = {
          token: "3874e386-38c6-4a1f-997c-76376fb059a1",
          fileName: "refrigerator.png"
      },
      "Grill device": null,
      "Hand mixer": null,
      Hob: {
          token: "8f90b200-d68c-4ff4-86f8-f32e6662ea4e",
          fileName: "hob.png"
      },
      Hood: {
          token: "2c122784-1a76-4534-af76-bbfc8534fb39",
          fileName: "hood.png"
      },
      "Ice maker": null,
      Iron: i = {
          token: "9ca8e6f5-c5cf-4523-bb45-2a6776dee586",
          fileName: "iron.png"
      },
      "Juicer squeezer": null,
      Kettle: s,
      "Meat mincer": null,
      Microwave: r = {
          token: "7a140dbc-930d-4003-b77c-dd41748c15a6",
          fileName: "microwave.png"
      },
      "Milk foamer": null,
      "Mini Kitchen": null,
      "Outdoor grill": null,
      Oven: l = {
          token: "06c9aa0c-6e5e-4550-a30f-7fed72171ada",
          fileName: "oven.png"
      },
      Platewarmer: null,
      Refrigerator: n,
      "Side-by-Side": {
          token: "6bf01545-2d0c-4574-a0f0-b5e4db90d49a",
          fileName: "american-fridge.png"
      },
      Sink: null,
      "Steam-Oven": l,
      "Stirring machine": null,
      Toaster: {
          token: "b51cc873-58c7-4d4b-98ab-9d13d22f1f2a",
          fileName: "toaster.png"
      },
      "Canister-Cylinder Cleaner": null,
      "Vacuum cleaner multifunction": d = {
          token: "e41249c8-c8b9-4e85-a0b1-d4e83456683d",
          fileName: "vacuum-cleaner.png"
      },
      "Vacuum sealer": null,
      "Stick Cleaner": null,
      "Vacuum cleaner upright": d,
      "MDA-C Vacuum sealer": null,
      "Venting cooktop": null,
      "Waffle iron": null,
      "Washer dryer": {
          token: "a432d61c-5fa2-4758-94d9-1dd43ce9ec46",
          fileName: "washer-dryer.png"
      },
      "Washing machine": c = {
          token: "77362af2-ae9e-457f-af1c-fb70b99e7564",
          fileName: "washing-machine.png"
      },
      "Water device": null,
      Winestorage: null,
      "Bread baking machine": null,
      "Sandwich toaster": null,
      "Steam ironing system": i,
      "Built-in water machine": null,
      "Modular deep fryer": null,
      "Modular grill": null,
      "Modular hobs": null,
      "Modular scale": null,
      "Modular sink": null,
      Steamer: null,
      "MDA Accessory": null,
      "SDA Accessory": null,
      "KA SDA Kitchenware": null,
      "Steam Cleaners": null,
      Essentials: null,
      "Professional Accessory": null,
      "Professional Combi": u,
      "Professional Cooker": o,
      "Professional Dryer": t,
      "Professional Freezer": n,
      "Professional Fryer": null,
      "Professional Grill": null,
      "Professional Ice maker": null,
      "Professional Ironer": i,
      "Professional Ironing table": null,
      "Professional Microwave": r,
      "Professional Oven": l,
      "Professional Refrigerator": n,
      "Professional Shock freezer": n,
      "Professional Warewasher": null,
      "Professional Warmer": null,
      "Professional Washing machine": c,
      "Professional Winestorage": null
    },
    {
        getImage: function(e: any) {
            var a = g[e];
            return a ? "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/" + a.token + "/sckne7/std/300x300/" + a.fileName + "?fill=zoom&fillcolor=rgba:255,255,255&scalemode=product" : ""
        }
    }
  );

  return p.getImage(e) ? p.getImage(e) : ""

}