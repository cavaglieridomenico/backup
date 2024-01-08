import type { ComponentType, PropsWithChildren } from "react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLazyQuery } from "react-apollo";
import { ListContextProvider, useListContext } from "vtex.list-context";
import { usePixel } from "vtex.pixel-manager";
import { ProductListContext } from "vtex.product-list-context";
import { ExtensionPoint, useTreePath } from "vtex.render-runtime";
import { mapCatalogProductToProductSummary } from "./Utils";
// import relatedProducts from './relatedProd'
import { FormattedMessage } from "react-intl";
import { useProductImpression } from "vtex.product-list-context";
import products from "../graphql/products.graphql";
import style from "./style.css";

type PropsList = PropsWithChildren<{
  /** Array of products. */
  products?: any[];
  /** Slot of product summary. */
  ProductSummary: ComponentType<{ product: any }>;
  /** Name of the list property on Google Analytics events. */
  listName?: string;
  /** Callback on product click. */
  actionOnProductClick?: (product: any) => void;
}>;

function ProductImpressions() {
  useProductImpression();
  return null;
}

function List({
  children,
  products,
  ProductSummary,
  actionOnProductClick,
}: PropsList) {
  const { list } = useListContext();
  const { treePath } = useTreePath();
  const newListContextValue = useMemo(() => {
    const componentList = products?.map((product: any) => {
      const normalizedProduct = mapCatalogProductToProductSummary(product);
      if (typeof ProductSummary === "function") {
        return (
          <ProductSummary
            key={normalizedProduct.cacheId}
            product={normalizedProduct}
          />
        );
      }

      const handleOnClick = () => {
        if (typeof actionOnProductClick === "function") {
          actionOnProductClick(normalizedProduct);
        }
      };
      return (
        <ExtensionPoint
          id="product-summary"
          key={normalizedProduct.cacheId}
          treePath={treePath}
          product={normalizedProduct}
          actionOnClick={handleOnClick}
        />
      );
    });

    return list.concat(componentList ?? []);
  }, [products, list, ProductSummary, treePath, actionOnProductClick]);

  return (
    <ListContextProvider list={newListContextValue}>
      {children}
    </ListContextProvider>
  );
}

type Props = PropsWithChildren<{
  title: string;
  ProductSummary: ComponentType<{ product: any }>;
  listName?: string;
  pageType: "Pdp" | "Search" | "Thankyou" | "Home" | "Cart";
}>;
function CarouselWhirlpool({
  children,
  listName,
  ProductSummary,
  pageType = "Pdp",
}: Props) {
  // Fetch
  const [response, setResponse] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const options = {
        method: "GET",
      };
      const fetchedData = await fetch(
        "/app/sfmc/recommendations?pagetype=" + pageType + "&host=www.hotpoint.co.uk",
        options
      );
      const response = await fetchedData.json();
      setResponse(response);
    };

    getProducts().catch((err) => console.error(err));
  }, [])

  const { push } = usePixel();
  const { ProductListProvider } = ProductListContext;
  // let initialize: any[] = [];
  // const [list, setList] = useState(initialize);
  const productClick = useCallback(
    (product: any) => {
      push({
        event: "productClick",
        list: listName ? listName : "List of products",
        product,
      });
    },
    [push, listName]
  );

  const [getProductList, { loading, error, data }] = useLazyQuery(products);

  useEffect(() => {
    if (response.length) {
      console.log("response: " + response)
      getProductList({
        variables: {
          field: "id",
          values: response,
        }
      })
    }
  }, [response])

  const createProperties = (data: any[]) => {
    let newData: any[] = [];
    data?.forEach((datum: any) => {
      let allSpec = datum.specificationGroups.filter(
        (spec: any) => spec.name == "allSpecifications"
      )[0].specifications;
      let sellable = allSpec.find((spec: any) => spec.name === "sellable");
      if (sellable?.values?.[0] !== "true") return;
      let categoriesTree = getCategoriesFromTree(datum.categoryTree);
      newData.push({
        ...datum,
        properties: allSpec,
        categories: categoriesTree,
      });
    });
    return newData;
  };

  const getCategoriesFromTree = (categories: any[]) => {
    let newCategories: any[] = [];
    for (let i = 0; i < categories.length; i++) {
      let acc = "/" + categories[0].name + "/";
      for (let j = 1; j < categories.length - i; j++) {
        acc += categories[j].name + "/";
      }
      newCategories.push(acc);
    }
    return newCategories;
  };

  const productProperties = createProperties(data?.productsByIdentifier);

  if (loading && !error)
    return (
      <div className={style.container}>
        <div className={style.loaderSalesForce}></div>
      </div>
    );
  if (error) {
    return (
      <>{console.log("error: " + error)}</>
    )
  }

  return (
    <div>
      {response?.length && data?.productsByIdentifier && productProperties?.length > 0 && (
        <>
          <div className={`${style.title} c-muted-1`}>
            <FormattedMessage id="editor.carouselWhirlpool.carouselTitle" />
          </div>
          <ProductListProvider listName={listName ?? ""}>
            <List
              products={productProperties && productProperties}
              ProductSummary={ProductSummary}
              actionOnProductClick={productClick}
            >
              {children}
            </List>
            <ProductImpressions />
          </ProductListProvider>
        </>
      )}
    </div>
  );
};

// useEffect(() => {
//   getProducts();
// }, []);
// useEffect(() => {
//   setList(response);
// }, [response, list]);

// return response.length ? productList(list) : <>{console.log("list: " +  list)}</>

CarouselWhirlpool.schema = {
  title: "editor.carouselWhirlpool.title",
  description: "editor.carouselWhirlpool.description",
  type: "object",
  properties: {},
};

export default CarouselWhirlpool;
