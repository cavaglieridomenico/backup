import React from "react"
import { Switch, Route } from "react-router"
import routes from "../../../../utils/routes"
import Step from "../../../checkout/step-group/Step"
import { useOrder } from "../../../../providers/orderform"

interface ProfileStepProps {
	children: any[]
}

const ProfileStep: React.FC<ProfileStepProps> = ({ children }) => {
	const { orderLoading } = useOrder()

	const ProfileForm = children?.find(
		(child: any) => child.props.id == "profile-form",
	)
	const ProfileSummary = children?.find(
		(child: any) => child.props.id == "profile-summary",
	)

	return (
		<>
			{!orderLoading && (
				<Step>
					<Switch>
						<Route path={routes.PROFILE.route}>{ProfileForm}</Route>
						<Route path="*">{ProfileSummary}</Route>
					</Switch>
				</Step>
			)}
		</>
	)
}

export default ProfileStep
