//@ts-nocheck
import React from 'react'
import style from './style.css'
import { useProduct, SpecificationGroup } from 'vtex.product-context'
import { useState } from 'react';
import { useEffect } from 'react';

const ProductReview: StorefrontFunctionComponent = () => {
    const { product } = useProduct();
    const [myProduct, setMyProduct] = useState(null);
    useEffect(() => {
        if (!myProduct) {
            setMyProduct(product);
        }
    }, [product])
    return (
        <>
            {myProduct && (
                <reevoo-badge
                    type="product"
                    sku={product.items?.[0].name}
                    variant="category_page"
                    class="reevoo-badge"
                ></reevoo-badge>
            )}
        </>

    )
}

ProductReview.schema = {
    title: 'editor.basicblock.title',
    description: 'editor.basicblock.description',
    type: 'object'
}

export default ProductReview

