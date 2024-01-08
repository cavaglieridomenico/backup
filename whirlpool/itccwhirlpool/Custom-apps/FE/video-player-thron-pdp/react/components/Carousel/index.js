/* eslint-disable react/prop-types */
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { equals, path } from 'ramda'
import React, { Component } from 'react'
import SwiperCore, { Navigation, Pagination, Thumbs } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { withCssHandles } from 'vtex.css-handles'
import { IconCaret } from 'vtex.store-icons'
import IconFullScreen from './QuickviewIcon.svg'
import {
	THUMBS_ORIENTATION,
	THUMBS_POSITION_HORIZONTAL,
} from '../../utils/enums'
import ProductImage, { buildDataSrc } from '../ProductImage'
import Video, { getThumbUrl } from '../Video'
import ImagePlaceholder from './ImagePlaceholder'
import './overrides.global.css'
import './swiper.global.css'
import styles from './swiper.scoped.css'
import ThumbnailSwiper from './ThumbnailSwiper'
import { getUrlThb } from '../Video/Thron'
import { useRuntime } from 'vtex.render-runtime'
import { ModalCarousel, ModalWrapper } from '../Modal'
import { handleClickAnal } from '../../utils/productImageClick'

const CARET_ICON_SIZE = 24
const CARET_CLASSNAME =
	'pv8 absolute top-50 translate--50y z-2 pointer c-action-primary'

// install Swiper's Thumbs component
SwiperCore.use([Thumbs, Navigation, Pagination])

const CSS_HANDLES = [
	'carouselContainer',
	'productImagesThumbsSwiperContainer',
	'productImagesThumbActive',
	'productImagesGallerySwiperContainer',
	'productImagesGallerySlide',
	'swiperCaret',
	'swiperCaretNext',
	'swiperCaretPrev',
]

const initialState = {
	thumbUrl: [] || null,
	alt: [] || null,
	activeIndex: 0,
	deviceInfo: null,
	isModal: false,
	firstLoad: true,
}

const checkVideo = (url) => {
	return url.indexOf('whirlpool-cdn.thron') !== -1
}

// function pushEvent(url) {
// 	if (checkVideo(url)) {
// 		let idVideo = url.split('vi-')[1]
// 		if (idVideo.includes('/')) {
// 			idVideo.substr(0, idVideo.indexOf('/'))
// 		}

// 		let dataLayer = window.dataLayer
// 		if (
// 			dataLayer[dataLayer.length - 1].eventLabel == undefined ||
// 			dataLayer[dataLayer.length - 1].eventLabel.indexOf(
// 				'Product Experience Video - ',
// 			) == -1
// 		) {
// 			// dataLayer.push({
// 			// 	event: 'thronVideo',
// 			// 	eventLabel: 'Product Experience Video - ' + idVideo,
// 			// })
// 		}
// 	}
// }

//Push the event only once
function pushAfterTotsec(dataLayer, time) {
	return (
		dataLayer[dataLayer.length - 1].eventAction !== undefined &&
		dataLayer[dataLayer.length - 1].eventAction.indexOf(time) !== -1
	)
}
//Push dataLayer using seconds as parameters
// function pushDataLayer(sec, idVideo) {
// 	let vid = document.querySelectorAll(
// 		'#sl-gallery-xcid-vi-' + idVideo + ' video',
// 	)[0]
// 	let dataLayer = window.dataLayer
// 	if (!pushAfterTotsec(dataLayer, sec)) {
// 		dataLayer.push({
// 			event: 'thronVideo',
// 			eventCategory: 'Product Experience',
// 			eventLabel: 'Product Experience Video - ' + idVideo,
// 			eventAction: 'Thron - View a Video - ' + sec + ' secs',
// 			video_duration: parseInt(vid.duration / 60, 10),
// 			video_title: vid.title,
// 			video_current_time: parseInt(vid.currentTime, 10),
// 		})
// 	}
// }

const isMobile = () =>
	window.matchMedia && window.matchMedia('(max-width: 680px)').matches

class Carousel extends Component {
	state =
		this.props.stateCustom !== undefined
			? { ...this.props.stateCustom }
			: {
					...initialState,
					thumbSwiper: null,
					gallerySwiper: null,
					thronPlayers: [],
			  }

	isVideo = []

	get hasGallerySwiper() {
		return Boolean(this.state.gallerySwiper)
	}

	get hasThumbSwiper() {
		return Boolean(this.state.thumbSwiper)
	}

	setInitialVariablesState() {
		const slides = this.props.slides || []
		this.isVideo = []

		slides.forEach(async (slide, i) => {
			if (slide.type === 'video') {
				const thumbUrl = await getThumbUrl(slide.src, slide.thumbWidth)
				this.isVideo[i] = true
				this.setVideoThumb(i)(thumbUrl)
			} else {
				// Image object doesn't exist when it's being rendered in the server side
				if (!window.navigator) {
					return
				}

				const image = new Image()

				image.src = slide.thumbUrl
			}
		})
	}

	createThronScript() {
		return new Promise(function (resolve, reject) {
			var script = document.createElement('script')
			script.id = 'thron-script-imported'
			script.src =
				'https://whirlpool-cdn.thron.com/shared/ce/bootstrap/1/scripts/embeds-min.js'
			script.addEventListener('load', function () {
				resolve()
			})
			script.addEventListener('error', function (e) {
				reject(e)
			})
			document.head.appendChild(script)
		})
	}

	retriveAllVideoId() {
		let slides = this.props.slides || []
		let ids = []
		slides.forEach((slide) => {
			if (slide.type == 'video') {
				let url = slide.src
				let idVideo =
					url.split('vi-')[1].indexOf('/') !== -1
						? url.split('vi-')[1].substr(0, url.split('vi-')[1].indexOf('/'))
						: url.split('vi-')[1]
				ids[idVideo] = 'sl-gallery-xcid-vi-' + idVideo
			}
		})
		return ids
	}

	integrateVideoThron(ids) {
		let keys = Object.keys(ids)
		let players = []
		keys.forEach((key) => {
			let options = {
				clientId: 'whirlpool',
				sessId: 'jsind9',
				xcontentId: 'vi-' + key,
			}
			let thronPlayer = window.THRONContentExperience(ids[key], options)
			players.push(thronPlayer)
		})
		this.setState({ thronPlayers: players })
	}

	removePreviuosVideo() {
		let thronPlayers = this.props.thronPlayers || this.state.thronPlayers || []
		thronPlayers.forEach((t) => t.destroy())
	}

	async componentDidMount() {
		!this.props.isChild && (await this.createThronScript())
		this.props.isChild && this.removePreviuosVideo()
		Boolean(this.props.isChild) && this.localIndex(true, this.props.activeIndex)
		this.setInitialVariablesState()
		let videos = this.retriveAllVideoId()
		this.integrateVideoThron(videos)
		this.handleSlideChange()
	}

	componentDidUpdate(prevProps) {
		const { activeIndex } = this.state
		const { isVideo } = this

		if (!equals(prevProps, this.props)) {
			// this.reDoVideo()
			this.handleSlideChange()
		}
		if (!equals(prevProps.slides, this.props.slides)) {
			this.setInitialVariablesState()

			const newInitialState = { ...initialState }

			if (!this.props.slides) return

			this.setState(newInitialState)

			return
		}

		this.state.firstLoad &&
			this.state.gallerySwiper &&
			this.props.activeIndex &&
			this.state.gallerySwiper.slideTo(this.props.activeIndex) &&
			this.setState({ firstLoad: false })

		const paginationElement = path(
			['swiper', 'pagination', 'el'],
			this.state.gallerySwiper,
		)

		if (paginationElement) {
			paginationElement.hidden = isVideo[activeIndex]
		}
	}

	localIndex(set = false) {
		localStorage?.removeItem('videoIndex')
		if (set) {
			localStorage?.setItem(
				'videoIndex',
				JSON.stringify({ activeIndex: this.state.activeIndex }),
			)
		}
	}

	componentWillUnmount() {
		let thronPlayers = this.state.thronPlayers || []
		thronPlayers.forEach((t) => t.destroy())
		setInterval(() => {
			this.localIndex(Boolean(this.props.isChild))
		}, 1000)
	}

	handleSlideChange = () => {
		this.setState((prevState) => {
			if (!this.hasGallerySwiper) {
				return
			}

			const { activeIndex } = prevState.gallerySwiper

			Boolean(this.props.isChild) &&
				this.localIndex(
					Boolean(this.props.isChild),
					prevState.gallerySwiper.activeIndex,
				)

			const { isVideo } = this

			//VIDEO TRIGGER
			if (this.props.slides[activeIndex].type == 'video') {
				let src = this.props.slides[activeIndex].src
				let idVideo =
					src.split('vi-')[1].indexOf('/') == -1
						? src.split('vi-')[1]
						: src.split('vi-')[1].substr(0, src.split('vi-')[1].indexOf('/'))
				//pushEvent(this.props.slides[activeIndex].src)
				//Remove imported control
				document
					.querySelectorAll('.th-controls')
					.forEach((node) => (node.style.display = 'none'))

				let vid = document.querySelectorAll(
					'#sl-gallery-xcid-vi-' + idVideo + ' video',
				)[0]

				//GA4FUNREQ64
				const ga4Data = {
					eventName: "ga4-thronVideo",
					actionType: "",
					idVideo: idVideo,
					videoDuration: vid.duration
      		    }	

				let activeSlide = this.props.slides[activeIndex]
				if (vid !== undefined) {
					// Put automatic controls
					vid.setAttribute('controls', '')
					//Remove the defualt propagation event
					vid.addEventListener('click', function (event) {
						event.preventDefault()
						event.stopImmediatePropagation()
					})
					vid.onpause = function () {
						if (vid.currentTime !== vid.duration) {
							// let final = activeSlide.src.split("WEBHD/vi-");
							// const idVideo = final[1];
							// let dataLayer = window.dataLayer
							// dataLayer.push({
							// 	event: 'thronVideo',
							// 	eventCategory: 'Product Experience',
							// 	eventLabel: 'Product Experience Video - ' + idVideo,
							// 	eventAction: 'Thron - View a Video - Stop',
							// 	video_duration: parseInt(vid.duration / 60, 10),
							// 	video_title: vid.title,
							// 	video_current_time: parseInt(vid.currentTime, 10),
							// })

							//GA4FUNREQ64
							window.postMessage({...ga4Data, actionType: "Stop" }, window.origin);

						}
					}
					vid.onplay = function () {
						// let dataLayer = window.dataLayer
						// dataLayer.push({
						// 	event: 'thronVideo',
						// 	eventCategory: 'Product Experience',
						// 	eventLabel: 'Product Experience Video - ' + idVideo,
						// 	eventAction: 'Thron - View a Video - Play',
						// 	video_duration: parseInt(vid.duration / 60, 10),
						// 	video_title: vid.title,
						// 	video_current_time: parseInt(vid.currentTime, 10),
						// })

						//GA4FUNREQ64
						window.postMessage({...ga4Data, actionType: "Play" }, window.origin);

					}
					vid.onended = function () {
						// let dataLayer = window.dataLayer
						// dataLayer.push({
						// 	event: 'thronVideo',
						// 	eventCategory: 'Product Experience',
						// 	eventLabel: 'Product Experience Video - ' + idVideo,
						// 	eventAction: 'Thron - View a Video - Completed',
						// 	video_duration: parseInt(vid.duration / 60, 10),
						// 	video_title: vid.title,
						// 	video_current_time: parseInt(vid.currentTime, 10),
						// })

						//GA4FUNREQ64
						window.postMessage({...ga4Data, actionType: "Completed" }, window.origin);

					}
					// FUNREQ55
					vid.ontimeupdate = function () {
						switch (true) {
							case vid.currentTime > 9 && vid.currentTime < 11: {
								//pushDataLayer(10, idVideo)

								//GA4FUNREQ64
								window.postMessage({...ga4Data, actionType: "10 secs" }, window.origin);
								break
							}
							case vid.currentTime > 24 && vid.currentTime < 26: {
								//pushDataLayer(25, idVideo)

								//GA4FUNREQ64
								window.postMessage({...ga4Data, actionType: "25 secs" }, window.origin);
								break
							}
							case vid.currentTime > 49 && vid.currentTime < 51: {
								//pushDataLayer(50, idVideo)

								//GA4FUNREQ64
								window.postMessage({...ga4Data, actionType: "50 secs" }, window.origin);
								break
							}
							case vid.currentTime > 74 && vid.currentTime < 76: {
								//pushDataLayer(75, idVideo)

								//GA4FUNREQ64
								window.postMessage({...ga4Data, actionType: "75 secs" }, window.origin);
								break
							}
							case vid.currentTime > 89 && vid.currentTime < 91: {
								//pushDataLayer(90, idVideo)

								//GA4FUNREQ64
								window.postMessage({...ga4Data, actionType: "90 secs" }, window.origin);
								break
							}
						}
					}
					vid.onseeking = function () {
						let sec = Math.round(vid.currentTime)
						// let dataLayer = window.dataLayer
						// dataLayer.push({
						// 	event: 'thronVideo',
						// 	eventLabel: 'Product Experience Video - ' + idVideo,
						// 	eventAction: 'Thron - View a Video - Seeked to sec ' + sec,
						// 	video_duration: parseInt(vid.duration / 60, 10),
						// 	video_title: vid.title,
						// 	video_current_time: parseInt(vid.currentTime, 10),
						// })

						//GA4FUNREQ64
						window.postMessage({...ga4Data, actionType: `Seeked to sec ${sec}` }, window.origin);
					}
				}
			}
			return { activeIndex, sliderChanged: true }
		})
	}

	setVideoThumb = (i) => (url, title) => {
		this.setState((prevState) => {
			const thumbUrl = { ...prevState.thumbUrl }
			const alt = { ...prevState.alt }

			thumbUrl[i] = url
			alt[i] = title

			return { thumbUrl, alt }
		})
	}

	renderSlide = (slide, i) => {
		const {
			aspectRatio,
			maxHeight,
			zoomMode,
			zoomFactor,
			ModalZoomElement,
			zoomProps: legacyZoomProps,
		} = this.props
		// Backwards compatibility
		const { zoomType: legacyZoomType } = legacyZoomProps || {}
		const isZoomDisabled =
			legacyZoomType === 'no-zoom' || zoomMode === 'disabled'
		switch (slide.type) {
			case 'image':
				return (
					<ProductImage
						index={i}
						src={slide.url}
						alt={slide.alt}
						maxHeight={maxHeight}
						zoomFactor={zoomFactor}
						aspectRatio={aspectRatio}
						ModalZoomElement={ModalZoomElement}
						zoomMode={isMobile() || isZoomDisabled ? 'disabled' : zoomMode}
						isModal={this.props.isChild}
					/>
				)

			case 'video':
				return (
					<Video
						url={slide.src}
						setThumb={this.setVideoThumb(i)}
						playing={i === this.state.activeIndex}
						id={i}
						isModal={this.props.isChild}
					/>
				)
			default:
				return null
		}
	}

	get galleryParams() {
		const { handles, slides = [], showPaginationDots = true } = this.props

		const params = {}

		if (slides.length > 1 && showPaginationDots) {
			params.pagination = {
				el: `.${styles['swiper-pagination']}`,
				clickable: true,
				clickableClass: styles.swiperPaginationClickable,
				bulletClass: styles.swiperBullet,
				bulletActiveClass: styles['swiperBullet--active'],
				renderBullet(_index, className) {
					return `<span class="${className} c-action-primary"></span>`
				},
			}
		}

		if (slides.length > 1) {
			params.navigation = {
				prevEl: '.swiper-caret-prev',
				nextEl: '.swiper-caret-next',
				disabledClass: `c-disabled ${styles.carouselCursorDefault}`,
			}
		}

		params.thumbs = {
			swiper: this.state.thumbSwiper,
			multipleActiveThumbs: false,
			slideThumbActiveClass: handles.productImagesThumbActive,
		}

		return params
	}

	reDoVideo() {
		// let videos = this.retriveAllVideoId()
		// this.integrateVideoThron(videos)
		console.log("qua")
		// this.state.gallerySwiper.slideTo(
		// 	JSON.parse(localStorage?.getItem('videoIndex')).activeIndex,
		// )
	}

	render() {
		const {
			aspectRatio,
			maxHeight,
			placeholder,
			position,
			handles,
			slides = [],
			thumbnailMaxHeight,
			thumbnailAspectRatio,
			thumbnailsOrientation,
			zoomProps: { zoomType },
			showPaginationDots = true,
			showNavigationArrows = true,
			displayThumbnailsArrows = false,
		} = this.props

		const hasSlides = slides && slides.length > 0

		const isModalState = this.state.isModal

		const isThumbsVertical =
			thumbnailsOrientation === THUMBS_ORIENTATION.VERTICAL

		const hasThumbs = slides && slides.length > 1

		const galleryCursor = {
			'in-page': styles.carouselGaleryCursor,
			'no-zoom': '',
		}

		const imageClasses = classNames(
			'w-100 border-box',
			galleryCursor[hasSlides ? zoomType : 'no-zoom'],
			{
				'ml-20-ns w-80-ns pl5-ns':
					isThumbsVertical &&
					position === THUMBS_POSITION_HORIZONTAL.LEFT &&
					(hasThumbs || !hasSlides),
				'mr-20-ns w-80-ns pr5-ns':
					isThumbsVertical &&
					position === THUMBS_POSITION_HORIZONTAL.RIGHT &&
					(hasThumbs || !hasSlides),
			},
		)

		if (!hasSlides) {
			return (
				<div className={imageClasses}>
					{placeholder ? (
						<ProductImage
							src={placeholder}
							alt="Product image placeholder"
							maxHeight={maxHeight}
							aspectRatio={aspectRatio}
							zoomMode="disabled"
						/>
					) : (
						<ImagePlaceholder />
					)}
				</div>
			)
		}

		const containerClasses = classNames(
			handles.carouselContainer,
			'relative overflow-hidden w-100',
			{
				'flex-ns justify-end-ns':
					isThumbsVertical &&
					position === THUMBS_POSITION_HORIZONTAL.LEFT &&
					hasThumbs,
				'flex-ns justify-start-ns':
					isThumbsVertical &&
					position === THUMBS_POSITION_HORIZONTAL.RIGHT &&
					hasThumbs,
			},
		)

		const thumbnailSwiper = (
			<ThumbnailSwiper
				onSwiper={(instance) => this.setState({ thumbSwiper: instance })}
				isThumbsVertical={isThumbsVertical}
				thumbnailAspectRatio={thumbnailAspectRatio}
				thumbnailMaxHeight={thumbnailMaxHeight}
				thumbUrls={this.state.thumbUrl}
				displayThumbnailsArrows={true}
				slides={slides}
				position={position}
			/>
		)

		const setIsModal = () => {
			this.setState({ isModal: !this.state.isModal })
		}

		const modalSwiper = (
			<ModalCarousel
				slides={this.props.slides}
				placeholder={this.props.placeholder}
				position={this.props.position}
				zoomMode={this.props.zoomMode}
				maxHeight={this.props.maxHeight}
				zoomFactor={this.props.zoomFactor}
				aspectRatio={this.props.aspectRatio}
				ModalZoomElement={this.props.ModalZoomElement}
				thumbnailMaxHeight={this.props.thumbnailMaxHeight}
				showPaginationDots={this.props.showPaginationDots}
				thumbnailAspectRatio={this.props.thumbnailAspectRatio}
				showNavigationArrows={this.props.showNavigationArrows}
				thumbnailsOrientation={this.props.thumbnailsOrientation}
				displayThumbnailsArrows={this.props.displayThumbnailsArrows}
				zoomProps={this.props.zoomProps}
				isVisible={this.state.isModal}
				setClose={setIsModal}
				thronPlayers={this.state.thronPlayers}
				parentVideoPlayer={this.reDoVideo}
				state={this.state.activeIndex}
			/>
		)

		const handleClick = (src) => {
			if (isMobile()) {
				src && handleClickAnal({ isVideo: false, url: src })
				this.setState({ isModal: !this.state.isModal })
				document.body.style.overflow = 'hidden'
				document.body.style.height = '100%'
			}
		}

		const handleClickImage = (type, slide) => {
			!this.props.isChild && type == 'image' && handleClick(slide.url)
		}

		const getChildCss = () => {
			return this.props.isChild == true ? ' ' + styles.modalCarousel : ''
		}

		return (
			<>
				{isModalState && modalSwiper}
				<div className={containerClasses} aria-hidden="true">
					{isThumbsVertical && thumbnailSwiper}

					<div className={imageClasses}>
						{/* {!this.props.isChild && isMobile() && (
							<img
								src={IconFullScreen}
								onClick={() => {
									handleClick()
								}}
								className={styles.modalTrigger}
							/>
						)} */}
						<Swiper
							onSwiper={(instance) =>
								this.setState({ gallerySwiper: instance })
							}
							className={
								handles.productImagesGallerySwiperContainer + getChildCss()
							}
							threshold={10}
							resistanceRatio={slides.length > 1 ? 0.85 : 0}
							onSlideChange={this.handleSlideChange}
							updateOnWindowResize
							{...this.galleryParams}
						>
							{slides.map((slide, i) => (
								<SwiperSlide
									key={`slider-${i}`}
									className={`${handles.productImagesGallerySlide} swiper-slide center-all`}
									onClick={() => {
										handleClickImage(slide.type, slide)
									}}
								>
									{this.renderSlide(slide, i)}
								</SwiperSlide>
							))}

							<div
								key="pagination"
								className={classNames(styles['swiper-pagination'], {
									dn: slides.length === 1 || !showPaginationDots,
								})}
							/>

							<div
								className={classNames({
									dn: slides.length === 1 || !showNavigationArrows,
								})}
							>
								<span
									key="caret-next"
									className={`swiper-caret-next pl7 pr2 right-0 ${CARET_CLASSNAME} ${handles.swiperCaret} ${handles.swiperCaretNext}`}
								>
									<IconCaret
										orientation="right"
										size={CARET_ICON_SIZE}
										className={styles.carouselIconCaretRight}
									/>
								</span>
								<span
									key="caret-prev"
									className={`swiper-caret-prev pr7 pl2 left-0 ${CARET_CLASSNAME} ${handles.swiperCaret} ${handles.swiperCaretPrev}`}
								>
									<IconCaret
										orientation="left"
										size={CARET_ICON_SIZE}
										className={styles.carouselIconCaretLeft}
									/>
								</span>
							</div>
						</Swiper>

						{!isThumbsVertical && thumbnailSwiper}
					</div>
				</div>
			</>
		)
	}
}

Carousel.propTypes = {
	slides: PropTypes.arrayOf(
		PropTypes.shape({
			type: PropTypes.string,
			url: PropTypes.string,
			alt: PropTypes.string,
			thumbUrl: PropTypes.string,
			bestUrlIndex: PropTypes.number,
		}),
	),
	ModalZoomElement: PropTypes.any,
	displayThumbnailsArrows: PropTypes.bool,
}

export default withCssHandles(CSS_HANDLES)(Carousel)
