//GA4FUNREQ58
const setAnalyticCustomError = () => {
  const ga4Data = {
    event: "custom_error",
    type: "error message",
    description: "",
  };

  const form = document.querySelector(".form-step.box-edit");
  const btnSubmit = document.querySelector("#go-to-shipping");

  btnSubmit.addEventListener("click", () => {
    setTimeout(() => {
      const popupMessage = document.querySelector(
        ".vtex-front-messages-type-error"
      );
      const popupTextMessage = document.querySelector(
        ".vtex-front-messages-detail"
      );
      if (popupMessage) {
        ga4Data.description = `Form: ${popupTextMessage.innerHTML}`;
        window.dataLayer.push({ ...ga4Data });
      }
    }, 1000);
    const inputList = form.querySelectorAll("input");
    for (let element of inputList) {
      if (element.classList.contains("error") && element.nextElementSibling) {
        ga4Data.description = `${element.previousElementSibling.innerHTML}: ${element.nextElementSibling.innerHTML}`;
        window.dataLayer.push({ ...ga4Data });
      }
    }
  });
};
$(document).ready(function () {
  setAnalyticCustomError();
});
// End of GA4FUNREQ58

//GA4FUNREQ30
const handleMouseover = () => {
  window.dataLayer.push({
    event: "extra_info_interaction",
    type: "tooltip",
  });
};
// End of GA4FUNREQ30

// Global variables
var userTypeStatus = ""; // D2CA-834

//------------------------------------------
//---------VTEX FUNCTION THAT CHANGE LABELS------
//------------------------------------------
$(window).on("renderLoaderReady.vtex", function () {
  vtex.i18n.it.global.free = "Gratuito";
  $("#client-profile-data")
    .find(".accordion-heading")
    .children()
    .find("span")
    .text("Dati personali");
});

$(window).on("load", function () {
  setInterval(() => {
    if ($(".btn-go-to-shippping-method").text() != "Procedi") {
      $(".btn-go-to-shippping-method").text("Procedi");
      console.log($(".btn-go-to-shippping-method").text());
    }
    if ($(".custom-corporate-name").find("label").text() != "Nome e Cognome") {
      $(".custom-corporate-name").find("label").text("Nome e Cognome");
    }
  }, 250);
});

//------------------------------------------
//---------EXTRA_SERVICES_CONFIG------
//------------------------------------------
function checkout_v6_additional_services_checkboxes_initialize(EXTRA_SERVICES) {
  EXTRA_SERVICES["Installazione"] = {
    // salesChannel: [],
    selected: false,
    selectionEnabled: true,
    order: 2,
    description: `Il servizio di Installazione comprende, se necessaria, la disinstallazione del vecchio elettrodomestico e l'installazione del nuovo tramite autorizzati. Il servizio non comprende modifiche del mobile, inversione porte ed altre operazioni descritte nella pagina di Supporto.`,
  };
  EXTRA_SERVICES["L'esperto per te"] = {
    // salesChannel: [],
    selected: false,
    selectionEnabled: true,
    order: 3,
    description: `"L\'Esperto per Te" è un servizio di consulenza personalizzata offerto da Whirlpool su determinati elettrodomestici che consiste nella illustrazione del prodotto e delle sue funzionalità da parte di un incaricato autorizzato.`,
  };
  EXTRA_SERVICES["Ritiro dell'usato contestuale alla consegna"] = {
    // salesChannel: ["1"],
    selected: false,
    selectionEnabled: true,
    order: 5,
    description: `Ritiro del tuo vecchio elettrodomestico contestualmente alla consegna del nuovo.`,
  };
  EXTRA_SERVICES["Consulenza Telefonica per te"] = {
    // salesChannel: ["1"],
    selected: false,
    selectionEnabled: true,
    order: 4,
    description: `La Consulenza telefonica per te è un servizio offerto da Whirlpool su determinati elettrodomestici che consiste nell'introduzione delle funzionalità del prodotto da parte del nostro Servizio Clienti.`,
  };
}

//------------------------------------------
//--------------- CUSTOM CHECKBOX (Vtex)---------------
//------------------------------------------
function setVtexAppsConfig(config) {
  config.locale = "it";
  config.checkbox = [
    {
      html: "<span class='terms-and-conditions'>Ho letto e accettato i <a href='/pagine/condizioni-di-utilizzo'>termini e condizioni</a> di Hotpoint Italia*.</span>",
    },
  ];
}

//------------------------------------------
//------------ ONE TRUST -------------------
//------------------------------------------
$(document).ready(function () {
  (function () {
    window.dataLayer = window.dataLayer || [];
    //consent mode
    var gtmId = "GTM-NJ6SMQH";
    function gtag() {
      dataLayer.push(arguments);
    }
    //   window.dataLayer.push({ 'gtm.blacklist': { } });
    gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "granted",
      functionality_storage: "denied",
      personalization_storage: "denied",
      security_storage: "granted",
      wait_for_update: 2000,
    });
    gtag("set", "ads_data_redaction", true);
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", gtmId);
  })();

  var script = document.createElement("script");
  script.src = "https://cdn.cookielaw.org/scripttemplates/otSDKStub.js";
  script.setAttribute("charset", "UTF-8");
  script.setAttribute(
    "data-domain-script",
    "767d11a7-d6c3-40b8-b31a-33547fcef4f1"
  );
  script.setAttribute("data-document-language", "true");
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
});

//------------------------------------------
//------------ INVOICE ADDRESS -------------
//------------------------------------------
function setInvoiceDataConfig(invoiceDataConfig) {
  invoiceDataConfig.locale = "it";
  invoiceDataConfig.invoiceDataMandatory = false;
  invoiceDataConfig.showSDIPECSelector = false;
  invoiceDataConfig.defaultSDIPEC = "pec";
  invoiceDataConfig.showPersonTypeSelector = false;
  invoiceDataConfig.defaultPersonType = "private";
  invoiceDataConfig.showTermsConditions = true;
}

//------------------------------------------
//--------------- NEWSLETTER ---------------
//------------------------------------------
$(document).ready(function () {
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
  ) {
    // CHANGE NEWSLETTER CHECKBOX
    changeNewsletterChk();
  }
});

$(window).on("hashchange", function () {
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
  ) {
    // CHANGE NEWSLETTER CHECKBOX
    changeNewsletterChk();
  }
});

function changeNewsletterChk() {
  if (
    vtexjs.checkout.orderForm !== undefined &&
    vtexjs.checkout.orderForm.loggedIn
  ) {
    $(".newsletter").html(
      '<label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData"><input type="checkbox" id="opt-in-newsletter" data-bind="checked: checkout.optinNewsLetter, enable: checkout.saveData"><span class="newsletter-text" data-i18n="global.optinNewsLetter">Selezioni questa casella se non desidera ricevere comunicazioni di marketing personalizzate per e-mail ed SMS relative a prodotti, servizi e marchi di Whirlpool Corporation. Ulteriori dettagli sono disponibili nella nostra <a href="/pagine/informativa-sulla-privacy">Informativa sulla privacy</a> disponibile all\'indirizzo Informativa sulla privacy.<br><br>I riferimenti a \'Whirlpool\' devono intendersi come riferimenti alla persona giuridica in quanto il consenso viene espresso nei confronti della società e quindi per tutti i suoi marchi.</span></label>'
    );
  } else {
    $(".newsletter").html(
      '<p class="informativa" style="font-size: 13px;margin: .5rem 0;">Ho compreso e prendo atto del contenuto dell’<a href="/pagine/informativa-sulla-privacy" class="link" target="_blanck">Informativa sulla privacy</a> e:</p><label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData"><input type="checkbox" id="opt-in-newsletter" data-bind="checked: checkout.optinNewsLetter, enable: checkout.saveData"><span class="newsletter-text" data-i18n="global.optinNewsLetter">Acconsento al trattamento dei miei dati personali per permettere a Whirlpool Italia Srl di inviarmi newsletter/comunicazioni di marketing (in forma elettronica e non, anche tramite telefono, posta tradizionale, e-mail, SMS, MMS, notifiche push su siti di terze parti tra cui sulle piattaforme Facebook e Google) riguardanti prodotti e servizi di Whirlpool Italia Srl, anche da me acquistati o registrati, nonché di svolgere ricerche di mercato. Con la registrazione potrò usufruire di uno sconto del 5% valido sul primo acquisto effettuato entro 12 mesi dalla registrazione. Sconto cumulabile con le altre offerte in essere.</span></label>'
    );
  }
}

//------------------------------------------
//------------ADD LABEL GRATUITO TO PRESELECTED EXTRA SERVICE ------------
//------------------------------------------
const addLabel = () => {
  $(".preselected-service").append(
    '<span class="extra-services-price">Gratuito</span>'
  );
};
$(window).on("load", function () {
  setInterval(() => {
    if ($(".preselected-service").find(".extra-services-price").length == 0) {
      addLabel();
    }
    if ($(".srp-summary-result").find(".monetary").text() == "GratisGratis") {
      $(".srp-summary-result").find(".monetary").text("Gratuito");
    }
  }, 250);
});

//------------------------------------------
//------------ GOOGLE ANALYTICS ------------
//------------------------------------------
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

function getSpecificationFromProduct(productId) {
  return fetch(
    "/_v/wrapper/api/catalog_system/products/" + productId + "/specification",
    options
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
}
function getValuefromSpecifications(specifications, name) {
  const result = specifications.filter((s) => s.Name === name);
  if (result.length === 0) {
    return "";
  } else {
    return specifications.filter((s) => s.Name === name)[0].Value[0];
  }
}
function getStringCategoryFromId(categoryId) {
  return fetch("/_v/wrapper/api/catalog/category/" + categoryId, options).then(
    (response) => response.json()
  );
}
function getProductSpecification(itemId) {
  return fetch(
    `/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/${itemId}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  ).then((response) => response.json());
}
function remove12ncName(name, code) {
  if (name.indexOf(code) !== -1) {
    return name.replace(code, "").trim();
  } else {
    return name;
  }
}
window.eeccheckout = {
  location: "",
};
function pushEventCheckout(stepID) {
  vtexjs.checkout.getOrderForm().then(function (orderForm) {
    var items = orderForm.items;
    products = [];
    var forEachAsync = new Promise((resolve, reject) => {
      items.forEach((value, index, array) => {
        var categoryIdsSplitted = value.productCategoryIds.split("/");
        Promise.all([
          getSpecificationFromProduct(value.id),
          getStringCategoryFromId(
            categoryIdsSplitted[categoryIdsSplitted.length - 2]
          ),
          getProductSpecification(value.id),
        ]).then((values) => {
          var obj = {
            name: remove12ncName(value.name, value.refId),
            id: value.refId,
            price: value.isGift ? 0 : value.sellingPrice / 100,
            brand: value.additionalInfo.brandName,
            category: values[1].AdWordsRemarketingCode,
            quantity: value.quantity,
            variant: findVariant(values[2].ProductSpecifications),
            dimension4: findDimension(values[2].ProductSpecifications),
            dimension5: costructionType(values[2].ProductSpecifications),
          };
          products.push(obj);
          if (index === array.length - 1) {
            resolve();
          }
        });
      });
    });
    // $("#opt-in-newsletter").on("click", () => {
    //   if ($("#opt-in-newsletter").is(":checked") === true) {
    //     window.dataLayer.push({
    //       event: "optin_granted",
    //     });
    //   }
    // });
    forEachAsync.then(() => {
      window.eeccheckout.location = window.location.hash;
      $("body").removeClass("checkoutEventPush");
      if (stepID == 1) {
        window.dataLayer.push({
          event: "eec.checkout",
          ecommerce: {
            checkout: {
              actionField: {
                step: stepID,
              },
              products: products,
            },
          },
        });
      } else if (stepID == 2) {
        window.dataLayer.push({
          event: "eec.checkout",
          ecommerce: {
            checkout: {
              actionField: {
                step: stepID,
              },
              products: products,
            },
          },
        });
      } else {
        window.dataLayer.push({
          event: "eec.checkout",
          ecommerce: {
            currencyCode: "EUR",
            checkout: {
              actionField: {
                step: stepID,
              },
              products: products,
            },
          },
        });
      }
    });
  });
}
function getCheckoutStep() {
  let hash = window.location.hash;
  switch (hash) {
    case "#/cart":
      return 0;
    case "#/shipping":
      return 2;
    case "#/payment":
      return 3;
    default:
      return 1;
  }
}

//GA4FUNREQ73 - view_cart
$(document).ready(function () {
  window.eeccheckout.location = window.location.hash;
  const step = getCheckoutStep();

  if (step === 0) {
    pushViewCartEvent();
  }
});

async function pushViewCartEvent() {
  let orderForm = await vtexjs.checkout.getOrderForm();
  var items = orderForm.items;
  let cartItems = [];

  await Promise.all(
    items.map(async (value) => {
      var categoryIdsSplitted = value.productCategoryIds.split("/");
      let spec = await getSpecificationFromProduct(value.id);

      let category = await getStringCategoryFromId(
        categoryIdsSplitted[categoryIdsSplitted.length - 2]
      );
      const promoStatus =
        value.price < value.listPrice ? "In Promo" : "Not in Promo";

      var obj = {
        item_id: value.refId,
        item_name: remove12ncName(value.name, value.refId),
        item_brand: value.additionalInfo.brandName,
        item_variant: getValuefromSpecifications(spec, "Colore"),
        item_category: category.AdWordsRemarketingCode,
        price: value.isGift ? 0 : value.sellingPrice / 100,
        quantity: value.quantity,
        // also known as dimension4
        sellable_status:
          getValuefromSpecifications(spec, "sellable") === "true"
            ? "Sellable Online"
            : "Not Sellable Online",
        product_type: getValuefromSpecifications(spec, "field5"), // also known as dimension5
        promo_status: promoStatus, // also known as dimension6
      };

      cartItems.push(obj);
    })
  );

  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({
    event: "view_cart",
    ecommerce: {
      items: cartItems,
    },
  });
}
// End of GA4FUNREQ73

$(window).on("hashchange", function () {
  setTimeout(function () {
    let step = getCheckoutStep();
    if (step == 0) {
      window.eeccheckout.location = window.location.hash;
      return;
    }
    let isDifferentHash = window.eeccheckout.location !== window.location.hash;
    let isNotEmailProfile =
      window.eeccheckout.location !== "#/email" ||
      (window.eeccheckout.location == "#/email" &&
        window.location.hash !== "#/profile");
    let isLoading = $("body").hasClass("checkoutEventPush");
    if (
      window.dataLayer &&
      !isLoading &&
      isDifferentHash &&
      isNotEmailProfile
    ) {
      $("body").addClass("checkoutEventPush");
      pushEventCheckout(step);
    }
  }, 1500);
});

$(document).ready(function () {
  window.eeccheckout.location = window.location.hash;
  setTimeout(function () {
    let step = getCheckoutStep();
    if (step == 0) {
      return;
    }
    let isLoading = $("body").hasClass("checkoutEventPush");
    if (window.dataLayer && !isLoading) {
      $("body").addClass("checkoutEventPush");
      pushEventCheckout(step);
    }
  }, 1500);
});

//GA4FUNREQ61
function pushOptinInEvent() {
  return window.dataLayer.push({
    event: "optin",
  });
}
// End of GA4FUNREQ61

//FUNREQ52 - Lead Generation Event
function pushLeadGenerationEvent() {
  const userEmail = document.getElementById("client-email")?.value; //D2CA-614

  return window.dataLayer.push({
    event: "leadGeneration",
    eventCategory: "Lead Generation",
    eventAction: "Optin granted",
    eventLabel: "Lead from checkout step1",
    email: userEmail,
  });
}

$(document).ready(function () {
  var goToShipping = document.getElementById("go-to-shipping");
  goToShipping.addEventListener("click", function () {
    const isOptin = $("#opt-in-newsletter").is(":checked") ? true : false;
    const emailInput = document.getElementById("client-email")?.value;

    const leadGenerationEvents = window.dataLayer.filter(
      (analyticsEvent) => analyticsEvent?.event === "leadGeneration"
    );

    const pushedEmailList = leadGenerationEvents?.map(
      (leadGenEvent) => leadGenEvent?.email
    );

    const isEmailPushed = pushedEmailList?.includes(emailInput);

    if (
      window.dataLayer
        .filter((analyticsEvent) => analyticsEvent?.event === "cta_click")
        ?.map((ctaClicksEvents) => ctaClicksEvents?.eventLabel)
        ?.includes("checkout") === false
    ) {
      pushCTAShipping();
    }

    //If previous email is the same, don't push lead generation
    if (isOptin && isEmailPushed === false) {
      pushLeadGenerationEvent();
      pushOptinInEvent();
    }
  });
});

function pushCTAShipping() {
  window.dataLayer.push({
    event: "cta_click",
    eventCategory: "CTA Click",
    eventAction: "(Other)",
    eventLabel: "checkout",

    link_url: window?.location?.href,
    link_text: "go to shipping",
    checkpoint: "1",
    area: "(Other)",
    type: "go to shipping",
  });
}

// End of FUNREQ52

// emailForSalesforce event - D2CA-614
function pushEmailForSalesforceEvent() {
  const userEmail = document.getElementById("client-email")?.value; //D2CA-614

  return window.dataLayer.push({
    event: "emailForSalesforce",
    eventCategory: "Email for Salesforce",
    eventAction: "Checkout step 1",
    email: userEmail,
  });
}

$(document).ready(function () {
  var goToShipping = document.getElementById("go-to-shipping");
  goToShipping.addEventListener("click", function () {
    const isTermsAccepted = $("#custom-corporate-terms").is(":checked")
      ? true
      : false;
    const emailInput = document.getElementById("client-email")?.value;

    const emailForSalesforceEvents = window.dataLayer.filter(
      (analyticsEvent) => analyticsEvent?.event === "emailForSalesforce"
    );

    const pushedEmailList = emailForSalesforceEvents?.map(
      (emailForSalesforceEvent) => emailForSalesforceEvent?.email
    );

    const isEmailPushed = pushedEmailList?.includes(emailInput);

    if (
      window.dataLayer
        .filter((analyticsEvent) => analyticsEvent?.event === "cta_click")
        ?.map((ctaClicksEvents) => ctaClicksEvents?.eventLabel)
        ?.includes("checkout") === false
    ) {
      pushCTAShipping();
    }

    //If previous email is the same, don't push emailForSalesforce event again
    if (isTermsAccepted && isEmailPushed === false) {
      pushEmailForSalesforceEvent();
    }
  });
});

// End of emailForSalesforceEvent

//ADD AND REMOVE FROM CART EVENTS
$(document).on("click", ".item-quantity-change-decrement", function () {
  let splitted = $(this).attr("id").split("-");
  let itemId = splitted[splitted.length - 1];
  let item = findItem(itemId, vtexjs.checkout.orderForm.items);
  let dataQ = $('[data-sku="' + itemId + '"] .quantity input').val();
  if (item.quantity !== parseInt(dataQ)) {
    pushRemoveToCart(item, 1);
    pushCartState(item, 1, "remove", vtexjs.checkout.orderForm.items);
  }
});

$(document).on("click", ".item-quantity-change-increment", function () {
  let splitted = $(this).attr("id").split("-");
  let itemId = splitted[splitted.length - 1];
  let item = findItem(itemId, vtexjs.checkout.orderForm.items);
  pushAddToCart(item, 1);
  pushCartState(item, 1, "add", vtexjs.checkout.orderForm.items);
});

$(document).on("click", ".item-link-remove", function () {
  let splitted = $(this).attr("id").split("-");
  let itemId = splitted[splitted.length - 1];
  let item = findItem(itemId, vtexjs.checkout.orderForm.items);
  pushRemoveToCart(item, item.quantity);
  pushCartState(item, item.quantity, "remove", vtexjs.checkout.orderForm.items);
});

$(document).on("blur", ".quantity input", function () {
  let splitted = $(this).attr("id").split("-");
  let itemId = splitted[splitted.length - 1];
  let item = findItem(itemId, vtexjs.checkout.orderForm.items);
  let dataQ = $(this).val();
  if (item.quantity == dataQ) {
    return;
  } else if (item.quantity > dataQ) {
    pushRemoveToCart(item, item.quantity - dataQ);
    pushCartState(
      item,
      item.quantity - dataQ,
      "remove",
      vtexjs.checkout.orderForm.items
    );
  } else {
    pushAddToCart(item, dataQ - item.quantity);
    pushCartState(
      item,
      dataQ - item.quantity,
      "add",
      vtexjs.checkout.orderForm.items
    );
  }
});

function setPriceFormat(price) {
  let newPrice = parseInt(price) / 100 + "";
  if (newPrice.indexOf(".") == -1) {
    return parseInt(newPrice).toFixed(2);
  } else {
    let arrayPrice = newPrice.split(".");
    return parseInt(arrayPrice[1]) < 10 ? newPrice + "0" : newPrice;
  }
}
function findItem(id, items) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id == id) {
      return items[i];
    }
  }
  return null;
}
function findVariant(arr) {
  if (arr.find((item) => item.FieldName == "Colore") != undefined) {
    return arr.find((item) => item.FieldName == "Colore").FieldValues[0];
  } else {
    return "";
  }
}
function findDimension(arr) {
  if (arr.find((item) => item.FieldName == "sellable") != undefined) {
    return arr.find((item) => item.FieldName == "sellable").FieldValues[0] ==
      "true"
      ? "Sellable Online"
      : "Not Sellable Online";
  } else {
    return "Not Sellable Online";
  }
}
function costructionType(arr) {
  if (arr.find((item) => item.FieldName == "constructionType") != undefined) {
    return arr
      .find((item) => item.FieldName == "constructionType")
      .FieldValues[0].replace("Free Standing", "Freestanding")
      .replace("Built In", "Built-In");
  } else {
    return "";
  }
}
function pushAddToCart(item, dataQ) {
  let categoryId = Object.keys(item.productCategories)[
    Object.keys(item.productCategories).length - 1
  ];
  const name = item.name.split(item.refId)[0].trim();
  Promise.all([
    getSpecificationFromProduct(item.id),
    getStringCategoryFromId(categoryId),
    getProductSpecification(item.id),
  ]).then((values) => {
    console.log(values);
    window.dataLayer.push({
      ecommerce: {
        add: {
          actionField: {
            action: "add",
          },
          products: [
            {
              brand: item.additionalInfo.brandName,
              category: values[1].AdWordsRemarketingCode,
              id: item.refId,
              name: name,
              price:
                `${item.price}` == "0" ? "" : setPriceFormat(`${item.price}`),
              quantity: dataQ,
              variant: findVariant(values[2].ProductSpecifications),
              dimension4: findDimension(values[2].ProductSpecifications),
              dimension5: costructionType(values[2].ProductSpecifications),
            },
          ],
        },
        currencyCode: "EUR",
      },
      event: "eec.addToCart",
    });
  });
}
function pushRemoveToCart(item, dataQ) {
  let categoryId = Object.keys(item.productCategories)[
    Object.keys(item.productCategories).length - 1
  ];
  const name = item.name.split(item.refId)[0].trim();
  Promise.all([
    getSpecificationFromProduct(item.id),
    getStringCategoryFromId(categoryId),
    getProductSpecification(item.id),
  ]).then((values) => {
    window.dataLayer.push({
      ecommerce: {
        currencyCode: "EUR",
        remove: {
          actionField: {
            action: "remove",
          },
          products: [
            {
              brand: item.additionalInfo.brandName,
              category: values[1].AdWordsRemarketingCode,
              id: item.refId,
              name: name,
              price:
                `${item.price}` == "0" ? "" : setPriceFormat(`${item.price}`),
              quantity: dataQ,
              variant: findVariant(values[2].ProductSpecifications),
              dimension4: findDimension(values[2].ProductSpecifications),
              dimension5: costructionType(values[2].ProductSpecifications),
            },
          ],
        },
      },
      event: "eec.removeFromCart",
    });
  });
}
function getItemsForCart(itemId, quantity, operation, items) {
  products = [];
  items.forEach((item) => {
    let obj = {};
    if (item.refId == itemId) {
      if (operation == "remove" && item.quantity - quantity == 0) {
        return;
      }
      obj = {
        id: item.refId,
        price:
          `${item.price}` == "0" ? "" : setPriceFormat(`${item.sellingPrice}`),
        quantity:
          operation == "remove"
            ? item.quantity - quantity
            : item.quantity + quantity,
      };
    } else {
      obj = {
        id: item.refId,
        price:
          `${item.price}` == "0" ? "" : setPriceFormat(`${item.sellingPrice}`),
        quantity: item.quantity,
      };
    }
    products.push(obj);
  });
  return products;
}
function pushCartState(itemChange, quantityChange, operation, items) {
  window.dataLayer.push({
    event: "cartState",
    products: getItemsForCart(
      itemChange.refId,
      quantityChange,
      operation,
      items
    ),
  });
}

// if (
//   $("#opt-in-newsletter").is(":visible") &&
//   $("#opt-in-newsletter").is(":checked")
// ) {
//   let dL = window.dataLayer || [];
//   dL.push({
//     event: "optin_granted",
//   });
// }

function normativaFGAS() {
  const items =
    vtexjs.checkout.orderForm.items.length > 0
      ? vtexjs.checkout.orderForm.items
      : null;

  const itemsSpec = items?.map((item) => {
    let itemsSpecifications = [];
    let itemSpecification = getSpecificationFromProduct(item.productId).then(
      (itemSpecification) => {
        itemSpecification.map((spec) => {
          if (spec.Name === "fgas") {
            if (
              $("tr[data-sku=" + item.productId + "] .normativaFGAS").length ==
              0
            ) {
              $("tr[data-sku=" + item.productId + "]").append(
                `<div class="normativaFGAS">
                    <div class="wrapper--fgas">
                      <h3 class="heading--fgas">
                        NORMATIVA F-GAS
                      </h3>
                      <p class="paragraph--fgas">
                      Acquistando questo prodotto ti assumi l’obbligo che l’installazione sia effettuata da un’impresa certificata ai sensi del Regolamento UE n. 517/2014. Whirlpool Italia S.r.l. comunichera i tuoi dati alla Banca dati gas fluorurati come normato dall'articolo 16 comma 3 del DPR n. 146/2018.
                     </p>
      <p class="paragraph--fgas">
                      E’ obbligatorio inviare la dichiarazione compilata e firmata all’indirizzo email <a href="mailto:supporto@whirlpool.com">supporto@whirlpool.com</a> per poter spedire il prodotto soggetto a normativa F-GAS. L’invio della dichiarazione deve avvenire entro TRE giorni dalla ricezione della conferma d’ordine. La dichiarazione da compilare può essere trovata in allegato alla conferma d’ordine, nella pagina prodotto e nell’apposita sezione Domande Frequenti-->Climatizzatori F-GAS.
                     </p>
                    </div>
                  
                    
                  </div>
                  
                    `
              );
            }
          }
        });
        itemsSpecifications.push(itemSpecification);
      }
    );
    return itemsSpecifications;
  });
}
/*
$(window).on("load", function () {
  normativaFGAS();
});
*/

/*--------------------------FEREADY-------------------------------*/
async function feReady(pageType) {
  let dataLayer = window.dataLayer || [];
  if (
    vtexjs.checkout.orderForm !== undefined &&
    vtexjs.checkout.orderForm.loggedIn
  ) {
    if (!userTypeStatus) {
      userTypeStatus = await getUserType();
    }

    dataLayer.push({
      event: "feReady",
      status: "authenticated",
      "product-code": "",
      "product-name": "",
      "product-category": "",
      userType: userTypeStatus,
      pageType: pageType,
      contentGrouping: "(Other)",
    });
  } else {
    dataLayer.push({
      event: "feReady",
      status: "anonymous",
      "product-code": "",
      "product-name": "",
      "product-category": "",
      userType: "prospect", // D2CA-834: Changed to "prospect"
      pageType: pageType,
      contentGrouping: "(Other)", //D2CA-516
    });
  }
  setTimeout(() => {
    $("body").removeClass("feReadyLoading");
  }, 2000);
}
window.feReadyVar = {
  hashChange: null,
};
$(window).on("load", function () {
  window.feReadyVar.hashChange = window.location.hash;
  let isLoading = $("body").hasClass("feReadyLoading");
  if (window.location.hash == "#/cart" && !isLoading) {
    $("body").addClass("feReadyLoading");
    feReady("cart");
  } else if (!isLoading) {
    $("body").addClass("feReadyLoading");
    feReady("checkout");
  }
});
$(window).on("hashchange", function (e) {
  let isLoading = $("body").hasClass("feReadyLoading");
  let isDifferentHash = window.feReadyVar.hashChange !== window.location.hash;
  let isNotEmailProfile =
    window.feReadyVar.hashChange !== "#/email" ||
    (window.feReadyVar.hashChange == "#/email" &&
      window.location.hash !== "#/profile");
  if (
    window.location.hash == "#/cart" &&
    !isLoading &&
    isDifferentHash &&
    isNotEmailProfile
  ) {
    $("body").addClass("feReadyLoading");
    window.feReadyVar.hashChange = window.location.hash;
    feReady("cart");
  } else if (!isLoading && isDifferentHash && isNotEmailProfile) {
    $("body").addClass("feReadyLoading");
    window.feReadyVar.hashChange = window.location.hash;
    feReady("checkout");
  }
});

// D2CA-834: Returns "prospect" OR "hot customer" OR "cold customer"
async function getUserType() {
  let type = "";
  await fetch("/_v/wrapper/api/HotCold", {
    method: "GET",
    headers: {},
  })
    .then(async (response) => await response.json())
    .then((data) => {
      type = data.UserType;
    })
    .catch((err) => {
      console.error(err);
    });
  return type;
}

// function userType(orders, isNewsletterOptin) {
//   let userTypeValue = isNewsletterOptin ? "prospect" : "lead";
//   orders.toString() == "true" ? (userTypeValue = "customer") : null;
//   return userTypeValue;
// }

//------------------------------------------
//---------NEW_RELIC_INTEGRATION------------
//------------------------------------------
$(document).on("ready", function () {
  let script = document.createElement("script");
  script.src = "/arquivos/new_relic.js";
  script.type = "text/javascript";
  document.head.appendChild(script);
});
//-----------------------------------------------------------------------
//-----CHANGE LABEL SHIPPING FOR OOTB---------
//-----------------------------------------------------------------------
function changeOOTSMessage() {
  if ($("#unavailable-delivery-disclaimer").length > 0) {
    $("#unavailable-delivery-disclaimer").html(
      "<div style='height: 100%;display: flex;align-items: center;'>Il prodotto non è più disponibile per la spedizione.</div>"
    );
  }
}
$(window).on("load", function () {
  changeOOTSMessage();
});
$(window).on("hashchange", function () {
  if (window.location.hash !== "#/shipping") {
    return;
  }
  var timeleft = 6; // check for 3 secs
  var changeOOTSMessageWithTimer = setInterval(function () {
    if (timeleft <= 0) {
      clearInterval(changeOOTSMessageWithTimer);
    }
    changeOOTSMessage();
    timeleft -= 1;
  }, 500);
});

//-----------------------------------------------------------------------
//-----REMOVE CORPORATE INFO WHEN RICHIESTA FATTURA IS UNCHECKED---------
//-----------------------------------------------------------------------
function updateInput() {
  document.getElementById("custom-corporate-document").value = "";
  document.getElementById("custom-corporate-pec").value = "";
}
$(document).on("click", "input#opt-in-invoice", function () {
  if (!$("#opt-in-invoice").is(":checked")) {
    updateInput();
  }
});
//--------------------------------------------------------------------------
//---------PLACEHOLDER OF INFORMAZIONI AGGIUNTIVE INDIRIZZO CHANGED---------
//--------------------------------------------------------------------------
$(document).ready(function () {
  if (window.location.hash === "#/shipping") {
    let input = $("input#ship-complement");
    input.attr("placeholder", " ");
  }
});

$(window).on("hashchange", function () {
  if (window.location.hash === "#/shipping") {
    let input = $("input#ship-complement");
    input.attr("placeholder", " ");
  }
});
//------------------------------------------
//---------POSTAL CODE VALIDATION---------
//------------------------------------------
$(document).on("focus", "input#ship-postalCode", function () {
  let input = $("input#ship-postalCode");
  input.attr("maxlength", "5");
});

$(document).on("keypress", "input#ship-postalCode", function (e) {
  let keyPressed = e.key;
  const isNumber = /^[0-9]$/i.test(keyPressed);
  if (!isNumber) {
    e.preventDefault();
  }
});

$(document).on("blur", "input#ship-postalCode", function () {
  let val = $("input#ship-postalCode").val();
  const postalCodeRegex = /^\d{5}$/g;
  if (val.length == 0) {
    removePostalCodeError();
    return;
  } else {
    if (!postalCodeRegex.test(val)) {
      $("#btn-go-to-shippping-method").css({ "pointer-events": "none" });
      setTimeout(() => {
        generatePostalCodeError();
      }, 1000);
    } else {
      removePostalCodeError();
    }
  }
  return;
});
function generatePostalCodeError() {
  let span =
    //  '<span class="help error" id="postalCodeError" style="">Il valore inserito non è valido</span>';
    '<span class="help error" id="postalCodeError" style="">Minimo 5 caratteri</span>';
  if ($("input#ship-postalCode").hasClass("error")) {
    $("input#ship-postalCode").after(span);
  } else {
    $("input#ship-postalCode").addClass("error");
    $("input#ship-postalCode").after(span);
  }
}
function removePostalCodeError() {
  $("#postalCodeError").length > 0 ? $("#postalCodeError").remove() : null;
  $("input#ship-postalCode").removeClass("error");
  $("#btn-go-to-shippping-method").css({ "pointer-events": "all" });
}
//------------------------------------------------------------------------------
//---------POSTAL CODE VALIDATION ON SECTION: INDIRIZZO DI FATTURAZIONE---------
//------------------------------------------------------------------------------
$(document).on("blur", "input#custom-corporate-postal-code", function () {
  let val = $("input#custom-corporate-postal-code").val();
  const postalCodeRegex = /^\d{5}$/g;
  if (val.length == 0) {
    removePostalCodeErrorFattura();
    return;
  } else {
    if (!postalCodeRegex.test(val)) {
      $("#go-to-shipping").css({ "pointer-events": "none" });
      setTimeout(() => {
        generatePostalCodeErrorFattura();
      }, 1000);
    } else {
      removePostalCodeErrorFattura();
    }
  }
  return;
});
function generatePostalCodeErrorFattura() {
  let span =
    //  '<span class="help error" id="postalCodeError" style="">Il valore inserito non è valido</span>';
    '<span class="help error" id="postalCodeErrorFattura" style="">Minimo 5 caratteri</span>';
  if ($("input#custom-corporate-postal-code").hasClass("error")) {
    $("input#custom-corporate-postal-code").after(span);
  } else {
    $("input#custom-corporate-postal-code").addClass("error");
    $("input#custom-corporate-postal-code").after(span);
  }
}
function removePostalCodeErrorFattura() {
  $("#postalCodeErrorFattura").length > 0
    ? $("#postalCodeErrorFattura").remove()
    : null;
  $("input#custom-corporate-postal-code").removeClass("error");
  $("#go-to-shipping").css({ "pointer-events": "all" });
}
//------------------------------------------
//----- END POSTAL CODE VALIDATION ---------
//------------------------------------------

//-----------------------------------------------------------------------
//-----------------------PAYPAL INTEGRATION------------------------------
//-----------------------------------------------------------------------

$(document).ready(function () {
  var script = document.createElement("script");
  script.src =
    "https://www.paypal.com/sdk/js?client-id=AZInsPKXjYPlLDnROmOWforYwm9ZB97Q302y5y8EpuVyzGpvLYOqPMGktLZujQIZuCsi73MEZvVD9SVt&currency=EUR&components=messages,buttons&enable-funding=paylater";
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);

  if (document.getElementsByTagName("head")[0].contains(script)) {
    setInterval(() => {
      let paypalButton = document.getElementsByClassName("payment-method")[0];
      let price1;
      let price2;
      let amount;
      switch (vtexjs?.checkout?.orderForm?.value?.toString().length) {
        case 3:
          price1 = vtexjs?.checkout?.orderForm?.value?.toString().substr(0, 1);
          price2 = vtexjs?.checkout?.orderForm?.value?.toString().substr(1);
          break;
        case 4:
          price1 = vtexjs?.checkout?.orderForm?.value?.toString().substr(0, 2);
          price2 = vtexjs?.checkout?.orderForm?.value?.toString().substr(2);
          break;
        case 5:
          price1 = vtexjs?.checkout?.orderForm?.value?.toString().substr(0, 3);
          price2 = vtexjs?.checkout?.orderForm?.value?.toString().substr(3);
          break;
        case 6:
          price1 = vtexjs?.checkout?.orderForm?.value?.toString().substr(0, 4);
          price2 = vtexjs?.checkout?.orderForm?.value?.toString().substr(4);
          break;
      }

      if (paypalButton) {
        paypalButton.setAttribute("id", "paypal-button");
      }

      if (price1 && price2) {
        amount = Number(price1 + "." + price2);
      }

      if (paypalButton && amount) {
        paypal.Messages({ amount: amount }).render("#paypal-button");
      }
    }, 2000);
  }
});

//-----------------------------------------------------------------------
//-----------------------END PAYPAL INTEGRATION--------------------------
//-----------------------------------------------------------------------

//GA4FUNREQ47 - add_coupon
$(window).on("load", function () {
  // Process "orderFormUpdated.vtex" after DOM has totally loaded to avoid triggering event when there is a couponCode and page is refreshed manually

  $(window).on("orderFormUpdated.vtex", function () {
    insertedCouponCode = vtexjs.checkout.orderForm?.marketingData?.coupon ?? "";

    sessionStorage.setItem("currCouponCode", insertedCouponCode);

    wrongCouponMessage = vtexjs.checkout.orderForm?.messages[0]?.code;

    sessionStorage.setItem("currWrongCouponMessage ", wrongCouponMessage);

    // Save to session storage
    const couponAddEvents = window.dataLayer.filter(
      (analyticsEvent) => analyticsEvent?.event === "coupon_add"
    );

    const jsonCouponAddEvents = JSON.stringify(couponAddEvents);

    sessionStorage.setItem("currCouponAddEvents", jsonCouponAddEvents);

    // Get and parse array of couponAddEvents from session storage
    const couponAddEventsStored = sessionStorage.getItem("currCouponAddEvents");

    const parsedCouponAddEvents = JSON.parse(couponAddEventsStored);

    const indexLastCouponAddEvent = parsedCouponAddEvents.length - 1;

    const lastCouponCode =
      parsedCouponAddEvents[indexLastCouponAddEvent]?.name ?? "";

    const currentCouponCode = sessionStorage.getItem("currCouponCode");

    const isWrongCoupon = wrongCouponMessage === "couponNotFound";

    if (isWrongCoupon) {
      const messageText = vtexjs.checkout.orderForm?.messages[0]?.text ?? "";
      const wrongCouponCodeWords = messageText.split(" ");
      const wrongCouponCode = wrongCouponCodeWords[2];

      window.dataLayer.push({
        event: "coupon_add",
        coupon_validity: "false",
        name: wrongCouponCode,
      });
    } else if (!insertedCouponCode) {
      return;
    } else if (lastCouponCode === currentCouponCode) {
      sessionStorage.setItem("currCouponCode", "");
      return;
    } else if (lastCouponCode !== currentCouponCode) {
      window.dataLayer.push({
        event: "coupon_add",
        coupon_validity: "true",
        name: insertedCouponCode,
      });
    }
  });
});
// End of GA4FUNREQ47

//--------------------------------------------------------
//-------- FORCE CUSTOM DATA AFTER SMART CHECKOUT ---------
//--------------------------------------------------------
$(window).on("orderFormUpdated.vtex", () => {
  if (
    vtexjs.checkout.orderForm.userProfileId !== null &&
    vtexjs.checkout.orderForm.loggedIn == false &&
    !vtexjs.checkout.orderForm.customData?.customApps[0].fields[
    "typeOfDocument"
    ]
  ) {
    const orderForm = vtexjs.checkout.orderForm;
    const defaultCustomData = {
      requestInvoice: orderForm?.clientProfileData?.document !== "",
      typeOfDocument: "private",
      codiceFiscaleAzienda: orderForm?.clientProfileData?.document == "" ? "_" : orderForm?.clientProfileData?.document,
      sendInvoiceTo: false,
      useShippingAddress: true,
      SDIPEC: "_"
    };
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(defaultCustomData),
    };
    fetch(
      "/api/checkout/pub/orderForm/" + orderForm?.orderFormId + "/customData/fiscaldata",
      options
    ).then((response) => response.json())
      .catch((error) => console.error(error));
  }
});
//------------------------------------------------------------
//-------- END FORCE CUSTOM DATA AFTER SMART CHECKOUT ---------
//------------------------------------------------------------