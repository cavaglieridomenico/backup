import React, { useState, useEffect } from "react";
import { graphql } from "react-apollo";
import SliderGlide from "./SliderGlide";

import ProductCardCarousel from "./ProductCardCarousel";
import productsQuery from "./queries/productsQuery.gql";
import { useScrollListener } from "./hooks/scrollListener";

const carouselOptions = {
  type: "carousel",
  gap: 64,
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
      peek: {
        before: 390,
        after: 390,
      },
    },
    1300: {
      perView: 1,
      peek: {
        before: 320,
        after: 320,
      },
    },
    1124: {
      perView: 1,
      peek: {
        before: 240,
        after: 240,
      },
    },
    1024: {
      perView: 1,
      gap: 64,
      peek: {
        before: 300,
        after: 300,
      },
    },
    768: {
      perView: 1,
      gap: 32,
      peek: {
        before: 245,
        after: 245,
      },
    },
    414: {
      perView: 1,
      gap: 32,
      peek: {
        before: 58,
        after: 58,
      },
    },
    375: {
      perView: 1,
      gap: 32,
      peek: {
        before: 44,
        after: 44,
      },
    },
    360: {
      perView: 1,
      gap: 32,
      peek: {
        before: 40,
        after: 40,
      },
    },
    320: {
      perView: 1,
      gap: 32,
      peek: {
        before: 22,
        after: 22,
      },
    },
  },
};

function ProductCarouselNew({ data, isBottomCarousel }) {
  const { loading, error, products } = data || {};
  const [productDetails, setProductDetails] = useState([]);

  let impressionApp = [];

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
            name: prod.productName ? prod.productName : "",
            imageEnergyClass: imageEnergyClass
              ? imageEnergyClass.values[0]
              : "",
            fCode: prod.items ? prod.productReference.substr(0, 7) : "",
            productImage: prod.items[0].images[0]
              ? prod.items[0].images[0].imageUrl
              : "",
            productImageAlt: prod.items[0].images[0]
              ? prod.items[0].images[0].imageLabel
              : "",
            energyLabelPdf: energyLabelPdf ? energyLabelPdf.values[0] : "",
            linkToPDP: prod.link ? prod.link : "",
            category: prod.categories[0].split("/")[2]
              ? prod.categories[0].split("/")[2]
              : "",
          };

          productDetailsCardArray.push(obj);

          const variant =
            prod &&
            prod.properties &&
            prod.properties.includes((el) => el.name === "Colore")
              ? prod.properties.find((el) => el.name === "Colore").values[0]
              : "";

          const categoryAnlytics = prod.categories[1].split("/")[2];

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

          impressionApp.push({
            name: obj.name,
            id: obj.fCode,
            price: prod.items[0].sellers[0].commertialOffer.Price,
            brand: prod.brand,
            category: categoryAnlytics,
            variant: variant,
            list: "product_page_up_selling_impression_list",
            position: index + 1,
            dimension4: "Not Sellable Online",
            dimension5: getDimension(prod),
          });
          setProductDetails(productDetailsCardArray);
          if (impressionApp) {
            if (isBottomCarousel) {
              window.data_carousel_analytics = impressionApp;
            } else {
              window.data_carousel_analytics_top = impressionApp;
            }
          }
        }
      });
    }
  }, [products]);

  const saveImpression = (index) => {
    const impression = window.data_carousel_analytics[index];
    const impressionTopCarousel = window.data_carousel_analytics_top[index];
    window.dataLayer.push({
      event: "eec.impressionView",
      ecommerce: {
        currencyCode: "GBP",
        impressions: isBottomCarousel ? [impression] : [impressionTopCarousel],
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

      const categoryAnalytics = products[i].categories[1].split("/")[2];

      const variant = products[i]
        ? products[i].properties.filter((el) => el.name === "Colore")[0]
            .values[0]
        : "";

      if (
        products &&
        products[i] &&
        categoryAnalytics !== "" &&
        categoryAnalytics !== undefined
      ) {
        window.dataLayer.push({
          event: "eec.productClick",
          ecommerce: {
            currencyCode: "GBP",
            click: {
              actionField: {
                list: "product_page_up_selling_impression_list",
              },
              products: [
                {
                  name: products[i].productName,
                  id: products[i].items[0].name,
                  price: products[i].items[0].sellers[0].commertialOffer.Price,
                  brand: products[i].brand,
                  category: categoryAnalytics,
                  variant: variant,
                  position: i + 1,
                  dimension4: "Not Sellable Online",
                  dimension5: getDimension(products[i]),
                },
              ],
            },
          },
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
            .glide__slide{\
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
            .glide__slide.your_cutom_classname{\
              height: 250px;\
            }\
            .glide__slide.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container{\
              height: 250px;\
              width: 543px !important;\
              border-radius: 32px;\
            }\
            .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__imageContainer{\
              height: 210px;\
              width: 210px;\
              border: 0;\
              padding: 18px;\
              border-radius: 20px;\
            }\
            .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__imageContainer .indesititqa-custom-apps-0-x-productCardCarousel__image{\
              width: 155px;\
            }\
            @media screen and (max-width: 1024px) {\
              .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__imageContainer .indesititqa-custom-apps-0-x-productCardCarousel__image{\
                width: 70px;\
              }\
            }\
            .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
              margin-left:40px;\
              height:100%;\
              display:flex;\
              flex-direction:column;\
              justify-content: space-between;\
            }\
            .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__textContainer{\
              width: 247px;\
              line-height: 16px;\
              margin: 24px 0 0 0!important;\
              color: #005c92;\
            }\
            .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__textContainer .indesititqa-custom-apps-0-x-productCardCarousel__textStyle{\
              font-family: 'Roboto-Light';\
              font-style: normal;\
              font-weight: 300;\
              font-size: 22px;\
              line-height: 30px;\
              color: #005C92;\
            }\
            .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
              display:flex;\
              justify-content:flex-end;\
              margin-right: 4px;\
              margin-bottom: 4px;\
            }\
            .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreText{\
              font-size:12px;\
              white-space:nowrap;\
            }\
            .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
              width: 28px;\
              height: 28px;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active{\
              height: 280px;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container{\
              height: 280px;\
              width: 604px !important;\
              border-radius: 40px\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__imageContainer{\
              height: 240px;\
              width: 240px;\
              border: 0;\
              padding: 18px;\
              border-radius: 24px;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__imageContainer .indesititqa-custom-apps-0-x-productCardCarousel__image{\
              width: 175px\
            }\
            @media screen and (max-width: 1024px){\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__imageContainer .indesititqa-custom-apps-0-x-productCardCarousel__image{\
                width: 82px\
              }\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
              margin-left:44px;\
              height:100%;\
              display:flex;\
              flex-direction:column;\
              justify-content: space-between;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__textContainer{\
              width: 260px;\
              line-height: 18px !important;\
              margin: 28px 0 0 0!important;\
              color: #005c92;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__textContainer .indesititqa-custom-apps-0-x-productCardCarousel__textStyle{\
              font-family: 'Roboto-Light';\
              font-style: normal;\
              font-size: 24px!important;\
              line-height: 32px;\
              color: #005c92;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
              margin-bottom: 8px;\
              margin-right: 8px;\
              }\
              @media screen and (max-width: 1024px) {\
                .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
                  margin-bottom: 4px;\
                  margin-right: 4px;\
                  }\
              }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreText{\
              font-size:14px;\
              white-space:nowrap;\
            }\
            .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
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
              .glide__slide.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container{\
                height: 130px;\
                width: 260px !important;\
                border-radius: 24px;\
              }\
              .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__imageContainer{\
                height: 114px;\
                width: 104px;\
                border: 0;\
                padding: 18px;\
                border-radius: 20px;\
              }\
              .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
                margin-left:12px;\
                height:100%;\
                justify-content: space-between;\
              }\
              .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__textContainer{\
                width: 134px;\
                line-height: 16px;\
                margin: 4px 0 0 0!important;\
                color: #005c92;\
              }\
              .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__textContainer .indesititqa-custom-apps-0-x-productCardCarousel__textStyle{\
                font-family: 'Roboto-Light';\
                font-style: normal;\
                font-size: 12px!important;\
                line-height: 16px;\
                color: #005c92;\
              }\
              .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer{\
                display:flex;\
                justify-content:flex-end;\
              }\
              .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreText{\
                font-size:12px;\
                white-space:nowrap;\
              }\
              .glide__slide.slider.your_cutom_classname .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
                width: 28px;\
                height: 28px;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active{\
                height: 150px;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container{\
                height: 150px;\
                width: 305px !important;\
                border-radius: 28px;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__imageContainer{\
                height: 134px;\
                width: 124px;\
                border: 0;\
                padding: 18px;\
                border-radius: 20px;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer{\
                margin-left:20px;\
                height:100%;\
                justify-content: space-between;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__textContainer{\
                width: 138px;\
                line-height: 18px;\
                margin: 12px 0 0 0!important;\
                color: #005c92;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__textContainer .indesititqa-custom-apps-0-x-productCardCarousel__textStyle{\
                font-family: 'Roboto-Light';\
                font-style: normal;\
                font-size: 14px!important;\
                line-height: 18px;\
                color: #005c92;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreText{\
                font-size:14px;\
                white-space:nowrap;\
              }\
              .glide__slide.slider.your_cutom_classname.glide__slide--active .indesititqa-custom-apps-0-x-productCardCarousel__container .indesititqa-custom-apps-0-x-productCardCarousel__textAndCtaContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreContainer .indesititqa-custom-apps-0-x-productCardCarousel__discoverMoreIcon{\
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
                    key={"carousel" + i}
                    i={i}
                    prod={prod}
                    isBottomCarousel={isBottomCarousel}
                    productClickAnalytics={productClickAnalytics}
                    eventAnaliticts={saveImpression}
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

function ComponentWrapper({
  collectionID = "",
  isBottomCarousel,
  customCollectionId,
}) {
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
        orderBy: "OrderByReviewRateDESC",
      },
    }),
  })(ProductCarouselNew);

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

function InnerCard({
  i,
  prod,
  isBottomCarousel,
  productClickAnalytics,
  eventAnaliticts,
}) {
  useScrollListener(
    "carousel_" + i + "_" + prod.fCode,
    "glide__slide--active",
    (id) => {
      const idReal = id.split("_")[1];
      eventAnaliticts(idReal, id);
    }
  );

  return (
    <div
      id={"carousel_" + i + "_" + prod.fCode}
      className="glide__slide slider"
    >
      <ProductCardCarousel
        productImage={prod.productImage}
        energyClassImage={prod.imageEnergyClass}
        linkEnergyLabel={prod.energyLabelPdf}
        productCode={prod.fCode}
        productName={prod.name}
        linkToPDP={`${window.location.protocol}//${window.location.host.concat(
          prod.linkToPDP
        )}`}
        isBottomCarousel={isBottomCarousel}
        category={prod.category}
        onClickDiscoverMore={() => {
          productClickAnalytics(i);
        }}
      />
    </div>
  );
}

export default ComponentWrapper;

/* ComponentWrapper.schema = {
  title: 'Collection id carousel',
  type: 'object',
  properties: {
    customCollectionId:{
      type:"number",
      description:"per la modifica della collection del carosello",
      title:"collection id",
      default:""
    }
  }
} */
