import PropTypes from "prop-types";
import React, { useEffect, useMemo } from "react";
import { useCssHandles } from "vtex.css-handles";
import Carousel from "./components/Carousel";
import ProductImage from "./components/ProductImage";
import {
  DEFAULT_EXCLUDE_IMAGE_WITH,
  DISPLAY_MODE,
  THUMBS_ORIENTATION,
  THUMBS_POSITION_HORIZONTAL,
} from "./utils/enums";

const CSS_HANDLES = ["content", "productImagesContainer"];

const ProductImages = ({
  position,
  displayThumbnailsArrows,
  hiddenImages,
  placeholder,
  images: allImages,
  videos: allVideos,
  thumbnailsOrientation,
  aspectRatio,
  maxHeight,
  thumbnailAspectRatio,
  thumbnailMaxHeight,
  showNavigationArrows,
  showPaginationDots,
  contentOrder = "images-first",
  zoomMode,
  zoomFactor,
  ModalZoomElement,
  contentType = "all",
  // Deprecated
  zoomProps,
  displayMode,
}) => {
  useEffect(() => {
    return () => {
      let prevScript = document.getElementById("thron-script-imported");
      prevScript?.remove();
    };
  }, []);

  if (hiddenImages && !Array.isArray(hiddenImages)) {
    hiddenImages = [hiddenImages];
  }

  const excludeImageRegexes =
    hiddenImages && hiddenImages.map((text) => new RegExp(text, "i"));

  const { handles, withModifiers } = useCssHandles(CSS_HANDLES);
  const productImagesContainerClass = withModifiers(
    "productImagesContainer",
    displayMode
  );

  const shouldIncludeImages = contentType !== "videos";
  const images = shouldIncludeImages
    ? allImages
        .filter(
          (image) =>
            !image.imageLabel ||
            !excludeImageRegexes.some((regex) => regex.test(image.imageLabel))
        )
        .map((image) => ({
          type: "image",
          url: image.imageUrls ? image.imageUrls[0] : image.imageUrl,
          alt: image.imageText,
          thumbUrl: image.thumbnailUrl || image.imageUrl,
        }))
    : [];

  const shouldIncludeVideos = contentType !== "images";

  const videos = shouldIncludeVideos
    ? allVideos.map((video) => ({
        type: "video",
        src: video.videoUrl,
        thumbWidth: 300,
      }))
    : [];

  const showVideosFirst = contentOrder === "videos-first";

  const slides = useMemo(() => {
    return showVideosFirst ? [...videos, ...images] : [...images, ...videos];
  }, [showVideosFirst, videos, images]);

  const { zoomType: legacyZoomType } = zoomProps || {};
  const isZoomDisabled =
    legacyZoomType === "no-zoom" || zoomMode === "disabled";

  const containerClass = `${productImagesContainerClass} ${handles.content} w-100 vtex__ProductImagesWrapper `;

  console.log(slides, "CAROUSEL SLIDES")

  if (displayMode === DISPLAY_MODE.LIST)
    return (
      <div className={containerClass}>
        {images.map(({ url, alt }, index) => (
          <ProductImage
            index={index}
            key={index}
            src={url}
            alt={alt}
            maxHeight={maxHeight}
            zoomFactor={zoomFactor}
            aspectRatio={aspectRatio}
            ModalZoomElement={ModalZoomElement}
            zoomMode={isZoomDisabled ? "disabled" : zoomMode}
          />
        ))}
      </div>
    );

  return (
    <div className={containerClass}>
      { slides &&
        <Carousel
        slides={slides}
        placeholder={placeholder}
        position={position}
        zoomMode={zoomMode}
        maxHeight={maxHeight}
        zoomFactor={zoomFactor}
        aspectRatio={aspectRatio}
        ModalZoomElement={ModalZoomElement}
        thumbnailMaxHeight={thumbnailMaxHeight}
        showPaginationDots={showPaginationDots}
        thumbnailAspectRatio={thumbnailAspectRatio}
        showNavigationArrows={showNavigationArrows}
        thumbnailsOrientation={thumbnailsOrientation}
        displayThumbnailsArrows={displayThumbnailsArrows}
        showImagesCounter={false}
        // Deprecated
        zoomProps={zoomProps}
      />
      }
    </div>
  );
};

ProductImages.propTypes = {
  /** The position of the thumbs */
  position: PropTypes.oneOf([
    THUMBS_POSITION_HORIZONTAL.LEFT,
    THUMBS_POSITION_HORIZONTAL.RIGHT,
  ]),
  ModalZoomElement: PropTypes.any,
  thumbnailsOrientation: PropTypes.oneOf([
    THUMBS_ORIENTATION.VERTICAL,
    THUMBS_ORIENTATION.HORIZONTAL,
  ]),
  /** This is a necessary prop if you're using SKUSelector to display color images
   * (like a image with only green to represent an SKU of something green) and you
   * want to not display this image in the ProductImages component, to do this you
   * just have to upload the image in the catalog with the value of this prop inside the imageText property */
  hiddenImages: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  placeholder: PropTypes.string,
  /** Array of images to be passed for the Thumbnail Slider component as a props */
  images: PropTypes.arrayOf(
    PropTypes.shape({
      /** URL of the image */
      imageUrls: PropTypes.arrayOf(PropTypes.string.isRequired),
      /** Size thresholds used to choose each image */
      thresholds: PropTypes.arrayOf(PropTypes.number),
      /** URL of the image thumbnail */
      thumbnailUrl: PropTypes.string,
      /** Text that describes the image */
      imageText: PropTypes.string,
    })
  ),
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      videoUrl: PropTypes.string,
    })
  ),
  zoomProps: PropTypes.shape({
    zoomType: PropTypes.string,
  }),
  displayThumbnailsArrows: PropTypes.bool,
  aspectRatio: PropTypes.string,
  maxHeight: PropTypes.number,
  thumbnailAspectRatio: PropTypes.string,
  thumbnailMaxHeight: PropTypes.number,
  showNavigationArrows: PropTypes.bool,
  showPaginationDots: PropTypes.bool,
  contentOrder: PropTypes.oneOf(["images-first", "videos-first"]),
  zoomMode: PropTypes.oneOf([
    "disabled",
    "open-modal",
    "in-place-click",
    "in-place-hover",
  ]),
  zoomFactor: PropTypes.number,
  contentType: PropTypes.oneOf(["all", "images", "videos"]),
  displayMode: PropTypes.oneOf([DISPLAY_MODE.CAROUSEL, DISPLAY_MODE.LIST]),
};

ProductImages.defaultProps = {
  images: [],
  position: THUMBS_POSITION_HORIZONTAL.LEFT,
  zoomProps: { zoomType: "in-page" },
  thumbnailsOrientation: THUMBS_ORIENTATION.VERTICAL,
  displayThumbnailsArrows: false,
  hiddenImages: DEFAULT_EXCLUDE_IMAGE_WITH,
  displayMode: DISPLAY_MODE.CAROUSEL,
};

export default ProductImages;