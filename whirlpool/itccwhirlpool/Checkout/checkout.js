// Global variables
var userTypeStatus = "";

//-------------CHANGE HEADER LOGO SRC--------------//
//$(document).ready(() => {
//     document.getElementById('logo').src=getBindingValue();
//   });

const getBindingValue = () => {
  let url = window.location.href;
  return `/arquivos/whr-logo-${
    url?.includes("epp") ? "epp" : url?.includes("ff") ? "ff" : "vip"
  }.png`;
};

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
    description: `Ritiro del tuo vecchio elettrodomestico contestualmente alla consegna del nuovo, in conformità alle norme vigenti per la raccolta separata e lo smaltimento del Rifiuto Elettrico ed Elettronico (RAEE).`,
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
//------------ ONE TRUST  & GCM CUSTOM -------------------
//------------------------------------------
$(document).ready(function () {
  (function () {
    window.dataLayer = window.dataLayer || [];
    //consent mode
    var gtmId = "GTM-KFCFVM9";
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
    "7c483779-b7a8-45f2-8e7d-0f580bff0531"
  );
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
});

//------------------------------------------
//---------     ENERGY LABEL      ----------
//------------------------------------------

$(document).ready(function () {
  setTimeout(() => {
    getEnergyLabels();
  }, 2000);
});

function getEnergyLabels() {
  var items = vtexjs.checkout.orderForm?.items;
  var energyLabels = [];
  var forEachAsync = new Promise((resolve, reject) => {
    items?.forEach((value, index, array) => {
      Promise.all([getSpecificationFromProduct(value.productId)]).then(
        (values) => {
          let energyUrl = getValuefromSpecifications(
            values[0],
            "EnergyLogo_image"
          );
          let energyPdf = getValuefromSpecifications(
            values[0],
            "new-energy-label"
          );
          let oldEnergyPdf = getValuefromSpecifications(
            values[0],
            "energy-label"
          );
          let productInformation = getValuefromSpecifications(
            values[0],
            "product-information-sheet"
          );
          let oldProductInformation = getValuefromSpecifications(
            values[0],
            "product-fiche"
          );
          var obj = {
            label: energyUrl,
            productId: value.id,
            labelPdf: energyPdf,
            oldLabelPdf: oldEnergyPdf,
            productInformation: productInformation,
            oldProductInformation: oldProductInformation,
          };
          energyLabels.push(obj);
          if (index === array.length - 1) {
            resolve();
          }
        }
      );
    });
  });
  forEachAsync.then(() => {
    energyLabels.forEach((energyLabel) => {
      if (window.location.hash === "#/cart") {
        if (
          $(`[data-sku= ${energyLabel.productId}]`)
            .find(".product-name")
            .html()
            .indexOf("energyLabelImage") == -1
        ) {
          let coupon = $(".v-custom-addLabels-active-flag");
          if (coupon.length > 0) {
            if (energyLabel.oldLabelPdf || energyLabel.labelPdf) {
              $(`[data-sku= ${energyLabel.productId}]`)
                .find(".product-name")
                .find(coupon)
                .before(
                  $(
                    `<a href=${
                      energyLabel.oldLabelPdf || energyLabel.labelPdf
                    } target='_blank'><img src=${
                      energyLabel.label
                    } alt="energyLabel" id="energyLabelImage" class="energyLabelImage" /> </a>`
                  )
                );
              $(`[data-sku= ${energyLabel.productId}]`)
                .find(".product-name")
                .find(coupon)
                .before(
                  $(
                    `<a href=${
                      energyLabel.productInformation ||
                      energyLabel.oldProductInformation
                    } target='_blank' id="productInformationSheet" style="width: 50%; margin: 0; font-size: 1rem; font-weight: bold; text-decoration: underline;">Scheda prodotto</a>`
                  )
                );
            }
          } else {
            if (energyLabel.oldLabelPdf || energyLabel.labelPdf) {
              $(`[data-sku= ${energyLabel.productId}]`)
                .find(".product-name")
                .append(
                  `<a href=${
                    energyLabel.oldLabelPdf || energyLabel.labelPdf
                  } target='_blank'><img src=${
                    energyLabel.label
                  } alt="energyLabel" id="energyLabelImage" class="energyLabelImage" /> </a>`
                );
              $(`[data-sku= ${energyLabel.productId}]`)
                .find(".product-name")
                .append(
                  `<a href=${
                    energyLabel.productInformation ||
                    energyLabel.oldProductInformation
                  } target='_blank' id="productInformationSheet" style="width: 50%; margin: 0; font-size: 1rem; font-weight: bold; text-decoration: underline;">Scheda prodotto</a>`
                );
            }
          }
        }
      } else if (
        window.location.hash === "#/profile" ||
        window.location.hash === "#/shipping" ||
        window.location.hash === "#/payment" ||
        window.location.hash === "#/email"
      ) {
        setTimeout(() => {
          if (
            $(`[data-sku= ${energyLabel.productId}]`)
              .find(".description")
              .html()
              .indexOf("energyLabelImage") == -1
          ) {
            if (energyLabel.oldLabelPdf || energyLabel.labelPdf) {
              $(`[data-sku= ${energyLabel.productId}]`)
                .find(".description")
                .prepend(
                  `<a href=${
                    energyLabel.oldLabelPdf || energyLabel.labelPdf
                  } target='_blank'><img src=${
                    energyLabel.label
                  } alt="energyLabel" id="energyLabelImage" class="energyLabelImage" /> </a><a href=${
                    energyLabel.productInformation ||
                    energyLabel.oldProductInformation
                  } target='_blank' id="productInformationSheet" class="productInformationSheet"">Scheda prodotto</a>`
                );
              $(`[data-sku= ${energyLabel.productId}]`)
                .find(".description")
                .attr("style", "justify-content: space-between !important");
            }
          }
        }, 3000);
      }
    });
  });
}
$(window).on("hashchange", () => {
  if (window.location.hash === "#/cart") {
    getEnergyLabels();
    discountTooltip();
  } else if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/shipping" ||
    window.location.hash === "#/payment" ||
    window.location.hash === "#/email"
  ) {
    if (window.location.hash === "#/profile") {
      // disableEasyCheckout();
      // hideSaveData();
      checkNLoptin();
    }
    getEnergyLabels();
    $(".energyLabelImage").css("width", "1.6rem");
  }
});

//----------------------------------------
//---------- END ENERGY LABEL ------------
//----------------------------------------

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
    let event = new Event("updateNewsLetter.itccwhirlpool");
    window.dispatchEvent(event);
    $(".corporate-field.custom-corporate-terms")
      .find("a")
      .attr("href", "/pages/termini-e-condizioni");
  }
});

$(window).on("hashchange", function () {
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
  ) {
    let event = new Event("updateNewsLetter.itccwhirlpool");
    window.dispatchEvent(event);
    $(".corporate-field.custom-corporate-terms")
      .find("a")
      .attr("href", "/pages/termini-e-condizioni");
  }
});

function updateNewsLetterValue() {
  let value = $("#opt-in-newsletter").is(":checked");
  vtexjs.checkout.sendAttachment(
    "clientPreferencesData",
    {
      locale: vtexjs.checkout.orderForm.clientPreferencesData.locale,
      optinNewsLetter: !value,
    },
    []
  );
  fetch("/_v/wrapper/api/user", {
    method: "PATCH",
    body: JSON.stringify({
      isNewsletterOptIn: !value,
    }),
  });
}

function changeNewsletterChk() {
  if (
    vtexjs.checkout.orderForm !== undefined &&
    vtexjs.checkout.orderForm.loggedIn
  ) {
    let isOptin =
      vtexjs.checkout.orderForm.clientPreferencesData.optinNewsLetter;
    if (isOptin) {
      $(".newsletter").html(
        '<label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData"><input type="checkbox" id="opt-in-newsletter" data-bind="enable: checkout.saveData" onClick="updateNewsLetterValue()"><span class="newsletter-text" data-i18n="global.optinNewsLetter">Selezioni questa casella se non desidera ricevere comunicazioni di marketing personalizzate per e-mail ed SMS relative a prodotti, servizi e marchi di Whirlpool Corporation. Ulteriori dettagli sono disponibili nella nostra <a href="/pagine/informativa-sulla-privacy">Informativa sulla privacy</a> disponibile all\'indirizzo Informativa sulla privacy.<br><br>I riferimenti a \'Whirlpool\' devono intendersi come riferimenti alla persona giuridica in quanto il consenso viene espresso nei confronti della società e quindi per tutti i suoi marchi.</span></label>'
      );
    } else {
      $(".newsletter").html(
        '<label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData"><input type="checkbox" id="opt-in-newsletter" data-bind="enable: checkout.saveData"><span class="newsletter-text" data-i18n="global.optinNewsLetter">Selezioni questa casella se desidera ricevere comunicazioni di marketing personalizzate per e-mail ed SMS relative a prodotti, servizi e marchi di Whirlpool Corporation. Ulteriori dettagli sono disponibili nella nostra <a href="/pagine/informativa-sulla-privacy">Informativa sulla privacy</a> disponibile all\'indirizzo Informativa sulla privacy.<br><br>I riferimenti a \'Whirlpool\' devono intendersi come riferimenti alla persona giuridica in quanto il consenso viene espresso nei confronti della società e quindi per tutti i suoi marchi.Con la registrazione potrò usufruire di uno sconto del 5% valido sul primo acquisto effettuato entro 12 mesi dalla registrazione. Sconto cumulabile con le altre offerte in essere.</span></label>'
      );
    }
  } else {
    $(".newsletter").html(
      '<p class="informativa" style="font-size: 13px;margin: .5rem 0;">Ho compreso e prendo atto del contenuto dell’<a href="/pages/informativa-sulla-privacy" class="link" target="_blanck">Informativa sulla privacy</a> e:</p><label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData"><input type="checkbox" id="opt-in-newsletter" data-bind="checked: checkout.optinNewsLetter, enable: checkout.saveData"><span class="newsletter-text" data-i18n="global.optinNewsLetter">Acconsento al trattamento dei miei dati personali per permettere a Whirlpool Italia Srl di inviarmi newsletter/comunicazioni di marketing (in forma elettronica e non, anche tramite telefono, posta tradizionale, e-mail, SMS, MMS, notifiche push su siti di terze parti tra cui sulle piattaforme Facebook e Google) riguardanti prodotti e servizi di Whirlpool Italia Srl, anche da me acquistati o registrati, nonché di svolgere ricerche di mercato. </span></label>'
    );
  }
}

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

async function pushEventCheckout(stepID) {
  let orderForm = await vtexjs.checkout.getOrderForm();
  var items = orderForm.items;
  products = [];

  await Promise.all(
    items.map(async (value) => {
      var categoryIdsSplitted = value.productCategoryIds.split("/");
      let spec = await getSpecificationFromProduct(value.id);
      let category = await getStringCategoryFromId(
        categoryIdsSplitted[categoryIdsSplitted.length - 2]
      );

      var obj = {
        name: remove12ncName(value.name, value.refId),
        id: value.refId,
        price: value.isGift ? 0 : value.sellingPrice / 100,
        brand: value.additionalInfo.brandName,
        category: category.AdWordsRemarketingCode,
        variant: getValuefromSpecifications(spec, "Colore"),
        quantity: value.quantity,
        //D2CA-189
        dimension4:
          getValuefromSpecifications(spec, "sellable") === "true"
            ? "Sellable Online"
            : "Not Sellable Online",
        dimension5: getValuefromSpecifications(spec, "field5"),
      };
      products.push(obj);
    })
  );
  window.eeccheckout.location = window.location.hash;
  $("body").removeClass("checkoutEventPush");
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
    let url = new URL(window.location.href);
    let isUrlGet = url.search != "";
    let checkStep2 = step == 2 ? !isUrlGet : true;

    if (
      window.dataLayer &&
      !isLoading &&
      checkStep2 &&
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
  let step = getCheckoutStep();
  let url = new URL(window.location.href);
  let isUrlGet = url.search != "";
  let checkStep2 = step == 2 ? !isUrlGet : true;
  setTimeout(function () {
    let step = getCheckoutStep();
    if (step == 0) {
      return;
    }
    let isLoading = $("body").hasClass("checkoutEventPush");
    if (window.dataLayer && !isLoading && checkStep2) {
      $("body").addClass("checkoutEventPush");
      pushEventCheckout(step);
    }
  }, 1500);
});

function pushOptinInEvent() {
  return window.dataLayer.push({
    event: "optin_granted",
  });
}

//FUNREQ52 - Lead Generation Event
function pushLeadGenerationEvent() {
  const userEmail = document.getElementById("client-email")?.value; //D2CA-639

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
    const isTermsAccepted = $("#custom-corporate-terms").is(":checked")
      ? true
      : false;
    const isOptin = $("#opt-in-newsletter").is(":checked") ? true : false;
    const emailInput = document.getElementById("client-email")?.value;

    const leadGenerationEvents = window.dataLayer.filter(
      (analyticsEvent) => analyticsEvent?.event === "leadGeneration"
    );

    const pushedEmailList = leadGenerationEvents?.map(
      (leadGenEvent) => leadGenEvent?.email
    );

    const isEmailPushed = pushedEmailList?.includes(emailInput);

    //If previous email is the same, don't push lead generation
    if (isTermsAccepted && isOptin && isEmailPushed === false) {
      pushLeadGenerationEvent();
      pushOptinInEvent();
    }
  });
});

// End of FUNREQ52

// emailForSalesforce event - D2CA-639
function pushEmailForSalesforceEvent() {
  const userEmail = document.getElementById("client-email")?.value; //D2CA-639

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
function findVariant(data) {
  const result = data.filter((o) => o.Name == "Colore");
  return result.length > 0 ? result[0].Value[0] : "";
}
function findDimension(data, nameKey) {
  let result = data.filter((obj) => obj.Name == nameKey);
  return result[0].Value[0];
}
function costructionType(cType) {
  if (cType.indexOf("Free ") !== -1) {
    let cTypeArray = cType.split(" ");
    return cTypeArray[0] + cTypeArray[1].toLowerCase();
  } else {
    return cType.replace(" ", "-");
  }
}
function pushAddToCart(item, dataQ) {
  let categoryId = Object.keys(item.productCategories)[
    Object.keys(item.productCategories).length - 1
  ];
  Promise.all([
    getSpecificationFromProduct(item.id),
    getStringCategoryFromId(categoryId),
  ]).then((values) => {
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
              name: item.name,
              price:
                `${item.price}` == "0" ? "" : setPriceFormat(`${item.price}`),
              quantity: dataQ,
              variant: findVariant(values[0]),
              dimension4:
                findDimension(values[0], "sellable") == "true"
                  ? "Sellable Online"
                  : "Not Sellable Online",
              dimension5: costructionType(
                findDimension(values[0], "constructionType")
              ),
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
  Promise.all([
    getSpecificationFromProduct(item.id),
    getStringCategoryFromId(categoryId),
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
              name: item.name,
              price:
                `${item.price}` == "0" ? "" : setPriceFormat(`${item.price}`),
              quantity: dataQ,
              variant: findVariant(values[0]),
              dimension4:
                findDimension(values[0], "sellable") == "true"
                  ? "Sellable Online"
                  : "Not Sellable Online",
              dimension5: costructionType(
                findDimension(values[0], "constructionType")
              ),
            },
          ],
        },
      },
      event: "eec.remove",
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

/*--------------------------FEREADY-------------------------------*/
async function feReady(pageType) {
  let dataLayer = window.dataLayer || [];
  if (
    vtexjs.checkout.orderForm !== undefined &&
    vtexjs.checkout.orderForm.loggedIn
  ) {
    // // D2CA-736: New function to getUserType - "hot customer" or "cold customer"
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
  }
  // User is not logged in
  else {
    dataLayer.push({
      event: "feReady",
      status: "anonymous",
      "product-code": "",
      "product-name": "",
      "product-category": "",
      userType: "prospect", // D2CA-830: Changed to "prospect"
      pageType: pageType,
      contentGrouping: "(Other)",
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
  getEnergyLabels();
  contactUsBox();
  document.getElementById("logo").src = getBindingValue();
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

// D2CA-736: Returns "prospect" OR "hot customer" OR "cold customer"
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
//     let userTypeValue = isNewsletterOptin ? "prospect" : "lead";
//     orders.toString() == "true" ? (userTypeValue = "customer") : null;
//     return userTypeValue;
// }

/*
        -- FALTA --
        if (
            $("#opt-in-newsletter").is(":visible") &&
            $("#opt-in-newsletter").is(":checked")
          ) {
            let dL = window.dataLayer || []
            dL.push({
              event: "optin_granted",
            })
          }
        */
function normativaFGAS() {
  const items =
    vtexjs?.checkout?.orderForm?.items?.length > 0
      ? vtexjs.checkout.orderForm.items
      : null;

  let itemsSpecifications = [];
  const itemsSpec = items?.map(async (item) => {
    let itemSpecification = await getSpecificationFromProduct(item.productId);

    itemSpecification.map((spec) => {
      if (spec.Name === "fgas" && spec.Value == "false") {
        if (
          $("tr[data-sku=" + item.productId + "] .normativaFGAS").length == 0
        ) {
          $("tr[data-sku=" + item.id + "]")
            .find(".extra-services-label")
            .each(function () {
              if (
                $(this)[0].childNodes[2].nodeValue.trim() === "Installazione"
              ) {
                $(this).parent("div").hide();
              }
            });
          $("tr[data-sku=" + item.id + "]").append(
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
 <a href="https://itccwhirlpool.vtexcommercestable.com.br/api/dataentities/AT/documents/ac556070-2a90-11ed-835d-0e84a6b08845/file/attachments/FGAS_Clima_rev_PB.pdf" target="_blank">
                             <img src="https://itccwhirlpool.vteximg.com.br/arquivos/f-gas-pdf-image.png" alt="autocertificazione">
                             </a>
                            </div>
                          </div>
                                                      `
          );
        }
      }
    });
    itemsSpecifications?.push(itemSpecification);
  });
  console.log(itemsSpec);
  return itemsSpecifications ? itemsSpecifications : null;
}

function fgasSummary() {
  const items =
    vtexjs?.checkout?.orderForm?.items?.length > 0
      ? vtexjs.checkout.orderForm.items
      : null;

  let itemsSpecifications = [];
  const itemsSpec = items?.map(async (item) => {
    let itemSpecification = await getSpecificationFromProduct(item.productId);

    itemSpecification.map((spec) => {
      let specValue = spec.Value[0] === "false";
      if (spec.Name === "fgas" && specValue) {
        let fgasBox = $(".cart-items.unstyled.clearfix.v-loaded").find(
          "li[data-sku=" + item.id + "]"
        );
        if ($("li[data-sku=" + item.id + "].normativaFGAS").length == 0) {
          $(fgasBox).append(
            `<div class="normativaFGAS fgasSummary">
                            <div class="wrapper--fgas wrapper-fgas-summary">
              <p class="paragraph--fgas paragraph-fgas-summary">
                              E’ obbligatorio inviare la dichiarazione compilata e firmata all’indirizzo email <a class='emailFgasSummary' href="mailto:directsalesonline@whirlpool.com">directsalesonline@whirlpool.com</a> per poter spedire il prodotto soggetto a normativa F-GAS. L’invio della dichiarazione deve avvenire entro TRE giorni dalla ricezione della conferma d’ordine. La dichiarazione da compilare può essere trovata in allegato alla conferma d’ordine, nella pagina prodotto e nell’apposita sezione Supporto-->Climatizzatori F-GAS.
                             </p>
 <a href="https://itccwhirlpool.myvtex.com/api/dataentities/AT/documents/c8edebf5-3a48-11ed-83ab-0ef896f778b5/file/attachments/FGAS%20Clima.pdf" target="_blank">
                             <img src="https://itccwhirlpool.vteximg.com.br/arquivos/f-gas-pdf-image.png" alt="autocertificazione">
                             </a>
                            </div>
                          </div>
                                                      `
          );
        }
      }
    });
    itemsSpecifications.push(itemSpecification);
  });
  console.log(itemsSpec);
  return itemsSpecifications;
}

$(window).on("load", function () {
  $(".custom-corporate-terms")
    .find("a")
    .prop("href", "/pages/termini-e-condizioni");
  if (window.location.hash === "#/cart") {
    normativaFGAS();
  }
  if (
    window.location.hash === "#/email" ||
    window.location.hash === "#/profile"
  ) {
    setTimeout(() => {
      fgasSummary();
    }, 3000);
  }
});
$(window).on("hashchange", function () {
  if (window.location.hash === "#/cart") {
    normativaFGAS();
  }
  setTimeout(() => {
    fgasSummary();
  }, 3000);
});

//------------------------------------------
//---------NEW_RELIC_INTEGRATION------------
//------------------------------------------

$(document).on("ready", function () {
  let script = document.createElement("script");
  script.src = "/arquivos/new_relic.js";
  script.type = "text/javascript";
  document.head.appendChild(script);
});

//------------------------------------------
//-------pagodil__fe__integration-----------
//------------------------------------------

function checkConditionForPagodil() {
  let orderForm = vtexjs.checkout.orderForm || {};
  if (!orderForm) {
    return false;
  } else {
    return (
      orderForm?.customData?.customApps[0]?.fields?.requestInvoice == "true" && // Added optional chaining so that it does not break in WHP IT QA env
      orderForm.clientProfileData.document !== "" &&
      orderForm.value >= 30000 &&
      orderForm.value <= 300000
    );
  }
}

$(window).on("orderFormUpdated.vtex", function () {
  if (window.location.hash == "#/payment") {
    let pagodilTab = $(
      "#payment-group-custom202PaymentGroupPaymentGroup.pg-pagodil"
    );
    if (pagodilTab.length == 0) {
      return;
    }
    if (checkConditionForPagodil()) {
      if (pagodilTab.hasClass("noCLick")) {
        pagodilTab.removeClass("noClick");
      }
    } else {
      if (pagodilTab.hasClass("active")) {
        let paypalTab = $("#payment-group-payPalPaymentGroup");
        paypalTab.trigger("click");
      }
      if (!pagodilTab.hasClass("noCLick")) {
        pagodilTab.addClass("noClick");
      }
      let pagodilMessage = $(
        "#payment-group-custom202PaymentGroupPaymentGroup.pg-pagodil .payment-group-item-text"
      );
      if ($("#error-message-pagodil").length == 0) {
        pagodilMessage.after(
          "<span id='error-message-pagodil'>Per utilizzare questo metodo di pagamento assicurati che l’importo totale del tuo ordine sia compreso tra €300 e €3.000 e che sia stata richiesta la fattura nella prima parte dei dati personali, compilando il codice fiscale. Per informazioni o supporto chiama il numero 800140004.</span>"
        );
      }
    }
  }
});

function getPriceFromOrderForm(installNumber) {
  return (vtexjs.checkout.orderForm.value / 100 / installNumber)
    .toFixed(2)
    .replace(".", ",");
}

$(window).on("orderFormUpdated.vtex", function () {
  if (window.location.hash == "#/payment") {
    let pagodilTab = $(
      "#payment-group-custom202PaymentGroupPaymentGroup.pg-pagodil"
    );
    if (pagodilTab.length == 0) {
      return;
    }
    if (pagodilTab.hasClass("active")) {
      setTimeout(() => {
        if ($("#installment-pagodil-message").length == 0) {
          $(
            "#payment-group-custom202PaymentGroupPaymentGroup.pg-pagodil + div .installments span"
          ).after(
            "<span id='installment-pagodil-message'>Dieci rate di " +
              getPriceFromOrderForm(10) +
              " € al mese</span>"
          );
        }
      }, 1000);
    }
  }
});
//------------------------------------------
//---------NEWSLETTER UPDATE----------------
//------------------------------------------
window.optin = {
  isRequiredNewsletter: false,
};

window.addEventListener("updateNewsLetter.itccwhirlpool", async function () {
  let orderForm = vtexjs.checkout.orderForm;
  let optin = window.optin || {};
  if (orderForm && orderForm.loggedIn) {
    if (!optin.isRequiredNewsletter) {
      vtexjs.checkout
        .sendAttachment(
          "clientPreferencesData",
          {
            locale: orderForm.clientPreferencesData.locale,
            optinNewsLetter: await fetch(
              "/_v/wrapper/api/user/email/userinfo?email=" +
                orderForm.clientProfileData.email,
              { method: "GET" }
            )
              .then((res) => res.json())
              .then((user) => user[0].isNewsletterOptIn),
          },
          []
        )
        .then((res) => {
          console.log(res);
          optin.isRequiredNewsletter = true;
          changeNewsletterChk();
        });
    }
  }
  changeNewsletterChk();
});
//------------------------------------------
//---------TELEPHONE NUM VALIDATION---------
//------------------------------------------

$(document).on("blur", "input#client-phone", function () {
  let val = $("input#client-phone").val();
  if (val.length == 0) {
    removePhoneError();

    return;
  } else {
    if (
      val.length < 9 ||
      val.length > 15 ||
      val.match(/^\+?[1-9]\d{1,15}$/gm) == null
    ) {
      $("#go-to-shipping").css({ "pointer-events": "none" });
      setTimeout(() => {
        generatePhoneError();
      }, 1000);
    } else {
      removePhoneError();
    }
  }
  return;
});
function generatePhoneError() {
  let span =
    '<span class="help error" id="phoneError" style="">Il valore inserito non è valido</span>';
  if ($("#phoneError").length == 0) {
    $("input#client-phone").after(span);
    $("input#client-phone").addClass("error");
  }
}
function removePhoneError() {
  $("#phoneError").length > 0 ? $("#phoneError").remove() : null;
  $("input#client-phone").removeClass("error");
  $("#go-to-shipping").css({ "pointer-events": "all" });
}

$(window).on("orderFormUpdated.vtex", function () {
  let hash = window.location.hash;
  if (hash !== "#/profile" && hash !== "#/email" && hash !== "#/cart") {
    let val = vtexjs?.checkout?.orderForm?.clientProfileData?.phone;
    if (
      val &&
      (val.length < 9 ||
        val.length > 15 ||
        val.match(/^\+?[1-9]\d{1,15}$/gm) == null)
    ) {
      if (val.includes("*")) {
        // IF PRIVATE DATA
        return;
      }
      window.location.hash = "#/profile";
      setTimeout(() => {
        $("input#client-phone").blur();
      }, 1000);
    }
  }
});
//------------------------------------------
//---REMOVE PERSONA GIURIDICA FROM RICHIESTA FATTURA LABEL---------
//------------------------------------------
$(document).ready(function () {
  $(window).on("hashchange", function () {
    if (
      window.location.hash === "#/profile" ||
      window.location.hash === "#/email"
    ) {
      changeNomeCognomeFatturaLabel();
    } else if (
      window.location.hash === "#/shipping" ||
      window.location.hash === "#/payment"
    ) {
      shippingTranslationLabel();
    }
  });
  $(window).on("DOMContentLoaded", function () {
    if (
      window.location.hash === "#/profile" ||
      window.location.hash === "#/email"
    ) {
      changeNomeCognomeFatturaLabel();
    } else if (
      window.location.hash === "#/shipping" ||
      window.location.hash === "#/payment"
    ) {
      shippingTranslationLabel();
    }
  });
  function changeNomeCognomeFatturaLabel() {
    const checkCurrentLanguage =
      vtexjs?.checkout?.orderForm?.clientPreferencesData?.locale === "it-IT"
        ? true
        : false;
    var nomeCognomeBox = document.getElementsByClassName(
      "corporate-field custom-corporate-name"
    )[0];
    var fiscalCode = document.getElementsByClassName(
      "corporate-field custom-corporate-document2"
    )[0];
    var pecOptional = document.getElementsByClassName(
      "corporate-field custom-corporate-pec"
    )[0];
    var checkboxInvoiceAddress =
      document.getElementsByClassName("shipping-addr-text")[0];
    var selectYourState = document.getElementsByClassName(
      "corporate-field user-country-field invoice-address-input"
    )[0];
    var selectYourStatePlaceholder = $(
      ".corporate-field.user-country-field.invoice-address-input"
    )
      .find("select")
      .find("option")[0];
    var invoiceAddress = document.getElementsByClassName(
      "corporate-field custom-corporate-street invoice-address-input"
    )[0];
    var houseNumber = document.getElementsByClassName(
      "corporate-field half custom-corporate-number invoice-address-input"
    )[0];
    var postalCode = document.getElementsByClassName(
      "corporate-field custom-corporate-postal-code invoice-address-input"
    )[0];
    var invoiceCity = document.getElementsByClassName(
      "corporate-field custom-corporate-city invoice-address-input"
    )[0];
    var invoiceProvince = document.getElementsByClassName(
      "corporate-field custom-corporate-state invoice-address-input"
    )[0];
    var invoiceProvincePlaceholder = $(
      ".corporate-field.custom-corporate-state.invoice-address-input"
    )
      .find("select")
      .find("option")[0];
    if (nomeCognomeBox !== undefined) {
      checkCurrentLanguage
        ? (nomeCognomeBox.firstElementChild.innerText = "Nome e Cognome")
        : (nomeCognomeBox.firstElementChild.innerText = "Name and surname");
    }
    if (fiscalCode !== undefined && !checkCurrentLanguage) {
      fiscalCode.firstElementChild.innerText = "Fiscal code";
    }
    if (pecOptional !== undefined && !checkCurrentLanguage) {
      pecOptional.firstElementChild.innerText = "PEC (optional)";
    }
    if (checkboxInvoiceAddress !== undefined && !checkCurrentLanguage) {
      checkboxInvoiceAddress.innerText =
        "The billing address is the same of the shipping address";
    }
    if (selectYourStatePlaceholder !== undefined && !checkCurrentLanguage) {
      selectYourStatePlaceholder.innerText = "Select your state";
    }
    if (selectYourState !== undefined && !checkCurrentLanguage) {
      selectYourState.firstElementChild.innerText = "Select your state";
    }
    if (invoiceAddress !== undefined && !checkCurrentLanguage) {
      invoiceAddress.firstElementChild.innerText = "Address";
    }
    if (houseNumber !== undefined && !checkCurrentLanguage) {
      houseNumber.firstElementChild.innerText = "House number";
    }
    if (postalCode !== undefined && !checkCurrentLanguage) {
      postalCode.firstElementChild.innerText = "Postal code";
    }
    if (invoiceCity !== undefined && !checkCurrentLanguage) {
      invoiceCity.firstElementChild.innerText = "City";
    }
    if (invoiceProvince !== undefined && !checkCurrentLanguage) {
      invoiceProvince.firstElementChild.innerText = "Province";
    }
    if (invoiceProvincePlaceholder !== undefined && !checkCurrentLanguage) {
      invoiceProvincePlaceholder.innerText = "Province";
    }
  }
  function shippingTranslationLabel() {
    const checkCurrentLanguage =
      vtexjs?.checkout?.orderForm?.clientPreferencesData?.locale === "it-IT"
        ? true
        : false;
    const shippingAddress = $("#address1-label")[0];
    const shippingCodeNumber = $("#number-label")[0];
    const shippingAddressMore = $("#address2-label")[0];
    const shippingCountryLabel = $("#country-label")[0];
    const shippingCityLabel = $("#city-label")[0];
    const shippingProvinceLabel = $("#state-label")[0];
    const shippingProvinceLabelPlaceholder = $("#ship-state").find("option")[0];
    const shippingPostalCode = $("#postalCode-label")[0];
    const paymentCreditCard = $(".payment-group-item-text")[1];
    if (shippingAddress !== undefined && !checkCurrentLanguage) {
      shippingAddress.innerText = "Address";
    }
    if (shippingCodeNumber !== undefined && !checkCurrentLanguage) {
      shippingCodeNumber.innerText = "Code number";
    } else if (shippingCodeNumber !== undefined && checkCurrentLanguage) {
      shippingCodeNumber.innerText = "Numero civico";
    }
    if (shippingAddressMore !== undefined && !checkCurrentLanguage) {
      shippingAddressMore.innerText = "Additional address information";
    } else if (shippingAddressMore !== undefined && checkCurrentLanguage) {
      shippingAddressMore.innerText = "Informazioni aggiuntive indirizzi";
    }
    if (shippingCountryLabel !== undefined && !checkCurrentLanguage) {
      shippingCountryLabel.innerText = "State";
    } else if (shippingCountryLabel !== undefined && checkCurrentLanguage) {
      shippingCountryLabel.innerText = "Stato";
    }
    if (shippingCityLabel !== undefined && !checkCurrentLanguage) {
      shippingCityLabel.innerText = "City";
    }
    if (shippingProvinceLabel !== undefined && !checkCurrentLanguage) {
      shippingProvinceLabel.innerText = "Province";
    }
    if (
      shippingProvinceLabelPlaceholder !== undefined &&
      !checkCurrentLanguage
    ) {
      shippingProvinceLabelPlaceholder.innerText = "Province";
    }
    if (shippingPostalCode !== undefined && !checkCurrentLanguage) {
      shippingPostalCode.innerText = "Postal code";
    }
    if (paymentCreditCard !== undefined && !checkCurrentLanguage) {
      paymentCreditCard.innerText = "Credit Card";
    }
  }
});
//-----------------------------------------------------------------------
//-----REMOVE CF WHEN RICHIESTA FATTURA IS UNCHECKED---------
//-----------------------------------------------------------------------
function updateInput() {
  if (document.getElementById("custom-corporate-document").value) {
    document.getElementById("custom-corporate-document").value = "";
  }
}
$(document).on("click", "input#opt-in-invoice", function () {
  if (!$("#opt-in-invoice").is(":checked")) {
    updateInput();
  }
});
$(document).on("click", "a#payment-group-SatispayPaymentGroup", function () {
  const satispayBox = $("#payment-group-SatispayPaymentGroup")[0].nextSibling;
  satispayBox.setAttribute("id", "sastispaySibling");
  console.log(
    "🚀 ~ file: checkout.js ~ line 978 ~ $('sastispaySibling')",
    $("sastispaySibling")
  );
  $("#sastispaySibling").empty();
  console.log(
    "🚀 ~ file: checkout.js ~ line 978 ~ $('sastispaySibling')",
    $("sastispaySibling")
  );
  $("#sastispaySibling").empty().append(`<div class="satispayBox">
  <h2 class="satispayBoxTitle">Paga in un batter d'occhio</h2>
  <div class="satispayBoxes">
    <div class="satispaySubBox">
      <h3 class="satispaySubTitle">Iscriviti</h3>
      <p class="satispayDescription">
        Per creare il tuo account, ti bastano un <b>documento d'identità</b>,
        l'<b>IBAN</b> del tuo conto corrente e il tuo <b>codice fiscale</b>.
      </p>
    </div>
    <div class="satispaySubBox">
      <h3 class="satispaySubTitle">Decidi il tuo budget</h3>
      <p class="satispayDescription">
        Seleziona l'<b>importo minimo</b> di cui vuoi disporre su Satispay ogni
        settimana.
      </p>
    </div>
    <div class="satispaySubBox satispayImgGrey">
        <img
          alt="satispayMockImg"
          src="https://itwhirlpool.vtexassets.com/assets/vtex.file-manager-graphql/images/edff1896-6a66-4fd8-a79f-f470cd4668d1___03ca69338d7ee07fb00db1fb5e9fef3c.png"
          class="sastispayImg"
        />
        <p class="satispayDescriptionLittle">
            Dopo aver cliccato "Completa ordine", sarai reindirizzato su Satispay per completare il tuo acquisto in modo sicuro.
          </p>
    </div>
  </div>
</div>
`);
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

//------------------------------------------
//-------- VALIDATION CHECKBOX -------------
//------------------------------------------

$(window).on("load", function () {
  termsChecked();
  setInterval(() => {
    $(".corporate-field.custom-corporate-terms")
      .find("a")
      .attr("href", "/pages/termini-e-condizioni");
    // shippingTranslationLabel();
  }, 250);
});

function termsChecked() {
  $(window).on("hashchange", function () {
    $("head").append(
      '<style>.corporate-field.custom-corporate-terms:after{content:""'
    );
    var element = document.getElementById("custom-corporate-terms");
    element.classList.remove("checkboxRed");

    document
      .querySelector(".submit.btn.btn-large.btn-success")
      .addEventListener("click", function () {
        if (
          document.querySelector(
            ".input-xlarge.custom-corporate-input.required"
          ).checked == false
        ) {
          $("head").append(
            '<style>.corporate-field.custom-corporate-terms:after{content:"Accettare i termini e condizioni per continuare"; color: #dd4b39; font-size: 12px }</style>'
          );
          element.classList.add("checkboxRed");
        } else {
          $("head").append(
            '<style>.corporate-field.custom-corporate-terms:after{content:""'
          );
          element.classList.remove("checkboxRed");
        }
      });

    var checkbox = document.querySelector("input#custom-corporate-terms");
    checkbox.addEventListener("change", function () {
      if (this.checked) {
        element.classList.remove("checkboxRed");
      } else {
        element.classList.add("checkboxRed");
      }
    });
  });
}

//------------------------------------------
//-------- END VALIDATION CHECKBOX ---------
//------------------------------------------

//------------------------------------------
//------------- TRANSLATIONS ---------------
//------------------------------------------
function translateCheckout() {
  const locale =
    vtexjs?.checkout?.orderForm?.clientPreferencesData?.locale === "it-IT"
      ? true
      : false;
  if (window.location.hash == "#/cart") {
    $(".v-custom-product-item-wrap")
      .find(".product-name")
      .find(".seller")[0].children[1].textContent = "Whirlpool Italia";
  } else if (
    window.location.hash == "#/profile" ||
    window.location.hash == "#/email"
  ) {
    const frontMessageDetails = $(".vtex-front-messages-detail")[0];
    const mandatoryFields = $(".invoiceMandatoryFields")[0];
    const invoiceText = $(".invoice-text");
    const customCorporateTerms = $(
      ".corporate-field.custom-corporate-terms"
    ).find("span");
    if (!locale && frontMessageDetails) {
      //english
      frontMessageDetails.textContent = "Please fill in all required fields";
    }
    if (!locale && mandatoryFields) {
      //english
      mandatoryFields.textContent = "(*) Mandatory fields";
    }
    if (!locale && invoiceText) {
      //english
      invoiceText[0].textContent = "Invoice request";
      invoiceText.append(
        `<span class="invoice-text-light">(There is no billing with VAT)</span>`
      );
    } else {
      //italian
      invoiceText[0].textContent = "Richiesta Fattura";
      invoiceText.append(
        `<span class="invoice-text-light">(Non è prevista la fatturazione con P.Iva)</span>`
      );
    }
    if (!locale && customCorporateTerms) {
      customCorporateTerms.html(
        "I have read and agreed <a href=/pages/termini-e-condizioni target=_blank>Terms and conditions</a> of Whirlpool Italy*."
      );
    }
  }
}

$(document).ready(function () {
  setInterval(() => {
    $('.extra-services-price:contains("Gratuito")').css("color", "#edb112");
    translateCheckout();
    // tradePolicyRemoval()
  }, 500);
});

//------------------------------------------
//----------- END TRANSLATIONS -------------
//------------------------------------------

//------------------------------------------
//------------- CONTACT US BOX ---------------
//------------------------------------------
function contactUsBox() {
  $(".cart-fixed").append(
    `<div class='contact-us-box'>
            <div class='contact-us-box_needHelp'>
                <p>Hai bisogno d'aiuto?</p>
            </div>
            <div class='contact-us-box_products'>
                <p class='contact-us-box_title'>Elettrodomestici</p>
                <a href='mailto: directsalesonline@whirlpool.com' class='contact-us-box_products_mail-link'>directsalesonline@whirlpool.com</a>
            </div>
            <div class='contact-us-box_number'>
                <p class='contact-us-box_title'>Numero Verde Gratuito:</p>
                <a href='tel: 800.140.004' class='contact-us-box_number_link'>800.140.004</a>
                <p>Lun-Ven dalle 8:30-12:30 / 13:30 - 17:30</p>
            </div>
            <div class='contact-us-box_wpro'>
                <p class='contact-us-box_title'>Accessori WPRO</p>
                <a href='mailto: servizioclienti.whirlpool.it@whirlpool.com' class='contact-us-box_wpro_mail-link'>servizioclienti.whirlpool.it@whirlpool.com</a>
            </div>
            <div class='contact-us-box_contact-center'>
                <p class='contact-us-box_title'>Contact Center</p>
                <p class='noMarginBottom'>Per richieste di assistenza ed estensioni di garanzia</p>
                <p>Whirlpool - Hotpoint - Indesit</p>
            </div>
            <div class='contact-us-box_unique-number'>
                <p class='contact-us-box_title'>Numero unico:</p>
                <a href='tel: 02.20.30' class='contact-us-box_unique-number_mail-link'>02.20.30*</a>
            </div>
            <div class='contact-us-box_postilla'>
                <p>*al costo di una chiamata a rete fissa secondo il piano tariffario previsto dal proprio operatore.<br>[Lun-Ven dalle 9:00 alle 18:00]</p>
            </div>
        </div>`
  );
}
//------------------------------------------
//----------- END CONTACT US BOX -----------
//------------------------------------------

// Remove trade policy from additional service
$(window).on("load", function () {
  setInterval(() => {
    $(".extra-services-label").each(function () {
      if (
        $(this)[0].childNodes[2].nodeValue.trim().split("_")[1] !== undefined
      ) {
        let updatedValue = $(this)[0]
          .childNodes[2].nodeValue.trim()
          .split("_")[1];
        $(this)[0].childNodes[2].nodeValue = updatedValue;
      }
    });
    $(".product-name > span").each(function () {
      if (
        $(this)[0].childNodes[0].nodeValue.trim().split("_")[1] !== undefined
      ) {
        let updatedValue = $(this)[0]
          .childNodes[0].nodeValue.trim()
          .split("_")[1];
        $(this)[0].childNodes[0].nodeValue = updatedValue;
      }
    });
  }, 250);
});

//   CUSTOM DATA

let checkNLoptin = () => {
  var goToShipping = document.getElementById("go-to-shipping");
  goToShipping.addEventListener("click", function () {
    const isOptin = $("#opt-in-newsletter").is(":checked") ? true : false;
    isOptin &&
      vtexjs.checkout.sendAttachment("clientPreferencesData", {
        locale: vtexjs.checkout.orderForm?.clientPreferencesData?.locale,
        optinNewsLetter: true,
      });
    //Custom field profile pushed according to optin value
    pushProfileCustomField(isOptin);
    if (vtexjs.checkout?.orderForm?.loggedIn) {
      pushEmailCustomField();
    }
  });
};

const pushEmailCustomField = () => {
  vtexjs.checkout.setCustomData({
    app: "profile",
    field: "email",
    value: vtexjs.checkout.orderForm?.clientProfileData?.email,
  });
};

const pushProfileCustomField = (isOptin) => {
  vtexjs.checkout.setCustomData({
    app: "profile",
    field: "optin",
    value: isOptin ? true : false,
  });
};

const pushAccessCodeCustomField = (sessionStorageData) => {
  vtexjs.checkout.setCustomData({
    app: "profile",
    field: "accessCode",
    value: sessionStorageData ? sessionStorageData : "_",
  });
};

const pushLocaleLangCustomField = (lang) => {
  vtexjs.checkout.setCustomData({
    app: "profile",
    field: "locale",
    value: lang ? lang : "",
  });
};

$(window).on("load", () => {
  pushAccessCodeCustomField(window.sessionStorage.getItem("sid"));
  let locale = document.getElementsByTagName("html")[0].getAttribute("lang");
  if (locale) {
    try {
      pushLocaleLangCustomField(locale);
    } catch (err) {
      console.log(err, "locale lang err");
    }
  }
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/shipping" ||
    window.location.hash === "#/payment" ||
    window.location.hash === "#/email"
  ) {
    //Custom field profile pushed according to optin value
    pushProfileCustomField(
      vtexjs.checkout.orderForm?.clientPreferencesData?.optinNewsLetter || false
    );
  }
});

//------------------------------------------
//--------------- DISABLE CREATION OF MYACCOUNT AND CREATE FAKE EMAIL INPUT ---------------
//------------------------------------------
const disableMyAccount = async () => {
  if (!vtexjs.checkout?.orderForm?.loggedIn) {
    const fakeEmailValue =
      vtexjs.checkout.orderForm?.customData?.customApps?.find(
        (data) => data.id == "profile"
      )?.fields?.email || "";
    //If user is not logged in replace the email field with a fake one
    const fakeEmail = `<input class="client-email-custom-profile" type="email" id="client-email-custom" required name="email" value="${fakeEmailValue}">`;
    if (!$(".client-email-custom-profile").length) {
      $(".client-email").append(fakeEmail);

      //Fake Email validation
      const emailInput = $(".client-email-custom-profile");
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const spanToAppend = (label) =>
        `<span class="customError">${label}</span>`;
      const emptyValueLabel = "Questo campo è obbligatorio";
      const wrongEmailValueLabel =
        "Inserire un indirizzo email valido, grazie.";
      emailInput.on("blur", function (e) {
        if (e.currentTarget.value.trim() == "") {
          emailInput.addClass("error");
          emailInput.parent().append(spanToAppend(emptyValueLabel));
        } else if (!emailRegex.test(e.currentTarget.value)) {
          emailInput.addClass("error");
          emailInput.parent().append(spanToAppend(wrongEmailValueLabel));
        } else {
          emailInput.removeClass("error");
          vtexjs.checkout.setCustomData({
            app: "profile",
            field: "email",
            value: e.currentTarget.value.trim(),
          });
        }
      });

      //Remove the error label
      emailInput.on("focus", function () {
        emailInput.siblings(".customError").remove();
        emailInput.removeClass("error");
      });
    }

    //Retrieving the fake email
    const fakeEmailValueResult = await fetch(
      "/v1/wrapper/api/emailgenerator",
      options
    )
      .then((response) => response.json())
      .catch((err) => console.error(err));

    $("#client-email").prop("value", fakeEmailValueResult?.email);
  }
};

var waitForEl = function (selector, callback) {
  let element = document.querySelector(selector);
  if (
    element &&
    (window.getComputedStyle(element).visibility == "visible" ||
      document.querySelector(selector).length > 0)
  ) {
    callback();
  } else {
    setTimeout(function () {
      waitForEl(selector, callback);
    }, 100);
  }
};

const replaceEmailTextWithFake = () => {
  waitForEl(".client-profile-email", function () {
    if (!vtexjs.checkout?.orderForm?.loggedIn) {
      const fakeEmail = vtexjs.checkout.orderForm?.customData?.customApps?.find(
        (data) => data.id == "profile"
      )?.fields?.email;
      $(".client-profile-email").children(".email").text(fakeEmail);
    }
  });
};

const discountTooltip = () => {
  const checkCurrentLanguage =
    vtexjs?.checkout?.orderForm?.clientPreferencesData?.locale === "it-IT"
      ? true
      : false;
  let discount = $(".summary-template-holder")
    .find(".summary-totalizers")
    .find(".Discounts")
    .find(".info").append(`<div class="tooltip tooltipMobile">
    <img class="icon-info-sign" src="/arquivos/inf-info-cart.svg" alt="" />
    <span class="tooltiptext">${
      checkCurrentLanguage
        ? "Dettagli degli sconti applicati"
        : "Details of the discounts applied"
    }</span>
  </div>`);
  return discount;
};
$(window).on("orderFormUpdated.vtex", function () {
  if (window.location.hash === "#/cart") {
    setTimeout(() => {
      discountTooltip();
    }, 1000);
  }
});

$(document).ready(function () {
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
  ) {
    waitForEl("#client-email", function () {
      if (!vtexjs.checkout?.orderForm?.loggedIn) {
        $("#client-email").css("display", "none");
      }
    });
    setTimeout(() => {
      disableMyAccount();
    }, 1000);
  } else {
    setTimeout(() => {
      replaceEmailTextWithFake();
      discountTooltip();
    }, 1000);
  }
});

$(window).on("hashchange", () => {
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
  ) {
    waitForEl("#client-email", function () {
      if (!vtexjs.checkout?.orderForm?.loggedIn) {
        $("#client-email").css("display", "none");
      }
    });
    setTimeout(() => {
      disableMyAccount();
    }, 1000);
  } else {
    replaceEmailTextWithFake();
  }
});
