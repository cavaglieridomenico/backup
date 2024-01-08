import { path, pick } from 'ramda'
import React, { useMemo, useEffect, useState } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { useResponsiveValues } from 'vtex.responsive-values'
import ProductImages from '.'
import { THUMBS_ORIENTATION, THUMBS_POSITION_HORIZONTAL } from './utils/enums'
import generateImageConfig from './utils/generateImageConfig'

const ProductImagesWrapper = props => {
	const [isDivPresent, setIsDivPresent] = useState(false)
	const valuesFromContext = useProduct() || {}
	const {
		aspectRatio,
		maxHeight,
		showNavigationArrows,
		showPaginationDots,
		contentOrder,
		placeholder,
	} = useResponsiveValues(
		pick(
			[
				'aspectRatio',
				'maxHeight',
				'showNavigationArrows',
				'showPaginationDots',
				'contentOrder',
				'placeholder',
			],
			props,
		),
	)

	const { selectedItem, skuSelector, product } = valuesFromContext

	const [navArrow, setNavArrow] = useState(showNavigationArrows)

	const images = useMemo(() => {
		if (props.images != null) {
			return props.images
		}

		let imagePaths

		// if there's a image sku defined
		if (
			product &&
			product.items &&
			skuSelector &&
			skuSelector.selectedImageVariationSKU
		) {
			const skuItem = product.items.find(
				sku => sku.itemId === skuSelector.selectedImageVariationSKU,
			)

			if (skuItem) {
				imagePaths = skuItem.images
			}
		}

		if (!imagePaths && selectedItem) {
			imagePaths = selectedItem.images
		}

		return (imagePaths || []).map(generateImageConfig)
	}, [props.images, product, skuSelector, selectedItem])

	const videos = useMemo(
		() =>
			props.videos != null
				? props.videos
				: path(['videos'], selectedItem) || [],
		[props.videos, selectedItem],
	)


	useEffect(() =>{
		setNavArrow(window.matchMedia && window.matchMedia("(max-width: 680px)").matches ? true : showNavigationArrows)
	},[window.matchMedia])


	//const navArrow = isMobile() ? true : showNavigationArrows

useEffect(() => {
  if(typeof document != undefined){
	 const divToAppend =  document?.getElementsByClassName("swiper-container-initialized")
	 console.log(divToAppend, "divToAppend length") 
	 if(divToAppend){
		 setIsDivPresent(true)
	 }
  }
}, [typeof document])

	console.log(isDivPresent, "isDivPresent")
	console.log(images?.length, "images")

	return (
		<>
		{ isDivPresent && images.length > 0 &&
			<ProductImages
				images={images}
				videos={videos}
				hiddenImages={props.hiddenImages}
				placeholder={placeholder}
				// thumbnailPosition is a legacy prop from product-details
				position={props.position || props.thumbnailPosition}
				displayThumbnailsArrows={props.displayThumbnailsArrows}
				thumbnailsOrientation={props.thumbnailsOrientation}
				zoomMode={props.zoomMode}
				zoomFactor={props.zoomFactor}
				aspectRatio={aspectRatio}
				maxHeight={maxHeight}
				thumbnailAspectRatio={props.thumbnailAspectRatio}
				thumbnailMaxHeight={props.thumbnailMaxHeight}
				showNavigationArrows={navArrow}
				showPaginationDots={showPaginationDots}
				contentOrder={contentOrder}
				ModalZoomElement={props.ModalZoom}
				contentType={props.contentType}
				// Deprecated
				zoomProps={props.zoomProps}
				displayMode={props.displayMode}
				className={'vtex__ProductImagesWrapper'}
			/>
		}
		</>
	)
}

ProductImagesWrapper.getSchema = ({ zoomProps: { zoomType } = {} }) => ({
	title: 'admin/editor.product-images.title',
	description: 'admin/editor.product-images.description',
	type: 'object',
	properties: {
		zoomProps: {
			title: 'admin/editor.product-images.zoomOptions.title',
			type: 'object',
			properties: {
				zoomType: {
					title: 'admin/editor.product-images.zoomType.title',
					type: 'string',
					enum: ['gallery', 'in-page', 'no-zoom'],
					enumNames: [
						'admin/editor.product-images.gallery',
						'admin/editor.product-images.in-page',
						'admin/editor.product-images.no-zoom',
					],
					widget: {
						'ui:options': {
							inline: false,
						},
						'ui:widget': 'radio',
					},
					default: 'no-zoom',
				},
				...(zoomType === 'gallery' && {
					bgOpacity: {
						title: 'admin/editor.product-images.bgopacity.title',
						type: 'number',
						minimum: 0.0,
						maximum: 1.0,
						multipleOf: 0.01,
						default: 0.8,
					},
				}),
			},
		},
		thumbnailsOrientation: {
			title: 'admin/editor.product-images.thumbnailsOrientation.title',
			type: 'string',
			enum: [THUMBS_ORIENTATION.VERTICAL, THUMBS_ORIENTATION.HORIZONTAL],
			enumNames: [
				'admin/editor.product-images.vertical',
				'admin/editor.product-images.horizontal',
			],
			widget: {
				'ui:options': {
					inline: false,
				},
				'ui:widget': 'radio',
			},
			default: THUMBS_ORIENTATION.VERTICAL,
			isLayout: true,
		},
		position: {
			title: 'admin/editor.product-images.position.title',
			description: 'admin/editor.product-images.position.description',
			type: 'string',
			enum: [THUMBS_POSITION_HORIZONTAL.LEFT, THUMBS_POSITION_HORIZONTAL.RIGHT],
			enumNames: [
				'admin/editor.product-images.left',
				'admin/editor.product-images.right',
			],
			widget: {
				'ui:options': {
					inline: false,
				},
				'ui:widget': 'radio',
			},
			default: THUMBS_POSITION_HORIZONTAL.LEFT,
			isLayout: true,
		},
		displayThumbnailsArrows: {
			title: 'admin/editor.product-images.displayThumbnailsArrows.title',
			type: 'boolean',
			default: false,
			isLayout: true,
		},
	},
})

export default ProductImagesWrapper