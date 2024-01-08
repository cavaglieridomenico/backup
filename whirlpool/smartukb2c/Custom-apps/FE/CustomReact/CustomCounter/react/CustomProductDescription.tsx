// @ts-nocheck
import React, { useContext, useState, useMemo } from 'react';
import styles from "./styles.css";
import axios from 'axios';
import { ProductContext } from 'vtex.product-context'


const CustomProductDescription = ({ }) => {

    const valuesFromContext = useContext(ProductContext)

    const { product }: { product: product } = valuesFromContext;
    const winnerCode = product.properties.filter(prop => prop.name === "winnerCode")[0]?.values[0];
    const looserCode = product.properties.filter(prop => prop.name === "looserCode")[0]?.values[0];

    const brand = __RUNTIME__.binding.id === "20dc9ced-aa24-4f71-b0d6-ae56919c318e" ? "Hotpoint" : "Indesit"
    return (
        <div className={styles.customProductDescription}>
            <p>{brand} {winnerCode.startsWith("C") ? winnerCode : looserCode} genuine replacement part. </p>
            <p>{product.description.split("Please use the model list below to check this part fits your appliance")[0]}</p>
            {brand === "Hotpoint"  ? 
         <p>Please use the model list below to check this part fits your appliance.</p>
         : <p>Please use the model list below to check if this part fits your model.</p>}
           
        </div>
    )
}


export default CustomProductDescription;
