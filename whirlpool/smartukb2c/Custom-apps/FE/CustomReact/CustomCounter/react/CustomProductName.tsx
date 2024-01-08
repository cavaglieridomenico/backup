// @ts-nocheck
import React, { useContext, useState, useMemo } from 'react';
import styles from "./styles.css";
import axios from 'axios';
import { ProductContext } from 'vtex.product-context'


const CustomProductName = ({ }) => {

    const valuesFromContext = useContext(ProductContext)

    const { product }: { product: product } = valuesFromContext;
    const jCode = product.properties.filter(prop => prop.name === "jCode")[0] ? product.properties.filter(prop => prop.name === "jCode")[0].values[0] : "";

    return (
        <>
        {__RUNTIME__.route.params.slug  ?
            <h1 className={styles.customProductName}>{product.productName.includes("J0") ? product.productName : product.productName + " " + jCode}</h1>

            :
            <span className={styles.customProductNamePlp}>{product.productName.includes("J0") ? product.productName : product.productName + " " + jCode}</span>

        }
        </>
    )
}


export default CustomProductName;
