//------------------------------------------
//------------ ONE TRUST  & GCM CUSTOM -------------------
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
      w[l].push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });
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
    "7d97594f-3edc-40de-9be6-203132ef3804"
  );
  script.type = "text/javascript";
  document.getElementsByTagName("head")[0].appendChild(script);
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
function getValidData(value, message = "Data not available") {
  return value ? value : message;
}
function getSellableStatus(propertyList, prop) {
  let property = getValuefromSpecifications(propertyList, prop);

  if (property === "true" || "in stock" || "limited availability")
    return "sellable";
  if (property === "false" || "obsolete") return "not sellable";

  return "Data not available";
}

window.eeccheckout = {
  location: "",
};

async function pushEventCheckout(stepID) {
  let orderForm = await vtexjs.checkout.getOrderForm();
  var items = orderForm.items;
  products = [];

  await Promise.all(
    items.map(async (value) => {
      let spec = await getSpecificationFromProduct(value.id);
      let categories = [];
      for (let key in value.productCategories) {
        categories.push(value.productCategories[key]);
      }
      
      var obj = {
        name: remove12ncName(value.name, value.refId),
        id: value.refId,
        price: value.isGift ? 0 : value.sellingPrice / 100,
        brand: value.additionalInfo.brandName,
        category: categories.join("/"),
        variant: remove12ncName(value.name, value.refId),
        quantity: value.quantity,
        //D2CA-189
        dimension4:
          getValuefromSpecifications(spec, "sellable") === "true"
            ? "Sellable Online"
            : "Not Sellable Online",
        dimension5: getValuefromSpecifications(spec, "field5"),
      };
      products.push(obj);
    })
  );
  window.eeccheckout.location = window.location.hash;
  $("body").removeClass("checkoutEventPush");
  if (
    window.dataLayer?.filter(
      (evento) =>
        evento.event == "eec.checkout" &&
        evento.ecommerce.checkout.actionField.step == 3
    ).length == 0
  ) {
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
console.log(vtexjs.checkout);
    const insertedCouponCode = vtexjs.checkout.orderForm?.marketingData?.coupon ?? "";

    sessionStorage.setItem("currCouponCode", insertedCouponCode);

    const wrongCouponMessage = vtexjs.checkout.orderForm?.messages[0]?.code;

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

    const lastCouponCode = parsedCouponAddEvents[indexLastCouponAddEvent]?.name ?? "";

    const currentCouponCode = sessionStorage.getItem("currCouponCode");

    const isWrongCoupon = wrongCouponMessage === "couponNotFound" || wrongCouponMessage === "cannotBeDelivered";

    if (isWrongCoupon) {
      const messageText = vtexjs.checkout.orderForm?.messages[0]?.text ?? "";
      const wrongCouponCodeWords = messageText.split(" ");
      const wrongCouponCode = wrongCouponCodeWords[1];

      window.dataLayer.push({
        event: "coupon_add",
        coupon_validity: "false",
        name: wrongCouponCode
      });
      window.dataLayer.push({
        event: "couponTracking",
        eventCategory: "Coupon",
        eventAction: wrongCouponCode ,
        eventLabel: "Not Valid"
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
      window.dataLayer.push({
        event: "couponTracking",
        eventCategory: "Coupon",
        eventAction: insertedCouponCode,
        eventLabel: "Valid",
      });
    }
  });
});
// End of GA4FUNREQ47

//FUNREQ52 - Lead Generation Event
function pushLeadGenerationEvent() {
  const userEmail = document.getElementById("client-email")?.value; //D2CA-639

  return window.dataLayer.push({
      event: "leadGeneration",
      eventCategory: "Lead Generation",
      eventAction: "Optin granted",
      eventLabel: "Lead from checkout step1",
      email: userEmail,
  });
}

$(document).ready(function () {
  var goToShipping = document.getElementById("go-to-shipping");
  goToShipping.addEventListener("click", function () {
      const isTermsAccepted = $("#custom-corporate-terms").is(":checked")
          ? true
          : false;
      const isOptin = $("#opt-in-newsletter").is(":checked") ? true : false;
      const emailInput = document.getElementById("client-email")?.value;
  
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
      if (isTermsAccepted && isOptin && isEmailPushed === false) {
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
      link_text: "Vai alla spedizione",
      checkpoint: `checkout`,
      area: "(Other)",
      type: "go to shipping",
  });
}

// End of FUNREQ52
  
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

//GA4FUNREQ61
function pushOptinInEvent() {
  return window.dataLayer.push({
      event: "optin",
  });
}
// End of GA4FUNREQ61

//GA4FUNREQ73 - view_cart
$(document).ready(function () {
window.eeccheckout.location = window.location.hash;
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
    let spec = await getSpecificationFromProduct(value.productId);

   let categories = [];
      for (let key in value.productCategories) {
        categories.push(value.productCategories[key]);
      }
    const promoStatus = value.price < value.listPrice ? "In Promo" : "Not in Promo";

    var obj = {
      item_id: value.refId,
      item_name: remove12ncName(value.name, value.refId),
      item_brand: value.additionalInfo.brandName,
      item_variant: remove12ncName(value.name, value.refId),
      item_category: categories.join("/"),
      price: value.isGift ? 0 : value.sellingPrice / 100,
      quantity: value.quantity,
      // also known as dimension4
      sellable_status:  getValuefromSpecifications(spec, "sellable") === "true" ? "Sellable Online" : "Not Sellable Online",
      product_type: getValuefromSpecifications(spec, "field5"),
      promo_status: promoStatus,
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
      let url = new URL(window.location.href);
      let isUrlGet = url.search != "";
      let checkStep2 = step == 2 ? !isUrlGet : true;
  
      if (
          window.dataLayer &&
          !isLoading &&
          checkStep2 &&
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
  let step = getCheckoutStep();
  let url = new URL(window.location.href);
  let isUrlGet = url.search != "";
  let checkStep2 = step == 2 ? !isUrlGet : true;
  setTimeout(function () {
      let step = getCheckoutStep();
      if (step == 0) {
          return;
      }
      let isLoading = $("body").hasClass("checkoutEventPush");
      if (window.dataLayer && !isLoading && checkStep2) {
          $("body").addClass("checkoutEventPush");
          pushEventCheckout(step);
      }
  }, 1500);
});
// End of GA4FUNREQ73

// Global variables
var userTypeStatus = "";
console.log("change");


!(function (e) {
  e.extend(e.fn, {
    livequery: function (i, t, u) {
      var n,
        r = this;
      return (
        e.isFunction(i) && ((u = t), (t = i), (i = void 0)),
        e.each(e.livequery.queries, function (e, s) {
          if (
            !(
              r.selector != s.selector ||
              r.context != s.context ||
              i != s.type ||
              (t && t.$lqguid != s.fn.$lqguid) ||
              (u && u.$lqguid != s.fn2.$lqguid)
            )
          )
            return (n = s) && !1;
        }),
        (n = n || new e.livequery(this.selector, this.context, i, t, u)),
        (n.stopped = !1),
        n.run(),
        this
      );
    },
    expire: function (i, t, u) {
      var n = this;
      return (
        e.isFunction(i) && ((u = t), (t = i), (i = void 0)),
        e.each(e.livequery.queries, function (r, s) {
          n.selector != s.selector ||
            n.context != s.context ||
            (i && i != s.type) ||
            (t && t.$lqguid != s.fn.$lqguid) ||
            (u && u.$lqguid != s.fn2.$lqguid) ||
            this.stopped ||
            e.livequery.stop(s.id);
        }),
        this
      );
    },
  }),
    (e.livequery = function (i, t, u, n, r) {
      return (
        (this.selector = i),
        (this.context = t),
        (this.type = u),
        (this.fn = n),
        (this.fn2 = r),
        (this.elements = []),
        (this.stopped = !1),
        (this.id = e.livequery.queries.push(this) - 1),
        (n.$lqguid = n.$lqguid || e.livequery.guid++),
        r && (r.$lqguid = r.$lqguid || e.livequery.guid++),
        this
      );
    }),
    (e.livequery.prototype = {
      stop: function () {
        var e = this;
        this.type
          ? this.elements.unbind(this.type, this.fn)
          : this.fn2 &&
            this.elements.each(function (i, t) {
              e.fn2.apply(t);
            }),
          (this.elements = []),
          (this.stopped = !0);
      },
      run: function () {
        if (!this.stopped) {
          var i = this,
            t = this.elements,
            u = e(this.selector, this.context),
            n = u.not(t);
          (this.elements = u),
            this.type
              ? (n.bind(this.type, this.fn),
                t.length > 0 &&
                  e.each(t, function (t, n) {
                    e.inArray(n, u) < 0 && e.event.remove(n, i.type, i.fn);
                  }))
              : (n.each(function () {
                  i.fn.apply(this);
                }),
                this.fn2 &&
                  t.length > 0 &&
                  e.each(t, function (t, n) {
                    e.inArray(n, u) < 0 && i.fn2.apply(n);
                  }));
        }
      },
    }),
    e.extend(e.livequery, {
      guid: 0,
      queries: [],
      queue: [],
      running: !1,
      timeout: null,
      checkQueue: function () {
        if (e.livequery.running && e.livequery.queue.length)
          for (var i = e.livequery.queue.length; i--; )
            e.livequery.queries[e.livequery.queue.shift()].run();
      },
      pause: function () {
        e.livequery.running = !1;
      },
      play: function () {
        (e.livequery.running = !0), e.livequery.run();
      },
      registerPlugin: function () {
        e.each(arguments, function (i, t) {
          if (e.fn[t]) {
            var u = e.fn[t];
            e.fn[t] = function () {
              var i = u.apply(this, arguments);
              return e.livequery.run(), i;
            };
          }
        });
      },
      run: function (i) {
        void 0 != i
          ? e.inArray(i, e.livequery.queue) < 0 && e.livequery.queue.push(i)
          : e.each(e.livequery.queries, function (i) {
              e.inArray(i, e.livequery.queue) < 0 && e.livequery.queue.push(i);
            }),
          e.livequery.timeout && clearTimeout(e.livequery.timeout),
          (e.livequery.timeout = setTimeout(e.livequery.checkQueue, 20));
      },
      stop: function (i) {
        void 0 != i
          ? e.livequery.queries[i].stop()
          : e.each(e.livequery.queries, function (i) {
              e.livequery.queries[i].stop();
            });
      },
    }),
    e.livequery.registerPlugin(
      "append",
      "prepend",
      "after",
      "before",
      "wrap",
      "attr",
      "removeAttr",
      "addClass",
      "removeClass",
      "toggleClass",
      "empty",
      "remove",
      "html"
    ),
    e(function () {
      e.livequery.play();
    });
})(jQuery);

var hash = window.location.hash;
var cartClass = "__cart";
var emailClass = "__email";
var profileClass = "__profile";
var shippingClass = "__shipping";
var paymentClass = "__payment";

$(document).ready(function () {
  if (hash === "#/cart") {
    $("body").addClass(cartClass);
  }

  if (hash === "#/email") {
    $("body").addClass(emailClass);
  }

  if (hash === "#/profile") {
    $("body").addClass(profileClass);
  }

  if (hash === "#/shipping") {
    $("body").addClass(shippingClass);
  }

  if (hash === "#/payment") {
    $("body").addClass(paymentClass);
  }

  var goBtn = $(".cart-links.cart-links-bottom").detach();
  $(".summary-template-holder .summary").append(goBtn);

  $("#backBtn").click(function () {
    window.history.back();
  });
});

$(window).on("hashchange", function () {
  var hash = window.location.hash;

  if (hash === "#/cart") {
    $("body").removeClass(emailClass);
    $("body").removeClass(profileClass);
    $("body").removeClass(shippingClass);
    $("body").removeClass(paymentClass);
    $("body").addClass(cartClass);
  }

  if (hash === "#/email") {
    $("body").removeClass(cartClass);
    $("body").removeClass(profileClass);
    $("body").removeClass(shippingClass);
    $("body").removeClass(paymentClass);
    $("body").addClass(emailClass);
  }

  if (hash === "#/profile") {
    $("body").removeClass(cartClass);
    $("body").removeClass(emailClass);
    $("body").removeClass(shippingClass);
    $("body").removeClass(paymentClass);
    $("body").addClass(profileClass);
  }

  if (hash === "#/shipping") {
    $("body").removeClass(cartClass);
    $("body").removeClass(emailClass);
    $("body").removeClass(profileClass);
    $("body").removeClass(paymentClass);
    $("body").addClass(shippingClass);
  }

  if (hash === "#/payment") {
    $("body").removeClass(cartClass);
    $("body").removeClass(emailClass);
    $("body").removeClass(profileClass);
    $("body").removeClass(shippingClass);
    $("body").addClass(paymentClass);
  }
});

const elementObserver = (element, callback) => {
  const observer = new MutationObserver((mutations) => {
    for (let i = 0; i < mutations.length; i++) {
      const mutation = mutations[i];
      for (let z = 0; z < mutation.addedNodes.length; z++) {
        const addedNode = mutation.addedNodes[z];
        if (addedNode) {
          if (addedNode.querySelector) {
            const foundElement = addedNode.querySelector(element);
            if (foundElement) {
              callback(foundElement);
              observer.disconnect();
            }
          }
        }
      }
    }
  });
  const observeOptions = {
    childList: true,
    subtree: true,
  };
  observer.observe(document, observeOptions);
};
var CorporateUtils = {
  allCountries: [],
  initializing: false,
  countriesLoaded: false,
  selectedCountry: null,
  selectedPersonType: null,
  checkoutSection: ".corporate-info-box",
  showContent: false,
  acceptedTerms: false,
  appId: "fiscaldata",
  documentType: null,
  selectedField: "SDI",
  buttonText: "Includi informazioni sulla società",
  italyCorporateFields: [
    ".corporate-field.custom-corporate-name",
    ".corporate-field.custom-corporate-document",
    ".corporate-field.custom-corporate-street",
    ".corporate-field.custom-corporate-postal-code",
    ".corporate-field.custom-corporate-number",
    ".corporate-field.custom-corporate-city",
    ".corporate-field.custom-corporate-state",
    ".sdipec-tabs.tabs-container",
    ".corporate-field.custom-corporate-pec",
    ".corporate-field.custom-corporate-sdi", // '.corporate-field.custom-corporate-terms'
  ],
  corporateOthersFields: [
    ".corporate-field.custom-corporate-name",
    ".corporate-field.custom-corporate-document",
    ".corporate-field.custom-corporate-street",
    ".corporate-field.custom-corporate-number",
    ".corporate-field.custom-corporate-city",
    ".corporate-field.custom-corporate-state",
  ],
  italyFields: [
    ".corporate-field.custom-corporate-name",
    ".corporate-field.custom-corporate-document",
    ".corporate-field.custom-corporate-street",
    ".corporate-field.custom-corporate-number",
    ".corporate-field.custom-corporate-city",
    ".corporate-field.custom-corporate-state",
    ".sdipec-tabs.tabs-container",
    ".corporate-field.custom-corporate-pec",
    ".corporate-field.custom-corporate-sdi", // '.corporate-field.custom-corporate-terms'
  ],
  normalFields: [
    ".corporate-field.custom-corporate-name",
    ".corporate-field.custom-corporate-document",
    ".corporate-field.custom-corporate-street",
    ".corporate-field.custom-corporate-number",
    ".corporate-field.custom-corporate-city",
    ".corporate-field.custom-corporate-state", // '.corporate-field.custom-corporate-terms'
  ],
  // salesChannels: {
  //   '1': ['Italy'],
  //   '2': ['France', 'Germany', 'Greece', 'Netherlands', 'Portugal', 'Spain', 'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czechia', 'Denmark', 'Estonia', 'Finland', 'Hungary', 'Ireland', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Poland', 'Romania', 'Slovakia', 'Slovenia', 'Sweden'],
  //   '3': ['Afghanistan', 'Algeria', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Australia', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Botswana', 'Brazil', 'Brunei Darussalam', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Cook Islands', 'Costa Rica', 'Côte d\'Ivoire ', 'Cuba', 'North Korea', 'Democratic Republic of the Congo', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Ethiopia', 'Fiji', 'Gabon', 'Gambia', 'Ghana', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'India', 'Indonesia', 'Iran', 'Iraq', 'Israel', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon', 'Lesotho', 'Liberia', 'Libyan Arab Jamahiriya', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia (Federated States of ) ', 'Mongolia', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Qatar', 'South Korea', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Seychelles', 'Sierra Leone', 'Singapore', 'Solomon Islands', 'Somalia', 'South Africa', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Syria', 'Tajikistan', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkmenistan', 'Tuvalu', 'Uganda', 'United Arab Emirates', 'Tanzania', 'United States of America', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Viet Nam', 'Yemen', 'Zambia', 'Zimbabwe'],
  //   '4': ['Switzerland', 'United Kingdom', 'Albania', 'Andorra', 'Armenia', 'Azerbaijan', 'Belarus', 'Bosnia and Herzegovina', 'Georgia', 'Iceland', 'Kosovo', 'Liechtenstein', 'Moldova ', 'Monaco', 'Montenegro', 'North Macedonia', 'Norway', 'Russia', 'San Marino', 'Serbia', 'Turkey', 'Ukraine']
  // },
  //Dup changes
  salesChannels: {
    1: ["Switzerland"],
    2: ["Switzerland"],
    3: ["Switzerland"],
  },

  countrySelectorIT: `
    <p class='corporate-field user-country-field'>

    <label>Seleziona il tuo paese</label>

      <select class='input-xlarge custom-corporate-input' id="user-country" style="width: 100% !important;">
        <option value="Switzerland" selected>Svizzera</option>
      </select>
    </p>
  `,
  countrySelectorDE: `
    <p class='corporate-field user-country-field'>

    <label>Wähle dein Land</label>

      <select class='input-xlarge custom-corporate-input' id="user-country" style="width: 100% !important;">
        <option value="Switzerland" selected>Schweiz</option>
      </select>
    </p>
  `,
  countrySelectorFR: `
    <p class='corporate-field user-country-field'>

    <label>Sélectionnez votre pays</label>

      <select class='input-xlarge custom-corporate-input' id="user-country" style="width: 100% !important;">
        <option value="Switzerland" selected>Suisse</option>
      </select>
    </p>
  `,
  countrySelectorEN: `
    <p class='corporate-field user-country-field'>
      <label>Select your country</label>
      <select class='input-xlarge custom-corporate-input' id="user-country" style="width: 100% !important;">
         <option disabled selected value="">Select a country</option>
        <option value="Italy">Italy</option>
        <option value="Afghanistan">Afghanistan</option>
        <option value="Åland Islands">Åland Islands</option>
        <option value="Albania">Albania</option>
        <option value="Algeria">Algeria</option>
        <option value="American Samoa">American Samoa</option>
        <option value="Andorra">Andorra</option>
        <option value="Angola">Angola</option>
        <option value="Anguilla">Anguilla</option>
        <option value="Antarctica">Antarctica</option>
        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
        <option value="Argentina">Argentina</option>
        <option value="Armenia">Armenia</option>
        <option value="Aruba">Aruba</option>
        <option value="Australia">Australia</option>
        <option value="Austria">Austria</option>
        <option value="Azerbaijan">Azerbaijan</option>
        <option value="Bahamas">Bahamas</option>
        <option value="Bahrain">Bahrain</option>
        <option value="Bangladesh">Bangladesh</option>
        <option value="Barbados">Barbados</option>
        <option value="Belarus">Belarus</option>
        <option value="Belgium">Belgium</option>
        <option value="Belize">Belize</option>
        <option value="Benin">Benin</option>
        <option value="Bermuda">Bermuda</option>
        <option value="Bhutan">Bhutan</option>
        <option value="Bolivia">Bolivia</option>
        <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
        <option value="Botswana">Botswana</option>
        <option value="Bouvet Island">Bouvet Island</option>
        <option value="Brazil">Brazil</option>
        <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
        <option value="Brunei Darussalam">Brunei Darussalam</option>
        <option value="Bulgaria">Bulgaria</option>
        <option value="Burkina Faso">Burkina Faso</option>
        <option value="Burundi">Burundi</option>
        <option value="Cambodia">Cambodia</option>
        <option value="Cameroon">Cameroon</option>
        <option value="Canada">Canada</option>
        <option value="Cape Verde">Cape Verde</option>
        <option value="Cayman Islands">Cayman Islands</option>
        <option value="Central African Republic">Central African Republic</option>
        <option value="Chad">Chad</option>
        <option value="Chile">Chile</option>
        <option value="China">China</option>
        <option value="Christmas Island">Christmas Island</option>
        <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
        <option value="Colombia">Colombia</option>
        <option value="Comoros">Comoros</option>
        <option value="Congo">Congo</option>
        <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
        <option value="Cook Islands">Cook Islands</option>
        <option value="Costa Rica">Costa Rica</option>
        <option value="Cote D'ivoire">Cote D'ivoire</option>
        <option value="Croatia">Croatia</option>
        <option value="Cuba">Cuba</option>
        <option value="Cyprus">Cyprus</option>
        <option value="Czech Republic">Czech Republic</option>
        <option value="Denmark">Denmark</option>
        <option value="Djibouti">Djibouti</option>
        <option value="Dominica">Dominica</option>
        <option value="Dominican Republic">Dominican Republic</option>
        <option value="Ecuador">Ecuador</option>
        <option value="Egypt">Egypt</option>
        <option value="El Salvador">El Salvador</option>
        <option value="Equatorial Guinea">Equatorial Guinea</option>
        <option value="Eritrea">Eritrea</option>
        <option value="Estonia">Estonia</option>
        <option value="Ethiopia">Ethiopia</option>
        <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
        <option value="Faroe Islands">Faroe Islands</option>
        <option value="Fiji">Fiji</option>
        <option value="Finland">Finland</option>
        <option value="France">France</option>
        <option value="French Guiana">French Guiana</option>
        <option value="French Polynesia">French Polynesia</option>
        <option value="French Southern Territories">French Southern Territories</option>
        <option value="Gabon">Gabon</option>
        <option value="Gambia">Gambia</option>
        <option value="Georgia">Georgia</option>
        <option value="Germany">Germany</option>
        <option value="Ghana">Ghana</option>
        <option value="Gibraltar">Gibraltar</option>
        <option value="Greece">Greece</option>
        <option value="Greenland">Greenland</option>
        <option value="Grenada">Grenada</option>
        <option value="Guadeloupe">Guadeloupe</option>
        <option value="Guam">Guam</option>
        <option value="Guatemala">Guatemala</option>
        <option value="Guernsey">Guernsey</option>
        <option value="Guinea">Guinea</option>
        <option value="Guinea-bissau">Guinea-bissau</option>
        <option value="Guyana">Guyana</option>
        <option value="Haiti">Haiti</option>
        <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
        <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
        <option value="Honduras">Honduras</option>
        <option value="Hong Kong">Hong Kong</option>
        <option value="Hungary">Hungary</option>
        <option value="Iceland">Iceland</option>
        <option value="India">India</option>
        <option value="Indonesia">Indonesia</option>
        <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
        <option value="Iraq">Iraq</option>
        <option value="Ireland">Ireland</option>
        <option value="Isle of Man">Isle of Man</option>
        <option value="Israel">Israel</option>
        <option value="Jamaica">Jamaica</option>
        <option value="Japan">Japan</option>
        <option value="Jersey">Jersey</option>
        <option value="Jordan">Jordan</option>
        <option value="Kazakhstan">Kazakhstan</option>
        <option value="Kenya">Kenya</option>
        <option value="Kiribati">Kiribati</option>
        <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
        <option value="Korea, Republic of">Korea, Republic of</option>
        <option value="Kuwait">Kuwait</option>
        <option value="Kyrgyzstan">Kyrgyzstan</option>
        <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
        <option value="Latvia">Latvia</option>
        <option value="Lebanon">Lebanon</option>
        <option value="Lesotho">Lesotho</option>
        <option value="Liberia">Liberia</option>
        <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
        <option value="Liechtenstein">Liechtenstein</option>
        <option value="Lithuania">Lithuania</option>
        <option value="Luxembourg">Luxembourg</option>
        <option value="Macao">Macao</option>
        <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
        <option value="Madagascar">Madagascar</option>
        <option value="Malawi">Malawi</option>
        <option value="Malaysia">Malaysia</option>
        <option value="Maldives">Maldives</option>
        <option value="Mali">Mali</option>
        <option value="Malta">Malta</option>
        <option value="Marshall Islands">Marshall Islands</option>
        <option value="Martinique">Martinique</option>
        <option value="Mauritania">Mauritania</option>
        <option value="Mauritius">Mauritius</option>
        <option value="Mayotte">Mayotte</option>
        <option value="Mexico">Mexico</option>
        <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
        <option value="Moldova, Republic of">Moldova, Republic of</option>
        <option value="Monaco">Monaco</option>
        <option value="Mongolia">Mongolia</option>
        <option value="Montenegro">Montenegro</option>
        <option value="Montserrat">Montserrat</option>
        <option value="Morocco">Morocco</option>
        <option value="Mozambique">Mozambique</option>
        <option value="Myanmar">Myanmar</option>
        <option value="Namibia">Namibia</option>
        <option value="Nauru">Nauru</option>
        <option value="Nepal">Nepal</option>
        <option value="Netherlands">Netherlands</option>
        <option value="Netherlands Antilles">Netherlands Antilles</option>
        <option value="New Caledonia">New Caledonia</option>
        <option value="New Zealand">New Zealand</option>
        <option value="Nicaragua">Nicaragua</option>
        <option value="Niger">Niger</option>
        <option value="Nigeria">Nigeria</option>
        <option value="Niue">Niue</option>
        <option value="Norfolk Island">Norfolk Island</option>
        <option value="Northern Mariana Islands">Northern Mariana Islands</option>
        <option value="Norway">Norway</option>
        <option value="Oman">Oman</option>
        <option value="Pakistan">Pakistan</option>
        <option value="Palau">Palau</option>
        <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
        <option value="Panama">Panama</option>
        <option value="Papua New Guinea">Papua New Guinea</option>
        <option value="Paraguay">Paraguay</option>
        <option value="Peru">Peru</option>
        <option value="Philippines">Philippines</option>
        <option value="Pitcairn">Pitcairn</option>
        <option value="Poland">Poland</option>
        <option value="Portugal">Portugal</option>
        <option value="Puerto Rico">Puerto Rico</option>
        <option value="Qatar">Qatar</option>
        <option value="Reunion">Reunion</option>
        <option value="Romania">Romania</option>
        <option value="Russian Federation">Russian Federation</option>
        <option value="Rwanda">Rwanda</option>
        <option value="Saint Helena">Saint Helena</option>
        <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
        <option value="Saint Lucia">Saint Lucia</option>
        <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
        <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
        <option value="Samoa">Samoa</option>
        <option value="San Marino">San Marino</option>
        <option value="Sao Tome and Principe">Sao Tome and Principe</option>
        <option value="Saudi Arabia">Saudi Arabia</option>
        <option value="Senegal">Senegal</option>
        <option value="Serbia">Serbia</option>
        <option value="Seychelles">Seychelles</option>
        <option value="Sierra Leone">Sierra Leone</option>
        <option value="Singapore">Singapore</option>
        <option value="Slovakia">Slovakia</option>
        <option value="Slovenia">Slovenia</option>
        <option value="Solomon Islands">Solomon Islands</option>
        <option value="Somalia">Somalia</option>
        <option value="South Africa">South Africa</option>
        <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
        <option value="Spain">Spain</option>
        <option value="Sri Lanka">Sri Lanka</option>
        <option value="Sudan">Sudan</option>
        <option value="Suriname">Suriname</option>
        <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
        <option value="Swaziland">Swaziland</option>
        <option value="Sweden">Sweden</option>
        <option value="Switzerland">Switzerland</option>
        <option value="Syrian Arab Republic">Syrian Arab Republic</option>
        <option value="Taiwan, Province of China">Taiwan, Province of China</option>
        <option value="Tajikistan">Tajikistan</option>
        <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
        <option value="Thailand">Thailand</option>
        <option value="Timor-leste">Timor-leste</option>
        <option value="Togo">Togo</option>
        <option value="Tokelau">Tokelau</option>
        <option value="Tonga">Tonga</option>
        <option value="Trinidad and Tobago">Trinidad and Tobago</option>
        <option value="Tunisia">Tunisia</option>
        <option value="Turkey">Turkey</option>
        <option value="Turkmenistan">Turkmenistan</option>
        <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
        <option value="Tuvalu">Tuvalu</option>
        <option value="Uganda">Uganda</option>
        <option value="Ukraine">Ukraine</option>
        <option value="United Arab Emirates">United Arab Emirates</option>
        <option value="United Kingdom">United Kingdom</option>
        <option value="United States">United States</option>
        <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
        <option value="Uruguay">Uruguay</option>
        <option value="Uzbekistan">Uzbekistan</option>
        <option value="Vanuatu">Vanuatu</option>
        <option value="Venezuela">Venezuela</option>
        <option value="Viet Nam">Viet Nam</option>
        <option value="Virgin Islands, British">Virgin Islands, British</option>
        <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
        <option value="Wallis and Futuna">Wallis and Futuna</option>
        <option value="Western Sahara">Western Sahara</option>
        <option value="Yemen">Yemen</option>
        <option value="Zambia">Zambia</option>
        <option value="Zimbabwe">Zimbabwe</option>
      </select>
    </p>
  `,

  personTypeSelectorIT: `
    <p class='corporate-field person-type-field'>
      <label>Tipo di cliente</label>
      <select class='input-xlarge custom-corporate-input' id="user-person-type" style="width: 100% !important;">
        <option disabled selected value="">Seleziona un'opzione</option>
        <option value="Persona Fisica">Privato</option>
        <option value="Persona Giuridica">Azienda</option>
      </select>
    </p>
  `,
  personTypeSelectorEN: `
    <p class='corporate-field person-type-field'>
       <label>Type</label>
      <select class='input-xlarge custom-corporate-input' id="user-person-type" style="width: 100% !important;">
        <option disabled selected value="">Select an option</option>
        <option value="Persona Fisica">Private</option>
        <option value="Persona Giuridica">Company</option>
      </select>
    </p>
  `,
  modalHTMLIT: `
  <!--<div class='corporate-content'>-->
    <p class='corporate-field custom-corporate-name'>
      <label>Nome/Ragione Sociale</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-name" />
    </p>
    <p class='corporate-field custom-corporate-document'>
      <label>Partita IVA/Codice Fiscale</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-document" />
    </p>
    <p class='corporate-field custom-corporate-street'>
      <label>Indirizzo</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-street" name="corporate-street" required/>
    </p>
    <p class='corporate-field half custom-corporate-number'>
      <label>Numero</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-number"/>
    </p>
  <p class='corporate-field custom-corporate-postal-code'>
  <label>Codice Postale</label>
  <input class="input-xlarge custom-corporate-input" type="number"  pattern="\d*" maxlength="4"  id="custom-corporate-postal-code" name="corporate-postal-code" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" onchange="validatePostalCode(this.value),'IT'" required/>
  </p>
    <p class='corporate-field custom-corporate-city'>
      <label>Città</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-city" name="corporate-city" onchange="validateCity(this.value),'IT'" required/>
    </p>

    <!--<p class='corporate-field custom-corporate-sdi'>
      <label>SDI</label>
      <input minlength="8" class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-sdi" />
    </p>
    <p class='corporate-field custom-corporate-pec'>
      <label>PEC</label>
      <input minlength="8" class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-pec" />
    </p>-->
    <div class="w3c tabs-container sdipec-tabs">
      <div class='tab-container active' id="SDI">
        <div class='tab-button'>SDI</div>
        <div class='tab-content'>
          <p class='corporate-field custom-corporate-pec'>
            <label>SDI</label>
            <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-sdi" />
          </p>
        </div>
      </div>
      <div class='tab-container' id="PEC">
        <div class='tab-button'>PEC</div>
        <div class='tab-content'>
          <p class='corporate-field custom-corporate-pec'>
            <label>PEC</label>
            <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-pec" />
          </p>
        </div>
      </div>
    </div>
  <!--</div>-->
`,
  modalHTMLEN: `
    <!--<div class='corporate-content'>-->
      <p class='corporate-field custom-corporate-name'>
        <label>Name/Company name</label>
        <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-name" />
      </p>
      <p class='corporate-field custom-corporate-document'>
        <label>VAT number/Fiscal Code</label>
        <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-document" />
      </p>
      <p class='corporate-field custom-corporate-street'>
        <label>Address</label>
        <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-street" name="corporate-street" required/>
      </p>
      <p class='corporate-field half custom-corporate-number'>
        <label>Number</label>
        <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-number"/>
      </p>
      <p class='corporate-field custom-corporate-city'>
        <label>City</label>
        <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-city" name="corporate-city" onchange="validateCity(this.value),'EN'" required/>
      </p>
      <p class='corporate-field custom-corporate-state'>
        <label>State (Region)</label>
        <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-state" />
      </p>
      <!--<p class='corporate-field custom-corporate-sdi'>
        <label>SDI</label>
        <input minlength="8" class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-sdi" />
      </p>
      <p class='corporate-field custom-corporate-pec'>
        <label>PEC</label>
        <input minlength="8" class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-pec" />
      </p>-->
      <div class="w3c tabs-container sdipec-tabs">
        <div class='tab-container active' id="SDI">
          <div class='tab-button'>SDI</div>
          <div class='tab-content'>
            <p class='corporate-field custom-corporate-pec'>
              <label>SDI</label>
              <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-sdi" />
            </p>
          </div>
        </div>
        <div class='tab-container' id="PEC">
          <div class='tab-button'>PEC</div>
          <div class='tab-content'>
            <p class='corporate-field custom-corporate-pec'>
              <label>PEC</label>
              <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-pec" />
            </p>
          </div>
        </div>
      </div>
    <!--</div>-->
  `,
  modalHTMLDE: `
  <!--<div class='corporate-content'>-->
    <p class='corporate-field custom-corporate-name'>
      <label>Nome/Ragione Sociale</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-name" />
    </p>
    <p class='corporate-field custom-corporate-document'>
      <label>Partita IVA/Codice Fiscale</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-document" />
    </p>
    <p class='corporate-field custom-corporate-street'>
      <label>Adresse</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-street" name="corporate-street" required/>
    </p>
    <p class='corporate-field half custom-corporate-number'>
      <label>Numero</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-number"/>
    </p>
  <p class='corporate-field custom-corporate-postal-code'>
  <label>Postleitzahl</label>
  <input class="input-xlarge custom-corporate-input" type="number" id="custom-corporate-postal-code"  pattern="\d*" maxlength="4"  name="corporate-postal-code" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" onchange="validatePostalCode(this.value,'DE')" required />
  </p>
    <p class='corporate-field custom-corporate-city'>
      <label>Stadt</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-city" name="corporate-city" onchange="validateCity(this.value),'DE'" required/>
    </p>

    <!--<p class='corporate-field custom-corporate-sdi'>
      <label>SDI</label>
      <input minlength="8" class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-sdi" />
    </p>
    <p class='corporate-field custom-corporate-pec'>
      <label>PEC</label>
      <input minlength="8" class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-pec" />
    </p>-->
    <div class="w3c tabs-container sdipec-tabs">
      <div class='tab-container active' id="SDI">
        <div class='tab-button'>SDI</div>
        <div class='tab-content'>
          <p class='corporate-field custom-corporate-pec'>
            <label>SDI</label>
            <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-sdi" />
          </p>
        </div>
      </div>
      <div class='tab-container' id="PEC">
        <div class='tab-button'>PEC</div>
        <div class='tab-content'>
          <p class='corporate-field custom-corporate-pec'>
            <label>PEC</label>
            <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-pec" />
          </p>
        </div>
      </div>
    </div>
  <!--</div>-->
`,
  modalHTMLFR: `
  <!--<div class='corporate-content'>-->
    <p class='corporate-field custom-corporate-name'>
      <label>Nome/Ragione Sociale</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-name" />
    </p>
    <p class='corporate-field custom-corporate-document'>
      <label>Partita IVA/Codice Fiscale</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-document" />
    </p>
    <p class='corporate-field custom-corporate-street'>
      <label>Adresse</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-street" name="corporate-street" required/>
    </p>
    <p class='corporate-field half custom-corporate-number'>
      <label>Numero</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-number"/>
    </p>
  <p class='corporate-field custom-corporate-postal-code'>
  <label>Code postal</label>
  <input class="input-xlarge custom-corporate-input" type="number" id="custom-corporate-postal-code"  pattern="\d*" maxlength="4" name="corporate-postal-code" oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" onchange="validatePostalCode(this.value,'FR')" required/>
  </p>
    <p class='corporate-field custom-corporate-city'>
      <label>Ville</label>
      <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-city" name="corporate-city" onchange="validateCity(this.value,'FR')" required/>
    </p>

    <!--<p class='corporate-field custom-corporate-sdi'>
      <label>SDI</label>
      <input minlength="8" class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-sdi" />
    </p>
    <p class='corporate-field custom-corporate-pec'>
      <label>PEC</label>
      <input minlength="8" class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-pec" />
    </p>-->
    <div class="w3c tabs-container sdipec-tabs">
      <div class='tab-container active' id="SDI">
        <div class='tab-button'>SDI</div>
        <div class='tab-content'>
          <p class='corporate-field custom-corporate-pec'>
            <label>SDI</label>
            <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-sdi" />
          </p>
        </div>
      </div>
      <div class='tab-container' id="PEC">
        <div class='tab-button'>PEC</div>
        <div class='tab-content'>
          <p class='corporate-field custom-corporate-pec'>
            <label>PEC</label>
            <input class="input-xlarge custom-corporate-input" type="text" id="custom-corporate-pec" />
          </p>
        </div>
      </div>
    </div>
  <!--</div>-->
`,
  termsHTMLIT: `
    <br>
    <span>(*) Campi richiesti</span>
    <br>
    <p class='corporate-field custom-corporate-terms'>
      <label class='checkbox'>
        <input required class="input-xlarge custom-corporate-input required" type="checkbox" id="custom-corporate-terms" />
        <span>Ho letto i <a href="#" target="_blank">termini e condizioni</a> e acconsento * <br><br> Comprendo e confermo il contenuto dell'<a href="#" target="_blank">informativa sulla privacy</a> e: </span>
      </label>
    </p>
  `,
  termsHTMLDE: `
  <br>
    <span>(*) Pflichtfelder</span>
    <br>
    <p class='corporate-field custom-corporate-terms'>
      <label class='checkbox'>
        <input required class="input-xlarge custom-corporate-input required" type="checkbox" id="custom-corporate-terms" />
        <span>Ich habe die <a href="#" target="_blank">Geschäftsbedingungen</a> gelesen und stimme zu * <br><br> Ich verstehe und bestätige den Inhalt der <a href="#" target="_blank">Datenschutzerklärung</a> und: </span>
      </label>
    </p>
  `,
  termsHTMLFR: `
  <br>
  <span>(*) Champs obligatoires</span>
   <br>
   <p class='corporate-field custom-corporate-terms'>
      <label class='checkbox'>
        <input required class="input-xlarge custom-corporate-input required" type="checkbox" id="custom-corporate-terms" />
        <span>J'ai lu les <a href="#" target="_blank">termes et conditions</a> et j'accepte * <br><br> Je comprends et confirme le contenu de la <a href="#" target="_blank">politique de confidentialité</a> et: </span>
      </label>
    </p>
  `,
  termsHTMLEN: `
    <p class='corporate-field custom-corporate-terms'>
      <label class='checkbox'>
        <input required class="input-xlarge custom-corporate-input required" type="checkbox" id="custom-corporate-terms" />
         <span>I accept the <a href="#">Terms & Conditions</a> and the <a href="#">Privacy Policy<a></span>
      </label>
    </p>
  `,
  currentModal: function () {
    return $("body").find("#modal-instance").length
      ? $("#modal-instance")
      : false;
  },
  getData: function () {
    var name = $(this.checkoutSection).find("#custom-corporate-name").val();
    var document = $(this.checkoutSection)
      .find("#custom-corporate-document")
      .val();
    var street = $(this.checkoutSection).find("#custom-corporate-street").val();
    var number = $(this.checkoutSection).find("#custom-corporate-number").val();
    var codicePostal = $(this.checkoutSection)
      .find("#custom-corporate-postal-code")
      .val();
    var secondary = $(this.checkoutSection)
      .find("#custom-corporate-secondary")
      .val();
    //secondary street
    var reference = $(this.checkoutSection)
      .find("#custom-corporate-reference")
      .val();
    var neighborhood = $(this.checkoutSection)
      .find("#custom-corporate-neighborhood")
      .val();
    var city = $(this.checkoutSection).find("#custom-corporate-city").val();
    var state = $(this.checkoutSection).find("#custom-corporate-state").val();
    var country = $(this.checkoutSection)
      .find("#user-country option:selected")
      .val();

    var pec = $(this.checkoutSection).find("#custom-corporate-pec").val();
    var sdi = $(this.checkoutSection).find("#custom-corporate-sdi").val();

    return {
      corporateName: name,
      document,
      street,
      number,
      codicePostal,
      secondary,
      reference,
      neighborhood,
      city,
      state,
      country,
      pec,
      sdi,
    };
  },
  validate: function (el) {
    // if (!$(el).val()) {
    //   $(el).addClass('error')
    // } else {
    //   $(el).removeClass('error')
    // }

    return true;
  },
  validateVAT: function (el) {
    var vatValue = $(el).val();

    let regexValidation = $(el).hasClass("partita-iva")
      ? /^[0-9]{11}$/.test(vatValue)
      : /^([A-Z]{3})([A-Z]{3})(\d{2})([A-Z])(\d{2})([A-Z]\d{3}[A-Z])$/.test(
          vatValue
        );

    if (vatValue && vatValue.length >= 8 && regexValidation) {
      $(el).removeClass("error");
      $(el).addClass("success");
      $("#custom-corporate-document").removeClass("error");
      $("#custom-corporate-document").addClass("success");
      return true;
    } else {
      $(el).addClass("error");
      $(el).removeClass("success");
      $("#custom-corporate-document").addClass("error");
      $("#custom-corporate-document").removeClass("success");
      return false;
    }
  },
  validateSDI: function (el) {
    var sdiValue = $(el).val();

    let regexValidation = /^\w{7}$/.test(sdiValue);

    if (sdiValue && regexValidation) {
      $(el).removeClass("error");
      $(el).addClass("success");
      $("#custom-corporate-sdi").removeClass("error");
      $("#custom-corporate-sdi").addClass("success");
      return true;
    } else {
      $(el).addClass("error");
      $(el).removeClass("success");
      $("#custom-corporate-sdi").addClass("error");
      $("#custom-corporate-sdi").removeClass("success");
      return false;
    }
  },
  validatePEC: function (el) {
    var pecValue = $(el).val();

    let regexValidation =
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        pecValue
      );

    if (pecValue && regexValidation) {
      $(el).removeClass("error");
      $(el).addClass("success");
      $("#custom-corporate-pec").removeClass("error");
      $("#custom-corporate-pec").addClass("success");
      return true;
    } else {
      $(el).addClass("error");
      $(el).removeClass("success");
      $("#custom-corporate-pec").addClass("error");
      $("#custom-corporate-pec").removeClass("success");
      return false;
    }
  },
  toggleContent: function () {
    this.showContent = !this.showContent;
    if (this.showContent) {
      $(".corporate-content").css("display", "flex");
    } else {
      $(".corporate-content").hide();
    }
  },
  setShowContent: function (c) {
    this.showContent = c;
    if (c) {
      $(".corporate-content").css("display", "flex");
    } else {
      $(".corporate-content").hide();
    }
  },
  save: function () {
    var formData = this.getData();
    var scope = this;

    var profileData = vtexjs.checkout.orderForm.clientProfileData || {};

    profileData.email = $("#client-email").val() || profileData.email;
    profileData.firstName = $("#client-first-name").val();
    if ($("#client-new-document").val()) {
      profileData.document = $("#client-new-document").val();
    }
    profileData.lastName = $("#client-last-name").val();
    profileData.phone =
      $("#client-phone").val() || $("#client-new-phone").val();

    $(".client-company-nickname").val(formData.corporateName);

    profileData.corporateName = formData.corporateName;
    profileData.tradeName = formData.corporateName;
    profileData.corporateDocument = formData.document;
    profileData.corporatePhone =
      (vtexjs.checkout.orderForm.clientProfileData &&
        vtexjs.checkout.orderForm.clientProfileData.phone) ||
      $("#client-phone").val() ||
      "";
    profileData.stateInscription = profileData.corporateDocument;
    clientProfileData.documentType = scope.documentType;
    profileData.isCorporate = true;

    vtexjs.checkout
      .sendAttachment("clientProfileData", profileData)
      .then(function (nOrderForm) {
        // $("#go-to-shipping").click();

        let formattedCountry, selectedCountryItem;
        if (scope.countriesLoaded) {
          selectedCountryItem = scope.allCountries.find((c) => {
            console.log("c", c);
            console.log("uc", $("#user-country option:selected").val());
            return (
              c.name.toLowerCase() ===
              $("#user-country option:selected").val().toLowerCase()
            );
          });
          console.log("countryItem", selectedCountryItem);
          console.log("allCountries", scope.allCountries);
          formattedCountry =
            selectedCountryItem && selectedCountryItem["alpha-3"];
        }

        console.log("formattedCountry", formattedCountry);

        var address = {
          postalCode: formData.codicePostal,
          city: formData.city,
          state: formData.state,
          country:
            formattedCountry ||
            $("#user-country option:selected").val() ||
            "ITA",
          street: formData.street,
          number: formData.number,
          neighborhood: formData.neighborhood,
          complement: formData.secondary,
          reference: formData.reference,
          geoCoordinates: [],
        };
        var invoiceAddress = nOrderForm.invoiceData || {};
        invoiceAddress = {
          ...invoiceAddress,
          address,
        };

        return vtexjs.checkout.sendAttachment("invoiceData", invoiceAddress);
      })
      .then(function (newOrderForm) {
        $("#client-profile-data form.form-step.box-edit").submit();
        console.log("newOrderForm", newOrderForm);
        /*
        vtexjs.checkout.getOrderForm()
          .then(function (rOrderForm) {
            var orderFormId = rOrderForm.orderFormId
            $.ajax({
              type: 'PUT',
              url: '/api/checkout/pub/orderForm/' + orderFormId + '/customData/' + scope.appId,
              dataType: "json",
              contentType: "application/json; charset=utf-8",
              data: JSON.stringify({
                "SDIPEC": formData.sdi || formData.pec || "VATNumber",
                "sendInvoiceTo": scope.selectedField,
                "typeOfDocument": scope.documentType || "VATNumber"
              }),
              success: function () {
                var marketingData = vtexjs.checkout.orderForm.marketingData || {
                  marketingTags: []
                }

                if (marketingData.marketingTags.indexOf('ivafree') === -1) {
                  // if (scope.selectedCountry === "Italy" && scope.selectedPersonType.toLowerCase() === "Azienda".toLowerCase() && rOrderForm.salesChannel.toString() === "2") {
                  //   marketingData.marketingTags.push('ivafree')
                  // }
                  // if (scope.selectedPersonType.toLowerCase() === "Persona".toLowerCase()) {
                  //   marketingData.marketingTags = []
                  // }
                  if ((scope.selectedPersonType || 'persona fisica').toLowerCase() === "persona fisica" && scope.selectedCountry !== "Italy") {
                    marketingData.marketingTags.push('ivafree')
                  } else {
                    marketingData.marketingTags = ['thisisnotvalid']
                  }

                  if (scope.selectedPersonType.toLowerCase() === "persona giuridica" && vtexjs.checkout.orderForm.salesChannel === "3") {
                    marketingData.marketingTags.push('ivafree')
                  } else {
                    marketingData.marketingTags = ['thisisnotvalid']
                  }
                }

                vtexjs.checkout.sendAttachment('marketingData', marketingData)
                  .then(function (saOrderForm) {
                    console.log("marketingData set", saOrderForm);
                  })
              },
              error: function (e) {
                console.log("error", e);
              }
            })
          })
        */
      });
  },
  changeLabel: function (selector, value) {
    elementObserver(selector, function (el) {
      setTimeout(function () {
        $(el).html(value);
      });
    });
  },
  onSelectCountry: function (e) {
    var country = e.target.value;
    CorporateUtils.selectedCountry = country;

    console.log("country", country);

    if (country == "Italy") {
      $(".person-type-field").show();
      $(CorporateUtils.normalFields.join(",")).hide();
      $(CorporateUtils.italyCorporateFields.join(",")).hide();
      $(CorporateUtils.italyFields.join(",")).hide();
    } else {
      $(".person-type-field").show();
      $(CorporateUtils.italyCorporateFields.join(",")).hide();
      $(CorporateUtils.italyFields.join(",")).hide();
      CorporateUtils.setupNormalFields();
    }

    $(".custom-corporate-postal-code").show();
  },
  setupNormalFields: function () {
    const scope = this;
    $(".corporate-field.custom-corporate-name label").html("Company Name");
    $(".custom-corporate-document label").html("VAT Number");
    scope.documentType = "VATNumber";

    $(scope.italyCorporateFields.join(",")).hide();
    $(scope.italyFields.join(",")).hide();
    $(scope.normalFields.join(",")).show();
  },
  onSelectPersonTypeEN: function (e) {
    var type = e.target.value;
    CorporateUtils.selectedPersonType = type;

    console.log("type", type);

    if (type == "Persona Fisica") {
      $(".corporate-field.custom-corporate-name label").html("Name");
      $(".custom-corporate-document label").html("Fiscal Code");
      $("#custom-corporate-document").removeClass("partita-iva");

      if (CorporateUtils.selectedCountry === "Italy") {
        $(CorporateUtils.italyCorporateFields.join(",")).hide();
        $(CorporateUtils.normalFields.join(",")).hide();
        $(CorporateUtils.italyFields.join(",")).show();
        CorporateUtils.documentType = "CodiceFiscale";
        $(".sdipec-tabs").hide();
      } else {
        $(CorporateUtils.italyCorporateFields.join(",")).hide();
        $(CorporateUtils.italyFields.join(",")).hide();
        $(CorporateUtils.normalFields.join(",")).show();
        CorporateUtils.documentType = "CodiceFiscale";
        $(".sdipec-tabs").hide();
      }
    } else {
      if (CorporateUtils.selectedCountry === "Italy") {
        $(".corporate-field.custom-corporate-name label").html("Company Name");
        $(".custom-corporate-document label").html("VAT Number");
        $("#custom-corporate-document").addClass("partita-iva");
        $(CorporateUtils.italyFields.join(",")).hide();
        $(CorporateUtils.corporateOthersFields.join(",")).hide();
        $(CorporateUtils.italyCorporateFields.join(",")).show();
        CorporateUtils.documentType = "PartitaIVA";
      } else {
        $(".corporate-field.custom-corporate-name label").html("Company Name");
        $(".custom-corporate-document label").html("VAT Number");
        $("#custom-corporate-document").addClass("partita-iva");
        $(CorporateUtils.italyFields.join(",")).hide();
        $(CorporateUtils.italyCorporateFields.join(",")).hide();
        $(CorporateUtils.corporateOthersFields.join(",")).show();
        CorporateUtils.documentType = "PartitaIVA";
        $(".sdipec-tabs").hide();
      }
    }
  },
  onSelectPersonTypeIT: function (e) {
    var type = e.target.value;
    CorporateUtils.selectedPersonType = type;

    console.log("type", type);

    if (type == "Persona Fisica") {
      $(".corporate-field.custom-corporate-name label").html("Nome");
      $(".custom-corporate-document label").html("Codice fiscale");
      $("#custom-corporate-document").removeClass("partita-iva");
      if (CorporateUtils.selectedCountry === "Italy") {
        $(CorporateUtils.italyCorporateFields.join(",")).hide();
        $(CorporateUtils.normalFields.join(",")).hide();
        $(CorporateUtils.italyFields.join(",")).show();
        CorporateUtils.documentType = "CodiceFiscale";
        $(".sdipec-tabs").hide();
      } else {
        $(CorporateUtils.italyCorporateFields.join(",")).hide();
        $(CorporateUtils.italyFields.join(",")).hide();
        $(CorporateUtils.normalFields.join(",")).show();
        CorporateUtils.documentType = "CodiceFiscale";
        $(".sdipec-tabs").hide();
      }
    } else {
      if (CorporateUtils.selectedCountry === "Italy") {
        $(".corporate-field.custom-corporate-name label").html(
          "Ragione Sociale"
        );
        $(".custom-corporate-document label").html("Partita IVA");
        $("#custom-corporate-document").addClass("partita-iva");
        $(CorporateUtils.italyFields.join(",")).hide();
        $(CorporateUtils.corporateOthersFields.join(",")).hide();
        $(CorporateUtils.italyCorporateFields.join(",")).show();
        CorporateUtils.documentType = "PartitaIVA";
      } else {
        $(".corporate-field.custom-corporate-name label").html(
          "Ragione Sociale"
        );
        $(".custom-corporate-document label").html("Partita IVA");
        $("#custom-corporate-document").addClass("partita-iva");
        $(CorporateUtils.italyFields.join(",")).hide();
        $(CorporateUtils.italyCorporateFields.join(",")).hide();
        $(CorporateUtils.corporateOthersFields.join(",")).show();
        CorporateUtils.documentType = "PartitaIVA";
        $(".sdipec-tabs").hide();
      }
    }
  },
  disableProceed: function () {
    if ($(".corporate-info-box").is(":visible")) {
      $("#custom-go-to-shipping").hide();
      //.css('pointer-events', 'none').hide();
    } else {
      $("#custom-go-to-shipping").hide();
      //.css('pointer-events', 'none').hide();
      $("#go-to-shipping").hide().css("pointer-events", "all");
    }
  },
  enableProceed: function () {
    $("#custom-go-to-shipping").hide();
    //.css('pointer-events', 'none').hide();
    $("#go-to-shipping")
      .attr("style", "display: block !important")
      .css("pointer-events", "all");
  },
  toggleTerms: function (e) {
    var checked = $(e.target).is(":checked");
    console.log("visible?", $(".corporate-info-box").is(":visible"));
    console.log("checked", checked);
    if (checked) {
      $("#edit-shipping-data").show();
      $("#open-shipping").show();
      $("#btn-go-to-payment").show();
      $("#go-to-shipping").show();
      CorporateUtils.enableProceed();
    } else {
      $("#edit-shipping-data").hide();
      $("#open-shipping").hide();
      $("#btn-go-to-payment").hide();
      $("#go-to-shipping").hide();
      CorporateUtils.disableProceed();
    }
  },
  setCorporateData: function () {
    vtexjs.checkout.getOrderForm().then(function (orderForm) {
      console.log("orderForm", orderForm);
      var invoiceData = orderForm.invoiceData;
      var profileData = orderForm.clientProfileData;
      var fiscalData =
        orderForm.customData &&
        orderForm.customData.customApps &&
        orderForm.customData.customApps.find((app) => app.id === "fiscaldata");

      if (invoiceData) {
        $("#custom-corporate-street")
          .val(invoiceData.address.street)
          .addClass("success");
        $("#custom-corporate-number")
          .val(invoiceData.address.number)
          .addClass("success");
        $("#custom-corporate-postal-code")
          .val(invoiceData.address.postalCode)
          .addClass("success");
        $("#custom-corporate-secondary")
          .val(invoiceData.address.complement)
          .addClass("success");
        //secondary street
        $("#custom-corporate-reference")
          .val(invoiceData.address.reference)
          .addClass("success");
        $("#custom-corporate-neighborhood")
          .val(invoiceData.address.neighborhood)
          .addClass("success");
        $("#custom-corporate-city")
          .val(invoiceData.address.city)
          .addClass("success");
        $("#custom-corporate-state")
          .val(invoiceData.address.state)
          .addClass("success");
      }

      if (profileData && profileData.isCorporate) {
        $("#custom-corporate-name")
          .val(profileData.corporateName)
          .addClass("success");
        $("#custom-corporate-document")
          .val(profileData.corporateDocument)
          .addClass("success");
      }

      if (fiscalData) {
        if (fiscalData.fields.sendInvoiceTo === "SDI") {
          $("#custom-corporate-sdi")
            .val(fiscalData.fields.SDIPEC)
            .addClass("success");
        } else {
          $("#custom-corporate-pec")
            .val(fiscalData.fields.SDIPEC)
            .addClass("success");
        }
      }
    });
  },
  init: function () {
    var selector = this.checkoutSection;
    var scope = this;

    if (scope.initializing) return;

    // vtexjs.checkout.getOrderForm()
    // .then(function(orderForm){
    //   if (orderForm.salesChannel === "2") {
    //     $(selector).prepend(scope.personTypeSelector);
    //     scope.onSelectPersonType({ target: { value: 'Persona Fisica' } })
    //   }
    // })
    vtexjs.checkout.getOrderForm().then((data) => {
      switch (data.salesChannel) {
        case "1":
          data.clientPreferencesData.optinNewsLetter = "false";
          break;
        case "2":
          /* setInterval(function() {
                    translateEnglish();
                }, 500);
                data.clientPreferencesData.locale = "en-GB";*/
          data.clientPreferencesData.optinNewsLetter = "false";

          break;
        case "3":
          /*setInterval(function() {
                    translateFrench();
                }, 500);
                data.clientPreferencesData.locale = "fr-FR";*/
          data.clientPreferencesData.optinNewsLetter = "false";
          break;
        case "4":
          setInterval(function () {
            translateEnglish();
          }, 500);
          data.clientPreferencesData.locale = "en-US";
          data.clientPreferencesData.optinNewsLetter = "false";
          break;
        default:
          data.clientPreferencesData.locale = "en-GB";
          data.clientPreferencesData.optinNewsLetter = "false";
      }
      vtexjs.checkout.sendAttachment(
        "clientPreferencesData",
        data.clientPreferencesData
      );

      if (
        data.clientPreferencesData.locale == "en-GB" ||
        data.clientPreferencesData.locale == "en-US" ||
        data.clientPreferencesData.locale == "es-ES" ||
        data.clientPreferencesData.locale == "de-DE"
      ) {
        $(selector).prepend(scope.personTypeSelectorEN);
        $(selector).prepend(scope.countrySelectorEN);

        $.ajax({
          url: "/files/countries.json",
          type: "GET",
          success: (data) => {
            scope.allCountries = data;
            scope.countriesLoaded = true;
          },
          error: (err) => {
            console.log(err);
          },
        });

        var { salesChannel: sc } = data;

        function mountOptions(arr) {
          var r = arr.map((opt) => `<option value="${opt}">${opt}</option>`);
          r.unshift(
            '<option disabled selected value="">Select a country</option>'
          );
          return r.join("");
        }
        $("#user-country").html(
          mountOptions(scope.salesChannels[(sc || "1").toString()])
        );

        $(selector).append(scope.modalHTMLEN);
        $(".newsletter").before(scope.termsHTMLEN);

        $(
          ".corporate-field:not(.user-country-field,.custom-corporate-terms), .sdipec-tabs, .client-company-name, .client-company-document, .client-company-nickname"
        ).hide();

        $("#user-country").on("change", scope.onSelectCountry);
        $("#user-person-type").on("change", scope.onSelectPersonTypeEN);
        $("#custom-corporate-terms").on("change", scope.toggleTerms);

        setTimeout(function () {
          $(".custom-corporate-input:not(select)").each(function (x, input) {
            $(input).on("input", function (e) {
              var value = e.target.value;
              setTimeout(function () {
                scope.validate(input);
              }, 300);
            });
            // $(input).on('keyup, keydown', function(evt){
            //   if (evt.keyCode === 13) {
            //     evt.preventDefault()
            //     return false;
            //   }
            // })
          });

          var elTarget = $(
            '[data-i18n="global.goToPayment"], [data-i18n="global.goToShipping"]'
          );
          $(elTarget).hide();

          var newEl = $('[data-i18n="global.goToShipping"]').clone(false);
          $(newEl).data("bind", "");
          $(newEl).removeAttr("id").attr("id", "custom-go-to-shipping");
          $(newEl).removeAttr("data-bind");
          $(newEl).removeClass("submit");
          $(newEl).css("display", "block");
          //$('.box-client-info .newsletter').after(newEl)

          $(newEl).on("click", function (e) {
            e.preventDefault();

            const sdipecVal =
              $("#custom-corporate-pec").val() ||
              $("#custom-corporate-sdi").val();
            const sdipecVisible =
              $("#custom-corporate-pec").is(":visible") ||
              $("#custom-corporate-sdi").is(":visible");

            if (sdipecVisible && (!sdipecVal || sdipecVal === "VATNumber")) {
              window.location.hash = "#/profile";
              sendMessage("Please fill all required fields!", "error");
              return;
            }

            var checked = $("#custom-corporate-terms").is(":checked");
            if (!checked) {
              sendMessage("Please fill all required fields!", "error");
              return;
            }

            scope.save();
            // $(".custom-corporate-input:not(select)").each(function(x, input){
            //   scope.save(input)
            // })
          });
        });

        $("body").on("click", ".tab-button", function (e) {
          e.preventDefault();

          $(".tab-container").removeClass("active");
          $(this).parent().addClass("active");
          $(".tab-container input").each(function (index, el) {
            console.log("element here", $(el));
            $(el).removeAttr("required");
          });
          console.log("here", $(this).find("input"));
          $(".tab-container.active input")
            .attr("required", "required")
            .prop("required", "required");

          CorporateUtils.selectedField = $(this).parent().attr("id");
          console.log("Selected Field", CorporateUtils.selectedField);
        });

        // $('.corporate-field').each(function (index, el) {
        //   $(el).on('keydown, keyup, onsubmit', function (evt) {
        //     if(evt.keyCode == 13) {
        //       evt.preventDefault();
        //       return false;
        //     }
        //   })
        // })

        this.setCorporateData();
      } else if (
        data.clientPreferencesData.locale == "de-CH" ||
        data.clientPreferencesData.locale == "it-CH" ||
        data.clientPreferencesData.locale == "fr-CH"
      ) {
        $(selector).prepend(scope.personTypeSelectorIT);

        $.ajax({
          url: "/files/countries.json",
          type: "GET",
          success: (data) => {
            scope.allCountries = data;
            scope.countriesLoaded = true;
          },
          error: (err) => {
            console.log(err);
          },
        });

        vtexjs.checkout.getOrderForm().then(function (orderForm) {
          var { salesChannel: sc } = orderForm;

          function mountOptions(arr) {
            var r = arr.map((opt) => `<option value="${opt}">${opt}</option>`);
            return r.join("");
          }

          $("#user-country").html(
            mountOptions(scope.salesChannels[(sc || "1").toString()])
          );
        });

        const brand =
          vtexjs.checkout.orderForm.salesChannel === "1"
            ? "Whirlpool"
            : vtexjs.checkout.orderForm.salesChannel === "2"
            ? "Bauknecht"
            : "Indesit";

        switch (data.clientPreferencesData.locale) {
          case "de-CH":
            $(selector).append(scope.modalHTMLDE);
            $(selector).prepend(scope.countrySelectorDE);
            $(".newsletter").before(scope.termsHTMLDE);
            $(".newsletter .newsletter-text").html(
              `Ich stimme zu, personalisierte Werbemitteilungen in Bezug auf ${brand} und andere Marken der Whirlpool Corporation zu erhalten.`
            );
            $(".client-phone label").html("Mobiltelefon");
            break;
          case "it-CH":
            $(selector).append(scope.modalHTMLIT);
            $(selector).prepend(scope.countrySelectorIT);
            $(".newsletter").before(scope.termsHTMLIT);
            $(".newsletter .newsletter-text").html(
              `Accetto di ricevere comunicazioni di marketing personalizzate relative a ${brand} e altri marchi Whirlpool Corporation. `
            );
            $(".client-phone label").html("Cellulare");
            break;
          case "fr-CH":
            $(selector).append(scope.modalHTMLFR);
            $(selector).prepend(scope.countrySelectorFR);
            $(".newsletter").before(scope.termsHTMLFR);
            $(".newsletter .newsletter-text").html(
              `J'accepte de recevoir des communications marketing personnalisées relatives à ${brand} et aux autres marques de Whirlpool Corporation. `
            );
            $(".client-phone label").html("Portable");
            break;
          default:
            $(selector).append(scope.modalHTMLEN);
        }

        setTimeout(() => {
          window.createStateSelectBilling();
        }, 100);
        $(
          ".corporate-field:not(.user-country-field,.custom-corporate-terms), .sdipec-tabs, .client-company-name, .client-company-document, .client-company-nickname"
        ).hide();

        $("#user-country").on("change", this.onSelectCountry);
        $("#user-person-type").on("change", this.onSelectPersonTypeIT);
        $("#custom-corporate-terms").on("change", this.toggleTerms);

        setTimeout(function () {
          $(".custom-corporate-input:not(select)").each(function (x, input) {
            $(input).on("input", function (e) {
              var value = e.target.value;
              setTimeout(function () {
                scope.validate(input);
              }, 300);
            });
            // $(input).on('keyup, keydown', function(evt){
            //   if (evt.keyCode === 13) {
            //     evt.preventDefault()
            //     return false;
            //   }
            // })
          });

          var elTarget = $(
            '[data-i18n="global.goToPayment"], [data-i18n="global.goToShipping"]'
          );
          $(elTarget).hide();

          var newEl = $('[data-i18n="global.goToShipping"]').clone(false);
          $(newEl).data("bind", "");
          $(newEl).removeAttr("id").attr("id", "custom-go-to-shipping");
          $(newEl).removeAttr("data-bind");
          $(newEl).removeClass("submit");
          $(newEl).css("display", "block");
          //$('.box-client-info .newsletter').after(newEl)

          $(newEl).on("click", function (e) {
            e.preventDefault();

            var checked = $("#custom-corporate-terms").is(":checked");
            if (!checked) {
              sendMessage(
                "Ti preghiamo di compilare tutti i campi richiesti!",
                "error"
              );
              return;
            }

            const sdipecVal =
              $("#custom-corporate-pec").val() ||
              $("#custom-corporate-sdi").val();
            const sdipecVisible =
              $("#custom-corporate-pec").is(":visible") ||
              $("#custom-corporate-sdi").is(":visible");

            if (sdipecVisible && (!sdipecVal || sdipecVal === "VATNumber")) {
              window.location.hash = "#/profile";
              sendMessage("Please fill all required fields!", "error");
              return;
            }

            scope.save();
            // $(".custom-corporate-input:not(select)").each(function(x, input){
            //   scope.save(input)
            // })
          });
        });

        $("body").on("click", ".tab-button", function (e) {
          e.preventDefault();

          $(".tab-container").removeClass("active");
          $(this).parent().addClass("active");
          $(".tab-container input").each(function (index, el) {
            console.log("element here", $(el));
            $(el).removeAttr("required");
          });
          console.log("here", $(this).find("input"));
          $(".tab-container.active input")
            .attr("required", "required")
            .prop("required", "required");

          CorporateUtils.selectedField = $(this).parent().attr("id");
          console.log("Selected Field", CorporateUtils.selectedField);
        });

        // $('.corporate-field').each(function (index, el) {
        //   $(el).on('keydown, keyup, onsubmit', function (evt) {
        //     if(evt.keyCode == 13) {
        //       evt.preventDefault();
        //       return false;
        //     }
        //   })
        // })

        this.setCorporateData();
      }
      $("#custom-corporate-document").on("input", function () {
        console.log("changed", $(this).val());
        var v = $(this).val();
        scope.validateVAT(this, v);
      });
      $("#custom-corporate-sdi").on("input", function () {
        var v = $(this).val();
        scope.validateSDI(this, v);
      });
      $("#custom-corporate-pec").on("input", function () {
        var v = $(this).val();
        scope.validatePEC(this, v);
      });
    });
  },
};

// $(".newsletter").livequery(function () {
//   setTimeout(function(){
//     console.log("opa 1");
//     CorporateUtils.init();
//   })
// })

function sendMessage(content, type) {
  var messages, message;
  messages = new window.vtex.Messages.getInstance({
    ajaxError: true,
  });
  message = {
    usingModal: false,
    content: {
      title: type === "error" ? "Error!" : "Success!",
      detail: content,
    },
    type: type,
  };
  $(window).trigger("addMessage", message);
}

$(document).ready(function () {
  $(".newsletter").livequery(function () {
    setTimeout(function () {
      if (
        !$("#custom-corporate-terms").length ||
        (!$("#user-country").length && !CorporateUtils.initializing)
      ) {
        CorporateUtils.init();
        CorporateUtils.initializing = true;
      }
    });
  });
  CorporateUtils.changeLabel(
    'label[for="client-company-document"]',
    "Codice fiscale / Partita IVA"
  );
});

$(document).ready(function () {
  $("#not-corporate-client").livequery("click", function () {
    vtexjs.checkout
      .getOrderForm()
      .then(function (orderForm) {
        const profileData = orderForm.clientProfileData || {};
        profileData.isCorporate = false;
        //return vtexjs.checkout.sendAttachment('clientProfileData', profileData)
      })
      .then(function () {
        $(".corporate-info-box").hide();
      });
  });

  var changed = false;
  $(window).on("hashchange", function () {
    var checked = $("#custom-corporate-terms").is(":checked");

    if (checked) {
      CorporateUtils.enableProceed();
    } else {
      if (!changed && window.location.hash === "#/shipping") {
        window.location.hash = "#/profile";
        sendMessage("Please accept the terms!", "error");
        changed = true;
        CorporateUtils.disableProceed();
      }
    }

    if (
      clientProfileData.isCorporate() != false &&
      CorporateUtils.selectedCountry &&
      (window.location.hash === "#/shipping" ||
        window.location.hash === "#/payment")
    ) {
      const sdipecVal =
        $("#custom-corporate-pec").val() || $("#custom-corporate-sdi").val();
      const sdipecVisible =
        $("#custom-corporate-pec").is(":visible") ||
        $("#custom-corporate-sdi").is(":visible");
      console.log("sdipecVal", sdipecVal);
      console.log(
        CorporateUtils.selectedPersonType,
        $("#custom-corporate-document").val(),
        sdipecVal,
        CorporateUtils.validateVAT($("#custom-corporate-document"))
      );
      if (
        !CorporateUtils.selectedPersonType ||
        !$("#custom-corporate-document").val() ||
        !CorporateUtils.validateVAT($("#custom-corporate-document"))
      ) {
        window.location.hash = "#/profile";
        sendMessage("Please fill all required fields!", "error");
        alert("Please fill all required fields!");
        return;
      }
      if (sdipecVisible && (!sdipecVal || sdipecVal === "VATNumber")) {
        window.location.hash = "#/profile";
        sendMessage("Please fill all required fields!", "error");
        alert("Please fill all required fields!");
        return;
      }

      const userPersonType = $("#user-person-type").val();
      const corporateName = $("#custom-corporate-name").val();
      const address = $("#custom-corporate-street").val();
      const addressNumber = $("#custom-corporate-number").val();
      const cityAddress = $("#custom-corporate-city").val();
      const stateAddress = $("#custom-corporate-state").val();

      if (
        !userPersonType ||
        !corporateName ||
        !address ||
        !addressNumber ||
        !cityAddress ||
        !stateAddress
      ) {
        window.location.hash = "#/profile";
        sendMessage("Please fill all required fields!", "error");
        alert("Please fill all required fields!");
        return;
      }
    }

    if (
      !$("#custom-corporate-terms").length ||
      (!$("#user-country").length && !CorporateUtils.initializing)
    ) {
      CorporateUtils.init();
      CorporateUtils.initializing = true;
    }
  });

  vtexjs.checkout.getOrderForm().then(function (orderForm) {
    if (orderForm.clientPreferencesData.optinNewsLetter == null) {
      vtexjs.checkout
        .sendAttachment("clientPreferencesData", {
          optinNewsLetter: true,
        })
        .then(function (newOD) {
          vtexjs.checkout.sendAttachment("clientPreferencesData", {
            optinNewsLetter: false,
          });
        });
    }
  });
});

$(document).ready(function () {
  vtexjs.checkout.getOrderForm().then((data) => {
    if (
      data.clientPreferencesData.locale == "en-GB" ||
      data.clientPreferencesData.locale == "en-US" ||
      data.clientPreferencesData.locale == "es-ES" ||
      data.clientPreferencesData.locale == "de-DE"
    ) {
      document.querySelector("body").classList.add(`language-en`);
      $("h5.corporate-title").html(" Request invoice");
      $("#is-corporate-client").html(" Request invoice");
      $("#not-corporate-client").html("Invoice not required");
      //$(".srp-pickup-empty__my-location #find-pickup-link>span").text("Search for an address")
      //$('body.language-en .srp-toggle__delivery').text('Ship')
      //$('body.language-en .srp-toggle__pickup').text('Pickup Up In Store');
      $(".srp-delivery-header .srp-items>strong").text("Ship");
      var ship = $(".srp-delivery-header .srp-items").text();
      ship = ship.replace("articolo a", "item to");
      $(".srp-delivery-header .srp-items").text(ship);
      var upto = $(".srp-shipping-current-single__sla").text();
      upto = upto.replace("Fino a", "Up to");
      upto = upto.replace("giorni lavorativi", "business days");
      $(".srp-shipping-current-single__sla").text(upto);
      $(".srp-pickup-header .srp-items").text("Pick up near");
      $(".srp-unavailable .srp-text").text(
        "Shipping not available for your location."
      );
      $(".ship-postalCode label").text("Postal Code");
      $(" #cart-shipping-calculate").text("Calculate");
      $("span.help.error").text("This field is required.");
      $("span.help.error.postal-code").text(
        "The postcode must be at least 3 digits long"
      );
      $(".srp-description").text(
        "See all shipping options for your products, including shipping rates and prices."
      );
      $("#shipping-calculate-link").text("Calculate");
    } else if (data.clientPreferencesData.locale == "de-CH") {
      document.querySelector("body").classList.add(`language-it`);
      $("span.help.error").text("Questo campo è obbligatorio.");
      $("span.help.error.postal-code").text(
        "Il codice postale deve essere lungo almeno 3 cifre"
      );
      $("h5.corporate-title").html("Richiesta Fattura");
      $("#is-corporate-client").html("Richiesta Fattura");
      $("#not-corporate-client").html("Non richiesta fattura");
    }
  });
  CorporateUtils.disableProceed();

  $("body").on("click", "#edit-profile-data", (e) => {
    setTimeout(() => {
      $(".client-document").hide();
      var checked = $("#custom-corporate-terms").is(":checked");
      if (checked) {
        $("#edit-shipping-data").show();
        $("#open-shipping").show();
        $("#btn-go-to-payment").show();
      } else {
        $("#edit-shipping-data").hide();
        $("#open-shipping").hide();
        $("#btn-go-to-payment").hide();
      }
      $("#client-phone").prop("type", "number");
      window.createStateSelectBilling();
      $("#custom-corporate-street").val(localStorage.getItem("street"));
      $("#custom-corporate-number").val(localStorage.getItem("streetNr"));
      $("#custom-corporate-postal-code").val(
        localStorage.getItem("postalCode")
      );
      $("#custom-corporate-city").val(localStorage.getItem("city"));
    }, 100);
  });

  $("body").on("click", "#go-to-shipping", (e) => {
    localStorage.setItem("street", $("#custom-corporate-street").val());
    localStorage.setItem("streetNr", $("#custom-corporate-number").val());
    localStorage.setItem(
      "postalCode",
      $("#custom-corporate-postal-code").val()
    );
    localStorage.setItem("city", $("#custom-corporate-city").val());

    setTimeout(() => {
      window.createStateSelectShipping();

      var address = {
        postalCode: $("#custom-corporate-postal-code").val(),
        city: $("#custom-corporate-city").val(),
        state: $("#state-select-billing").val(),
        country: $("#user-country option:selected").val(),
        street: $("#custom-corporate-street").val(),
        number: "ND",
        neighborhood: "ND",
        complement: "ND",
        reference: "ND",
        geoCoordinates: [],
      };

      invoiceAddress = {
        address,
      };
      vtexjs.checkout.sendAttachment("invoiceData", invoiceAddress);
    }, 500);
  });
  $("body").on("click", "#edit-shipping-data", (e) => {
    setTimeout(() => {
      window.createStateSelectShipping();
      var checked = $("#custom-corporate-terms").is(":checked");
      if (checked) {
        $("#edit-shipping-data").show();
        $("#open-shipping").show();
        $("#btn-go-to-payment").show();
      } else {
        $("#edit-shipping-data").hide();
        $("#open-shipping").hide();
        $("#btn-go-to-payment").hide();
      }
    }, 500);
  });
  $("body").on("click", "#force-shipping-fields", (e) => {
    setTimeout(() => {
      const element = document.getElementById("ship-state");
      const event = new Event("input", { bubbles: true });
      const previousValue = element.value;

      element.value = "ND";
      element._valueTracker.setValue(previousValue);
      element.dispatchEvent(event);
      window.createStateSelectShipping();
    }, 500);
  });
  $("body").on("click", "#btn-go-to-payment", (e) => {
    setTimeout(() => {
      switch (vtexjs.checkout.orderForm.clientPreferencesData.locale) {
        case "de-CH":
          $(".payment-group-item-text").html("Kreditkarte");

          break;
        case "fr-CH":
          $(".payment-group-item-text").html("Carte de crédit");

          break;
        case "it-CH":
          $(".payment-group-item-text").html("Carta di credito");
      }
    }, 500);
  });
  $("body").on("click", "#shp-shipping-calculate", (e) => {
    setTimeout(() => {
      window.createStateSelectShipping();
    }, 1500);
  });
  $("body");

  $("body").on("click", "#cart-to-orderform", (e) => {
    setTimeout(() => {
      window.createStateSelectShipping();
      window.createStateSelectBilling();
    }, 1500);
  });
  $("body").on("click", "#logo-header", (e) => {
    setTimeout(() => {
      window.location.href = window.location.href = window.location.origin;
    }, 1500);
  });
  $("body").on("click", "#go-to-cart-button", (e) => {
    setTimeout(() => {
      window.sanitizeCart();
    }, 1500);
  });
  $(".ship-state").hide();
});

window.createStateSelectShipping = () => {
  if ($("#state-select").length == 0) {
    let json = [
      { key: "AG", value: "Aargau" },
      { key: "AR", value: "Ausser-Rhoden" },
      { key: "BL", value: "Ausser-Rhoden" },
      { key: "BS", value: "Basel Stadt" },
      { key: "FR", value: "Fribourg" },
      { key: "BE", value: "Bern" },
      { key: "GE", value: "Geneva" },
      { key: "GL", value: "Glarus" },
      { key: "GR", value: "Graubuenden" },
      { key: "AI", value: "Inner-Rhoden" },
      { key: "JU", value: "Jura" },
      { key: "LU", value: "Lucerne" },
      { key: "NE", value: "Neuchatel" },
      { key: "NW", value: "Nidwalden" },
      { key: "OW", value: "Obwalden" },
      { key: "SH", value: "Schaffhausen" },
      { key: "SZ", value: "Schwyz" },
      { key: "SO", value: "Solothurn" },
      { key: "SG", value: "St. Gallen" },
      { key: "TG", value: "Thurgau" },
      { key: "TI", value: "Ticino" },
      { key: "UR", value: "Uri" },
      { key: "VS", value: "Valais" },
      { key: "VD", value: "Vaud" },
      { key: "ZG", value: "Zug" },
      { key: "ZH", value: "Zurich" },
    ];

    var element = document.getElementById("ship-state");
    if (element) {
      var event = new Event("input", { bubbles: true });
      var previousValue = element.value;

      element.value = json[0].key;
      element._valueTracker.setValue(previousValue);
      element.dispatchEvent(event);

      var select = $('<select id="state-select"></select>');
      $.each(json, function (index, json) {
        select.append(
          $("<option></option>").attr("value", json.key).text(json.value)
        );
      });

      select.on("change", function (e) {
        element = document.getElementById("ship-state");
        event = new Event("input", { bubbles: true });
        previousValue = element.value;

        element.value = e.currentTarget.value;
        element._valueTracker.setValue(previousValue);
        element.dispatchEvent(event);
      });
      $(".ship-state").append(select);
    }
  }
};
window.createStateSelectBilling = () => {
  var stateLabel = "";
  var locale = vtexjs.checkout.orderForm.clientPreferencesData.locale;
  switch (locale) {
    case "de-CH":
      stateLabel = "Staat";
      $($(".corporate-field a")[0]).attr(
        "href",
        `/${locale.split("-")[0]}/Geschaftsbedingungen`
      );
      break;
    case "fr-CH":
      stateLabel = "État";
      $($(".corporate-field a")[0]).attr(
        "href",
        `/${locale.split("-")[0]}/Termes-et-conditions`
      );
      break;
    case "it-CH":
      stateLabel = "Provincia";
      $($(".corporate-field a")[0]).attr(
        "href",
        `/${locale.split("-")[0]}/Termini-e-Condizioni`
      );
  }
  if ($("#state-select-billing").length == 0) {
    let json = [
      { key: "AG", value: "Aargau" },
      { key: "AR", value: "Ausser-Rhoden" },
      { key: "BL", value: "Ausser-Rhoden" },
      { key: "BS", value: "Basel Stadt" },
      { key: "FR", value: "Fribourg" },
      { key: "BE", value: "Bern" },
      { key: "GE", value: "Geneva" },
      { key: "GL", value: "Glarus" },
      { key: "GR", value: "Graubuenden" },
      { key: "AI", value: "Inner-Rhoden" },
      { key: "JU", value: "Jura" },
      { key: "LU", value: "Lucerne" },
      { key: "NE", value: "Neuchatel" },
      { key: "NW", value: "Nidwalden" },
      { key: "OW", value: "Obwalden" },
      { key: "SH", value: "Schaffhausen" },
      { key: "SZ", value: "Schwyz" },
      { key: "SO", value: "Solothurn" },
      { key: "SG", value: "St. Gallen" },
      { key: "TG", value: "Thurgau" },
      { key: "TI", value: "Ticino" },
      { key: "UR", value: "Uri" },
      { key: "VS", value: "Valais" },
      { key: "VD", value: "Vaud" },
      { key: "ZG", value: "Zug" },
      { key: "ZH", value: "Zurich" },
    ];

    var select = $('<select id="state-select-billing"></select>');
    $.each(json, function (index, json) {
      select.append(
        $("<option></option>").attr("value", json.key).text(json.value)
      );
    });

    $(".custom-corporate-city").append(
      `<p class="corporate-field custom-corporate-state"><label>${stateLabel}</label></p>`
    );
    $(".custom-corporate-state").append(select);
  }
  switch (vtexjs.checkout.orderForm.clientPreferencesData.locale) {
    case "de-CH":
      $($(".corporate-field a")[1]).attr(
        "href",
        `${
          vtexjs.checkout.orderForm.salesChannel === "1"
            ? "https://whirlpool.ch/de/datenschutzerklaerung.html"
            : vtexjs.checkout.orderForm.salesChannel === "2"
            ? "https://www.bauknecht.ch/de_CH/Pages/Datenschutzerklaerung"
            : "https://www.indesit.ch/de_CH/Pages/Datenschutzerklaerung"
        }`
      );

      $('#user-country option:contains("Switzerland")').text("Schweiz");
      break;
    case "it-CH":
      $($(".corporate-field a")[1]).attr(
        "href",
        `${
          vtexjs.checkout.orderForm.salesChannel === "1"
            ? "https://whirlpool.ch/it/informativa-sulla-privacy.html"
            : vtexjs.checkout.orderForm.salesChannel === "2"
            ? "https://www.bauknecht.ch/it_CH/Pages/Informativa-sulla-privacy"
            : "https://www.indesit.ch/it_CH/Pages/Informativa-sulla-Privacy"
        }`
      );
      $('#user-country option:contains("Switzerland")').text("Svizzera");
      break;
    case "fr-CH":
      $($(".corporate-field a")[1]).attr(
        "href",
        `${
          vtexjs.checkout.orderForm.salesChannel === "1"
            ? "https://whirlpool.ch/fr/protection-des-donn%C3%A9es.html"
            : vtexjs.checkout.orderForm.salesChannel === "2"
            ? "https://www.bauknecht.ch/fr_CH/Pages/Politique-de-protection-des-donnees-a-caractere-personnel"
            : "https://www.indesit.ch/fr_CH/Pages/Declaration-de-Confidentialite"
        }`
      );
      $('#user-country option:contains("Switzerland")').text("Suisse");
      break;
    default:
  }
};

var waitForEl = function (selector, callback) {
  if ($("td.product-name").length) {
    callback();
  } else {
    setTimeout(function () {
      waitForEl(selector, callback);
    }, 100);
  }
};

waitForEl($("td.product-name"), function () {
  setTimeout(() => {
    window.sanitizeCart();
  }, 5000);
});

window.sanitizeCart = () => {
  var product = vtexjs.checkout.orderForm.items[0];
  var brand =
    vtexjs.checkout.orderForm.salesChannel == "1"
      ? "Whirlpool"
      : vtexjs.checkout.orderForm.salesChannel == "2"
      ? "Bauknecht"
      : "Indesit";

  $("td.product-name a:not(.pull-right)").each((index, el) => {
    $(el).html($(el).html().split("SKU SP")[0]);
  });
  $('.seller span[data-bind="text: sellerName"]').each((index, el) => {
    $(el).html(brand);
  });

  $(".brand-name").html(brand);
  $(".cart").show();
  $(".summary-template-holder").show();
};

$(window).on("ready", function () {
  //var brand = document.location.href.includes("indesit") ? "indesit" : (document.location.href.includes("bauknecht") ? "bauknecht" : "whirlpool");
  var brand;
  vtexjs.checkout.getOrderForm().then((orderForm) => {
    //alert(orderForm.salesChannel);
    switch (orderForm.salesChannel) {
      case "1":
        brand = "whirlpool";

        break;
      case "2":
        brand = "bauknecht";

        break;
      case "3":
        brand = "indesit";

        break;
      default:
        brand = "whirlpool";
    }
    console.log("Theme:", brand);
    const bindingClass = brand + "-theme";

    if (!document.body.classList.contains(bindingClass)) {
      document.body.classList.add(bindingClass);
    }
    var styleTag = document.createElement("link");
    styleTag.rel = "stylesheet";
    styleTag.type = "text/css";
    styleTag.href = "/arquivos/checkout-" + brand + ".css";
    //styleTag.href = "https://d2boikuckiqt95.cloudfront.net/checkout-" + brand + ".css";
    $("#logo-header > img").attr(
      "src",
      "/arquivos/logo-checkout-" + brand + ".png"
    );
    (
      document.getElementsByTagName("head")[0] || document.documentElement
    ).appendChild(styleTag);
  });

  $("body").on("focusout", "#ship-postalCode", function (e) {
    if (localStorage.getItem("lastPostalCode") !== e.currentTarget.value) {
      $("#shp-shipping-calculate").focusout();
      $("#shp-shipping-calculate").click();
      localStorage.setItem("lastPostalCode", e.currentTarget.value);
    }
  });
  setTimeout(() => {
    $("#client-phone").prop("type", "number");
    $("#custom-corporate-street").val(localStorage.getItem("street"));
    $("#custom-corporate-number").val(localStorage.getItem("streetNr"));
    $("#custom-corporate-postal-code").val(localStorage.getItem("postalCode"));
    $("#custom-corporate-city").val(localStorage.getItem("city"));
    switch (vtexjs.checkout.orderForm.clientPreferencesData.locale) {
      case "de-CH":
        $(".checkout-title h2").html("Einkaufswagen");
        $(".payment-group-item-text").html("Kreditkarte");
        $(".checkout-title").show();
        $('#user-country option:contains("Switzerland")').text("Schweiz");
        break;
      case "fr-CH":
        $(".checkout-title h2").html("Panier");
        $(".payment-group-item-text").html("Carte de crédit");
        $(".checkout-title").show();
        $('#user-country option:contains("Switzerland")').text("Suisse");
        break;
      case "it-CH":
        $(".checkout-title h2").html("Carrello");
        $(".payment-group-item-text").html("Carta di credito");
        $(".checkout-title").show();
        $('#user-country option:contains("Switzerland")').text("Svizzera");
    }
  }, 500);
});
//-----------------------------------------------
//--------- VALIDATE POSTAL CODE
function validatePostalCode(postalCode, lang) {
  var errorMessage;
  switch (lang) {
    case "IT":
      errorMessage = "Il codice postale deve essere lungo almeno 4 cifre";
      break;
    case "DE":
      errorMessage = "Die Postleitzahl muss mindestens 4 Ziffern lang sein";
      break;
    case "FR":
      errorMessage = "Le code postal doit comporter au moins 4 chiffres";
      break;
    default:
      errorMessage = "Die Postleitzahl muss mindestens 4 Ziffern lang sein";
      break;
  }
  if (postalCode.length < 4) {
    $("#custom-corporate-postal-code").removeClass("success");
    $("#custom-corporate-postal-code").addClass("error");
    $("#custom-corporate-postal-code").css("border-color", "#ff4c4c");
    $(".custom-corporate-postal-code").append(
      "<span class='help error postal-code'>" + errorMessage + "</span>"
    );
    CorporateUtils.disableProceed();
  } else {
    $("#custom-corporate-postal-code").removeClass("error");
    $(".help.error.postal-code").remove();
    $("#custom-corporate-postal-code").addClass("success");
    $("#custom-corporate-postal-code").css("border-color", "#cbcbcb");
    var checked = $("#custom-corporate-terms").is(":checked");
    if (checked) {
      CorporateUtils.enableProceed();
    }
  }
}
//--------------------------------------------------
//------- VALIDATE CITY
function validateCity(city, lang) {
  var isValid = !/\d/.test(city);
  var errorMessage;
  switch (lang) {
    case "IT":
      errorMessage = "Il campo Città deve essere alfabetico";
      break;
    case "DE":
      errorMessage = "Das Feld Stadt muss alphabetisch sein";
      break;
    case "FR":
      errorMessage = "Le champ Ville doit être alphabétique";
      break;
    default:
      errorMessage = "Das Feld Stadt muss alphabetisch sein";
      break;
  }
  if (!isValid) {
    $("#custom-corporate-city").removeClass("success");
    $("#custom-corporate-city").addClass("error");
    $("#custom-corporate-city").css("border-color", "#ff4c4c");
    $("<span class='help error city'>" + errorMessage + "</span>").insertBefore(
      ".custom-corporate-state"
    );
    $(".custom-corporate-state").css("margin-top","15px")
    CorporateUtils.disableProceed();
  } else {
    $("#custom-corporate-city").removeClass("error");
    $(".help.error.city").remove();
    $("#custom-corporate-city").addClass("success");
    $("#custom-corporate-city").css("border-color", "#cbcbcb");
    $(".custom-corporate-state").css("margin-top","5px")
    var checked = $("#custom-corporate-terms").is(":checked");
    if (checked) {
      CorporateUtils.enableProceed();
    }
  }
}
//-------------------------------------------------------------
//------- VALIDATE SHIP CITY
$(window).on("load hashchange", function () {
  if (window.location.hash === "#/shipping") {
    $("#ship-city").on("keyup", function () {
      validateShipCity($("#ship-city").val());
    });
  }
});
function validateShipCity(city) {
  var lang = vtexjs?.checkout?.orderForm?.clientPreferencesData?.locale;
  var isValid = !/\d/.test(city);
  var errorMessage;
  switch (lang) {
    case "it-CH":
      errorMessage = "Il campo Città deve essere alfabetico";
      break;
    case "de-CH":
      errorMessage = "Das Feld Stadt muss alphabetisch sein";
      break;
    case "fr-CH":
      errorMessage = "Le champ Ville doit être alphabétique";
      break;
    default:
      errorMessage = "Das Feld Stadt muss alphabetisch sein";
      break;
  }
  if (!isValid) {
    $("#ship-city").removeClass("success");
    $("#ship-city").addClass("error");
    $("#ship-city").css("border-color", "#ff4c4c");
    if ($(".help.error.ship-city").length === 0) {
      $(
        "<span class='help error ship-city'>" + errorMessage + "</span>"
      ).insertBefore(".ship-state");
      $(".help.error.ship-city").css("padding-bottom","0.5rem")
    }
    $("#btn-go-to-payment").attr("disabled", true);
  } else {
    $("#ship-city").removeClass("error");
    $(".help.error.ship-city").remove();
    $("#ship-city").addClass("success");
    $("#ship-city").css("border-color", "#cbcbcb");
    $("#btn-go-to-payment").attr("disabled", false);
  }
}
//-------------------------------------------------------------
