import React, { useContext, useState, useEffect } from "react";
import { ProductContext } from "vtex.product-context";
import styles from "./styles.css"

const ProductIdentifierCustom = () => {

    const valuesFromContext: any = useContext(ProductContext)
    const product: any  = valuesFromContext;
    const [showCode, setShowCode] = useState(false)

    useEffect(() => {
        let url = window && window.location ? window.location.href : "";
        if(url.includes("showCode=true")) {
            setShowCode(true)
        }
    }, [])
    

    return (
        <p className={styles.productReferenceCode}>Reference: {product.product.productReference} {(showCode === true) ? " [ " + product.selectedItem.referenceId[0].Value + " ]" : " "}</p>
    )
}

export default ProductIdentifierCustom;