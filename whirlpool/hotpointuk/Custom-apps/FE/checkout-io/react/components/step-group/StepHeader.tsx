import React from "react"
import { Tooltip, IconInfo, ButtonPlain, IconEdit } from "vtex.styleguide"
import { useHistory } from "react-router"
import style from "./Group.css"
import { useIntl, defineMessages } from "react-intl"
import { getCurrentStep } from "../../utils/routes"

interface StepHeaderProps {
	title: string
	canEditData: boolean
	isSummary?: boolean
	step?: CheckoutStep
	showEditButtonAdditionalChecks?: boolean
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
	showEditButtonAdditionalChecks = true,
}) => {
	const history = useHistory()
	const intl = useIntl()

	const currentStep = getCurrentStep(window)
	const checkOnStep = step ? step.order < currentStep.order : true
	// const handleEditProfile = () => {
	//   history.push(routes.PROFILE.route)
	// }

	const handleEditStep = () => {
		if (step && step.route) {
			history.push(step.route)
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
								{showEditButtonAdditionalChecks && checkOnStep &&(
									<ButtonPlain
										onClick={handleEditStep}
									>
										<IconEdit solid />
										{intl.formatMessage(messages.edit)}
									</ButtonPlain>
								)}

							</div>
						)}
					</span>
				)}
			</div>
		</>
	)
}

export default StepHeader
