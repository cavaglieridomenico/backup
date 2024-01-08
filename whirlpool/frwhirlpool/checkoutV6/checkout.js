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
      if (popupMessage) {
        const popupTextMessage = document.querySelector(
          ".vtex-front-messages-detail"
        );
        ga4Data.description = `Form: ${popupTextMessage.innerHTML}`;
        window.dataLayer.push({ ...ga4Data });
      }
    }, 2000);

    const inputList = form.querySelectorAll("input");
    const isError = false;
    for (let element of inputList) {
      if (element.classList.contains("error") && element.nextElementSibling) {
        ga4Data.description = `${element.previousElementSibling.innerHTML}: ${element.nextElementSibling.innerHTML}`;
        window.dataLayer.push({ ...ga4Data });
      }
      if (element.classList.contains("error")) {
        isError = true;
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
var userTypeStatus = ""; // D2CA-832
//-----------------------------------------------------
//--------------- CUSTOM PREFILLING ---------------
//-----------------------------------------------------
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
  getEnergyLabelsAndPreorderLabel();
};
//------------------------------------------
//--------------- PHONE INT ---------------
//------------------------------------------

const hideField = () => {
  setTimeout(() => {
    if (window.location.hash === "#/profile") {
      const phoneField = document.getElementById("client-phone2");
      if (phoneField?.disabled === true) {
        document.body.classList.add("hide-international-phone");
      }
    }
  }, 250);
};

// $(document).ready(() => {
//     hideField();
//     window.dataLayer.push({
//       event: "feReady",
//       pageType: "cart",
//       "product-category": "",
//       "product-code": "",
//       "product-name": "",
//       status: "anonymous",
//       userType: "guest",
//     });
//   });
//   $(window).on("hashchange", () => {
//     hideField();
//   });

//------------------------------------------
//--------------- CUSTOM CHECKBOX (Vtex)---------------
//------------------------------------------
function setVtexAppsConfig(config) {
  config.locale = "fr";
  config.checkbox = [
    {
      html: "<span>J'ai lu et j'accepte les <a href='/pages/information#conditions-génerales-de-vente'> conditions générales de vente et de prestation de services</a>*</span>",
    },
  ];
}

//------------------------------------------
//---------EXTRA_SERVICES_CONFIG------
//------------------------------------------
function checkout_v6_additional_services_checkboxes_initialize(EXTRA_SERVICES) {
  EXTRA_SERVICES["Livraison"] = {
    // salesChannel: [],
    selected: false,
    selectionEnabled: true,
    order: 1,
    description: `Livraison à domicile avec créneau horaire.`,
  };

  EXTRA_SERVICES["Installation"] = {
    // salesChannel: [],
    selected: false,
    selectionEnabled: true,
    warrantyGroup: false,
    order: 2,
    description: `Installation de votre produit sur un aménagement existant, conforme et aux normes. L’installation n'intègre pas de modifications d'électricité, de plomberie, de meuble, de découpe de plan de travail, d'inversion de portes, de désinstallation de l'ancien appareil (détail des conditions mentionnées dans les CGV).`,
  };
  EXTRA_SERVICES["Reprise de l’ancien appareil"] = {
    // salesChannel: [],
    selected: false,
    selectionEnabled: true,
    warrantyGroup: false,
    order: 3,
    description: `Gratuit le jour de la livraison. Pour la reprise (DEEE), l'appareil doit être débranché, vidé de son contenu, dégivré pour les réfrigérateurs et/ou les congélateurs, vidangé pour les lave-linge ou les lave-vaisselle.`,
  };
  EXTRA_SERVICES["RD VS avec un expert pour la découverte de produit"] = {
    // salesChannel: [],
    selected: false,
    selectionEnabled: true,
    warrantyGroup: false,
    order: 4,
    description: `Le Service "Expert" est un échange privilégié avec Whirlpool (en visio). Notre expert vous partagera les fonctions principales et les conseils d'utilisation de votre produit.`,
  };
  EXTRA_SERVICES["5 ans de garantie sur votre appareil"] = {
    // salesChannel: [],
    selected: false,
    selectionEnabled: true,
    warrantyGroup: true,
    order: 5,
    description: `5 ans de garantie sur votre appareil`,
  };
}
//------------------------------------------
//---------LABELS TRANSLATION------
//------------------------------------------

const labelTranslations = () => {
  $("h2[data-i18n='totalizers.summary']").text("Résumé de votre commande");
  $("p.custom-corporate-street label").text("Numéro et nom de la voie");
  $("p.custom-corporate-street label").text("Numéro et nom de la voie");
  $("p.custom-corporate-number label").text(
    "Information complémentaire pour l’adress"
  );
  //   $(".vtex-front-messages-detail").text("Coupon invalide");
  $(".v-custom-ship-street").children("label").html("Numéro et nom de la voie");
  $(".ship-complement")
    .children("label")
    .html("Information complémentaire pour l'adresse");
  $("#ship-complement").attr("placeholder", "");
  $(".ship-city").children("label").html("Ville");
  $(".ship-state").children("label").html("Département");
  // DEPARTMENT FIX
  if ($(".dep_warning_message")[0] === undefined) {
    $(
      "<p class='dep_warning_message'>Nous sommes en maintenance.  Veuillez sélectionner votre région manuellement.</p>"
    ).insertBefore($("#btn-go-to-shippping-method"));
  }
  $(".ship-postalCode").children("label").html("Code postal");
  $(".btn-go-to-shippping-method").html("Valider ma commande");
  $(".vtex-omnishipping-1-x-shippingSectionTitle delivery-address-title").html(
    "Complétez votre adresse"
  );
  $("#force-shipping-fields").html("Modifier");
  $(".vtex-omnishipping-1-x-deliveryGroup")
    .children("p")
    .html("Type d’expédition");
  // $(".shp-summary-group-price").html("inclus");
  $(".vtex-omnishipping-1-x-schedule")
    .children("p")
    .html("Planifiez votre livraison");
  $("#scheduled-delivery-choose-Standard").html(
    "Choisissez votre date de livraison"
  );
  $("#btn-go-to-payment").html("Valider ma commande");
  $(".vtex-omnishipping-1-x-addressForm")
    .children("p")
    .html("Complétez votre adresse");
  // $("#CHEAPEST .shp-option-text-price").html("Inclus");
  // $(".shp-option-text-label-single").html("Délai classique");
  changeFastDeliveryLabel();
  changeStandardDeliveryLabel();
};

const changeExpeditionLabel = () => {
  $(".phone-box").remove();
  $("input#client-phone2").prop("disabled", false);
  // $("#shipping-data").find(".accordion-toggle").html("Livraison");
  var text1 = $(".person-type-inputs")
    .children(".custom-corporate-name")
    .children("label");
  if (text1.text() == "Prénom e Nom de famille") {
    text1.html("Prénom et Nom de famille");
  }

  $(".person-type-inputs")
    .children(".custom-corporate-document")
    .children("label")
    .html("Numéro de TVA");
  $(".invoice-info-box")
    .children(".person-type-field")
    .children("label")
    .html("Type d'achat");
  $(".custom-corporate-document2").children("input").val(".");
  var option = $("#user-person-type > option");
  var select = $("#user-person-type");
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
  ) {
    $("#opt-in-invoice").prop("checked", true);
    $("#opt-in-invoice").attr("disabled", "disabled");
    option.each(function (index) {
      if ($(this).val() == "company") {
        $(this).html("Entreprise");
      } else if ($(this).val() == "private") {
        $(this).html("Particulier");
      } else {
        //$( this).remove()
      }
    });
    //select.trigger("change")
  }
  if (window.location.hash === "#/cart") {
    $(".empty-cart-message")
      .children("p")
      .html(
        "Pour continuer vos achats, parcourez les catégories sur le site ou recherchez vos produits."
      );
    appendImageOnCartSection();
  }
  /* if (window.location.hash === "#/payment") {
  $(".payment-group-item-text").html("Carte bancaire");
  } */
};

$(window).on("hashchange", () => {
  if (window.location.hash == "#/shipping") {
    changeFastDeliveryLabel();
    changeStandardDeliveryLabel();
    // ShowFastDelivery();
  }
});

$(window).on("orderFormUpdated.vtex", () => {
  // ShowFastDelivery();
  labelTranslations();
  $(".custom-corporate-state").remove();
});

$(document).ready(function () {
  labelTranslations();
});

$(window).on("load", function () {
  setInterval(() => changeExpeditionLabel(), 1000);
  setTimeout(() => {
    $("#shipping-data")
      .find(".accordion-toggle")
      .addClass("changeLivraisonLabel");
    $("#client-profile-data")
      .find(".accordion-toggle")
      .addClass("changeCoordonneesLabel");
  }, 1500);
  getEnergyLabelsAndPreorderLabel();
  appendHtmlOnPaymentMethodOnLoad();
});
$(window).on("hashchange", function () {
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
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
      //Prevent cache issue on "address de facturation" in profile
      labelTranslations();
      $(".custom-corporate-state")?.remove();
    }, 1000);
  }
  getEnergyLabelsAndPreorderLabel();
});

//---------------------------------------------//

//------------------------------------------
//---------INSTALLATION POPUP------
//------------------------------------------

const createPopup = (skuId, checkbox) => {
  $("body").append(
    '<div class="installValidationContainer"><div class="installValidationFormContainer"><div class="installValidationCloseIcon"><img class="installValidationIcon" src="/arquivos/cloing-cross.svg"/></div><form class="installValidationForm"><label class="installValidationLabel" for="zipValidation">Vérifier si votre code postal de livraison est couvert pour l’installation:</label><div class="installValidationInputContainer"><input class="installValidationInput" type="text" id="zipValidation" name="zipValidation" placeholder="Enter Zip Code"/><button class="installValidationButton" type="submit">Appliquer</button></div></form><div class="installValidationResponse"><p class="installValidationResponseText"></p></div></div></div>'
  );

  $(".installValidationForm").on("submit", (event) => {
    event.preventDefault();
    let zipCode = $("#zipValidation").val();
    let regex = /^(?:[0-8]\d|9[0-8])\d{3}$/;
    let serviceId = checkbox.val();
    let itemIndex = checkbox.attr("data-index");

    if (!regex.test(zipCode)) {
      alert("zip code not correct");
      return;
    }
    fetch(
      "/_v/wrapper/api/catalog/service/installation?skuId=" +
      skuId +
      "&zip=" +
      zipCode
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return new Promise((resolve) => resolve({ data: "KO" }));
        }
      })
      .then((res) => {
        if (res.data.toLowerCase() == "ok") {
          $(".installValidationResponseText").html(
            "<img class='tick-icon-install' src='/arquivos/check-solid.svg'/> L’installation est possible dans votre département"
          );
          if (!$("#" + checkbox.attr("id")).is(":checked")) {
            vtexjs.checkout.addOffering(serviceId, itemIndex);
          }
        } else {
          $(".installValidationResponseText").html(
            "<img class='tick-icon-install' src='/arquivos/times-solid.svg'/> L’installation n’est pas disponible dans votre département"
          );
          vtexjs.checkout.removeOffering(serviceId, itemIndex);
        }
      });
  });
};

$(document).on("change", ".extra-services-input", function (e) {
  if (
    $(this).parent().text().trim().startsWith("Installation") &&
    $(this).is(":checked")
  ) {
    e.preventDefault();
    const serviceId = $(this).val();
    const itemIndex = $(this).attr("data-index");

    const checkbox = $(this);
    let skuId = $(this)
      .parentsUntil(".cart-items", ".product-item")
      .attr("data-sku");
    fetch("/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/" + skuId)
      .then((response) => response.json())
      .then((product) => {
        let constructionType = product.ProductSpecifications.find(
          (spec) => spec.FieldName === "TYPE D'INSTALLATION:"
        );
        if (constructionType.FieldValues[0] !== "Pose libre") {
          createPopup(skuId, checkbox);
          vtexjs.checkout.removeOffering(serviceId, itemIndex);
        } else {
          console.log("Free standing");
        }
      })
      .catch((err) => console.error(err));
  }
});

$(document).on("click", ".installValidationCloseIcon", function () {
  $(".installValidationContainer").remove();
});
//---------------------------------------------//
$(window).on("load", function () {
  setInterval(() => {
    if ($(".vtex-front-messages-detail").text().startsWith("Coupon"))
      $(".vtex-front-messages-detail").text(
        "Ce coupon n'est pas cumulable avec d'autres promotions en cours."
      );
  }, 250);
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
    "9ecf3343-9eb6-4fb5-b71f-ce2228f960dc"
  );
  script.setAttribute("data-document-language", "true");
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
});

//------------------------------------------
//------------ INVOICE ADDRESS -------------
//------------------------------------------
function setInvoiceDataConfig(invoiceDataConfig) {
  invoiceDataConfig.locale = "fr";
  invoiceDataConfig.invoiceDataMandatory = true;
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
  //optinGranted(); // D2CA-641 - commented out to push "optin_granted" event after user submits form
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
  ) {
    // CHANGE NEWSLETTER CHECKBOX
    changeNewsletterChk();
    hideDiscountTooltip();
    // $("fieldset#requestInvoice").hide();
  }
});

$(window).on("hashchange", function () {
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
  ) {
    // CHANGE NEWSLETTER CHECKBOX
    changeNewsletterChk();
    // $("fieldset#requestInvoice").hide();
  }
});

function changeNewsletterChk() {
  if (
    vtexjs.checkout.orderForm !== undefined &&
    vtexjs.checkout.orderForm.loggedIn
  ) {
  } else {
    $(".newsletter").html(
      '<p class="informativa" style="font-size: 13px;margin: .5rem 0;">' +
      'J\'ai pris connaissance et j\'accepte la <a href="/pages/politique-de-protection-des-donnees-a-caractere-personnel" target="_blanck">politique de protection des données à caractère personnel </a> et:' +
      "</p>" +
      '<label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData">' +
      '<input type="checkbox" id="opt-in-newsletter" data-bind="checked: checkout.optinNewsLetter, enable: checkout.saveData">' +
      '<span class="newsletter-text" data-i18n="global.optinNewsLetter">Je consens au traitement de mes données personnelles pour permettre à Whirlpool France S.A.S de m\'envoyer des bulletins d\'information/communications marketing (sous forme électronique et non électronique, y compris par téléphone, courrier traditionnel, e-mail, SMS, MMS, notifications push sur des sites tiers, y compris sur les plateformes Facebook et Google) concernant les produits et services de Whirlpool France S.A.S même achetés ou enregistrés par vous.</span>' +
      "</label>" +
      '<label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData">' +
      '<input required type="checkbox" id="check-18" data-bind="checked: checkout.check18, enable: checkout.saveData">' +
      '<span class="newsletter-text" data-i18n="global.check18"> J\'ai plus de 18 ans* </span>' +
      "</label>"
    );
  }
}
const hideDiscountTooltip = () => {
  $("a.discount[data-bind='visible: showDiscountButton']").hide();
};

//------------------------------------------
//------------ SIDE CART LABELS ------------
//------------------------------------------

$(window).on("load", function () {
  setInterval(() => changeCartLabels(), 1000);
});

const changeCartLabels = () => {
  $(
    "tr.Discounts[data-bind='visible: visible, attr: { 'class': id }'] > td.info"
  ).text("Remises");
  $("a[data-i18n='cart.finalize']").text("Valider ma commande");
  $(".srp-summary-result").addClass("Shipping");
  $('strong[data-bind="text: priceLabel"]').each(function (index) {
    if ($(this).text() == "Gratuit") {
      $(this).text("Inclus");
    }
  });
  $('span[data-bind="text: name"]').each(function (index) {
    if ($(this).text() == "5 ans de garantie sur votre appareil") {
      $(this).text(
        "3 ans de garantie complémentaire. La garantie passe à 5 ans"
      );
    }
    if (
      $(this).text() == "RD VS avec un expert pour la découverte de produit"
    ) {
      $(this).text("Service Expert");
    }
  });
};

$(window).on("hashchange", function () {
  if (
    window.location.hash === "#/shipping" ||
    window.location.hash === "#/payment"
  ) {
    changeCartLabels();
  }
});

//---------------------------------------
//----------- TOOTLTIP CUSTOM-------------
//--------------------------------------------

const warrantyTitleTooltipText = "Tooltip text";

$("body").on("click", ".icon-question-sign", function () {
  var element = $(this);
  var target = element.data("tooltip");
  $(`#${target}`).show();
  if (element?.context?.dataset?.tooltip) $("body").css("overflow", "hidden");
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
    appendImageOnCartSection();
    if (hasTextChanged) {
      setInterval(function () {
        $(".title-custom-extra-services-tooltiptext").text(
          warrantyTitleTooltipText
        );
        $(".title-custom-extra-services-modaltext").text(
          warrantyTitleTooltipText
        );
      }, 250);
    }
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
function pushEventCheckout(stepID) {
  vtexjs.checkout.getOrderForm().then(function (orderForm) {
    var items = orderForm.items;
    products = [];
    var forEachAsync = new Promise((resolve, reject) => {
      items.forEach((value, index, array) => {
        var categoryIdsSplitted = value.productCategoryIds.split("/");
        Promise.all([
          getSpecificationFromProduct(value?.productId),
          getStringCategoryFromId(
            categoryIdsSplitted[categoryIdsSplitted.length - 2]
          ),
        ]).then((values) => {
          var obj = {
            name: remove12ncName(value.name, value.refId),
            id: value.refId,
            price: value.isGift ? 0 : value.sellingPrice / 100,
            brand: value.additionalInfo.brandName,
            category: values[1].AdWordsRemarketingCode,
            variant: getValuefromSpecifications(values[0], "Couleur"),
            quantity: value.quantity,
            dimension4:
              getValuefromSpecifications(values[0], "sellable") === "true"
                ? "Sellable Online"
                : "Not Sellable Online",
            dimension5: costructionType(
              findDimension(values[0], "constructionType")
            ),
            dimension6: findDimension(values[0], "Offres"),
          };
          products.push(obj);
          if (index === array.length - 1) {
            resolve();
          }
        });
      });
    });
    forEachAsync.then(() => {
      window.eeccheckout.location = window.location.hash;
      $("body").removeClass("checkoutEventPush");
      if (stepID === 1) {
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

// D2CA-641 - commented out to push "optin_granted" event after user submits form
// function optinGranted() {
//   $(document).on("click", "#opt-in-newsletter", function () {
//     if (document.getElementById("opt-in-newsletter").checked) {
//       let dL = window.dataLayer || [];
//       dL.push({
//         event: "optin_granted",
//       });
//     }
//   });
// }

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

//---------------------------
//------FAST DELIVERY--------
//---------------------------
function changeFastDeliveryLabel() {
  setTimeout(() => {
    const fastDeliveryBox = document.getElementById("FASTEST");
    if (fastDeliveryBox) {
      if (
        !vtexjs.checkout.orderForm.items.some((item) =>
          item.productCategoryIds.includes("/1/")
        )
      ) {
        fastDeliveryBox.remove();
        return;
      }
      const fastDeliveryLabel =
        fastDeliveryBox.querySelector(".shp-option-text-time") ||
        fastDeliveryBox.querySelector(".shp-option-text-label-single");

      fastDeliveryLabel.setHTML(
        "Livraison en 3 jours ouvrés* maximum à partir de la commande (*hors samedi, dimanche et jour férié)"
      );
    }

    if (
      $(".shp-summary-package-time").text() == "Un maximum de 3 jours ouvrés"
    ) {
      $(".shp-summary-package-time").text(
        "Livraison en 3 jours ouvrés* maximum à partir de la commande (*hors samedi, dimanche et jour férié)"
      );
    }
  }, 500);
}

//---------------------------
//------STANDARD DELIVERY--------
//---------------------------

function changeStandardDeliveryLabel() {
  setTimeout(() => {
    const standardDeliveryBox = document.getElementById("CHEAPEST");
    if (standardDeliveryBox) {
      const standardDeliveryLabel =
        standardDeliveryBox.querySelector(".shp-option-text-time") ||
        standardDeliveryBox.querySelector(".shp-option-text-label-single");
      if (standardDeliveryLabel.textContent == "Un maximum de 5 jours ouvrés")
        standardDeliveryLabel.setHTML(
          "Livraison à domicile en 5 à 7 jours ouvrés"
        );
    }

    if (
      $(".shp-summary-package-time").text() == "Un maximum de 5 jours ouvrés"
    ) {
      $(".shp-summary-package-time").text(
        "Livraison à domicile en 5 à 7 jours ouvrés"
      );
    }
  }, 500);
}

//---------------------------
//------ENERGY LABEL------
//---------------------------

function getEnergyLabelsAndPreorderLabel() {
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
            preSaleDate: value.preSaleDate
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
        if (energyLabel.preSaleDate) {
          if (
            !$(`[data-sku="${energyLabel.productId}"]`)
              .find(".product-name")
              .find("#preorderLabel").length
          ) {
            $(`[data-sku="${energyLabel.productId}"]`)
              .find(".product-name")
              .prepend(`<div id="preorderLabel" class="preorderLabel">Produit en pré-commande</div>`);
          };
        };
        if (
          !$(`[data-sku="${energyLabel.productId}"]`)
            .find(".product-name")
            .find("#energyLabelImage").length
        ) {
          let coupon = $(".v-custom-addLabels-active-flag");
          if (coupon.length > 0) {
            if (energyLabel.oldLabelPdf || energyLabel.labelPdf) {
              $(`[data-sku="${energyLabel.productId}"]`)
                .find(".product-name")
                .find(coupon)
                .before(
                  $(
                    `<a href="${energyLabel.oldLabelPdf || energyLabel.labelPdf
                    }" target='_blank'><img src="${energyLabel.label
                    }" alt="energyLabel" id="energyLabelImage" class="energyLabelImage" /> </a>`
                  )
                );
              $(`[data-sku="${energyLabel.productId}"]`)
                .find(".product-name")
                .find(coupon)
                .before(
                  $(
                    `<a href="${energyLabel.productInformation ||
                    energyLabel.oldProductInformation
                    }" target='_blank' id="productInformationSheet" style="width: 50%; margin: 0; font-size: 1rem; font-weight: bold; text-decoration: underline;">Fiche Produit </a>`
                  )
                );
            }
          } else {
            if (energyLabel.oldLabelPdf || energyLabel.labelPdf) {
              $(`[data-sku="${energyLabel.productId}"]`)
                .find(".product-name")
                .append(
                  `<a href="${energyLabel.oldLabelPdf || energyLabel.labelPdf
                  }" target='_blank'><img src="${energyLabel.label
                  }" alt="energyLabel" id="energyLabelImage" class="energyLabelImage" /> </a>`
                );
              $(`[data-sku="${energyLabel.productId}"]`)
                .find(".product-name")
                .append(
                  `<a href="${energyLabel.productInformation ||
                  energyLabel.oldProductInformation
                  }" target='_blank' id="productInformationSheet" style="width: 50%; margin: 0; font-size: 1rem; font-weight: bold; text-decoration: underline;">Fiche Produit</a>`
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
            !$(`[data-sku="${energyLabel.productId}"]`)
              .find(".description")
              .find("#energyLabelImage").length
          ) {
            if (energyLabel.oldLabelPdf || energyLabel.labelPdf) {
              $(`[data-sku="${energyLabel.productId}"]`)
                .find(".description")
                .prepend(
                  `<a href="${energyLabel.oldLabelPdf || energyLabel.labelPdf
                  }" target='_blank'><img src="${energyLabel.label
                  }" alt="energyLabel" id="energyLabelImage" class="energyLabelImage" /> </a><a href="${energyLabel.productInformation ||
                  energyLabel.oldProductInformation
                  }" target='_blank' id="productInformationSheet" class="productInformationSheet"">Fiche Produit</a>`
                );
              $(`[data-sku="${energyLabel.productId}"]`)
                .find(".description")
                .attr("style", "justify-content: space-between !important");
            }
          }
        }, 3000);
      }
    });
  });
}
$(window).click(() => {
  if (!document.getElementById("#energyLabelImage")) {
    getEnergyLabelsAndPreorderLabel();
  }
});

//GA4FUNREQ61
function pushOptinInEvent() {
  return window.dataLayer.push({
    event: "optin",
  });
}
// End of GA4FUNREQ 61

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
    const isAge = $("#check-18").is(":checked") ? true : false;
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
    if (isTermsAccepted && isAge && isOptin && isEmailPushed === false) {
      pushOptinInEvent();
      pushLeadGenerationEvent();
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
    checkpoint: `checkout`,
    area: "(Other)",
    type: "go to shipping",
  });
}

// End of FUNREQ52

// emailForSalesforce event - D2CA-641
function pushEmailForSalesforceEvent() {
  const userEmail = document.getElementById("client-email")?.value; //D2CA-641

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
    const isAge = $("#check-18").is(":checked") ? true : false;
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
    if (isAge && isTermsAccepted && isEmailPushed === false) {
      pushEmailForSalesforceEvent();
    }
  });
});

// End of emailForSalesforceEvent

// Hardcoded translations

// DEEE

$(window).on("orderFormUpdated.vtex", () => {
  getTotalDeee();
});

const getTotalDeee = async () => {
  let priceElement = $("td.monetary[data-bind='text: totalLabel']");
  let priceTemplate = "";
  let ecofeeElement = "";
  let orderFormItems = vtexjs.checkout.orderForm.items;
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
$(window).on("load", function () {
  hideDiscountTooltip();
  $("input#cart-coupon").prop("placeholder", "Ajoutez votre code promotionnel");
  $("button#cart-coupon-add").text("Appliquer");
  checkServicesPrice();
});
setInterval(() => {
  $("input#cart-coupon").prop("placeholder", "Ajoutez votre code promotionnel");
  $("button#cart-coupon-add").text("Appliquer");
  checkServicesPrice();
}, 1000);

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
  const result = data.filter((o) => o.Name == "Couleur");
  return result.length > 0 ? result[0].Value[0] : "";
}
function findDimension(data, nameKey) {
  if (nameKey === "Offres") {
    let result = data.filter((obj) => obj.Name == nameKey);
    result.length > 0 ? (result = result[0]) : null;
    if (result === undefined || result.Value === undefined)
      return "Not in Promo";
    if (
      result.Value.length > 0 &&
      (result.Value.includes("Offres spéciales") ||
        result.Value.includes("Promotions"))
    )
      return "In Promo";
    else return "Not in Promo";
  }
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

//------------------------------------------
//---------NEW_RELIC_INTEGRATION------------
//------------------------------------------

$(document).on("ready", function () {
  let script = document.createElement("script");
  script.src = "/arquivos/new_relic.js";
  script.type = "text/javascript";
  document.head.appendChild(script);
});
// -------------------------INPUT PHONE VALIDATION------------------
$(document).on("ready", function () {
  $("#client-phone").prop("pattern", "0[0-9]{9}");
});
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
      userType: "prospect", // D2CA-834
      pageType: pageType,
      contentGrouping: "(Other)", // D2CA-374
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

// D2CA-832: Returns "prospect" OR "hot customer" OR "cold customer"
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

// ----------------------- CHECK INSTALLATION SERVICE -----------------------------------
$(window).on("hashchange | load", function () {
  if (window.location.hash === "#/payment") {
    let items = vtexjs.checkout.orderForm.items;
    const zipCode = vtexjs.checkout.orderForm.shippingData.selectedAddresses?.[0].postalCode
    items.forEach((item, index) => {
      checkZipCodeInstallation(item, index, zipCode);
    });
  }
});

function checkZipCodeInstallation(item, index, zipCode) {
  if (zipCode) {
    fetch(
      "/_v/wrapper/api/catalog/service/installation?skuId=" +
      item?.id +
      "&zip=" +
      zipCode
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return new Promise((resolve) => resolve({ data: "KO" }));
        }
      })
      .then((res) => {
        if (res?.data?.toLowerCase() !== "ok") {
          removeInstallation(item, index);
        }
      });
  }
}

function removeInstallation(item, index) {
  item?.bundleItems?.forEach((bundle) => {
    if (bundle?.additionalInfo?.offeringTypeId === "1") {
      vtexjs?.checkout?.removeOffering(bundle?.id, index);
      showInstallationWarning();
    }
  });
}

function showInstallationWarning() {
  var message = {
    timeout: "10000",
    content: {
      title: "L’installation n’est pas disponible dans votre département.",
      detail: "L’installation a été supprimée",
    },
    type: "warn",
  };
  $(window).trigger("addMessage", message);
}

// ----------------------- END CHECK INSTALLATION SERVICE ----------------------------------
// ----------------------- START FIX rreceiverName ----------------------------------
$(window).on("orderFormUpdated.vtex", () => {
  const orderForm = vtexjs.checkout.orderForm;
  if (
    window.location.hash == "#/shipping" &&
    !vtexjs.checkout.orderForm.shippingData?.address?.receiverName &&
    !!vtexjs.checkout.orderForm.shippingData?.address
  ) {
    const rreceiverName =
      orderForm.clientProfileData.firstName +
      " " +
      orderForm.clientProfileData.lastName;
    // orderForm.shippingData?.address?.receiverName = rreceiverName
    let myorderform = { ...orderForm };
    myorderform.shippingData.address.receiverName = rreceiverName;
    const orderId = orderForm?.orderFormId;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(myorderform),
    };
    fetch(
      "/api/checkout/pub/orderForm/" + orderId + "/attachments/shippingData",
      options
    )
      .then((response) => response.json())
      .catch((error) => console.error(error));
  }
});
// ----------------------- END FIX rreceiverName  ----------------------------------

// ------ ALMA ------ //
const appendHtmlOnPaymentMethod = () => {
  const almaBox = document.querySelector(".AlmaPaymentGroup");

  const imgSRC =
    "https://frwhirlpoolqa.vtexassets.com/assets/vtex.file-manager-graphql/images/dce5ad91-0c9b-46ae-9875-1036c95ec8f4___fbdd558339a79a909a9a47f1c58c8a83.png";
  if ([...almaBox?.children].some((el) => el?.src === imgSRC)) return;

  const img = document.createElement("IMG");
  const p = document.createElement("P");
  p.innerHTML =
    "Alma est disponible pour une commande comprise entre 100€ et 3000 €";
  p.className = " almaDisclaimer";
  img.className = "almaBoxImg";
  img.src = imgSRC;

  almaBox?.append(img);
  almaBox?.append(p);

  const almaTItle = document.querySelector(
    "#payment-group-AlmaPaymentGroup > span"
  );
  almaTItle.innerHTML = "ALMA : paiement en 3 à 4 fois avec carte bancaire";
};

$(document).on("click", "#payment-group-AlmaPaymentGroup", function () {
  appendHtmlOnPaymentMethod();
});

const appendHtmlOnPaymentMethodOnLoad = () => {
  if (!window.location.hash === "#/payment") return;

  const almaBox = document.querySelector(".AlmaPaymentGroup");
  if (almaBox) appendHtmlOnPaymentMethod();
  else setTimeout(appendHtmlOnPaymentMethodOnLoad, 250);
};

const appendImageOnCartSection = () => {
  setTimeout(() => {
    if (!document.getElementById("paymentMethodsCartImage")) {
      const img = document.createElement("IMG");
      img.id = "paymentMethodsCartImage";
      img.className = "paymentMethodsCartImage";
      img.src =
        "https://frwhirlpoolqa.vtexassets.com/assets/vtex.file-manager-graphql/images/cc442c14-9319-472b-acfc-7ba641fc34d9___c5fbc36a8966aec19fcfc968b100e939.jpg";
      const container = document.getElementsByClassName(
        "summary-template-holder"
      )[0];
      container.appendChild(img);
    }
  }, 2000);
};

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
//////////////////////////////////////remove installation when fast delivery choosed ////////////////////
function changeFastDeliveryLabel() {
  setTimeout(() => {
    const fastDeliveryBox = document.getElementById("FASTEST");
    if (fastDeliveryBox) {
      if (
        !vtexjs.checkout.orderForm.items.some((item) =>
          item.productCategoryIds.includes("/1/")
        )
      ) {
        fastDeliveryBox.remove();
        return;
      }
      const fastDeliveryLabel =
        fastDeliveryBox.querySelector(".shp-option-text-time") ||
        fastDeliveryBox.querySelector(".shp-option-text-label-single");

      fastDeliveryLabel.setHTML(
        "Livraison en 3 jours ouvrés* maximum à partir de la commande (*hors samedi, dimanche et jour férié)"
      );
    }

    if (
      $(".shp-summary-package-time").text() == "Un maximum de 3 jours ouvrés"
    ) {
      $(".shp-summary-package-time").text(
        "Livraison en 3 jours ouvrés* maximum à partir de la commande (*hors samedi, dimanche et jour férié)"
      );
    }
  }, 500);
}

//////////////  START -> SCTASK0867568  remove fast delivery if user choose installation SCTASK0867568  //////////////

$(window).on("orderFormUpdated.vtex", () => {
  var targetNode = document.getElementById("shipping-data");
  var config = {
    attributes: true,
    childList: true,
    subtree: true,
  }; // Callback function to execute when mutations are observed
  if (targetNode || window.location.hash == "#/shipping") {
    var callback = function (mutationsList) {
      for (var mutation of mutationsList) {
        if (mutation.type == "childList") {
          const orderForm = vtexjs?.checkout?.orderForm;
          !vtexjs.checkout.orderForm.items.some((item) => {
            item.bundleItems.some((bundle) => {
              if (
                bundle.additionalInfo.offeringType == "Installation" &&
                vtexjs.checkout.orderForm.shippingData.logisticsInfo.length > 0
              ) {
                $("#FASTEST").css({ display: "none" });
              } else if (
                bundle.additionalInfo.offeringType == null ||
                undefined
              ) {
                $("#FASTEST").css({ display: "flex" });
              }
            });
          });
        } else if (mutation.type == "attributes") {
        }
      }
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
  }
});
//////////////  END -> SCTASK0867568 remove fast delivery if user choose installation   //////////////