var EXTRA_SERVICES = {};
console.log("EXTRA SERVICES");

$(window).on("load", function () {
  if (window.location.hash === "#/cart") {
    checkout_v6_additional_services_checkboxes_initialize(EXTRA_SERVICES);
    createExtraServices();
  }
});

$(window).on("hashchange", function () {
  if (window.location.hash === "#/cart") {
    setTimeout(function () {
      checkout_v6_additional_services_checkboxes_initialize(EXTRA_SERVICES);
      createExtraServices();
    }, 2000);
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
          // console.log(items[index], 'is accessories') //3 = id di categoria di accessori
          const productSKU = item.id;
          const productQuantity = item.quantity;
          const availableServices = sortServices(item.offerings);
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
          //     const formProdService = $(this)
          //       .siblings("form.product-service")
          //       .parent()
          //       .parent()
          //       .parent();

          //     if (
          //       parentElement === undefined &&
          //       formProdService.find("fieldset.custom-extra-services")
          //         .length === 0
          //     ) {
          //       parentElement = formProdService;
          //     }
          //   });
          // } else {
          //   parentElement = $("#product-name" + productSKU)
          //     .parent()
          //     .parent()
          //     .parent();
          // }

          /* SERVICE ELEMENTS TO APPEND 
          let unselectableElements = `
          <div class="preselected-service">
            <div class="flexw100">
              <i class="icon-ok preselected-service-icon"></i>
              <span class="preselected-service-name">Livraison à domicile</span>
              <i class="icon-question-sign" data-tooltip="tooltipModal-preselected"></i>
              <div id="tooltipModal-preselected" class="tooltipModal">
               <div id="tooltip-modal-content" class="tooltip-modal-content">
                <span id="tooltipModalClose" class="tooltipModalClose">&times;</span>
                <p>Livraison à domicile avec créneau horaire.</p>
               </div>
              </div>
              <div class="service-space"></div>
              <span class="extra-services-price no-marign-right">W cenie</span>
            </div>
          </div>`;
          */
          let selectableElements = ``;
          let extendedWarrantyElements = ``;
          if (viewportWidth > 640) {
            extendedWarrantyElements += `<div id='extra-services-preselected' class='extra-services-checkbox'>
              <label class='extra-services-label'>
              <i class="icon-ok preselected-service-icon"></i> 
              <span class='preselected-service-name'>2 lata gwarancji</span>
                  <div class="tooltip">
                    <i class="icon-question-sign" onmouseover="handleMouseover()"></i>
                    <span class="tooltiptext">
                    Standardowa gwarancja producenta. Chroni Cię tylko przez pierwsze 2 lata po zakupie urządzenia.
                  </span>
                  </div>                    
              </label>
              <span class="extra-services-price">W cenie</span>
            </div>`;
          } else {
            extendedWarrantyElements += `<div id="2ans" class='extra-services-checkbox'>
            <label class='extra-services-label' for='${index}-2ans'>
            <i class="icon-ok preselected-service-icon"></i> 
            <span class='preselected-service-name'>2 lata gwarancji</span>
            </label>
            <i class="icon-question-sign" data-tooltip="tooltipModal-2ans" onmouseover="handleMouseover()"></i>
            <div id="tooltipModal-2ans" class="tooltipModal">
             <div id="tooltip-modal-content-2ans" class="tooltip-modal-content">
              <span id="tooltipModalClose" class="tooltipModalClose">&times;</span>
              <p>Standardowa gwarancja producenta. Chroni Cię tylko przez pierwsze 2 lata po zakupie urządzenia.</p>
             </div>
            </div>
            <div class="service-space"></div>
            <span class='extra-services-price'>W cenie</span>
          </div>`;
          }
          // `<div class='extra-services-preselected'>
          // <div class='extra-services-preselected-row'>
          // <div class='preselected-service'>
          // <div>
          //   <i class="icon-ok preselected-service-icon"></i>
          // <span class='preselected-service-name'>2 lata gwarancji</span>
          // </div>
          // <i class="icon-question-sign"></i>
          // <div class="tooltipModal">
          //     <div class="tooltip-modal-content">
          //         <span class="tooltiptext">"Standardowa gwarancja producenta. Chroni Cię tylko przez pierwsze 2 lata po zakupie urządzenia."</span>
          //     </div>
          // </div>
          // </div>
          //   <div class='preselected-service-name-row'>
          //     <span class='preselected-service-name-shipping'>W cenie</span>
          //   </div>
          //   </div>
          // </div>`
          // <label class='extra-services-label' for='extended-warranty-default-${index}'>
          // <input type='checkbox'
          //   name='extended-warranty'
          //   id='extended-warranty-default-${index}'
          //   data-index='${index}'
          //   class='extra-services-input'
          //   value='' checked> 2 lata gwarancji
          //   <span class='extra-services-price'>W cenie</span>
          // </label>

          availableServices.forEach((service) => {
            const serviceConfig = EXTRA_SERVICES[service.type];
            console.log(service, "service");

            // PRE-SELECTED SERVICES
            let selected = false;
            // se mi arriva i 5 anni di garanzia a costo zero è free, allora sarà selezionato e avrà un testo
            let is5yw = false;
            let isFree5ywIncluded = false;

            if (
              service.type === "Przedłużona gwarancja producenta" &&
              service.price === 0
            ) {
              is5yw = true;
              isFree5ywIncluded = true;
            } else if (
              service.type === "Przedłużona gwarancja producenta" &&
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
              service.type === "Przedłużona gwarancja producenta" &&
              service.price !== 0
            ) {
              const servicePrice =
                service.price === 0
                  ? "W cenie"
                  : "+ " + number_format(service.price) + " zł";
              is5yw = true;
              if (viewportWidth > 640) {
                extendedWarrantyElements += `<div id='${
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
                    data-index='${index}'> +3 lata pełnej gwarancji producenta
                      <div class="tooltip">
                        <i class="icon-question-sign" onmouseover="handleMouseover()"></i>
                        <span class="tooltiptext">
                        Łącznie otrzymujesz 5 lat pełnej gwarancji producenta. Opcja dostępna tylko w momencie zakupu produktu na <a href="http://www.whirlpool.pl" target="_blank">www.whirlpool.pl</a>.W późniejszym okresie możliwy jedynie zakup dodatkowego ubezpieczenia bezpłatnej naprawy pogwarancyjnej.
                      </span>
                      </div>                    
                  </label>
                  <span class="extra-services-price">${servicePrice}</span>
                </div>`;
              } else {
                extendedWarrantyElements += `<div id='${
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
                  data-index='${index}'> 
                  +3 lata pełnej gwarancji producenta
                  </input>
                </label>
                <i class="icon-question-sign" data-tooltip="tooltipModal-${
                  service.id
                }" onmouseover="handleMouseover()"></i>
                <div id="tooltipModal-${service.id}" class="tooltipModal">
                 <div id="tooltip-modal-content-${
                   service.id
                 }" class="tooltip-modal-content">
                  <span id="tooltipModalClose" class="tooltipModalClose">&times;</span>
                  <p>Łącznie otrzymujesz 5 lat pełnej gwarancji producenta. Opcja dostępna tylko w momencie zakupu produktu na <a href="http://www.whirlpool.pl" target="_blank">www.whirlpool.pl</a>.W późniejszym okresie możliwy jedynie zakup dodatkowego ubezpieczenia bezpłatnej naprawy pogwarancyjnej.</p>
                 </div>
                </div>
                <div class="service-space"></div>
                <span class='extra-services-price'>${servicePrice}</span>
              </div>`;
              }
              //   `<div class="extra-services-checkbox">
              //   <label class="extra-services-label" for="${index}-${service.id}">
              //     <input type='checkbox' name='Przedłużona gwarancja producenta'
              //     id='${index}-${service.id}' class='extra-services-input'
              //     value='${service.id}' ${selected ? "checked" : ""}
              //     data-price='${service.price}' data-index='${index}'>
              //     <span>+3 lata pełnej gwarancji producenta</span>
              //   </label>
              //       <i class="icon-question-sign"></i>
              //       <div id="tooltipModal-${service.id}" class="tooltipModal">
              //         <div id="tooltip-modal-content-${
              //           service.id
              //         }" class="tooltip-modal-content">
              //             <span class="tooltiptext"
              //               >"Łącznie otrzymujesz 5 lat pełnej gwarancji producenta. Opcja dostępna
              //               tylko w momencie zakupu produktu na
              //               <a href="http://www.whirlpool.pl" target="_blank">www.whirlpool.pl</a>.
              //               W późniejszym okresie możliwy jedynie zakup dodatkowego ubezpieczenia
              //               bezpłatnej naprawy pogwarancyjnej."</span
              //             >
              //         </div>
              //       </div>
              //     <span class="extra-services-price">${servicePrice}</span>
              // </div>`
              return;
            }

            if (!serviceConfig.warrantyGroup) {
              // CHECKBOX
              if (serviceConfig.selectionEnabled) {
                const servicePrice =
                  service.price === 0
                    ? "W cenie"
                    : "+ " + number_format(service.price) + " zł";

                //TOOLTIP IMPLEMENTATION FOR CHECKBOX
                if (viewportWidth > 640) {
                  selectableElements +=
                    //   `<div id="${
                    //     service.id
                    //   }" class="extra-services-checkbox">
                    //   <label class="extra-services-label" for="${index}-${
                    //     service.id
                    //   }">
                    //     <input type='checkbox' id='${index}-${service.id}'
                    //     class='extra-services-input' value='${service.id}' ${
                    //     selected ? "checked" : ""
                    //   } data-price='${service.price}' data-index='${index}'>
                    //     <span> ${service.name}</span>
                    //   </label>
                    //       <i class="icon-question-sign"></i>
                    //       <div id="tooltipModal-${service.id}" class="tooltipModal">
                    //         <div id="tooltip-modal-content-${
                    //           service.id
                    //         }" class="tooltip-modal-content">
                    //          <span id="tooltipModalClose" class="tooltipModalClose">&times;</span>
                    //          <p>${serviceConfig.description}</p>
                    //         </div>
                    //        </div>
                    //     <span class="extra-services-price">${servicePrice}</span>
                    // </div>`
                    `<div id='${service.id}' class='extra-services-checkbox'>
                    <input type='checkbox'
                        id='${index}-${service.id}'
                        class='extra-services-input'
                        value='${service.id}'
                        ${selected ? "checked" : ""}
                        data-price='${service.price}'
                        data-index='${index}'>
                      <label class='extra-services-label' for='${index}-${
                      service.id
                    }'>
                       ${service.name}
                       </label>
                       <div class="tooltip">
                         <i class="icon-question-sign" onmouseover="handleMouseover()"></i>
                         <span class="tooltiptext">${
                           serviceConfig.description
                         }</span>
                       </div>                    
                      <span class='extra-services-price'>${servicePrice}</span>
                    </div>`;
                } else {
                  selectableElements += `<div id='${
                    service.id
                  }' class='extra-services-checkbox'>
                    <input type='checkbox'
                      id='${index}-${service.id}'
                      class='extra-services-input'
                      value='${service.id}'
                      ${selected ? "checked" : ""}
                      dpata-rice='${service.price}'
                      data-index='${index}'>
                      </input>
                  <label class='extra-services-label' for='${index}-${
                    service.id
                  }'>
                  ${service.name}
                  </label>
                  <i class="icon-question-sign" data-tooltip="tooltipModal-${
                    service.id
                  }" onmouseover="handleMouseover()"></i>
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
                  // `<div id='${
                  //   service.id
                  // }' class='extra-services-checkbox'>
                  //   <label class='extra-services-label' for='${index}-${
                  //   service.id
                  // }'>
                  //   <input type='checkbox'
                  //     id='${index}-${service.id}'
                  //     class='extra-services-input'
                  //     value='${service.id}'
                  //     ${selected ? "checked" : ""}
                  //     data-price='${service.price}'
                  //     data-index='${index}'>
                  //     <span>${service.name}</span>
                  //     </input>
                  //   </label>
                  //   <i class="icon-question-sign" data-tooltip="tooltipModal-${
                  //     service.id
                  //   }"></i>
                  //   <div id="tooltipModal-${service.id}" class="tooltipModal">
                  //    <div id="tooltip-modal-content-${
                  //      service.id
                  //    }" class="tooltip-modal-content">
                  //     <span id="tooltipModalClose" class="tooltipModalClose">&times;</span>
                  //     <p>${serviceConfig.description}</p>
                  //    </div>
                  //   </div>
                  //   <span class='extra-services-price'>${servicePrice}</span>
                  // </div>`
                }
              } else {
                // unselectableElements += `<div class='preselected-service'>
                //                           <div>
                //                           <i class="icon-ok preselected-service-icon"></i>
                //                           <span class='preselected-service-name'>Livraison à domicile</span>
                //                           </div>
                //                           <div>
                //                           <i class="icon-ok preselected-service-icon"></i>
                //                           <span class='preselected-service-name-shipping'>W cenie</span>
                //                           </div>
                //                         </div>`;
              }
            } else if (is5yw && isFree5ywIncluded) {
              // Warranty logic
              // se ha 5y W cenieo sarà sempre selezionato
              if (viewportWidth > 640) {
                extendedWarrantyElements += `<div id='extra-services-preselected' class='extra-services-checkbox'>
                  <label class='extra-services-label'>
                  <i class="icon-ok preselected-service-icon"></i> 
                  <span class='preselected-service-name'>+3 lata pełnej gwarancji producenta</span>
                      <div class="tooltip">
                        <i class="icon-question-sign" onmouseover="handleMouseover()"></i>
                        <span class="tooltiptext">
                        Łącznie otrzymujesz 5 lat pełnej gwarancji producenta. Opcja dostępna tylko w momencie zakupu produktu na <a href="http://www.whirlpool.pl" target="_blank">www.whirlpool.pl</a>.W późniejszym okresie możliwy jedynie zakup dodatkowego ubezpieczenia bezpłatnej naprawy pogwarancyjnej.
                      </span>
                      </div>                    
                  </label>
                  <span class="extra-services-price">W cenie</span>
                </div>`;
              } else {
                extendedWarrantyElements += `<div id="5ans" class='extra-services-checkbox'>
                <label class='extra-services-label' for='${index}-5ans'>
                <i class="icon-ok preselected-service-icon"></i> 
                <span class='preselected-service-name'>+3 lata pełnej gwarancji producenta</span>
                </label>
                <i class="icon-question-sign" data-tooltip="tooltipModal-5ans" onmouseover="handleMouseover()"></i>
                <div id="tooltipModal-5ans" class="tooltipModal">
                 <div id="tooltip-modal-content-5ans" class="tooltip-modal-content">
                  <span id="tooltipModalClose" class="tooltipModalClose">&times;</span>
                  <p>Łącznie otrzymujesz 5 lat pełnej gwarancji producenta. Opcja dostępna tylko w momencie zakupu produktu na <a href="http://www.whirlpool.pl" target="_blank">www.whirlpool.pl</a>.W późniejszym okresie możliwy jedynie zakup dodatkowego ubezpieczenia bezpłatnej naprawy pogwarancyjnej.</p>
                 </div>
                </div>
                <div class="service-space"></div>
                <span class='extra-services-price'>W cenie</span>
              </div>`;
              }
              // extendedWarrantyElements +=
              // `<div class='extra-services-preselected'>
              //   <div class='preselected-service'>
              //   <div>
              //     <i class="icon-ok preselected-service-icon"></i>
              //   <span class='preselected-service-name'>3 ans de garantie complémentaire. La garantie passe à 5 ans</span>
              //   </div>
              //   <div>
              //     <span class='preselected-service-name-shipping'>W cenie</span>
              //   </div>
              //   </div>
              // </div>;`
            }
          });
          //TOOLTIP IMPLEMENTATION FOR RADIO BUTTONS TITLE
          if (viewportWidth > 640) {
            /*<div class='extra-services-preselected'>
               ${unselectableElements}
              </div>*/
            parentElement.append(
              `<fieldset class='custom-extra-services'>
              <p class='title-custom-extra-services'><i class="icon-plus"></i>Usługi</p>
               ${selectableElements}
               <div class='title-custom-extra-services-container'>
                <p class='title-custom-extra-services extended-warranty-options'>Gwarancja</p>
               </div>
               ${extendedWarrantyElements}
             </fieldset>`
            );
          } else {
            /*<div class='extra-services-preselected'>
               ${unselectableElements}
              </div>*/
            parentElement.append(
              `<fieldset class='custom-extra-services'>
              <p class='title-custom-extra-services'><i class="icon-plus"></i>Usługi</p>
               ${selectableElements}
               <div class='title-custom-extra-services-container'>
                <p class='title-custom-extra-services extended-warranty-options'>Gwarancja</p>
                </div>
               ${extendedWarrantyElements}
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
          /*let unselectableElements = `
          <div class="preselected-service">
            <div>
              <i class="icon-ok preselected-service-icon"></i>
              <span class="preselected-service-name">Livraison à domicile</span>
              <div class="tooltip unFlex">
                  <i class="icon-question-sign"></i>
                  <span class="tooltiptext">Livraison à domicile avec créneau horaire.</span>
                </div>
            </div>
            <div>
              <span class="preselected-service-name-shipping">W cenie</span>
            </div>
          </div>`; */

          parentElement.append(
            /*<div class='extra-services-preselected'>
             ${unselectableElements}
            </div>*/
            `<fieldset class='custom-extra-services'>
            <p class='title-custom-extra-services'><i class="icon-plus"></i>Usługi</p>`
          );
        }
      }
    }
  }
}

function createExtraServicesList() {
  if ($("li.hproduct").length > 0) {
    setTimeout(function () {
      $("li.hproduct").each(function () {
        if ($(this).children("ul.service-list.unstyled").length === 0) {
          var productId = $($(this)[0]).data("sku");
          var productInCart = vtexjs.checkout.orderForm.items;
          for (i = 0; i < productInCart.length; ++i) {
            if (productInCart[i].id == productId) {
              // if accessory only print delivery service
              /*if (
                Object.keys(productInCart[i].productCategories).indexOf("2") !=
                -1 &&
                $(this).context.innerHTML.indexOf("Livraison à domicile") <= -1
              ) {
                $(this).append(`<ul class="service-list unstyled">
                  <li class="service-item">
                    <span class="product-name pull-left">
                     <i class="icon-ok"></i>
                    <span data-bind="text: name">Livraison à domicile</span>
                    </span>
                  <strong class="price pull-right" data-bind="text: priceLabel">W cenie</strong>
                  </li>
               </ul>`);
              } else {
                $(this).append(`<ul class="service-list unstyled prod-service"></ul>`);
              }*/
              $(this).append(
                `<ul class="service-list unstyled prod-service"></ul>`
              );
            }
          }
        } else {
          $("ul.service-list.unstyled").addClass("prod-service");
        }
      });

      $("ul.service-list.unstyled.prod-service").each(function () {
        /*if ($(this).context.innerHTML.indexOf("Livraison à domicile") <= -1) {
          $(this).prepend(`<li class="service-item">
                              <span class="product-name pull-left">
                                <i class="icon-ok"></i>
                                <span data-bind="text: name">Livraison à domicile</span>
                              </span>
                              <strong class="price pull-right" data-bind="text: priceLabel">W cenie</strong>
                            </li>`);
        }*/
        if ($(this).context.innerHTML.indexOf("2 lata gwarancji") <= -1) {
          $(this).prepend(`<li class="service-item">
                                <span class="product-name pull-left">
                                  <i class="icon-ok"></i>
                                  <span data-bind="text: name">2 lata gwarancji</span>
                                </span>
                            <strong class="price pull-right" data-bind="text: priceLabel">W cenie</strong>
                          </li>`);
        }
        $("ul.service-list.unstyled.prod-service")
          .find(".service-item")
          .find(".product-name:contains('Przedłużona gwarancja producenta')")
          .text("+3 lata pełnej gwarancji producenta");
      });
    }, 500);
  } else {
    setTimeout(function () {
      createExtraServicesList();
    }, 1000);
  }
}

$(document).on("change", ".extra-services-input", function () {
  const serviceId = $(this).val();
  const itemIndex = $(this).attr("data-index");
  const isChecked = $(this).is(":checked");

  if (isChecked) {
    vtexjs.checkout.addOffering(serviceId, itemIndex);
  } else {
    vtexjs.checkout.removeOffering(serviceId, itemIndex);
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
