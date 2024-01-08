import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { ExtensionPoint } from 'vtex.render-runtime'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { ButtonWithIcon, IconClear, IconPlusLines } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'

interface Props {
	product: Product
	index: number
	hidden?: boolean
	hideChangeAction?: boolean
	onDeleteOrAdd: (index: number) => void
	onProductClick: (product: Product) => void
}

const CSS_HANDLES = ['disabledProduct']

const ProductSummaryWithActions: StorefrontFunctionComponent<Props> = ({
	product,
	index,
	hidden,
	hideChangeAction,
	onDeleteOrAdd,
	onProductClick,
}) => {
	const normalizedProduct = useMemo(
		() => ProductSummary.mapCatalogProductToProductSummary(product),
		[product],
	)
	const handles = useCssHandles(CSS_HANDLES)
	return (
		<div className="w-100 w-20-l">
			{!hideChangeAction && (
				<div className="tc nowrap mb3">
					<ButtonWithIcon
						icon={hidden ? <IconPlusLines /> : <IconClear />}
						variation="tertiary"
						onClick={() => onDeleteOrAdd(index)}
					>
						{hidden ? (
							<FormattedMessage id={'store/shelf.buy-together.add.label'} />
						) : (
							<FormattedMessage id={'store/shelf.buy-together.remove.label'} />
						)}
					</ButtonWithIcon>
				</div>
			)}
			<div className={`${hidden && handles.disabledProduct}`}>
				<ExtensionPoint
					id="product-summary"
					product={normalizedProduct}
					actionOnClick={() => onProductClick(normalizedProduct)}
				/>
			</div>
		</div>
	)
}

export default ProductSummaryWithActions
