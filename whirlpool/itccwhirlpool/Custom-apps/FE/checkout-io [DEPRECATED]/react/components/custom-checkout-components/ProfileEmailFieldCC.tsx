import React from "react"
import { Input, Spinner } from "vtex.styleguide"
import style from "../steps/profile/profile.css"
import { useProfile } from "../steps/profile/context/ProfileContext"
import { LoginContextProvider } from "../steps/profile/context/LoginContext"
import { useIntl, defineMessages } from "react-intl"

import { useOrder } from "../../providers/orderform"

interface ProfileEmailFieldPropsCC {
	children: any
}

const messages = defineMessages({
	email: {
		defaultMessage: "Email",
		id: "checkout-io.email",
	},
})

const ConsumerProfileEmailFieldCC: React.FC<ProfileEmailFieldPropsCC> = ({
	children,
}) => {
	const intl = useIntl()
	const {
		// values,
		handleChangeEmailCC,
		emailCheckControl,
		emailCheckLoading,
		errors,
		isEmailModalOpen,
		resetInput,
		realEmail,
	} = useProfile()
	const { orderForm } = useOrder()
	const { loggedIn } = orderForm
	const EmailModal = children?.find(
		(child: any) =>
			child.props.id == "profile-editable-form.info-data.email-modal",
	)
	const LoginIcon = children?.find(
		(child: any) => child.props.id == "login#checkout-email",
	)
	return (
		<>
			{isEmailModalOpen && EmailModal}
			<div
				className={style.profileInput}
				data-testid="profile-first-name-wrapper"
			>
				<Input
					label={`${intl.formatMessage(messages.email)} *`}
					name="email"
					type="text"
					value={
						loggedIn ? orderForm?.clientProfileData?.email : realEmail?.email
					}
					error={errors?.email}
					disabled={loggedIn}
					errorMessage={errors?.email}
					onChange={(e: any) => {
						handleChangeEmailCC(e), resetInput("email")
					}}
					onBlur={(e: any) => emailCheckControl(e)}
				/>
				{emailCheckLoading && (
					<span className={`${style.emailLoader} c-action-primary absolute`}>
						<Spinner color="currentColor" />
					</span>
				)}
				{loggedIn && (
					<div className={style.profileEmailLogout}>{LoginIcon}</div>
				)}
			</div>
		</>
	)
}

const ProfileEmailFieldCC: React.FC = ({ children }) => {
	return (
		<LoginContextProvider>
			<ConsumerProfileEmailFieldCC children={children} />
		</LoginContextProvider>
	)
}

export default ProfileEmailFieldCC
