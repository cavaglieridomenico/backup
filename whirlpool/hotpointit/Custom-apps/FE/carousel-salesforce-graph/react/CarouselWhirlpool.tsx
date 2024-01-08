import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-apollo";
import type { ComponentType, PropsWithChildren } from "react";
import { usePixel } from "vtex.pixel-manager";
import { ProductListContext } from "vtex.product-list-context";
import { useListContext, ListContextProvider } from "vtex.list-context";
import { ExtensionPoint, useTreePath } from "vtex.render-runtime";
import { mapCatalogProductToProductSummary } from "./Utils";
// import relatedProducts from './relatedProd'
import style from "./style.css";
import products from "../graphql/products.graphql";
import { useProductImpression } from "vtex.product-list-context";

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
  ProductSummary: ComponentType<{ product: any }>;
  listName?: string;
  pageType: "Pdp_it" | "Search_it" | "Thankyou_it" | "Home_it" | "Cart_it";
}>;
function CarouselWhirlpool({
  children,
  listName,
  ProductSummary,
  pageType = "Pdp_it",
}: Props) {
  // Fetch
  const [response, setResponse] = useState([]);

  const getProducts = async () => {
    const options = {
      method: "GET",
    };
    return await fetch(
      `/app/sfmc/recommendations?page=${pageType}&host=www.hotpoint.it`,
      options
    )
      .then((response) => response.json())
      .then((result) => setResponse(result))
      .catch((err) => console.error(err));
  };

  const { push } = usePixel();
  const { ProductListProvider } = ProductListContext;
  let initialize: any[] = [];
  const [list, setList] = useState(initialize);
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
  const productList = (ids: any) => {
    const { loading, error, data } = useQuery(products, {
      variables: {
        field: "sku",
        values: ids,
      },
    });

    if (loading)
      return (
        <div className={style.container}>
          <div className={style.loaderSalesForce}></div>
        </div>
      );
    if (error) return <div>Error! ${error.message}`</div>;
    return (
      <ProductListProvider listName={listName ?? ""}>
        <List
          products={createProperties(data.productsByIdentifier)}
          ProductSummary={ProductSummary}
          actionOnProductClick={productClick}
        >
          {children}
        </List>
        <ProductImpressions />
      </ProductListProvider>
    );
  };
  const createProperties = (data: any[]) => {
    let newData: any[] = [];
    data.forEach((datum: any) => {
      let allSpec = datum.specificationGroups.filter(
        (spec: any) => spec.name == "allSpecifications"
      )[0].specifications;
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

  useEffect(() => {
    getProducts();
  }, []);
  useEffect(() => {
    setList(response);
  }, [response, list]);

  return productList(list);
}

CarouselWhirlpool.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {
    pageType: {
      title: "Page Type",
      description:
        "Set the page type where the carousel is placed (for example Pdp_it if it is in PDP and in Italy country)",
      type: "string",
      enum: ["Pdp_it", "Search_it", "Thankyou_it", "Home_it", "Cart_it"],
    },
  },
};

export default CarouselWhirlpool;