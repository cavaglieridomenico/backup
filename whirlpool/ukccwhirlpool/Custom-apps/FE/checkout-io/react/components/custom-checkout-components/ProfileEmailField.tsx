import React from "react"
import { Input, Spinner } from "vtex.styleguide"
import style from "../steps/profile/profile.css"
import { useProfile } from "../steps/profile/context/ProfileContext"
import { useIntl, defineMessages } from "react-intl"

import { useOrder } from "../../providers/orderform"

interface ProfileEmailFieldProps {
	children: any
}

const messages = defineMessages({
	email: {
		defaultMessage: "Email",
		id: "checkout-io.email",
	},
})

const ProfileEmailField: React.FC<ProfileEmailFieldProps> = ({ children }) => {
	const intl = useIntl()
	const {
		values,
		handleChangeInput,
		emailCheckControl,
		emailCheckLoading,
		errors,
		resetInput,
	} = useProfile()
	const { orderForm } = useOrder()
	const { loggedIn } = orderForm
	const LoginIcon = children?.find(
		(child: any) => child.props.id == "login#checkout-email",
	)
	return (
		<div
			className={style.profileInput}
			data-testid="profile-first-name-wrapper"
		>
			<Input
				label={`${intl.formatMessage(messages.email)} *`}
				name="email"
				type="text"
				value={values?.email}
				error={errors?.email}
				errorMessage={errors?.email}
				onChange={(e: any) => {
					handleChangeInput(e), resetInput("email")
				}}
				onBlur={values?.email != "" && emailCheckControl}
			/>
			{emailCheckLoading && (
				<span className="c-action-primary">
					<Spinner color="currentColor" />
				</span>
			)}
			{loggedIn && <div className={style.profileEmailLogout}>{LoginIcon}</div>}
		</div>
	)
}

export default ProfileEmailField
