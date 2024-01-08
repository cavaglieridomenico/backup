import React, { useState, useEffect } from "react"
// , { useState }
import style from "../profile.css"
import { useProfile } from "../context/ProfileContext"
import { useLogin } from "../context/LoginContext"
import { useIntl } from "react-intl"
import { Button, Input, InputPassword, Spinner } from "vtex.styleguide"
import loginFormValidation from "../../../custom-checkout-components/loginFormValidation"
import ValidationTootltip from "../../../custom-checkout-components/ValidationTooltip"
import { usePixel } from "vtex.pixel-manager"


interface EmailModalProps {}

const EmailModal: React.FC<EmailModalProps> = ({}) => {
	const intl = useIntl()
	const { push } = usePixel()

	const [isLogin, setIsLogin] = useState(false)
	const [errors, setErrors]: any = useState({})

	const [isTooltipVisible, setTootltipVisible] = useState(false)
	const {
		loginFormValues,
		handleChangeInputLogin,
		loginFormFetch,
		errorMessages,
		upperCaseRegex,
		lowerCaseRegex,
		numberRegex,
		loginFetchResponse,
		isSubmitting,
		setIsSubmitting,
		// setRoute,
		// setPrevPage,
	} = useLogin()

	const { setIsEmailModalOpen, setValues, values } = useProfile()
	const handleShowLogin = () => setIsLogin(!isLogin)

	/*---ERRORS RESET ---*/
	const resetInput = (value: string) => {
		errors[value] && delete errors[value], setErrors({ ...errors })
	}

	/*--- FORM SUBMITTING ---*/
	const handleSubmitLogin = (e: any) => {
		e.preventDefault()
		setErrors(
			loginFormValidation(loginFormValues, errorMessages, {
				upperCaseRegex,
				lowerCaseRegex,
				numberRegex,
			}),
		)
		setIsSubmitting(true)
	}

	useEffect(() => {
		if (Object.keys(errors).length == 0 && isSubmitting) {
			loginFormFetch()
		} else if (isSubmitting && Object.keys(errors).length != 0) {
			Object.entries(errors).forEach((error: any) => {
				push({ event: "errorMessage", data: error[1] })
			})
			setIsSubmitting(false)
		}
	}, [errors, isSubmitting])
	useEffect(() => {
		if (!loginFetchResponse) {
			push({
				event: "errorMessage",
				data: intl.formatMessage({
					id: "store/custom-login.login-form.error-fetch",
				}),
			})
		}
	}, [loginFetchResponse])
	return (
		<>
			<div className={style.emailModal}>
				<div className={style.emailModalContent}>
					{!isLogin ? (
						<div className={`${style.emailModalContentWrapper} w-50`}>
							<div>
								<span>
									{intl.formatMessage({ id: "checkout-io.already-registered" })}
								</span>
							</div>
							<div className={`${style.emailModalButtonContainer} mt3`}>
								<Button
									variation="primary"
									isLoading={false}
									onClick={handleShowLogin}
									block
								>
									{intl.formatMessage({ id: "checkout-io.sign-in" })}
								</Button>
							</div>
							<div className={`${style.orContainer} mt3 flex justify-center`}>
								<span className={`${style.orText}`}>
									{intl.formatMessage({ id: "checkout-io.or-label" })}
								</span>
							</div>
							<div className={`${style.emailModalButtonContainer} mt3`}>
								<button
									className={`${style.emailModalButton} c-action-primary`}
									onClick={() => {
										setIsEmailModalOpen(false),
											setValues({
												...values,
												email: "",
											})
									}}
								>
									{intl.formatMessage({ id: "checkout-io.another-mail" })}
								</button>
							</div>
						</div>
					) : (
						<div className={style.emailModalContentWrapper}>
							<div
								className={`${style.emailModalButtonContainer} ${style.profileInput} mt3`}
							>
								<Input
									label={intl.formatMessage({
										id: "checkout-io.login.login-form.email-label",
									})}
									name="email"
									value={
										loginFormValues?.email
										// !loginFormValues?.email
										// 	? values?.email
										// 	: loginFormValues?.email
									}
									error={errors?.email}
									errorMessage={errors?.email}
									placeholder={intl.formatMessage({
										id:
											"checkout-io.login.login-form.login-form.placeholder.email",
									})}
									onChange={(e: any) => {
										handleChangeInputLogin(e)
										resetInput("email")
									}}
								></Input>
							</div>
							<div
								className={`${style.emailModalButtonContainer} ${style.profileInput} mt3`}
							>
								<InputPassword
									label={intl.formatMessage({
										id: "checkout-io.login.login-form.password-label",
									})}
									name="password"
									value={loginFormValues?.password}
									error={errors?.password}
									errorMessage={errors?.password}
									placeholder={intl.formatMessage({
										id:
											"checkout-io.login.login-form.login-form.placeholder.password",
									})}
									onChange={(e: any) => {
										handleChangeInputLogin(e)
										resetInput("password")
									}}
									onFocus={() => setTootltipVisible(true)}
									onBlur={() => setTootltipVisible(false)}
								/>
								{isTooltipVisible && (
									<ValidationTootltip values={loginFormValues} />
								)}
							</div>
							<div className={`${style.emailModalButtonContainer} mt3`}>
								{!isSubmitting ? (
									<Button
										variation="primary"
										isLoading={false}
										onClick={(e: any) => handleSubmitLogin(e)}
										block
									>
										{intl.formatMessage({
											id: "checkout-io.login.login-form.submit-button",
										})}
									</Button>
								) : (
									<span className={`${style.loginLoader} c-action-primary`}>
										<Spinner color="currentColor" />
									</span>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

export default EmailModal
