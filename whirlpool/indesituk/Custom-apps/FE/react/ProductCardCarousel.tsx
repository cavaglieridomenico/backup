import React from "react";
// @ts-ignore
import { CssHandlesTypes } from "vtex.css-handles";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";
import ButtonEnergyClassCarousel from "./ButtonEnergyClassCarousel";
export interface ProductCardCarouselProps {
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>;
  energyClassImage: string;
  isBottomCarousel: boolean;
  linkEnergyLabel: string;
  linkToPDP: string;
  productCode: string;
  productImage: string;
  productName: string;
  id: any;
  onClickDiscoverMore: () => {};
}

const CSS_HANDLES = [
  "productCardCarousel__container",
  "productCardCarousel__imageContainer",
  "productCardCarousel__image",
  "productCardCarousel__detailsContainer",
  "productCardCarousel__productCodeLabel",
  "productCardCarousel__productNameLabel",
  "productCardCarousel__discoverMoreContainer",
  "productCardCarousel__discoverMoreText",
  "productCardCarousel__discoverMoreIcon",
  "productCardCarousel__buttonEnergyClassContainer",
  "productCardCarousel__energyImageMobile",
  "productCardCarousel__labelImageContainer",
  "productCardCarousel__textContainer",
  "productCardCarousel__textStyle",
  "productCardCarousel__textStyleCategory",
  "productCardCarousel__textAndCtaContainer"
] as const;

export default function ProductCardCarousel({
  classes,
  energyClassImage,
  isBottomCarousel,
  linkEnergyLabel,
  linkToPDP,
  productCode,
  id,
  productImage,
  productName,
  onClickDiscoverMore,
}: ProductCardCarouselProps) {
  const { handles } = useCssHandles(CSS_HANDLES, { classes });

  return isBottomCarousel ? (
    <div key={id} id={id} className={handles.productCardCarousel__container}>
      <div className={handles.productCardCarousel__imageContainer}>
        <img
          className={handles.productCardCarousel__image}
          src={productImage}
        />
      </div>
      <div className={handles.productCardCarousel__textAndCtaContainer}>
        <div className={handles.productCardCarousel__textContainer}>
          <div className={handles.productCardCarousel__labelImageContainer}>
            <span className={handles.productCardCarousel__productCodeLabel}>
              {productCode}
            </span>
            <img
              className={handles.productCardCarousel__energyImageMobile}
              src={energyClassImage}
            />
          </div>

          <span className={handles.productCardCarousel__productNameLabel}>
            {productName}
          </span>
          <div
            className={handles.productCardCarousel__buttonEnergyClassContainer}
          >
            {linkEnergyLabel && energyClassImage ? (
              <ButtonEnergyClassCarousel
                href={linkEnergyLabel}
                energyClassImage={energyClassImage}
              />
            ) : (
              ""
            )}
          </div>
        </div>

        {/* Discover more component */}
        <a
          href={linkToPDP}
          className={handles.productCardCarousel__discoverMoreContainer}
          onClick={() => onClickDiscoverMore()}
        >
          <span className={handles.productCardCarousel__discoverMoreText}>
            Discover more
          </span>
          <span className={handles.productCardCarousel__discoverMoreIcon} />
        </a>
      </div>
    </div>
  ) : (
    <div key={id} id={id} className={handles.productCardCarousel__container}>
      <div className={handles.productCardCarousel__imageContainer}>
        <img
          className={handles.productCardCarousel__image}
          src={productImage}
        />
      </div>

      <div className={handles.productCardCarousel__textAndCtaContainer}>
        <div className={handles.productCardCarousel__textContainer}>
          <span className={handles.productCardCarousel__textStyle}>
            <strong className={handles.productCardCarousel__textStyle}>
              {productName}
            </strong>
          </span>
        </div>
        {/* Discover more component */}
        <a
          href={linkToPDP}
          className={handles.productCardCarousel__discoverMoreContainer}
          onClick={() => onClickDiscoverMore()}
        >
          <span className={handles.productCardCarousel__discoverMoreText}>
            Discover more
          </span>
          <span className={handles.productCardCarousel__discoverMoreIcon} />
        </a>
      </div>
    </div>
  );
}
