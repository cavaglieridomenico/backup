import React, { Fragment, useMemo } from 'react'
import classNames from 'classnames'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { Swiper, SwiperSlide } from 'swiper/react'
import { IconCaret } from 'vtex.store-icons'
//import { useProduct } from 'vtex.product-context'

import { THUMBS_POSITION_HORIZONTAL } from '../../utils/enums'
import { imageUrl } from '../../utils/aspectRatioUtil'
import styles from '../../styles.css'

const THUMB_SIZE = 150
const THUMB_MAX_SIZE = 256

const CSS_HANDLES = [
	'figure',
	'thumbImg',
	'thumbVid',
	'productImagesThumb',
	'carouselThumbBorder',
	'carouselGaleryThumbs',
	'productImagesThumbCaret',
]

const Thumbnail = props => {
	const { imageInfo,alt, isVideo, thumbUrl, handles, url = "", aspectRatio = 'auto' } = props

	// const productContext = useProduct();
	// const productName = productContext.product.productName
	// const productReference = productContext.product.productReference.split("-")[0] // product code without final "-WER"
	
	const retriveID = (url) =>{
		let splitSlash = url.split('/')
		return splitSlash[splitSlash.length - 1].split('.')[0]
	}

	const buildDataSrc = (url) =>{
		let id = retriveID(url)
		return "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/"+id+"/jsind9/std/1000x1000/"+id+"?fill=zoom&fillcolor=rgba:255,255,255&scalemode=product"
	}
	const pushEvent = () => {
		//Duplicate analytic event:
		// baseName is the url  without queryparams
		// let baseName = url ? url.split("?")[0] : "Unknown Asset"
		// let filename = "Unknown Asset"
		// if(baseName !== "Unknown Asset"){
		//    filename =  baseName.split("/").reverse()[0]
		// }
		// window.dataLayer.push({
		//   event: "productImageClick",
		//   productImageName: productName,
		//   productImageCode: productReference,
		//   productImageAsset: baseName,
		//   productImageFile: filename
		// });

		//GA4FUNREQ37
		const ga4Data = {
			eventName: 'ga4-productImageClick',
			isVideo: isVideo,
			url: url
		}

		window.postMessage( ga4Data, window.origin )
	  };

	return (
		<>
			<div
				onClick={()=>pushEvent()}
				// className={`absolute absolute--fill b--solid b--muted-2 bw0 ${handles.carouselThumbBorder}`}
			>
				<figure
					className={handles.figure}
					//itemProp="associatedMedia"
					//itemScope
					//itemType="http://schema.org/ImageObject"
				>
					<img
						className={`${applyModifiers(
							handles.thumbImg,
							isVideo ? 'video' : null,
						)} w-100 h-auto db`}
						//itemProp="thumbnail"
						data-throne-id={url !== ""?buildDataSrc(url):""}
						alt={alt}
						src={imageUrl(thumbUrl, THUMB_SIZE, THUMB_MAX_SIZE, aspectRatio)}
						/>
				</figure>
			</div>
		</>
	)
}

const navigationConfig = {
	prevEl: '.swiper-thumbnails-caret-prev',
	nextEl: '.swiper-thumbnails-caret-next',
	disabledClass: `c-disabled o-0 pointer-events-none ${styles.carouselCursorDefault}`,
	hiddenClass: 'dn',
}

const ThumbnailSwiper = props => {
	const { handles } = useCssHandles(CSS_HANDLES)

	const {
		isThumbsVertical,
		slides,
		thumbUrls,
		position,
		thumbnailAspectRatio,
		thumbnailMaxHeight,
		displayThumbnailsArrows,
		...swiperProps
	} = props

	const hasThumbs = slides.length > 1

	const thumbClassName = classNames(
		`${handles.carouselGaleryThumbs} dn h-auto`,
		{
			'db-ns': hasThumbs,
			mt3: !isThumbsVertical,
			'w-20 bottom-0 top-0 absolute': isThumbsVertical,
			'left-0':
				isThumbsVertical && position === THUMBS_POSITION_HORIZONTAL.LEFT,
			'right-0':
				isThumbsVertical && position === THUMBS_POSITION_HORIZONTAL.RIGHT,
		},
	)

	const itemContainerClassName = classNames(
		handles.productImagesThumb,
		'mb5 pointer',
		{
			'w-20': !isThumbsVertical,
			'w-100': isThumbsVertical,
		},
	)

	const arrows = useMemo(() => {
		if (!displayThumbnailsArrows) {
			return null
		}

		const thumbCaretSize = 24
		const thumbCaretClassName = `${handles.productImagesThumbCaret} absolute z-2 pointer c-action-primary flex pv2`
		const thumbCaretStyle = { transition: 'opacity 0.2s' }

		const nextBtnClassName = classNames(
			'swiper-thumbnails-caret-next',
			thumbCaretClassName,
			{
				[`bottom-0 pt7 left-0 justify-center w-100 ${styles.gradientBaseBottom}`]: isThumbsVertical,
				[`right-0 top-0 items-center h-100 pl6 ${styles.gradientBaseRight}`]: !isThumbsVertical,
			},
		)

		const prevBtnClassName = classNames(
			'swiper-thumbnails-caret-prev top-0 left-0',
			thumbCaretClassName,
			isThumbsVertical && `pb7 justify-center w-100 ${styles.gradientBaseTop}`,
			!isThumbsVertical && `items-center h-100 pr6 ${styles.gradientBaseLeft}`,
		)

		return (
			<Fragment key="navigation-arrows">
				<span className={nextBtnClassName} style={thumbCaretStyle}>
					<IconCaret
						orientation={isThumbsVertical ? 'down' : 'right'}
						size={thumbCaretSize}
					/>
				</span>
				<span className={prevBtnClassName} style={thumbCaretStyle}>
					<IconCaret
						orientation={isThumbsVertical ? 'up' : 'left'}
						size={thumbCaretSize}
					/>
				</span>
			</Fragment>
		)
	}, [
		displayThumbnailsArrows,
		handles.productImagesThumbCaret,
		isThumbsVertical,
	])

	return (
		<div className={thumbClassName} data-testid="thumbnail-swiper">
			<Swiper
				className={`h-100 ${handles.productImagesThumbsSwiperContainer}`}
				slidesPerView="auto"
				touchRatio={1}
				threshold={8}
				navigation={navigationConfig}
				/* Slides are grouped when thumbnails arrows are enabled
				 * so that clicking on next/prev will scroll more than
				 * one thumbnail */
				slidesPerGroup={displayThumbnailsArrows ? 4 : 1}
				freeMode={false}
				mousewheel={false}
				zoom={false}
				watchSlidesVisibility
				watchSlidesProgress
				preloadImages
				updateOnWindowResize
				direction={isThumbsVertical ? 'vertical' : 'horizontal'}
				{...swiperProps}
			>
				{slides.map((slide, i) => {
					return (
						<SwiperSlide
							key={`${i}-${slide.alt}`}
							className={itemContainerClassName}
							style={{
								height: isThumbsVertical ? 'auto' : '115px',
								maxHeight: thumbnailMaxHeight || 'unset',
								position: 'relative',
							}}
						>
							<Thumbnail
								isVideo={slide.type === 'video'}
								index={i}
								handles={handles}
								alt={slide.alt}
								thumbUrl={slide.thumbUrl || thumbUrls[i]}
								aspectRatio={thumbnailAspectRatio}
								url={slide.type === 'video'? slide.src:slide.url}
							/>
						</SwiperSlide>
					)
				})}
				{arrows}
			</Swiper>
		</div>
	)
}

export default ThumbnailSwiper
