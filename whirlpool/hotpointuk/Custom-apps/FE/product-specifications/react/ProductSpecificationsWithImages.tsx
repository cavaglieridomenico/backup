import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import styles from './ProductSpecificationsWithImages.css'
import { useProduct, SpecificationGroup } from 'vtex.product-context'
// import ReadMore from './ReadMore'
import xss from 'xss'

interface FieldDataModel {
	Name: string
	Description: string
}
interface ProductSpecificationsWithImagesProps {
	groupName: string
	defaultImage: string
	filter?: {
		type: 'hide' | 'show'
		specificationGroups: string[]
	}
}
const defaultFilter: ProductSpecificationsWithImagesProps['filter'] = {
	type: 'hide',
	specificationGroups: [],
}
interface Specification {
	FieldName: string
	originalName: string
	FieldValues: Array<string>
	__typename: string
}
interface Dictionary<T> {
	[key: string]: T
}
interface SpecificationWithImage extends Specification {
	src: string
}
const ProductSpecificationsWithImages: StorefrontFunctionComponent<ProductSpecificationsWithImagesProps> = ({
	groupName = 'RatingGroupAttrLogo',
	defaultImage = '',
	filter = defaultFilter,
}) => {
	const [enrichedSpecsArray, setEnrichedSpecsArray] = useState(
		[] as Array<SpecificationWithImage>,
	)

	const { product } = useProduct()
	if (!product) {
		return null
	}
	const itemId = product.items[0] && product.items[0].itemId
	const { type, specificationGroups: filterSpecificationGroups } = filter
	const specificationGroups = product?.specificationGroups ?? []
	const addDefaultSrc = (ev: any, specName: string) => {
		console.error(`Unable to load image for product specification named "${specName}"`)
		if (!!defaultImage) {
			ev.target.src = defaultImage
		}
	}
	const isLeft = (index: number) => {
		return index % 2 !== 0
	}
	const getBorderStyle = (length: number, index: number) => {
		if ((length - 2 == index || length - 1 == index) && (isLeft(index + 1))) { //penultimo o ultimo a sinistra
			return
		} else if ((length - 2 == index || length - 1 == index) && (!isLeft(index + 1))) { // penultimo o ultimo a destra
			return styles.noBorderLeft
		}
		return (index + 1) % 2 == 0 ? styles.noBorderLeftBottom : styles.noBorderBottom
	}
	let srcUrls: Dictionary<string> = {}
	useEffect(() => {

		fetch(`/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/${itemId}`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'GET',
		})
			.then((response) => response.json())
			.then((json) => {
				const groups: Array<SpecificationGroup> = json.ProductSpecifications.filter(
					(group: SpecificationGroup) => {
				  	return group.FieldGroupName === "RatingGroupAttrLogo"
					},
				)
				
				let fieldsIds: Array<string> = []
				fieldsIds =
					json &&
					json.ProductSpecifications &&
					json.ProductSpecifications.length &&
					json.ProductSpecifications.filter(
						(spec: any) => spec.FieldGroupName === groupName,
					).map((prodSpec: any) => prodSpec.FieldId)

				if (fieldsIds && fieldsIds.length) {
					const fieldsUrls = fieldsIds.map((id) =>
						'/api/catalog_system/pub/specification/fieldGet/'.concat(id),
					)
					Promise.all(
						fieldsUrls.map((u) =>
							fetch(u, {
								method: 'GET',
							}).then((resp) => resp.json()),
						),
					).then((fields) => {
						srcUrls = {}
						fields.forEach((field: FieldDataModel) => {
							srcUrls[field.Name] = field.Description
						})
						if (groups && groups.length > 0) {
							const tempEnrichedSpecs: Array<SpecificationWithImage> = []
								; (groups as Array<Specification>).forEach(
									(spec: Specification) => {
										tempEnrichedSpecs.push({
											...spec,
											src: xss(srcUrls[spec.FieldName]),
										})
									},
								)
							setEnrichedSpecsArray(tempEnrichedSpecs)
						}
					})
				}
			})
		return () => { }
	}, [specificationGroups, type, filterSpecificationGroups])

	useEffect(() => {
		let featuresRichText = document.getElementsByClassName('vtex-rich-text-0-x-container--features') as HTMLCollectionOf<HTMLElement>
		let featuresMenuItems = document.getElementsByClassName('vtex-menu-2-x-menuItem--features') as HTMLCollectionOf<HTMLElement>

		if (featuresRichText.length && featuresMenuItems.length) {
			if (enrichedSpecsArray.length === 0) {
				featuresRichText[0].style.display = 'none'
				for (let i = 0; i < featuresMenuItems.length; i++) {
					featuresMenuItems[i].style.display = 'none'
				}
			} else {
				featuresRichText[0].style.display = ''
				for (let i = 0; i < featuresMenuItems.length; i++) {
					featuresMenuItems[i].style.display = ''
				}
			}
		}
	})

	return (
		<div className={styles.prodSpecContainer}>
			{enrichedSpecsArray && enrichedSpecsArray.map((spec, index) => (
				<div
					className={styles.prodSpecItem + ' ' + getBorderStyle(enrichedSpecsArray.length, index)}
					key={`${index} - ${spec && spec.FieldName}${!(spec && spec.src) && ' (without image)'
						}`}
				>
					<div className={styles.left}>
						{spec && spec.src && (
							<img onError={(e) => addDefaultSrc(e, spec.FieldName)} src={spec && spec.src} />
						)}
					</div>
					<div className={styles.right}>
						<p className={styles.title}>{spec && spec.FieldName}</p>
						{spec &&
							spec.FieldValues.map((val, valueIndex) => (
								<p
									className={styles.text}
									key={`${index}/${valueIndex} - ${val.substr(0, 10)}...`}
								>
									{val}
									{/* <span dangerouslySetInnerHTML={{ __html: val }}></span> */}
								</p>
							))}
					</div>
				</div>
			))}
		</div>
	)
}

ProductSpecificationsWithImages.schema = {
	title: 'editor.product-specifications-with-images.title',
	description: 'editor.product-specifications-with-images.description',
	type: 'object',
	properties: {
		groupName: {
			title: 'Group name',
			description: `The specification group 'name' field to be searched that contains both the groups and the images URLs`,
			default: 'RatingGroupAttrLogo',
			type: 'string',
		},
		defaultImage: {
			title: 'Default image URL',
			description: 'Provide a fixed URL to load whenever the images are not provided or fail to load',
			default: '',
			type: 'string',
		},
	},
}

export default ProductSpecificationsWithImages
