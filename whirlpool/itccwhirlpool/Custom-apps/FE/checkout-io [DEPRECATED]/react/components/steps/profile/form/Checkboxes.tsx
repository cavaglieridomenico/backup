import React from "react"
import style from "../invoices.css"
import { Checkbox } from "vtex.styleguide"
import { useIntl, defineMessages } from "react-intl"
import { useProfile } from "../context/ProfileContext"
import { useCheckout } from "../../../../providers/checkout"

interface CheckboxesProps {
	acceptTermsLink: string
	optInLink: string
	termsAndConditionsCheckboxText?: string
	termsAndConditionsCheckboxLink?: string
	privacyCheckboxText?: string
	privacyCheckboxText2?: string
	privacyCheckboxLink?: string
	newsletterCheckboxText?: string
	termsAndConditionsCheckboxText2?: string 
	hidePrivacyCheckbox?: boolean,
	newsletterCheckboxLink?: string,
	newsletterCheckboxText2?: string,
	newsletterTextLink?: string
}

const Checkboxes: StorefrontFunctionComponent<CheckboxesProps> = ({
	acceptTermsLink = "/terms-and-conditions",
	optInLink = "/privacy-policy",
	termsAndConditionsCheckboxText = "",
	termsAndConditionsCheckboxLink = "",
	privacyCheckboxText = "",
	privacyCheckboxText2 = "",
	privacyCheckboxLink = "",
	newsletterCheckboxText = "",
	termsAndConditionsCheckboxText2 = "",
	hidePrivacyCheckbox = false,
	newsletterCheckboxLink = "",
	newsletterCheckboxText2 = "",
	newsletterTextLink = "",
}) => {
	const {
		acceptTerms,
		setAcceptTerms,
		setCustomDataValues,
		customDataValues,
		optinNewsLetter,
		setOptinNewsLetter,
		values,
	} = useProfile()

	/*--- INTL MANAGEMENT ---*/
	const intl = useIntl()
	const { push } = useCheckout()
	const sendleadGenerationEvent = () => {
		push({
			event: "leadGeneration",
			email: values.email,
		})
	}

	return (
		<div className={style.checkboxesContainer}>
			<div className={`${style.checkboxDiv} flex`}>
				<label htmlFor="">
					<Checkbox
					onChange={() => {
						setAcceptTerms(!acceptTerms),
							setCustomDataValues({
								...customDataValues,
								acceptTerms: !acceptTerms,
							})
					}}
					checked={acceptTerms || customDataValues?.acceptTerms}
					required
				/>
				</label>
				<span className={`${style.checkboxLabel} tj`}>
					{termsAndConditionsCheckboxText
						? termsAndConditionsCheckboxText
						: intl.formatMessage(messages.acceptTerms)}
					<a
						className={`${style.checkboxLabelLink} underline-hover link c-link pointer c-link-checkout`}
						href={acceptTermsLink}
						target="_blank"
					>
						{termsAndConditionsCheckboxLink
							? termsAndConditionsCheckboxLink
							: intl.formatMessage(messages.acceptTermsLinkLabel)}
					</a>
					{termsAndConditionsCheckboxText2
						? termsAndConditionsCheckboxText2
						: intl.formatMessage(messages.acceptTerms2)}
				</span>
			</div>
			<div className={`${style.checkboxDivOptin} flex flex-column`}>
				{!hidePrivacyCheckbox && <span className={`${style.checkboxLabelOptin} tj`}>
					{privacyCheckboxText
						? privacyCheckboxText
						: intl.formatMessage(messages.optinLabel)}

					<a
						className={`${style.checkboxLabelLink} underline-hover link c-link pointer c-link-checkout`}
						href={optInLink}
						target="_blank"
					>
						{privacyCheckboxLink
							? privacyCheckboxLink
							: intl.formatMessage(messages.optinLabelLink)}
					</a>
					{privacyCheckboxText2
						? privacyCheckboxText2
						: intl.formatMessage(messages.optinLabel2)}
				</span>}
				<div className={`${style.checkboxDiv} flex`}>
					<Checkbox
						onChange={() => {
							setOptinNewsLetter(!optinNewsLetter), sendleadGenerationEvent()
						}}
						checked={optinNewsLetter}
						label={
							newsletterCheckboxText
								? ""
								: intl.formatMessage(messages.optinLabelCheckbox)
						}
					/>
					{newsletterCheckboxText && newsletterCheckboxLink && newsletterCheckboxText2 && newsletterTextLink &&
					<span className={`${style.checkboxLabel} tj`}>
						{newsletterCheckboxText}
						<a
							className={`${style.checkboxLabelLink} underline-hover link c-link pointer c-link-checkout`}
							href={newsletterCheckboxLink}
							target="_blank"
						>
							{newsletterTextLink}
						</a>
						{newsletterCheckboxText2}
					</span>}
				</div>
			</div>
		</div>
	)
}

export default Checkboxes

const messages = defineMessages({
	acceptTerms: {
		defaultMessage: "I accept the terms and conditions of sale - ",
		id: "checkout-io.profile.invoice.accept-terms",
	},
	acceptTerms2: {
		defaultMessage: " ",
		id: "checkout-io.profile.invoice.accept-terms2",
	},
	acceptTermsLinkLabel: {
		defaultMessage: "Read More",
		id: "checkout-io.profile.invoice.accept-terms-link-label",
	},
	optinLabel: {
		defaultMessage: "I understand and acknowledge the content of the ",
		id: "checkout-io.profile.invoice.optin-label",
	},
	optinLabelLink: {
		defaultMessage: "Privacy notice",
		id: "checkout-io.profile.invoice.optin-label-link",
	},
	optinLabel2: {
		defaultMessage: ".",
		id: "checkout-io.profile.invoice.optin-label-2",
	},
	optinLabelCheckbox: {
		defaultMessage:
			"I consent to the processing of my personal data to allow Whirlpool UK Appliances Ltd to send me newsletters/marketing communications (in electronic and non-electronic form, including via telephone, postal services, e-mail, SMS, push notifications or banners on third party sites including on Meta and Google platforms) regarding products and services of Whirlpool UK Appliances Ltd even bought or registered by me, as well as to conduct market research.",
		id: "checkout-io.profile.invoice.optin-label-checkbox",
	},
})

Checkboxes.schema = {
	title: "Legal Checkboxes",
	description: "Here you can edit the checkboxes text",
	type: "object",
	properties: {
		termsAndConditionsCheckboxText: {
			title: "Terms and conditions Checkbox Text",
			default: "",
			type: "string",
		},
		termsAndConditionsCheckboxLink: {
			title: "Terms and conditions Checkbox Link Text",
			default: "",
			type: "string",
		},
		acceptTermsLink: {
			title: "Accept terms Checkbox Link",
			default: "/",
			type: "string",
		},
		privacyCheckboxText: {
			title: "Privacy Checkbox Text 1",
			default: "",
			type: "string",
		},
		privacyCheckboxText2: {
			title: "Privacy Checkbox Text 2",
			default: "",
			type: "string",
		},
		privacyCheckboxLink: {
			title: "Privacy Checkbox Link Text",
			default: "/",
			type: "string",
		},
		optInLink: {
			title: "Privacy Checkbox Link",
			default: "/",
			type: "string",
		},
		newsletterCheckboxText: {
			title: "Newsletter Checkbox Text",
			default: "",
			type: "string",
		},
	},
}
