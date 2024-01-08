import React, { useEffect, useState } from "react";

import { Wrapper } from "hotpointuk.add-to-cart-custom";
import { LeadTime } from "hotpointuk.lead-time";
import ProductSummaryQuantity from "vtex.product-quantity/ProductSummaryQuantity";
import { useLazyQuery } from "react-apollo";
import { usePixel } from "vtex.pixel-manager";
import ProductContextProvider from 'vtex.product-context/ProductContextProvider';

import styles from "./style";
import products from "../graphql/products.graphql";
interface CustomProductListProps {
  ids: any;
  queryField: string;
  onProductsChange: any;
  references: any;
  onNotFound: any;
  reset: boolean;
  inStockLabel: string,
  outOfStockLabel: string,
  limitedLabel: string,
  obsoleteLabel: string,
  limitedIcon: string,
  outOfStockIcon: string,
  obsoleteIcon: string,
  inStockIcon: string,
  colorCodeObsolete: string,
  colorCodeLimited: string,
  colorCodeOutOfStock: string,
  fromDraw: boolean
}

const CustomProductList: StorefrontFunctionComponent<CustomProductListProps> = ({
  ids,
  queryField,
  onProductsChange,
  references,
  onNotFound,
  reset,
  inStockLabel,
  outOfStockLabel,
  limitedLabel,
  obsoleteLabel,
  limitedIcon,
  outOfStockIcon,
  obsoleteIcon,
  inStockIcon,
  colorCodeObsolete,
  colorCodeLimited,
  colorCodeOutOfStock,
  fromDraw


}) => {
  const [r_products, setProducts] = useState([]);
  const [getList, { data, error }] = useLazyQuery(products, {
    fetchPolicy: "no-cache",
  });
  const { push } = usePixel();

  useEffect(() => {
    if (ids && ids.length > 0) {
      getList({
        variables: {
          field: queryField,
          values: ids,
        },
      });
    }
  }, [ids]);
  useEffect(() => {
    if (reset) {
      setProducts([])
    }
  }, [reset]);
  let productContext = {
    assemblyOptions: {
      items: {},
      inputValues: {},
      areGroupsValid: {},
    },
    buyButton: {
      clicked: false,
    },
    skuSelector: {
      selectedImageVariationSKU: null,
      isVisible: false,
      areAllVariationsSelected: true,
    },
    selectedQuantity: 1,
    loadingItem: false,
    addToCartFeedback: "customEvent",
    unavailableText: "Подробнее",
  };

  useEffect(() => {
    if (data && data.productsByIdentifier) {

      setProducts(r_products.concat(data.productsByIdentifier));
      if (onProductsChange) {
        onProductsChange({
          products: data.productsByIdentifier,
        });
      }

      let impressions = r_products.concat(data.productsByIdentifier).map((product, index) => {
        return {
          position: index + 1,
          //@ts-ignore
          "product": { ...product, sku: { ...product.items[0], seller: product.items[0].sellers[0] } }
        }
      })
      push({ event: "productImpression", impressions, forceList: fromDraw ? "hp_uk_bom_modal_list" : "hp_uk_bom_listing_list" });

    }
  }, [data]);

  useEffect(() => {
    if (error) {
      if (onNotFound) {
        onNotFound();
      }
    }
  }, [error]);



  return (
    <div className={styles.custom_products_list_wrapper}>
      {r_products.map((product: any, index) => {
        return (
          <div
            className={styles.custom_card_wrapper}
          >
            {/*<div className={styles.highlights_wrapper}>*/}
            {/*  {product.clusterHighlights.map((highlight: any) => {*/}
            {/*    return (*/}
            {/*      <div*/}
            {/*        className={[*/}
            {/*          styles["highlight_" + highlight.id],*/}
            {/*          styles.highlight,*/}
            {/*        ].join(" ")}*/}
            {/*      >*/}
            {/*        {highlight.name}*/}
            {/*      </div>*/}
            {/*    );*/}
            {/*  })}*/}
            {/*</div>*/}
            <div className={styles.custom_card_wrapper_availability}>
              <LeadTime
                customProduct={{
                  ...productContext,
                  selectedItem: product.items[0],
                  product,
                }}

                inStockLabel={inStockLabel}
                outOfStockLab={outOfStockLabel}
                limitedLabel={limitedLabel}
                obsoleteLabel={obsoleteLabel}
                limitedIcon={limitedIcon}
                outOfStockIcon={outOfStockIcon}
                obsoleteIcon={obsoleteIcon}
                inStockIcon={inStockIcon}
                colorCodeObsolete={colorCodeObsolete}
                colorCodeLimited={colorCodeLimited}
                colorCodeOutOfStock={colorCodeOutOfStock}
                isPlp={true}

              />
            </div>
            <div>
              {references &&
                references.map((reference: any) => {
                  if (reference.id == product.productReference) {
                    return (
                      <div className={styles.reference}>
                        {reference.reference}
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
            </div>
            <a href={"/" + product.linkText + "/" + "p"}
              onClick={(e) => {
                e.preventDefault();
                let href = e.currentTarget.href;
                push({ event: "productClick", position: index + 1, "product": { ...product, sku: product.items[0] },  forceList: fromDraw ? "hp_uk_bom_modal_list" : "hp_uk_bom_listing_list" });
                setTimeout(() => {
                 window.location.href = encodeURI(href);
                }, 1000);
              }}>
              <div className={styles.custom_card_wrapper_image}>
                <img
                  width={189}
                  src={
                    product.items[0].images[0]
                      ? product.items[0].images[0].imageUrl
                      : ""
                  }
                />
              </div>
              <div className={styles.custom_wrapper_name_code_product}>
                <div className={styles.custom_card_wrapper_name}>
                  {product.productName}
                </div>
                <div className={styles.custom_card_wrapper_code_product}>
                  {"Ref:" + product.productReference}
                </div>
              </div>
              <div className={styles.customProductListPriceButtonWrapper}>
                {(product.properties.filter((pr: any) => pr.name == "status")[0] && (product.properties.filter((pr: any) => pr.name == "status")[0].values[0] === "not sellable" || product.properties.filter((pr: any) => pr.name == "status")[0].values[0] === "out of stock" ||
                  product.properties.filter((pr: any) => pr.name == "status")[0].values[0] === "obsolete" || product.items[0].sellers[0]?.commertialOffer?.AvailableQuantity == 0))?

                  <ProductContextProvider

                    query={{ skuId: product.items[0].itemId }}
                    product={product}
                    children={
                      <>
                        <Wrapper

                          addToCartFeedback="customEvent"
                          customPixelEventId="add-to-cart-button"
                        />
                      </>
                    }
                  />


                  :
                  <div className={styles.custom_card_wrapper_bottom}>
                    <div className={styles.custom_card_wrapper_price}>
                      {product.priceRange.sellingPrice.highPrice.toLocaleString(
                        "en-UK",
                        { currency: "GBP", style: "currency" }
                      )}
                    </div>

                    <ProductContextProvider

                      query={{ skuId: product.items[0].itemId }}
                      product={product}
                      children={
                        <>
                          <ProductSummaryQuantity
                            selectorType="dropdown"
                            showLabel={false}
                          />
                          <Wrapper
                            addToCartFeedback="customEvent"
                            customPixelEventId="add-to-cart-button"
                          />
                        </>
                      }
                    />


                  </div>
                }
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
};
CustomProductList.schema = {}
export default CustomProductList;
