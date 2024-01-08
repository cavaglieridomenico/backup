import React from "react"
import { Input } from "vtex.styleguide"
import { useIntl, defineMessages } from "react-intl"
import style from "../profile.css"
import { useProfile } from "../context/ProfileContext"

interface InfoDataProps {
	hideFirstName: boolean
	hideLastName: boolean
	hideDocument: boolean
	hideDocumentType: boolean
	hidePhone: boolean
}

const InfoData: React.FC<InfoDataProps> = ({
	hideFirstName = false,
	hideLastName = false,
	hideDocument = true,
	hideDocumentType = true,
	hidePhone = false,
	children,
}: any) => {
	const intl = useIntl()
	const {
		values,
		handleChangeInput,
		// isEmailModalOpen,
		emailCheckLoading,
		errors,
		resetInput,
		requiredFields,
	} = useProfile()

	const EmailFIeld = children?.find(
		(child: any) =>
			child.props.id == "profile-editable-form.info-data.email-field" ||
			"profile-editable-form.info-data.email-field-cc",
	)

	return (
		<>
			{EmailFIeld}
			<div className={style.doubleInputsContainer}>
				{!hideFirstName && (
					<div
						className={`${style.profileInput} ${
							emailCheckLoading ? style.inputLoading : null
						}`}
						style={{ width: hideLastName ? "100%" : "48%" }}
						data-testid="profile-first-name-wrapper"
					>
						<Input
							label={`${intl.formatMessage(messages.firstName)}${
								requiredFields?.isFirstNameRequired ? "*" : ""
							}`}
							name="firstName"
							value={values?.firstName}
							error={errors?.firstName}
							errorMessage={errors?.firstName}
							onChange={(e: any) => {
								handleChangeInput(e), resetInput("firstName")
							}}
						/>
					</div>
				)}

				{!hideLastName && (
					<div
						className={`${style.profileInput} ${
							emailCheckLoading ? style.inputLoading : null
						}`}
						style={{ width: hideFirstName ? "100%" : "48%" }}
						data-testid="profile-last-name-wrapper"
					>
						<Input
							label={`${intl.formatMessage(messages.lastName)}${
								requiredFields?.isLastNameRequired ? "*" : ""
							}`}
							name="lastName"
							value={values?.lastName}
							error={errors?.lastName}
							errorMessage={errors?.lastName}
							onChange={(e: any) => {
								handleChangeInput(e), resetInput("lastName")
							}}
						/>
					</div>
				)}
			</div>
			<div className={style.doubleInputsContainer}>
				{!hideDocument && (
					<div
						className={`${style.profileInput} ${
							emailCheckLoading ? style.inputLoading : null
						}`}
						style={{ width: hideDocumentType ? "100%" : "48%" }}
						data-testid="profile-document-wrapper"
					>
						<Input
							label={`${intl.formatMessage(messages.document)}${
								requiredFields?.isDocumentRequired ? "*" : ""
							}`}
							name="document"
							value={values?.document}
							error={errors?.document}
							errorMessage={errors?.document}
							onChange={(e: any) => {
								handleChangeInput(e), resetInput("document")
							}}
						/>
					</div>
				)}

				{!hideDocumentType && (
					<div
						className={`${style.profileInput} ${
							emailCheckLoading ? style.inputLoading : null
						}`}
						style={{ width: hideDocument ? "100%" : "48%" }}
						data-testid="profile-document-type-wrapper"
					>
						<Input
							label={`${intl.formatMessage(messages.documentType)}${
								requiredFields?.isDocumentTypeRequired ? "*" : ""
							}`}
							name="documentType"
							value={values?.documentType}
							error={errors?.documentType}
							errorMessage={errors?.documentType}
							onChange={(e: any) => {
								handleChangeInput(e), resetInput("documentType")
							}}
						/>
					</div>
				)}
			</div>
			<div className="flex flex-column flex-row-ns mt3">
				{!hidePhone && (
					<div
						className={`${style.profileInput} ${
							emailCheckLoading ? style.inputLoading : null
						}`}
						data-testid="profile-phone-wrapper"
					>
						<Input
							label={`${intl.formatMessage(messages.phone)}${
								requiredFields?.isPhoneRequired ? "*" : ""
							}`}
							name="phone"
							value={values?.phone.trim()}
							error={errors?.phone}
							errorMessage={errors?.phone}
							onChange={(e: any) => {
								handleChangeInput(e), resetInput("phone")
							}}
						/>
					</div>
				)}
			</div>
			<div className={`${style.mandatoryContainer} flex mt3 t-mini`}>
				<span>{intl.formatMessage(messages.mandatory)}</span>
			</div>
		</>
	)
}

const messages = defineMessages({
	email: {
		defaultMessage: "Email",
		id: "checkout-io.email",
	},
	firstName: {
		defaultMessage: "First Name",
		id: "checkout-io.first-name",
	},
	lastName: {
		defaultMessage: "Last Name",
		id: "checkout-io.last-name",
	},
	document: {
		defaultMessage: "Document",
		id: "checkout-io.document",
	},
	documentType: {
		defaultMessage: "Document Type",
		id: "checkout-io.document-type",
	},
	phone: {
		defaultMessage: "Phone",
		id: "checkout-io.phone",
	},
	mandatory: {
		defaultMessage: "* fields are mandatory to proceed",
		id: "checkout-io.mandatory",
	},
})

export default InfoData
