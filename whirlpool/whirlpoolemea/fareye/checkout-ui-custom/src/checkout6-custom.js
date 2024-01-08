//Define customjs object
if (window.customjs == undefined) {
  window.customjs = {
    fareye: {
      postalCode: "",
      itemsCount: 0,
      slots: null,
      processing: false,
    },
    shippingPolicies: {
      SCHEDULED: "Programmata",
      STANDARD: "Standard",
    },
  };
}
var hideAgenda = false;

var timeOut;
$(document).ready(function () {
  // goToShippingEventMap();
});
$(window).on("hashchange", function () {
  if (window.location.hash == "#/payment") {
    timeOut = setTimeout(getExpiredDelivery, 3500);
  }
  if (window.location.hash !== "#/payment" && timeOut) {
    clearTimeout(timeOut);
  }
});

$(window).on("load", function () {
  if (window.location.hash == "#/payment") {
    timeOut = setTimeout(getExpiredDelivery, 3000);
  }
  if (window.location.hash !== "#/payment" && timeOut) {
    clearTimeout(timeOut);
  }
});
$(window).on("orderFormUpdated.vtex", function () {
  checkScheduledDelivery();
  var sPostalCode = getPostalCode();
  if (window.location.hash !== "#/cart") {
    //verify if the postal code or item count have changed
    var iItemsCount = getItemsCount();
    if (
      sPostalCode != null &&
      (customjs.fareye.postalCode != sPostalCode ||
        customjs.fareye.itemsCount != iItemsCount)
    ) {
      customjs.fareye.postalCode = sPostalCode;
      customjs.fareye.itemsCount = iItemsCount;
      getFarayeSlot();
    }
    if (window.location.hash == "#/shipping") {
      manageCalendarVisibility();
      if (!customjs.fareye.processing) {
        selectRandomSlot();
      }
      // if ((sPostalCode != null) && (hideAgenda) && (customjs.fareye.processing)){
      //   selectRandomSlot();
      // }
    }
  }
});

function selectRandomSlot() {
  var fareyeSlots = customjs.fareye.slots ? customjs.fareye.slots.slots : [];
  if (fareyeSlots.length == 0 || fareyeSlots == null) {
    if (
      window._ScheduledDeliveryComponent &&
      window._ScheduledDeliveryComponent.props &&
      window._ScheduledDeliveryComponent.props
        .scheduledDeliveryItemsBySeller[0] &&
      window._ScheduledDeliveryComponent.props.scheduledDeliveryItemsBySeller[0]
        .slas[0] &&
      window._ScheduledDeliveryComponent.props.scheduledDeliveryItemsBySeller[0]
        .slas[0].deliveryWindow == null
    ) {
      vtexjs.checkout.sendAttachment("shippingData", {
        selectedAddresses:
          vtexjs.checkout.orderForm.shippingData.selectedAddresses,
        logisticsInfo: vtexjs.checkout.orderForm.shippingData.logisticsInfo.map(
          (li) => ({
            addressId: li.addressId,
            deliveryWindow: li.slas.find((sla) => sla.id == li.selectedSla)
              .availableDeliveryWindows[0],
            itemIndex: li.itemIndex,
            selectedDeliveryChannel: li.selectedDeliveryChannel,
            selectedSla: li.selectedSla,
          })
        ),
      });
    }
  }
}
function hideRandomScheduled() {
  var fareyeSlots = customjs.fareye.slots ? customjs.fareye.slots.slots : [];
  if (fareyeSlots.length == 0 || fareyeSlots == null) {
    var scheduled = document.getElementsByClassName("shp-summary-scheduled")[0];
    var details = document.getElementsByClassName(
      "shp-summary-group vtex-omnishipping-1-x-SummaryItemGroup"
    )[0];
    if (scheduled) {
      scheduled.remove();
      //addFareyeErrorMessage(details)
    }
  } else {
    // const errorMessage = document.getElementById("contentFareyeErrorMessage");
    // if (errorMessage) errorMessage.remove();
  }
}
function goToShippingEventMap() {
  if ($("body").attr("FarEye_eventMap") != "1") {
    $("body").on("click", "#btn-go-to-shippping-method", function () {
      if ($("#ship-postalCode").val() !== "") {
        if (customjs.fareye.postalCode !== $("#ship-postalCode").val()) {
          // customjs.fareye.postalCode = $("#ship-postalCode").val();
          getFarayeSlot();
          //loadFarEyeSlots(customjs.fareye.postalCode, getItemsCount())
        }
      }
    });

    $("body").on("blur", "#v-custom-ship-street", function () {
      //console.log("******** #v-custom-ship-street");
      setTimeout(function () {
        if ($("#ship-postalCode").val() !== "") {
          if (customjs.fareye.postalCode !== $("#ship-postalCode").val()) {
            // customjs.fareye.postalCode = $("#ship-postalCode").val();
            getFarayeSlot();
            //loadFarEyeSlots(customjs.fareye.postalCode, getItemsCount());
          }
        }
      }, 500);
    });
    $("body").attr("FarEye_eventMap", "1");
  }
}
function goToPayment() {
  if (window.location.hash == "#/shipping") {
    var goToPaymentFromShippingSection =
      document.getElementById("btn-go-to-payment");
    var goToPaymentFromProfileSection =
      document.getElementById("go-to-payment");
    var editPaymentButton =
      document.getElementsByClassName("payment-edit-link").length > 0 &&
      document
        .getElementsByClassName("payment-edit-link")[0]
        .getElementsByClassName("link-box-edit").length > 0
        ? document
            .getElementsByClassName("payment-edit-link")[0]
            .getElementsByClassName("link-box-edit")[0]
        : undefined;
    if (
      goToPaymentFromShippingSection &&
      goToPaymentFromProfileSection &&
      editPaymentButton
    ) {
      goToPaymentFromShippingSection.onclick = handleGoToPaymentClick;
      goToPaymentFromProfileSection.onclick = handleGoToPaymentClick;
      editPaymentButton.onclick = handleGoToPaymentClick;
    } else {
      var config = {
        attributes: true,
        childList: true,
        subtree: true,
      };
      // Callback function to execute when mutations are observed
      var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
          if (mutation.type == "childList") {
            if (goToPaymentFromShippingSection)
              goToPaymentFromShippingSection.onclick = handleGoToPaymentClick;
            if (goToPaymentFromProfileSection)
              goToPaymentFromProfileSection.onclick = handleGoToPaymentClick;
            if (editPaymentButton)
              editPaymentButton.onclick = handleGoToPaymentClick;
          }
        }
      });
      observer.observe(document, config);
    }
  }
}

function handleGoToPaymentClick() {
  if (
    vtexjs.checkout.orderForm &&
    vtexjs.checkout.orderForm.shippingData.logisticsInfo
  ) {
    if (vtexjs.checkout.orderForm.shippingData.logisticsInfo.length > 0) {
      if (
        vtexjs.checkout.orderForm.shippingData.logisticsInfo[0].selectedSla ==
        window.customjs.shippingPolicies.SCHEDULED
      ) {
        if (
          vtexjs.checkout.orderForm.shippingData.logisticsInfo[0].slas &&
          vtexjs.checkout.orderForm.shippingData.logisticsInfo[0].slas.length >
            0
        ) {
          const scheduledSla =
            vtexjs.checkout.orderForm.shippingData.logisticsInfo[0].slas.find(
              (s) => s.id === window.customjs.shippingPolicies.SCHEDULED
            );
          if (scheduledSla && scheduledSla.deliveryWindow) {
            postFarayeReserveSlot();
          } else if (
            customjs.fareye.slots &&
            customjs.fareye.slots.slots &&
            customjs.fareye.slots.slots.length > 0
          ) {
            showAlert("Seleziona uno slot per procedere!", "warn");
          }
        }
      }
    }
  }
}

function showAlert(alertText, type) {
  $(window).trigger("addMessage", {
    timeout: "5000",
    content: {
      title: alertText,
    },
    type,
  });
}

function checkScheduledDelivery() {
  goToPayment();
  if (window.location.hash == "#/payment") {
    //postFarayeReserveSlot();
    hideRandomScheduled();
    if (
      vtexjs.checkout.orderForm &&
      vtexjs.checkout.orderForm.shippingData.logisticsInfo
    ) {
      if (vtexjs.checkout.orderForm.shippingData.logisticsInfo.length > 0) {
        if (
          vtexjs.checkout.orderForm.shippingData.logisticsInfo[0].selectedSla ==
          window.customjs.shippingPolicies.SCHEDULED
        ) {
          for (
            var i = 0;
            i <
            vtexjs.checkout.orderForm.shippingData.logisticsInfo[0].slas.length;
            i++
          ) {
            var sla =
              vtexjs.checkout.orderForm.shippingData.logisticsInfo[0].slas[i];
            if (sla.id == window.customjs.shippingPolicies.SCHEDULED) {
              if (!sla.deliveryWindow) {
                window.location.hash = "#/shipping";
              }
            }
          }
        }
      }
    }
  }
}

async function getFarayeSlot() {
  customjs.fareye.processing = true;
  const orderFormId = vtexjs.checkout.orderForm.orderFormId;
  let response = await fetch(`/app/fareye/slots/retrieve/${orderFormId}`, {
    method: "GET",
    headers: {},
  }).catch((err) => {
    console.error(err);
    return { status: -1 };
  });
  console.log("status:", response.status);
  if (response.status == 200) {
    customjs.fareye.slots = await response.json();
    console.log("SLOTS", customjs.fareye.slots);
    hideAgenda = false;
    customjs.fareye.processing = false;
    // fareyeSlots = customjs.fareye.slots ? customjs.fareye.slots.slots : [];
    // if(customjs.fareye.slots == [] || customjs.fareye.slots.slots == []){
    //   hideAgenda = false;
    // }
    if (customjs.fareye.triggerInitialize) {
      $(window).trigger("ScheduledDelivery_Initialize.vtex");
      customjs.fareye.triggerInitialize = false;
    }
  } else if (response.status !== 200) {
    customjs.fareye.processing = false;
    hideAgenda = true;
    // customjs.fareye.slots = [];
    customjs.fareye.slots.slots = [];
  }
}
//This function takes care of hiding the calendar and showing an error message in case of negative response coming from fareye
function manageCalendarVisibility() {
  // if (window.customjs.createdObserver) return;
  var targetNode = document.getElementById("shipping-data");
  if (hideAgenda) {
    if (targetNode) targetNode.classList.add("fareyeError");
    addFareyeErrorMessage(
      document.getElementsByClassName("vtex-omnishipping-1-x-addressForm")[0]
    );
    if (window.location.hash == "#/shipping") {
      var nodeToDelete = document.getElementsByClassName(
        "vtex-omnishipping-1-x-deliveryGroup"
      )[0];
      if (nodeToDelete) {
        nodeToDelete.classList.add("hideElement");
      }
    }
  } else if (targetNode) {
    targetNode.classList.remove("fareyeError");
    const errorMessage = document.getElementById("contentFareyeErrorMessage");
    if (errorMessage) errorMessage.remove();
    if (window.location.hash == "#/shipping") {
      var nodeToDelete = document.getElementsByClassName(
        "vtex-omnishipping-1-x-deliveryGroup"
      )[0];
      if (nodeToDelete) {
        nodeToDelete.classList.remove("hideElement");
      }
    }
  }
  // var config = {
  //   attributes: true,
  //   childList: true,
  //   subtree: true,
  // };
  // hideFareyeMessage();
  // // Callback function to execute when mutations are observed
  // if (targetNode && window.location.hash == "#/shipping" && hideAgenda) {
  //   var nodeToDelete = document.getElementsByClassName(
  //     "vtex-omnishipping-1-x-deliveryGroup"
  //   )[0]; //hide
  //   var nodeToAddElement = document.getElementsByClassName(
  //     "vtex-omnishipping-1-x-addressForm"
  //   )[0]; //add
  //   var callback = function (mutationsList) {
  //     for (var mutation of mutationsList) {
  //       if (mutation.type == "childList") {
  //         if (nodeToDelete) {
  //           nodeToDelete.style.display = "none";
  //         }
  //       } else if (mutation.type == "attributes" && nodeToDelete) {
  //       }
  //     }
  //   };
  //   if (nodeToAddElement) {
  //     addFareyeErrorMessage(nodeToAddElement);
  //   }
  //   var observer = new MutationObserver(callback);
  //   observer.observe(targetNode, config);
  //   window.customjs.createdObserver = true;
  // }
}
//This function takes care of showing an error message in case of negative response coming from fareye
function addFareyeErrorMessage(nodeToAddElement) {
  if (!nodeToAddElement || document.getElementById("contentFareyeErrorMessage"))
    return;
  var contentFareyeError = document.createElement("div");
  contentFareyeError.id = "contentFareyeErrorMessage";
  contentFareyeError.className = "contentFareyeErrorMessage";
  var imageFareyeError = document.createElement("img");
  imageFareyeError.className = "markFareye";
  var errorFareye = document.createElement("p");
  errorFareye.className = "errorFareye";
  errorFareye.innerHTML =
    "Sarai contattato dal servizio clienti per concordare una data di consegna. Procedi al pagamento per completare l'ordine";
  contentFareyeError.appendChild(imageFareyeError);
  contentFareyeError.appendChild(errorFareye);
  nodeToAddElement.appendChild(contentFareyeError);
}
//This function takes care of hiding the error message in case of positive response coming from fareye
// function hideFareyeMessage() {
//   if (!hideAgenda) {
//     var elemToDisplay = document.getElementsByClassName(
//       "vtex-omnishipping-1-x-deliveryGroup"
//     )[0];
//     var contentFareyeError = document.getElementById(
//       "contentFareyeErrorMessage"
//     );
//     if (elemToDisplay) {
//       elemToDisplay.style.display = "block";
//     }
//     if (contentFareyeError) {
//       contentFareyeError.style.display = "none";
//     }
//   }
// }
export const postFarayeReserveSlot = () => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const orderFormId = vtexjs.checkout.orderForm.orderFormId;
  const fetchUrl = `/app/fareye/slots/reserve/${orderFormId}`;
  return fetch(fetchUrl, options).then((response) => response.text());
};
//If the user is staying for more than two hours in the payment section this is sent back in the shipping section
export function getExpiredDelivery() {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const orderFormId = vtexjs.checkout.orderForm.orderFormId;
  let fetchUrl = `/app/fareye/reservation/check/${orderFormId}`;
  return fetch(fetchUrl, options)
    .then((response) => response.json())
    .then((res) => {
      if (res.redirectToShippingSection) {
        window.location.hash = "#/shipping";
      } else if (!res.reservationFound) {
        getFarayeSlot().then(() => {
          if (customjs.fareye.slots && customjs.fareye.slots.slots.length > 0)
            window.location.hash = "#/shipping";
        });
      }
    });
}

//Auxiliar functions
function getPostalCode() {
  if (vtexjs.checkout.orderForm.shippingData) {
    if (vtexjs.checkout.orderForm.shippingData.address) {
      return vtexjs.checkout.orderForm.shippingData.address.postalCode;
    }
  }
  return null;
}
function getItemsCount() {
  return vtexjs.checkout.orderForm.items.length;
}
//Catch ScheduledDelivery Initialize.vtex event
$(window).on("ScheduledDelivery_Initialize.vtex", function () {
  console.log("ScheduledDelivery_Initialize");
  if (!window._ScheduledDeliveryComponent) {
    return;
  }
  if (customjs.fareye.processing) {
    customjs.fareye.triggerInitialize = true;
  }
  var data =
    window._ScheduledDeliveryComponent.props.scheduledDeliveryItemsBySeller;
  var _sellers = [];
  //console.log(window._ScheduledDeliveryComponent.props.scheduledDeliveryItemsBySeller);
  //console.log(window.customjs);
  for (var i = 0; i < data.length; i++) {
    var seller = data[i];
    var scheduledDeliverAvailable = false;
    _sellers[i] = { ssd: [] };
    console.log("seller", seller.selectedScheduledDeliveries);
    if (seller.selectedScheduledDeliveries) {
      if (seller.slas.length > 0) {
        for (var j = 0; j < seller.slas.length; j++) {
          var sd = seller.slas[j];
          _sellers[i].ssd[j] = { availableDeliveryWindows: [] };
          if (sd.id == window.customjs.shippingPolicies.SCHEDULED) {
            scheduledDeliverAvailable = verifyDeliveryWindows(sd);
            _sellers[i].ssd[j].availableDeliveryWindows =
              sd.availableDeliveryWindows;
          }
        }
      } else {
        for (var j = 0; j < seller.selectedScheduledDeliveries.length; j++) {
          var sd = seller.selectedScheduledDeliveries[j];
          _sellers[i].ssd[j] = { availableDeliveryWindows: [] };
          if (
            sd.selectedScheduledDelivery &&
            sd.selectedScheduledDelivery.id ==
              window.customjs.shippingPolicies.SCHEDULED
          ) {
            scheduledDeliverAvailable = verifyDeliveryWindows(
              sd.selectedScheduledDelivery
            );
            _sellers[i].ssd[j].availableDeliveryWindows =
              sd.selectedScheduledDelivery.availableDeliveryWindows;
          }
        }
      }
    }
  }
  window._ScheduledDeliveryComponent._sellerAW = _sellers;
  console.log("****** " + scheduledDeliverAvailable);
  //console.log(window._ScheduledDeliveryComponent.props.scheduledDeliveryItemsBySeller);
  var selectedSLA = "";
  if (
    vtexjs.checkout.orderForm &&
    vtexjs.checkout.orderForm.shippingData.logisticsInfo
  ) {
    if (vtexjs.checkout.orderForm.shippingData.logisticsInfo.length > 0) {
      selectedSLA =
        vtexjs.checkout.orderForm.shippingData.logisticsInfo[0].selectedSla;
    }
  }
  if (scheduledDeliverAvailable) {
    jQuery("body").removeClass("scheduled-delivery-delivery_toggle_hide");
  } else {
    jQuery("body").addClass("scheduled-delivery-delivery_toggle_hide");
  }
  if (
    scheduledDeliverAvailable &&
    selectedSLA != window.customjs.shippingPolicies.STANDARD
  ) {
    window._ScheduledDeliveryComponent.props.toggleScheduledDelivery(true);
    window._ScheduledDeliveryComponent.updateSLAOption(
      window.customjs.shippingPolicies.SCHEDULED
    );
  } else {
    window._ScheduledDeliveryComponent.props.toggleScheduledDelivery(false);
    window._ScheduledDeliveryComponent.updateSLAOption(
      window.customjs.shippingPolicies.STANDARD
    );
  }
});
//ScheduledDelivery Render EventHandler
window.ScheduledDelivery_RenderEvent = function (data) {
  //console.log("******************* ScheduledDelivery_RenderEvent *********************");
  if (!data) {
    return;
  }
  for (var i = 0; i < data.length; i++) {
    var seller = data[i];
    // var scheduledDeliverAvailable = false;

    if (seller.selectedScheduledDeliveries) {
      for (var j = 0; j < seller.selectedScheduledDeliveries.length; j++) {
        var sd = seller.selectedScheduledDeliveries[j];
        if (
          sd.selectedScheduledDelivery &&
          sd.selectedScheduledDelivery.id ==
            window.customjs.shippingPolicies.SCHEDULED
        ) {
          sd.selectedScheduledDelivery.availableDeliveryWindows =
            window._ScheduledDeliveryComponent._sellerAW[i].ssd[
              j
            ].availableDeliveryWindows;
        }
      }
    }
  }
  //console.log(data)
};
window.ScheduledDelivery_ToggleEvent = function (e) {
  //console.log(e.props.isActive);
  if (!e.props.isActive) {
    e.updateSLAOption(window.customjs.shippingPolicies.SCHEDULED);
  } else {
    e.updateSLAOption(window.customjs.shippingPolicies.STANDARD);
  }
};
function verifyDeliveryWindows(ssd) {
  var CustomDeliveryWindows = null;
  if (window.customjs != undefined) {
    //customjs.fareye.slots ? customjs.fareye.slots.slots : [];
    if (customjs.fareye.slots !== null) {
      CustomDeliveryWindows = window.customjs.fareye.slots.slots;
    }
  }
  if (customjs.fareye.processing) {
    console.log("fareye: API call pending");
  }
  ssd.availableDeliveryWindows = removeUnavailableDeliveryWindows(
    ssd.availableDeliveryWindows,
    CustomDeliveryWindows
  );
  notAvailableFareyeSlots(ssd.availableDeliveryWindows);

  if (ssd.availableDeliveryWindows.length == 0) {
    return false;
  }
  return true;
}
//This function finds the match between the fareye and vtex slots in order to return only those present in both fareye and vtex
function removeUnavailableDeliveryWindows(
  availableDeliveryWindows,
  CustomDeliveryWindows
) {
  let filteredDeliveryWindows = [];
  if (window.customjs.Ignore) {
    return availableDeliveryWindows;
  }
  console.log("vtex :", availableDeliveryWindows);
  console.log("fareye :", CustomDeliveryWindows);
  //let available = availableDeliveryWindows.map(({startDateUtc, endDateUtc})=> ({startDateUtc, endDateUtc}));
  if (CustomDeliveryWindows == null || checkOnlyAccessoryWithPrice()) {
    return [];
  }
  CustomDeliveryWindows.map((elem) =>
    availableDeliveryWindows.map((start) => {
      if (
        elem.startDateUtc.substring(0, 16) ==
          start.startDateUtc.substring(0, 16) &&
        elem.endDateUtc.substring(0, 16) == start.endDateUtc.substring(0, 16)
      ) {
        if (!filteredDeliveryWindows.includes(start)) {
          filteredDeliveryWindows.push(start);
        }
      } else {
        //console.log("false");
      }
    })
  );
  console.log("filteredDeliveryWindows", filteredDeliveryWindows);
  return filteredDeliveryWindows;
}
function notAvailableFareyeSlots(filteredDeliveryWindows) {
  hideAgenda = filteredDeliveryWindows.length == 0;
  manageCalendarVisibility();
  // if(hideAgenda){
  //    selectRandomSlot();
  // }
}
function checkOnlyAccessoryWithPrice() {
  if (
    vtexjs &&
    vtexjs.checkout &&
    vtexjs.checkout.orderForm &&
    vtexjs.checkout.orderForm.items
  ) {
    for (var i = 0; i < vtexjs.checkout.orderForm.items.length; i++) {
      var item = vtexjs.checkout.orderForm.items[i];
      if (item.productCategoryIds.substring(0, 3) == "/1/") {
        return false;
      }
    }
  }
  return true;
}
