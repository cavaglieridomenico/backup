import React, { FC, useMemo, useRef } from 'react'
import { Modal } from 'vtex.modal-layout'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'

import Zoomable, { ZoomMode } from './Zoomable'
import { imageUrl } from '../utils/aspectRatioUtil'
import ProductImageContext, {
	State as ProductImageState,
} from './ProductImageContext'

import xss from 'xss'

const IMAGE_SIZES = [600, 800, 1200]
const DEFAULT_SIZE = 800
const MAX_SIZE = 2048

interface Props {
	index: number
	src: string
	alt: string
	zoomMode: ZoomMode
	zoomFactor: number
	aspectRatio?: AspectRatio
	maxHeight?: number | string
	ModalZoomElement?: typeof Modal
	isModal?: boolean
}

type AspectRatio = string | number

const CSS_HANDLES = ['productImage', 'productImageTag', 'productImageModal']

const ProductImage: FC<Props> = ({
	index,
	src,
	alt,
	zoomFactor = 2,
	maxHeight = 600,
	ModalZoomElement,
	aspectRatio = 'auto',
	zoomMode = 'in-place-click',
	isModal = false,
}) => {
	// let src = xss(srcurl)
	const srcSet = useMemo(
		() =>
			IMAGE_SIZES.map(
				size => `${imageUrl(src, size, MAX_SIZE, aspectRatio)} ${size}w`,
			).join(','),
		[src, aspectRatio],
	)

	const { handles } = useCssHandles(CSS_HANDLES)
	const imageRef = useRef(null)

	const imageContext: ProductImageState = useMemo(
		() => ({
			src,
			alt,
		}),
		[alt, src],
	)

	const retriveID = (url: any) => {
		let splitSlash = url.split('/')
		return splitSlash[splitSlash.length - 1].split('.')[0]
	}

	const buildDataSrc = (url: any) => {
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
		<ProductImageContext.Provider value={imageContext}>
			<div className={handles.productImage}>
				<Zoomable
					mode={zoomMode}
					factor={zoomFactor}
					ModalZoomElement={ModalZoomElement}
					zoomContent={
						// eslint-disable-next-line jsx-a11y/alt-text
						<img
							// This img element is just for zoom
							role="presentation"
							src={xss(
								imageUrl(src, DEFAULT_SIZE * zoomFactor, MAX_SIZE, aspectRatio),
							)}
							data-throne-id={xss(buildDataSrc(src))}
							className={
								isModal
									? `${applyModifiers(handles.productImageModal, 'zoom')}`
									: `${applyModifiers(handles.productImageTag, 'zoom')}`
							}
							style={{
								// Resets possible resizing done via CSS
								maxWidth: 'unset',
								width: `${zoomFactor * 100}%`,
								height: isModal ? '20em' : `${zoomFactor * 100}%`,
								objectFit: isModal ? 'cover' : 'contain',
								minHeight: 300,
							}}
							// See comment regarding sizes below
							sizes="(max-width: 64.1rem) 100vw, 50vw"
						/>
					}
				>
					<img
						fetchpriority={index === 0 ? 'high' : 'low'}
						ref={imageRef}
						data-throne-id={xss(buildDataSrc(src))}
						data-vtex-preload={index === 0 ? 'true' : 'false'}
						className={
							isModal
								? `${applyModifiers(handles.productImageModal, 'zoom')}`
								: `${applyModifiers(handles.productImageTag, 'main')}`
						}
						style={{
							width: '100%',
							height: isModal ? '20em' : '100%',
							maxHeight: maxHeight || 'unset',
							objectFit: isModal ? 'cover' : 'contain',
							minHeight: 150,
						}}
						src={xss(imageUrl(src, DEFAULT_SIZE, MAX_SIZE, aspectRatio))}
						srcSet={srcSet}
						alt={alt}
						title={alt}
						loading={index === 0 ? 'eager' : 'lazy'}
						// WIP
						// The value of the "sizes" attribute means: if the window has at most 64.1rem of width,
						// the image will be of a width of 100vw. Otherwise, the
						// image will be 50vw wide.
						// This size is used for picking the best available size
						// given the ones from the srcset above.
						//
						// This is WIP because it is a guess: we are assuming
						// the image will be of a certain size, but it should be
						// probably be gotten from flex-layout or something.
						sizes="(max-width: 64.1rem) 100vw, 50vw"
					/>
				</Zoomable>
			</div>
		</ProductImageContext.Provider>
	)
}

export default ProductImage
