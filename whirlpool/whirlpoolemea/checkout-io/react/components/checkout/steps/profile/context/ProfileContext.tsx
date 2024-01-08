import React, {
	createContext,
	useContext,
	useMemo,
	useState,
	useEffect,
} from "react"
import { useLazyQuery, useMutation } from "react-apollo"
import { useOrder } from "../../../../../providers/orderform"
import emailCheck from "../../../../../graphql/emailCheck.graphql"
import updateCustomData from "../../../../../graphql/updateCustomData.graphql"
import updateCustomDataSingle from "../../../../../graphql/updateCustomDataSingleMutation.graphql"
import { useHistory } from "react-router"
import routes from "../../../../../utils/routes"
import { Validate } from "../../../../../typings/validation"
import { ErrorsObject } from "../../../../../typings/errors"
import validate from "./validate"
import { useIntl, defineMessages } from "react-intl"
import { Values } from "../form/CustomDatas"

import { useAppSettings } from "../../../../../providers/appSettings"
import { AppSettings } from "../../../../../typings/configs"
import { getAddressBasicFields } from "../../../../../utils/utils"
import { useCheckout } from "../../../../../providers/checkout"
interface Context {
	values: ProfileValues
	setValues: any
	handleChangeInput: any
	handleChangeEmailCC: any
	emailCheckControl: any
	isEmailModalOpen: boolean
	emailCheckLoading: boolean
	setIsEmailModalOpen: any
	handleSubmit: any
	errors: ErrorsObject
	resetInput: any
	requiredFields: any
	setRequiredFields: any
	emailCheckControlError: any
	selected: any
	setSelected: any
	customDatasRequiredFields: any
	setCustomDatasRequiredFields: any
	isInvoiceChecked: boolean
	setIsInvoiceChecked: any
	// customDataValues: customDataValues
	customDataValues: any
	handleChangeInputCustomDatas: any
	isInvoiceSectionOpen: boolean
	setIsInvoiceSectionOpen: any
	invoiceSectionHeight: any
	setinvoiceSectionHeight: any
	invoiceRequiredFields: any
	setInvoiceRequiredFields: any
	invoicesValues: any
	setInvoicesValues: any
	handleChangeInputInvoices: any
	handleChangeInvoiceProfileData: any
	setCustomDataValues: any
	acceptTerms: boolean
	setAcceptTerms: any
	optinNewsLetter: any
	setOptinNewsLetter: any
	isProfileMutationLoading: boolean
	realEmail: any
	customInvoiceField: string
}

interface ProfileValues {
	email: string
	firstName: string
	lastName: string
	document: string
	documentType: string
	phone: string
	sendInvoiceTo: string
	invoiceFiscalCode: string
}
// interface customDataValues {
// 	sendInvoiceTo: string
// 	invoiceFiscalCode: string
// 	codiceFiscaleAzienda: string
// 	SDIPEC: string
// 	invoiceSocialReason: string
// 	typeOfDocument: string
// 	requestInvoice: boolean
// 	acceptTerms: boolean
// 	useShippingAddress: boolean
// }

const ProfileContext = createContext<Context>({} as Context)

interface ProfileContextProps {
	customInvoiceField?: string
}

export const ProfileContextProvider: React.FC<ProfileContextProps> = ({
	children,
	customInvoiceField = "invoiceFiscalCode",
}) => {
	const intl = useIntl()
	const history = useHistory()
	const { orderForm, refreshOrder, push } = useOrder()
	const [requiredFields, setRequiredFields]: any = useState()
	const [errors, setErrors]: any = useState({})
	const [isSubmitting, setIsSubmitting]: any = useState(false)
	const { session } = useCheckout()
	const [realEmail, setRealEmail]: any = useState({
		email: orderForm?.clientProfileData?.email?.includes("fake")
			? orderForm?.customData?.customApps?.find(
					(item: any) => item.id == "profile",
			  )?.fields.email
			: "",
		oldEmail: "",
		disabledButton: false,
	})
	const { loggedIn } = orderForm

	const { appSettings } = useAppSettings()

	const [isProfileMutationLoading, setIsProfileMutationLoading]: any = useState(
		false,
	)
	const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

	const [profileCustomData, setProfileCustomData] = useState<any>(
		orderForm?.customData?.customApps?.find((item: any) => item.id == "profile")
			?.fields || { email: realEmail.email, accessCode: "", optin: "false" },
	)

	useEffect(() => {
		setValues({
			...values,
			email: orderForm?.clientProfileData?.email || "",
			firstName: orderForm?.clientProfileData?.firstName || "",
			lastName: orderForm?.clientProfileData?.lastName || "",
			document: orderForm?.clientProfileData?.document || "",
			documentType: orderForm?.clientProfileData?.documentType || "",
			phone: orderForm?.clientProfileData?.phone || "",
		})
	}, [orderForm])

	const [values, setValues]: any = useState({
		email: orderForm?.clientProfileData?.email?.includes("fake")
			? orderForm?.customData?.customApps?.find(
					(item: any) => item.id == "profile",
			  )?.fields.email
			: orderForm?.clientProfileData?.email || "",
		firstName: orderForm?.clientProfileData?.firstName || "",
		lastName: orderForm?.clientProfileData?.lastName || "",
		document: orderForm?.clientProfileData?.document || "",
		documentType: orderForm?.clientProfileData?.documentType || "",
		phone: orderForm?.clientProfileData?.phone || "",
		corporateName: orderForm?.clientProfileData?.corporateName || "",
	})

	/*--- EMAIL CHECK FUNCTION
		- CC if user already registered --> Login
		- if not custom flow for unkwnown user
	---*/

	const [
		isAlreadyRegistered,
		{
			data: isRegistered,
			loading: emailCheckLoading,
			error: emailCheckControlError,
		},
	] = useLazyQuery(emailCheck, { fetchPolicy: "no-cache" })

	// Check if the inserted email is already associated with a registered user
	const emailCheckControl = (e: any) => {
		// If the website is a CC, then the content stored in realEmail.email shall be checked as well
		// Otherwise, the check on the input content is enough
		if (e.target.value.trim() != "") {
			if (appSettings?.isCC) {
				setRealEmail({
					email: e.target.value,
					oldEmail: "",
					disableButton: false,
				})
			}
			isAlreadyRegistered({
				variables: {
					email: e.target.value.trim(),
				},
			})
		}
	}

	//CC need a different email flow
	//save real email in a status and custom data
	const handleChangeEmailCC = (e: any) => {
		let oldEmail = realEmail.email
		setRealEmail({
			email: e.target.value.trim(),
			oldEmail,
			disabledButton: e.target.value.trim() !== oldEmail,
		})
	}

	/** Profile Mutation */
	/*--- INVOICE DATA MUTATION ---*/
	const [updateEmailData]: any = useMutation(updateCustomDataSingle, {
		onCompleted() {
			setRealEmail({
				...realEmail,
				disabledButton: false,
			})
		},
	})

	useEffect(() => {
		//check per CC se è registrato lo faccio loggare

		if (!emailCheckLoading && !loggedIn) {
			if (isRegistered?.checkoutProfile?.userProfileId != null) {
				// If the email inserted from the user is already registered...
				// Then we try to autocomplete all the fields, and possibly force the user to login
				if (appSettings?.isCC) {
					// For the CC projects..
					// We store the real email in the profile values
					setValues({
						...values,
						email: realEmail.email.trim(),
					})
					// We reset the values of realEmail
					setRealEmail({
						email: "",
						oldEmail: "",
						disabledButton: false,
					})
					// And finally we show the popup to force the user to either complete the login or insert a different email
					setIsEmailModalOpen(true)
				} else {
					// For the O2P projects...
					// The registered mail is saved in orderForm.clientProfileData.email
					// This operation shall trigger the easy-checkout function provided from VTEX
					fetch(
						`/api/checkout/pub/orderForm/${orderForm.orderFormId}/attachments/clientProfileData`,
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Accept: "application/json",
							},
							body: JSON.stringify({
								email: values.email,
							}),
						},
					)
						.then(() => {
							refreshOrder().then(newOrder => {
								const {
									firstName,
									lastName,
									phone,
								} = newOrder?.data?.checkoutOrder?.clientProfileData
								if (
									orderForm?.userProfileId &&
									firstName &&
									lastName &&
									phone
								) {
									history.push(routes.SHIPPING.route)
								}
							})
						})
						.catch(() => {})
				}
			} else {
				// If the email inserted from the user is not registered...
				if (appSettings?.isCC && appSettings.country !== "GB") {
					// Then, for the CC projects, we create a "fake" email
					// In this way, the user email will not be associated with the order,
					// and the user can proceed with other orders as a guest
					const options = {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					}
					fetch("/v1/wrapper/api/emailgenerator", options)
						.then(response => response.json())
						.then(json => {
							setValues({
								...values,
								email: json.email,
							})
							updateEmailDataMutation()
						})
				} else {
          setValues({
            ...values,
            email: realEmail.email.trim(),
          })
        }
			}
		} else {
			// If the user is logged...
			if (!orderForm?.clientProfileData?.email) {
				// If the orderForm does not contain the infos about the email
				if (appSettings?.isCC) {
					// Then, we force these values
					// Currently, this operation is performed for CC projects only
					const newEmail = session?.namespaces?.profile?.email?.value
					if (newEmail) {
						updateProfileEmail(newEmail)
							.then(() => {
								refreshOrder()
							})
							.catch(() => {})
					}
				}
			}
		}
	}, [isRegistered])

	/** UPDATE EMAIL IN CLIENTPROFILEDATA */
	const updateProfileEmail = (newEmail: string) => {
		return fetch(
			`/api/checkout/pub/orderForm/${orderForm.orderFormId}/attachments/clientProfileData`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					email: newEmail,
				}),
			},
		)
	}

	/** UPDATE CUSTOM DATA PROFILE EMAIL */
	const updateEmailDataMutation = () => {
		updateEmailData({
			variables: {
				appId: "profile",
				orderFormId: orderForm.orderFormId,
				customData: { email: realEmail.email },
			},
		})
	}

	const handleChangeInput = (e: any) => {
		const { name, value } = e.target
		setValues({
			...values,
			[name]: value,
		})
	}

	/*--- INFO DATA FORM SUBMIT ---*/

	const formatCustomDatas = (customDatas: any) => {
		Object.entries(customDatas).forEach(
			([key, data]: any) =>
				(customDatas[key] = data?.toString().trim() == "" ? "_" : data),
		)
		return customDatas
	}

	const updateProfileInfoDataMutation = () => {
		// If the user requests the invoice, and he wants to use the same address for both the billing and the shipping addresses,
		// then the shippingAddress is stored into invoiceData if a valid shipping address is already available
		const invoiceAddress =
			isInvoiceChecked &&
			!isInvoiceSectionOpen &&
			orderForm?.shippingData?.selectedAddresses?.[0]?.postalCode
				? getAddressBasicFields(orderForm.shippingData.selectedAddresses[0])
				: invoicesValues

		updateCustData({
			variables: {
				orderFormId: orderForm.orderFormId,
				profileData: { ...trimValues(values) },
				appId: "fiscaldata",
				customData: formatCustomDatas({ ...customDataValues }),
				InvoiceDatas: { address: { ...trimValues(invoiceAddress) } },
				clientPreferencesData: {
					...orderForm?.clientPreferencesData,
					optinNewsLetter: optinNewsLetter,
				},
			},
		})
	}

	const trimValues = (values: any) => {
		let trimmedValues = { ...values }
		Object.keys(values).forEach(key => {
			trimmedValues[key] =
				typeof values[key] == "string" ? values[key].trim() : values[key]
		})
		return trimmedValues
	}

	/*---ERRORS RESET ---*/
	const resetInput = (value: string) => {
		errors[value] && delete errors[value], setErrors({ ...errors })
	}

	/*--- INVOICE DATAS SECTION ---*/
	const [acceptTerms, setAcceptTerms] = useState(false)
	const [optinNewsLetter, setOptinNewsLetter] = useState(
		orderForm?.clientPreferencesData?.optinNewsLetter || false,
	)
	const invoiceCustomData = orderForm?.customData?.customApps?.find(
		app => app.id == "fiscaldata",
	)?.fields
	const [customDataValues, setCustomDataValues]: any = useState({
		sendInvoiceTo:
			orderForm?.clientProfileData?.firstName &&
			orderForm?.clientProfileData?.lastName
				? orderForm?.clientProfileData?.firstName +
				  " " +
				  orderForm?.clientProfileData?.lastName
				: "",
		// invoiceFiscalCode:
		// 	invoiceCustomData && invoiceCustomData.invoiceFiscalCode != "_"
		// 		? invoiceCustomData.invoiceFiscalCode
		// 		: "",
		// codiceFiscaleAzienda:
		// 	invoiceCustomData && invoiceCustomData.codiceFiscaleAzienda != "_"
		// 		? invoiceCustomData.codiceFiscaleAzienda
		// 		: "",

		// The name of this field is passed as a prop from the store theme, since it is custom for each country / project.
		[customInvoiceField]:
			invoiceCustomData && invoiceCustomData[customInvoiceField]
				? invoiceCustomData[customInvoiceField]
				: "",
		SDIPEC:
			invoiceCustomData && invoiceCustomData.SDIPEC != "_"
				? invoiceCustomData.SDIPEC
				: "",
		invoiceSocialReason: "",
		typeOfDocument: invoiceCustomData
			? invoiceCustomData.typeOfDocument
			: Values.private,
		requestInvoice: invoiceCustomData
			? invoiceCustomData.requestInvoice
			: false,
		acceptTerms: invoiceCustomData ? invoiceCustomData.acceptTerms : false,
		useShippingAddress:
			invoiceCustomData && invoiceCustomData.useShippingAddress
				? invoiceCustomData.useShippingAddress
				: true,
	})

	const [
		customDatasRequiredFields,
		setCustomDatasRequiredFields,
	]: any = useState()
	const [invoiceRequiredFields, setInvoiceRequiredFields]: any = useState()
	const [isInvoiceChecked, setIsInvoiceChecked]: any[] = useState(
		orderForm?.clientProfileData?.document &&
			orderForm?.clientProfileData.document != "",
		// invoiceCustomData ? invoiceCustomData.requestInvoice : false,
	)
	const [selected, setSelected] = useState()
	const [invoiceChecksCompleted, setInvoiceChecksCompleted] = useState(false)

	const handleChangeInputCustomDatas = (e: any) => {
		const { name, value } = e.target
		setCustomDataValues({
			...customDataValues,
			[name]: value,
		})
	}

	const handleChangeInvoiceProfileData = (name: string, value: string) => {
		setValues({ ...values, [name]: value })
	}

	const handleChangeInputInvoices = (e: any) => {
		const { name, value } = e.target
		setInvoicesValues({
			...invoicesValues,
			[name]: value,
		})
	}

	const [isInvoiceSectionOpen, setIsInvoiceSectionOpen]: any[] = useState(
		invoiceCustomData ? !invoiceCustomData.useShippingAddress : true,
	)
	const [invoiceSectionHeight, setinvoiceSectionHeight]: any[] = useState(0)

	const [invoicesValues, setInvoicesValues]: any = useState({
		street: orderForm?.invoiceData?.address?.street || "",
		complement: orderForm?.invoiceData?.address?.complement || "",
		postalCode: orderForm?.invoiceData?.address?.postalCode || "",
		city: orderForm?.invoiceData?.address?.city || "",
	})

	/*--- INVOICE DATA MUTATION ---*/
	const [updateCustData, { loading, error }]: any = useMutation(
		updateCustomData,
		{
			onCompleted() {
				if (!error && optinNewsLetter) {
					push({ event: "ga4-optin" })
				}
				refreshOrder().then(() => {
					history.push(routes.SHIPPING.route)
				})
			},
		},
	)

	useEffect(() => {
		setIsProfileMutationLoading(loading)
	}, [loading])

	/*---------------*/
	/** UPDATE CUSTOM DATA PROFILE EMAIL */
	const updateProfileCustomDataMutation = (newCustomData: any) => {
		updateProfileData({
			variables: {
				appId: "profile",
				orderFormId: orderForm.orderFormId,
				customData: formatCustomDatas(newCustomData),
			},
		})
	}

	const [updateProfileData]: any = useMutation(updateCustomDataSingle, {
		onCompleted() {
			refreshOrder()
		},
	})

	const updateCustomDataHandler = (appSettings: AppSettings) => {
		let newProfileCustomData: any = {
			email: realEmail.email !== "" ? realEmail.email : values.email,
			accessCode:
				profileCustomData.accessCode &&
				profileCustomData.accessCode !== "" &&
				profileCustomData.accessCode !== "undefined" &&
				profileCustomData.accessCode !== "_"
					? profileCustomData.accessCode
					: session?.namespaces?.public?.accessCode?.value ||
					  window.sessionStorage.getItem("sid") ||
					  "",
			optin: optinNewsLetter.toString(),
		}
		if (appSettings && appSettings.isMultilanguage) {
			newProfileCustomData.locale =
				orderForm?.clientPreferencesData?.locale || appSettings.defaultLocale
		}
		setProfileCustomData(newProfileCustomData)
		updateProfileCustomDataMutation(newProfileCustomData)
	}

	/*--- FORM SUBMITTING ---*/
	const handleSubmit = (e: any, validation: Validate) => {
		e.preventDefault()
		setErrors(
			validate(
				values,
				validation,
				intl?.messages,
				customDataValues,
				isInvoiceChecked,
				customDatasRequiredFields,
				selected,
				invoicesValues,
				isInvoiceSectionOpen,
				invoiceRequiredFields,
				realEmail,
				appSettings?.isCC,
				loggedIn,
				appSettings,
				customInvoiceField,
			),
		)
		setIsSubmitting(true)
	}

	const checkInvoiceData = () => {
		if (!isInvoiceChecked) {
			resetInvoiceInputs()
			resetInvoiceAddressInputs()
		} else if (!isInvoiceSectionOpen) {
			resetInvoiceAddressInputs()
		}
		setInvoiceChecksCompleted(true)
	}

	const resetInvoiceInputs = () => {
		setCustomDataValues({
			...customDataValues,
			sendInvoiceTo: "",
			// invoiceFiscalCode: "",
			// codiceFiscaleAzienda: "",
			[customInvoiceField]: "",
			SDIPEC: "",
			useShippingAddress: true,
		})
		setValues({
			...values,
			document: "",
			documentType: "",
			corporateName: "",
		})
	}

	const resetInvoiceAddressInputs = () => {
		setInvoicesValues({
			...invoicesValues,
			street: "",
			complement: "",
			postalCode: "",
			city: "",
			// useShippingAddress: true is not required here
			// If we only call resetInvoiceAddressInputs, then useShippingAddress and isInvoiceSectionOpen are aligned
		})
	}

	useEffect(() => {
		if (Object.keys(errors).length == 0 && isSubmitting) {
			checkInvoiceData()
		} else {
			setIsSubmitting(false)
		}
		if (
			!(Object.keys(errors).length === 0 && errors.constructor === Object) &&
			isSubmitting
		) {
			let errArray = Object.keys(errors)
			errArray.map(key => {
				push({
					event: "ga4-custom_error",
					type: "error message",
					description: `${key}: ${errors[key]}`,
				})
			})
		}
	}, [errors])

	useEffect(() => {
		if (invoiceChecksCompleted) {
			if (appSettings?.isCC) {
				updateCustomDataHandler(appSettings)
			}
			updateProfileInfoDataMutation()
		} else {
			setIsSubmitting(false)
		}
	}, [invoiceChecksCompleted])

	const context = useMemo(
		() => ({
			values,
			setValues,
			handleChangeInput,
			handleChangeEmailCC,
			isEmailModalOpen,
			setIsEmailModalOpen,
			emailCheckControl,
			emailCheckLoading,
			handleSubmit,
			errors,
			resetInput,
			requiredFields,
			setRequiredFields,
			emailCheckControlError,
			//Invoice
			customDataValues,
			setCustomDataValues,
			handleChangeInputCustomDatas,
			selected,
			setSelected,
			customDatasRequiredFields,
			setCustomDatasRequiredFields,
			isInvoiceChecked,
			setIsInvoiceChecked,
			isInvoiceSectionOpen,
			setIsInvoiceSectionOpen,
			invoiceSectionHeight,
			setinvoiceSectionHeight,
			invoiceRequiredFields,
			setInvoiceRequiredFields,
			invoicesValues,
			setInvoicesValues,
			handleChangeInputInvoices,
			handleChangeInvoiceProfileData,
			acceptTerms,
			setAcceptTerms,
			optinNewsLetter,
			setOptinNewsLetter,
			isProfileMutationLoading,
			realEmail,
			customInvoiceField,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[
			values,
			setValues,
			isEmailModalOpen,
			emailCheckLoading,
			errors,
			customDataValues,
			selected,
			customDatasRequiredFields,
			isInvoiceChecked,
			isInvoiceSectionOpen,
			invoiceSectionHeight,
			invoiceRequiredFields,
			invoicesValues,
			acceptTerms,
			optinNewsLetter,
			isProfileMutationLoading,
			realEmail,
			customInvoiceField,
			invoiceChecksCompleted,
		],
	)

	return (
		<ProfileContext.Provider value={context}>
			{children}
		</ProfileContext.Provider>
	)
}

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
export const useProfile = () => {
	const context = useContext(ProfileContext)

	if (context === undefined) {
		throw new Error("useOrder must be used within an OrderContextProvider")
	}

	return context
}

export default { ProfileContextProvider, useProfile }

defineMessages({
	emptyError: {
		defaultMessage: "This field can't be empty",
		id: "checkout-io.profile.errors.empty",
	},
	emailError: {
		defaultMessage: "The inserted mail is not a valid email",
		id: "checkout-io.profile.errors.email",
	},
	firstNameError: {
		defaultMessage: "The inserted first name is not a valid first name",
		id: "checkout-io.profile.errors.firstName",
	},
	lastNameError: {
		defaultMessage: "The inserted last name is not a valid last name",
		id: "checkout-io.profile.errors.lastName",
	},
	phoneError: {
		defaultMessage: "Enter a valid phone number, please.",
		id: "checkout-io.profile.errors.phone",
	},
	invoiceFiscalCode: {
		defaultMessage:
			"This field is mandatory. Please insert a valid fiscal code.",
		id: "checkout-io.profile.errors.fiscalcode",
	},
})
