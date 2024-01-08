//------------------------------------------
//-------------CHECK LOGIN--------------
//------------------------------------------

$(window).on("orderFormUpdated.vtex", () => {
  if (!vtexjs.checkout.orderForm.loggedIn) {
    window.sessionStorage.setItem("loggedIn", "false");
    window.location.href = "/login";
  }
});

//------------------------------------------
//-------------CHECK SALES CHANNEL--------------
//------------------------------------------

function isValidSalesChannel(expected_sc) {
  const url = window.location.origin

  if (!vtexjs.checkout.orderForm || url?.includes("myvtex")) return true
  const orderForm_sc = vtexjs.checkout.orderForm.salesChannel

  return orderForm_sc == expected_sc
}


$(window).on("orderFormUpdated.vtex", () => {
  const url = window.location.origin
  const expected_sc = url?.includes("epp") ? "1" : url?.includes("ff") ? "2" : "3"
  const seller = "frwhirlpool"
  if (!isValidSalesChannel(expected_sc)) {
    const items = vtexjs.checkout.orderForm?.items?.map(i => {
      return {
        id: i.id,
        quantity: i.quantity,
        seller
      }
    }) ?? []

    vtexjs.checkout.removeAllItems().done(() => vtexjs.checkout.addToCart(items, null, expected_sc))
  }
});

//-------------CHANGE HEADER LOGO SRC--------------//
//$(document).ready(() => {
//     document.getElementById('logo').src=getBindingValue();
//   });

const getBindingValue = () => {
  let url = window.location.origin;
  return `/arquivos/whr-logo-${url?.includes("epp") ? "epp" : url?.includes("ff") ? "ff" : "vip"
    }.png`;
};

//------------------------------------------
//--------------- CHANGE TOTALIZERS ---------------
//------------------------------------------

$(document).ready(function () {
  $("#cart-note").attr("maxlength", "216");
  $(".totalizers-list").append(
    '<tr class="custom-totalizers-cart"><td class="custom-totalizers-cart-label">Sous-total</td><td class="custom-totalizers-cart-totalPrice"></td></tr>'
  );
  $(".totalizers-list").append(
    '<tr class="custom-totalizers-cart"><td class="custom-totalizers-cart-label-discount"></td><td class="custom-totalizers-cart-totalDiscount"></td></tr>'
  );

  $(window).on("orderFormUpdated.vtex", () => {
    const currencySymbol =
      vtexjs.checkout.orderForm?.storePreferencesData?.currencySymbol;
    const items = vtexjs.checkout.orderForm.items;

    const formatPrice = (price) =>
      `${(price / 100).toFixed(2).replace(".", ",")} ${currencySymbol}`;

    const [totalPrice, totalDiscount] = items?.reduce(
      (total, item) => [
        total[0] +
        item.listPrice * item.quantity +
        item.bundleItems.reduce((total, bundle) => total + bundle.price, 0),
        total[1] + (item.listPrice - item.sellingPrice) * item.quantity,
      ],
      [0, 0]
    );
    $(".custom-totalizers-cart-totalPrice").text(formatPrice(totalPrice));
    if (totalDiscount != 0) {
      $(".custom-totalizers-cart-label-discount").text("Réductions");
      $(".custom-totalizers-cart-totalDiscount").text(
        formatPrice(-totalDiscount)
      );
    }
  });
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
            ?.indexOf("energyLabelImage") == -1
        ) {
          let coupon = $(".v-custom-addLabels-active-flag");
          if (coupon.length > 0) {
            if (energyLabel.oldLabelPdf || energyLabel.labelPdf) {
              $(`[data-sku= ${energyLabel.productId}]`)
                .find(".product-name")
                .find(coupon)
                .before(
                  $(
                    `<a href=${energyLabel.oldLabelPdf || energyLabel.labelPdf
                    } target='_blank'><img src=${energyLabel.label
                    } alt="energyLabel" id="energyLabelImage" class="energyLabelImage" /> </a>`
                  )
                );
              $(`[data-sku= ${energyLabel.productId}]`)
                .find(".product-name")
                .find(coupon)
                .before(
                  $(
                    `<a href=${energyLabel.productInformation ||
                    energyLabel.oldProductInformation
                    } target='_blank' id="productInformationSheet" style="width: 50%; margin: 0; font-size: 1rem; font-weight: bold; text-decoration: underline;">Fiche Produit </a>`
                  )
                );
            }
          } else {
            if (energyLabel.oldLabelPdf || energyLabel.labelPdf) {
              $(`[data-sku= ${energyLabel.productId}]`)
                .find(".product-name")
                .append(
                  `<a href=${energyLabel.oldLabelPdf || energyLabel.labelPdf
                  } target='_blank'><img src=${energyLabel.label
                  } alt="energyLabel" id="energyLabelImage" class="energyLabelImage" /> </a>`
                );
              $(`[data-sku= ${energyLabel.productId}]`)
                .find(".product-name")
                .append(
                  `<a href=${energyLabel.productInformation ||
                  energyLabel.oldProductInformation
                  } target='_blank' id="productInformationSheet" style="width: 50%; margin: 0; font-size: 1rem; font-weight: bold; text-decoration: underline;">Fiche Produit </a>`
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
                  `<a href=${energyLabel.oldLabelPdf || energyLabel.labelPdf
                  } target='_blank'><img src=${energyLabel.label
                  } alt="energyLabel" id="energyLabelImage" class="energyLabelImage" /> </a><a href=${energyLabel.productInformation ||
                  energyLabel.oldProductInformation
                  } target='_blank' id="productInformationSheet" class="productInformationSheet"">Fiche Produit </a>`
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
  EXTRA_SERVICES["Installation"] = {
    //   salesChannel: [],
    selected: false,
    selectionEnabled: true,
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
  setInterval(() => {
    if (
      $("strong.price-details-title")
        .children("span[data-i18n='totalizers.Discounts']")
        .text() == "Réductions"
    ) {
      $("strong.price-details-title")
        .children("span[data-i18n='totalizers.Discounts']")
        .text("Remises");
    }
  }, 200);
  $("strong.price-details-title")
    .children("span[data-i18n='totalizers.Discounts']")
    .text("Remises");
  $("p.custom-corporate-street label").text("Numéro et nom de la voie");
  $("p.custom-corporate-number label").text(
    "Information complémentaire pour l’adresse"
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
  // $(".shp-option-text-price").html("Inclus");
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
  }
  /* if (window.location.hash === "#/payment") {
          $(".payment-group-item-text").html("Carte bancaire");
        } */
};

$(window).on("hashchange", () => {
  if (window.location.hash == "#/shipping") {
    changeFastDeliveryLabel();
    changeStandardDeliveryLabel();
  }
});

function getCheckoutStep() {
  let hash = window?.location?.hash;
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

$(window).on("orderFormUpdated.vtex", () => {
  labelTranslations();
  $(".custom-corporate-state").remove();
});

$(document).ready(function () {
  labelTranslations();
});

$(window).on("load", function () {
  document.getElementById("logo").src = getBindingValue();
  setInterval(() => changeExpeditionLabel(), 1000);
  setTimeout(() => {
    $("#shipping-data")
      .find(".accordion-toggle")
      .addClass("changeLivraisonLabel");
    $("#client-profile-data")
      .find(".accordion-toggle")
      .addClass("changeCoordonneesLabel");
  }, 1500);
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
    }, 1000);
  }
});

//---------------------------------------------//

//------------------------------------------
//---------INSTALLATION POPUP------
//------------------------------------------

const createPopup = (skuId, checkbox) => {
  $("body").append(
    '<div class="installValidationContainer" id="checkout-installation-popup"><div class="installValidationFormContainer"><div class="installValidationCloseIcon"><img class="installValidationIcon" src="https://frwhirlpool.vteximg.com.br/arquivos/cloing-cross.svg"/></div><form class="installValidationForm"><label class="installValidationLabel" for="zipValidation">Vérifier si votre code postal de livraison est couvert pour l’installation:</label><div class="installValidationInputContainer"><input class="installValidationInput" type="text" id="zipValidation" name="zipValidation" placeholder="Enter Zip Code"/><button class="installValidationButton" type="submit">Appliquer</button></div></form><div class="installValidationResponse"><p class="installValidationResponseText"></p></div></div></div>'
  );

  window.dataLayer.push({
    event: "popupInteraction",
    eventCategory: "Popup",
    eventAction: "checkout-installation-popup",
    eventLabel: "click",
  });
  window.dataLayer.push({
    event: "popupInteraction",
    eventCategory: "Popup",
    eventAction: "checkout-installation-popup",
    eventLabel: "view",
  });

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
          (spec) => spec.FieldName.toLowerCase() == "constructiontype"
        );
        console.log(constructionType);
        if (constructionType.FieldValues[0] == "Built In") {
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
  window.dataLayer.push({
    event: "popupInteraction",
    eventCategory: "Popup",
    eventAction: "checkout-installation-popup",
    eventLabel: "close",
  });
});
//---------------------------------------------//
$(window).on("load", function () {
  setInterval(() => {
    if ($(".vtex-front-messages-detail").text().startsWith("Coupon"))
      $(".vtex-front-messages-detail").text("Coupon invalide");
  }, 250);
});

//------------------------------------------
//------------ ONE TRUST -------------------
//------------------------------------------
$(document).ready(function () {
  (function () {
    window.dataLayer = window.dataLayer || [];
    //consent mode
    var gtmId = "GTM-NC4QJZT";
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
  const url = window?.location?.hostname;
  const scriptID = url?.includes("epp")
    ? "4dd79b87-1b1e-4785-ae0a-6d7aae51b2bc"
    : url?.includes("ff")
      ? "a9f0dfe7-f88c-4abb-8326-82969221a80c"
      : "0332d654-e3e4-46de-8b25-62a2357e3f26";
  var script = document.createElement("script");
  script.src = "https://cdn.cookielaw.org/scripttemplates/otSDKStub.js";
  script.setAttribute("charset", "UTF-8");
  script.setAttribute("data-domain-script", scriptID);
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
  //optinGranted();
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
  setTimeout(() => {
    $(".newsletter").html(
      '<p class="informativa" style="font-size: 13px;margin: .5rem 0;">J\'ai lu et compris le contenu de la <a href="/pages/politique-de-protection-des-donnees-a-caractere-personnel" target="_blanck">politique de protection des données à caractère personnel </a> et:</p><label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData"><input type="checkbox" id="opt-in-newsletter" data-bind="checked: checkout.optinNewsLetter, enable: checkout.saveData"><p class="newsletter-text" data-i18n="global.optinNewsLetter"> Je consens au traitement de mes données personnelles pour permettre à Whirlpool France S.A.S. de m\'envoyer des bulletins d\'information/communications marketing (sous forme électronique et non électronique, y compris par téléphone, courrier traditionnel, e-mail, SMS, MMS, notifications push sur des sites tiers, y compris sur les plateformes Facebook et Google) concernant les produits et services de Whirlpool France S.A.S. même achetés ou enregistrés par vous.</p></label>' +
      '<label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData"><input required type="checkbox" id="check-18" data-bind="checked: checkout.check18, enable: checkout.saveData"><span class="newsletter-text" data-i18n="global.check18"> J\'ai plus de 18 ans* </span></label>'
    );
  }, 1000);
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
    appendImageOnCartSection();
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
  appendHtmlOnPaymentMethodOnLoad();
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
      let dim4value = getValuefromSpecifications(spec, "constructionType");
      var obj = {
        name: remove12ncName(value.name, value.refId),
        id: value.refId,
        price: value.isGift ? 0 : value.sellingPrice / 100,
        brand: value.additionalInfo.brandName,
        category: category.AdWordsRemarketingCode,
        variant: getValuefromSpecifications(spec, "Couleur"),
        quantity: value.quantity,
        dimension4: getDimension4(spec),
        dimension5:
          dim4value === "Built In" || dim4value === "BuiltIn"
            ? "Built-In"
            : dim4value,
        dimension6: findDimension(spec, "Offres"),
      };
      products.push(obj);
    })
  );
  $("body").removeClass("checkoutEventPush");
  if (stepID === 1) {
    window.dataLayer.push({
      event: "eec.checkout",
      currencyCode: vtexjs.checkout.orderForm.storePreferencesData.currencyCode,
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
        checkout: {
          actionField: {
            step: stepID,
          },
          products: products,
        },
      },
    });
  }
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
// /*
// function optinGranted() {
//   $(document).on("click", "#opt-in-newsletter", function () {
//     if (document.getElementById("opt-in-newsletter").checked) {
//       let dL = window.dataLayer || [];
//       dL.push({
//         'event': 'optin',
//  'eventCategory': 'Lead Generation',
//  'eventAction': 'Optin granted',
//  'eventLabel': 'checkout'
//       });
//     }
//   });
// }
// */

// //FUNREQ52 - Lead Generation Event
// function pushLeadGenerationEvent() {
//     return window.dataLayer.push({
//       event: "optin",
//       eventCategory: "Lead Generation",
//       eventAction: "Optin granted",
//       eventLabel: "checkout"
//     })
//   }

//   $(window).on("hashchange", function () {

//     const step = getCheckoutStep()

//     if (step == 0) {
//       window.eeccheckout.location = window.location.hash
//       return
//     }

//     const isOptin = vtexjs.checkout.orderForm.clientPreferencesData.optinNewsLetter
//     const leadGenerationEvents = window.dataLayer.filter((analyticsEvent) => analyticsEvent.event === "optin")
//     const isLeadGenerationNotPresent = leadGenerationEvents.length === 0

//     if(isOptin && isLeadGenerationNotPresent) {
//       pushLeadGenerationEvent();
//     }

//   })

// // End of FUNREQ52

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

// // Hardcoded translations

// // DEEE

// $(window).on("orderFormUpdated.vtex", () => {
//   getTotalDeee();
// });

// const getTotalDeee = async () => {
//   let priceElement = $("td.monetary[data-bind='text: totalLabel']");
//   let priceTemplate = "";
//   let ecofeeElement = "";
//   let orderFormItems = vtexjs.checkout.orderForm.items;
//   let sum = 0;
//   let result = orderFormItems.map((item) => {
//     return getSpecificationFromProduct(item.productId).then((value) => {
//       let prodSpecs = value;
//       let ecofee = getValuefromSpecifications(prodSpecs, "ecofee");
//       return ecofee * item.quantity;
//     });
//   });
//   return await Promise.all(result).then((arr) => {
//     let sumDEEE = arr.reduce(getSum);
//     if (arr != undefined) {
//       priceTemplate = `Dont ${sumDEEE}€ de eco-part. DEEE`;
//     } else {
//       priceTemplate = `*Le prix comprend la TVA, la DEEE et les promotions`;
//       //   console.error("Ecofee total is undefined");
//     }
//     ecofeeElement = `<span class="totalEcofee"> ${priceTemplate} </span>`;
//     priceElement.append(ecofeeElement);
//   });
// };

// function getSum(total, num) {
//   return total + Math.round(num);
// }
// const checkServicesPrice = () => {
//   $(`.extra-services-price`).each((index, element) => {
//     if (element.textContent != "Inclus") {
//       $(`.extra-services-price:eq(${index})`).addClass("servicePriceBlack");
//     }
//   });
// };
// function addStyle(styleString) {
//   const style = document.createElement("style");
//   style.textContent = styleString;
//   document.head.append(style);

//   // JQUERY MANIPULATION
// }
// $(window).on("load", function () {
//   hideDiscountTooltip();
//   $("input#cart-coupon").prop("placeholder", "Ajoutez votre code promotionnel");
//   $("button#cart-coupon-add").text("Appliquer");
//   checkServicesPrice();
// });
// setInterval(() => {
//   $("input#cart-coupon").prop("placeholder", "Ajoutez votre code promotionnel");
//   $("button#cart-coupon-add").text("Appliquer");
//   checkServicesPrice();
// }, 1000);

// //ADD AND REMOVE FROM CART EVENTS
// $(document).on("click", ".item-quantity-change-decrement", function () {
//   let splitted = $(this).attr("id").split("-");
//   let itemId = splitted[splitted.length - 1];
//   let item = findItem(itemId, vtexjs.checkout.orderForm.items);
//   let dataQ = $('[data-sku="' + itemId + '"] .quantity input').val();
//   if (item.quantity !== parseInt(dataQ)) {
//     pushRemoveToCart(item, 1);
//     pushCartState(item, 1, "remove", vtexjs.checkout.orderForm.items);
//   }
// });

// $(document).on("click", ".item-quantity-change-increment", function () {
//   let splitted = $(this).attr("id").split("-");
//   let itemId = splitted[splitted.length - 1];
//   let item = findItem(itemId, vtexjs.checkout.orderForm.items);
//   pushAddToCart(item, 1);
//   pushCartState(item, 1, "add", vtexjs.checkout.orderForm.items);
// });

// $(document).on("click", ".item-link-remove", function () {
//   let splitted = $(this).attr("id").split("-");
//   let itemId = splitted[splitted.length - 1];
//   let item = findItem(itemId, vtexjs.checkout.orderForm.items);
//   pushRemoveToCart(item, item.quantity);
//   pushCartState(item, item.quantity, "remove", vtexjs.checkout.orderForm.items);
// });

// $(document).on("blur", ".quantity input", function () {
//   let splitted = $(this).attr("id").split("-");
//   let itemId = splitted[splitted.length - 1];
//   let item = findItem(itemId, vtexjs.checkout.orderForm.items);
//   let dataQ = $(this).val();
//   if (item.quantity == dataQ) {
//     return;
//   } else if (item.quantity > dataQ) {
//     pushRemoveToCart(item, item.quantity - dataQ);
//     pushCartState(
//       item,
//       item.quantity - dataQ,
//       "remove",
//       vtexjs.checkout.orderForm.items
//     );
//   } else {
//     pushAddToCart(item, dataQ - item.quantity);
//     pushCartState(
//       item,
//       dataQ - item.quantity,
//       "add",
//       vtexjs.checkout.orderForm.items
//     );
//   }
// });

// function setPriceFormat(price) {
//   let newPrice = parseInt(price) / 100 + "";
//   if (newPrice.indexOf(".") == -1) {
//     return parseInt(newPrice).toFixed(2);
//   } else {
//     let arrayPrice = newPrice.split(".");
//     return parseInt(arrayPrice[1]) < 10 ? newPrice + "0" : newPrice;
//   }
// }
// function findItem(id, items) {
//   for (let i = 0; i < items.length; i++) {
//     if (items[i].id == id) {
//       return items[i];
//     }
//   }
//   return null;
// }
// function findVariant(data) {
//   const result = data.filter((o) => o.Name == "Couleur");
//   return result.length > 0 ? result[0].Value[0] : "";
// }
function findDimension(data, nameKey) {
  if (nameKey === "Offres") {
    let result = data.filter((obj) => obj.Name == nameKey);
    result.length > 0 ? (result = result[0]) : null;
    if (result === undefined || result.Value === undefined)
      return "Not in Promo";
    if (result.Value.length > 0 && result.Value.includes("Offres spéciales"))
      return "In Promo";
    else return "Not in Promo";
  }
  let result = data.filter((obj) => obj.Name == nameKey);
  return result[0].Value[0];
}
// function costructionType(cType) {
//   if (cType.indexOf("Free ") !== -1) {
//     let cTypeArray = cType.split(" ");
//     return cTypeArray[0] + cTypeArray[1].toLowerCase();
//   } else {
//     return cType.replace(" ", "-");
//   }
// }
// function pushAddToCart(item, dataQ) {
//   let categoryId = Object.keys(item.productCategories)[
//     Object.keys(item.productCategories).length - 1
//   ];
//   Promise.all([
//     getSpecificationFromProduct(item.productId),
//     getStringCategoryFromId(categoryId),
//   ]).then((values) => {
//     window.dataLayer.push({
//       ecommerce: {
//         add: {
//           actionField: {
//             action: "add",
//           },
//           products: [
//             {
//               brand: item.additionalInfo.brandName,
//               category: values[1].AdWordsRemarketingCode,
//               id: item.refId,
//               name: item.name,
//               price:
//                 `${item.price}` == "0" ? "" : setPriceFormat(`${item.price}`),
//               quantity: dataQ,
//               variant: findVariant(values[0]),
//               dimension4:getDimension4(values[0]),
//               dimension5: costructionType(
//                 findDimension(values[0], "constructionType")
//               ),
//             },
//           ],
//         },
//         currencyCode: "EUR",
//       },
//       event: "eec.addToCart",
//     });
//   });
// }
// function pushRemoveToCart(item, dataQ) {
//   let categoryId = Object.keys(item.productCategories)[
//     Object.keys(item.productCategories).length - 1
//   ];
//   Promise.all([
//     getSpecificationFromProduct(item.productId),
//     getStringCategoryFromId(categoryId),
//   ]).then((values) => {
//     window.dataLayer.push({
//       ecommerce: {
//         currencyCode: "EUR",
//         remove: {
//           actionField: {
//             action: "remove",
//           },
//           products: [
//             {
//               brand: item.additionalInfo.brandName,
//               category: values[1].AdWordsRemarketingCode,
//               id: item.refId,
//               name: item.name,
//               price:
//                 `${item.price}` == "0" ? "" : setPriceFormat(`${item.price}`),
//               quantity: dataQ,
//               variant: findVariant(values[0]),
//               dimension4:getDimension4(values[0]),
//               dimension5: costructionType(
//                 findDimension(values[0], "constructionType")
//               ),
//             },
//           ],
//         },
//       },
//       event: "eec.removeFromCart",
//     });
//   });
// }
// function getItemsForCart(itemId, quantity, operation, items) {
//   products = [];
//   items.forEach((item) => {
//     let obj = {};
//     if (item.refId == itemId) {
//       if (operation == "remove" && item.quantity - quantity == 0) {
//         return;
//       }
//       obj = {
//         id: item.refId,
//         price:
//           `${item.price}` == "0" ? "" : setPriceFormat(`${item.sellingPrice}`),
//         quantity:
//           operation == "remove"
//             ? item.quantity - quantity
//             : item.quantity + quantity,
//       };
//     } else {
//       obj = {
//         id: item.refId,
//         price:
//           `${item.price}` == "0" ? "" : setPriceFormat(`${item.sellingPrice}`),
//         quantity: item.quantity,
//       };
//     }
//     products.push(obj);
//   });
//   return products;
// }
// function pushCartState(itemChange, quantityChange, operation, items) {
//   window.dataLayer.push({
//     event: "cartState",
//     products: getItemsForCart(
//       itemChange.refId,
//       quantityChange,
//       operation,
//       items
//     ),
//   });
// }

//GA4FUNREQ30
const handleMouseover = () => {
  window.dataLayer.push({
    event: "extra_info_interaction",
    type: "tooltip",
  });
};
// End of GA4FUNREQ30

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

//GA4FUNREQ73 - view_cart
$(document).ready(function () {
  const step = getCheckoutStep();

  if (step === 0) {
    pushViewCartEvent();
  }
});

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

function getSellableStatusBySalesChannel(salesChannel) {
  switch (salesChannel) {
    case "1":
      return "sellableEPP";
    case "2":
      return "sellableFF";
    case "3":
      return "sellableVIP";
    default:
      return "";
  }
}

async function pushViewCartEvent() {
  let orderForm = await vtexjs.checkout.getOrderForm();
  var items = orderForm.items;
  let cartItems = [];

  await Promise.all(
    items.map(async (value) => {
      var categoryIdsSplitted = value.productCategoryIds.split("/");
      let spec = await getSpecificationFromProduct(value.productId);

      let category = await getStringCategoryFromId(
        categoryIdsSplitted[categoryIdsSplitted.length - 2]
      );
      const promoStatus =
        value.price < value.listPrice ? "In Promo" : "Not in Promo";

      var obj = {
        item_id: value.refId,
        item_name: remove12ncName(value.name, value.refId),
        item_brand: value.additionalInfo.brandName,
        item_variant: getValuefromSpecifications(spec, "Couleur"),
        item_category: category.AdWordsRemarketingCode,
        price: value.isGift ? 0 : value.sellingPrice / 100,
        quantity: value.quantity,
        // also known as dimension4
        sellable_status:
          getValuefromSpecifications(
            spec,
            getSellableStatusBySalesChannel(orderForm?.salesChannel)
          ) === "true"
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

//------------------------------------------
//---------NEW_RELIC_INTEGRATION------------
//------------------------------------------

$(document).on("ready", function () {
  let script = document.createElement("script");
  script.src = "/arquivos/new_relic.js";
  script.type = "text/javascript";
  document.head.appendChild(script);
});

/*--------------------------FEREADY-------------------------------*/
function feReady(pageType) {
  let dataLayer = window.dataLayer || [];
  if (
    vtexjs.checkout.orderForm !== undefined &&
    vtexjs.checkout.orderForm.loggedIn
  ) {
    fetch("/_v/wrapper/api/user/userinfo", { method: "GET" })
      .then((res) => res.json())
      .then((user) => {
        fetch("/_v/wrapper/api/user/hasorders", { method: "GET" }).then(
          (orders) => {
            dataLayer.push({
              event: "feReady",
              status: "authenticated",
              "product-macrocategory": "",
              contentGrouping: pageType,
              contentGroupingSecond: "",
              "product-code": "",
              "product-name": "",
              "product-category": "",
              "vip-company": getVipCompany(),
              userType: userType(orders, user[0].isNewsletterOptIn),
              pageType: pageType,
            });
          }
        );
      });
  } else {
    dataLayer.push({
      event: "feReady",
      status: "anonymous",
      "product-macrocategory": "",
      contentGrouping: pageType,
      contentGroupingSecond: "",
      "product-code": "",
      "product-name": "",
      "product-category": "",
      userType: "guest",
      "vip-company": getVipCompany(),
      pageType: pageType,
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

function userType(orders, isNewsletterOptin) {
  let userTypeValue = isNewsletterOptin ? "prospect" : "lead";
  orders.toString() == "true" ? (userTypeValue = "customer") : null;
  return userTypeValue;
}

//ANALYTICS COUPON TRACKING

$("body").on("change", "#cart-coupon", (e) => {
  window.lastCouponText = e.currentTarget.value;
});
$("body").on("click", "#cart-coupon-add", (e) => {
  setTimeout(() => {
    var el = document.getElementsByClassName("vcustom-showCustomMsgCoupon")[0];
    if (el) {
      if (
        el.textContent ===
        "Aucune réduction disponible. Vérifiez les conditions."
      ) {
        window.dataLayer.push({
          event: "couponTracking",
          eventCategory: "Coupon",
          eventAction: window.lastCouponText,
          eventLabel: "Not Valid",
        });
      } else {
        window.dataLayer.push({
          event: "couponTracking",
          eventCategory: "Coupon",
          eventAction: window.lastCouponText,
          eventLabel: "Valid",
        });
      }
    } else {
      if (document.getElementById("cart-coupon").value.length > 0) {
        window.dataLayer.push({
          event: "couponTracking",
          eventCategory: "Coupon",
          eventAction: window.lastCouponText,
          eventLabel: "Valid",
        });
      } else {
        window.dataLayer.push({
          event: "couponTracking",
          eventCategory: "Coupon",
          eventAction: window.lastCouponText,
          eventLabel: "Not Valid",
        });
      }
    }
  }, 3000);
});
function getVipCompany() {
  let url = window.location.href;
  if (url.includes("vip")) {
    return sessionStorage["userCluster"]
      ? sessionStorage["userCluster"]
      : "vip";
  } else if (url.includes("epp")) {
    return "epp";
  } else {
    return "ff";
  }
}
function getDimension4(properties) {
  let accountType = getVipCompany();
  let result;
  switch (accountType) {
    case "ff":
      result = properties.filter(
        (obj) => obj.name === "sellableFF" || obj.Name === "sellableFF"
      );
      break;
    case "epp":
      result = properties.filter(
        (obj) => obj.name === "sellableEPP" || obj.Name === "sellableEPP"
      );
      break;
    default:
      result = properties.filter(
        (obj) => obj.name === "sellableVIP" || obj.Name === "sellableVIP"
      );
  }
  if (result.length > 0) {
    let value = result[0].values
      ? result[0].values[0] == "true"
      : result[0].Value[0] == "true";

    return value ? "Sellable Online" : "Not Sellable Online";
  }
}

// ------ ALMA ------ //
const appendHtmlOnPaymentMethod = () => {
  const almaBox = document.querySelector(".AlmaPaymentGroup");

  const imgSRC = "https://frwhirlpoolqa.vtexassets.com/assets/vtex.file-manager-graphql/images/dce5ad91-0c9b-46ae-9875-1036c95ec8f4___fbdd558339a79a909a9a47f1c58c8a83.png";
  if ([...almaBox.children].some(el => el.src === imgSRC)) return;

  const img = document.createElement("IMG");
  const p = document.createElement("P");
  p.innerHTML =
    "Alma est disponible pour une commande comprise entre 100€ et 3000 €";
  p.className = " almaDisclaimer";
  img.className = "almaBoxImg";
  img.src = imgSRC;

  almaBox?.append(img);
  almaBox?.append(p);

  const almaTItle = document.querySelector("#payment-group-AlmaPaymentGroup > span");
  almaTItle.innerHTML = "ALMA : paiement en 3 à 4 fois avec carte bancaire";
};

$(document).on("click", "#payment-group-AlmaPaymentGroup", function () {
  appendHtmlOnPaymentMethod()
})

const appendHtmlOnPaymentMethodOnLoad = () => {
  if (!window.location.hash === "#/payment") return;

  const almaBox = document.querySelector(".AlmaPaymentGroup");
  if (almaBox) appendHtmlOnPaymentMethod()
  else setTimeout(appendHtmlOnPaymentMethodOnLoad, 250)
}

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

// DEPARTMENT FIX
$(window).on("hashchange", function () {
  if (window.location.hash === "#/shipping") {
    // DEPARTMENT FIX
    if ($(".dep_warning_message")[0] === undefined) {
      $(
        "<p class='dep_warning_message'>Nous sommes en maintenance.  Veuillez sélectionner votre région manuellement.</p>"
      ).insertBefore($("#btn-go-to-shippping-method"));
    }
  }
});
//////////////////////////////////////////////
// if the user choose installation the fast delivery should be hidden

$(window).on("orderFormUpdated.vtex", () => {
  var targetNode = document.getElementById("shipping-data");
  var config = {
    attributes: true,
    childList: true,
    subtree: true,
  }; // Callback function to execute when mutations are observed
  if (targetNode || (window.location.hash == "#/shipping")) {

    var callback = function (mutationsList) {
      for (var mutation of mutationsList) {
        if (mutation.type == "childList") {
          const orderForm = vtexjs?.checkout?.orderForm;
          !vtexjs.checkout.orderForm.items.some((item) => {
            item.bundleItems.some((bundle) => {
              if (
                (bundle.additionalInfo.offeringType == "VIP_Installation" ||
                  bundle.additionalInfo.offeringType == "EPP_Installation" ||
                  bundle.additionalInfo.offeringType == "FF_Installation") &&
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
//////////////////////////////////////remove installation when fast delivery choosed ////////////////////