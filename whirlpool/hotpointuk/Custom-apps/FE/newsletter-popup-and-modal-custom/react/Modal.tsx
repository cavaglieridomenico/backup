import React from 'react'
import { Modal, Button } from 'vtex.styleguide'
import style from './style.css'
import { usePixel } from 'vtex.pixel-manager'

interface idModal {
	time?: number
	textButton?: string
	children?: React.Component
}
interface MyState {
	isModalOpen: boolean
}

function ButtonModale(props: { textButton: string; modalClose: () => void }) {
	const { push } = usePixel()
	return (
		<Button
			onClick={() => {
				push({ event: 'newsletterLink', text: props.textButton })
				props.modalClose()
			}}
		>
			<p className={'vtex-paragraph__newsletter ' + style.paragraph}>
				{props.textButton}
			</p>
		</Button>
	)
}

class ModalNewsletter extends React.Component<idModal, MyState> {
	constructor(props: idModal) {
		super(props)
		this.state = { isModalOpen: false }
		this.handleModalToggle = this.handleModalToggle.bind(this)
		this.modalClose = this.modalClose.bind(this)
	}

	componentDidMount() {
		if (this.props.time !== undefined) {
			//If the pop up must appear automatically
			this.handleModalToggle()
		}

		let img, slideImg, images

		img = document.querySelectorAll('.vtex-rich-text-0-x-image')[0]
		slideImg = document.querySelectorAll(
			'.vtex-store-components-3-x-imageElement--imagePostillaBanner',
		)
		// @ts-ignore
		images = [img, ...slideImg]
		this.setEvents(images)

		// @ts-ignore
		$('.vtex-slider-layout-0-x-sliderLayoutContainer').bind(
			'DOMSubtreeModified',
			() => {
				img = document.querySelectorAll('.vtex-rich-text-0-x-image')[0]
				slideImg = document.querySelectorAll(
					'.vtex-store-components-3-x-imageElement--imagePostillaBanner',
				)
				// @ts-ignore
				images = [img, ...slideImg]
				this.setEvents(images)
			},
		)

		let sliderArrow = document.querySelectorAll(
			'.vtex-slider-layout-0-x-sliderRightArrow--carousel',
		)[0]
		// @ts-ignore
		if (sliderArrow) {
			// @ts-ignore
			$(sliderArrow).click((e: any) => {
				e.preventDefault()
				setTimeout(() => {
					img = document.querySelectorAll('.vtex-rich-text-0-x-image')[0]
					slideImg = document.querySelectorAll(
						'.vtex-store-components-3-x-imageElement--imagePostillaBanner',
					)

					// @ts-ignore
					images = [img, ...slideImg]
					this.setEvents(images)
				}, 300)
			})
		}
	}

	handleModalToggle() {
		if (sessionStorage.getItem('isAlreadyOpen') == null) {
			setTimeout(() => {
				var current = new Date()
				var expiry = new Date('December 31, 2021 07:00:00')
				var expiry2 = new Date('January 02, 2022 07:00:00')
				if (
					current.getTime() < expiry.getTime() ||
					(current.getTime() > expiry.getTime() &&
						current.getTime() > expiry2.getTime())
				) {
					this.setState({ isModalOpen: !this.state.isModalOpen })
					sessionStorage.setItem('isAlreadyOpen', 'true')
				}
			}, (this.props.time || 1) * 2000)
		}
	}

	modalClose() {
		this.setState({ isModalOpen: !this.state.isModalOpen })
	}

	setEvents(images: Array<any>) {
		if (images) {
			images.forEach((image: any) => {
				if (image) {
					let parent = image.closest(
						'.vtex-flex-layout-0-x-flexRowContent--columnPostillaBannerAntonio',
					)
					let btnLink = parent?.querySelector(
						'.hotpointuk-store-link-custom-0-x-buttonLink--bannerButton',
					)

					if (image?.classList?.contains('event-added')) {
						return
					} else {
						image?.classList?.add('event-added')
						btnLink?.classList?.add('event-added')
						if (image?.title?.includes('discount')) {
							// @ts-ignore
							$(image).click((e: any) => {
								this.modalClose()
							})
							// @ts-ignore
							$(btnLink).click(() => {
								this.modalClose()
							})
						}
					}
				}
			})
		}
	}

	render() {
		return (
			<React.Fragment>
				{this.props.textButton !== undefined ? (
					<ButtonModale
						textButton={this.props.textButton ?? ''}
						modalClose={this.modalClose}
					/>
				) : null}
				<Modal
					centered
					isOpen={this.state.isModalOpen}
					onClose={this.modalClose}
				>
					{this.props.children}
				</Modal>
			</React.Fragment>
		)
	}
}

;<ModalNewsletter />

export default ModalNewsletter
