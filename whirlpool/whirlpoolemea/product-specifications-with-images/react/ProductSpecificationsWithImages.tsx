import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import styles from './ProductSpecificationsWithImages.css'
import { useProduct, SpecificationGroup } from 'vtex.product-context'
import ReadMore from './ReadMore'
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
	name: string
	originalName: string
	values: Array<string>
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

	const brand = product.brand === "Whirlpool" ? "WP" : product.brand === "Hotpoint" ? "HP" : "ID";

	const itemId = product.items[0] && product.items[0].itemId

	const { type, specificationGroups: filterSpecificationGroups } = filter

	const specificationGroups = product?.specificationGroups ?? []

	const addDefaultSrc = (ev: any, specName: string) => {
		console.error(
			`Unable to load image for product specification named "${specName}"`,
		)
		if (!!defaultImage) {
			ev.target.src = defaultImage
		}
	}

	const isLeft = (index: number) => {
		return index % 2 !== 0
	}

	const getBorderStyle = (length: number, index: number) => {
		if ((length - 2 == index || length - 1 == index) && isLeft(index + 1)) {
			//penultimo o ultimo a sinistra
			return
		} else if (
			(length - 2 == index || length - 1 == index) &&
			!isLeft(index + 1)
		) {
			// penultimo o ultimo a destra
			return styles.noBorderLeft
		}
		return (index + 1) % 2 == 0
			? styles.noBorderLeftBottom
			: styles.noBorderBottom
	}

	let srcUrls: Dictionary<string> = {}
	useEffect(() => {
		const groups: Array<SpecificationGroup> = specificationGroups.filter(
			(group: SpecificationGroup) => {
				if (group.originalName === 'allSpecifications') {
					return false
				}
				const hasGroup = filterSpecificationGroups.includes(group.originalName)
				if ((type === 'hide' && hasGroup) || (type === 'show' && !hasGroup)) {
					return false
				}
				return true
			},
		)
		const targetGrp: SpecificationGroup = groups.find((grp: any) => {
			return grp && grp.name.indexOf(groupName) >= 0
		})
		let fieldsIds: Array<string> = []
		fetch(`/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/${itemId}`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'GET',
		})
			.then(response => response.json())
			.then(json => {
				fieldsIds =
					json &&
					json.ProductSpecifications &&
					json.ProductSpecifications.length &&
					json.ProductSpecifications.filter(
						(spec: any) => spec.FieldGroupName === groupName,
					).map((prodSpec: any) => prodSpec.FieldId)

				if (fieldsIds && fieldsIds.length) {
					const fieldsUrls = fieldsIds.map(id =>
						'/api/catalog_system/pub/specification/fieldGet/'.concat(id),
					)
					Promise.all(
						fieldsUrls.map(u =>
							fetch(u, {
								method: 'GET',
							}).then(resp => resp.json()),
						),
					).then(fields => {
						srcUrls = {}
						fields.forEach((field: FieldDataModel) => {
							if (checkParseJson(field.Description)) {
								const description = JSON.parse(field.Description);
								const idBrand = Object.keys(description).find((el: string) => el === brand);
								const descriptionValue = idBrand ? description[idBrand] : description;
								srcUrls[field.Name] = descriptionValue?.replace('PNG', 'WEBP');
							} else {
								const description = field.Description;
								srcUrls[field.Name] = description?.replace('PNG', 'WEBP');
							}
						})
						if (targetGrp && targetGrp.specifications) {
							const tempEnrichedSpecs: Array<SpecificationWithImage> = []
							;(targetGrp.specifications as Array<Specification>).forEach(
								(spec: Specification) => {
									tempEnrichedSpecs.push({
										...spec,
										src: xss(srcUrls[spec.name]),
									})
								},
							)

							setEnrichedSpecsArray(tempEnrichedSpecs)
						}
					})
				}
			})
		return () => {}
	}, [specificationGroups, type, filterSpecificationGroups])

	function checkParseJson(description: any) {
		try {
			JSON.parse(description);
			return true;
		} catch {
			return false;
		}
	}
	return (
		<div className={styles.prodSpecContainer}>
			{enrichedSpecsArray.map((spec, index) => (
				<div
					id={spec.name.toLowerCase().replace(/\s/g, '-')}
					className={
						styles.prodSpecItem +
						' ' +
						getBorderStyle(enrichedSpecsArray.length, index)
					}
					key={`${index} - ${spec && spec.name}${!(spec && spec.src) &&
						' (without image)'}`}
				>
					<div className={styles.left}>
						{spec && spec.src && (
							<img
								className={styles.specificationImage}
								onError={e => addDefaultSrc(e, spec.name)}
								src={spec && spec.src}
								loading="lazy"
								fetchpriority="low"
							/>
						)}
					</div>
					<div className={styles.right}>
						<p className={styles.title}>{spec && spec.name}</p>
						{spec &&
							spec.values.map((val, valueIndex) => (
								<p
									className={styles.text}
									key={`${index}/${valueIndex} - ${val.substr(0, 10)}...`}
								>
									<ReadMore
										text={val}
										//data={spec}
										// context={product}
										// matchId={spec.name.toLowerCase().replace(/\s/g, '-')}
									></ReadMore>
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
			title: 'editor.groupName.title',
			description: 'editor.groupName.description',
			default: 'RatingGroupAttrLogo',
			type: 'string',
		},
		defaultImage: {
			title: 'editor.defaultImage.title',
			description: 'editor.defaultImage.description',
			default: '',
			type: 'string',
		},
	},
}

export default ProductSpecificationsWithImages
