const EXTRA_SERVICES = {};

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
  } else {
    setTimeout(function () {
      createExtraServicesList();
    }, 500);
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

function getPreselectedService() {
  return {
    id: "0",
    name: "Consegna al piano",
    price: 0,
    type: "Consegna al piano",
  };
}

function checkPriceValidity(price, listprice) {
  if (price == 0) {
    return true;
  } else {
    return !(listprice < price);
  }
}

window.addEventListener(
  "theoreticalServicePrice.itwhirlpool",
  async function (e) {
    let prodId = e.detail.id;
    let serviceAvailable = e.detail.service;
    let category = e.detail.categoryId;
    let theoreticalServices = await fetch(
      "/api/dataentities/SA/search?_fields=serviceId,serviceName,price&_where=categoryId=" +
        category,
      { method: "GET" }
    ).then((res) => res.json());
    if (serviceAvailable.length > 0) {
      serviceAvailable = [getPreselectedService(), ...serviceAvailable];
    }
    serviceAvailable.map((service) => {
      let TS = find(theoreticalServices, service.name);
      let spanTS = "";
      if (
        TS !== 0 &&
        TS !== service.price &&
        checkPriceValidity(service.price, TS)
      ) {
        spanTS =
          '<span class="price-strike">' + number_format(TS) + " € </span>";
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
  }
);

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
        const item = items[index];
        const productSKU = item.id;
        const productQuantity = item.quantity;
        const availableServices = sortServices(item.offerings);
        const selectedServices = item.bundleItems;

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

        // SERVICE ELEMENTS TO APPEND
        let unselectableElements = ``;
        let selectableElements = ``;

        let category = Object.keys(item.productCategories)[
          Object.keys(item.productCategories).length - 1
        ];
        window.dispatchEvent(
          new CustomEvent("theoreticalServicePrice.itwhirlpool", {
            detail: {
              id: productSKU,
              service: availableServices,
              categoryId: category,
            },
          })
        );
        availableServices.forEach((service) => {
          service.name = service.name.replace("HP_", "");
          const serviceConfig = EXTRA_SERVICES[service.type.replace("HP_", "")];
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
              //const servicePrice = service.price === 0 ? "Gratuito" : "+ " + number_format(service.price) + " €";
              selectableElements += `<div class='extra-services-checkbox'>
                                          <label class='extra-services-label' for='${index}-${
                service.id
              }'>
                                          <input type='checkbox'
                                            id='${index}-${service.id}'
                                            class='extra-services-input'
                                            value='${service.id}'
                                            ${selected ? "checked" : ""}
                                            data-price='${service.price}'
                                            data-index='${index}'> 
                                            <span class="service-name">${
                                              service.name
                                            }</span>
                                            <div class="tooltip">
                                              <i class="icon-info" onmouseover="handleMouseover()"></i>
                                              <span class="tooltiptext">${
                                                serviceConfig.description
                                              }</span>
                                            </div>
                                            <span class='extra-services-price' id="${
                                              service.name
                                            }-${productSKU}"><div class="loaderShipping productServicePrice ${productSKU}"></div></span>
                                          </label>
                                        </div>`;
            }
            /* else {
              unselectableElements += `<div class='preselected-service'>
                                        <div>
                                        <i class="icon-ok preselected-service-icon"></i>
                                        <span class='preselected-service-name'>${service.name}</span>
                                        </div>
                                      </div>`;
            }
            */
          }
        });

        if (availableServices.length > 0) {
          preselectedService =
            unselectableElements += `<div class='preselected-service'>
                                          <div>
                                          <i class="icon-ok preselected-service-icon"></i>
                                          <span class='preselected-service-name'>Consegna al piano</span>
                                          </div>
                                          <div class="tooltip">
                                            <i class="icon-info" onmouseover="handleMouseover()"></i>
                                            <span class="tooltiptext">Consegna al piano gratuita e su appuntamento.</span>
                                          </div>
                                          <span class='extra-services-price' id="Consegna al piano-${productSKU}"><div class="loaderShipping productServicePrice ${productSKU}"></div></span>
                                        </div>`;
          parentElement.append(`<fieldset class='custom-extra-services'>
                                      <div class='extra-services-preselected'>
                                        ${unselectableElements}
                                      </div>
                                      <p class='title-custom-extra-services'>
                                      <i class="icon-plus"></i> Seleziona i servizi aggiuntivi inclusi nel prezzo</p>
                                      ${selectableElements}
                                    </fieldset>`);
        }
      }
    }
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

function createExtraServicesList() {
  const formatName = (name) => {
    // if (
    //   name.includes("_") &&
    //   name.split("_")[1] == "5 ans de garantie sur votre appareil" &&
    //   price != 0
    // ) {
    //   return "Ètendre la garantie à 5 ans";
    // } else {
    return name.includes("_") ? name.split("_")[1] : name;
    // }
  };
  const formatServicesPrice = (price) =>
    price == 0
      ? "Gratuito"
      : `${(price / 100).toFixed(2).replace(".", ",")} ${
          vtexjs.checkout.orderForm.storePreferencesData.currencySymbol
        }`;

  if ($("li.hproduct").length > 0) {
    $("li.hproduct").append(`<ul class="product-services">
    <li class="service-item">
            <span class="product-name pull-left">
              <i class="icon-ok"></i>
            <span data-bind="text: name">Consegna al piano</span>
            </span>
            <strong class="price pull-right" data-bind="text: priceLabel">Gratuito</strong>
        </li>
    </ul>`);

    $("li.hproduct").each(function (index) {
      // Prevent cycle on li.hproduct that are not associated to any product
      if (!vtexjs.checkout.orderForm.items[index]) return;

      const product = vtexjs.checkout.orderForm.items[index];

      // if (!product.productCategoryIds.includes("/2/")) {
      // $(this).children("ul.product-services").append(`
      //   <li class="service-item">
      //     <span class="product-name pull-left">
      //       <i class="icon-ok"></i>
      //       <span data-bind="text: name">Garantie 2 ans</span>
      //     </span>
      //     <strong class="price pull-right" data-bind="text: priceLabel">Inclus</strong>
      //   </li>
      // `);
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
      // }
    });
  } else {
    setTimeout(function () {
      createExtraServicesList();
    }, 1000);
  }
}
