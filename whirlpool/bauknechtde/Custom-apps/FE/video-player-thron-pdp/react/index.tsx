import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import Carousel from './components/Carousel'
import ProductImage from './components/ProductImage'
import {
	DEFAULT_EXCLUDE_IMAGE_WITH,
	DISPLAY_MODE,
	THUMBS_ORIENTATION,
	THUMBS_POSITION_HORIZONTAL,
} from './utils/enums'
import { isMobile } from './components/Carousel/index'
import style from './videoModalStyle.css'
import { Modal } from 'vtex.styleguide'
import { playButton } from './utils/vectors'
import { useIntl } from 'react-intl'
interface WindowGTM extends Window {
	dataLayer: any
}

const CSS_HANDLES = ['content', 'productImagesContainer']

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
	// contentOrder = "images-first",
	zoomMode,
	zoomFactor,
	ModalZoomElement,
	contentType = 'all',
	// Deprecated
	zoomProps,
	displayMode,
}) => {
	const dataLayer = (window as unknown as WindowGTM).dataLayer || []

	useEffect(() => {
		return () => {
			let prevScript = document.getElementById('thron-script-imported')
			prevScript?.remove()
		}
	}, [])

	if (hiddenImages && !Array.isArray(hiddenImages)) {
		hiddenImages = [hiddenImages]
	}

	const excludeImageRegexes =
		hiddenImages && hiddenImages.map((text) => new RegExp(text, 'i'))

	const { handles, withModifiers } = useCssHandles(CSS_HANDLES)
	const productImagesContainerClass = withModifiers(
		'productImagesContainer',
		displayMode,
	)

	const shouldIncludeImages = contentType !== 'videos'
	const images = shouldIncludeImages
		? allImages
				.filter(
					(image) =>
						!image.imageLabel ||
						!excludeImageRegexes.some((regex) => regex.test(image.imageLabel)),
				)
				.map((image) => ({
					type: 'image',
					url: image.imageUrls ? image.imageUrls[0] : image.imageUrl,
					alt: image.imageText,
					thumbUrl: image.thumbnailUrl || image.imageUrl,
				}))
		: []

	const shouldIncludeVideos = contentType !== 'images'

	const videos = shouldIncludeVideos
		? allVideos.map((video) => ({
				type: 'video',
				src: video.videoUrl,
				thumbWidth: 300,
		  }))
		: []

	// const showVideosFirst = contentOrder === "videos-first";

	const slides = useMemo(() => {
		return [...images]
	}, [images])

	const videoSlides = useMemo(() => {
		return [...videos]
	}, [videos])

	useEffect(() => {
		dataLayer.push({
			event: 'contentIndex',
			contentIndex: slides?.length + videoSlides?.length,
		})
	}, [])
	const { zoomType: legacyZoomType } = zoomProps || {}
	const isZoomDisabled = legacyZoomType === 'no-zoom' || zoomMode === 'disabled'

	const containerClass = `${productImagesContainerClass} ${handles.content} w-100 vtex__ProductImagesWrapper `

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
						zoomMode={isZoomDisabled ? 'disabled' : zoomMode}
					/>
				))}
			</div>
		)

	const [isModalOpen, setIsModalOpen] = useState(false)
	const buttonPlay = Buffer.from(playButton).toString('base64')
	const intl = useIntl()

	return (
		<div className={containerClass}>
			<Carousel
				slides={slides}
				placeholder={placeholder}
				position={position}
				zoomMode={isMobile() ? 'in-place-click' : 'in-place-hover'}
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
				thumbnailVisibility="visible"
				isVideoCarousel={false}
				// Deprecated
				zoomProps={zoomProps}
			/>
			{/* {isModalOpen && ( */}
			<Modal
				centered
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(!isModalOpen)}
				showCloseIcon={false}
			>
				<div className={style.modalContainer}>
					<span
						onClick={() => setIsModalOpen(!isModalOpen)}
						className={style.closeModalIcon}
					>
						<svg
							width="18"
							height="18"
							viewBox="0 0 18 18"
							xmlns="http://www.w3.org/2000/svg"
							xmlnsXlink="http://www.w3.org/1999/xlink"
							fill="#007d69"
						>
							<g fill="#007d69">
								<path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
							</g>
						</svg>
					</span>
					<Carousel
						slides={videoSlides}
						placeholder={placeholder}
						position={position}
						zoomMode={zoomMode}
						maxHeight={maxHeight}
						zoomFactor={zoomFactor}
						aspectRatio={aspectRatio}
						ModalZoomElement={ModalZoomElement}
						thumbnailMaxHeight={thumbnailMaxHeight}
						showPaginationDots={false}
						thumbnailVisibility="hidden"
						thumbnailAspectRatio={thumbnailAspectRatio}
						showNavigationArrows={true}
						thumbnailsOrientation={thumbnailsOrientation}
						displayThumbnailsArrows={displayThumbnailsArrows}
						isVideoCarousel={true}
						// Deprecated
						zoomProps={zoomProps}
					/>
				</div>
			</Modal>
			{/* )} */}
			{videos.length > 0 && (
				<div
					onClick={() => setIsModalOpen(!isModalOpen)}
					className={style.videoButtonContainer}
				>
					<img
						className={style.openVideoModalImage}
						src={`data:image/svg+xml;base64,${buttonPlay}`}
					/>
					<span className={style.openVideoModalText}>
						{intl.formatMessage({
							id: 'store/video-player-thron-pdp.videoButtonLabel',
						})}
					</span>
				</div>
			)}
		</div>
	)
}

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
		}),
	),
	videos: PropTypes.arrayOf(
		PropTypes.shape({
			videoUrl: PropTypes.string,
		}),
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
	contentOrder: PropTypes.oneOf(['images-first', 'videos-first']),
	zoomMode: PropTypes.oneOf([
		'disabled',
		'open-modal',
		'in-place-click',
		'in-place-hover',
	]),
	zoomFactor: PropTypes.number,
	contentType: PropTypes.oneOf(['all', 'images', 'videos']),
	displayMode: PropTypes.oneOf([DISPLAY_MODE.CAROUSEL, DISPLAY_MODE.LIST]),
}

ProductImages.defaultProps = {
	images: [],
	position: THUMBS_POSITION_HORIZONTAL.LEFT,
	zoomProps: { zoomType: 'in-page' },
	thumbnailsOrientation: THUMBS_ORIENTATION.VERTICAL,
	displayThumbnailsArrows: false,
	hiddenImages: DEFAULT_EXCLUDE_IMAGE_WITH,
	displayMode: DISPLAY_MODE.CAROUSEL,
}

export default ProductImages