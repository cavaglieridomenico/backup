//------------------------------------------
//---------LABELS TRANSLATION------
//------------------------------------------

const labelTranslations = () => {
  $("p.custom-corporate-street label").text("Numéro et nom de la voie");
  $("p.custom-corporate-number label").text(
    "Information complémentaire pour l’adress"
  );
  $(".vtex-front-messages-detail").text("Coupon invalide");
  $(".v-custom-ship-street").children("label").html("Numéro et nom de la voie");
  $(".ship-complement")
    .children("label")
    .html("Information complémentaire pour l'adresse");
  $("#ship-complement").attr("placeholder", "");
  $(".ship-city").children("label").html("Ville");
  $(".ship-state").children("label").html("Département");
  $(".ship-postalCode").children("label").html("Code postal");
  $(".btn-go-to-shippping-method").html("Valider ma commande");
  $(".vtex-omnishipping-1-x-shippingSectionTitle delivery-address-title").html(
    "Complétez votre adresse"
  );
  $("#force-shipping-fields").html("Modifier");
  $(".vtex-omnishipping-1-x-deliveryGroup")
    .children("p")
    .html("Type d’expédition");
  $(".shp-summary-group-price").html("inclus");
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
  $(".shp-option-text-price").html("Inclus");
  $(".shp-option-text-label-single").html("Délai classique");
};

const changeExpeditionLabel = () => {
  $(".phone-box").remove();
  $("input#client-phone2").prop("disabled", false);
  $("#shipping-data").find(".accordion-toggle").html("Livraison");
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
  if (window.location.hash === "#/payment") {
    $(".payment-group-item-text").html("Carte bancaire");
  }
};

$(window).on("orderFormUpdated.vtex", () => {
  labelTranslations();
  $(".custom-corporate-state").remove();
});

$(document).ready(function () {
  labelTranslations();
});

$(window).on("load", function () {
  setInterval(() => changeExpeditionLabel(), 1000);
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
  setInterval(
    () => $(".vtex-front-messages-detail").text("Coupon invalide"),
    250
  );
});

//------------------------------------------
//------------ ONE TRUST -------------------
//------------------------------------------
$(document).ready(function () {
  var script = document.createElement("script");
  script.src = "https://cdn.cookielaw.org/scripttemplates/otSDKStub.js";
  script.setAttribute("charset", "UTF-8");
  script.setAttribute(
    "data-domain-script",
    "9ecf3343-9eb6-4fb5-b71f-ce2228f960dc-test"
  );
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
  optinGranted();
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
      '<p class="informativa" style="font-size: 13px;margin: .5rem 0;">J\'ai pris connaissance et j\'accepte la <a href="/pages/politique-de-protection-des-donnees-a-caractere-personnel" target="_blanck">politique de protection des données à caractère personnel </a> et:</p><label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData"><input type="checkbox" id="opt-in-newsletter" data-bind="checked: checkout.optinNewsLetter, enable: checkout.saveData"><span class="newsletter-text" data-i18n="global.optinNewsLetter"> J\'accepte de recevoir des communications personnalisées sur les offres et promotions du Groupe Whirlpool et de ses marques</span></label>' +
      '<label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData"><input required type="checkbox" id="check-18" data-bind="checked: checkout.check18, enable: checkout.saveData"><span class="newsletter-text" data-i18n="global.check18"> J\'ai plus de 18 ans* </span></label>'
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
        ]).then((values) => {
          let dim4value = getValuefromSpecifications(
            values[0],
            "constructionType"
          );
          var obj = {
            name: remove12ncName(value.name, value.refId),
            id: value.refId,
            price: value.isGift ? 0 : value.sellingPrice / 100,
            brand: value.additionalInfo.brandName,
            category: values[1].AdWordsRemarketingCode,
            variant: getValuefromSpecifications(values[0], "Couleur"),
            quantity: value.quantity,
            dimension4:
              dim4value === "Built In" || dim4value === "BuiltIn"
                ? "Built-In"
                : dim4value,
            dimension5:
              getValuefromSpecifications(values[0], "sellable") === "true"
                ? "Sellable Online"
                : "Not Sellable Online",
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
function optinGranted() {
  $(document).on("click", "#opt-in-newsletter", function () {
    if (document.getElementById("opt-in-newsletter").checked) {
      let dL = window.dataLayer || [];
      dL.push({
        event: "optin_granted",
      });
    }
  });
}

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
    if (result.Value.length > 0 && result.Value.includes("Offres spéciales"))
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
