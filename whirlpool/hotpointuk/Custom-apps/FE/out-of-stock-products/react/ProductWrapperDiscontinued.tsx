import PropTypes from "prop-types";
import React, { Fragment, useMemo } from "react";
// import { OrderItemsProvider } from "vtex.order-items/OrderItems";
import { OrderFormProvider as OrderFormProviderCheckout } from "vtex.order-manager/OrderForm";
import { OrderQueueProvider } from "vtex.order-manager/OrderQueue";
import ProductContextProvider from "vtex.product-context/ProductContextProvider";
import useProduct from "vtex.product-context/useProduct";
import { LoadingContextProvider } from "vtex.render-runtime";
import { Product as ProductStructuredData } from "vtex.structured-data";
/* import { Helmet } from "vtex.render-runtime"; */


const isDiscontinued = (product: any) => {
  let isDiscontinued: boolean = product.specificationGroups
    .filter((e: any) => e.name === "allSpecifications")[0]
    .specifications.filter((event: any) => event.name === "isDiscontinued")[0]
    .values[0];
  return isDiscontinued;
};

// const discontinuedTreat = (product: any, isDiscontinued: boolean) => {
//   let newProd = { ...product };
//   if (isDiscontinued) {
//     newProd.items[0].sellers[0].commertialOffer.ListPrice = "";
//     newProd.items[0].sellers[0].commertialOffer.Price = "";
//     newProd.items[0].sellers[0].commertialOffer.spotPrice = "";
//     newProd.items[0].sellers[0].commertialOffer.PriceWithoutDiscount = "";
//   }
//   return newProd;
// };

const Content = ({ children, childrenProps }: any) => {
  const { product, selectedItem } = useProduct();

  //const productNormalized = discontinuedTreat(product, isDiscontinued(product));

  return (
    <>
      {/* <Helmet>
        <title>{product ? product.items[0].complementName : null}</title>
      </Helmet> */}
      {product && selectedItem && !isDiscontinued(product) && (
        <ProductStructuredData
          product={product}
          selectedItem={selectedItem}
        />
      )}
      {React.cloneElement(children, childrenProps)}
    </>
  );
};

const ProductWrapperDiscontinued = ({
  params: { slug, __listName: listName },
  productQuery,
  query,
  CustomContext, //np
  children,
  productContext, //prodotto precedente
  productId, //idPrecedente
  ...props
}: any) => {
  /**
   * ["/prodotti/,/prodotti/lavaggio e asciugatura/, /prodotti/lavaggio e asciugatura/lavatrici/"]
   * @param product
   */
  const createCategories = (product: any) => {
    let categoryTree = product.categoryTree;
    let categories: any[] = [];
    for (let i = 0; i < categoryTree.length; i++) {
      if (i == 0) {
        categories.push("/" + categoryTree[i].slug + "/");
      } else {
        categories.push(categories[i - 1] + categoryTree[i].slug + "/");
      }
    }
    return { ...product, categories };
  };

  const childrenProps = useMemo(
    () => ({
      productQuery,
      slug,
      ...props,
    }),
    [productQuery, slug, props]
  );

  const hasProductData = !!productContext;

  const loadingValue = useMemo(
    () => ({
      isParentLoading: !hasProductData,
    }),
    [hasProductData]
  );

  const CustomContextElement = CustomContext || Fragment;
  return (
    <OrderQueueProvider>
      <OrderFormProviderCheckout>
        {/* <OrderItemsProvider> */}
          <ProductContextProvider
            query={query}
            product={createCategories(productContext)}
          >
            <Content
              listName={listName}
              loading={false}
              childrenProps={childrenProps}
            >
              <LoadingContextProvider value={loadingValue}>
                <CustomContextElement>{children}</CustomContextElement>
              </LoadingContextProvider>
            </Content>
          </ProductContextProvider>
        {/* </OrderItemsProvider> */}
      </OrderFormProviderCheckout>
    </OrderQueueProvider>
  );
};

ProductWrapperDiscontinued.propTypes = {
  params: PropTypes.object,
  productQuery: PropTypes.object,
  children: PropTypes.any,
  /* URL query params */
  query: PropTypes.object,
  CustomContext: PropTypes.any,
  productContext: PropTypes.any,
  productId: PropTypes.any,
};

export default ProductWrapperDiscontinued;
