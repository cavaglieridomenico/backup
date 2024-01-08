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
    }, 2000);
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

//------------------------------------------
//-------- SET VTEX APPS CONFIG --------
//-----------------------------------------
function setVtexAppsConfig(config, appName) {
  //------------ INVOICE ADDRESS -------------
  if (appName == "checkout-v6-invoice-data") {
    config.locale = "pl";
    config.invoiceDataMandatory = false;
    config.showSDIPECSelector = false;
    config.defaultSDIPEC = "pec";
    config.showPersonTypeSelector = true;
    config.defaultPersonType = "private";
    config.requiredFields.pl.profile = [
      "user-person-type",
      "custom-corporate-name",
    ];
  }

  //---------- CUSTOM CHECKBOX (Vtex)----------
  if (appName == "checkout-v6-terms-conditions") {
    config.locale = "pl";
    config.checkbox = [
      {
        html: "<span>Zapoznałem się i akceptuję<a href='/regulamin-sklepu' target='_blank'> Regulamin sklepu</a>*</span>",
      },
    ];
  }
}

//------------------------------------------
//--------------- CUSTOM PREFILLING ---------------
//------------------------------------------
function prefill() {
  $("#custom-corporate-name").val(
    ($("#client-first-name").val() + " " + $("#client-last-name").val()).trim()
  );
}

window.onload = function () {
  $("#client-first-name").change(function () {
    prefill();
  });

  $("#client-last-name").change(function () {
    prefill();
  });
};

//------------------------------------------
//---------ENERGY LABEL------
//------------------------------------------

$(document).ready(function () {
  setTimeout(() => {
    getEnergyLabels();
    if (
      window.location.hash == "#/email" ||
      window.location.hash === "#/profile"
    ) {
      $(".form-step.box-edit")
        .find(".submit.btn-submit-wrapper")
        .find("#go-to-shipping")
        .text("Dalej");
    }
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
                    } target='_blank' id="productInformationSheet" style="width: 50%; margin: 0; font-size: 1rem; font-weight: bold; text-decoration: underline;">Karta Produktu </a>`
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
                  } target='_blank' id="productInformationSheet" style="width: 50%; margin: 0; font-size: 1rem; font-weight: bold; text-decoration: underline;">Karta Produktu </a>`
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
              ?.indexOf("energyLabelImage") == -1
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
                  } target='_blank' id="productInformationSheet" class="productInformationSheet"">Karta Produktu </a>`
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

$(window).on("load", function () {
  if (window.location.hash == "#/payment") {
    $("a[data-name='Szybki przelew online'")
      .find("span.payment-group-item-text")
      .text("Szybka płatność online");
    $("a[data-name='Credit card'")
      .find("span.payment-group-item-text")
      .text("Karta płatnicza");
    appendHtmlOnPaymentMethod();
  }
  if (window.location.hash == "#/cart") {
    $("#cart-to-orderform").text("Zatwierdź");
  }
});
$(window).on("hashchange", () => {
  if (window.location.hash == "#/shipping") {
    $("label#Standard")
      .find("div.vtex-omnishipping-1-x-leanShippingTextLabel")
      .text("Dostawa bez wniesienia");
    $("label#Floor")
      .find("div.vtex-omnishipping-1-x-leanShippingTextLabel")
      .text("Dostawa z wniesieniem");
  }
  if (
    window.location.hash == "#/email" ||
    window.location.hash === "#/profile"
  ) {
    $(".form-step.box-edit")
      .find(".submit.btn-submit-wrapper")
      .find("#go-to-shipping")
      .text("Dalej");
  }
});

$(window).on("hashchange", () => {
  if (window.location.hash === "#/cart") {
    getEnergyLabels();
  } else if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/shipping" ||
    window.location.hash === "#/payment" ||
    window.location.hash === "#/email"
  ) {
    getEnergyLabels();
  }
});

//------------------------------------------
//--------------ADD TOOLTIP-----------------
//------------------------------------------
//------------------------------------------

function modalPopupPre() {
  let firstDiv = document.getElementById("tooltipModal-288");
  firstDiv.style.display = "block";
}

function modalPopupSel() {
  let firstDiv = document.getElementById("tooltipModal-289");
  firstDiv.style.display = "block";
}

//------------------------------------------
//---------EXTRA_SERVICES_CONFIG------
//------------------------------------------
function checkout_v6_additional_services_checkboxes_initialize(EXTRA_SERVICES) {
  EXTRA_SERVICES["Instalacja sprzętu"] = {
    selected: false,
    selectionEnabled: true,
    order: 1,
    description: `Instalacja sprzętu`,
  };

  EXTRA_SERVICES["Darmowy odbiór starego sprzętu"] = {
    selected: false,
    selectionEnabled: true,
    warrantyGroup: false,
    order: 2,
    description: `Darmowy odbiór starego sprzętu może odbyć się od 1 do 10 dni po dostawie. Pamiętaj o odinstalowaniu sprzętu i przygotowaniu go do odbioru. Dla zamówień "bez wniesienia" zużyte urządzenie zostanie odebrane z tego samego miejsca, w którym kurier zostawił nowe urządzenie (bez zniesienia z piętra).`,
  };
  EXTRA_SERVICES["Dostawa z wniesieniem"] = {
    selected: false,
    selectionEnabled: true,
    warrantyGroup: false,
    order: 3,
    description: `Dostawa z wniesieniem.`,
  };
  EXTRA_SERVICES["Przedłużona gwarancja producenta"] = {
    selected: false,
    selectionEnabled: true,
    warrantyGroup: true,
    order: 4,
    description: `Przedłużona gwarancja producenta`,
  };
  EXTRA_SERVICES["2 lata gwarancji"] = {
    selected: false,
    selectionEnabled: true,
    warrantyGroup: true,
    order: 4,
    description: `2 lata gwarancji`,
  };
}

$(window).on("orderFormUpdated.vtex", () => {
  if ($("#opt-in-shipping-addr").length > 0) {
    $("#opt-in-shipping-addr").on("change", function () {
      if (!$("#opt-in-shipping-addr").is(":checked")) {
        $("#custom-corporate-postal-code").attr("required", true);
        $("#custom-corporate-city").attr("required", true);
        $("#custom-corporate-street").attr("required", true);
      } else {
        $("#custom-corporate-postal-code").attr("required", false);
        $("#custom-corporate-city").attr("required", false);
        $("#custom-corporate-street").attr("required", false);
      }
    });
  }

  $(".custom-corporate-state").remove();
  getEnergyLabels();
});

$(window).on("hashchange", function () {
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email" ||
    window.location.hash === "#/cart"
  ) {
    setTimeout(function () {
      var option = $("#user-person-type > option");
      var select = $("#user-person-type");
      option.each(function () {
        if ($(this).val() == "") {
          $(this).remove();
        }
      });
      select.trigger("change");
    }, 1000);
  }
});

//------------------------------------------
//------------ ONE TRUST & GCM CUSTOM -------------------
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
      analytics_storage: "denied",
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
    "6953283c-94d6-4e30-817a-e27edced0d51-test"
  );
  script.setAttribute("data-document-language", "true");
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
});

//------------------------------------------
//--------------- NEWSLETTER ---------------
//------------------------------------------
function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}
$(document).ready(function () {
  // optinGranted(); // D2CA-644 - commented out to push "optin_granted" event after user submits form
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
  ) {
    // CHANGE NEWSLETTER CHECKBOX
    changeNewsletterChk();
    hideDiscountTooltip();
  }
});
function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

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
  if (vtexjs.checkout.orderForm !== undefined) {
    //&& vtexjs.checkout.orderForm?.loggedIn
    if (
      vtexjs.checkout.orderForm?.clientPreferencesData &&
      vtexjs.checkout.orderForm?.clientPreferencesData.optinNewsLetter
    ) {
      $("#opt-in-newsletter").prop("checked", true);
    }
  } else if (
    vtexjs.checkout.orderForm?.loggedIn &&
    vtexjs.checkout.orderForm?.clientPreferencesData &&
    vtexjs.checkout.orderForm?.clientPreferencesData.optinNewsLetter
  ) {
    $(".newsletter").html(
      '<p class="informativa" style="font-size: 13px;margin: .5rem 0;">Przeczytałem i zrozumiałem treść <a href="" target="_blanck">informacji </a> dotyczącej ochrony danych osobowych oraz</p><label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData"><input type="checkbox" checked id="opt-in-newsletter" data-bind="checked: checkout.optinNewsLetter, enable: checkout.saveData"><span class="newsletter-text" data-i18n="global.optinNewsLetter">Wyrażam zgodę na przetwarzanie moich danych osobowych w celu umożliwienia Whirlpool Polska Appliances Sp. z o.oprzesyłania mi newslettera/wiadomości marketingowych (w formie elektronicznej i nieelektronicznej, w tym za pośrednictwem telefonu, poczty tradycyjnej, e-mail, SMS, MMS, powiadomień push na stronach osób trzecich, w tym na platformach Facebook i Google) dotyczących produktów i usług Whirlpool Polska Appliances Sp. z o.o również tych już zakupionych lub zarejestrowanych przeze mnie, a także w celu prowadzenia badań rynkowych;</span></label>'
    );
  } else if (
    vtexjs.checkout.orderForm?.loggedIn &&
    vtexjs.checkout.orderForm?.clientPreferencesData &&
    !vtexjs.checkout.orderForm?.clientPreferencesData.optinNewsLetter
  ) {
    $(".newsletter").html(
      '<p class="informativa" style="font-size: 13px;margin: .5rem 0;">Przeczytałem i zrozumiałem treść <a href="" target="_blanck">informacji</a> dotyczącej ochrony danych osobowych oraz</p><label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData"><input type="checkbox" checked id="opt-in-newsletter" data-bind="checked: checkout.optinNewsLetter, enable: checkout.saveData"><span class="newsletter-text" data-i18n="global.optinNewsLetter"> Wyrażam zgodę na przetwarzanie moich danych osobowych w celu umożliwienia Whirlpool Polska Appliances Sp. z o.oprzesyłania mi newslettera/wiadomości marketingowych (w formie elektronicznej i nieelektronicznej, w tym za pośrednictwem telefonu, poczty tradycyjnej, e-mail, SMS, MMS, powiadomień push na stronach osób trzecich, w tym na platformach Facebook i Google) dotyczących produktów i usług Whirlpool Polska Appliances Sp. z o.o również tych już zakupionych lub zarejestrowanych przeze mnie, a także w celu prowadzenia badań rynkowych;</span></label>'
    );
  }

  if (!document.querySelector(".newsletter-text-1")) {
    document.querySelector(".box-client-info").appendChild(
      createElementFromHTML(`
  <p class="newsletter-text-1"  style="font-size: 13px;">  Warunki przyznania zniżki znajdują się w Regulaminie Promocji poniżej: Kod na 50 złotych rabatu otrzymasz mailem po zapisaniu się do newslettera, niemożliwe jest łączenie go z innymi promocjami, można go użyć tylko raz.</p>`)
    );
  }
}
const hideDiscountTooltip = () => {
  $("a.discount[data-bind='visible: showDiscountButton']").hide();
};

//---------------------------------------
//----------- TOOTLTIP CUSTOM-------------
//--------------------------------------------

const warrantyTitleTooltipText = "Tooltip text";

$("body").on("click", ".icon-question-sign", function () {
  var element = $(this);
  var target = element.data("tooltip");
  $(`#${target}`).show();
  $("body").css("overflow", "hidden");
});

$("body").on("click", "#tooltipModalClose", function () {
  var element = $(this);
  element.parents(".tooltipModal").hide();
  $("body").css("overflow", "auto");
});

$(window).on("load", function () {
  var isTooltipTextChanged = false;
  if (window.location.hash === "#/cart") {
    setInterval(function () {
      if (!isTooltipTextChanged) {
        $(".title-custom-extra-services-tooltiptext").text(
          warrantyTitleTooltipText
        );
        $(".title-custom-extra-services-modaltext").text(
          warrantyTitleTooltipText
        );
        isTooltipTextChanged = true;
      }
    }, 250);
  }
});

$(document).on("change", ".extra-services-checkbox", function () {
  var hasTextChanged = true;
  setInterval(function () {
    if (hasTextChanged) {
      $(".title-custom-extra-services-tooltiptext").text(
        warrantyTitleTooltipText
      );
      $(".title-custom-extra-services-modaltext").text(
        warrantyTitleTooltipText
      );
    }
  }, 250);
});

$(window).on("hashchange", function () {
  var hasTextChanged = true;
  if (window.location.hash === "#/cart") {
    setInterval(function () {
      if (hasTextChanged) {
        $(".title-custom-extra-services-tooltiptext").text(
          warrantyTitleTooltipText
        );
        $(".title-custom-extra-services-modaltext").text(
          warrantyTitleTooltipText
        );
      }
    }, 250);
  }
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
function getValuePDFfromSpecifications(specifications, name) {
  const result = specifications.filter((s) => s.Name === name);
  if (result.length === 0) {
    return "";
  } else {
    return specifications.filter((s) => s.Name === name).Value[0];
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
function pushEventCheckout(stepID) {
  vtexjs.checkout.getOrderForm().then(function (orderForm) {
    var items = orderForm?.items;
    products = [];
    var forEachAsync = new Promise((resolve, reject) => {
      items?.forEach((value, index, array) => {
        var categoryIdsSplitted = value.productCategoryIds.split("/");
        Promise.all([
          getSpecificationFromProduct(value.productId),
          getStringCategoryFromId(
            categoryIdsSplitted[categoryIdsSplitted.length - 2]
          ),
          getProductSpecification(value.productId),
        ]).then((values) => {
          var obj = {
            name: remove12ncName(value.name, value.refId),
            id: value.refId,
            price: value.isGift ? 0 : value.sellingPrice / 100,
            brand: value.additionalInfo.brandName,
            category: values[1].AdWordsRemarketingCode,
            variant: findVariant(values[0]),
            quantity: value.quantity,
            dimension4: findDimension(values[0], "sellable"),
            dimension5: costructionType(
              findDimension(values[0], "constructionType")
            ),
            dimension6:
              value.listPrice > value.price ? "In Promo" : "Not In Promo",
          };
          products.push(obj);
          if (index === array.length - 1) {
            resolve();
          }
        });
      });
    });
    forEachAsync.then(() => {
      $("body").removeClass("checkoutEventPush");
      if (stepID === 1) {
        window.dataLayer.push({
          event: "eec.checkout",
          ecommerce: {
            currencyCode: "PL",
            checkout: {
              actionField: {
                step: stepID,
              },
              products: products,
            },
          },
        });
      } else {
        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
          event: "eec.checkout",
          ecommerce: {
            checkout: {
              actionField: { step: stepID },
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
  //window.eeccheckout.location = window.location.hash;
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

//  D2CA-644 - commented out to push "optin_granted" event after user submits form
//   function optinGranted() {
//     $(document).on("click", "#opt-in-newsletter", function () {
//       if (document.getElementById("opt-in-newsletter").checked) {
//         let dL = window.dataLayer || [];
//         dL.push({
//           event: "optin_granted",
//         });
//       }
//     });
//   }

$(window).on("hashchange", function () {
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

$(document).ready(function () {
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
  const userEmail = document.getElementById("client-email")?.value; // D2CA-644

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
    const termsElement = document?.getElementsByClassName(
      "input-xlarge custom-corporate-input required input-terms-conditions"
    )[0];
    const isTermsAccepted = termsElement?.checked;

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
    if (isTermsAccepted && isOptin && isEmailPushed === false) {
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

// emailForSalesforce event - D2CA-644
function pushEmailForSalesforceEvent() {
  const userEmail = document.getElementById("client-email")?.value; //D2CA-644

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
    const termsElement = document?.getElementsByClassName(
      "input-xlarge custom-corporate-input required input-terms-conditions"
    )[0];
    const isTermsAccepted = termsElement?.checked;
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

// Hardcoded translations
$(window).on("load", function () {
  setInterval(() => {
    if ($(".btn-go-to-shippping-method").text() != "Potwierdzam zamówienie") {
      $(".btn-go-to-shippping-method").text("Potwierdzam zamówienie");
    }
  }, 250);
});

/*
    // DEEE
    
    $(window).on("orderFormUpdated.vtex", () => {
    getTotalDeee();
    });
    
    const getTotalDeee = async () => {
    let priceElement = $("td.monetary[data-bind='text: totalLabel']");
    let priceTemplate = "";
    let ecofeeElement = "";
    let orderFormItems = vtexjs.checkout.orderForm?.items;
    let sum = 0;
    let result = orderFormItems.map((item) => {
    return getSpecificationFromProduct(item.productId).then((value) => {
      let prodSpecs = value;
      let ecofee = getValuefromSpecifications(prodSpecs, "ecofee");
      return ecofee * item.quantity;
    });
    });
    return await Promise.all(result).then((arr) => {
    let sumDEEE = arr.reduce(getSum);
    if (arr != undefined) {
      priceTemplate = `Dont ${sumDEEE}€ de eco-part. DEEE`;
    } else {
      priceTemplate = `*Le prix comprend la TVA, la DEEE et les promotions`;
      //   console.error("Ecofee total is undefined");
    }
    ecofeeElement = `<span class="totalEcofee"> ${priceTemplate} </span>`;
    priceElement.append(ecofeeElement);
    });
    };
    
    function getSum(total, num) {
    return total + Math.round(num);
    }
   
    const checkServicesPrice = () => {
    $(`.extra-services-price`).each((index, element) => {
    if (element.textContent != "Inclus") {
      $(`.extra-services-price:eq(${index})`).addClass("servicePriceBlack");
    }
    });
    };
    function addStyle(styleString) {
    const style = document.createElement("style");
    style.textContent = styleString;
    document.head.append(style);
  
    // JQUERY MANIPULATION
    }
    */
$(window).on("load", function () {
  hideDiscountTooltip();
  $("input#cart-coupon").prop("placeholder", "Wpisz kod promocyjny");
  $("button#cart-coupon-add").text("Zastosuj");
  //checkServicesPrice();
});
setInterval(() => {
  $("input#cart-coupon").prop("placeholder", "Wpisz kod promocyjny");
  $("button#cart-coupon-add").text("Zastosuj");
  //checkServicesPrice();
}, 1000);

//ADD AND REMOVE FROM CART EVENTS
$(document).on("click", ".item-quantity-change-decrement", function () {
  let splitted = $(this).attr("id").split("-");
  let itemId = splitted[splitted.length - 1];
  let item = findItem(itemId, vtexjs.checkout.orderForm?.items);
  let dataQ = $('[data-sku="' + itemId + '"] .quantity input').val();
  if (item.quantity !== parseInt(dataQ)) {
    pushRemoveToCart(item, 1);
    pushCartState(item, 1, "remove", vtexjs.checkout.orderForm?.items);
  }
});

$(document).on("click", ".item-quantity-change-increment", function () {
  let splitted = $(this).attr("id").split("-");
  let itemId = splitted[splitted.length - 1];
  let item = findItem(itemId, vtexjs.checkout.orderForm?.items);
  pushAddToCart(item, 1);
  pushCartState(item, 1, "add", vtexjs.checkout.orderForm?.items);
});

$(document).on("click", ".item-link-remove", function () {
  let splitted = $(this).attr("id").split("-");
  let itemId = splitted[splitted.length - 1];
  let item = findItem(itemId, vtexjs.checkout.orderForm?.items);
  pushRemoveToCart(item, item.quantity);
  pushCartState(
    item,
    item.quantity,
    "remove",
    vtexjs.checkout.orderForm?.items
  );
});

$(document).on("blur", ".quantity input", function () {
  let splitted = $(this).attr("id").split("-");
  let itemId = splitted[splitted.length - 1];
  let item = findItem(itemId, vtexjs.checkout.orderForm?.items);
  let dataQ = $(this).val();
  if (item.quantity == dataQ) {
    return;
  } else if (item.quantity > dataQ) {
    pushRemoveToCart(item, item.quantity - dataQ);
    pushCartState(
      item,
      item.quantity - dataQ,
      "remove",
      vtexjs.checkout.orderForm?.items
    );
  } else {
    pushAddToCart(item, dataQ - item.quantity);
    pushCartState(
      item,
      dataQ - item.quantity,
      "add",
      vtexjs.checkout.orderForm?.items
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
  if (arr.find((item) => item.Name == "Kolor") != undefined) {
    return arr.find((item) => item.Name == "Kolor").Value[0];
  } else {
    return "";
  }
}
function findDimension(arr, nameKey) {
  let result = arr.filter((obj) => obj.Name == nameKey);
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
  let price = item.price;
  let discountedPrice = item.sellingPrice;
  let categoryId = Object.keys(item.productCategories)[
    Object.keys(item.productCategories).length - 1
  ];
  const name = item.name.split(item.refId)[0].trim();
  Promise.all([
    getSpecificationFromProduct(item.productId),
    getStringCategoryFromId(categoryId),
    getProductSpecification(item.productId),
  ]).then((values) => {
    window.dataLayer.push({
      ecommerce: {
        products: [
          {
            brand: item.additionalInfo.brandName,
            category: values[1].AdWordsRemarketingCode,
            id: item.refId,
            name: name,
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
            dimension6: price > discountedPrice ? "In Promo" : "Not In Promo",
          },
        ],
        currencyCode: "PLN",
      },
      event: "eec.addToCart",
    });
  });
}
function pushRemoveToCart(item, dataQ) {
  let price = item.price;
  let discountedPrice = item.sellingPrice;
  let categoryId = Object.keys(item.productCategories)[
    Object.keys(item.productCategories).length - 1
  ];
  const name = item.name.split(item.refId)[0].trim();
  Promise.all([
    getSpecificationFromProduct(item.productId),
    getStringCategoryFromId(categoryId),
    getProductSpecification(item.productId),
  ]).then((values) => {
    window.dataLayer.push({
      ecommerce: {
        currencyCode: "PLN",
        remove: {
          products: [
            {
              brand: item.additionalInfo.brandName,
              category: values[1].AdWordsRemarketingCode,
              id: item.refId,
              name: name,
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
              dimension6: price > discountedPrice ? "In Promo" : "Not In Promo",
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
  items?.forEach((item) => {
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

//------------------------------------------
//---------NEW_RELIC_INTEGRATION------------
//------------------------------------------
/*
    $(document).on("ready", function () {
    let script = document.createElement("script");
    script.src = "/arquivos/new_relic.js";
    script.type = "text/javascript";
    document.head.appendChild(script);
    });
    */
/*--------------------------FEREADY-------------------------------*/
function feReady(pageType) {
  let dataLayer = window.dataLayer || [];
  if (
    vtexjs.checkout.orderForm !== undefined &&
    vtexjs.checkout.orderForm?.loggedIn
  ) {
    fetch("/_v/wrapper/api/user/userinfo", { method: "GET" }).then((res) =>
      res.json()
    );
    fetch("/_v/wrapper/api/user/hasorders", { method: "GET" }).then(
      dataLayer.push({
        event: "feReady",
        status: "authenticated",
        "product-code": "",
        "product-name": "",
        "product-category": "",
        userType: userType(),
        pageType: pageType,
        contentGrouping: "Other",
        contentGroupingSecond: "",
      })
    );
  } else {
    dataLayer.push({
      event: "feReady",
      status: "anonymous",
      "product-code": "",
      "product-name": "",
      "product-category": "",
      userType: "prospect",
      pageType: pageType,
      contentGrouping: "Other",
      contentGroupingSecond: "",
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
function userType() {
  let userTypeArray = vtexjs.checkout.orderForm.paymentData.paymentSystems;
  let lastPayment = vtexjs.checkout.orderForm.paymentData.paymentSystems;
  const dateCheck = () => {
    let firstLevelObj = Object.values(lastPayment);
    let secondLevelObj = Object.values(firstLevelObj[firstLevelObj.length - 1]);
    const lastYearDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const orderDate = new Date(secondLevelObj[10]);
    return lastYearDate.getTime() < orderDate.getTime();
  };
  let userTypeValue = "";
  if (userTypeArray.length <= 0) {
    userTypeValue = "prospect";
  } else {
    dateCheck()
      ? (userTypeValue = "hot customer")
      : (userTypeValue = "cold customer");
  }
  return userTypeValue;
}

$(document).on("blur", "input#client-phone", function () {
  let val = $("input#client-phone").val();
  if (val.length == 0) {
    removePhoneError();
    return;
  } else {
    if (val.length < 9 || val.length > 9) {
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
    '<span class="help error" id="phoneError" style="">Wprowadzona wartość jest nieprawidłowa</span>';
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

// LABEL TRANSLATION //
$(window).on("orderFormUpdated.vtex", () => {
  $("span[data-i18n='clientProfileData.identification']").text(
    "Dane do faktury"
  );
  $("#requestInvoice > div > p > label").text("Kupujący");
  $("#user-person-type").find("[value='private']").text("Osoba prywatna");
  $("#user-person-type").find("[value='company']").text("Firma");
  $(
    "#requestInvoice > div > div.invoice-address-box > p.corporate-field.custom-corporate-street.invoice-address-input > label"
  ).text("Adres do faktury (ulica, nr domu, nr mieszkania)");
  $(
    ".corporate-field.custom-corporate-city.invoice-address-input > label"
  ).text("Miejscowość");
  $("[for='client-phone']").text("Numer telefonu");
  $(".shipping-addr-text").html(
    `Adres do faktury jest taki sam jak adres dostawy, <strong>który podam w następnym kroku</strong>`
  );
  $("[data-i18n='totalizers.summary']").text(`Podsumowanie zamówienia`);
  $("#orderform-minicart-to-cart").text(`Powrót do koszyka`);
  $("[for='v-custom-ship-street']").text(`Ulica, nr domu`);
  $("[for='ship-postalCode']").text(`Kod pocztowy`);
  $("[for='ship-receiverName']").text(`Dostawę odbierze`);
  $(".vtex-omnishipping-1-x-shippingSectionTitle").text(`Adres dostawy`);
  $(".input.ship-complement.text")
    .find("label:first")
    .text(`Nr mieszkania, apartamentu itp.`);
  $(".input.ship-complement.text")
    .find("input:first")
    .attr("placeholder", `Nr mieszkania, apartamentu itp.`);
  if (window.location.hash == "#/cart") {
    setTimeout(() => {
      $("#cart-to-orderform").text("Zatwierdź");
    }, 1000);
    let cartCoupon = $("input.cart-coupon").val();
    $(".vtex-front-messages-template-opened")
      .find(".vtex-front-messages-detail")
      .text(`Kod promocyjny ${cartCoupon} nieprawidłowy`);
  }
  if (window.location.hash == "#/shipping") {
  }
});
$(document).ready(function () {
  $("span[data-i18n='clientProfileData.identification']").text(
    "Dane do faktury"
  );
});

// function to get the label translations
function translateCheckout() {
  if (window.location.hash == "#/cart") {
    $("#cart-to-orderform").text("Zatwierdź");
    $(".Items").find(".info").text("Podsumowanie");
    $("[data-i18n='global.total']").text("Do zapłaty");
    $(".srp-summary-result.hide").find(".monetary").text("Gratis");
    $("[data-i18n='cart.soldBy']").text(
      "Sprzedaż i dostawa bezpośrednio przez "
    );
    $(".product-service-container")
      .find(".extra-services-checkbox:first")
      .find(".extra-services-label")
      .text(
        "Darmowy odbiór starego sprzętu (odbędzie się w innym dniu niż dostawa)"
      );
  }
  if (window.location.hash == "#/payment") {
    $(".payment-submit-wrap")
      .find("button:last")
      .find("span[data-i18n='paymentData.confirm']")
      .text("Zamawiam i płacę");
    if ($(".payment-group-item-text-blik").length == 0) {
      $(".pg-szybki-przelew-online.active")
        .find(".payment-group-item-text")
        .after("<p class='payment-group-item-text-blik'></p>");
    }
  }
  if (window.location.hash == "#/shipping") {
    $(".shp-lean-option:first")
      .find(".shp-option-text.vtex-omnishipping-1-x-leanShippingText")
      .find("div.shp-option-text-time.undefined")
      .text("Dostawa bez wniesienia");
    $(".Items").find(".info").text("Podsumowanie");
    $("[data-i18n='global.total']").text("Do zapłaty");
    $(".service-list.unstyled.prod-service")
      .find(".service-item")
      .find(".product-name.pull-left")
      .find(
        "span[data-bind='text: name']:contains(Darmowy odbiór starego sprzętu)"
      )
      .text(
        "Darmowy odbiór starego sprzętu (odbędzie się w innym dniu niż dostawa)"
      );
    let translateDarmowa2 = $("select.span12 option")
      .text()
      .replace("Darmowa", "Gratis");
    $("select.span12 option").text(translateDarmowa2);
    $(".btn.btn-link.vtex-omnishipping-1-x-btnDelivery").text("Dalej");
    if (
      $(
        ".shp-lean-option.vtex-omnishipping-1-x-leanShippingOption .shp-option-text-price.vtex-omnishipping-1-x-optionPrice"
      ).text() != "Gratis"
    ) {
      $(
        ".shp-lean-option.vtex-omnishipping-1-x-leanShippingOption .shp-option-text-price.vtex-omnishipping-1-x-optionPrice"
      ).css({ display: "none" });
      $(".shp-lean-option.vtex-omnishipping-1-x-leanShippingOption").append(
        "<div class='shp-option-text-price vtex-omnishipping-1-x-optionPrice'>Gratis</div>"
      );
    }
    $("[id='scheduled-delivery-choose-Dostawa-na parter']").html(
      "Wybierz datę dostawy"
    );
  } else if (
    window.location.hash == "#/profile" ||
    window.location.hash == "#/email" ||
    window.location.hash == "#/shipping" ||
    window.location.hash == "#/payment"
  ) {
    $(".Items").find(".info").text("Podsumowanie");
    $("[data-i18n='global.total']").text("Do zapłaty");
    $(".srp-summary-result.hide").find(".monetary").text("Gratis");
    $("input#custom-corporate-document").on("input", function () {
      this.value = this.value
        .replace(/[^0-9.]/g, "")
        .replace(/(\..*)\./g, "$1");
    });
    $(
      "p[data-bind='fadeVisible: emailSuggestionDomain, click: acceptSuggestion']"
    ).css({ display: "none" });
    if (
      $(".input-xlarge.custom-corporate-input option:last").attr("selected")
    ) {
      $(".corporate-field.custom-corporate-name")
        .find("label:first")
        .text("Nazwa firmy");
      $(".corporate-field.custom-corporate-document")
        .find("label")
        .text("NIP (koniecznie w formie: 0000000000)");
      $(".corporate-field.custom-corporate-document")
        .find("input#custom-corporate-document")
        .attr("maxlength", "10");
      if (
        $(".input-xlarge.custom-corporate-input option:last").attr("selected")
      ) {
        $(".corporate-field.custom-corporate-name")
          .find("label:first")
          .text("Nazwa firmy");
        $(".corporate-field.custom-corporate-document")
          .find("label")
          .text("NIP (koniecznie w formie: 0000000000)");
        $(".corporate-field.custom-corporate-document")
          .find("input#custom-corporate-document")
          .attr("maxlength", "10");
        if ($("input#custom-corporate-name")[0].value == "") {
          $(".person-type-inputs")
            .find("span#custom-corporate-name-error")
            .css({ display: "block" });
          $(".person-type-inputs")
            .find("input#custom-corporate-name")
            .css({ borderColor: "red" });
        } else {
          $(".person-type-inputs")
            .find("span#custom-corporate-name-error:first")
            .css({ display: "none" });
          $(".person-type-inputs")
            .find("input#custom-corporate-name")
            .css({ border: "1px solid #cbcbcb" });
        }
        if (
          $("input#custom-corporate-document")[0].value == "" ||
          $("input#custom-corporate-document")[0].value.length != 10
        ) {
          $("p.corporate-field.custom-corporate-document + span.help.error")
            .length == 0
            ? $(".corporate-field.custom-corporate-document").after(
                "<span id='custom-corporate-name-error' class='help error' style='display: block;'>To pole jest wymagane</span>"
              )
            : null;
          $(".form-step.box-edit")
            .find(".submit.btn-submit-wrapper")
            .find(".submit.btn.btn-large.btn-success")
            .prop("disabled", true);
          $(".person-type-inputs")
            .find("span#custom-corporate-document-error")
            .css({ display: "block" });
          $(".person-type-inputs")
            .find("input#custom-corporate-document")
            .css({ borderColor: "red" });
        } else {
          $(".person-type-inputs")
            .find(".corporate-field.custom-corporate-document + span")
            .remove();
          $(".person-type-inputs")
            .find("span#custom-corporate-document-error")
            .css({ display: "none" });
          $(".person-type-inputs")
            .find("input#custom-corporate-document")
            .css({ border: "1px solid #cbcbcb" });
        }
        if (
          $("input#custom-corporate-name")[0].value == "" ||
          $("input#custom-corporate-document")[0]?.value?.length != 10
        ) {
          $(".form-step.box-edit")
            .find(".submit.btn-submit-wrapper")
            .find(".submit.btn.btn-large.btn-success")
            .prop("disabled", true);
        } else {
          $(".form-step.box-edit")
            .find(".submit.btn-submit-wrapper")
            .find(".submit.btn.btn-large.btn-success")
            .prop("disabled", false);
        }
      }
      if (
        $(".input-xlarge.custom-corporate-input option:first").attr("selected")
      ) {
        $(".form-step.box-edit")
          .find(".submit.btn-submit-wrapper")
          .find(".submit.btn.btn-large.btn-success")
          .prop("disabled", false);
      }
    }
    //Adding this if to prevent issue selecting "Firma" then select the other option
    if (
      $(".input-xlarge.custom-corporate-input option:first").attr("selected") &&
      $("input#custom-corporate-name")[0].value != ""
    ) {
      $(".form-step.box-edit")
        .find(".submit.btn-submit-wrapper")
        .find(".submit.btn.btn-large.btn-success")
        .prop("disabled", false);
    } else if (
      $(".input-xlarge.custom-corporate-input option:first").attr("selected") &&
      $("input#custom-corporate-name")[0].value == ""
    ) {
      $(".form-step.box-edit")
        .find(".submit.btn-submit-wrapper")
        .find(".submit.btn.btn-large.btn-success")
        .prop("disabled", true);
    }
    if (!document.querySelector(".newsletter-text-2")) {
      const beforeElement = document.querySelector(
        "#client-profile-data > div > div.accordion-body.collapse.in > div > div > form > div > p.corporate-field.custom-corporate-terms"
      );
      if (beforeElement)
        insertAfter(
          beforeElement,
          createElementFromHTML(
            ` <p class="newsletter-text-2"  style="font-size: 13px;"> Przeczytałem i zrozumiałem treść <a href="/informacja-o-ochronie-prywatnosci">informacji</a>  dotyczącej ochrony danych osobowych oraz</p>`
          )
        );
    }
    $(".help.error").text(`To pole jest wymagane`);
    $(".client-phone.input.pull-left.text.required.mask")
      .find(".help.error")
      .text(`Wpisana wartość jest nieprawidłowa`);
    $("label#Dostawa na parter")
      .find("div.vtex-omnishipping-1-x-leanShippingTextLabel")
      .text("Dostawa bez wniesienia");
    $("label#Dostawa na parter")
      .find(".shp-option-text-time.undefined")
      .text("Dostawa z wniesieniem");
    $("label#Dostawa z wniesieniem")
      .find("div.vtex-omnishipping-1-x-leanShippingTextLabel")
      .text("Dostawa z wniesieniem");
    $(
      ".vtex-omnishipping-1-x-submitPaymentButton.btn-submit-wrapper.btn-go-to-payment-wrapper"
    )
      .find("button")
      .text("Dalej");
    $(`[data-i18n="global.optinNewsLetter"]`).text(
      "Wyrażam zgodę na przetwarzanie moich danych osobowych w celu umożliwienia Whirlpool Polska Appliances Sp. z o.o przesyłania mi newslettera/wiadomości marketingowych (w formie elektronicznej i nieelektronicznej, w tym za pośrednictwem telefonu, poczty tradycyjnej, e-mail, SMS, MMS, powiadomień push na stronach osób trzecich, w tym na platformach Facebook i Google) dotyczących produktów i usług Whirlpool Polska Appliances Sp. z o.o również tych już zakupionych lub zarejestrowanych przeze mnie, a także w celu prowadzenia badań rynkowych;"
    );
    $(".service-list.unstyled")
      .find(".service-item")
      .find(".product-name.pull-left")
      .find(
        "span[data-bind='text: name']:contains(Darmowy odbiór starego sprzętu)"
      )
      .text(
        "Darmowy odbiór starego sprzętu (odbędzie się w innym dniu niż dostawa)"
      );
    //change label
    $("#mdl-save").text("Potwierdzam");
  }
}
$(window).on("orderFormUpdated.vtex", () => {
  if (
    window.location.hash == "#/profile" ||
    window.location.hash == "#/email"
  ) {
    if (
      $(".input-xlarge.custom-corporate-input option:last").attr("selected")
    ) {
      let corporateName =
        vtexjs?.checkout?.orderForm?.clientProfileData?.corporateName;
      let corporateDocument =
        vtexjs?.checkout?.orderForm?.clientProfileData?.document;
      $(".corporate-field.custom-corporate-name")
        .find("input#custom-corporate-name")
        .val(corporateName);
      $(".corporate-field.custom-corporate-document")
        .find("input#custom-corporate-document")
        .val(corporateDocument);
    }
  }
});
$(document).ready(function () {
  setInterval(() => {
    translateCheckout();
    if (
      $(
        ".vtex-front-messages-placeholder.vtex-front-messages-placeholder-opened"
      )
    ) {
    }
    $(
      ".vtex-front-messages-placeholder.vtex-front-messages-placeholder-opened div span:first"
    ).text("Błąd");
  }, 500);
});
$(document).on("hashchange", function () {
  setInterval(() => {
    translateCheckout();
  }, 500);
});

//RB-1136 workaround for missing VAT ID in document field
$(window).on("hashchange", () => {
  if (window.location.hash == "#/payment") {
    const clientProfile = vtexjs.checkout.orderForm.clientProfileData;
    const corporateDocumentField =
      vtexjs.checkout.orderForm.customData?.customApps?.find(
        (app) => app.id == "fiscaldata"
      )?.fields?.corporateDocument;

    if (
      corporateDocumentField != undefined &&
      corporateDocumentField != "_" &&
      clientProfile != null &&
      clientProfile.document != corporateDocumentField
    ) {
      clientProfile.document = corporateDocumentField;
      vtexjs.checkout.sendAttachment("clientProfileData", clientProfile);
    }
    $("a[data-name='Szybki przelew online'")
      .find("span.payment-group-item-text")
      .text("Szybka płatność online");
    $("a[data-name='Credit card'")
      .find("span.payment-group-item-text")
      .text("Karta płatnicza");
    appendHtmlOnPaymentMethod();
  }
});

const appendHtmlOnPaymentMethod = () => {
  const przelewyBox = document.querySelector(
    ".custom203PaymentGroupPaymentGroup"
  );
  const creditCardBox = document.querySelector(
    ".custom202PaymentGroupPaymentGroup"
  );
  const div = document.createElement("DIV");
  const div2 = document.createElement("DIV");
  const infoIcon = document.createElement("DIV");
  const infoIcon2 = document.createElement("DIV");
  const fastTransfersSpan = document.createElement("SPAN");
  const creditCardSpan = document.createElement("SPAN");
  infoIcon.innerHTML = "!";
  infoIcon2.innerHTML = "!";
  fastTransfersSpan.innerHTML =
    "UWAGA! Najczęstsze utrudnienia w przeprowadzeniu płatności to limit BLIK 1000 zł oraz zbyt niski limit dla przelewów z urządzeń mobilnych. Sprawdź ustawienia w swoim banku.";
  creditCardSpan.innerHTML =
    "Upewnij się w Twoim banku, że limit karty dla płatności w internecie jest wystarczający.";
  div.className = "prezlewyInfoWrapper";
  div2.className = "prezlewyInfoWrapper";
  infoIcon.className = "infoIcon";
  infoIcon2.className = "infoIcon";
  fastTransfersSpan.className = "fastTransferSpan";
  creditCardSpan.className = "fastTransferSpan";
  div.appendChild(fastTransfersSpan);
  div.appendChild(infoIcon);
  div2.appendChild(creditCardSpan);
  div2.appendChild(infoIcon2);
  przelewyBox?.append(div);
  creditCardBox?.append(div2);
};
//PUT default customdata when its empty
$(window).on("orderFormUpdated.vtex", () => {
  if (
    //window.location.hash == "#/payment" &&
    vtexjs.checkout.orderForm.userProfileId !== null &&
    vtexjs.checkout.orderForm.loggedIn == false &&
    !vtexjs.checkout.orderForm.customData?.customApps[0].fields[
      "requestInvoice"
    ]
  ) {
    const orderForm = vtexjs.checkout.orderForm;
    const defaultCustomData = {
      requestInvoice: false,
      typeOfDocument:
        orderForm?.clientProfileData?.document == "" ? "private" : "company",
      corporateDocument:
        orderForm?.clientProfileData?.document == ""
          ? "_"
          : orderForm?.clientProfileData?.document,
      sendInvoiceTo: false,
      useShippingAddress: true,
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
      "/api/checkout/pub/orderForm/" +
        orderForm?.orderFormId +
        "/customData/fiscaldata",
      options
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }
});

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
