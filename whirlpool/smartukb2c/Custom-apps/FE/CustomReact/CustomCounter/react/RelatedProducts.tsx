//@ts-nocheck
import React, { useState } from 'react'
import styles from './styles.css'
import { useQuery } from 'react-apollo'
import products from './graphql/products.graphql'
import { useEffect, useContext } from 'react'
import { ProductContext } from 'vtex.product-context'
import fetchRequest from './utils/fetchRequest'
import { CustomProductPage } from "smartukb2c.custom-product-page"

const RelatedProducts: StorefrontFunctionComponent = () => {
    const product = useContext(ProductContext).product;
    const [productIds, setProductIds] = useState([]);
    const { loading, error, data } = useQuery(products, {
        variables: {
            "field": "id",
            "values": productIds
        }
    });
    useEffect(() => {
        const category = product.categories[1].split("/")[3];
        fetch(`/v1/get-collection/getByCategoryName/${category}`).then((response) => {
            response.json().then((parts) => {
                let pIds = [];
                parts.filter((part) => { pIds.push(part.ProductId) })
                setProductIds(pIds);
            })
        });
    }, [])


    return (
        <div  className={styles.relatedProducts}>
            {data && data.productsByIdentifier && productIds.length > 0  && (
                <div className={styles.relatedProductsTitle}>Other products you might be interested in
                </div>
            )}
            <div className={styles.relatedProductsWrapper}>

                {data && data.productsByIdentifier && productIds.length > 0  && data.productsByIdentifier.map((item) => {
                    return <a href={`/${item.linkText}/p`} className={styles.relatedProductsCard}>
                        <div className={styles.realtedProductsCardRow}>
                            <img className={styles.relatedProductsCardImage} src={item.items[0].images[0].imageUrl} />
                            <div className={styles.relatedProductsCardRight}>
                                <div>{item.productName}</div>
                                <p>Part: {item.productReference}</p>
                                <div><img className={styles.relatedProductsCardIcon} src="/arquivos/inspect.png"/>Check if this part fits your appliance</div>
                                <CustomProductPage.ProductAvailabilityWrapper product={item} />
                            </div>
                        </div>
                        <div className={styles.realtedProductsCardSecondRow}>
                            {(item.priceRange.sellingPrice.highPrice !== 0) ?
                                <div className={styles.relatedProductsCardPrice}>
                                    <div className={styles.relatedProductsCardPriceText}>{"£ " + item.priceRange.sellingPrice.highPrice}</div>
                                    <div className={styles.relatedProductsCardPriceTextVat}>incl. VAT</div>
                                </div> :
                                ""}
                            <div className={styles.relatedProductsCardButtonWrapper}>

                                <CustomProductPage.Wrapper product={item} selectedQuantity={1} />
                            </div>
                        </div>
                    </a>
                })}
            </div>
        </div>

    )
}



export default RelatedProducts