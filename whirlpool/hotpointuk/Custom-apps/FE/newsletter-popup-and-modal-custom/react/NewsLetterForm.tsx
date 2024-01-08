import React, { useState, useContext, useEffect } from 'react'
import { Input, Checkbox, Button } from 'vtex.styleguide'
import style from './style.css'
import picture from './assets/pop-up-image.jpg'
import { usePixel } from 'vtex.pixel-manager'
import NewsletterContext from './NewsLetterContext'
import verify from './utils/verify'

interface NewsLetterFormProps {
	title?: string
	description?: boolean
	textButton?: string
	linkPrivacy: string
	name: boolean
	namePlaceholder: string
	surname: boolean
	surnamePlaceholder: string
	emailTitle: string
	emailPlaceholder: string
	nameTitle: string
	surnameTitle: string
	privacyMessage: string
	privacyMessageAnd: string
	privacyLink: string
	checkboxMessage: string
	errorLabelText: string
	successLabelText: string
}
interface WindowGTM extends Window {
	dataLayer: any[]
}

interface State {
	inputEmailErrorFlag: boolean
	inputNameErrorFlag: boolean
	inputSurnameErrorFlag: boolean
	inputCheckboxErrorFlag: boolean
}

const putNewOptinForUser = (email: any) => {
	const options = {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			isNewsletterOptIn: true,
		}),
	}
	const fetchUrlPatch = `/_v/wrapper/api/user/newsletteroptin?email=${email}`
	return fetch(fetchUrlPatch, options).then((response) => response.json())
}

const putNewUser = (email: string, name?: string, surname?: string) => {
	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email: email,
			firstName: name,
			lastName: surname,
			isNewsletterOptIn: true,
		}),
	}
	const fetchUrlPatch = '/_v/wrapper/api/user'
	return fetch(fetchUrlPatch, options).then((response) => response.json())
}

//Function to update CRM_User after user newsletter registration
// const updateCrmUser = (
//   email: string,
//   name?: string,
//   surname?: string,
// ) => {
//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       email: email,
//       firstName: name,
//       lastName: surname,
//       isNewsletterOptIn: true,
//     }),
//   };
//   const fetchUrlPatch = "/_v/wrapper/api/crm/createUpdateCrmUser";
//   return fetch(fetchUrlPatch, options).then((response) => response.json());
// };

const getIdUser = (email: string) => {
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	}

	const fetchUrl = '/_v/wrapper/api/user/email/userinfo?email=' + email
	return fetch(fetchUrl, options).then((response) => response.json())
}

const NewsLetterForm: StorefrontFunctionComponent<NewsLetterFormProps> = ({
	title,
	description,
	textButton,
	linkPrivacy = '/pagine/informativa-sulla-privacy',
	name = true,
	surname = true,
	emailTitle,
	emailPlaceholder,
	nameTitle,
	namePlaceholder,
	surnameTitle,
	surnamePlaceholder,
	privacyMessage,
	privacyLink,
	checkboxMessage,
	errorLabelText,
	successLabelText,
	privacyMessageAnd,
}: NewsLetterFormProps) => {
	const dataLayer = (window as unknown as WindowGTM).dataLayer || []
	const [emailValue, setEmailValue] = useState('')
	const [nameValue, setNameValue] = useState('')
	const [surnameValue, setSurnameValue] = useState('')
	// const [errorEmail, setErrorEmail] = useState(false);
	// const [errorName, setErrorName] = useState(false);
	// const [errorSurname, setErrorSurname] = useState(false);
	const [privacy, setPrivacy] = useState(false)
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const [isAlreadyRegistred, setAlreadyRegister] = useState(false)
	const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g
	const nameInput = React.useRef(null)
	const surnameInput = React.useRef(null)
	const policyInput = React.useRef(null)
	const [error, setError] = useState(false)
	const isRequired =
		(!regEx.test(emailValue) && emailValue !== '') || (error && !emailValue)
			? true
			: false
	const { push } = usePixel()
	const newsletterContext = useContext(NewsletterContext)
	/* component state  */
	const [state, setState] = useState<State>({
		inputEmailErrorFlag: false,
		inputNameErrorFlag: false,
		inputSurnameErrorFlag: false,
		inputCheckboxErrorFlag: false,
	})

	useEffect(() => {
		push({ event: 'popup', popupId: 'newsletter-popup', action: 'view' })
		return () => {
			push({ event: 'popup', popupId: 'newsletter-popup', action: 'close' })
		}
	}, [])

	function checkBoxValidation() {
		const el = document.querySelector(
			'.hotpointuk-newsletter-popup-custom-0-x-informativa .vtex-checkbox__line-container',
		) as HTMLInputElement
		const checkboxWrapper = document.querySelector(
			'.hotpointuk-newsletter-popup-custom-0-x-informativa .vtex-checkbox__box-wrapper',
		) as HTMLInputElement
		let privacyCheck = document.getElementById(
			'privacy-check',
		) as HTMLInputElement

		if (
			(privacyCheck != null && privacyCheck.checked === true) ||
			(error && !privacy)
		) {
			if (el != null) {
				el.style.background = '#f2f2f2f2'
				el.style.padding = '0.5rem'
				el.style.outline = '1px solid #f2f2f2f2'
				el.style.borderRadius = '0.25rem'
				checkboxWrapper.style.border = 'none'
			}
		} else {
			privacyCheck.checked = false
			el.style.background = 'white'
			el.style.padding = '0.5rem'
			el.style.outline = '1px solid red'
			el.style.borderRadius = '0.25rem'
			privacyCheck.style.border = '1px solid red'
			checkboxWrapper.style.border = '1px solid red'
		}
	}

	const handleSubmit = (e: any) => {
		e.preventDefault()
		e.stopPropagation()
		setLoading(true)
		getIdUser(emailValue).then((User: any) => {
			if (User.length > 0 && !User[0].isNewsletterOptIn) {
				putNewOptinForUser(User[0].email)
				setLoading(false)
				setSuccess(true)
				//updateCrmUser(emailValue, nameValue, surnameValue)
			} else if (User.length > 0 && User[0].isNewsletterOptIn) {
				setLoading(false)
				setSuccess(true)
				setAlreadyRegister(true)
				//updateCrmUser(emailValue, nameValue, surnameValue)
			} else {
				putNewUser(emailValue, nameValue, surnameValue).then(
					(repsonse: any) => {
						setAlreadyRegister(false)
						setLoading(false)
						if (repsonse.Message == undefined) {
							setSuccess(true)
							if (newsletterContext.automatic)
								push({
									event: 'newsletterAutomaticSubscription',
									text: textButton,
								})
							else push({ event: 'newsletterSubscription', text: textButton })

							dataLayer.push({
								event: 'userRegistration',
							})
							//GA4FUNREQ23
							push({
								event: 'ga4-personalArea',
								section: 'Newsletter',
								type: 'registration',
							})

							//GA4FUNREQ53
							push({
								event: 'ga4-form_submission',
								type: 'newsletter',
							})
							//GA4FUNREQ61
							push({
								event: 'ga4-optin',
							})

							//updateCrmUser(emailValue, nameValue, surnameValue)
						}
					},
				)
			}
		})
	}

	/*verify the inputs values */
	const verifyInputsValues = (e: any) => {
		let errorEmailFlag = verify.verifyEmail(emailValue)
		let errorNameFlag = verify.verifyName(nameValue)
		let errorSurnameFlag = verify.verifyName(surnameValue)
		let errorCheckboxFlag = verify.verifyCheck(privacy)
		setState({
			...state,
			inputEmailErrorFlag: errorEmailFlag,
			inputNameErrorFlag: errorNameFlag,
			inputSurnameErrorFlag: errorSurnameFlag,
			inputCheckboxErrorFlag: errorCheckboxFlag,
		})
		e.preventDefault()
		if (
			!errorEmailFlag &&
			!errorNameFlag &&
			!errorSurnameFlag &&
			!errorCheckboxFlag
		) {
			handleSubmit(e)
		} else {
			setError(true)
			//GA4FUNREQ58
			setAnalyticCustomError()
		}
	}

	//GA4FUNREQ58
	const setAnalyticCustomError = (): void => {
		const ga4Data = {
			event: 'ga4-custom_error',
			type: 'error message',
			description: '',
		}

		const errorMessages = {
			invalidEmailMessage: 'Please enter a valid email',
			noNameMessage: 'This field is required',
			noSurnameMessage: 'This field is required',
			privacyNotAccepted: 'This field is required',
		}

		if (!nameValue) {
			ga4Data.description = errorMessages.noNameMessage
			push({ ...ga4Data })
		}
		if (!surnameValue) {
			ga4Data.description = errorMessages.noSurnameMessage
			push({ ...ga4Data })
		}
		if (!regEx.test(emailValue)) {
			ga4Data.description = errorMessages.invalidEmailMessage
			push({ ...ga4Data })
		}
		if (!privacy) {
			ga4Data.description = errorMessages.privacyNotAccepted
			push({ ...ga4Data })
		}
	}

	const generateForm = () => {
		return (
			<div
				className={style.containerForm}
				onClick={() =>
					push({ event: 'popup', popupId: 'newsletter-popup', action: 'click' })
				}
			>
				<img src={picture} />
				{/* <div className={style.containerFormLeft}>
        </div> */}
				<div className={style.containerFormRight}>
					<h2 className={style.titleForm}>{title}</h2>
					<h4 className={style.descriptionForm}>{description}</h4>
					<form onSubmit={verifyInputsValues}>
						<div className={style.fieldContainer}>
							<Input
								label={emailTitle}
								placeholder={emailPlaceholder}
								value={emailValue}
								// type="email"
								onChange={(e: any) => setEmailValue(e.target.value)}
								required={isRequired}
							/>
							{(!regEx.test(emailValue) && emailValue !== '' && isRequired && (
								<span className={style.invalidInput}>
									Please enter a valid email
								</span>
							)) ||
								(error && isRequired && (
									<span className={style.invalidInput}>
										Please enter a valid email
									</span>
								))}
						</div>
						{name ? (
							<div className={style.fieldContainer}>
								<Input
									label={nameTitle}
									placeholder={namePlaceholder}
									value={nameValue}
									onChange={(e: any) => {
										setNameValue(e.target.value)
										setError(false)
									}}
									ref={nameInput}
									required={
										(document.activeElement === nameInput.current &&
											!nameValue) ||
										(error && !nameValue)
											? true
											: false
									}
									// required={true}
								/>
								{(document.activeElement === nameInput.current &&
									!nameValue && (
										<span className={style.invalidInput}>
											This field is required
										</span>
									)) ||
									(error && !nameValue && (
										<span className={style.invalidInput}>
											This field is required
										</span>
									))}
							</div>
						) : null}
						{surname ? (
							<div className={style.fieldContainer}>
								<Input
									label={surnameTitle}
									placeholder={surnamePlaceholder}
									value={surnameValue}
									onChange={(e: any) => setSurnameValue(e.target.value)}
									ref={surnameInput}
									required={
										(document.activeElement === surnameInput.current &&
											!surnameValue) ||
										(error && !surnameValue)
											? true
											: false
									}
								/>
								{(document.activeElement === surnameInput.current &&
									!surnameValue && (
										<span className={style.invalidInput}>
											This field is required
										</span>
									)) ||
									(error && !surnameValue && (
										<span className={style.invalidInput}>
											This field is required
										</span>
									))}
							</div>
						) : null}
						<div className={style.informativa}>
							<p className={style.privacy}>
								{privacyMessage}
								<span className={style.colorEdb112}>
									<a className={style.link} href={linkPrivacy} target="_blank">
										{privacyLink}
									</a>
								</span>
								<span>{privacyMessageAnd}</span>
							</p>

							<Checkbox
								checked={privacy}
								id="privacy-check"
								label={checkboxMessage}
								name="default-checkbox-group"
								onChange={(e: any) => {
									setPrivacy(e.target.checked)
									checkBoxValidation()
								}}
								// className={style.informativaError}
								// required={true}
								value={privacy}
								ref={policyInput}
							/>
							{(document.activeElement === policyInput.current &&
								privacy === false && (
									<span className={style.invalidInput}>
										This field is required
									</span>
								)) ||
								(error && !privacy && (
									<span className={style.invalidInput}>
										This field is required
									</span>
								))}
						</div>
						<div className={style.submitContainer}>
							{!loading ? (
								!success ? (
									<div className={style.formButton}>
										<Button type="submit">
											<p
												className={
													'vtex-paragraph__newsletter ' + style.paragraph
												}
											>
												{textButton}
											</p>
										</Button>
									</div>
								) : isAlreadyRegistred ? (
									<>
										{/* <div className={style.formButton}> */}
										{/* <Button type="submit" className={style.formButton}><p className={"vtex-paragraph__newsletter " + style.paragraph}>{textButton}</p></Button></div> */}
										<div style={{ marginBottom: '1rem' }} />
										<div className={style.errorClass}>{errorLabelText}</div>
									</>
								) : (
									<div className={style.successClass}>{successLabelText}</div>
								)
							) : (
								<div className={style.loaderForm}></div>
							)}
						</div>
					</form>
				</div>
			</div>
		)
	}

	return generateForm()
}

NewsLetterForm.schema = {
	title: 'NewsLetterFrom',
	description: 'Newsletter form',
	type: 'object',
	properties: {
		title: {
			title: 'Modal title',
			description: '',
			default: undefined,
			type: 'string',
		},
		description: {
			title: 'Modal subtitle',
			description: '',
			default: undefined,
			type: 'string',
		},
		textButton: {
			title: 'Button label',
			description: 'Label shown on the submit button',
			default: 'Sign me up',
			type: 'string',
		},
		linkPrivacy: {
			title: 'Link to privacy page',
			description: 'url privacy page',
			default: '',
			type: 'string',
		},
		labelCheck: {
			title: 'Label shown for checkbox privacy',
			description: '',
			default: '',
			type: 'string',
		},
		name: {
			title: 'Name field',
			description:
				'Boolean able to decide if the filed name should be visible or not',
			default: true,
			type: 'boolean',
		},
		surname: {
			title: 'Surname field',
			description:
				'Boolean able to decide if the filed surname should be visible or not',
			default: true,
			type: 'boolean',
		},
		emailTitle: {
			title: 'Email Title',
			description: 'This is the Email title before the input of this value',
			default: 'EMAIL *',
			type: 'string',
		},
		emailPlaceholder: {
			title: 'Email Placeholder',
			description: 'This is the Email placholder label',
			default: 'Email',
			type: 'string',
		},
		nameTitle: {
			title: 'Name Title',
			description: 'This is the Name title before the input of this value',
			default: 'NAME *',
			type: 'string',
		},
		namePlaceholder: {
			title: 'Name Placeholder',
			description: 'This is the Name placholder label',
			default: 'Name',
			type: 'string',
		},
		surnameTitle: {
			title: 'Surame Title',
			description: 'This is the Surname title before the input of this value',
			default: 'SURNAME *',
			type: 'string',
		},
		surnamePlaceholder: {
			title: 'Name Placeholder',
			description: 'This is the Surname placholder label',
			default: 'Surname',
			type: 'string',
		},
		privacyMessage: {
			title: 'Privacy Text',
			description: 'This is the privacy text without the link label',
			default: 'I have read and understood the content of the ',
			type: 'string',
		},
		privacyMessageAnd: {
			title: 'Privacy Text And',
			description: 'This is the privacy text without the link label',
			default: '.',
			type: 'string',
		},
		privacyLink: {
			title: 'Privacy Link',
			description: 'This is the privacy link label',
			default: 'informativa sulla privacy',
			type: 'string',
		},
		checkboxMessage: {
			title: 'Checkbox Text',
			description:
				'This is the text next to the checkbox for accepting marketing',
			default:
				'I consent to the processing of my personal data to allow  Whirlpool UK Appliances Ltd. to send me newsletters/marketing communications (in electronic and non-electronic form, including via telephone, postal services, e-mail, SMS, push notifications or banners on third party sites including on Meta and Google platforms) regarding products and services of  Whirlpool UK Appliances Ltd. even bought or registered by me, as well as to conduct market research.',
			type: 'string',
		},
		errorLabelText: {
			title: 'Error Label Text',
			description:
				'This is the text that appear in the red button when a user is already registered to the nesletter',
			default: 'Sei già registrato!',
			type: 'string',
		},
		successLabelText: {
			title: 'Success Label Text',
			description:
				'This is the text that appear in the green button when a user registered correctly',
			default: 'Grazie per esserti iscritto alla nostra newsletter!',
			type: 'string',
		},
	},
}

export default NewsLetterForm
