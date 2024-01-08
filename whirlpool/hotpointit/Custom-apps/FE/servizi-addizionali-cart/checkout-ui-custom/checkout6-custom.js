/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/checkout6-custom.js":
/*!*********************************!*\
  !*** ./src/checkout6-custom.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const EXTRA_SERVICES = {};\r\n\r\n$(window).on(\"load\", function () {\r\n  checkout_v6_additional_services_checkboxes_initialize(EXTRA_SERVICES);\r\n  createExtraServices();\r\n});\r\n\r\n$(window).on(\"hashchange\", function () {\r\n  if (window.location.hash === \"#/cart\") {\r\n    setTimeout(function () {\r\n      createExtraServices();\r\n    }, 250);\r\n  }\r\n});\r\n\r\n$(window).on(\"orderFormUpdated.vtex\", function () {\r\n  if (window.location.hash === \"#/cart\") {\r\n    setTimeout(function () {\r\n      createExtraServices();\r\n    }, 500);\r\n  } else {\r\n    setTimeout(function () {\r\n      createExtraServicesList();\r\n    }, 500);\r\n  }\r\n});\r\n\r\nfunction find(array, tofind) {\r\n  for (let i = 0; i < array.length; i++) {\r\n    if (array[i].serviceName == tofind) {\r\n      return array[i].price * 100;\r\n    }\r\n  }\r\n  return 0;\r\n}\r\n\r\nfunction getPreselectedService() {\r\n  return {\r\n    id: \"0\",\r\n    name: \"Consegna al piano\",\r\n    price: 0,\r\n    type: \"Consegna al piano\",\r\n  };\r\n}\r\n\r\nfunction checkPriceValidity(price, listprice) {\r\n  if (price == 0) {\r\n    return true;\r\n  } else {\r\n    return !(listprice < price);\r\n  }\r\n}\r\n\r\nwindow.addEventListener(\r\n  \"theoreticalServicePrice.itwhirlpool\",\r\n  async function (e) {\r\n    let prodId = e.detail.id;\r\n    let serviceAvailable = e.detail.service;\r\n    let category = e.detail.categoryId;\r\n    let theoreticalServices = await fetch(\r\n      \"/api/dataentities/SA/search?_fields=serviceId,serviceName,price&_where=categoryId=\" +\r\n        category,\r\n      { method: \"GET\" }\r\n    ).then((res) => res.json());\r\n    if (serviceAvailable.length > 0) {\r\n      serviceAvailable = [getPreselectedService(), ...serviceAvailable];\r\n    }\r\n    serviceAvailable.map((service) => {\r\n      let TS = find(theoreticalServices, service.name);\r\n      let spanTS = \"\";\r\n      if (\r\n        TS !== 0 &&\r\n        TS !== service.price &&\r\n        checkPriceValidity(service.price, TS)\r\n      ) {\r\n        spanTS =\r\n          '<span class=\"price-strike\">' + number_format(TS) + \" € </span>\";\r\n      }\r\n      let spanPrice =\r\n        service.price === 0\r\n          ? \"<span class='service-free'>Gratuito</span>\"\r\n          : \"+ \" + number_format(service.price) + \" €\";\r\n      let nodes = document.querySelectorAll(\r\n        '.extra-services-price[id=\"' + service.name + \"-\" + prodId + '\"]'\r\n      );\r\n      if (nodes.length > 0) {\r\n        for (let i = 0; i < nodes.length; i++) {\r\n          let node = nodes[i];\r\n          node.innerHTML = spanTS + spanPrice;\r\n        }\r\n      }\r\n    });\r\n  }\r\n);\r\n\r\nfunction createExtraServices() {\r\n  if (\r\n    Object.keys(EXTRA_SERVICES).length > 0 &&\r\n    $(\".custom-extra-services\").length === 0\r\n  ) {\r\n    if (!vtexjs || !vtexjs.checkout || !vtexjs.checkout.orderForm) {\r\n      return;\r\n    }\r\n    const orderForm = vtexjs.checkout.orderForm;\r\n    const items = orderForm.items;\r\n    if (items.length > 0) {\r\n      for (let index = items.length - 1; index >= 0; index--) {\r\n        const item = items[index];\r\n        const productSKU = item.id;\r\n        const productQuantity = item.quantity;\r\n        const availableServices = sortServices(item.offerings);\r\n        const selectedServices = item.bundleItems;\r\n\r\n        let parentElement;\r\n        if ($(\".sku-seletor-\" + productSKU).length > 1) {\r\n          $(\".sku-seletor-\" + productSKU).each(function () {\r\n            const productTD = $(this).parent();\r\n\r\n            if (\r\n              parentElement === undefined &&\r\n              productTD.parent().parent().find(\"div.checkbox-services\")\r\n                .length === 0\r\n            ) {\r\n              parentElement = productTD;\r\n            }\r\n          });\r\n        } else {\r\n          parentElement = $(\"#product-name\" + productSKU).parent();\r\n        }\r\n        parentElement\r\n          .parent()\r\n          .parent()\r\n          .append(\r\n            `<div class=\"v-custom-product-item-wrap checkbox-services\"></div>`\r\n          );\r\n        parentElement = parentElement\r\n          .parent()\r\n          .parent()\r\n          .find(\"div.checkbox-services\");\r\n\r\n        // SERVICE ELEMENTS TO APPEND\r\n        let unselectableElements = ``;\r\n        let selectableElements = ``;\r\n\r\n        let category = Object.keys(item.productCategories)[\r\n          Object.keys(item.productCategories).length - 1\r\n        ];\r\n        window.dispatchEvent(\r\n          new CustomEvent(\"theoreticalServicePrice.itwhirlpool\", {\r\n            detail: {\r\n              id: productSKU,\r\n              service: availableServices,\r\n              categoryId: category,\r\n            },\r\n          })\r\n        );\r\n        availableServices.forEach((service) => {\r\n          service.name = service.name.replace(\"HP_\", \"\");\r\n          const serviceConfig = EXTRA_SERVICES[service.type.replace(\"HP_\", \"\")];\r\n          if (serviceConfig) {\r\n            // PRE-SELECTED SERVICES\r\n            let selected = false;\r\n            if (selectedServices.length > 0) {\r\n              selected = selectedServices.some(\r\n                (selectedService) => selectedService.id === service.id\r\n              );\r\n            } else {\r\n              selected = serviceConfig.selected;\r\n              if (selected) {\r\n                for (let i = 0; i < productQuantity; i++) {\r\n                  vtexjs.checkout.addOffering(service.id, index);\r\n                }\r\n              }\r\n            }\r\n            if (serviceConfig.selectionEnabled) {\r\n              //const servicePrice = service.price === 0 ? \"Gratuito\" : \"+ \" + number_format(service.price) + \" €\";\r\n              selectableElements += `<div class='extra-services-checkbox'>\r\n                                          <label class='extra-services-label' for='${index}-${\r\n                service.id\r\n              }'>\r\n                                          <input type='checkbox'\r\n                                            id='${index}-${service.id}'\r\n                                            class='extra-services-input'\r\n                                            value='${service.id}'\r\n                                            ${selected ? \"checked\" : \"\"}\r\n                                            data-price='${service.price}'\r\n                                            data-index='${index}'> \r\n                                            <span class=\"service-name\">${\r\n                                              service.name\r\n                                            }</span>\r\n                                            <div class=\"tooltip\">\r\n                                              <i class=\"icon-info\" onmouseover=\"handleMouseover()\"></i>\r\n                                              <span class=\"tooltiptext\">${\r\n                                                serviceConfig.description\r\n                                              }</span>\r\n                                            </div>\r\n                                            <span class='extra-services-price' id=\"${\r\n                                              service.name\r\n                                            }-${productSKU}\"><div class=\"loaderShipping productServicePrice ${productSKU}\"></div></span>\r\n                                          </label>\r\n                                        </div>`;\r\n            }\r\n            /* else {\r\n              unselectableElements += `<div class='preselected-service'>\r\n                                        <div>\r\n                                        <i class=\"icon-ok preselected-service-icon\"></i>\r\n                                        <span class='preselected-service-name'>${service.name}</span>\r\n                                        </div>\r\n                                      </div>`;\r\n            }\r\n            */\r\n          }\r\n        });\r\n\r\n        if (availableServices.length > 0) {\r\n          preselectedService =\r\n            unselectableElements += `<div class='preselected-service'>\r\n                                          <div>\r\n                                          <i class=\"icon-ok preselected-service-icon\"></i>\r\n                                          <span class='preselected-service-name'>Consegna al piano</span>\r\n                                          </div>\r\n                                          <div class=\"tooltip\">\r\n                                            <i class=\"icon-info\" onmouseover=\"handleMouseover()\"></i>\r\n                                            <span class=\"tooltiptext\">Consegna al piano gratuita e su appuntamento.</span>\r\n                                          </div>\r\n                                          <span class='extra-services-price' id=\"Consegna al piano-${productSKU}\"><div class=\"loaderShipping productServicePrice ${productSKU}\"></div></span>\r\n                                        </div>`;\r\n          parentElement.append(`<fieldset class='custom-extra-services'>\r\n                                      <div class='extra-services-preselected'>\r\n                                        ${unselectableElements}\r\n                                      </div>\r\n                                      <p class='title-custom-extra-services'>\r\n                                      <i class=\"icon-plus\"></i> Seleziona i servizi aggiuntivi inclusi nel prezzo</p>\r\n                                      ${selectableElements}\r\n                                    </fieldset>`);\r\n        }\r\n      }\r\n    }\r\n  }\r\n}\r\n\r\n$(document).on(\"change\", \".extra-services-input\", function () {\r\n  const serviceId = $(this).val();\r\n  const itemIndex = $(this).attr(\"data-index\");\r\n  const isChecked = $(this).is(\":checked\");\r\n\r\n  if (isChecked) {\r\n    vtexjs.checkout.addOffering(serviceId, itemIndex);\r\n  } else {\r\n    vtexjs.checkout.removeOffering(serviceId, itemIndex);\r\n  }\r\n});\r\n\r\nfunction sortServices(services) {\r\n  services.sort(function (serviceA, serviceB) {\r\n    const serviceConfigA = EXTRA_SERVICES[serviceA.type];\r\n    const serviceConfigB = EXTRA_SERVICES[serviceB.type];\r\n\r\n    if (serviceConfigA && serviceConfigB) {\r\n      if (\r\n        EXTRA_SERVICES[serviceA.type].order <\r\n        EXTRA_SERVICES[serviceB.type].order\r\n      )\r\n        return -1;\r\n      if (\r\n        EXTRA_SERVICES[serviceA.type].order >\r\n        EXTRA_SERVICES[serviceB.type].order\r\n      )\r\n        return 1;\r\n    }\r\n\r\n    return 0;\r\n  });\r\n\r\n  return services;\r\n}\r\n\r\n// expects number like 42661.55556\r\nfunction number_format(\r\n  number,\r\n  thousands_sep = \" \",\r\n  decimals = 2,\r\n  dec_point = \",\"\r\n) {\r\n  const rgx = /(\\d+)(\\d{3})/;\r\n  number = number / 100;\r\n  number = number.toFixed(decimals);\r\n\r\n  let nstr = number.toString();\r\n  nstr += \"\";\r\n  x = nstr.split(\".\");\r\n  x1 = x[0];\r\n  x2 = x.length > 1 ? dec_point + x[1] : \"\";\r\n\r\n  while (rgx.test(x1)) x1 = x1.replace(rgx, \"$1\" + thousands_sep + \"$2\");\r\n\r\n  // to return decimals -> x1 + x2\r\n  return x1 + x2;\r\n}\r\n\r\nfunction createExtraServicesList() {\r\n  const formatName = (name) => {\r\n    // if (\r\n    //   name.includes(\"_\") &&\r\n    //   name.split(\"_\")[1] == \"5 ans de garantie sur votre appareil\" &&\r\n    //   price != 0\r\n    // ) {\r\n    //   return \"Ètendre la garantie à 5 ans\";\r\n    // } else {\r\n    return name.includes(\"_\") ? name.split(\"_\")[1] : name;\r\n    // }\r\n  };\r\n  const formatServicesPrice = (price) =>\r\n    price == 0\r\n      ? \"Gratuito\"\r\n      : `${(price / 100).toFixed(2).replace(\".\", \",\")} ${\r\n          vtexjs.checkout.orderForm.storePreferencesData.currencySymbol\r\n        }`;\r\n\r\n  if ($(\"li.hproduct\").length > 0) {\r\n    $(\"li.hproduct\").append(`<ul class=\"product-services\">\r\n    <li class=\"service-item\">\r\n            <span class=\"product-name pull-left\">\r\n              <i class=\"icon-ok\"></i>\r\n            <span data-bind=\"text: name\">Consegna al piano</span>\r\n            </span>\r\n            <strong class=\"price pull-right\" data-bind=\"text: priceLabel\">Gratuito</strong>\r\n        </li>\r\n    </ul>`);\r\n\r\n    $(\"li.hproduct\").each(function (index) {\r\n      // Prevent cycle on li.hproduct that are not associated to any product\r\n      if (!vtexjs.checkout.orderForm.items[index]) return;\r\n\r\n      const product = vtexjs.checkout.orderForm.items[index];\r\n\r\n      // if (!product.productCategoryIds.includes(\"/2/\")) {\r\n      // $(this).children(\"ul.product-services\").append(`\r\n      //   <li class=\"service-item\">\r\n      //     <span class=\"product-name pull-left\">\r\n      //       <i class=\"icon-ok\"></i>\r\n      //       <span data-bind=\"text: name\">Garantie 2 ans</span>\r\n      //     </span>\r\n      //     <strong class=\"price pull-right\" data-bind=\"text: priceLabel\">Inclus</strong>\r\n      //   </li>\r\n      // `);\r\n      product.bundleItems.forEach((offering) =>\r\n        $(this).children(\"ul.product-services\").append(`\r\n          <li class=\"service-item\">\r\n            <span class=\"product-name pull-left\">\r\n              <i class=\"icon-ok\"></i>\r\n              <span data-bind=\"text: name\">${formatName(\r\n                offering.name,\r\n                offering.sellingPrice\r\n              )}</span>\r\n            </span>\r\n            <strong class=\"price pull-right\" data-bind=\"text: priceLabel\">${formatServicesPrice(\r\n              offering.sellingPrice\r\n            )}</strong>\r\n          </li>\r\n        `)\r\n      );\r\n      // }\r\n    });\r\n  } else {\r\n    setTimeout(function () {\r\n      createExtraServicesList();\r\n    }, 1000);\r\n  }\r\n}\r\n\n\n//# sourceURL=webpack:///./src/checkout6-custom.js?");

/***/ }),

/***/ "./src/checkout6-custom.scss":
/*!***********************************!*\
  !*** ./src/checkout6-custom.scss ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"checkout6-custom.css\";\n\n//# sourceURL=webpack:///./src/checkout6-custom.scss?");

/***/ }),

/***/ 0:
/*!*******************************************************************!*\
  !*** multi ./src/checkout6-custom.js ./src/checkout6-custom.scss ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__(/*! ./src/checkout6-custom.js */\"./src/checkout6-custom.js\");\nmodule.exports = __webpack_require__(/*! ./src/checkout6-custom.scss */\"./src/checkout6-custom.scss\");\n\n\n//# sourceURL=webpack:///multi_./src/checkout6-custom.js_./src/checkout6-custom.scss?");

/***/ })

/******/ });