import React, { Fragment, useMemo, useState, useEffect } from 'react'
import classNames from 'classnames'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { Swiper, SwiperSlide } from 'swiper/react'
import { IconCaret } from 'vtex.store-icons'
import style from '../style.css'
import { THUMBS_POSITION_HORIZONTAL } from '../../utils/enums'
import { imageUrl } from '../../utils/aspectRatioUtil'
import styles from '../../styles.css'
import { getProdName } from '../../utils/generateUrl'
import { handleClickAnal } from '../../utils/productImageClick'
import { canUseDOM, useRuntime } from 'vtex.render-runtime'
import { usePixel } from 'vtex.pixel-manager'

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
	const {
		alt,
		isVideo,
		thumbUrl,
		handles,
		url = '',
		aspectRatio = 'auto',
		index,
		slidesPerGroup,
	} = props

	const { deviceInfo } = useRuntime()
	const isPhoneView = () => deviceInfo.type === 'phone'

	const { push } = usePixel()

	const retriveID = url => {
		let splitSlash = url.split('/')
		return splitSlash[splitSlash.length - 1].split('.')[0]
	}

	const buildDataSrc = url => {
		let id = retriveID(url)
		return (
			'https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/' +
			id +
			'/jsind9/std/1000x1000/' +
			id +
			'?fill=zoom&fillcolor=rgba:255,255,255&scalemode=product'
		)
	}

	return (
		<div
			onClick={() => {
				handleClickAnal(props)
			}}
		>
			<figure
				className={handles.figure}
				//itemProp="associatedMedia"
				//itemScope
				//itemType="http://schema.org/ImageObject"
			>
				{!isPhoneView() && (
					<img
						className={`${applyModifiers(
							handles.thumbImg,
							isVideo ? 'video' : null,
						)} w-100 h-auto db`}
						//itemProp="thumbnail"
						data-throne-id={url !== '' ? buildDataSrc(url) : ''}
						alt={alt}
						src={imageUrl(thumbUrl, THUMB_SIZE, THUMB_MAX_SIZE, aspectRatio)}
						loading={index < slidesPerGroup ? 'eager' : 'lazy'}
					/>
				)}
			</figure>
			<div
				className={`absolute absolute--fill b--solid b--muted-2 bw0 ${handles.carouselThumbBorder}`}
			/>
		</div>
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

	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		canUseDOM ? setIsVisible(true) : ''
	}, [canUseDOM])

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

	const slidesPerGroup = displayThumbnailsArrows ? 4 : 1

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
			{/* <h4>test render small</h4> */}
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
				observer={true} //Used to prevent swiper block on many slides
				observeParents={true} //Used to prevent swiper block on many slides
				observeSlideChildren={true} //Used to prevent swiper block on many slides
				zoom={false}
				watchSlidesVisibility
				watchSlidesProgress
				preloadImages
				updateOnWindowResize
				direction={isThumbsVertical ? 'vertical' : 'horizontal'}
				{...swiperProps}
			>
				{slides.map((slide, i) => {
					return isVisible ? (
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
								url={slide.type === 'video' ? slide.src : slide.url}
								slidesPerGroup={slidesPerGroup}
							/>
						</SwiperSlide>
					) : (
						<SwiperSlide
							key={`${i}-${slide.alt}`}
							className={style.skeleton}
							style={{
								height: isThumbsVertical ? 'auto' : '115px',
								maxHeight: thumbnailMaxHeight || 'unset',
								position: 'relative',
							}}
						>
							<div className={style.skeleton} style={{ height: '115px' }} />
						</SwiperSlide>
					)
				})}
				{arrows}
			</Swiper>
		</div>
	)
}

export default ThumbnailSwiper
