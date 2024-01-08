//@ts-nocheck
import React from 'react'
import style from './style.css'
import { useProduct, SpecificationGroup } from 'vtex.product-context'
import { useEffect } from 'react'

const YourekoBadge: StorefrontFunctionComponent = () => {
    const { product } = useProduct();
    
    useEffect(() => {
     
    },[])
    return (
        <></>
    )
}

YourekoBadge.schema = {
    title: 'editor.basicblock.title',
    description: 'editor.basicblock.description',
    type: 'object'
}

export default YourekoBadge

