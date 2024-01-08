import React, { useEffect, useState } from "react";

import { Wrapper } from "bauknechtde.add-to-cart-custom";
import ProductSummaryQuantity from "vtex.product-quantity/ProductSummaryQuantity";
import { useLazyQuery } from "react-apollo";
import { usePixel } from "vtex.pixel-manager";
import ProductContextProvider from "vtex.product-context/ProductContextProvider";
import { AddProductBtn } from "vtex.wish-list";


//import { BackInStockStandalone } from "bauknechtde.back-in-stock-standalone"
import { AvailabilitySubscriber} from "bauknechtde.availability-subscriber-custom"
import { ViewSubstituteButton } from "bauknechtde.view-substitute-button"
import styles from "./style";
import products from "../graphql/products.graphql";
interface CustomProductListProps {
  ids: any;
  queryField: string;
  onProductsChange: any;
  references: any;
  onNotFound: any;
  reset: boolean;
  inStockLabel: string;
  outOfStockLabel: string;
  limitedLabel: string;
  obsoleteLabel: string;
  limitedIcon: string;
  outOfStockIcon: string;
  obsoleteIcon: string;
  inStockIcon: string;
  colorCodeObsolete: string;
  colorCodeLimited: string;
  colorCodeOutOfStock: string;
  fromDraw: boolean;
}

const CustomProductList: StorefrontFunctionComponent<CustomProductListProps> = ({
  ids,
  queryField,
  onProductsChange,
  references,
  onNotFound,
  reset,
  fromDraw,
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
      setProducts([]);
    }
  }, [reset]);

  useEffect(() => {
    if (data && data.productsByIdentifier) {
      setProducts(r_products.concat(data.productsByIdentifier));
      if (onProductsChange) {
        onProductsChange({
          products: data.productsByIdentifier,
        });
      }

      let impressions = r_products
        .concat(data.productsByIdentifier)
        .map((product: any, index) => {
          return {
            position: index + 1,
            //@ts-ignore
            product: {
              ...product,
              sku: { ...product.items[0], seller: product.items[0].sellers[0] },
            },
          };
        });
      push({
        event: "productImpression",
        impressions,
        forceList: fromDraw ? "bom_modal_list" : "bom_listing_list",
      });
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
          <div className={styles.custom_card_wrapper}>
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
            <a
              href={"/" + product.linkText + "/" + "p"}
              onClick={(e) => {
                e.preventDefault();
                let href = e.currentTarget.href;
                push({
                  event: "productClick",
                  position: index + 1,
                  product: { ...product, sku: product.items[0] },
                  forceList: fromDraw ? "bom_modal_list" : "bom_listing_list",
                });
                setTimeout(() => {
                  window.location.href = encodeURI(href);
                }, 1000);
              }}
            >
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
                <div className={styles.custom_card_wrapper_bottom}>
                  <ProductContextProvider
                    query={{ skuId: product.items[0].itemId }}
                    product={product}
                    children={
                      <div className={styles.custom_card_wrap}>
                        <div className={styles.custom_card_wish_list}>
                          <AddProductBtn />
                        </div>
                        <div className={styles.custom_card_quantity_and_status}>
                          <ProductSummaryQuantity
                            selectorType="dropdown"
                            showLabel={false}
                          />
                          <div className={styles.custom_card_status}>
                            {product.properties.filter(
                              (pr: any) => pr.name == "status"
                            )[0].values[0] === "obsolete" && (
                              <div
                                className={[
                                  styles.custom_card_status_item,
                                  styles.custom_card_status_item_obsolete,
                                ].join(" ")}
                              >
                                Nicht verfügbar
                              </div>
                            )}
                            {product.properties.filter(
                              (pr: any) => pr.name == "status"
                            )[0].values[0] === "out of stock" && (
                              <div
                                className={[
                                  styles.custom_card_status_item,
                                  styles.custom_card_status_item_oos,
                                ].join(" ")}
                              >
                                Zurzeit nicht im Shop verfügbar
                              </div>
                            )}
                            {product.properties.filter(
                              (pr: any) => pr.name == "status"
                            )[0].values[0] === "in stock" && (
                              <div
                                className={[
                                  styles.custom_card_status_item,
                                  styles.custom_card_status_item_in_stock,
                                ].join(" ")}
                              >
                                Auf Lager: Lieferzeit 4-6 Werktage
                              </div>
                            )}
                            {product.properties.filter(
                              (pr: any) => pr.name == "status"
                            )[0].values[0] === "limited availability" && (
                              <div
                                className={[
                                  styles.custom_card_status_item,
                                  styles.custom_card_status_item_limited,
                                ].join(" ")}
                              >
                                Nur noch wenige verfügbar
                              </div>
                            )}
                          </div>
                        </div>

                        {(product.properties.filter(
                          (pr: any) => pr.name == "status"
                        )[0].values[0] === "limited availability" ||
                          product.properties.filter(
                            (pr: any) => pr.name == "status"
                          )[0].values[0] === "in stock") && (
                          <div
                            className={styles.custom_card_price_and_add_to_cart}
                          >
                            <Wrapper
                              addToCartFeedback="customEvent"
                              customPixelEventId="add-to-cart-button"
                              text="Warenkorb"
                            />
                            <div className={styles.custom_card_wrapper_price}>
                              {product.priceRange.sellingPrice.highPrice.toLocaleString(
                                "de-DE",
                                { currency: "EUR", style: "currency" }
                              )}
                              <span className={styles.custom_card_price_iva}>
                                Inkl. MwSt. und Versand
                              </span>
                            </div>
                          </div>
                        )}

                        {product.properties.filter(
                          (pr: any) => pr.name == "status"
                        )[0].values[0] === "obsolete" && (
                          <ViewSubstituteButton isInBomPage={true} />
                        )}
                        {product.properties.filter(
                          (pr: any) => pr.name == "status"
                        )[0].values[0] === "out of stock" && (
                          <>
                            <AvailabilitySubscriber isPlp={true} />
                          </>
                        )}
                      </div>
                    }
                  />
                </div>
              </div>
            </a>
          </div>
        );
      })}
    </div>
  );
};
CustomProductList.schema = {};
export default CustomProductList;
