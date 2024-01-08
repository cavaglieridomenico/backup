import React, {
	createContext,
	useContext,
	useMemo,
	useState,
	useEffect,
} from "react"
import { useLazyQuery, useMutation } from "react-apollo"
import { useRuntime } from "vtex.render-runtime"
import { useOrder } from "../../../../providers/orderform"
import emailCheck from "../../../../graphql/emailCheck.graphql"
import updateCustomData from "../../../../graphql/updateCustomData.graphql"
//import updateCustomDataSingle from "../../../../graphql/updateCustomDataSingleMutation.graphql"
import { useHistory } from "react-router"
import routes from "../../../../utils/routes"
import { Validate } from "../../../../typings/validation"
import { ErrorsObject } from "../../../../typings/errors"
import validate from "./validate"
import { useIntl, defineMessages } from "react-intl"
import { Values } from "../form/CustomDatas"
import { usePixel } from "vtex.pixel-manager"

interface Context {
	values: ProfileValues
	setValues: any
	handleChangeInput: any
	handleChangeEmail: any
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
	customDataValues: customDataValues
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
	setCustomDataValues: any
	acceptTerms: boolean
	setAcceptTerms: any
	optinNewsLetter: any
	setOptinNewsLetter: any
	optinProfiling: any
	setOptinProfiling: any
	isProfileMutationLoading: boolean
	realEmail: any
}

interface ProfileValues {
	email: string
	firstName: string
	lastName: string
	document: string
	documentType: string
	phone: string
	sendInvoiceTo: string
}
interface customDataValues {
	sendInvoiceTo: string
	invoiceFiscalCode: string
	SDIPEC: string
	corporateDocument: string
	typeOfDocument: string
	requestInvoice: boolean
	acceptTerms: boolean
	useShippingAddress: boolean
	profilingOptIn: string
}

const ProfileContext = createContext<Context>({} as Context)

export const ProfileContextProvider: React.FC = ({ children }) => {
	const intl = useIntl()
	const { push } = usePixel()
	const history = useHistory()

	const { production } = useRuntime()
	const { orderForm, refreshOrder } = useOrder()
	const [requiredFields, setRequiredFields]: any = useState()
	const [errors, setErrors]: any = useState({})
	const [isSubmitting, setIsSubmitting]: any = useState(false)
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

	const [isProfileMutationLoading, setIsProfileMutationLoading]: any =
		useState(false)
	const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)

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
			: orderForm?.clientProfileData?.email ||
			  orderForm?.clientProfileData?.email ||
			  "",
		firstName: orderForm?.clientProfileData?.firstName || "",
		lastName: orderForm?.clientProfileData?.lastName || "",
		document: orderForm?.clientProfileData?.document || "",
		documentType: orderForm?.clientProfileData?.documentType || "",
		phone: orderForm?.clientProfileData?.phone || "",
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

	const emailCheckControl = (e: any) => {
		//controllo se è registrato
		//aggiungere controllo se è già stato fatto o l'email è cambiata
		if (e.target.value != "") {
			isAlreadyRegistered({
				variables: { email: e.target.value },
			})
			setRealEmail({
				email: e.target.value,
				oldEmail: "",
				disableButton: false,
			})
		}
	}
	//CC need a different email flow
	//save real email in a status and custom data
	const handleChangeEmail = (e: any) => {
		let oldEmail = realEmail.email
		console.log(realEmail, "realEmail1")
		setRealEmail({
			email: e.target.value,
			oldEmail,
			disabledButton: e.target.value !== oldEmail,
		})
	}

	/** Profile Mutation */
	/*--- INVOICE DATA MUTATION ---*/
	/*const [updateEmailData]: any = useMutation(updateCustomDataSingle, {
		onCompleted() {
			setRealEmail({
				...realEmail,
				disabledButton: false,
			})
			refreshOrder();
		},
	})*/

	useEffect(() => {
		//check per CC se è registrato lo faccio loggare

		if (!emailCheckLoading && !loggedIn) {
			/*if (isRegistered?.checkoutProfile?.userProfileId != null) {
				setValues({
					...values,
					email: realEmail.email,
				})
				setRealEmail({
					email: "",
					oldEmail: "",
					disabledButton: false,
				})

				//apro modale login
				setIsEmailModalOpen(true)
			} else {
				const options = {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}
				fetch("/v1/wrapper/api/emailgenerator", options)
					.then((response) => response.json())
					.then((json) => {
						setValues({
							...values,
							email: json.email,
						})
						updateProfileMutation()
					})
			}*/
			if (isRegistered?.checkoutProfile?.userProfileId != null) {
				setValues({
					...values,
					email: realEmail.email,
				})
				fetch(
					`/api/checkout/pub/orderForm/${orderForm.orderFormId}/attachments/clientProfileData`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
						body: JSON.stringify({
							email: realEmail.email.trim(),
						}),
					},
				)
					.then(() => {
						refreshOrder().then((newOrder) => {
							const { firstName, lastName, phone } =
								newOrder?.data?.checkoutOrder?.clientProfileData
							if (orderForm?.userProfileId && firstName && lastName && phone) {
								history.push(routes.SHIPPING.route)
							}
						})
					})
					.catch(() => {})
			}
		}
	}, [isRegistered])

	/** UPDATE CUSTOM DATA PROFILE EMAIL */
	/*const updateProfileMutation = () => {
		updateEmailData({
			variables: {
				appId: "profile",
				orderFormId: orderForm.orderFormId,
				customData: { email: realEmail.email },
			},
		})
	}*/

	const handleChangeInput = (e: any) => {
		let { name, value } = e.target
		if (name == "email") {
			value = value.trim()
		}
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
		updateCustData({
			variables: {
				orderFormId: orderForm.orderFormId,
				profileData: { ...values },
				appId: "fiscaldata",
				customData: formatCustomDatas({ ...customDataValues }),
				InvoiceDatas: { address: { ...invoicesValues } },
				clientPreferencesData: {
					optinNewsLetter,
				},
			},
		})
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
	const [optinProfiling, setOptinProfiling] = useState(false)
	const [customDataValues, setCustomDataValues]: any = useState({
		sendInvoiceTo:
			orderForm?.clientProfileData?.firstName &&
			orderForm?.clientProfileData?.lastName
				? orderForm?.clientProfileData?.firstName +
				  " " +
				  orderForm?.clientProfileData?.lastName
				: "",
		// invoiceFiscalCode:
		// 	orderForm.customData != null &&
		// 		orderForm.customData.customApps[0].fields.invoiceFiscalCode != "_"
		// 		? orderForm.customData.customApps[0].fields.invoiceFiscalCode
		// 		: "",
		// SDIPEC:
		// 	orderForm.customData != null &&
		// 		orderForm.customData.customApps[0].fields.SDIPEC != "_"
		// 		? orderForm.customData.customApps[0].fields.SDIPEC
		// 		: "",
		corporateDocument: "",
		typeOfDocument:
			orderForm.customData != null
				? orderForm.customData.customApps[0].fields.typeOfDocument
				: Values.private,
		requestInvoice: false,
		acceptTerms: orderForm?.customData?.customApps?.find(
			(item: any) => item.id == "fiscaldata",
		)
			? orderForm?.customData?.customApps?.find(
					(item: any) => item.id == "fiscaldata",
			  )?.fields.acceptTerms
			: false,
		useShippingAddress: true,
		profilingOptIn: orderForm?.customData?.customApps?.find(
			(item: any) => item.id == "fiscaldata",
		)
			? orderForm?.customData?.customApps?.find(
					(item: any) => item.id == "fiscaldata",
			  )?.fields?.profilingOptIn
			: "false",
	})

	const [customDatasRequiredFields, setCustomDatasRequiredFields]: any =
		useState()
	const [invoiceRequiredFields, setInvoiceRequiredFields]: any = useState()
	const [isInvoiceChecked, setIsInvoiceChecked]: any[] = useState()
	const [selected, setSelected] = useState()

	const handleChangeInputCustomDatas = (e: any) => {
		const { name, value } = e.target
		setCustomDataValues({
			...customDataValues,
			[name]: value,
		})
	}

	const handleChangeInputInvoices = (e: any) => {
		const { name, value } = e.target
		setInvoicesValues({
			...invoicesValues,
			[name]: value,
		})
	}

	const [isInvoiceSectionOpen, setIsInvoiceSectionOpen]: any[] = useState()
	const [invoiceSectionHeight, setinvoiceSectionHeight]: any[] = useState()

	const [invoicesValues, setInvoicesValues]: any = useState({
		street: orderForm?.invoiceData?.address?.street || "",
		complement: orderForm?.invoiceData?.address?.complement || "",
		postalCode: orderForm?.invoiceData?.address?.postalCode || "",
		city: orderForm?.invoiceData?.address?.city || "",
	})

	/*--- INVOICE DATA MUTATION ---*/
	const [updateCustData, { loading }]: any = useMutation(updateCustomData, {
		onCompleted() {
			refreshOrder().then(() => history.push(routes.SHIPPING.route))
		},
	})

	useEffect(() => {
		setIsProfileMutationLoading(loading)
	}, [loading])

	const validateProfilingOptin = {
		shouldValidate: true,
		newsOptin: optinNewsLetter,
		profOptin: optinProfiling,
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
				validateProfilingOptin,
			),
		)
		setIsSubmitting(true)
	}

	useEffect(() => {
		if (Object.keys(errors).length == 0 && isSubmitting) {
			updateProfileInfoDataMutation()
		} else {
			;(Object.values(errors) as string[]).forEach((error: string) =>
				push({
					event: "ga4-custom_error",
					type: "error message",
					description: error,
				}),
			)
			setIsSubmitting(false)
		}
	}, [errors])

	/*--- LOGS ---*/
	if (!production) {
		console.log(
			"%c 1.PROFILE FORM VALUES ",
			"background: #00ffaa; color: #000000",
			values,
		)
		console.log(
			"%c 1.1.PROFILE FORM ERRORS ",
			"background: #00ffaa; color: #000000",
			errors,
		)
		console.log(
			"%c 1.2.PROFILE REQUIRED FIELDS ",
			"background: #00ffaa; color: #000000",
			requiredFields,
		)
		console.log(
			"%c 2.PROFILE FORM CUSTOMDATAS.VALUES ",
			"background: #00a2ff; color: #000000",
			customDataValues,
		)
		console.log(
			"%c 3.PROFILE FORM INVOICE.VALUES ",
			"background: #00a2ff; color: #000000",
			invoicesValues,
		)
		console.log(
			"%c 3.PROFILE FORM OPTIN ",
			"background: #00a2ff; color: #000000",
			optinNewsLetter,
		)
		console.log(
			"%c 3.PROFILE FORM PROFILING OPTIN ",
			"background: #00a2ff; color: #000000",
			optinProfiling,
		)
	}

	const context = useMemo(
		() => ({
			values,
			setValues,
			handleChangeInput,
			handleChangeEmail,
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
			acceptTerms,
			setAcceptTerms,
			optinNewsLetter,
			setOptinNewsLetter,
			optinProfiling,
			setOptinProfiling,
			isProfileMutationLoading,
			realEmail,
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
			optinProfiling,
			isProfileMutationLoading,
			realEmail,
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
	profilingError: {
		defaultMessage:
			"You must consent marketing above in order to consent profiling",
		id: "checkout-io.profile.errors.profiling",
	},
})
