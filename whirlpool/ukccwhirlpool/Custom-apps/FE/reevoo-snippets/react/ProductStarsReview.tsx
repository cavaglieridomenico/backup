import React, { useRef } from "react";
import style from "./style.css";
import { useProduct } from "vtex.product-context";
import "./styles.global.css";

const ProductReview: StorefrontFunctionComponent = () => {
  const { product } = useProduct();
  const starsBadge = useRef(null);
  const starsValue: any = useRef(null);

  //Get and print the stars value
  // const getStarsValue = () => {
  //   const iFrame = (starsBadge?.current as any)?.children?.[0];

  //   starsValue.current.innerText = iFrame?.contentWindow?.document
  //     .getElementsByTagName("reevoo-stars")[0]
  //     .getAttribute("data-score");

  //   const insideDiv = (starsBadge?.current as any)?.children?.[0]
  //     ?.contentDocument?.body?.childNodes?.[1];

  //   //Styling
  //   iFrame.style.width = "auto";
  //   insideDiv.style.padding = 0;
  //   insideDiv.style.border = "none";
  //   insideDiv.children[0].style.width = "80px";
  // };

  // useEffect(() => {
  //   if ((starsBadge?.current as any)?.children?.[0]) {
  //     // getStarsValue();
  //     setTimeout(() => {
  //       getStarsValue();
  //     }, 2000);
  //   }
  // }, [(starsBadge?.current as any)?.children?.[0]]);

  return (
    <>
      {product && (
        <div className={style.starsContainer}>
          <>
            {
              //@ts-ignore
              <reevoo-badge
                ref={starsBadge}
                type="product"
                sku={product.items?.[0].name}
                name="b_product_stars_rect_6"
                class="reevoo-badge"
                scores-in-facets={true}
                id={`product-${product.items?.[0].name}`}
              />
            }
            <div ref={starsValue} className={style.reviewNumber}></div>
          </>
        </div>
      )}
    </>
  );
};

ProductReview.schema = {
  title: "editor.basicblock.title",
  description: "editor.basicblock.description",
  type: "object",
};

export default ProductReview;

/*----------------- WAIT FOR EL ---------------*/
//   var waitForEl = function (selector: any, callback: any) {
//     let element = document?.querySelector(selector);
//     if (
//       element &&
//       (window?.getComputedStyle(element)?.visibility == "visible" ||
//         document?.querySelector(selector)?.length > 0)
//     ) {
//       callback();
//     } else {
//       setTimeout(function () {
//         waitForEl(selector, callback);
//       }, 100);
//     }
//   };

//   waitForEl(`product-${product.items?.[0].name}`, function () {
//     const starsBadge = document?.getElementById(
//       `product-${product.items?.[0].name}`
//     );

//     const starsRating =
//       starsBadge?.current?.children?.[0].children?.[0]?.contentWindow?.document
//         .getElementsByTagName("reevoo-stars")[0]
//         .getAttribute("data-score");

//     console.log(starsBadge, "starsBadge");
//     console.log(starsRating, "starsRating");
//   });
/*---------------- WAIT FOR EL ---------------*/
