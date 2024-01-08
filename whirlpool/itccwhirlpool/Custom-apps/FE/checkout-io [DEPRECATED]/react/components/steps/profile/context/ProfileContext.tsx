//@ts-nocheck
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
import updateCustomDataSingle from "../../../../graphql/updateCustomDataSingleMutation.graphql"
import { useHistory } from "react-router"
import routes from "../../../../utils/routes"
import { Validate } from "../../../../typings/validation"
import { ErrorsObject } from "../../../../typings/errors"
import validate from "./validate"
import { useIntl, defineMessages } from "react-intl"
import { Values } from "../form/CustomDatas"

import { useAppSettings } from "../../../../providers/appSettings"
import { AppSettings } from "../../../../typings/configs"
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
  invoiceFiscalCode: string
}
interface customDataValues {
	sendInvoiceTo: string
	invoiceFiscalCode: string
	SDIPEC: string
	invoiceSocialReason: string
	typeOfDocument: string
	requestInvoice: boolean
	acceptTerms: boolean
	useShippingAddress: boolean
}

const ProfileContext = createContext<Context>({} as Context)

export const ProfileContextProvider: React.FC = ({ children }) => {
	const intl = useIntl()
	const history = useHistory()
	const { production, account } = useRuntime()
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

	const { appSettings } = useAppSettings()

	const [isProfileMutationLoading, setIsProfileMutationLoading]: any =
		useState(false)
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


  // Check if the inserted email is already associated with a registered user
	const emailCheckControl = (e: any) => {
		//controllo se è registrato
		//aggiungere controllo se è già stato fatto o l'email è cambiata
		// if ((realEmail?.email != "" && e.target.value.trim() != "") ||( e.target.value.trim() != "" && !appSettings?.isCC))
		// 	isAlreadyRegistered({
		// 		variables: { email: e.target.value.trim() },
		// 	})

    // If the website is a CC, then the content stored in realEmail.email shall be checked as well
    // Otherwise, the check on the input content is enough
    if(e.target.value.trim() != "" && appSettings && (!appSettings.isCC || realEmail?.email != "")) {
      isAlreadyRegistered({
        variables: { email: e.target.value.trim() }
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
			console.log("REAL EMAIL UPDATED")
			setRealEmail({
				...realEmail,
				disabledButton: false,
			})
		},
	})

	useEffect(() => {
		//check per CC se è registrato lo faccio loggare

		if (!emailCheckLoading && !loggedIn) {
			if (!appSettings?.isCC) {
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
							...values,
						}),
					},
				)
					.then(() => {
						refreshOrder().then((newOrder) => {
							const { firstName, lastName, phone } =
								newOrder?.data?.checkoutOrder?.clientProfileData
							if (orderForm?.userProfileId && firstName && lastName && phone) {
								history.push(routes.SHIPPING)
							}
						})
					})
					.catch(() => {})
			} else {
				if (isRegistered?.checkoutProfile?.userProfileId != null) {
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
							updateEmailDataMutation()
						})
				}
			}
		}
	}, [isRegistered])

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
		updateCustData({
			variables: {
				orderFormId: orderForm.orderFormId,
				profileData: { ...trimValues(values) },
				appId: "fiscaldata",
				customData: formatCustomDatas({ ...customDataValues }),
				InvoiceDatas: { address: { ...trimValues(invoicesValues) } },
				clientPreferencesData: {
          ...orderForm?.clientPreferencesData,
          optinNewsLetter: optinNewsLetter
        },
			},
		})
	}

	const trimValues = (values: any) => {
		let trimmedValues = { ...values }
		Object.keys(values).forEach((key) => {
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
	const [customDataValues, setCustomDataValues]: any = useState({
		sendInvoiceTo:
			orderForm?.clientProfileData?.firstName &&
			orderForm?.clientProfileData?.lastName
				? orderForm?.clientProfileData?.firstName +
				  " " +
				  orderForm?.clientProfileData?.lastName
				: "",
		invoiceFiscalCode:
			orderForm.customData != null &&
			orderForm.customData.customApps[0].fields.invoiceFiscalCode &&
			orderForm.customData.customApps[0].fields.invoiceFiscalCode != "_"
				? orderForm.customData.customApps[0].fields.invoiceFiscalCode
				: "",
		SDIPEC:
			orderForm.customData != null &&
			orderForm.customData.customApps[0].fields.SDIPEC != "_"
				? orderForm.customData.customApps[0].fields.SDIPEC
				: "",
		invoiceSocialReason: "",
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
			  )?.fields?.acceptTerms
			: false,
		useShippingAddress: true,
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
			refreshOrder().then(() => history.push(routes.SHIPPING))
		},
	})

	useEffect(() => {
		setIsProfileMutationLoading(loading)
	}, [loading])

	/*---------------*/
	/** UPDATE CUSTOM DATA PROFILE EMAIL */
	const updateProfileCustomDataMutation = (newCustomData: any) => {
		console.log("CALLING MUTATION TO UPDATE THE PROFILE CUSTOM DATA")
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
			console.log("Profile customData updated.")
			refreshOrder()
		},
	})

	const updateCustomDataHandler = (appSettings: AppSettings) => {
		let newProfileCustomData = {
			email: realEmail.email !== "" ? realEmail.email : values.email,
			accessCode:
				profileCustomData.accessCode && profileCustomData.accessCode !== ""
					? profileCustomData.accessCode
					: window.sessionStorage.getItem("sid") || "",
			optin: optinNewsLetter.toString(),
		}
    if(appSettings && appSettings.isMultilanguage) {
      newProfileCustomData.locale = orderForm?.clientPreferencesData?.locale || appSettings.defaultLocale;
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
				account,
				loggedIn,
			),
		)
		setIsSubmitting(true)
	}

	useEffect(() => {
		if (Object.keys(errors).length == 0 && isSubmitting) {
			if(appSettings?.isCC){
        updateCustomDataHandler(appSettings)
      }
      updateProfileInfoDataMutation()
		} else {
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
	}

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
			acceptTerms,
			setAcceptTerms,
			optinNewsLetter,
			setOptinNewsLetter,
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
	phoneError: {
		defaultMessage: "Enter a valid phone number, please.",
		id: "checkout-io.profile.errors.phone",
	},
	invoiceFiscalCode: {
		defaultMessage: "This field is mandatory. Please insert a valid fiscal code.",
		id:"checkout-io.profile.errors.fiscalcode"
	}
})
