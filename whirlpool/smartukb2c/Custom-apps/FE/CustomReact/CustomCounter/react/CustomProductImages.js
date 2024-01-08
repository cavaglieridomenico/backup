//@ts-nocheck
import React, { useContext, useEffect, useState } from "react";

import { ProductContext } from 'vtex.product-context';
// Import Swiper React components
import {Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper/core'
import { Navigation,Pagination } from "swiper";
import "./utils/swiper/swiper.global.css";
import "./utils/swiper/swiper-bundle.css";
import "./utils/swiper/swiper.scoped.css";
//import "./utils/swiper/navigation.min.css"



const CustomProductImage = () => {
    const valuesFromContext = useContext(ProductContext)

    const product = valuesFromContext;
    const [productImages, setProductImages] = useState([]);
    const [productName, setProductName] = useState("");
    const [productBrand, setProductBrand] = useState("");
    useEffect(() => {
        setProductImages(product.selectedItem.images);
        setProductName(product.product.productName);
        setProductBrand(product.product.brand);
    }, [])

    SwiperCore.use([Navigation,Pagination]);
    return (
        <Swiper navigation={true} pagination={true} modules={[Navigation]} className="mySwiper" >
        {productImages.map((img) => {
            return(
                <SwiperSlide><img alt={`${productName} - ${productBrand}`} title={`${productName} - ${productBrand}`} src={img.imageUrl} /></SwiperSlide>
            )
        })}
        
           
        </Swiper>
    )
}

export default CustomProductImage;