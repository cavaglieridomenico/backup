import React from "react"
import style from "../invoices.css"
import { Checkbox } from "vtex.styleguide"
import { useIntl, defineMessages } from "react-intl"
import { useProfile } from "../context/ProfileContext"

interface CheckboxesProps {
	acceptTermsLink: string
	optInLink: string
	termsAndConditionsCheckboxText?: string
	termsAndConditionsCheckboxLink?: string
	privacyCheckboxText?: string
	privacyCheckboxText2?: string
	privacyCheckboxLink?: string
	newsletterCheckboxText?: string
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
}) => {
	const {
		acceptTerms,
		setAcceptTerms,
		setCustomDataValues,
		customDataValues,
		optinNewsLetter,
		setOptinNewsLetter,
	} = useProfile()

	/*--- INTL MANAGEMENT ---*/
	const intl = useIntl()

	return (
		<div className={style.checkboxesContainer}>
			<div className={`${style.checkboxDiv} flex`}>
				<Checkbox
					onChange={() => {
						setAcceptTerms(!acceptTerms),
							setCustomDataValues({
								...customDataValues,
								acceptTerms: !acceptTerms,
							})
					}}
					checked={acceptTerms || customDataValues.acceptTerms}
					required
				/>
				<span className={`${style.checkboxLabel} tj`}>
					{termsAndConditionsCheckboxText
						? termsAndConditionsCheckboxText
						: intl.formatMessage(messages.acceptTerms)}
					<a
						className={`${style.checkboxLabelLink} underline-hover link c-link pointer`}
						href={acceptTermsLink}
						target="_blank"
					>
						{termsAndConditionsCheckboxLink
							? termsAndConditionsCheckboxLink
							: intl.formatMessage(messages.acceptTermsLinkLabel)}
					</a>
				</span>
			</div>
			<div className={`${style.checkboxDivOptin} flex flex-column`}>
				<span className={`${style.checkboxLabelOptin} tj`}>
					{privacyCheckboxText
						? privacyCheckboxText
						: intl.formatMessage(messages.optinLabel)}

					<a
						className={`${style.checkboxLabelLink} underline-hover link c-link pointer`}
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
				</span>
				<div className={`${style.optinDiv} tj`}>
					<Checkbox
						onChange={() => {
							setOptinNewsLetter(!optinNewsLetter)
						}}
						checked={optinNewsLetter}
						label={
							newsletterCheckboxText
								? newsletterCheckboxText
								: intl.formatMessage(messages.optinLabelCheckbox)
						}
					/>
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
