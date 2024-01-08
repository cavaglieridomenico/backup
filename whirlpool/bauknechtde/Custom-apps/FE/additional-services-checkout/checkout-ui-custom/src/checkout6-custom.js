const EXTRA_SERVICES = {};
const customEventName = "getServicesPrice";

$(window).on("load", function () {
  checkout_v6_additional_services_checkboxes_initialize(EXTRA_SERVICES);
  createExtraServices();
});

$(window).on("hashchange", function () {
  if (window.location.hash === "#/cart") {
    setTimeout(function () {
      createExtraServices();
    }, 250);
  }
});

$(window).on("orderFormUpdated.vtex", function () {
  if (window.location.hash === "#/cart") {
    setTimeout(function () {
      createExtraServices();
    }, 500);
  }
});

$(window).on("load", function () {
  if (window.location.hash === "#/cart") {
    setTimeout(function () {
      const orderForm = vtexjs.checkout.orderForm;
      if (orderForm) {
        const items = orderForm.items;
        if (items.length > 0) {
          for (let index = 0; index < items.length; index++) {
            const item = items[index];
            const services = item.offerings;
            if (services.length > 0) {
              for (let i = 0; i < services.length; i++) {
                if (services[i].type == "Zusätzlicher Transport zum Verwendungsort" && services[i].price == 0) {
                  document.getElementsByClassName('extra-services-input')[i].checked = true;
                  vtexjs.checkout.addOffering(services[i].id, index);
                }
              }
            }
          }
        }
      };
    }, 1500);
  }
});

function find(array, tofind) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].serviceName == tofind) {
      return array[i].price * 100;
    }
  }
  return 0;
}

function checkPriceValidity(price, listprice) {
  if (price == 0) {
    return true;
  } else {
    return !(listprice < price);
  }
}

/*----- EVENT FOR MOCKED PRICES -----*/
// COMMENTED BECAUSE SA ENTITY DOESN'T EXIST ON BK DE
/* window.addEventListener(customEventName, async function (e) {
  let prodId = e.detail.id;
  let serviceAvailable = e.detail.service;
  let category = e.detail.categoryId;
  let theoreticalServices = await fetch(
    "/api/dataentities/SA/search?_fields=serviceId,serviceName,price&_where=categoryId=" +
    category,
    { method: "GET" }
  ).then((res) => res.json());
  if (serviceAvailable.length > 0) {
    serviceAvailable = [...serviceAvailable];
  }
  serviceAvailable.map((service) => {
    let TS = find(theoreticalServices, service.name);
    let spanTS = "";
    if (
      TS !== 0 &&
      TS !== service.price &&
      checkPriceValidity(service.price, TS)
    ) {
      spanTS = '<span class="price-strike">' + number_format(TS) + " € </span>";
    }
    let spanPrice =
      service.price === 0
        ? "<span class='service-free'>Gratuito</span>"
        : "+ " + number_format(service.price) + " €";
    let nodes = document.querySelectorAll(
      '.extra-services-price[id="' + service.name + "-" + prodId + '"]'
    );
    if (nodes.length > 0) {
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        node.innerHTML = spanTS + spanPrice;
      }
    }
  });
}); */
/*--------------------------*/

function createExtraServices() {
  if (
    Object.keys(EXTRA_SERVICES).length > 0 &&
    $(".custom-extra-services").length === 0
  ) {
    if (!vtexjs || !vtexjs.checkout || !vtexjs.checkout.orderForm) {
      return;
    }
    const orderForm = vtexjs.checkout.orderForm;
    const items = orderForm.items;

    if (items.length > 0) {
      for (let index = items.length - 1; index >= 0; index--) {
        /*----- ITEM CONSTS -----*/
        const item = items[index];
        const productSKU = item.id;
        const productQuantity = item.quantity;
        const availableServices = sortServices(item.offerings);
        const selectedServices = item.bundleItems;
        /*--------------------------*/

        /*----- DISPATCH THE EVENT FOR GETTING ADD. SERVICES PRICES -----*/
        let category = Object.keys(item.productCategories)[
          Object.keys(item.productCategories).length - 1
        ];
        window.dispatchEvent(
          new CustomEvent(customEventName, {
            detail: {
              id: productSKU,
              service: availableServices,
              categoryId: category,
            },
          })
        );
        /*--------------------------*/

        /*----- PARENT ELEMENT -----*/
        let parentElement;
        if ($(".sku-seletor-" + productSKU).length > 1) {
          $(".sku-seletor-" + productSKU).each(function () {
            const productTD = $(this).parent();
            if (
              parentElement === undefined &&
              productTD.parent().parent().find("div.checkbox-services")
                .length === 0
            ) {
              parentElement = productTD;
            }
          });
        } else {
          parentElement = $("#product-name" + productSKU).parent();
        }
        parentElement
          .parent()
          .parent()
          .append(
            `<div class="v-custom-product-item-wrap checkbox-services"></div>`
          );
        parentElement = parentElement
          .parent()
          .parent()
          .find("div.checkbox-services");
        /*--------------------------*/

        /*----- AVAILABLE SERVICES TO APPEND -----*/
        let unselectableElements = ``;
        let selectableElements = ``;

        //FORMAT PRICE FUNCTION
        const formatPrice = (price, serviceName) => {
          if (serviceName == "Ja, ich möchte den Sorglos PLUS Geräteschutz")
            return "Monatlicher Beitrag";
          return price == 0
            ? "Kostenlos"
            : `€${(price / 100).toFixed(2).replace(".", ",")}`;
        };

        //PRINT SERVICES NAME WITH LINK
        const printServiceName = (serviceName) => {
          if (serviceName == "Ja, ich möchte den Sorglos PLUS Geräteschutz") {
            return `<span>Sorglos PLUS Geräteschutz</span>`;
          } else if (
            serviceName == "Ja, ich möchte die kostenlose 10 Jahre Ersatzteile"
          ) {
            return `<span>10 Jahre Ersatzteilgarantie</span>`;
          } else {
            return serviceName;
          }
        };
        //TOGGLE UNINSTALLATION SERVICE INPUT
        const isInputDisabled = (serviceName, index) => {
          if (serviceName == "Deinstallation") {
            if (
              vtexjs.checkout.orderForm.items[index].bundleItems.some(
                (bundle) => bundle.name == "Installationspaket"
              )
            ) {
              return "";
            } else {
              return "disabled";
            }
          } else {
            let productServices = vtexjs.checkout.orderForm.items[index].offerings;
            if (productServices.length > 0) {
              let check = productServices.some(
                (offering) =>
                  offering.type == "Zusätzlicher Transport zum Verwendungsort"
              );
              if (check) {
                if (serviceName == "Installationspaket") {
                  if (
                    vtexjs.checkout.orderForm.items[index].bundleItems.some(
                      (service) =>
                        service.name == "Zusätzlicher Transport zum Verwendungsort"
                    )
                  ) {
                    return "";
                  } else {
                    return "disabled";
                  }
                }
              }
            }
          }
        };

        availableServices.forEach((service) => {
          $(`#tooltip-${service.id}`).click(function (e) {
            e.preventDefault();
            $(`#tooltip-modal-content-${service.id}`).show();
          });

          const serviceConfig = EXTRA_SERVICES[service.type];
          if (serviceConfig) {
            // PRE-SELECTED SERVICES
            let selected = false;
            if (selectedServices.length > 0) {
              selected = selectedServices.some(
                (selectedService) => selectedService.id === service.id
              );
            } else {
              selected = serviceConfig.selected;
              if (selected) {
                for (let i = 0; i < productQuantity; i++) {
                  vtexjs.checkout.addOffering(service.id, index);
                }
              }
            }
            if (serviceConfig.selectionEnabled) {
              selectableElements += `
              <div class="extra-services-checkbox">
              <div class="extra-services-checkbox-elements">
                <div class="extra-service-container">
                  <label class="extra-services-label" for="${index}-${service.id
                }">
                    <input ${isInputDisabled(
                  service.name,
                  index
                )} type='checkbox' id='${index}-${service.id
                }' class='extra-services-input' value='${service.id}' ${selected ? "checked" : ""
                } data-price='${service.price}' data-index='${index}'>
                    <span class="service-name">${printServiceName(
                  service.name
                )}</span>
                    <div class="tooltip" id="tooltip-${service.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" viewBox="0 0 25 25">
                    <defs>
                      <clipPath id="clip-BK-Info_1">
                        <rect width="25" height="25"/>
                      </clipPath>
                    </defs>
                    <g id="BK-Info_1" data-name="BK-Info – 1" clip-path="url(#clip-BK-Info_1)">
                      <rect width="25" height="25" fill="#fff"/>
                      <g id="info-circle" transform="translate(0 0)">
                        <path id="Pfad_3" data-name="Pfad 3" d="M12.5,23.437A10.937,10.937,0,1,1,23.437,12.5,10.937,10.937,0,0,1,12.5,23.437ZM12.5,25A12.5,12.5,0,1,0,0,12.5,12.5,12.5,0,0,0,12.5,25Z" fill="#707070"/>
                        <path id="Pfad_4" data-name="Pfad 4" d="M10.3,8.325l-3.578.448-.128.594.7.13c.459.109.55.275.45.733L6.591,15.648c-.3,1.4.164,2.061,1.262,2.061a3.236,3.236,0,0,0,2.289-.934l.137-.65a1.731,1.731,0,0,1-1.072.384c-.43,0-.586-.3-.475-.833Zm.109-3.262A1.562,1.562,0,1,1,8.844,3.5,1.562,1.562,0,0,1,10.406,5.062Z" transform="translate(3.656 1.969)" fill="#707070"/>
                      </g>
                    </g>
                  </svg>
                    </div>
                      <div id="tooltip-modal-content-conatiner-${service.id
                }" class="tooltip-modal-content-conatiner">
                      <div id="tooltip-modal-content-${service.id
                }" class="tooltip-modal-content">
                      <span id="tooltipModalClose-${service.id
                }" class="tooltipModalClose">&times;</span>
                      <span>${serviceConfig.tooltipText}</span>
                      </div>
                    </div>
                  </label>
                </div>
                <div class="extra-services-checkbox-description">
                <span class="service-description">${serviceConfig.description
                }</span>
                </div>
                </div>
                <div class="service-price-container">
                  <span class="service-price">${formatPrice(
                  service.price,
                  service.name
                )}</span>
                </div>
              </div>
              `;
            }
          }
        });

        if (availableServices.length > 0 && selectableElements != "") {
          parentElement.append(`<fieldset class='custom-extra-services'>
                                      <!-- Unselectable elements commented
                                      <div class='extra-services-preselected'>
                                        ${unselectableElements}
                                      </div>
                                      -->
                                      <p class='title-custom-extra-services'>
                                      <i class="icon-plus"></i>Unsere Leistungen</p>
                                      ${selectableElements}
                                    </fieldset>`);
        } else {
          parentElement.parent().addClass("no-add-services");
        }

        $(".tooltip").on("click", (e) => {
          e.preventDefault();
          //GA4FUNREQ60
          window.dataLayer.push({
            event: "popup",
            popup_id: "additional-services-checkout",
            action: "view",
          });
          // End of GA4FUNREQ60
          const serviceId = e.currentTarget.id.split("-")[1];
          $(`#tooltip-modal-content-${serviceId}`).show();
          $(`#tooltip-modal-content-conatiner-${serviceId}`).show();
        });

        $(".tooltip-modal-content").on("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          //GA4FUNREQ60
          window.dataLayer.push({
            event: "popup",
            popup_id: "additional-services-checkout",
            action: "click",
          });
          // End of GA4FUNREQ60
        });

        $(".tooltipModalClose").on("click", (e) => {
          e.preventDefault();
          //GA4FUNREQ60
          setTimeout(() => {
            window.dataLayer.push({
              event: "popup",
              popup_id: "additional-services-checkout",
              action: "close",
            });
          }, 500);
          // End of GA4FUNREQ60
          const serviceId = e.currentTarget.id.split("-")[1];
          $(`#tooltip-modal-content-${serviceId}`).hide();
          $(`#tooltip-modal-content-conatiner-${serviceId}`).hide();
        });
        $(".tooltip-modal-content-conatiner").on("click", (e) => {
          e.preventDefault();
          const serviceId = e.currentTarget.id.split("-")[4];
          $(`#tooltip-modal-content-${serviceId}`).hide();
          $(`#tooltip-modal-content-conatiner-${serviceId}`).hide();
        });
        /*--------------------------*/
      }
    }
  }
}

$(document).on("change", ".extra-services-input", function () {
  const serviceId = $(this).val();
  const itemIndex = $(this).attr("data-index");
  const isChecked = $(this).is(":checked");
  const currentService = vtexjs.checkout.orderForm.items[
    itemIndex
  ].offerings.find((o) => o.id == serviceId)

  if (isChecked) {
    if (additionalServiceCanBeAdded(currentService, itemIndex, this)) vtexjs.checkout.addOffering(serviceId, itemIndex);
  } else {
    vtexjs.checkout.removeOffering(serviceId, itemIndex);
    removeLinkedOffering(itemIndex, serviceId)
  }
});

function additionalServiceCanBeAdded(currentService, itemIndex, currentItem) {
  if (currentService && currentService.name.startsWith("Installationspaket")) {
    const transportServiceSelected = getBundleItemByName(itemIndex, "Zusätzlicher Transport zum Verwendungsort")
    const isTransportServiceAvailable = getOfferingByName(itemIndex, "Zusätzlicher Transport zum Verwendungsort")

    if (isTransportServiceAvailable && !transportServiceSelected) {
      showAlert("Nur in Kombination mit dem Transport zum Verwendungsort möglich. Bitte stellen Sie sicher, dass eine reibungslose Installation durchgeführt werden kann.", "warn")
      $(currentItem).attr('checked', false)
      return false;
    }
  } else if (currentService && currentService.name.startsWith("Deinstallation")) {
    const transportServiceSelected = getBundleItemByName(itemIndex, "Zusätzlicher Transport zum Verwendungsort")
    const isTransportServiceAvailable = getOfferingByName(itemIndex, "Zusätzlicher Transport zum Verwendungsort")

    const installationServiceSelected = getBundleItemByName(itemIndex, "Installationspaket")
    const isInstallationServiceAvailable = getOfferingByName(itemIndex, "Installationspaket")

    if ((isInstallationServiceAvailable && !installationServiceSelected) || (isTransportServiceAvailable && !transportServiceSelected)) {
      showAlert("Nur in Kombination mit dem Installationspaket möglich.", "warn")
      $(currentItem).attr('checked', false)
      return false;
    }
  }
  return true
}

// all the services that cannot be selected without the currently removed service are removed as well
function removeLinkedOffering(itemIndex, serviceId) {
  const installationServiceSelected = getBundleItemByName(itemIndex, "Installationspaket")
  const transportServiceSelected = getBundleItemByName(itemIndex, "Zusätzlicher Transport zum Verwendungsort")

  if (installationServiceSelected && installationServiceSelected.id === serviceId) {
    const deinstallationServiceSelected = getBundleItemByName(itemIndex, "Deinstallation")
    if (deinstallationServiceSelected) {
      vtexjs.checkout.removeOffering(deinstallationServiceSelected.id, itemIndex);
    }
  } else if (transportServiceSelected && transportServiceSelected.id === serviceId) {
    const installationServiceSelected = getBundleItemByName(itemIndex, "Installationspaket")
    if (installationServiceSelected) {
      vtexjs.checkout.removeOffering(installationServiceSelected.id, itemIndex);
    }

    const deinstallationServiceSelected = getBundleItemByName(itemIndex, "Deinstallation")
    if (deinstallationServiceSelected) {
      vtexjs.checkout.removeOffering(deinstallationServiceSelected.id, itemIndex);
    }
  }
}

function getBundleItemByName(itemIndex, bundleName) {
  return vtexjs.checkout.orderForm.items[
    itemIndex
  ].bundleItems.find((bundle) => bundle.name.startsWith(bundleName))
}

function getOfferingByName(itemIndex, offeringName) {
  return vtexjs.checkout.orderForm.items[
    itemIndex
  ].offerings.find((offering) => offering.name.startsWith(offeringName))
}

function showAlert(alertText, type) {
  $(window).trigger("addMessage", {
    timeout: "5000",
    content: {
      title: alertText
    },
    type,
  });
}

function sortServices(services) {
  services.sort(function (serviceA, serviceB) {
    const serviceConfigA = EXTRA_SERVICES[serviceA.type];
    const serviceConfigB = EXTRA_SERVICES[serviceB.type];

    if (serviceConfigA && serviceConfigB) {
      if (
        EXTRA_SERVICES[serviceA.type].order <
        EXTRA_SERVICES[serviceB.type].order
      )
        return -1;
      if (
        EXTRA_SERVICES[serviceA.type].order >
        EXTRA_SERVICES[serviceB.type].order
      )
        return 1;
    }

    return 0;
  });

  return services;
}

// expects number like 42661.55556
function number_format(
  number,
  thousands_sep = " ",
  decimals = 2,
  dec_point = ","
) {
  const rgx = /(\d+)(\d{3})/;
  number = number / 100;
  number = number.toFixed(decimals);

  let nstr = number.toString();
  nstr += "";
  x = nstr.split(".");
  x1 = x[0];
  x2 = x.length > 1 ? dec_point + x[1] : "";

  while (rgx.test(x1)) x1 = x1.replace(rgx, "$1" + thousands_sep + "$2");

  // to return decimals -> x1 + x2
  return x1 + x2;
}
