import React from "react"
import { Input, Spinner } from "vtex.styleguide"
import style from "../steps/profile/profile.css"
import { useProfile } from "../steps/profile/context/ProfileContext"
import { useIntl, defineMessages } from "react-intl"
import anonimize from "../../graphql/anonimize.graphql"
import { useMutation } from "react-apollo"

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

const ProfileEmailField: React.FC<ProfileEmailFieldProps> = ({ }) => {
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
	/*--- ANONIMIZE MUTATION ---*/
	const changeToAnon = () => {
		changeToAnonymous({
			variables: { orderFormId: orderForm.orderFormId },
		})
	}

	const [changeToAnonymous]: any = useMutation(anonimize, {
		onCompleted() {
			window.location.reload()
		},
	})

	return (
		<div
			className={style.profileInput}
			data-testid="profile-first-name-wrapper"
		>
			<Input
				label={`${intl.formatMessage(messages.email)} *`}
				name="email"
				type="text"
				disabled={loggedIn}
				value={values?.email.trim()}
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
			{loggedIn &&
				<div
					onClick={() => {
						fetch("/no-cache/user/logout").then(() => {
							changeToAnon()
						})
					}}
					className={style.profileEmailLogout + " t-mini c-action-primary"}>
					Logout to change
				</div>}
		</div>
	)
}

export default ProfileEmailField
