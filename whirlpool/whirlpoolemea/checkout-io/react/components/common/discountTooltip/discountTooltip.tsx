import React from "react"
import { useIntl } from "react-intl"
import style from "./discountTooltip.css"
import { Tooltip, IconInfo } from "vtex.styleguide"
import useOrder from "../../../OrderForm"

/**
 * @returns a simple tooltip with the discounts
 */

interface DiscountTooltipProps {
	discounts: string
}

const DiscountTooltip: StorefrontFunctionComponent<DiscountTooltipProps> = ({
	discounts,
}) => {
	const intl = useIntl()
	const { PERCENTAGE_DISCOUNT } = useOrder()

	return (
		<div className={style.tooltipWrapper}>
			<Tooltip
				label={
					<div className={style.discountTooltipContentContainer}>
						<span className={style.discountTooltipContentTitle}>
							{intl.formatMessage({
								id: "checkout-io.summary.discountTooltipLabel",
							})}
						</span>
						<div className={style.discountTooltipContentDivider}></div>
						<span className={style.discountTooltipContentDesc}>
							{`-${PERCENTAGE_DISCOUNT.toFixed(0)}%`}{" "}
							{intl
								.formatMessage({
									id: "checkout-io.summary.extra-discount",
								})
								.toUpperCase()}{" "}
							{discounts}
						</span>
					</div>
				}
			>
				<span className={`c-on-base pointer ml2 ${style.tooltipIconImg}`}>
					<IconInfo />
				</span>
			</Tooltip>
		</div>
	)
}

export default DiscountTooltip
