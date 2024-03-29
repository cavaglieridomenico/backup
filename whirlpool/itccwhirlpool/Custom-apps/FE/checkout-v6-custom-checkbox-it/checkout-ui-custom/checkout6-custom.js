/******/ (function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {};
  /******/
  /******/ // The require function
  /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {},
      /******/
    });
    /******/
    /******/ // Execute the module function
    /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );
    /******/
    /******/ // Flag the module as loaded
    /******/ module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/ return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/ __webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/ __webpack_require__.c = installedModules;
  /******/
  /******/ // define getter function for harmony exports
  /******/ __webpack_require__.d = function (exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        enumerable: true,
        get: getter,
      });
      /******/
    }
    /******/
  };
  /******/
  /******/ // define __esModule on exports
  /******/ __webpack_require__.r = function (exports) {
    /******/ if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
      /******/ Object.defineProperty(exports, Symbol.toStringTag, {
        value: "Module",
      });
      /******/
    }
    /******/ Object.defineProperty(exports, "__esModule", { value: true });
    /******/
  };
  /******/
  /******/ // create a fake namespace object
  /******/ // mode & 1: value is a module id, require it
  /******/ // mode & 2: merge all properties of value into the ns
  /******/ // mode & 4: return value when already ns object
  /******/ // mode & 8|1: behave like require
  /******/ __webpack_require__.t = function (value, mode) {
    /******/ if (mode & 1) value = __webpack_require__(value);
    /******/ if (mode & 8) return value;
    /******/ if (
      mode & 4 &&
      typeof value === "object" &&
      value &&
      value.__esModule
    )
      return value;
    /******/ var ns = Object.create(null);
    /******/ __webpack_require__.r(ns);
    /******/ Object.defineProperty(ns, "default", {
      enumerable: true,
      value: value,
    });
    /******/ if (mode & 2 && typeof value != "string")
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function (key) {
            return value[key];
          }.bind(null, key)
        );
    /******/ return ns;
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/ __webpack_require__.n = function (module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module["default"];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, "a", getter);
    /******/ return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/ __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/ __webpack_require__.p = "";
  /******/
  /******/
  /******/ // Load entry module and return exports
  /******/ return __webpack_require__((__webpack_require__.s = 0));
  /******/
})(
  /************************************************************************/
  /******/ {
    /***/ "./src/checkout6-custom.js":
      /*!*********************************!*\
  !*** ./src/checkout6-custom.js ***!
  \*********************************/
      /*! no static exports found */
      /***/ function (module, exports) {
        eval(
          'var EXTRA_SERVICES = {};\r\nconsole.log("ADD SERVICES");\r\n\r\n$(window).on("load", function () {\r\n  if (window.location.hash === "#/cart") {\r\n    $("#cart-item-template").text(\r\n      $("#cart-item-template")\r\n        .text()\r\n        .replace(\r\n          "<!-- ko if: availableOfferings().length > 1 -->",\r\n          "<!-- ko if: availableOfferings().length >= 1 -->"\r\n        )\r\n    );\r\n    $("#cart-item-template").text(\r\n      $("#cart-item-template")\r\n        .text()\r\n        .replace(\r\n          "<!-- ko if: availableOfferings().length == 1 -->",\r\n          "<!-- ko if: availableOfferings().length == -1 -->"\r\n        )\r\n    );\r\n\r\n    checkout_v6_additional_services_checkboxes_initialize(EXTRA_SERVICES);\r\n    createExtraServices();\r\n  }\r\n});\r\n\r\n$(window).on("hashchange", function () {\r\n  if (window.location.hash === "#/cart") {\r\n    setTimeout(function () {\r\n      checkout_v6_additional_services_checkboxes_initialize(EXTRA_SERVICES);\r\n      createExtraServices();\r\n    }, 250);\r\n  }\r\n});\r\n\r\n$(window).on("orderFormUpdated.vtex", function () {\r\n  if (window.location.hash === "#/cart") {\r\n    setTimeout(function () {\r\n      createExtraServices();\r\n    }, 250);\r\n  } else {\r\n    setTimeout(function () {\r\n      createExtraServicesList();\r\n    }, 500);\r\n  }\r\n});\r\n\r\nfunction createExtraServices() {\r\n  var viewportWidth = window.innerWidth || document.documentElement.clientWidth;\r\n\r\n  if (\r\n    Object.keys(EXTRA_SERVICES).length > 0 &&\r\n    $(".custom-extra-services").length === 0\r\n  ) {\r\n    if (!vtexjs || !vtexjs.checkout || !vtexjs.checkout.orderForm) {\r\n      return;\r\n    }\r\n\r\n    const orderForm = vtexjs.checkout.orderForm;\r\n    const items = orderForm.items;\r\n\r\n    if (items.length > 0) {\r\n      for (let index = items.length - 1; index >= 0; index--) {\r\n        const item = items[index];\r\n        if (Object.keys(items[index].productCategories).indexOf("2") == -1) {\r\n          const productSKU = item.id;\r\n          const productQuantity = item.quantity;\r\n          const tradePolicy =\r\n            vtexjs.checkout.orderForm.salesChannel == 1 &&\r\n            window.location.href.includes("epp")\r\n              ? "EPP"\r\n              : vtexjs.checkout.orderForm.salesChannel == 2\r\n              ? "FF"\r\n              : vtexjs.checkout.orderForm.salesChannel == 3\r\n              ? "VIP"\r\n              : "O2P";\r\n          const availableServices = sortServices(\r\n            item.offerings.filter((offering) =>\r\n              offering.name.includes(tradePolicy)\r\n            )\r\n          );\r\n          const selectedServices = item.bundleItems;\r\n          let parentElement;\r\n\r\n          if ($(".sku-seletor-" + productSKU).length > 0) {\r\n            $(".sku-seletor-" + productSKU).each(function () {\r\n              if (\r\n                !$(this)\r\n                  .parentsUntil(".cart-items", ".product-item")\r\n                  .children(".product-service-container").length\r\n              ) {\r\n                $(this)\r\n                  .parentsUntil(".cart-items", ".product-item")\r\n                  .append(`<div class="product-service-container"></div>`);\r\n              }\r\n              const formProdService = $(this)\r\n                .parentsUntil(".cart-items", ".product-item")\r\n                .children(".product-service-container");\r\n\r\n              if (\r\n                parentElement === undefined &&\r\n                formProdService.find("fieldset.custom-extra-services")\r\n                  .length === 0\r\n              ) {\r\n                parentElement = formProdService;\r\n              }\r\n            });\r\n          } else {\r\n            parentElement = $("#product-name" + productSKU)\r\n              .parentsUntil(".cart-items", ".product-item")\r\n              .children(".product-service-container");\r\n          }\r\n\r\n          /* SERVICE ELEMENTS TO APPEND */\r\n          let unselectableElements = "";\r\n          if (viewportWidth > 640) {\r\n            unselectableElements += `<div class="preselected-service">\r\n            <div class="flexw100">\r\n              <i class="icon-ok preselected-service-icon"></i>\r\n              <span class="preselected-service-name">Consegna al piano</span>\r\n              <div class="tooltip">\r\n                <i class="icon-question-sign"></i>\r\n                <span class="tooltiptext">Consegna al piano gratuita e su appuntamento.</span>\r\n              </div>          \r\n            </div>\r\n            <span class="extra-services-price">Gratuito</span>\r\n          </div>`;\r\n          } else {\r\n            unselectableElements += `<div class="preselected-service">\r\n            <div class="flexw100">\r\n              <i class="icon-ok preselected-service-icon"></i>\r\n              <span class="preselected-service-name">Consegna al piano</span>\r\n              <div id="tooltipModal-preselected" class="tooltipModal">\r\n               <div id="tooltip-modal-content" class="tooltip-modal-content">\r\n                <span id="tooltipModalClose" class="tooltipModalClose">&times;</span>\r\n                <p class="tooltipTextP">Consegna al piano gratuita e su appuntamento.</p>\r\n               </div>\r\n              </div>          \r\n            </div>\r\n            <span class="extra-services-price">Gratuito</span>\r\n          </div>`;\r\n          }\r\n          let selectableElements = ``;\r\n          let extendedWarrantyElements = `<div class=\'extra-services-preselected\'>\r\n                                            <div class=\'preselected-service\'>\r\n                                            <div class="flexw100">\r\n                                              <i class="icon-ok preselected-service-icon"></i>\r\n                                            <span class=\'preselected-service-name\'>Garantie 2 ans</span>\r\n                                            </div>\r\n                                            <div class="extra-services-price">\r\n                                              <span class=\'preselected-service-name-shipping\'>Gratuito</span>\r\n                                            </div>\r\n                                            </div>\r\n                                          </div>`;\r\n          // <label class=\'extra-services-label\' for=\'extended-warranty-default-${index}\'>\r\n          // <input type=\'checkbox\'\r\n          //   name=\'extended-warranty\'\r\n          //   id=\'extended-warranty-default-${index}\'\r\n          //   data-index=\'${index}\'\r\n          //   class=\'extra-services-input\'\r\n          //   value=\'\' checked> Garantie 2 ans\r\n          //   <span class=\'extra-services-price\'>Gratuito</span>\r\n          // </label>\r\n\r\n          availableServices.forEach((service) => {\r\n            service.name = service.name.split("_")[1];\r\n            const serviceConfig = EXTRA_SERVICES[service.name];\r\n\r\n            // PRE-SELECTED SERVICES\r\n            let selected = false;\r\n            // se mi arriva i 5 anni di garanzia a costo zero è Gratuitoo, allora sarà selezionato e avrà un testo\r\n            let is5yw = false;\r\n            let isFree5ywIncluded = false;\r\n\r\n            if (\r\n              service.name === "5 ans de garantie sur votre appareil" &&\r\n              service.price === 0\r\n            ) {\r\n              is5yw = true;\r\n              isFree5ywIncluded = true;\r\n            } else if (\r\n              service.name === "5 ans de garantie sur votre appareil" &&\r\n              service.price !== 0\r\n            ) {\r\n              is5yw = true;\r\n            }\r\n\r\n            if (selectedServices.length > 0) {\r\n              selected = selectedServices.some(\r\n                (selectedService) => selectedService.id === service.id\r\n              );\r\n            } else {\r\n              selected = serviceConfig.selected;\r\n              if (isFree5ywIncluded && is5yw) {\r\n                selected = true;\r\n              }\r\n              if (selected) {\r\n                for (let i = 0; i < productQuantity; i++) {\r\n                  vtexjs.checkout.addOffering(service.id, index);\r\n                }\r\n              }\r\n            }\r\n\r\n            if (\r\n              service.name === "5 ans de garantie sur votre appareil" &&\r\n              service.price !== 0\r\n            ) {\r\n              const servicePrice =\r\n                service.price === 0\r\n                  ? "Gratuito"\r\n                  : "+ " + number_format(service.price) + " €";\r\n              is5yw = true;\r\n              extendedWarrantyElements += `<div class=\'extra-services-checkbox\'>\r\n                                                <label class=\'extra-services-label\' for=\'${index}-${\r\n                service.id\r\n              }\'>\r\n                                                <input type=\'checkbox\'\r\n                                                  name=\' 5 ans de garantie sur votre appareil\'\r\n                                                  id=\'${index}-${service.id}\'\r\n                                                  class=\'extra-services-input\'\r\n                                                  value=\'${service.id}\'\r\n                                                  ${selected ? "checked" : ""}\r\n                                                  data-price=\'${service.price}\'\r\n                                                  data-index=\'${index}\'> Étendre la garantie à 5 ans                                                \r\n                                                </label>\r\n                                                <span class=\'extra-services-price\'>${servicePrice}</span>\r\n                                              </div>`;\r\n              return;\r\n            }\r\n\r\n            if (!serviceConfig.warrantyGroup) {\r\n              // CHECKBOX\r\n              if (serviceConfig.selectionEnabled) {\r\n                const servicePrice =\r\n                  service.price === 0\r\n                    ? "Gratuito"\r\n                    : "+ " + number_format(service.price) + " €";\r\n\r\n                //TOOLTIP IMPLEMENTATION FOR CHECKBOX\r\n                if (viewportWidth > 640) {\r\n                  selectableElements += `<div id=\'${\r\n                    service.id\r\n                  }\' class=\'extra-services-checkbox\'>\r\n                    <label class=\'extra-services-label\' for=\'${index}-${\r\n                    service.id\r\n                  }\'>\r\n                    <input type=\'checkbox\'\r\n                      id=\'${index}-${service.id}\'\r\n                      class=\'extra-services-input\'\r\n                      value=\'${service.id}\'\r\n                      ${selected ? "checked" : ""}\r\n                      data-price=\'${service.price}\'\r\n                      data-index=\'${index}\'> ${\r\n                    service.name ===\r\n                    "RD VS avec un expert pour la découverte de produit"\r\n                      ? "Service Expert"\r\n                      : service.name\r\n                  }\r\n                        <div class="tooltip">\r\n                          <i class="icon-question-sign"></i>\r\n                          <span class="tooltiptext">${\r\n                            serviceConfig.description\r\n                          }</span>\r\n                        </div>                    \r\n                    </label>\r\n                    <span class=\'extra-services-price\'>${servicePrice}</span>\r\n                  </div>`;\r\n                } else {\r\n                  selectableElements += `<div id=\'${\r\n                    service.id\r\n                  }\' class=\'extra-services-checkbox\'>\r\n                    <label class=\'extra-services-label\' for=\'${index}-${\r\n                    service.id\r\n                  }\'>\r\n                    <input type=\'checkbox\'\r\n                      id=\'${index}-${service.id}\'\r\n                      class=\'extra-services-input\'\r\n                      value=\'${service.id}\'\r\n                      ${selected ? "checked" : ""}\r\n                      dpata-rice=\'${service.price}\'\r\n                      data-index=\'${index}\'> ${service.name}\r\n                      </input>\r\n                    </label>\r\n                    <div id="tooltipModal-${service.id}" class="tooltipModal">\r\n                     <div id="tooltip-modal-content-${\r\n                       service.id\r\n                     }" class="tooltip-modal-content">\r\n                      <span id="tooltipModalClose" class="tooltipModalClose">&times;</span>\r\n                      <p>${serviceConfig.description}</p>\r\n                     </div>\r\n                    </div>\r\n                    <div class="service-space"></div>\r\n                    <span class=\'extra-services-price\'>${servicePrice}</span>\r\n                  </div>`;\r\n                }\r\n              }\r\n            } else if (is5yw && isFree5ywIncluded) {\r\n              // Warranty logic\r\n              // se ha 5y Gratuitoo sarà sempre selezionato\r\n              extendedWarrantyElements += `<div class=\'extra-services-preselected\'>\r\n                <div class=\'preselected-service\'>\r\n                <div class="flexw100">\r\n                  <i class="icon-ok preselected-service-icon"></i>\r\n                <span class=\'preselected-service-name\'>3 ans de garantie complémentaire. La garantie passe à 5 ans</span>\r\n                </div>\r\n                <div class="extra-services-price">\r\n                  <span class=\'preselected-service-name-shipping\'>Gratuito</span>\r\n                </div>\r\n                </div>\r\n              </div>`;\r\n            }\r\n          });\r\n          //TOOLTIP IMPLEMENTATION FOR RADIO BUTTONS TITLE\r\n          if (viewportWidth > 640) {\r\n            parentElement.append(\r\n              `<fieldset class=\'custom-extra-services\'>\r\n              <div class=\'extra-services-preselected\'>\r\n               ${unselectableElements}\r\n              </div>\r\n              <p class=\'title-custom-extra-services\'><i class="icon-plus"></i>Seleziona i servizi aggiuntivi</p>\r\n               ${selectableElements}\r\n             </fieldset>`\r\n            );\r\n          } else {\r\n            parentElement.append(\r\n              `<fieldset class=\'custom-extra-services\'>\r\n              <div class=\'extra-services-preselected\'>\r\n               ${unselectableElements}\r\n              </div>\r\n              <p class=\'title-custom-extra-services\'><i class="icon-plus"></i>Seleziona i servizi aggiuntivi</p>\r\n               ${selectableElements}\r\n             </fieldset>`\r\n            );\r\n          }\r\n        } else {\r\n          const productSKU = item.id;\r\n          const productQuantity = item.quantity;\r\n          const availableServices = sortServices(item.offerings);\r\n          const selectedServices = item.bundleItems;\r\n          let parentElement;\r\n          if ($(".sku-seletor-" + productSKU).length > 1) {\r\n            $(".sku-seletor-" + productSKU).each(function () {\r\n              const formProdService = $(this)\r\n                .siblings("form.product-service")\r\n                .parent()\r\n                .parent()\r\n                .parent();\r\n\r\n              if (\r\n                parentElement === undefined &&\r\n                formProdService.find("fieldset.custom-extra-services")\r\n                  .length === 0\r\n              ) {\r\n                parentElement = formProdService;\r\n              }\r\n            });\r\n          } else {\r\n            parentElement = $("#product-name" + productSKU)\r\n              .parent()\r\n              .parent()\r\n              .parent();\r\n          }\r\n          let unselectableElements = "";\r\n          if (viewportWidth > 640) {\r\n            unselectableElements += `<div class="preselected-service">\r\n            <div class="flexw100">\r\n                  <i class="icon-ok preselected-service-icon"></i>\r\n              <span class="preselected-service-name">Consegna</span>\r\n              <div class="tooltip unFlex">\r\n                  <i class="icon-question-sign"></i>\r\n                  <span class="tooltiptext">Consegna gratuita.</span>\r\n                </div>\r\n            </div>\r\n            <div class="extra-services-price">\r\n              <span class="preselected-service-name-shipping">Gratuito</span>\r\n            </div>\r\n          </div>`;\r\n          } else {\r\n            unselectableElements += `<div class="preselected-service">\r\n            <div class="flexw100">\r\n                  <i class="icon-ok preselected-service-icon"></i>\r\n              <span class="preselected-service-name">Consegna</span>\r\n              <div class="tooltip unFlex">\r\n                  \r\n                  <span class="tooltiptext">Consegna gratuita.</span>\r\n                </div>\r\n            </div>\r\n            <div class="extra-services-price">\r\n              <span class="preselected-service-name-shipping">Gratuito</span>\r\n            </div>\r\n          </div>`;\r\n          }\r\n\r\n          parentElement.append(\r\n            `<fieldset class=\'custom-extra-services\'>\r\n            <div class=\'extra-services-preselected\'>\r\n             ${unselectableElements}\r\n            </div>\r\n            <p class=\'title-custom-extra-services\'><i class="icon-plus"></i>Seleziona i servizi aggiuntivi</p>`\r\n          );\r\n        }\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\nfunction createExtraServicesList() {\r\n  const formatName = (name) => {\r\n    return name.includes("_") ? name.split("_")[1] : name;\r\n  };\r\n  const formatServicesPrice = (price) =>\r\n    price == 0\r\n      ? "Gratuito"\r\n      : `${(price / 100).toFixed(2).replace(".", ",")} ${\r\n          vtexjs.checkout.orderForm.storePreferencesData.currencySymbol\r\n        }`;\r\n\r\n  if ($("li.hproduct").length > 0) {\r\n    // $("li.hproduct").append(`<ul class="product-services">\r\n    // <li class="service-item">\r\n    //         <span class="product-name pull-left">\r\n    //           <i class="icon-ok"></i>\r\n    //         <span data-bind="text: name">Livraison à domicile</span>\r\n    //         </span>\r\n    //         <strong class="price pull-right" data-bind="text: priceLabel">Gratuito</strong>\r\n    //     </li>\r\n    // </ul>`);\r\n\r\n    $("li.hproduct").each(function (index) {\r\n      // Prevent cycle on li.hproduct that are not associated to any product\r\n      if (!vtexjs.checkout.orderForm.items[index]) return;\r\n\r\n      const product = vtexjs.checkout.orderForm.items[index];\r\n\r\n      if (!product.productCategoryIds.includes("/2/")) {\r\n        $(this).children("ul.product-services").append(`\r\n          <li class="service-item">\r\n            <span class="product-name pull-left">\r\n              <i class="icon-ok"></i>\r\n              <span data-bind="text: name">Garantie 2 ans</span>\r\n            </span>\r\n            <strong class="price pull-right" data-bind="text: priceLabel">Gratuito</strong>\r\n          </li>\r\n        `);\r\n        product.bundleItems.forEach((offering) =>\r\n          $(this).children("ul.product-services").append(`\r\n          <li class="service-item">\r\n            <span class="product-name pull-left">\r\n              <i class="icon-ok"></i>\r\n              <span data-bind="text: name">${formatName(\r\n                offering.name\r\n                // offering.sellingPrice\r\n              )}</span>\r\n            </span>\r\n            <strong class="price pull-right" data-bind="text: priceLabel">${formatServicesPrice(\r\n              offering.sellingPrice\r\n            )}</strong>\r\n          </li>\r\n        `)\r\n        );\r\n      }\r\n    });\r\n  } else {\r\n    setTimeout(function () {\r\n      createExtraServicesList();\r\n    }, 1000);\r\n  }\r\n}\r\n\r\n// function createExtraServicesList() {\r\n//   if ($("li.hproduct").length > 0) {\r\n//     // $("li.hproduct").each(function () {\r\n//     //   if ($(this).children("ul.service-list.unstyled").length === 0) {\r\n//     //     var productId = $($(this)[0]).data("sku");\r\n//     //     var productInCart = vtexjs.checkout.orderForm.items;\r\n//     //     for (i = 0; i < productInCart.length; ++i) {\r\n//     //       if (productInCart[i].id == productId) {\r\n//     //         // if accessory only print delivery service\r\n//     //         if (\r\n//     //           Object.keys(productInCart[i].productCategories).indexOf("2") !=\r\n//     //             -1 &&\r\n//     //           $(this).context.innerHTML.indexOf("Livraison à domicile") <= -1\r\n//     //         ) {\r\n//     //           $(this).append(`<ul class="service-list unstyled">\r\n//     //             <li class="service-item">\r\n//     //               <span class="product-name pull-left">\r\n//     //                <i class="icon-ok"></i>\r\n//     //               <span data-bind="text: name">Livraison à domicile</span>\r\n//     //               </span>\r\n//     //             <strong class="price pull-right" data-bind="text: priceLabel">Gratuito</strong>\r\n//     //             </li>\r\n//     //          </ul>`);\r\n//     //         } else {\r\n//     //           $(this).append(\r\n//     //             `<ul class="service-list unstyled prod-service"></ul>`\r\n//     //           );\r\n//     //         }\r\n//     //       }\r\n//     //     }\r\n//     //   } else {\r\n//     //     $("ul.service-list.unstyled").addClass("prod-service");\r\n//     //   }\r\n//     // });\r\n\r\n//     $("ul.service-list.unstyled.prod-service").each(function () {\r\n//       if ($(this).context.innerHTML.indexOf("Livraison à domicile") <= -1) {\r\n//         $(this).prepend(`<li class="service-item">\r\n//                             <span class="product-name pull-left">\r\n//                               <i class="icon-ok"></i>\r\n//                               <span data-bind="text: name">Livraison à domicile</span>\r\n//                             </span>\r\n//                             <strong class="price pull-right" data-bind="text: priceLabel">Gratuito</strong>\r\n//                           </li>`);\r\n//       }\r\n//       if ($(this).context.innerHTML.indexOf("Garantie 2 ans") <= -1) {\r\n//         $(this).prepend(`<li class="service-item">\r\n//                             <span class="product-name pull-left">\r\n//                               <i class="icon-ok"></i>\r\n//                               <span data-bind="text: name">Garantie 2 ans</span>\r\n//                             </span>\r\n//                             <strong class="price pull-right" data-bind="text: priceLabel">Gratuito</strong>\r\n//                           </li>`);\r\n//       }\r\n//     });\r\n//   } else {\r\n//     setTimeout(function () {\r\n//       createExtraServicesList();\r\n//     }, 1000);\r\n//   }\r\n// }\r\n\r\n$(document).on("change", ".extra-services-input", function () {\r\n  const serviceId = $(this).val();\r\n  const itemIndex = $(this).attr("data-index");\r\n  const isChecked = $(this).is(":checked");\r\n\r\n  if (isChecked) {\r\n    vtexjs.checkout.addOffering(serviceId, itemIndex);\r\n  } else {\r\n    vtexjs.checkout.removeOffering(serviceId, itemIndex);\r\n  }\r\n});\r\n\r\n// $(document).on("change", ".extra-services-radio", function (e) {\r\n//   e.stopImmediatePropagation();\r\n//   const selectedItemIdx = $(this).attr("data-index")\r\n\r\n//   $(`input:radio.extra-services-radio[data-index=${selectedItemIdx}]`).each(function () {\r\n//     const serviceId = $(this).val()\r\n//     const itemIndex = $(this).attr("data-index")\r\n//     const isChecked = $(this).is(":checked")\r\n\r\n//     if (serviceId !== \'\') {\r\n//       if (isChecked) {\r\n//         vtexjs.checkout.addOffering(serviceId, itemIndex)\r\n//       } else {\r\n//         vtexjs.checkout.removeOffering(serviceId, itemIndex)\r\n//       }\r\n//     }\r\n//   });\r\n// })\r\n\r\nfunction sortServices(services) {\r\n  services.sort(function (serviceA, serviceB) {\r\n    const serviceConfigA = EXTRA_SERVICES[serviceA.type];\r\n    const serviceConfigB = EXTRA_SERVICES[serviceB.type];\r\n\r\n    if (serviceConfigA && serviceConfigB) {\r\n      if (\r\n        EXTRA_SERVICES[serviceA.type].order <\r\n        EXTRA_SERVICES[serviceB.type].order\r\n      )\r\n        return -1;\r\n      if (\r\n        EXTRA_SERVICES[serviceA.type].order >\r\n        EXTRA_SERVICES[serviceB.type].order\r\n      )\r\n        return 1;\r\n    }\r\n\r\n    return 0;\r\n  });\r\n\r\n  return services;\r\n}\r\n\r\n// expects number like 42661.55556\r\nfunction number_format(\r\n  number,\r\n  thousands_sep = " ",\r\n  decimals = 2,\r\n  dec_point = ","\r\n) {\r\n  const rgx = /(\\d+)(\\d{3})/;\r\n  number = number / 100;\r\n  number = number.toFixed(decimals);\r\n\r\n  let nstr = number.toString();\r\n  nstr += "";\r\n  x = nstr.split(".");\r\n  x1 = x[0];\r\n  x2 = x.length > 1 ? dec_point + x[1] : "";\r\n\r\n  while (rgx.test(x1)) x1 = x1.replace(rgx, "$1" + thousands_sep + "$2");\r\n\r\n  // to return decimals -> x1 + x2\r\n  return x1;\r\n}\r\n\n\n//# sourceURL=webpack:///./src/checkout6-custom.js?'
        );

        /***/
      },

    /***/ "./src/checkout6-custom.scss":
      /*!***********************************!*\
  !*** ./src/checkout6-custom.scss ***!
  \***********************************/
      /*! no static exports found */
      /***/ function (module, exports, __webpack_require__) {
        eval(
          'module.exports = __webpack_require__.p + "checkout6-custom.css";\n\n//# sourceURL=webpack:///./src/checkout6-custom.scss?'
        );

        /***/
      },

    /***/ 0:
      /*!*******************************************************************!*\
  !*** multi ./src/checkout6-custom.js ./src/checkout6-custom.scss ***!
  \*******************************************************************/
      /*! no static exports found */
      /***/ function (module, exports, __webpack_require__) {
        eval(
          '__webpack_require__(/*! ./src/checkout6-custom.js */"./src/checkout6-custom.js");\nmodule.exports = __webpack_require__(/*! ./src/checkout6-custom.scss */"./src/checkout6-custom.scss");\n\n\n//# sourceURL=webpack:///multi_./src/checkout6-custom.js_./src/checkout6-custom.scss?'
        );

        /***/
      },

    /******/
  }
);
