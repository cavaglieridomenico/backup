import React from "react"
import { Tooltip, IconInfo, ButtonPlain, IconEdit } from "vtex.styleguide"
import { useHistory } from "react-router"
import routes from "../../utils/routes"
import style from "./Group.css"
import { useOrder } from "../../providers/orderform"
import { useIntl, defineMessages } from "react-intl"

interface StepHeaderProps {
	title: string
	canEditData: boolean
	isSummary?: boolean
	step?: string
}
const messages = defineMessages({
	edit: {
		defaultMessage: "Edit",
		id: "checkout-io.edit",
	},
})

const StepHeader: React.FC<StepHeaderProps> = ({
	title,
	canEditData,
	isSummary = false,
	step,
}) => {
	const history = useHistory()
	const { orderForm } = useOrder()
	const intl = useIntl()
	// const handleEditProfile = () => {
	//   history.push(routes.PROFILE)
	// }

	const handleEditStep = () => {
		switch (step) {
			case "profile":
				history.push(routes.PROFILE)
				break
			case "shipping":
				history.push(routes.SHIPPING)
				break
			case "payment":
				history.push(routes.PAYMENT)
				break
			default:
				break
		}
	}

	return (
		<>
			<div className={`${style.StepHeader} flex`}>
				{!canEditData ? (
					<span
						className={`${style.StepHeaderText} t-heading-5 w-100 fw6 flex items-center`}
					>
						<span className={`${style.StepHeaderTitleText} ml2 w-70`}>
							{title}
						</span>
						<div className="dib ml4 mt2">
							<Tooltip label="Log-in to modify">
								<span>
									<IconInfo />
								</span>
							</Tooltip>
						</div>
					</span>
				) : (
					<span
						className={`${style.StepHeaderText} t-heading-5 w-100  fw6 flex items-center`}
					>
						<span className={`${style.StepHeaderTitleText} ml2 w-70`}>
							{title}
						</span>

						{isSummary && (
							<div
								className={`${style.editButtonsContainer} dib ml4 underline-hover flex justify-end w-30`}
							>
								{orderForm?.clientProfileData?.email && orderForm?.clientProfileData?.phone && orderForm?.clientProfileData?.firstName && orderForm?.clientProfileData?.lastName &&(
									<ButtonPlain
										onClick={handleEditStep}
									disabled={!orderForm?.clientProfileData?.email}
									>
										<IconEdit solid />
										{intl.formatMessage(messages.edit)}
								</ButtonPlain>)}
							</div>
						)}
					</span>
				)}
			</div>
		</>
	)
}

export default StepHeader
