import React, { useState, useEffect } from "react";
import SliderGlide from "./SliderGlide";
import { graphql } from "react-apollo";

import ProductCardCarousel from "./ProductCardCarousel";
import productsQuery from "./queries/productsQuery.gql";
import { useScrollListener } from "./hooks/scrollListener";

const carouselOptions = {
  animationDuration: 800,
  type: "carousel",
  peek: {
    before: 540,
    after: 540,
  },
  perView: 1,
  startAt: 0,
  focusAt: "center",
  breakpoints: {
    1840: {
      perView: 1,
      peek: {
        before: 420,
        after: 420,
      },
    },
    1640: {
      perView: 1,
      peek: {
        before: 390,
        after: 390,
      },
    },
    1440: {
      perView: 1,
      gap: -38,
      peek: {
        before: 390,
        after: 390,
      },
    },
    1366: {
      perView: 1,
      peek: {
        before: 330,
        after: 330,
      }
    },
    1024: {
      perView: 1,
      gap: 70,
      peek: {
        before: 300,
        after: 300,
      },
    },
    768: {
      perView: 1,
      gap: 60,
      peek: {
        before: 215,
        after: 215,
      },
    },
    414: {
      perView: 1,
      gap: 18,
      peek: {
        before: 58,
        after: 58,
      },
    },
    375: {
      perView: 1,
      gap: 15,
      peek: {
        before: 44,
        after: 44,
      },
    },
    360: {
      perView: 1,
      gap: 15,
      peek: {
        before: 40,
        after: 40,
      },
    },
    320: {
      perView: 1,
      gap: 10,
      peek: {
        before: 22,
        after: 22,
      },
    },
  },
};

function ProductCarouselLandingPageNew({
  data,
  isBottomCarousel,
  collectionID,
}) {
  const { loading, error, products } = data || {};
  const [productDetails, setProductDetails] = useState([]);
  let impressionApp = [];

  function getCategoryFromIdProduct(productId) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    return fetch(
      "/_v/wrapper/api/product/" + productId + "/category",
      options
    ).then((response) => {
      return response.json();
    });
  }

  function getStringCategoryFromId(idCategory) {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    return fetch("/_v/wrapper/api/catalog/category/" + idCategory, options).then(
      (response) => {
        return response.json();
      }
    );
  }

  useEffect(() => {
    if (products) {
      const productDetailsCardArray = [];

      products.forEach((prod, index) => {
        if (prod && prod.properties) {
          const imageEnergyClass = prod.properties.find(
            (prop) => prop.name === "EnergyLogo_image"
          );

          const altImage = prod.properties.find(
            (prop) =>
              prop.name === "Energy efficiency class" ||
              prop.name === "Energy Class"
          );

          const energyLabelPdf = prod.properties.find(
            (prop) =>
              prop.name === "energy-label" || prop.name === "new-energy-label"
          );
          const obj = {
            altImage: altImage ? altImage.values[0] : "",
            name: prod.productName,
            imageEnergyClass: imageEnergyClass
              ? imageEnergyClass.values[0]
              : "",
            fCode: prod.items[0].name,
            productImage: prod.items[0].images[0]
              ? prod.items[0].images[0].imageUrl
              : "",
            productImageAlt: prod.items[0].images[0]
              ? prod.items[0].images[0].imageLabel
              : "",
            energyLabelPdf: energyLabelPdf ? energyLabelPdf.values[0] : "",
            linkToPDP: prod.link,
            category: prod.categories[0].split("/")[2],
          };

          productDetailsCardArray.push(obj);

          function getVariant(properties){
            let variant1 = properties.find((el) => el.name.toLowerCase().replace(":","") === "colour")?.values[0];
            if(variant1!="") return variant1;
            let variant2 = properties.find((el) => el.name.toLowerCase().replace(":","") === "color")?.values[0];
            return variant2;
          }
          const variant = prod && prod.properties ? getVariant(prod.properties) : "";

          function costructionType(cType) {
            if (cType.indexOf("Free ") !== -1) {
              let cTypeArray = cType.split(" ");
              return cTypeArray[0] + cTypeArray[1].toLowerCase();
            } else {
              return cType.replace(" ", "-");
            }
          }

          function getDimension(prod) {
            const result = prod.properties.filter(
              (obj) => obj.name == "constructionType"
            );
            if (result.length > 0) {
              return costructionType(result[0].values[0]);
            }
            return "";
          }

          getCategoryFromIdProduct(prod.productId).then((response) => {
          getStringCategoryFromId(response.CategoryId).then((res) => {
          impressionApp.push({
            name: obj.name,
            id: obj.fCode,
            price: prod.items[0].sellers[0].commertialOffer.Price,
            brand: prod.brand,
            category: res.AdWordsRemarketingCode,
            variant: variant,
            list: "campaign_page_impression_list",
            position: index + 1,
            dimension4: "Not Sellable Online",
            dimension5: getDimension(prod),
          });
        });
      });

          setProductDetails(productDetailsCardArray);
          if (impressionApp) {
              window.data_carousel_analytics = impressionApp;
          }
        }
      });

      if (
        !window.dataLayer.filter((e) => e.event == "eec.impressionView").length
      ) {

        window.dataLayer.push({
          event: "eec.impressionView",
          ecommerce: {
            currencyCode: "GBP",
            impressions: [impressionApp],
          },
        });
      }
    }
  }, [products]);




  const saveImpression = (index) => {
    let impression = window.data_carousel_analytics[index];
    window.dataLayer.push({
      event: "eec.impressionView",
      ecommerce: {
        currencyCode: "GBP",
        impressions: [impression],
      },
    });
  };

  const productClickAnalytics = (i) => {
    if (products) {
      function costructionType(cType) {
        if (cType.indexOf("Free ") !== -1) {
          let cTypeArray = cType.split(" ");
          return cTypeArray[0] + cTypeArray[1].toLowerCase();
        } else {
          return cType.replace(" ", "-");
        }
      }

      function getDimension(prod) {
        const result = prod.properties.filter(
          (obj) => obj.name == "constructionType"
        );
        if (result.length > 0) {
          return costructionType(result[0].values[0]);
        }
        return "";
      }


      const variant = products[i]
        ? products[i].properties.filter((el) => el.name === "Colour")[0]
            .values[0]
        : "";

      if (
        products &&
        products[i]
      ) {
        getCategoryFromIdProduct(prod.productId).then((response) => {
        getStringCategoryFromId(response.CategoryId).then((res) => {
        window.dataLayer.push({
          event: "eec.productClick",
          ecommerce: {
            currencyCode: "GBP",
            click: {
              actionField: {
                list: "campaign_page_impression_list",
              },
              products: [
                {
                  name: products[i].productName,
                  id: products[i].items[0].name,
                  price: products[i].items[0].sellers[0].commertialOffer.Price,
                  brand: products[i].brand,
                  category: res.AdWordsRemarketingCode,
                  variant: variant,
                  position: i + 1,
                  dimension4: "Not Sellable Online",
                  dimension5: getDimension(products[i]),
                },
              ],
            },
          },
        });
        });
        });
      }
    }
  };

  if (loading) {
    return null;
  }

  if (error) {
    return null;
  }

  if (productDetails && productDetails.length > 0) {
    return (
      <>
        <style>
          {
            "\
            .glide__slides{\
              display:flex\
            }\
            .your_cutom_classname{\
              list-style-type:none!important;\
              display:flex;\
              justify-content:center;\
            }\
            .single-bullet{\
              cursor:pointer;\
              margin-right: 11px;\
              border-radius: 999px;\
              width: 8px;\
              height: 8px;\
              border: none;\
              background:#0090D0;\
              padding: 0px;\
            }\
            .single-bullet.glide__bullet--active{\
              background: #005C92;\
              border-radius: 13px;\
              border: none;\
              width: 21px;\
              height: 8px;\
            }\
            \
            \ --- Begin Active Slide --- \
            \
            .glide__slide--active {\
              display:flex;\
              justify-content:center;\
            }\
            .glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container {\
              padding: 20px;\
              border-radius: 40px;\
            }\
            .glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__imageContainer {\
              padding: 32px !important;\
              border-radius: 24px;\
            }\
            .glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__buttonEnergyClassContainer {\
              margin: 20px 0 0;\
            }\
            .glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__productCodeLabel {\
              font-size: 14px;\
            }\
            \
            \ --- End Active Slide --- \
            \
            .glide__slide.your_cutom_classname{\
              height: 250px;\
            }\
            .glide__slide.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container{\
              height: 250px;\
              width: 543px !important;\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__imageContainer{\
              height: 210px;\
              width: 210px;\
              border: 0;\
              padding: 18px;\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
              margin-left:40px;\
              height:100%;\
              display:flex;\
              flex-direction:column;\
              justify-content: space-between;\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer{\
              width: 247px;\
              line-height: 16px;\
              margin: 40px 0 0 0;\
              color: #005c92;\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer .indesituk-custom-apps-0-x-productCardCarousel__textStyle{\
              font-family: 'Roboto';\
              font-style: normal;\
              font-weight: 300;\
              font-size: 22px;\
              line-height: 30px;\
              color: #005C92;\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
              display:flex;\
              justify-content:flex-end;\
                margin: 0 4px 4px 0;\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreText{\
              font-size:12px;\
              white-space:nowrap;\
            }\
            .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
              width: 28px;\
              height: 28px;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active{\
              height: 280px;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container{\
              height: 280px;\
              width: 604px !important;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__imageContainer{\
              height: 240px;\
              width: 240px;\
              border: 0;\
              padding: 18px;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
              margin-left:44px;\
              height:100%;\
              display:flex;\
              flex-grow: 1;\
              flex-direction:column;\
              justify-content: space-between;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer{\
              width: 260px;\
              line-height: 18px;\
              margin: 30px 0 0;\
              color: #005c92;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer .indesituk-custom-apps-0-x-productCardCarousel__textStyle{\
              font-family: 'Roboto';\
              font-style: normal;\
              font-size: 24px!important;\
              line-height: 32px;\
              color: #005c92;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreText{\
              font-size:14px;\
              white-space:nowrap;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
              width: 32px;\
              height: 32px;\
            }\
            @media(max-width:1024px){\
              .glide__slide--active{\
                display:flex;\
                justify-content:center;\
              }\
              .glide__slide.your_cutom_classname{\
                height: 130px;\
              }\
              .glide__slide.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container{\
                height: 130px;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__imageContainer{\
                height: 114px;\
                width: 104px;\
                border: 0;\
                padding: 18px;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
                margin-left:12px;\
                height:100%;\
                justify-content: space-between;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer{\
                width: 134px;\
                line-height: 16px;\
                margin: 12px 0 0 0;\
                color: #43525A;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer .indesituk-custom-apps-0-x-productCardCarousel__textStyle{\
                font-family: 'Roboto-Light';\
                font-style: normal;\
                font-size: 12px!important;\
                line-height: 16px;\
                color: #005c92;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
                display:flex;\
                justify-content:flex-end;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreText{\
                font-size:12px;\
                white-space:nowrap;\
              }\
              .glide__slide.slider.your_cutom_classname .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
                width: 28px;\
                height: 28px;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active{\
                width: 305px !important;\
                height: 150px;\
              }\
              .glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container{\
              padding: 10px;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container{\
                width: 305px !important;\
                height: 150px;\
                border-radius: 28px;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__imageContainer{\
                height: 134px;\
                width: 124px;\
                border: 0;\
                padding: 18px !important;\
                border-radius: 20px;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
                margin-left:20px;\
                height:100%;\
                justify-content: space-between;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer{\
                width: 138px;\
                line-height: 18px;\
                padding:0px;\
                margin: 0 0 0 0!important;\
                color: #005c92;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__textContainer .indesituk-custom-apps-0-x-productCardCarousel__textStyle{\
                font-family: 'Roboto-Light';\
                font-style: normal;\
                font-size: 14px!important;\
                line-height: 18px;\
                color: #005c92;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreText{\
                font-size:14px;\
                white-space:nowrap;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesituk-custom-apps-0-x-productCardCarousel__container .indesituk-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesituk-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
                width: 32px;\
                height: 32px;\
              }\
            }\
            "
          }
        </style>

        {productDetails && (
          <SliderGlide options={carouselOptions}>
            {productDetails.map((prod, i) => {
             return (
              <>
                <InnerCard
                  key={'carousel' + i}
                  i={i} prod={prod} isBottomCarousel={isBottomCarousel}
                  productClickAnalytics={productClickAnalytics} eventAnaliticts={saveImpression}
                />
              </>
              );
            })}
          </SliderGlide>
        )}
      </>
    );
  } else return <></>;
}

function ComponentWrapper({ collectionID = "", isBottomCarousel }) {
  const [filterData, setFilterData] = useState(collectionID);

  useEffect(() => {
    setFilterData(collectionID);
  }, [collectionID]);

  const EnhancedShelf = graphql(productsQuery, {
    options: () => ({
      ssr: true,
      variables: {
        collection: filterData.toString(),
        from: 0,
        to: 99,
      },
    }),
  })(ProductCarouselLandingPageNew);

  EnhancedShelf.schema = {
    title: "admin/editor.shelf.title",
  };

  return (
    <EnhancedShelf
      isBottomCarousel={isBottomCarousel}
      collectionID={filterData}
    />
  );
}

function InnerCard({i,prod,isBottomCarousel,productClickAnalytics,eventAnaliticts}){

  useScrollListener('carousel_' + i +'_'+ prod.fCode,'glide__slide--active',(id)=>{
    const idReal=id.split('_')[1];
    eventAnaliticts(idReal,id);
  });

  return (
    <div id={'carousel_' + i +'_'+ prod.fCode} className="glide__slide your_cutom_classname slider">
        <ProductCardCarousel
          productImage={prod.productImage}
          energyClassImage={prod.imageEnergyClass}
          linkEnergyLabel={prod.energyLabelPdf}
          productCode={prod.fCode}
          productName={prod.name}
          linkToPDP={`${
            window.location.protocol
          }//${window.location.host.concat(prod.linkToPDP)}`}
          isBottomCarousel={isBottomCarousel}
          category={prod.category}
          onClickDiscoverMore={() => {
            productClickAnalytics(i);
          }}
        />
      </div>
  )
}

export default ComponentWrapper;
