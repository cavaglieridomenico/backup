import React, { useContext, useEffect, useState } from "react";
//@ts-nocheck
import { ProductContext } from 'vtex.product-context';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
//import 'swiper/css';

const CustomProductImage = () => {
    const valuesFromContext = useContext(ProductContext)

    const product = valuesFromContext;
    const [productImages, setProductImages] = useState();

    useEffect(() => {
        setProductImages(product.selectedItem.images[0].imageUrl)
    }, [])

    const pippo = () => {
        console.log(product.selectedItem.images[0].imageUrl)
    }
    return (
        <div onClick={() => pippo()}>
            <Swiper
                spaceBetween={50}
                slidesPerView={1}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
            >
                <SwiperSlide> ss</SwiperSlide>
                <SwiperSlide><img src={productImages} /></SwiperSlide>
            </Swiper>
        </div>
    )
}

export default CustomProductImage;