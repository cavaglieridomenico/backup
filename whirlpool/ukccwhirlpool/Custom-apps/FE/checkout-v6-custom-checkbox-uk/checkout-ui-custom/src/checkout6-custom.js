var EXTRA_SERVICES = {};
console.log("ADD SERVICES");

$(window).on("load", function () {
  if (window.location.hash === "#/cart") {
    $("#cart-item-template").text(
      $("#cart-item-template")
        .text()
        .replace(
          "<!-- ko if: availableOfferings().length > 1 -->",
          "<!-- ko if: availableOfferings().length >= 1 -->"
        )
    );
    $("#cart-item-template").text(
      $("#cart-item-template")
        .text()
        .replace(
          "<!-- ko if: availableOfferings().length == 1 -->",
          "<!-- ko if: availableOfferings().length == -1 -->"
        )
    );

    checkout_v6_additional_services_checkboxes_initialize(EXTRA_SERVICES);
    createExtraServices();
  }
});

$(window).on("hashchange", function () {
  if (window.location.hash === "#/cart") {
    setTimeout(function () {
      checkout_v6_additional_services_checkboxes_initialize(EXTRA_SERVICES);
      createExtraServices();
    }, 250);
  }
});

$(window).on("orderFormUpdated.vtex", function () {
  if (window.location.hash === "#/cart") {
    setTimeout(function () {
      createExtraServices();
    }, 250);
  } else {
    setTimeout(function () {
      createExtraServicesList();
    }, 500);
  }
});

function createExtraServices() {
  var viewportWidth = window.innerWidth || document.documentElement.clientWidth;

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
        const item = items[index];
        if (Object.keys(items[index].productCategories).indexOf("2") == -1) {
          const productSKU = item.id;
          const productQuantity = item.quantity;
          const tradePolicy =
            // vtexjs.checkout.orderForm.salesChannel == 1 &&
            window.location.href.includes("epp")
              ? "EPP"
              : vtexjs.checkout.orderForm.salesChannel == 2
              ? "FF"
              : vtexjs.checkout.orderForm.salesChannel == 3
              ? "VIP"
              : "O2P";
          const availableServices = sortServices(
            item.offerings.filter((offering) =>
              offering.name.includes(tradePolicy)
            )
          );
          console.log(availableServices, "availableServices");
          const selectedServices = item.bundleItems;
          let parentElement;

          if ($(".sku-seletor-" + productSKU).length > 0) {
            $(".sku-seletor-" + productSKU).each(function () {
              if (
                !$(this)
                  .parentsUntil(".cart-items", ".product-item")
                  .children(".product-service-container").length
              ) {
                $(this)
                  .parentsUntil(".cart-items", ".product-item")
                  .append(`<div class="product-service-container"></div>`);
              }
              const formProdService = $(this)
                .parentsUntil(".cart-items", ".product-item")
                .children(".product-service-container");

              if (
                parentElement === undefined &&
                formProdService.find("fieldset.custom-extra-services")
                  .length === 0
              ) {
                parentElement = formProdService;
              }
            });
          } else {
            parentElement = $("#product-name" + productSKU)
              .parentsUntil(".cart-items", ".product-item")
              .children(".product-service-container");
          }

          /* SERVICE ELEMENTS TO APPEND */
          let unselectableElements = "";
          if (viewportWidth > 640) {
            unselectableElements += `<div class="preselected-service">
            <div class="flexw100">
              <i class="icon-ok preselected-service-icon"></i>
              <span class="preselected-service-name">Livraison à domicile</span>
              <div class="tooltip">
                <i class="icon-question-sign"></i>
                <span class="tooltiptext">Sur rendez-vous.</span>
              </div>          
            </div>
            <span class="extra-services-price">Inclus</span>
          </div>`;
          } else {
            unselectableElements += `<div class="preselected-service">
            <div class="flexw100">
              <i class="icon-ok preselected-service-icon"></i>
              <span class="preselected-service-name">Livraison à domicile</span>
              <i class="icon-question-sign" data-tooltip="tooltipModal-preselected"></i>
              <div id="tooltipModal-preselected" class="tooltipModal">
               <div id="tooltip-modal-content" class="tooltip-modal-content">
                <span id="tooltipModalClose" class="tooltipModalClose">&times;</span>
                <p class="tooltipTextP">Sur rendez-vous.</p>
               </div>
              </div>          
            </div>
            <span class="extra-services-price">Inclus</span>
          </div>`;
          }
          let selectableElements = ``;
          let extendedWarrantyElements = `<div class='extra-services-preselected'>
                                            <div class='preselected-service'>
                                            <div class="flexw100">
                                              <i class="icon-ok preselected-service-icon"></i>
                                            <span class='preselected-service-name'>Garantie 2 ans</span>
                                            </div>
                                            <div class="extra-services-price">
                                              <span class='preselected-service-name-shipping'>Inclus</span>
                                            </div>
                                            </div>
                                          </div>`;
          // <label class='extra-services-label' for='extended-warranty-default-${index}'>
          // <input type='checkbox'
          //   name='extended-warranty'
          //   id='extended-warranty-default-${index}'
          //   data-index='${index}'
          //   class='extra-services-input'
          //   value='' checked> Garantie 2 ans
          //   <span class='extra-services-price'>Inclus</span>
          // </label>

          availableServices.forEach((service) => {
            service.name = service.name.split("_")[1];
            const serviceConfig = EXTRA_SERVICES[service.name];

            // PRE-SELECTED SERVICES
            let selected = false;
            // se mi arriva i 5 anni di garanzia a costo zero è incluso, allora sarà selezionato e avrà un testo
            let is5yw = false;
            let isFree5ywIncluded = false;

            if (
              service.name === "5 ans de garantie sur votre appareil" &&
              service.price === 0
            ) {
              is5yw = true;
              isFree5ywIncluded = true;
            } else if (
              service.name === "5 ans de garantie sur votre appareil" &&
              service.price !== 0
            ) {
              is5yw = true;
            }

            if (selectedServices.length > 0) {
              selected = selectedServices.some(
                (selectedService) => selectedService.id === service.id
              );
            } else {
              selected = serviceConfig.selected;
              if (isFree5ywIncluded && is5yw) {
                selected = true;
              }
              if (selected) {
                for (let i = 0; i < productQuantity; i++) {
                  vtexjs.checkout.addOffering(service.id, index);
                }
              }
            }

            if (
              service.name === "5 ans de garantie sur votre appareil" &&
              service.price !== 0
            ) {
              const servicePrice =
                service.price === 0
                  ? "Inclus"
                  : "+ " + number_format(service.price) + " £";
              is5yw = true;
              extendedWarrantyElements += `<div class='extra-services-checkbox'>
                                                <label class='extra-services-label' for='${index}-${
                service.id
              }'>
                                                <input type='checkbox'
                                                  name=' 5 ans de garantie sur votre appareil'
                                                  id='${index}-${service.id}'
                                                  class='extra-services-input'
                                                  value='${service.id}'
                                                  ${selected ? "checked" : ""}
                                                  data-price='${service.price}'
                                                  data-type='${service.name}'
                                                  data-index='${index}'
                                                  data-orderform-id='${
                                                    orderForm.orderFormId
                                                  }'> ${service.name}
                                                  > Étendre la garantie à 5 ans                                                
                                                </label>
                                                <span class='extra-services-price'>${servicePrice}</span>
                                              </div>`;
              return;
            }

            if (!serviceConfig.warrantyGroup) {
              // CHECKBOX
              if (serviceConfig.selectionEnabled) {
                const servicePrice =
                  service.price === 0
                    ? "Inclus"
                    : "+ " + number_format(service.price) + " £";

                //TOOLTIP IMPLEMENTATION FOR CHECKBOX
                if (viewportWidth > 640) {
                  selectableElements += `<div id='${
                    service.id
                  }' class='extra-services-checkbox'>
                    <label class='extra-services-label' for='${index}-${
                    service.id
                  }'>
                    <input type='checkbox'
                      id='${index}-${service.id}'
                      class='extra-services-input'
                      value='${service.id}'
                      ${selected ? "checked" : ""}
                      data-price='${service.price}'
                      data-type='${service.name}'
                      data-orderform-id='${orderForm.orderFormId}'
                      data-index='${index}'> ${
                    service.name ===
                    "RD VS avec un expert pour la découverte de produit"
                      ? "Service Expert"
                      : service.name
                  }
                        <div class="tooltip">
                          <i class="icon-question-sign"></i>
                          <span class="tooltiptext">${
                            serviceConfig.description
                          }</span>
                        </div>                    
                    </label>
                    <span class='extra-services-price'>${servicePrice}</span>
                  </div>`;
                } else {
                  selectableElements += `<div id='${
                    service.id
                  }' class='extra-services-checkbox'>
                    <label class='extra-services-label' for='${index}-${
                    service.id
                  }'>
                    <input type='checkbox'
                      id='${index}-${service.id}'
                      class='extra-services-input'
                      value='${service.id}'
                      ${selected ? "checked" : ""}
                      dpata-rice='${service.price}'
                      data-index='${index}'
                      data-type='${service.name}'
                      data-orderform-id='${orderForm.orderFormId}'
                      > ${service.name}
                      </input>
                    </label>
                    <i class="icon-question-sign" data-tooltip="tooltipModal-${
                      service.id
                    }"></i>
                    <div id="tooltipModal-${service.id}" class="tooltipModal">
                     <div id="tooltip-modal-content-${
                       service.id
                     }" class="tooltip-modal-content">
                      <span id="tooltipModalClose" class="tooltipModalClose">&times;</span>
                      <p>${serviceConfig.description}</p>
                     </div>
                    </div>
                    <div class="service-space"></div>
                    <span class='extra-services-price'>${servicePrice}</span>
                  </div>`;
                }
              }
            } else if (is5yw && isFree5ywIncluded) {
              // Warranty logic
              // se ha 5y incluso sarà sempre selezionato
              extendedWarrantyElements += `<div class='extra-services-preselected'>
                <div class='preselected-service'>
                <div class="flexw100">
                  <i class="icon-ok preselected-service-icon"></i>
                <span class='preselected-service-name'>3 ans de garantie complémentaire. La garantie passe à 5 ans</span>
                </div>
                <div class="extra-services-price">
                  <span class='preselected-service-name-shipping'>Inclus</span>
                </div>
                </div>
              </div>`;
            }
          });
          //TOOLTIP IMPLEMENTATION FOR RADIO BUTTONS TITLE
          if (viewportWidth > 640) {
            parentElement.append(
              `<fieldset class='custom-extra-services'>
              <p class='title-custom-extra-services'><i class="icon-plus"></i>Your Services</p>
               ${selectableElements}
             </fieldset>`
            );
          } else {
            parentElement.append(
              `<fieldset class='custom-extra-services'>
              <p class='title-custom-extra-services'><i class="icon-plus"></i>Your Services</p>
               ${selectableElements}
             </fieldset>`
            );
          }
        } else {
          const productSKU = item.id;
          const productQuantity = item.quantity;
          const availableServices = sortServices(item.offerings);
          const selectedServices = item.bundleItems;
          let parentElement;
          if ($(".sku-seletor-" + productSKU).length > 1) {
            $(".sku-seletor-" + productSKU).each(function () {
              const formProdService = $(this)
                .siblings("form.product-service")
                .parent()
                .parent()
                .parent();

              if (
                parentElement === undefined &&
                formProdService.find("fieldset.custom-extra-services")
                  .length === 0
              ) {
                parentElement = formProdService;
              }
            });
          } else {
            parentElement = $("#product-name" + productSKU)
              .parent()
              .parent()
              .parent();
          }
          let unselectableElements = `
          <div class="preselected-service">
            <div class="flexw100">
              <i class="icon-ok preselected-service-icon"></i>
              <span class="preselected-service-name">Livraison à domicile</span>
              <div class="tooltip unFlex">
                  <i class="icon-question-sign"></i>
                  <span class="tooltiptext">Livraison à domicile avec créneau horaire.</span>
                </div>
            </div>
            <div class="extra-services-price">
              <span class="preselected-service-name-shipping">Inclus</span>
            </div>
          </div>`;

          parentElement.append(
            `<fieldset class='custom-extra-services'>
            <div class='extra-services-preselected'>
             
            </div>
            <p class='title-custom-extra-services'><i class="icon-plus"></i>Your Services</p>`
          );
        }
      }
    }
  }
}

function createExtraServicesList() {
  const formatName = (name, price) => {
    if (
      name.includes("_") &&
      name.split("_")[1] == "5 ans de garantie sur votre appareil" &&
      price != 0
    ) {
      return "Ètendre la garantie à 5 ans";
    } else {
      return name.includes("_") ? name.split("_")[1] : name;
    }
  };
  const formatServicesPrice = (price) =>
    price == 0
      ? "Inclus"
      : `${(price / 100).toFixed(2).replace(".", ",")} ${
          vtexjs.checkout.orderForm.storePreferencesData.currencySymbol
        }`;

  if ($("li.hproduct").length > 0) {
    $("li.hproduct").append(`<ul class="product-services">
    <li class="service-item">
            <span class="product-name pull-left">
              <i class="icon-ok"></i>
            <span data-bind="text: name">Livraison à domicile</span>
            </span>
            <strong class="price pull-right" data-bind="text: priceLabel">Inclus</strong>
        </li>
    </ul>`);

    $("li.hproduct").each(function (index) {
      // Prevent cycle on li.hproduct that are not associated to any product
      if (!vtexjs.checkout.orderForm.items[index]) return;

      const product = vtexjs.checkout.orderForm.items[index];

      if (!product.productCategoryIds.includes("/2/")) {
        $(this).children("ul.product-services").append(`
          <li class="service-item">
            <span class="product-name pull-left">
              <i class="icon-ok"></i>
              <span data-bind="text: name">Garantie 2 ans</span>
            </span>
            <strong class="price pull-right" data-bind="text: priceLabel">Inclus</strong>
          </li>
        `);
        product.bundleItems.forEach((offering) =>
          $(this).children("ul.product-services").append(`
          <li class="service-item">
            <span class="product-name pull-left">
              <i class="icon-ok"></i>
              <span data-bind="text: name">${formatName(
                offering.name,
                offering.sellingPrice
              )}</span>
            </span>
            <strong class="price pull-right" data-bind="text: priceLabel">${formatServicesPrice(
              offering.sellingPrice
            )}</strong>
          </li>
        `)
        );
      }
    });
  } else {
    setTimeout(function () {
      createExtraServicesList();
    }, 1000);
  }
}

// function createExtraServicesList() {
//   if ($("li.hproduct").length > 0) {
//     // $("li.hproduct").each(function () {
//     //   if ($(this).children("ul.service-list.unstyled").length === 0) {
//     //     var productId = $($(this)[0]).data("sku");
//     //     var productInCart = vtexjs.checkout.orderForm.items;
//     //     for (i = 0; i < productInCart.length; ++i) {
//     //       if (productInCart[i].id == productId) {
//     //         // if accessory only print delivery service
//     //         if (
//     //           Object.keys(productInCart[i].productCategories).indexOf("2") !=
//     //             -1 &&
//     //           $(this).context.innerHTML.indexOf("Livraison à domicile") <= -1
//     //         ) {
//     //           $(this).append(`<ul class="service-list unstyled">
//     //             <li class="service-item">
//     //               <span class="product-name pull-left">
//     //                <i class="icon-ok"></i>
//     //               <span data-bind="text: name">Livraison à domicile</span>
//     //               </span>
//     //             <strong class="price pull-right" data-bind="text: priceLabel">Inclus</strong>
//     //             </li>
//     //          </ul>`);
//     //         } else {
//     //           $(this).append(
//     //             `<ul class="service-list unstyled prod-service"></ul>`
//     //           );
//     //         }
//     //       }
//     //     }
//     //   } else {
//     //     $("ul.service-list.unstyled").addClass("prod-service");
//     //   }
//     // });

//     $("ul.service-list.unstyled.prod-service").each(function () {
//       if ($(this).context.innerHTML.indexOf("Livraison à domicile") <= -1) {
//         $(this).prepend(`<li class="service-item">
//                             <span class="product-name pull-left">
//                               <i class="icon-ok"></i>
//                               <span data-bind="text: name">Livraison à domicile</span>
//                             </span>
//                             <strong class="price pull-right" data-bind="text: priceLabel">Inclus</strong>
//                           </li>`);
//       }
//       if ($(this).context.innerHTML.indexOf("Garantie 2 ans") <= -1) {
//         $(this).prepend(`<li class="service-item">
//                             <span class="product-name pull-left">
//                               <i class="icon-ok"></i>
//                               <span data-bind="text: name">Garantie 2 ans</span>
//                             </span>
//                             <strong class="price pull-right" data-bind="text: priceLabel">Inclus</strong>
//                           </li>`);
//       }
//     });
//   } else {
//     setTimeout(function () {
//       createExtraServicesList();
//     }, 1000);
//   }
// }

$(document).on("change", ".extra-services-input", function () {
  // $('div.loading').addClass('customShow')

  const serviceId = $(this).val();
  const productIndex = $(this).attr("data-index");
  const orderFormId = $(this).attr("data-orderform-id");
  const isChecked = $(this).is(":checked");
  const type = $(this).data("type");

  const data = { id: serviceId };

  if (!EXTRA_SERVICES[type].extraCheck) {
    if (isChecked) {
      $.ajax({
        type: "POST",
        async: false,
        url: `/api/checkout/pub/orderForm/${orderFormId}/items/${productIndex}/offerings`,
        data: data,
      });
    } else {
      $.ajax({
        type: "POST",
        async: false,
        url: `/api/checkout/pub/orderForm/${orderFormId}/items/${productIndex}/offerings/${serviceId}/remove`,
        data: data,
      });
    }

    vtexjs.checkout.getOrderForm();
  } else {
    getInstallationDetails(
      EXTRA_SERVICES,
      vtexjs.checkout.orderForm.items[productIndex],
      productIndex,
      serviceId,
      orderFormId,
      isChecked,
      data,
      type
    );
  }
});

// $(document).on("change", ".extra-services-radio", function (e) {
//   e.stopImmediatePropagation();
//   const selectedItemIdx = $(this).attr("data-index")

//   $(`input:radio.extra-services-radio[data-index=${selectedItemIdx}]`).each(function () {
//     const serviceId = $(this).val()
//     const itemIndex = $(this).attr("data-index")
//     const isChecked = $(this).is(":checked")

//     if (serviceId !== '') {
//       if (isChecked) {
//         vtexjs.checkout.addOffering(serviceId, itemIndex)
//       } else {
//         vtexjs.checkout.removeOffering(serviceId, itemIndex)
//       }
//     }
//   });
// })

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
  return x1;
}
