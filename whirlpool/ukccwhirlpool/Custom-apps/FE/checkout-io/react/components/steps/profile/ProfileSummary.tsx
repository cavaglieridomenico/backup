import React from "react"
// import { IconCheck } from 'vtex.styleguide'
import { useIntl, defineMessages } from "react-intl"
import StepHeader from "../../step-group/StepHeader"
import { useOrder } from "../../../providers/orderform"
import style from "./profile.css"
import { useHistory } from "react-router"
import { useMutation } from "react-apollo"
import anonimize from "../../../graphql/anonimize.graphql"
import routes from "../../../utils/routes"

const messages = defineMessages({
	profile: {
		defaultMessage: "Profile",
		id: "checkout-io.profile",
	},
	subscribed: {
		defaultMessage: "Subscribed",
		id: "checkout-io.subscribed",
	},
	or: {
		defaultMessage: "or",
		id: "checkout-io.profile-summary.or",
	},
	changeEmail: {
		defaultMessage: "Change Email",
		id: "checkout-io.profile-summary.change-email",
	},
	name: {
		defaultMessage: "Name",
		id: "checkout-io.profile-summary.name",
	},
	email: {
		defaultMessage: "Email",
		id: "checkout-io.profile-summary.email",
	},
	document: {
		defaultMessage: "Document",
		id: "checkout-io.profile-summary.document",
	},
	phone: {
		defaultMessage: "Phone",
		id: "checkout-io.profile-summary.phone",
	},
})

const ProfileSummary: React.FC = ({ children }) => {
	const history = useHistory()
	const intl = useIntl()
	const { orderForm, refreshOrder } = useOrder()

	const {
		clientProfileData,
		// clientPreferencesData,
		customData,
		canEditData,
	} = orderForm

	const firstName = clientProfileData ? clientProfileData.firstName : null
	const lastName = clientProfileData ? clientProfileData.lastName : null
	const document = clientProfileData ? clientProfileData.document : null
	const documentType = clientProfileData ? clientProfileData.documentType : null
	const phone = clientProfileData ? clientProfileData.phone : null
	const email = clientProfileData?.email?.includes("fake")
		? customData?.customApps?.find((item: any) => item.id == "profile")?.fields
				.email
		: clientProfileData?.email

	const SummaryLogin = (children as any)?.find(
		(child: any) => child.props.id == "login#checkout",
	)

	/*--- ANONIMIZE MUTATION ---*/
	const changeToAnon = () => {
		changeToAnonymous({
			variables: { orderFormId: orderForm.orderFormId },
		})
	}

	const [changeToAnonymous]: any = useMutation(anonimize, {
		onCompleted() {
			refreshOrder()
		},
	})

	const handleChangeEmail = () => {
		changeToAnon()
		history.push(routes.PROFILE)
	}

	return (
		<>
			<div className={style.StepHeader}>
				<StepHeader
					title={intl.formatMessage(messages.profile)}
					canEditData={canEditData}
					isSummary={true}
					step={"profile"}
				/>
			</div>
			<div className={`${style.profileSummaryContainer} bg-checkout`}>
				<div className={`${style.profileSummaryEmail} flex mb4`}>
					<span
						className={`${style.profileSummaryLabel} ${style.profileSummaryLabelNoMargin}`}
					>
						{`${intl.formatMessage(messages.email)}: ${email}`}
					</span>
					{!canEditData && (
						<div className={style.signInContainerSummary}>
							{SummaryLogin}
							<span className={style.signInORSummary}>
								{intl.formatMessage(messages.or)}
							</span>
							<span
								className={style.signInChangeEmailSummary}
								onClick={handleChangeEmail}
							>
								{intl.formatMessage(messages.changeEmail)}
							</span>
						</div>
					)}
				</div>
				{(firstName || lastName) && (
					<div className={style.profileSummaryLabel}>
						{`${intl.formatMessage(messages.name)}: ${firstName || ""} ${
							lastName || ""
						}`}
					</div>
				)}
				{(document || documentType) && (
					<div className={style.profileSummaryLabel}>
						{`${intl.formatMessage(messages.document)}: ${documentType ?? ""} ${
							document ?? ""
						}`}
					</div>
				)}
				{phone && (
					<div className={style.profileSummaryLabel}>{`${intl.formatMessage(
						messages.phone,
					)}: ${phone}`}</div>
				)}
				{/* {clientPreferencesData.optinNewsLetter && (
          <div className="flex flex-column flex-row-ns mt4">
            <span className="inlineBlock">
              <IconCheck /> {intl.formatMessage(messages.subscribed)}
            </span>
          </div>
        )} */}
			</div>
		</>
	)
}

export default ProfileSummary
