import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import styles from './ProductSpecificationsWithRules.css'
import { useProduct, SpecificationGroup } from 'vtex.product-context'
interface ProductSpecificationsWithRulesProps {
	groupName: string
	filter?: {
		type: 'hide' | 'show'
		specificationGroups: string[]
	}
}
interface FieldDataModel {
	Name: string
	Description: string
}
const defaultFilter: ProductSpecificationsWithRulesProps['filter'] = {
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
enum SpecType {
	both = '1',
	nameOnly = '2',
	hide = '3',
}
interface SpecificationWithType extends Specification {
	type: SpecType
}
const ProductSpecificationsWithRules: StorefrontFunctionComponent<ProductSpecificationsWithRulesProps> = ({
	filter = defaultFilter,
}) => {
	const [enrichedGroups, setEnrichedGroups] = useState(
		[] as Array<SpecificationGroup>,
	)
	const { product } = useProduct()
	if (!product) {
		return null
	}
	const itemId = product.items[0] && product.items[0].itemId
	const { type, specificationGroups: filterSpecificationGroups } = filter
	const specificationGroups = product?.specificationGroups ?? []
	let specTypes: Dictionary<SpecType> = {}
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
		groups
		const tempEnrichedGroups: Array<SpecificationGroup> = groups.map(
			(grp: SpecificationGroup) => {
				const oldSpecs: Array<Specification> = grp['specifications']
				const newSpecs: Array<SpecificationWithType> = oldSpecs?.map((sp) => ({
					...sp,
					type: SpecType.both,
				}))
				return {
					...grp,
					specifications: newSpecs,
				}
			},
		)
		console.log('abracadabra groups', groups, tempEnrichedGroups) //not yet really enriched
		let fieldsIds: Array<string> = []
		fetch(`/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/${itemId}`, {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			method: 'GET',
		})
			.then((response) => response.json())
			.then((json) => {
				fieldsIds =
					json &&
					json.ProductSpecifications &&
					json.ProductSpecifications.length &&
					json.ProductSpecifications.filter((spec: any) =>
						filterSpecificationGroups.includes(spec.FieldGroupName),
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
						specTypes = {}
						fields.forEach((field: FieldDataModel) => {
							let tempType: SpecType
							switch (field.Description) {
								case '1':
									tempType = SpecType.both
									break
								case '2':
									tempType = SpecType.nameOnly
									break
								case '3':
									tempType = SpecType.hide
									break
								default:
									tempType = SpecType.both
									break
							}
							specTypes[field.Name] = tempType
						})
						setEnrichedGroups(
							tempEnrichedGroups.map((group: SpecificationGroup) => ({
								...group,
								specifications: group.specifications.map(
									(spec: SpecificationWithType) => ({
										...spec,
										type: specTypes[spec.originalName],
									}),
								),
							})),
						)
					})
				}
			})

		return () => {}
	}, [specificationGroups, type, filterSpecificationGroups])

	return (
		<div className={styles.prodSpecContainer}>
			{enrichedGroups.map((group, index, arr) => (
				<div
					className={styles.prodSpecGroup}
					key={`${index} - ${group && group.originalName}`}
				>
					<div className={styles.prodSpecGroupName}>
						<p dangerouslySetInnerHTML={{ __html: group.name }}></p>
					</div>
					<div className={styles.prodSpecsContainer}>
						<ul>
							{group.specifications
								.filter((s: SpecificationWithType) => s.type !== SpecType.hide)
								.map((specification: SpecificationWithType) => (
									<li>
										{specification?.name}
										{specification.type === SpecType.both && (
											<span
												dangerouslySetInnerHTML={{
													__html: `: ${specification.values.join(`.`)}`,
												}}
											></span>
										)}
									</li>
								))}
						</ul>
					</div>
					{arr.length - 1 !== index ? <div className={styles.prodSpecSeparator}></div> : ''}
				</div>
			))}
		</div>
	)
}

ProductSpecificationsWithRules.schema = {
	title: 'editor.product-specifications-with-images.title',
	description: 'editor.product-specifications-with-images.description',
	type: 'object',
	properties: {
		filter: {
			title: 'Filter',
			description: '',
			default: '',
			type: '[string]',
		},
	},
}

export default ProductSpecificationsWithRules
