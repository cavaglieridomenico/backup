import React, { FC } from "react";
import { FormattedMessage } from "react-intl";
import { useCssHandles } from "vtex.css-handles";
import { Button } from "vtex.styleguide";
import Attachment from "./Attachments";
import BundleInfo from "./BundleItems";
import Product from "./Product";
import { useIntl } from "react-intl";

import { useQuery } from "react-apollo";
import productsQuery from "../../graphql/products.graphql";

interface Props {
  products: OrderItem[];
  dngPayload?: any;
}

const CSS_HANDLES = ["productList", "productListItem", "garanziaContainer", "fgasContainer", "fgasMessage", "supportoMail"];

const ProductList: FC<Props> = ({ products, dngPayload }) => {
  const intl = useIntl();

  const handles = useCssHandles(CSS_HANDLES);
  const isWarranty10Years = (product: any) => {
    let dep = product.categoryTree[0].id;
    return !product.isGift && dep == 2 && !product.titleTag.includes("Accessories");
  };
  // const isFgasItem = (product:any) =>{
  //   let fgasValue = product.specificationGroups.filter((specGroup:any) => specGroup.name == 'allSpecifications')?.[0]?.specifications.filter((spec:any) => spec.name == 'fgas')?.[0]?.values[0]
  //   return fgasValue !== undefined ? fgasValue : false
  // }
  const unifyProductData = (productsGraph: any[], products: OrderItem[]) => {
    let dngItems = dngPayload.items
    let newProds = [] as any[];
    products.forEach((item: OrderItem) => {

      let newBundles: any = []
      let filteredDng = dngItems.find((dng: any) => dng.productId == item.productId)

      item.bundleItems.forEach((bundleItem: any) => {
        let newBundle = bundleItem
        if (bundleItem.name === intl.formatMessage({ id: "store/products.IWouldLikeWarranty10Years", })) {
          if (filteredDng?.dngLinkStandardWarr) {
            newBundle.url = filteredDng.dngLinkStandardWarr

          }
        }

        if (bundleItem.name === intl.formatMessage({ id: "store/products.IWouldLikeTheProtection", })) {
          if (filteredDng?.dngLinkExtendedWarr) {
            newBundle.url = filteredDng.dngLinkExtendedWarr
          }
        }
        newBundles.push(newBundle)
      })

      let filterResult = productsGraph.filter((prod: any) => prod.items[0].itemId == item.id)
      let product = filterResult.length > 0 ? filterResult[0] : {}
      if (item.id == product.items[0].itemId) {
        newProds.push({
          ...product,
          detailUrl: item.detailUrl,
          imageUrl: item.imageUrl,
          measurementUnit: item.measurementUnit,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unitMultiplier: item.unitMultiplier,
          isGift: item.isGift,
          bundleItems: newBundles,
          attachments: item.attachments,
        });
      }
    });
    return newProds;
  };
  const productList = (
    ids: any,
    products: OrderItem[],
    handles: Record<string, string>
  ) => {
    const { loading, error, data } = useQuery(productsQuery, {
      variables: {
        field: "sku",
        values: ids,
      },
    });

    if (loading) return <div>Loading</div>;
    if (error) return <div>Error! ${error.message}`</div>;

    return (
      <ul className={`${handles.productList} w-60-l w-100 list pl0`}>
        {unifyProductData(data.productsByIdentifier, products).map((product: any) => (
          <li
            key={product.id}
            className={`${handles.productListItem} db bb b--muted-4 mb7 pb7`}
          >
            <Product product={product} />
            <BundleInfo product={product} />
            <Attachment product={product} />
            {isWarranty10Years(product) && (
              <div className={`${handles.garanziaContainer}`}>
                <a
                  target="_blank"
                  href="https://hotpoint.register-appliance.com/RegistroPorMarca?country=IT&language=it"
                >

                  {
                    <Button>
                      <FormattedMessage id="store/products.warranty10Years" />
                    </Button>
                  }
                </a>
              </div>
            )}
            {/* { isFgasItem(product) &&
              <div className={`${handles.fgasContainer}`}>
                <span className={`${handles.fgasMessage}`}>
                  E’ obbligatorio inviare la dichiarazione compilata e firmata
                  all’indirizzo email{" "}
                  <a href="mailto:supporto@whirlpool.com" className={`${handles.supportoMail}`}>
                    supporto@whirlpool.com
                  </a>{" "}
                  per poter spedire il prodotto soggetto a normativa F-GAS.
                  L’invio della dichiarazione deve avvenire entro TRE giorni
                  dalla ricezione della conferma d’ordine. La dichiarazione da
                  compilare può essere trovata in allegato alla conferma
                  d’ordine, nella pagina prodotto e nell’apposita sezione
                  Domande Frequenti &#8594; Climatizzatori F-GAS.
                </span>
              </div>
            } */}
          </li>
        ))}
      </ul>
    );
  };

  const createIds = (products: OrderItem[]) => {
    let ids = [] as string[];
    products.forEach((product: OrderItem) => {
      ids.push(product.id);
    });
    return ids;
  };
  return productList(createIds(products), products, handles);
};

export default ProductList;
