import React, { useState } from 'react';
import { useCssHandles } from "vtex.css-handles";
import { useDevice } from "vtex.device-detector";
import { index as RichText } from "vtex.rich-text";
import {
    Button,
    Checkbox,
    Dropzone,
    Input
} from 'vtex.styleguide';
import "./style.css";
import { handleRegistration } from './utils';

interface FormProps {
    customCampaign?: string;
    successMessage?: string;
    fetchErrorMessage?: string;
    heading?: string;
    namePlaceholder?: string;
    nameErrorMessage?: string;
    surnamePlaceholder?: string;
    surnameErrorMessage?: string;
    emailPlaceholder?: string;
    emailErrorMessage?: string;
    dropzoneLabel?: string;
    dropzoneLabelMobile?: string;
    dropzoneErrorMessage?: string;
    maxImageSize?: number;
    privacyText?: string;
    checkboxes?: Checkbox[];
    buttonLabel?: string;
}

type Checkbox = {
    checkboxLabel?: string;
    isMandatory?: boolean;
    isNewsletter?: boolean;
    checkboxErrorMessage?: string;
}

export type FormState = {
    name: string;
    surname: string;
    email: string;
    image: string;
    [key: string]: any;
}

type ErrorsState = {
    nameError: boolean;
    surnameError: boolean;
    emailError: boolean;
    imageError: boolean;
    dropzoneError: boolean;
    [key: string]: any;
}

type SubmitStatus = "DEFAULT" | "SUCCESS" | "LOADING" | "FAILED";

const CSS_HANDLES = [
    "formContainer",
    "form",
    "headingContainer",
    "formHeading",
    "inputGroupContainer",
    "dropzoneContainer",
    "dropzoneLabel",
    "dropzoneError",
    "privacyTextContainer",
    "checkboxContainer",
    "loaderForm",
    "submitButtonContainer"
] as const

const initialFormState: FormState = {
    name: "",
    surname: "",
    email: "",
    image: "",
    checkboxes: ""
}

const initialErrorsState: ErrorsState = {
    nameError: false,
    surnameError: false,
    emailError: false,
    imageError: false,
    dropzoneError: false,
    checkboxesError: [false]
}

const initialCheckboxes: Checkbox[] = [
    {checkboxLabel: "[Assicurati che solo il tuo piatto culinario sia visibile nella foto e che non catturi immagini di persone, minori o altri contenuti sullo sfondo.](/the-home-love-menu)", isMandatory: true, isNewsletter: false},
    {checkboxLabel: "Acconsento al trattamento dei miei dati personali per permettere a Whirlpool Italia Srl di inviarmi newsletter/comunicazioni di marketing (in forma elettronica e non, anche tramite telefono, posta tradizionale, e-mail, SMS, notifiche push su siti di terze parti tra cui sulle piattaforme Facebook e Google) riguardanti prodotti e servizi di Whirlpool Italia Srl, anche da me acquistati o registrati, nonché di svolgere ricerche di mercato. Con la registrazione potrò usufruire di uno sconto del 5% valido sul primo acquisto effettuato entro 12 mesi dalla registrazione. Sconto cumulabile con le altre offerte in essere.", isMandatory: true, isNewsletter: true}
]

const MasterchefForm: StorefrontFunctionComponent<FormProps> = ({
    customCampaign,
    successMessage,
    fetchErrorMessage,
    heading,
    namePlaceholder,
    nameErrorMessage,
    surnamePlaceholder,
    surnameErrorMessage,
    emailPlaceholder,
    emailErrorMessage,
    dropzoneLabel,
    dropzoneLabelMobile,
    dropzoneErrorMessage,
    maxImageSize,
    privacyText,
    checkboxes = initialCheckboxes,
    buttonLabel
}) => {
    const [form, setForm] = useState({...initialFormState, checkboxes: [...checkboxes].map((item) => ({...item, checked: false}))});
    const [errors, setErrors] = useState(initialErrorsState);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("DEFAULT")
    const {device, isMobile} = useDevice();
    const handles = useCssHandles(CSS_HANDLES);

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    const handleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => {
            return {...prev, [e.target.name]: e.target.value}
        })
    }

    const handleChangeCheckboxes = (index: number) => {
        // HANDLE THE CHANGE EVENT OF THE CHECKBOXES
        setForm(prev => {
            const copyCheckboxesState = [...prev.checkboxes]
            const newCheckboxesState = copyCheckboxesState.map((item, number) => number === index ? ({...item, checked: !item.checked}) : item);
            return {...prev, checkboxes: newCheckboxesState}
        })
    }

    const handleDropAccepted = (file: any) => {
        setErrors((prev) => {
            return {...prev, dropzoneError: false}
        })
        setForm(prev => {
            return {...prev, image: file}
        })
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // CHECK IF AN IMAGE HAS BEEN UPLOADED BY USER
        if (!form.image) {
            setErrors((prev) => {
                return {...prev, dropzoneError: true}
            })
            return;
        }
        // HANDLE MANDATORY CHECKBOXES IF NOT CHECKED
        const newCheckboxErrorsState = [...errors.checkboxesError]
        form.checkboxes.map((checkbox, index: number) => {
            if (checkbox.isMandatory && !checkbox.checked) {
                newCheckboxErrorsState[index] = true;
        }});
        setErrors((prev) => {
            return {...prev, checkboxesError: newCheckboxErrorsState}
        })
        handleRegistration(form, customCampaign, setSubmitStatus, buttonLabel)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // CHECK THAT EMAIL IS NOT EMPTY AND HAS VALID EMAIL TEMPLATE
        if (e.target.name === "email") {
            const isValid = e.target.value.trim() && emailRegex.test(e.target.value.trim());
            if (!isValid) {
                setErrors(prev => {
                    return {...prev, emailError: true}
                })
            } else {
                setErrors(prev => {
                    return {...prev, emailError: false}
                })
            };
            return;
        }
        // CHECK THAT OTHER INPUTS ARE NOT EMPTY
        if (!e.target.value.trim()) {
            setErrors((prev) => {
                return {...prev, [e.target.name + "Error"]: true}
            })
        } else {
            setErrors((prev) => {
                return {...prev, [e.target.name + "Error"]: false}
            })
        }
    }

    const convertMaxImageSize = (number: number | undefined) => {
        if (!number) return undefined;
        const sizeInBytes = number * 1000
        return sizeInBytes;
    }
    
    return (
        <div className={`${handles.formContainer} pv6 ph3`}>
            <form className={`${handles.form} mw-100`} onSubmit={handleSubmit}>
                <div className={`${handles.headingContainer} mb3`}>
                    <RichText
                        text={heading}
                        textAlignment={device === "phone" ? "CENTER" : "LEFT"}
                        textPosition={device === "phone" ? "CENTER" : "LEFT"} />
                </div>
                <div className={`${handles.inputGroupContainer} flex flex-column flex-row-l mb6`}>
                    <Input
                        id="Name"
                        name="name"
                        placeholder={namePlaceholder}
                        required={true}
                        value={form.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInputs(e)}
                        errorMessage={errors.nameError && nameErrorMessage}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur(e)}
                    />
                    <Input
                        id="Surname"
                        name="surname"
                        placeholder={surnamePlaceholder}
                        required={true}
                        value={form.surname}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInputs(e)}
                        errorMessage={errors.surnameError && surnameErrorMessage}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur(e)}
                    />
                    <Input
                        id="Email"
                        name="email"
                        placeholder={emailPlaceholder}
                        required={true}
                        value={form.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeInputs(e)}
                        errorMessage={errors.emailError && emailErrorMessage}
                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur(e)}
                    />
                </div>
                <div className={`${handles.dropzoneContainer} mb6`}>
                    <Dropzone 
                        accept=".png, .jpg, .jpeg"
                        icon={MasterchefIcon}
                        multiple={false}
                        maxSize={convertMaxImageSize(maxImageSize) ?? 45000000}
                        onDropAccepted={(file: any) => handleDropAccepted(file[0])}
                        onDropRejected={() => setErrors(prev => {
                            return {...prev, dropzoneError: true}
                        })}
                        onFileReset={() => setForm((prev) => {
                            return {...prev, image: ""}
                        })}
                    >
                        <div className={`${handles.dropzoneLabel} pt6`}>
                            <RichText
                                text={!isMobile ? dropzoneLabel : dropzoneLabelMobile}
                                textAlignment={device === "phone" ? "CENTER" : "LEFT"}
                                textPosition={device === "phone" ? "CENTER" : "LEFT"}
                            />
                        </div>
                    </Dropzone>
                    {errors.dropzoneError && (
                        <p className={`${handles.dropzoneError} c-danger t-small lh-title`}>{dropzoneErrorMessage}</p>
                    )}
                </div>
                {privacyText && (
                    <div className={`${handles.privacyTextContainer} mb1`}>
                        <RichText
                            text={privacyText}
                        />
                    </div>
                )}
                {checkboxes?.map((checkbox: Checkbox, index: number) => (
                    <div className={`${handles.checkboxContainer} mb5`} key={index}>
                        <Checkbox
                            id={`checkbox-${index}`}
                            name={`checkbox-${index}`}
                            label={<RichText text={checkbox.checkboxLabel} />}
                            value={form.checkboxes[index].checked}
                            checked={form.checkboxes[index].checked}
                            required={checkbox.isMandatory}
                            onChange={() => handleChangeCheckboxes(index)}
                        />
                        {checkbox.isMandatory && errors.checkboxesError[index] === true && (
                            <p className={`${handles.checkboxError} c-danger t-small lh-title`}>{checkbox.checkboxErrorMessage}</p>
                        )}
                    </div>
                ))}
                {submitStatus === "DEFAULT" && (
                    <div className={`${handles.submitButtonContainer} flex justify-center justify-end-ns mb6`}>
                        <Button type="submit">{buttonLabel}</Button>
                    </div>
                )}
                {submitStatus === "LOADING" && (
                    <div className={handles.loaderForm}></div>
                )}
                {submitStatus === "FAILED" && (
                    <p className={`${handles.fetchErrorMessage} c-danger t-small lh-title tc`}>{fetchErrorMessage}</p>
                )}
                {submitStatus === "SUCCESS" && (
                    <p className={`${handles.successMessage} c-action-primary t-heading-5 tc`}>{successMessage}</p>
                )}
            </form>
        </div>
    )
}

MasterchefForm.schema = {
    title: 'Masterchef Form',
    description: 'Component that renders the masterchef form',
    type: 'object'
}

export default MasterchefForm

const MasterchefIcon = (
    <svg width="60" height="60" viewBox="0 0 47 45" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.1649 3.99088L23.5 4.29358L23.8352 3.99088C26.3336 1.73434 29.5335 0.5 32.926 0.5C36.5545 0.5 39.9633 1.91194 42.529 4.47762C47.8237 9.77241 47.8237 18.3888 42.5291 23.6836L40.8393 25.3733L40.6928 25.5198V25.7269V43.8409C40.6928 43.9791 40.5808 44.0911 40.4426 44.0911H6.55753C6.41936 44.0911 6.30732 43.9791 6.30732 43.8409V25.7269V25.5198L6.16087 25.3733L4.47109 23.6836C-0.823698 18.3888 -0.823698 9.77241 4.47109 4.47762C7.03678 1.91194 10.4456 0.5 14.0741 0.5C17.4664 0.5 20.6665 1.73425 23.1649 3.99088ZM6.80764 43.0907V43.5907H7.30764H39.6923H40.1923V43.0907V41.5903V41.0903H39.6923H7.30764H6.80764V41.5903V43.0907ZM40.2654 25.2393L40.2655 25.2392L42.1751 23.3297C47.2753 18.2294 47.2753 9.93177 42.175 4.83132L41.8214 5.18487L42.175 4.83131C39.705 2.36148 36.4188 1.00023 32.9258 1.00023C29.4369 1.00023 26.1541 2.35837 23.6852 4.82288L23.6847 4.82326C23.6829 4.82491 23.6806 4.82698 23.6779 4.82942C23.6749 4.83217 23.6714 4.83539 23.6676 4.83895L23.6569 4.84911L23.6468 4.85989C23.641 4.86615 23.6362 4.87155 23.633 4.87515L19.4329 9.07522L19.4328 9.07534C19.384 9.12418 19.3209 9.14853 19.256 9.14853C19.1912 9.14853 19.1281 9.12418 19.0793 9.07534L19.0791 9.07516C18.9815 8.97758 18.9814 8.81918 19.0791 8.72143L22.7765 5.02418L23.1513 4.64937L22.7553 4.29705C20.3599 2.16616 17.3054 1.00033 14.074 1.00033C10.581 1.00033 7.29463 2.36157 4.82479 4.83142L4.82478 4.83142C-0.27546 9.93177 -0.275465 18.2294 4.82479 23.3297L6.73433 25.2392L6.73445 25.2393C6.78127 25.2861 6.80764 25.3497 6.80764 25.4161V40.0898V40.5898H7.30764H39.6922H40.1922V40.0898V25.4161C40.1922 25.3497 40.2186 25.2861 40.2654 25.2393Z" stroke="white"/>
<path d="M32.2765 25.1659L32.5658 24.4733L35.3076 17.9075C35.3608 17.7799 35.3006 17.6334 35.1731 17.5802C35.0455 17.5269 34.899 17.5872 34.8457 17.7147L31.8625 24.8586L31.7342 25.1659H31.4011H24.2503H23.7503V24.6659V17.8111C23.7503 17.6729 23.6382 17.5609 23.5001 17.5609C23.3619 17.5609 23.2499 17.6729 23.2499 17.8111V24.6659V25.1659H22.7499H15.599H15.266L15.1376 24.8586L12.1544 17.7147L12.1544 17.7146C12.1013 17.5874 11.9549 17.527 11.8271 17.5802C11.6996 17.6334 11.6393 17.78 11.6926 17.9075L32.2765 25.1659ZM32.2765 25.1659H33.0272M32.2765 25.1659H33.0272M33.0272 25.1659H37.4417C37.5799 25.1659 37.6919 25.278 37.6919 25.4161C37.6919 25.5543 37.5799 25.6664 37.4417 25.6664H9.55832C9.42014 25.6664 9.30811 25.5543 9.30811 25.4161C9.30811 25.278 9.42014 25.1659 9.55832 25.1659H13.973H14.7236M33.0272 25.1659H14.7236M14.7236 25.1659L14.4344 24.4733M14.7236 25.1659L14.4344 24.4733M14.4344 24.4733L11.6926 17.9075L14.4344 24.4733Z" stroke="white"/>
</svg>
)
