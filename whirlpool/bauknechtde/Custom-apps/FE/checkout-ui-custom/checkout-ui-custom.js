//------------------------------------------
//--------------- START GA4 EVENTS ---------------
//------------------------------------------

//GA4FUNREQ58
// const setAnalyticCustomError = () => {
//   const ga4Data = {
//     event: "custom_error",
//     type: "error message",
//     description: "",
//   };

//   const form = document.querySelector(".form-step.box-edit");
//   const btnSubmit = document.querySelector("#go-to-shipping");

//   btnSubmit.addEventListener("click", () => {
//     setTimeout(() => {
//       const popupMessage = document.querySelector(
//         ".vtex-front-messages-type-error"
//       );
//       if (popupMessage) {
//         const popupTextMessage = document.querySelector(
//           ".vtex-front-messages-detail"
//         );
//         ga4Data.description = `Form: ${popupTextMessage.innerHTML}`;
//         window.dataLayer.push({ ...ga4Data });
//       }
//     }, 2000);

//     const inputList = form.querySelectorAll("input");
//     const isError = false;
//     for (let element of inputList) {
//       if (element.classList.contains("error") && element.nextElementSibling) {
//         ga4Data.description = `${element.previousElementSibling.innerHTML}: ${element.nextElementSibling.innerHTML}`;
//         window.dataLayer.push({ ...ga4Data });
//       }
//       if (element.classList.contains("error")) {
//         isError = true;
//       }
//     }
//   });
// };

// $(document).ready(function () {
//   setAnalyticCustomError();
// });
// End of GA4FUNREQ58

//GA4FUNREQ30
const handleMouseover = () => {
  window.dataLayer.push({
    event: "extra_info_interaction",
    type: "tooltip",
  });
};
// End of GA4FUNREQ30

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

//GA4FUNREQ61
function pushOptinInEvent() {
  return window.dataLayer.push({
    event: "optin",
  });
}

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

//--------------- END GA4 EVENTS ---------------//

//------------------------------------------
//--------------- POPUP MESSAGE WHEN QUANTITY = 2 ---------------
//------------------------------------------
const setListenerOnExtraServices = () => {
  waitForEl(".extra-services-input", function () {
    const extraServicesInputs = [
      ...document.getElementsByClassName("extra-services-input"),
    ];

    extraServicesInputs.forEach((service) =>
      service.addEventListener("change", function () {
        const productId = $(`#${service.id}`)
          .parentsUntil("cart-items")
          .find(".product-item")
          .attr("data-sku");
        const quantity = vtexjs.checkout.orderForm?.items?.find(
          (item) => item.id == productId
        )?.quantity;
        console.log("Quantity: ", quantity);

        if (quantity > 1) {
          displayAddedProductPopup();
        }
        setTimeout(() => {
          console.log("extra services listener");
          setListenerOnExtraServices();
          console.log("increment button listener");
          setListenerOnIncrementButton();
          console.log("decrement button listener");
          setListenerOnDecrementButton();
        }, 1500);
      })
    );
  });
};

const displayAddedProductPopup = () => {
  const popup = document.createElement("div");
  popup.id = "popup-div";
  document.body.prepend(popup);
  if (window.scrollY == 0) {
    popup.setAttribute(
      "style",
      "animation-name: showPopup; animation-duration: 5s;"
    );
  } else {
    popup.setAttribute("style", "opacity: 1;");
  }

  $("#popup-div").html(
    `<span>Als separates Produkt hinzugefügt. Bitte überprüfen Sie, ob die übernommen Services gewünscht sind.</span>`
  );

  setTimeout(() => {
    console.log("popup removed");
    $("#popup-div").remove();
  }, 5000);
};

const setListenerOnIncrementButton = () => {
  waitForEl(".item-quantity-change-increment", function () {
    const incrementButtons = [
      ...document.getElementsByClassName("item-quantity-change-increment"),
    ];
    console.log("increment buttons: ", incrementButtons);
    incrementButtons.forEach((incrementButton) => {
      incrementButton.addEventListener("click", function () {
        const productId = $(this)
          .parentsUntil("cart-items")
          .find(".product-item")
          .attr("data-sku");
        const numberOfAdditionalServicesChecked =
          vtexjs.checkout.orderForm?.items
            ?.filter((item) => item.id == productId)
            .reduce((prev, curr) => prev + curr.bundleItems?.length, 0);
        console.log(
          "NUMBER of checked additional services: ",
          numberOfAdditionalServicesChecked
        );
        // The popup is show only if some additional services is checked
        if (numberOfAdditionalServicesChecked > 0) {
          displayAddedProductPopup();
        }
        setTimeout(() => {
          // All the listeners are propagated
          console.log("increment button listener");
          setListenerOnIncrementButton();
          console.log("decrement button listener");
          setListenerOnDecrementButton();
          console.log("extra services listener");
          setListenerOnExtraServices();
        }, 1500);
      });
    });
  });
};
//It just propagates the listeners to avoid losing them
const setListenerOnDecrementButton = () => {
  waitForEl(".item-quantity-change-decrement", function () {
    const decrementButtons = [
      ...document.getElementsByClassName("item-quantity-change-decrement"),
    ];
    console.log("decrement buttons: ", decrementButtons);
    decrementButtons.forEach((decrementButton) => {
      decrementButton.addEventListener("click", function () {
        setTimeout(() => {
          console.log("decrement button listener");
          setListenerOnDecrementButton();
          console.log("increment button listener");
          setListenerOnIncrementButton();
          console.log("extra services listener");
          setListenerOnExtraServices();
        }, 1500);
      });
    });
  });
};

$(document).ready(function () {
  if (
    window.location.hash === "#/cart" ||
    window.location.pathname == "/checkout/"
  ) {
    setTimeout(() => {
      console.log("extra services listener");
      setListenerOnExtraServices();
      console.log("increment buttons listener");
      setListenerOnIncrementButton();
      console.log("decrement buttons listener");
      setListenerOnDecrementButton();
    }, 3000);
  }
});

//------------------------------------------
//--------------- DISABLE CREATION OF MYACCOUNT ---------------
//------------------------------------------
// const disableMyAccount = async () => {
//   if (!vtexjs.checkout?.orderForm?.loggedIn) {
//     const fakeEmailValue =
//       vtexjs.checkout.orderForm?.customData?.customApps?.find(
//         (data) => data.id == "profile"
//       )?.fields?.email || "";
//     //If user is not logged in replace the email field with a fake one
//     const fakeEmail = `<input class="client-email-custom-profile" type="email" id="client-email-custom" required name="email" value="${fakeEmailValue}">`;
//     if (!$(".client-email-custom-profile").length) {
//       $(".client-email").append(fakeEmail);

//       //Fake Email validation
//       const emailInput = $(".client-email-custom-profile");
//       const emailRegex =
//         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//       const spanToAppend = (label) =>
//         `<span class="customError">${label}</span>`;
//       const emptyValueLabel = "Dieses Feld wird benötigt.";
//       const wrongEmailValueLabel =
//         "Geben Sie bitte eine gültige E-Mail-Adresse ein.";
//       emailInput.on("blur", function (e) {
//         if (e.currentTarget.value.trim() == "") {
//           emailInput.addClass("error");
//           emailInput.parent().append(spanToAppend(emptyValueLabel));
//         } else if (!emailRegex.test(e.currentTarget.value)) {
//           emailInput.addClass("error");
//           emailInput.parent().append(spanToAppend(wrongEmailValueLabel));
//         } else {
//           emailInput.removeClass("error");
//           vtexjs.checkout.setCustomData({
//             app: "profile",
//             field: "email",
//             value: e.currentTarget.value.trim(),
//           });
//         }
//       });

//       //Remove the error label
//       emailInput.on("focus", function () {
//         emailInput.siblings(".customError").remove();
//         emailInput.removeClass("error");
//       });
//     }

//     //Retrieving the fake email
//     const fakeEmailValueResult = await fetch(
//       "/v1/wrapper/api/emailgenerator",
//       options
//     )
//       .then((response) => response.json())
//       .catch((err) => console.error(err));

//     $("#client-email").prop("value", fakeEmailValueResult?.email);
//   }
// };

/*----------Express delivery Label-------------*/
var isProduct;
var isAccessory;

$(document).ready(function () {
  setTimeout(() => {
    isProduct = vtexjs.checkout.orderForm?.items.some(
      (item) => item.productCategoryIds.split("/")?.[1]?.toString() == "1"
    );
    isAccessory = vtexjs.checkout.orderForm?.items.some(
      (item) => item.productCategoryIds.split("/")?.[1]?.toString() == "2"
    );
    // const expressDelivery =
    //   vtexjs.checkout.orderForm.shippingData.logisticsInfo[0].slas.find((sla) =>
    //     sla.id?.toLowerCase()?.includes("express")
    //   );
    // const expressNumber = expressDelivery?.shippingEstimate?.split("bd")[0];

    waitForEl(".shp-option-text-time", function () {
      const expressDeliveryLabel2 = $(`#FASTEST`)
        .children(".shp-option-text")
        .children(".shp-option-text-time")
        .children();
      setInterval(() => {
        if (
          isAccessory &&
          isProduct &&
          expressDeliveryLabel2.text() !=
            `Innerhalb von 3 Werktagen. Expresslieferung nicht gültig für Zubehör.`
        ) {
          expressDeliveryLabel2.text(
            `Innerhalb von 3 Werktagen. Expresslieferung nicht gültig für Zubehör.`
          );
        }
      }, 500);
    });

    waitForEl(".shp-summary-package-time", function () {
      setInterval(() => {
        if (
          isAccessory &&
          isProduct &&
          vtexjs.checkout.orderForm.shippingData.logisticsInfo[0]?.selectedSla
            ?.toLowerCase()
            ?.includes("express")
        ) {
          $(".shp-summary-package-time").text(
            `Innerhalb von 3 Werktagen. Expresslieferung nicht gültig für Zubehör.`
          );
        }
      }, 500);
    });
  }, 1000);
});
/*-----------------------*/

// $(document).ready(function () {
//   if (
//     window.location.hash === "#/profile" ||
//     window.location.hash === "#/email"
//   ) {
//     waitForEl("#client-email", function () {
//       if (!vtexjs.checkout?.orderForm?.loggedIn) {
//         $("#client-email").css("display", "none");
//       }
//     });
//     setTimeout(() => {
//       disableMyAccount();
//     }, 1000);
//   } else {
//     setTimeout(() => {
//       replaceEmailTextWithFake();
//     }, 1000);
//   }
// });
// $(window).on("hashchange", () => {
//   if (
//     window.location.hash === "#/profile" ||
//     window.location.hash === "#/email"
//   ) {
//     waitForEl("#client-email", function () {
//       if (!vtexjs.checkout?.orderForm?.loggedIn) {
//         $("#client-email").css("display", "none");
//       }
//     });
//     setTimeout(() => {
//       disableMyAccount();
//     }, 1000);
//   } else {
//     replaceEmailTextWithFake();
//   }
// });

// const replaceEmailTextWithFake = () => {
//   waitForEl(".client-profile-email", function () {
//     if (!vtexjs.checkout?.orderForm?.loggedIn) {
//       const fakeEmail = vtexjs.checkout.orderForm?.customData?.customApps?.find(
//         (data) => data.id == "profile"
//       )?.fields?.email;
//       $(".client-profile-email").children(".email").text(fakeEmail);
//     }
//   });
// };

//------------------------------------------//

//------------------------------------------
//--------------- CUSTOM VALIDATIONS ---------------
//------------------------------------------
$(document).ready(function () {
  window.vtex.i18n.de.paymentData.paymentGroup.Klarna.name = "Klarna";
  window.vtex.i18n.de.global.backToCart = "Zum Warenkorb";
  const emptyValueLabel = "Dieses Feld wird benötigt.";
  const wrongEmailValueLabel =
    "Geben Sie bitte eine gültige E-Mail-Adresse ein.";
  const wrongNameValueLabel = "Ungültige Zeichen.";
  const wrongPhoneValueLabel = "Ungültige Telefonnummer.";
  const spanToAppend = (label) => `<span class="customError">${label}</span>`;

  //   //Email validation
  const emailInput = $("#client-email");
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  emailInput.on("blur", function (e) {
    if (e.currentTarget.value.trim() == "") {
      emailInput.parent().append(spanToAppend(""));
    } else if (!emailRegex.test(e.currentTarget.value)) {
      emailInput.addClass("error");
      emailInput.parent().append(spanToAppend(wrongEmailValueLabel));
    } else {
      emailInput.removeClass("error");
    }
  });

  //Remove the error label
  emailInput.on("focus", function () {
    emailInput.siblings(".customError").remove();
    emailInput.removeClass("error");
  });

  //Name validation
  const nameInput = $("#client-first-name");
  const nameRegex = /^[a-zA-ZäÄüÜöÖß]+[a-zA-Z-\säÄüÜöÖß]*$/;

  nameInput.on("blur", function (e) {
    if (e.currentTarget.value.trim() == "") {
      nameInput.parent().append(spanToAppend(emptyValueLabel));
    } else if (!nameRegex.test(e.currentTarget.value)) {
      nameInput.addClass("error");
      nameInput.parent().append(spanToAppend(wrongNameValueLabel));
    } else {
      nameInput.removeClass("error");
    }
  });

  //Remove the error label
  nameInput.on("focus", function () {
    nameInput.siblings(".customError").remove();
    nameInput.removeClass("error");
  });

  //Last Name validation
  const lastNameInput = $("#client-last-name");

  lastNameInput.on("blur", function (e) {
    if (e.currentTarget.value.trim() == "") {
      lastNameInput.parent().append(spanToAppend(emptyValueLabel));
    } else if (!nameRegex.test(e.currentTarget.value)) {
      lastNameInput.addClass("error");
      lastNameInput.parent().append(spanToAppend(wrongNameValueLabel));
    } else {
      lastNameInput.removeClass("error");
    }
  });

  //Remove the error label
  lastNameInput.on("focus", function () {
    lastNameInput.siblings(".customError").remove();
    lastNameInput.removeClass("error");
  });

  //Phone validation
  //   const phoneRegex = /^[\d]{6,15}$/;

  setTimeout(() => {
    const phoneInput = $("#client-phone");
    phoneInput.on("blur", function (e) {
      if (e.currentTarget.value.trim() == "") {
        phoneInput.parent().append(spanToAppend(emptyValueLabel));
      }
      //   else if (!phoneRegex.test(e.currentTarget.value)) {
      //     phoneInput.addClass("error");
      //     phoneInput.parent().append(spanToAppend(wrongPhoneValueLabel));
      //   }
      else {
        phoneInput.removeClass("error");
      }
    });

    phoneInput.on("focus", function () {
      phoneInput.siblings(".customError").remove();
      phoneInput.removeClass("error");
    });
  }, 2000);

  //Remove the error label
});

//---------------------------------------------//

//------------------------------------------
//--------------- SUPPORT BOX ---------------
//------------------------------------------

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

$(document).ready(function () {
  if (
    window.location.hash === "#/cart" ||
    window.location.pathname == "/checkout/"
  ) {
    waitForEl(".totalizers-list", function () {
      const textToAppend = `<div class="vat-label-container"><span class="vat-label-text">Inkl. MwSt. und gültigen Aktionen, ausschließlich Garantieverlängerungen.</span></div> <div class="shippingContainer"><span class="freeShippingImage"></span> <span class="freeShipping-label-text">Kostenlose Lieferung an den gewünschten Aufstellort</span></div>`;
      $(".totalizers-list").siblings().append(textToAppend);
    });
  }
  if (window.location.hash === "#/cart") {
    waitForEl(".cart", function () {
      $(".cart").prepend(
        `<div class="productsNumberLabel">Ihr Warenkorb ( <span id="products-number-label"></span> Artikel)</div>`
      );
    });

    const summaryBox =
      '<div class="cart-info-summary__group"> <div class="cart-info-summary__title"> <span class="cart-summary__title-text" >Fragen rund um den Online-Kauf von Hausgeräten?</span > </div> <div class="cart-info-summary__row"> <span class="cart-info-summary__subtitle">E-Mail</span> <span class="cart-info-summary__text" ><a class="cart-info-summary__text--small" href="mailto:shop@bauknecht.com" >shop@bauknecht.com</a ></span > </div> <div class="cart-info-summary__row"> <span class="cart-info-summary__subtitle">Telefon</span> <span class="cart-info-summary__text"> <a class="cart-info-summary__text--big" href="tel:0711 8888 950" >0711 8888 950*</a > </span> <span class="cart-info-summary__text" >(Mo - Fr: 08.00 - 16.00 Uhr)</span > </div> <div class="cart-info-summary__row"> <span class="cart-info-summary__text"> * Anrufertarif providerabhängig </span> </div> </div> ';

    window.onresize = function () {
      $(".cart-info-summary__group").remove();
      if (window.innerWidth < 690) {
        $(".cart-totalizers").append(summaryBox);
      }
      if (window.innerWidth >= 690) {
        $(".cart-links").append(summaryBox);
      }
    };

    waitForEl("#cart-to-orderform", function () {
      if (window.innerWidth < 690) {
        $(".cart-totalizers").append(summaryBox);
      } else {
        $(".cart-links").append(summaryBox);
      }
    });
  }

  //PRODUCTS NUMBER LABEL
  $(window).on("orderFormUpdated.vtex", () => {
    const productsNumber = vtexjs.checkout.orderForm?.items?.reduce(
      (acc, curr) => acc + curr.quantity,
      0
    );
    $("#products-number-label").text(productsNumber);
  });
});
//---------------------------------------------//

//---------     ENERGY LABEL      ----------
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
          let isSellable = getValuefromSpecifications(values[0], "sellable");
          let fewPieces = getValuefromSpecifications(
            values[0],
            "showFewPiecesAlert"
          );
          var obj = {
            label: energyUrl,
            productId: value.id,
            labelPdf: energyPdf,
            oldLabelPdf: oldEnergyPdf,
            productInformation: productInformation,
            oldProductInformation: oldProductInformation,
            isSellable: isSellable,
            fewPieces: fewPieces,
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
            .indexOf("availabilityLabel") == -1
        ) {
          let coupon = $(".v-custom-addLabels-active-flag");
          if (coupon.length > 0) {
            if (energyLabel.isSellable) {
              $(`[data-sku= ${energyLabel.productId}]`)
                .find(".product-name")
                .find(coupon)
                .before(
                  `${
                    energyLabel.fewPieces == "true" &&
                    energyLabel.isSellable == "true"
                      ? '<p id="availabilityLabel"><img src="https://bauknechtde.vtexassets.com/assets/vtex/assets-builder/bauknechtde.whl-theme/0.0.8/icons/orange_dot.svg" style="width:0.5rem; height:0.5rem;">Nur noch wenige verfügbar </p>'
                      : energyLabel.isSellable == "true"
                      ? '<p id="availabilityLabel"><img src="https://bauknechtde.vtexassets.com/assets/vtex/assets-builder/bauknechtde.whl-theme/0.0.8/icons/green_dot.svg"style="width:0.5rem; height:0.5rem;"> Auf Lager: Lieferzeit 4-6 Werktage</p>'
                      : ""
                  }`
                );
            }
          } else {
            if (energyLabel.isSellable) {
              $(`[data-sku= ${energyLabel.productId}]`)
                .find(".product-name")
                .append(
                  `${
                    energyLabel.fewPieces == "true" &&
                    energyLabel.isSellable == "true"
                      ? '<p id="availabilityLabel"><img src="https://bauknechtde.vtexassets.com/assets/vtex/assets-builder/bauknechtde.whl-theme/0.0.8/icons/orange_dot.svg" style="width:0.5rem; height:0.5rem;"> Nur noch wenige verfügbar </p>'
                      : energyLabel.isSellable == "true"
                      ? '<p id="availabilityLabel"><img src="https://bauknechtde.vtexassets.com/assets/vtex/assets-builder/bauknechtde.whl-theme/0.0.8/icons/green_dot.svg" style="width:0.5rem; height:0.5rem;"> Auf Lager: Lieferzeit 4-6  Werktage</p>'
                      : ""
                  }`
                );
            }
          }
        }
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
                    } target='_blank' id="productInformationSheet" style="width: 50%; margin: 0; font-weight: bold; text-decoration: underline;">Produktdatenblatt</a>`
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
                  } target='_blank' id="productInformationSheet" style="width: 50%; margin: 0; font-weight: bold; text-decoration: underline; margin-left: 0.3rem">Produktdatenblatt</a>`
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
                  } target='_blank' id="productInformationSheet" class="productInformationSheet"">Produktdatenblatt</a>`
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
//------------------------------------------
//--------------- DISABLED EASY CHECKOUT ---------------
//------------------------------------------
let disableEasyCheckout = () => {
  if (vtexjs.checkout.orderForm.loggedIn) {
    vtexjs.checkout.sendAttachment("clientPreferencesData", {
      savePersonalData: true,
    });
  } else {
    const saveDataCheckbox = $("input#opt-in-save-data");
    saveDataCheckbox.prop("checked", false);
    saveDataCheckbox.trigger("change");
    vtexjs.checkout.sendAttachment("clientPreferencesData", {
      savePersonalData: false,
    });
  }
};
let hideSaveData = () => {
  const saveDataElement = $("p.save-data");
  saveDataElement.addClass("hide");
};
let checkNLoptin = () => {
  var goToShipping = document.getElementById("go-to-shipping");
  goToShipping.addEventListener("click", function () {
    const isOptin = $("#opt-in-newsletter").is(":checked") ? true : false;
    isOptin &&
      vtexjs.checkout.sendAttachment("clientPreferencesData", {
        optinNewsLetter: true,
      });
    //Custom field profile pushed according to optin value
    pushProfileCustomField(isOptin);
    if (vtexjs.checkout?.orderForm?.loggedIn) {
      pushEmailCustomField();
    }
  });
};

const pushProfileCustomField = (isOptin) => {
  vtexjs.checkout.setCustomData({
    app: "profile",
    field: "optin",
    value: isOptin ? true : false,
  });
};
const pushEmailCustomField = () => {
  vtexjs.checkout.setCustomData({
    app: "profile",
    field: "email",
    value: vtexjs.checkout.orderForm?.clientProfileData?.email,
  });
};
//------------------------------------------
$(window).on("hashchange", () => {
  if (window.location.hash === "#/cart") {
    //appendVat()
    getEnergyLabels();
  } else if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/shipping" ||
    window.location.hash === "#/payment" ||
    window.location.hash === "#/email"
  ) {
    if (window.location.hash === "#/profile") {
      disableEasyCheckout();
      hideSaveData();
      checkNLoptin();
    }
    getEnergyLabels();
  }
});

$(window).on("load", () => {
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

$(window).on("orderFormUpdated.vtex", () => {
  getEnergyLabels();
});
//----------------------------------------------------//

//------------------------------------------
//--------------- CUSTOM INVOICE SECTION ---------------
//------------------------------------------

$(document).ready(function () {
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
  ) {
    waitForEl("#go-to-shipping", () => {
      var goToShipping = document.getElementById("go-to-shipping");
      goToShipping.addEventListener("click", function () {
        addInvoiceAddressInfosToOrderForm();
      });
    });
  }
});

$(window).on("hashchange", function () {
  if (window.location.hash === "#/profile") {
    const isInvoiceChecked = $("#opt-in-shipping-addr").prop("checked");
    setTimeout(() => {
      $("#opt-in-shipping-addr").prop("checked", isInvoiceChecked);
      $("#opt-in-shipping-addr").trigger("change");
    }, 500);
  }
});
$(window).on("hashchange", function () {
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
  ) {
    waitForEl("#go-to-shipping", () => {
      var goToShipping = document.getElementById("go-to-shipping");
      goToShipping.addEventListener("click", function () {
        addInvoiceAddressInfosToOrderForm();
      });
    });
  }
});
$(window).on("hashchange", function () {
  if (
    window.location.hash === "#/shipping" ||
    window.location.hash === "#/payment"
  ) {
    addInvoiceAddressInfosToOrderForm();
  }
});

const addInvoiceAddressInfosToOrderForm = () => {
  // const addressField =
  //   $(".google-autocomplete").length > 0
  //     ? $(".google-autocomplete")
  //     : $("#custom-corporate-street");
  // const addressInputValue = addressField.val();
  // const cityInputValue = $("#custom-corporate-city").val();
  if (vtexjs.checkout.orderForm.invoiceData != null) {
    setTimeout(() => {
      vtexjs.checkout.sendAttachment("invoiceData", {
        address: {
          ...vtexjs.checkout.orderForm.invoiceData.address,
          country: "DE",
          // street: addressInputValue,
          // city: cityInputValue,
          state: "-",
        },
      });
    }, 100);
  }
};

$(window).on("load", () => {
  setInterval(() => {
    const invoiceAddressTitle = $(".invoice-address-title");
    if (!invoiceAddressTitle.siblings(".invoice-address-subtitle")[0]) {
      let additionalInvoiceAddressSubtitle = document.createElement("p");
      additionalInvoiceAddressSubtitle.classList.add(
        "invoice-address-subtitle"
      );
      additionalInvoiceAddressSubtitle.textContent =
        "(Die Lieferdetails können Sie im nächsten Schritt eingeben)";
      invoiceAddressTitle.after(additionalInvoiceAddressSubtitle);
    }

    const invoiceAddressLabel = $(".custom-corporate-street").find("label");
    if (invoiceAddressLabel.text() != "Straße") {
      invoiceAddressLabel.text("Straße");
    }
  }, 250);
});

//---------------- NEW IMPLEMENTATION INVOICE CHECKBOX ------------------//
var waitForEl = function (selector, callback) {
  let element = document?.querySelector(selector);
  if (
    element &&
    (window?.getComputedStyle(element)?.visibility == "visible" ||
      document?.querySelector(selector)?.length > 0)
  ) {
    callback();
  } else {
    setTimeout(function () {
      waitForEl(selector, callback);
    }, 100);
  }
};

var isInvoiceChecked = false;

$(window).on("load", () => {
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
  ) {
    waitForEl(`#opt-in-shipping-addr`, function () {
      $("#opt-in-shipping-addr").prop("checked", false);
      $("#opt-in-shipping-addr").trigger("change");
    });
    $("#go-to-shipping").on("click", function () {
      isInvoiceChecked = $("#opt-in-shipping-addr").prop("checked");
    });
  }
});

$(window).on("hashchange", () => {
  if (
    window.location.hash === "#/profile" ||
    window.location.hash === "#/email"
  ) {
    $("#go-to-shipping").on("click", function () {
      isInvoiceChecked = $("#opt-in-shipping-addr").prop("checked");
      vtexjs.checkout.setCustomData({
        app: "fiscaldata",
        field: "requestInvoice",
        value: isInvoiceChecked,
      });
    });
    waitForEl(`#opt-in-shipping-addr`, function () {
      if (isInvoiceChecked) {
        setTimeout(() => {
          $("#opt-in-shipping-addr").prop("checked", true);
          $("#opt-in-shipping-addr").trigger("change");
        }, 500);
      }
    });
  }
});
//---------------------------------------------//

//------------------------------------------
//---------VTEX FUNCTION THAT CHANGE LABELS------
//------------------------------------------
$(window).on("renderLoaderReady.vtex", function () {
  vtex.i18n.it.global.free = "Frei";
  $('label[data-i18n="clientProfileData.firstName"]').text("Name");
  $('label[data-i18n="clientProfileData.phone"]').text("Telefonnummer");
  $('button[data-i18n="global.goToShipping"]').text("Lieferadresse eingeben");
  $(".newsletter-text").text(
    "Ich stimme zu, personalisierte Werbemitteilungen in Bezug auf Bauknecht und andere Marken der Whirlpool Corporation zu erhalten. Die Abmeldung ist jederzeit möglich."
  );
  $("#client-profile-data")
    .find(".accordion-heading")
    .children()
    .find("span")
    .text("Kontaktdaten");
});

$(window).on("load", function () {
  setInterval(() => {
    const shippingMethodButton = $(".btn-go-to-shippping-method");
    const shippingStreetLabel = $(".v-custom-ship-street").find("label");
    const shippingComplementLabel = $(".ship-complement").find("label");
    const placeHoldershippingComplementInput =
      $(".ship-complement").find("input[placeholder]");
    const shippingCityLabel = $(".ship-city").find("label");
    const shippingZIPLabel = $(".ship-postalCode").find("label");
    const completeAddressLabel = $(".delivery-address-title");
    const houseNumberLabel = $(".ship-number").find("label");
    const receiverNameLabel = $(".ship-receiverName").find("label");
    const shippingMethodLabel = $(
      ".vtex-omnishipping-1-x-shippingSectionTitle"
    );
    const shippingOptionTitleLabel = $(
      ".vtex-omnishipping-1-x-deliveryGroup"
    ).find("p");
    const goToPaymentBtnLabel = $(".btn-go-to-payment");
    const paymentTitleLabel = $('button[data-i18n="paymentData.payment"]');
    const changePaymentLabel = $(".link-change-shipping");
    const buttonDeliveryLabel = $(".vtex-omnishipping-1-x-btnDelivery");
    const shippingSummaryPackageLabel = $(".shp-summary-package-time").children(
      "span"
    );
    const spareShippingLabel = $(
      ".vtex-omnishipping-1-x-leanShippingTextLabelSingle"
    ).children("span");
    const userEmailText = $("#client-profile-data").find(".email");
    const customUserEmail =
      vtexjs?.checkout?.orderForm?.customData?.customApps?.find(
        (data) => data.id == "profile"
      )?.fields?.email;

    if (userEmailText.text() != customUserEmail) {
      userEmailText.text(customUserEmail);
    }

    if (
      placeHoldershippingComplementInput[0]?.placeholder &&
      placeHoldershippingComplementInput[0].placeholder != "optional"
    ) {
      placeHoldershippingComplementInput[0].placeholder = "optional";
    }
    if (shippingMethodButton.text() != "Fortfahren") {
      shippingMethodButton.text("Fortfahren");
    }
    if (shippingStreetLabel.text() != "Straße") {
      shippingStreetLabel.text("Straße");
    }
    if (shippingComplementLabel.text() != "Adresszusatz") {
      shippingComplementLabel.text("Adresszusatz");
    }
    if (shippingCityLabel.text() != "Stadt") {
      shippingCityLabel.text("Stadt");
    }
    if (shippingZIPLabel.text() != "Postleitzahl") {
      shippingZIPLabel.text("Postleitzahl");
    }
    if (completeAddressLabel.text() != "Ihre Lieferadresse") {
      completeAddressLabel.text("Ihre Lieferadresse");
    }
    if (houseNumberLabel.text() != "Hausnummer") {
      houseNumberLabel.text("Hausnummer");
    }
    if (receiverNameLabel.text() != "Lieferung an: (Vorname und Nachname)") {
      receiverNameLabel.text("Lieferung an: (Vorname und Nachname)");
    }
    if (shippingMethodLabel.text() != "Lieferadresse") {
      shippingMethodLabel.text("Lieferadresse");
    }
    if (shippingOptionTitleLabel.text() != "Lieferoption") {
      shippingOptionTitleLabel.text("Lieferoption");
    }
    if (goToPaymentBtnLabel.text() != "Zur Zahlung") {
      goToPaymentBtnLabel.text("Zur Zahlung");
    }
    if (paymentTitleLabel.text() != "Zahlungsoptionen") {
      paymentTitleLabel.text("Zahlungsoptionen");
    }
    if (changePaymentLabel.text() != "Versandoption ändern") {
      changePaymentLabel.text("Versandoption ändern");
    }
    if (buttonDeliveryLabel.text() != "Fortfahren") {
      buttonDeliveryLabel.text("Fortfahren");
    }
    if (
      spareShippingLabel.text() ==
      "2 Verpackungen unter verschiedenen Bezeichnungen"
    ) {
      spareShippingLabel.text(
        "Ihre Bestellung wird in 2 Lieferungen aufgeteilt"
      );
    }
    if (
      shippingSummaryPackageLabel.text() != "Lieferung an den Verwendungsort" &&
      shippingSummaryPackageLabel.text() == "Lieferzeit 4-6  Werktage"
    ) {
      shippingSummaryPackageLabel.text("Lieferung an den Verwendungsort");
    } else if (
      shippingSummaryPackageLabel.text() != "Lieferung an den Verwendungsort" &&
      shippingSummaryPackageLabel.text() == "Bis zu 3 Werktagen"
    ) {
      shippingSummaryPackageLabel.text(
        "Express Lieferung an den Verwendungsort"
      );
    }
    changeStandardDeliveryLabel();
  }, 250);
});

//------------------------------------------
//---------EXTRA_SERVICES_CONFIG------
//------------------------------------------

function checkout_v6_additional_services_checkboxes_initialize(EXTRA_SERVICES) {
  EXTRA_SERVICES["Installationspaket"] = {
    selected: false,
    selectionEnabled: true,
    order: 1,
    description:
      "Bitte stellen Sie sicher, dass eine reibungslose Installation durchgeführt werden kann.",
    tooltipText:
      "<div><span style='font-family:\"quicksandMedium\"'>Installationspaket</span><br><br><span style='line-height: 1.1'>Die Installation umfasst die Entfernung und Entsorgung aller Verpackungselemente, sowie den Anschluss/Einbau und die Überprüfung Ihrer gekauften Produkte.<br><br><span style='font-family:\"quicksandMedium\"'>Bitte beachten Sie zudem:</span><br><br> <ul> <li>Der Anschluss kann nur vorgenommen werden wenn der Wasserzulauf /-ablauf und Stromanschluss intakt sind und ohne Verlängerung oder zusätzliche Installationsarbeiten mit dem Original-Schlauch/ -Gerätekabel zu erreichen sind (Schlauchverlängerungen, Sägearbeiten oder andere Modifizierungen können nicht vorgenommen werden).</li><br> <li>Wird ein Gerät unter eine vorhandene Arbeitsplatte gebaut, muss zur Installation ein Abdeck- oder Unterbaublech vorhanden sein.</li><br> <li>Bei Kühl- und Gefriergeräten kann ein Türanschlagwechsel nur dann vorgenommen werden, wenn das Gerät kein außenliegendes Display hat.</li><br> <li>Möbelfront/Dekorplatte: bei teil- sowie vollintegrierten Geschirrspülern ist keine Dekorplatte im Lieferumfang enthalten. Diese muss zur Installation bereits vorhanden sein.</li><br> <li>Die räumlichen und baulichen Gegebenheiten müssen zulassen, dass Ihr Gerät inklusive Verpackung an den Verwendungsort transportiert werden kann. Abhol- oder Zustellorte, die nur unter unverhältnismäßigen Schwierigkeiten erreichbar sind (Tragestrecken von mehr als 150 m, 5. Etage ohne geeigneten Fahrstuhl, zu enges Treppenhaus, sonstige besondere Aufwendungen oder Sicherheitsmaßnahmen) können nicht bedient werden.</li><br> </ul>Falls Sie eine kostenlose Altgeräteentsorgung oder Deinstallation wünschen, muss dies bei der Bestellung zusätzlich ausgewählt werden. </span></div>",
  };
  EXTRA_SERVICES["Deinstallation"] = {
    selected: false,
    selectionEnabled: true,
    order: 2,
    description: "Nur in Kombination mit dem Installationspaket möglich.",
    tooltipText:
      '<div><span style=\'font-family:"quicksandMedium"\'>Deinstallation</span><br><br><span style="line-height: 1.1">Nur in Kombination mit dem Installationspaket möglich. Wenn Sie dieses ausgewählt haben, übernehmen wir auf Wunsch gerne auch die Deinstallation Ihres alten Gerätes. Bitte beachten Sie, dass Ihr Altgerät entsprechend vorbereitet ist:<br><br> <ul> <li>Jegliches Wasser wurde abgelassen</li><br> <li>Kühlgeräte und / oder Gefrierschränke wurden vollständig abgetaut </li><br> </ul>Falls Sie auch eine kostenlose Altgeräteentsorgung wünschen, muss dies zusätzlich ausgewählt werden. </span></div>',
  };
  EXTRA_SERVICES["Altgerätemitnahme"] = {
    selected: false,
    selectionEnabled: true,
    order: 3,
    description:
      "Bitte stellen Sie sicher, dass die Altgerätemitnahme durchgeführt werden kann.",
    tooltipText:
      '<div><span style=\'font-family:"quicksandMedium"\'>Altgerätemitnahme</span><br><br><span style="line-height: 1.1"><span style="font-family:\'quicksandMedium\'">Auf Wunsch nehmen wir kostenlos gemäß ElektroG- und Elektronikgerätegesetz Ihr Altgerät mit und entsorgen es fachgerecht für Sie.</span><br><br> Ihr altes Gerät muss dem gleichen Produkttyp wie Ihr neues Gerät entsprechen. Nicht zur gleichen Geräteart gehörende alte Geräte werden nicht mitgenommen. Pro bestelltem neuen Gerät kann jeweils ein Altgerät mitgenommen werden.<br><br> Für eine erfolgreiche Mitnahme, stellen Sie das Altgerät bitte vor der Wohnungs- bzw. Haustür zur Abholung bereit. Bitte stellen Sie außerdem sicher, dass folgende Maßnahmen getroffen wurden:<br><br> <ul> <li>Trennung von Strom- und Wasser</li><br> <li>Ablassen jeglichen Wassers</li><br> <li>Kühlgeräte und / oder Gefrierschränke wurden vollständig abgetaut</li><br> <li>Ihr altes Gerät ist nicht in Einzelteile zerlegt</li><br> </ul>Wenn Sie Ihr Altgerät nicht selbst abbauen wollen, wählen Sie bitte zusätzlich das Installationspaket und die Deinstallation aus. Bitte beachten Sie, dass Ihr Altgerät trotzdem entsprechend vorbereitet sein muss. </span></div>',
  };
  EXTRA_SERVICES["Ja, ich möchte die kostenlose 10 Jahre Ersatzteile"] = {
    selected: false,
    selectionEnabled: true,
    order: 4,
    description: `Voraussetzung ist die Registrierung Ihres Gerätes.`,
    tooltipText:
      '<div><span style=\'font-family:"quicksandMedium"\'>10 Jahre Ersatzteilgarantie</span><br><br><span style="line-height: 1.1">Sie können sich darauf verlassen, dass Ihr Gerät in den nächsten Jahren gegen Störungen und Ausfälle in sicheren Händen ist. Zusätzlich zu unserer 24 Monate BasisGarantie bieten wir Ihnen ab dem Kauf/Lieferdatum des Produkts, eine kostenlose Ersatzteilgarantie für die ersten 10 Jahre an. Bei einer Reparatur durch unseren Kundendienst sind die Ersatzteile in dieser Zeit kostenlos und direkt von Bauknecht.<br><br> Wenn Sie die kostenlose Ersatzteilgarantie auswählen, erhalten Sie mit der Kaufbestätigung einen Link zur kostenlosen Registrierung der Ersatzteilgarantie. Um einen Anspruch auf die kostenlosen Ersatzteile (10 Jahre) geltend zu machen, müssen die Verbraucher- und Produktdaten innerhalb von 60 Tagen ab Kauf bei Bauknecht registriert werden.<br><br> <span style="font-family:\'quicksandMedium\'">Bitte beachten Sie außerdem</span><br><br> <ul> <li>Jegliche Reparaturarbeiten oder der Austausch des Teils/der Teile im Rahmen dieser Lieferung kostenloser Ersatzteile dürfen nur von zugelassenen und beauftragten Dienstleistern oder Technikern der Bauknecht Hausgeräte GmbH durchgeführt werden. </li><br> <li>Arbeitszeit und Anfahrtskosten für den Austausch/ die Reparatur sind nicht durch diese Ersatzteilaktion abgedeckt und werden von dem zugelassenen Bauknecht Techniker oder durch die Bauknecht Hausgeräte GmbH, falls die Herstellergarantie bereits abgelaufen sein sollte, direkt dem Verbraucher in Rechnung gestellt. Diese Ersatzteilaktion bezieht sich nicht auf ästhetische Teile/Komponenten Ihres Geräts und Verbrauchsmaterialien.</li><br> </ul> Wenn Sie Ihr Altgerät nicht selbst abbauen wollen, wählen Sie bitte zusätzlich das Installationspaket und die Deinstallation aus. Bitte beachten Sie, dass Ihr Altgerät trotzdem entsprechend vorbereitet sein muss. </span></div>',
  };
  EXTRA_SERVICES["Ja, ich möchte den Sorglos PLUS Geräteschutz"] = {
    selected: false,
    selectionEnabled: true,
    order: 5,
    description: `Zum Abschluss beachten Sie bitte die Informationen auf der Bestellbestätigungsseite`,
    tooltipText:
      '<div><span style=\'font-family:"quicksandMedium"\'>Sorglos PLUS Geräteschutz</span><br><br><span style="line-height: 1.1" >Mit dem Leistungspaket Sorglos PLUS sichern Sie zuverlässig auch die Schäden an Ihrem Gerät ab, die nicht von der Herstellergarantie gedeckt werden. Sie zahlen nichts für die Reparatur, und sollte sich eine Reparatur nicht mehr lohnen, tauschen wir kostenlos das Gerät aus. Ideal für alle, die sich sorglos zurücklehnen wollen!<br /><br /> <span style="font-family: \'quicksandMedium\'" >Der Sorglos Plus-Leistungsumfang</span><br/><br/><ul style="columns: 2; -webkit-columns: 2; -moz-columns: 2"> <li style="padding-right: 1rem">Selbst verursachte Schäden (Unfall)</li> <br /> <li style="padding-right: 1rem">Geräteersatz bei 3 gleichen Störungen innerhalb eines Jahres (git nicht bei Unfallschäden)</li> <br /> <li style="padding-right: 1rem">Reparaturzeitversprechen (100,- €)</li> <br /> <li style="padding-right: 1rem">Neues Gerät gleicher Art und Güte, falls sich eine Reparatur nicht mehr lohnt</li> <br /> <li style="padding-right: 1rem">Schäden durch Abnutzung und Verschleiß</li> <br /> <li style="padding-right: 1rem">Verderb von Kühl- und Gefriergut bis max. 100,- € </li> <br /> <li style="padding-right: 1rem">Blockaden und Kalkablagerungen</li> <br /> <li style="padding-right: 1rem">Neuanschluss des Gerätes bei Umzug innerhalb Deutschlands</li> <br /> <li style="padding-right: 1rem">Produktentsorgung, Lieferung und Installation bei Ersatz</li> <br /> <li style="padding-right: 1rem">Kostenlose Kundenhotline</li> <br /> </ul> Monatlicher Beitrag in den ersten 2 Jahren 3,99 Euro. Ab dem 3. Vertragsjahr monatlich 6,99 Euro. Ab dem 4. Versicherungsjahr jeweils zu Jahresbeginn weitere 0,50 Euro. Laufzeit: unbegrenzt, keine Mindestlaufzeit. </span></div>',
  };
}

//------------------------------------------
//--------------- CUSTOM CHECKBOX & INVOICE (Vtex)---------------
//------------------------------------------
function setVtexAppsConfig(config, appName) {
  //------------ INVOICE ADDRESS -------------
  if (appName == "checkout-v6-invoice-data") {
    config.locale = "de";
    config.invoiceDataMandatory = true;
    config.defaultSameShippingAddress = false;
    config.showSDIPECSelector = false;
    config.defaultSDIPEC = "pec";
    config.showPersonTypeSelector = false;
    config.defaultPersonType = "private";
    config.showTermsConditions = true;
    config.hasGoogleAutocomplete = false;
    config.invoiceAddressReverse = true;
  }

  //---------- CUSTOM CHECKBOX (Vtex)----------
  if (appName == "checkout-v6-terms-conditions") {
    config.locale = "en";
    config.checkbox = [
      {
        html: "<span class='terms-and-conditions'>Ich habe die <a href='/seiten/agb-allgemeine-geschaeftsbedingungen'>Geschäftsbedingungen</a>  gelesen und stimme zu*.</span>",
      },
    ];
  }
}

//------------------------------------------
//------------ ONE TRUST & GCM CUSTOM  -------------------
//------------------------------------------
$(document).ready(function () {
  (function () {
    window.dataLayer = window.dataLayer || [];
    //consent mode
    var gtmId = "GTM-M2QQ5T6";
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
    "0d57ce0e-ede0-49e6-9f1a-db3745db038d"
  );
  script.setAttribute("data-document-language", "true");
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
});

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
      '<label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData"><input type="checkbox" id="opt-in-newsletter" data-bind="checked: checkout.optinNewsLetter, enable: checkout.saveData"><span class="newsletter-text" data-i18n="global.optinNewsLetter">Ich stimme zu, personalisierte Werbemitteilungen in Bezug auf Bauknecht und andere Marken der Whirlpool Corporation zu erhalten. Die Abmeldung ist jederzeit möglich.</span></label>'
    );
  } else {
    $(".newsletter").html(
      '<p class="informativa" style="font-size: 13px;margin: .5rem 0;">Ich verstehe und bestätige den Inhalt der <a href="/seiten/datenschutzerklaerung" class="link" target="_blanck">Datenschutzerklärung</a> und:</p><label class="checkbox newsletter-label" data-bind="fadeVisible: checkout.canEditData"><input type="checkbox" id="opt-in-newsletter" data-bind="checked: checkout.optinNewsLetter, enable: checkout.saveData"><span class="newsletter-text" data-i18n="global.optinNewsLetter">Ich stimme zu, personalisierte Werbemitteilungen in Bezug auf Bauknecht und andere Marken der Whirlpool Corporation zu erhalten. Die Abmeldung ist jederzeit möglich.</span></label>'
    );
  }
}

//------------------------------------------
//------------ADD LABEL GRATUITO TO PRESELECTED EXTRA SERVICE ------------
//------------------------------------------
// const addLabel = () => {
//   $(".preselected-service").append(
//     '<span class="extra-services-price">Gratuito</span>'
//   );
// };
// $(window).on("load", function () {
//   setInterval(() => {
//     if ($(".preselected-service").find(".extra-services-price").length == 0) {
//       addLabel();
//     }
//     if ($(".srp-summary-result").find(".monetary").text() == "GratisGratis") {
//       $(".srp-summary-result").find(".monetary").text("Gratuito");
//     }
//   }, 250);
// });

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
async function pushEventCheckout(stepID) {
  const orderForm = await vtexjs.checkout.getOrderForm();
  const items = orderForm.items;
  let products = await Promise.all(
    items?.map(async (value, index, array) => {
      const categoryIdsSplitted = value.productCategoryIds.split("/");
      const [category, specifications] = await Promise.all([
        getStringCategoryFromId(
          categoryIdsSplitted[categoryIdsSplitted.length - 2]
        ),
        getProductSpecification(value.id),
      ]);

      const promoStatus =
        value.price < value.listPrice ? "In Promo" : "Not in Promo";

      return {
        name: remove12ncName(value.name, value.refId),
        id: value.refId,
        price: value.isGift ? 0 : value.sellingPrice / 100,
        brand: value.additionalInfo.brandName,
        category: category.AdWordsRemarketingCode || "",
        quantity: value.quantity,
        variant: findVariant(specifications.ProductSpecifications),
        dimension4: findDimension(specifications.ProductSpecifications),
        dimension5: costructionType(specifications.ProductSpecifications),
        dimension6: promoStatus,
      };
    })
  );
  window.eeccheckout.location = window.location.hash;
  $("body").removeClass("checkoutEventPush");
  const stepsEvents = window.dataLayer.filter(
    (layer) => layer.event == "eec.checkout"
  );
  const hasAlreadyStep1 = stepsEvents.some(
    (event) => event?.ecommerce?.checkout?.actionField?.step == 1
  );
  const hasAlreadyStep2 = stepsEvents.some(
    (event) => event?.ecommerce?.checkout?.actionField?.step == 2
  );

  switch (stepID) {
    case 3:
      window.dataLayer.push({
        event: "eec.checkout",
        ecommerce: {
          currencyCode: "EUR",
          checkout: {
            actionField: {
              step: 3,
            },
            products: products,
          },
        },
      });
    case 2:
      if (!hasAlreadyStep2) {
        window.dataLayer.push({
          event: "eec.checkout",
          ecommerce: {
            checkout: {
              actionField: {
                step: 2,
              },
              products: products,
            },
          },
        });
      }
    case 1:
      if (!hasAlreadyStep1) {
        window.dataLayer.push({
          event: "eec.checkout",
          ecommerce: {
            checkout: {
              actionField: {
                step: 1,
              },
              products: products,
            },
          },
        });
      }
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

//FUNREQ52 - Lead Generation Event
function pushLeadGenerationEvent() {
  const userEmail = vtexjs.checkout.orderForm?.customData?.customApps.find(
    (app) => app.id == "profile"
  )?.fields?.email; //D2CA-614

  return window.dataLayer.push({
    event: "leadGeneration",
    eventCategory: "Lead Generation",
    eventAction: "Optin granted",
    eventLabel: "Lead from checkout step 1",
    email: userEmail,
  });
}

$(document).ready(function () {
  var goToShipping = document.getElementById("go-to-shipping");
  goToShipping.addEventListener("click", function () {
    const isOptin = $("#opt-in-newsletter").is(":checked") ? true : false;
    const emailInput = document.getElementById("client-email-custom")?.value;

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
  const userEmail = vtexjs.checkout.orderForm?.customData?.customApps.find(
    (app) => app.id == "profile"
  )?.fields?.email;

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
    const emailInput = document.getElementById("client-email-custom")?.value;

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
function feReady(pageType) {
  let dataLayer = window.dataLayer || [];
  console.log("vtexjs", vtexjs.checkout.orderForm);
  if (
    vtexjs.checkout.orderForm !== undefined &&
    vtexjs.checkout.orderForm.loggedIn
  ) {
    fetch("/_v/wrapper/api/user/userinfo", { method: "GET" }).then((res) =>
      res.json()
    );
    //   .then((user) => {
    fetch("/_v/wrapper/api/user/hasorders", { method: "GET" }).then(
      (orders) => {
        console.log("orders", orders);
        // console.log("user", user)
        dataLayer.push({
          event: "feReady",
          status: "authenticated",
          "product-code": "",
          "product-name": "",
          "product-category": "",
          userType: userType(),
          pageType: pageType,
          contentGrouping: "(Other)", //D2CA-516
        });
      }
    );
  } else {
    dataLayer.push({
      event: "feReady",
      status: "anonymous",
      "product-code": "",
      "product-name": "",
      "product-category": "",
      userType: userType(),
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
  if ((userTypeArray = "prospect")) {
    userTypeValue = "prospect";
  } else {
    dateCheck()
      ? (userTypeValue = "hot customer")
      : (userTypeValue = "cold customer");
  }
  return userTypeValue;
}

//------------------------------------------
//---------NEW_RELIC_INTEGRATION------------
//------------------------------------------
$(document).on("ready", function () {
  let script = document.createElement("script");
  script.src = "/arquivos/new_relic.js";
  script.type = "text/javascript";
  document.head.appendChild(script);
  if (window.innerWidth > 640) {
    setInterval(() => {
      let couponAdd = $(".coupon-fields").find("#cart-coupon-add");
      couponAdd.map((coupon, index) => {
        if (index.textContent == "Zufügen") {
          index.textContent = "Einlösen";
        }
      });
    }, 100);
  } else {
    setInterval(() => {
      let couponAdd = $(".coupon-fields").find("#cart-coupon-add");
      couponAdd.map((coupon, index) => {
        if (index.textContent != "Einlösen") {
          index.textContent = "Einlösen";
        }
      });
    }, 100);
  }
});
//-----------------------------------------------------------------------
//-----UPDATE ERROR MESSAGE FOR EMPTY DELIVERY-TO FIELD---------
//-----------------------------------------------------------------------
function updateErrorMessageForEmptyDeliveryToField() {
  waitForEl("#ship-receiverName", function () {
    const deliverytoInput = $("#ship-receiverName");
    deliverytoInput.on("blur", function (e) {
      if (deliverytoInput.siblings(".error")[0]) {
        const deliverytoError = deliverytoInput.siblings(".error")[0];
        deliverytoError.textContent = "Dieses Feld wird benötigt.";
      }
    });
  });
}
function updateProvinceDropdownLabel() {
  waitForEl("#ship-state", function () {
    $('label[for="ship-state"]').html("Bundesland");
  });
}
function changeStandardDeliveryLabel() {
  setTimeout(() => {
    const standardDeliveryBox = document.getElementById(
      "delivery-packages-options"
    );
    if (standardDeliveryBox) {
      const deliverylabel = document.getElementsByClassName(
        "shp-option-text-package"
      );
      if (deliverylabel?.[0]?.textContent == "Bis zu 6 Werktagen")
        deliverylabel?.[0]?.setHTML("Lieferzeit 4-6 Werktage");
    }
  }, 500);
}
$(document).ready(function () {
  if (window.location.hash === "#/shipping") {
    setTimeout(() => {
      updateErrorMessageForEmptyDeliveryToField();
      updateProvinceDropdownLabel();
      changeStandardDeliveryLabel();
    }, 1000);
  }
});
$(window).on("hashchange", () => {
  if (window.location.hash === "#/shipping") {
    setTimeout(() => {
      updateErrorMessageForEmptyDeliveryToField();
      updateProvinceDropdownLabel();
      changeStandardDeliveryLabel();
    }, 1000);
  }
});

function changeStandardDeliveryLabelPaymwnt() {
  setTimeout(() => {
    const standardDeliveryBox = document.getElementById("shipping-data");
    if (standardDeliveryBox) {
      const deliverylabel1 = document.getElementsByClassName(
        "shp-summary-package"
      );
      if (deliverylabel1?.[0]?.textContent == "Bis zu 6 Werktagen")
        deliverylabel1?.[0]?.setHTML("Lieferzeit 4-6 Werktage");
    }
  }, 500);
}
$(document).ready(function () {
  if (window.location.hash === "#/payment") {
    setTimeout(() => {
      changeStandardDeliveryLabelPaymwnt();
    }, 1000);
  }
});
$(window).on("hashchange", () => {
  if (window.location.hash === "#/payment") {
    setTimeout(() => {
      changeStandardDeliveryLabelPaymwnt();
    }, 1000);
  }
});
//Update Additional Service text
$(document).ready(function () {
  setInterval(() => {
    const listItems = document.getElementsByClassName("service-item");
    const arrFromHTMLCollection = Array.from(listItems);
    const items = arrFromHTMLCollection.filter((item) =>
      item.innerText.includes("PLUS Geräteschutz")
    );
    if (items.length > 0) {
      for (const item of items) {
        item.classList.add("addService");
        const child = Array.from(item.childNodes).find(
          (item) => item.className === "price pull-right"
        );
        child.innerText = "Monatlicher Beitrag";
        child.classList.add("labelPrice");
      }
    }
  }, 1000);
});
//End Update Additional Service text
//-----------------------------------------------------------------------
//-----CHANGE LABEL SHIPPING FOR OOTB---------
//-----------------------------------------------------------------------
function changeOOTSMessage() {
  if ($("#unavailable-delivery-disclaimer").length > 0) {
    $("#unavailable-delivery-disclaimer").html(
      "<div style='height: 100%;display: flex;align-items: center;'>Dieser Artikel ist derzeit nicht verügbar</div>"
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
