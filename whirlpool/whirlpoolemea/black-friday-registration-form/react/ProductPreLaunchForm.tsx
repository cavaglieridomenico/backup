import React, { useState, useReducer } from 'react'
import { Input, Checkbox, Button } from 'vtex.styleguide'
import { useCssHandles } from 'vtex.css-handles'
import { CustomPopup } from './customPopup'
// @ts-ignore
import RichText from 'vtex.rich-text/index'
import { useProductPreLaunch } from './useProductPreLaunch'

interface PreLaunchFormProps {
  textButton?: string
  nameLabel?: string
  surnameLabel?: string
  emailLabel?: string
  genericErrorMessage?: string
  errorName?: string
  errorSurname?: string
  errorEmail?: string
  errorCheckbox?: string
  successMessage?: string
  successMessage2?: string
  popUpBtnMessage?: string
  registeredErrorMessage?: string
  shouldLogInErrorMessage?: string
  genericApiErrorMessage?: string
  customCampaign?: string
  errorOptin?: string
  checkboxes?: [CheckboxProps]
  linkToRedirect?: string
  textBeforeCta?: string[]
  titles?: string[]
  privacyPolicyTextArray?: string[]
}

const CSS_HANDLES = [
  'formContainer',
  'formTitle',
  'inputContainer',
  'textInputContainer',
  'textInput',
  'nameInput',
  'errorMessage',
  'buttonContainer',
  'errorMessage',
  'button',
  'invalidButton',
  'label',
  'formTitle',
  'checkBoxes',
  'successClass',
  'loaderForm',
  'checked',
  'link',
  'textBeforeCta',
  'privacyPolicy',
] as const

const reducer = (state: any, target: any) => ({
  ...state,
  [target.name]: target.value,
})
const initialForm = {
  name: '',
  surname: '',
  email: '',
}

const PreLaunchForm: StorefrontFunctionComponent<PreLaunchFormProps> = ({
  titles = [],
  textButton = 'Send',
  nameLabel = 'Name',
  surnameLabel = 'Surname',
  emailLabel = 'Email',
  errorName = 'Name is requried',
  errorSurname = 'Surname is requried',
  errorEmail = 'Email is requried',
  errorCheckbox = 'This field is mandatory',
  genericErrorMessage = 'This field is required',
  successMessage = 'Thank you',
  successMessage2 = 'Subscription done succesfully',
  popUpBtnMessage = 'Continue',
  registeredErrorMessage = 'This email is already registered!',
  shouldLogInErrorMessage = 'This email is already associated to one account, please log in to continue',
  genericApiErrorMessage = 'Something went wrong, try again.',
  customCampaign = 'FORM_LP_PRODUCTLAUNCH',
  errorOptin = 'You must opt in to newsletter to proceed',
  checkboxes = [],
  linkToRedirect,
  textBeforeCta = [],
  privacyPolicyTextArray = [],
}) => {
  const [form, dispatch] = useReducer(reducer, initialForm)
  const handles = useCssHandles(CSS_HANDLES)
  //array with all checkboxes states (checked or not)
  const [checkboxesState, setCheckboxesState] = useState<any>(
    new Array(checkboxes?.length)?.fill(false)
  )
  const [showErrors, setShowErrors] = useState(false)
  // @ts-ignore
  const wichOneIsNewsletter = checkboxes.map(
    (item: CheckboxProps) => item?.checkboxNewsLetter
  )
  // @ts-ignore
  const errorCheckboxes = checkboxes?.map(
    ({ checkboxRequired }: CheckboxProps, index: number) =>
      checkboxRequired && !checkboxesState[index]
  )
  //if there are not checked checboxes at same index of wichoneisnewsletter optincheck is false
  const optInCheck = !wichOneIsNewsletter.some(
    (isNewsletter: boolean | undefined, index: number): boolean =>
      !!isNewsletter && !checkboxesState[index]
  )
  //check form if is valid
  const errors = {
    name: !form.name,
    surname: !form.surname,
    email: !form.email,
    optIn: !optInCheck,
  }
  //
  const { handleSubmit, status, isLoggedIn } = useProductPreLaunch({
    form,
    dispatch,
    errors,
    optInCheck,
    customCampaign,
    setShowErrors,
    textButton,
  })
  // Handle Inputs onBlur
  const handleBlur = (e: any) => {
    ;(errors as any)[e.target.name] =
      !e.target.validity.valid || !e.target.value
  }
  // Handle checkboxes
  const handleOnChangeCheckbox = (position: number) => {
    /* set Value to checkbox in position x */
    const updatedCheckboxesState = checkboxesState.map(
      (item: boolean, index: number) => (index == position ? !item : item)
    )
    //save array with state data in a state
    setCheckboxesState(updatedCheckboxesState)
  }
  // Handle error message to show
  const parseErrorMessage = () => {
    switch (status) {
      case 'LOGIN_ERROR':
        return shouldLogInErrorMessage
      case 'REGISTERED_ERROR':
        return registeredErrorMessage
      default:
        return genericApiErrorMessage
    }
  }

  return (
    <div className={handles.formContainer}>
      {titles &&
        titles.map((title: any, i: number) => (
          <h1 className={handles.formTitle} key={`title${i}`}>
            {title.__editorItemTitle}
          </h1>
        ))}

      <div className={handles.textInputContainer}>
        <Input
          id="Name"
          name="name"
          placeholder={nameLabel}
          value={form.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch(e.target)
          }
          required={true}
          errorMessage={
            errors.name && showErrors && (errorName ?? genericErrorMessage)
          }
          onBlur={handleBlur}
          disabled={isLoggedIn}
        />
        <Input
          id="Surname"
          name="surname"
          placeholder={surnameLabel}
          value={form.surname}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch(e.target)
          }
          required={true}
          errorMessage={
            errors.surname &&
            showErrors &&
            (errorSurname ?? genericErrorMessage)
          }
          onBlur={handleBlur}
          disabled={isLoggedIn}
        />
        <Input
          id="Email"
          name="email"
          placeholder={emailLabel}
          type="email"
          value={form.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            dispatch(e.target)
          }
          required={true}
          errorMessage={
            errors.email && showErrors && (errorEmail ?? genericErrorMessage)
          }
          onBlur={handleBlur}
          disabled={isLoggedIn}
        />
        {textBeforeCta?.map((text: any, i: number) => (
          <h2 key={`text2${i}`} className={handles.textBeforeCta}>
            {text.__editorItemTitle}
          </h2>
        ))}
        {status === 'LOADING' ? (
          <div className={handles.loaderForm}></div>
        ) : (
          <div className={handles.button} id="product launch subscription">
            <Button onClick={handleSubmit}>{textButton}</Button>
          </div>
        )}
      </div>

      {status === 'SUCCESS' ? (
        <CustomPopup
          message={successMessage}
          message2={successMessage2}
          btnMessage={popUpBtnMessage}
          linkToRedirect={linkToRedirect}
        />
      ) : (
        status !== 'LOADING' &&
        status && <p className={handles.errorMessage}>{parseErrorMessage()}</p>
      )}

      {errors.optIn && showErrors ? (
        <div className="c-danger t-small lh-title">{errorOptin}</div>
      ) : (
        <></>
      )}
      {/* PRIVACY SECTION */}
      <div>
        {/* TEXTS BEFORE CHECKBOXES */}
        {privacyPolicyTextArray.map((policyText: any, i: number) => (
          <RichText
            className={handles.privacyPolicy}
            text={policyText.__editorItemTitle}
            key={`policy${i}`}
          />
        ))}
        {/* CHECKBOXES CONTAINER */}
        <div
          id="checkbox-container"
          className={`flex flex-column justify-center items-left tj mb4`}
        >
          {/* @ts-ignore */}
          {checkboxes?.map((item: CheckboxProps, index: number) => (
            <div
              id="checkbox-wrapper"
              className={
                checkboxesState[index] ? handles.checked : handles.checkBoxes
              }
            >
              <div id="checkbox" key={`div-checkbox-${index}`}>
                <Checkbox
                  id={`custom-checkbox-${index}`}
                  name={item?.checkboxTitle}
                  label={item?.checkboxTitle}
                  value={checkboxesState[index]}
                  checked={checkboxesState[index]}
                  onChange={() => handleOnChangeCheckbox(index)}
                />
                {errorCheckboxes[index] && showErrors && (
                  <div className="c-danger t-small lh-title">
                    {errorCheckbox}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
PreLaunchForm.schema = {
  title: 'Pre Launch Form',
  description: 'Form used for the pre launch service subscription',
  type: 'object',
  properties: {
    blockClass: {
      title: 'blockClass',
      description: 'css class',
      default: '',
      type: 'string',
    },
    customCampaign: {
      title: 'customCampaign',
      description: 'campaign to be set if no provided throught URL',
      default: '',
      type: 'string',
    },
    titles: {
      type: 'array',
      title: 'Text for titles before form',
      items: {
        title: 'Text of title',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Insert text',
            type: 'string',
          },
        },
        'ui:widget': 'textarea',
      },
    },
    nameLabel: {
      title: 'nameLabel',
      description: 'Label for name input',
      default: 'Prenom',
      type: 'string',
    },
    surnameLabel: {
      title: 'surnameLabel',
      description: 'Label for surname input',
      default: 'Nom',
      type: 'string',
    },
    emailLabel: {
      title: 'emailLabel',
      description: 'Label for email input',
      default: 'Email',
      type: 'string',
    },
    privacyPolicyTextArray: {
      type: 'array',
      title: 'Privacy Text',
      items: {
        title: 'Text of privacyPolicy ',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Insert text and link of privacy using markdown',
            type: 'string',
            'ui:widget': 'textarea',
          },
        },
      },
    },
    checkboxes: {
      type: 'array',
      title: 'Checkboxes to print',
      items: {
        properties: {
          checkboxTitle: {
            title: 'checkbox Title',
            default:
              "Je consens au traitement de mes données personnelles pour permettre à Whirlpool France S.A.S. de m'envoyer des bulletins d'information/communications marketing (sous forme électronique et non électronique, y compris par téléphone, courrier traditionnel, e-mail, SMS, MMS, notifications push sur des sites tiers, y compris sur les plateformes Facebook et Google) concernant les produits et services de Whirlpool France S.A.S. même achetés ou enregistrés par vous.",
            type: 'string',
          },
          checkboxRequired: {
            title: 'is Required',
            type: 'boolean',
          },
          checkboxNewsLetter: {
            title: 'Is newsletter',
            type: 'boolean',
          },
        },
      },
    },
    textBeforeCta: {
      type: 'array',
      title: 'Text for titles before cta button',
      items: {
        title: 'Text of title before cta ',
        type: 'object',
        properties: {
          __editorItemTitle: {
            title: 'Insert text',
            type: 'string',
          },
        },
        'ui:widget': 'textarea',
      },
    },
    textButton: {
      title: 'textButton',
      description: 'Text of the submit button',
      default: '',
      type: 'string',
    },
    successMessage: {
      title: 'successMessage',
      description: 'successMessage',
      default: '',
      type: 'string',
    },
    successMessage2: {
      title: 'successMessage2',
      description: 'successMessage2',
      default: '',
      type: 'string',
    },
    popUpBtnMessage: {
      title: 'popUpBtnMessage',
      description: 'popUpBtnMessage',
      default: '',
      type: 'string',
    },
    linkToRedirect: {
      title: 'linkToRedirect',
      description:
        'link that redirects user after click on continue button of pop up',
      default: '',
      type: 'string',
    },
    errorName: {
      title: 'errorName',
      description: 'Label for errorName',
      default: 'Le prenom est requis',
      type: 'string',
    },
    errorSurname: {
      title: 'errorSurname',
      description: 'Label for errorsurname',
      default: 'Le prenom est requis',
      type: 'string',
    },
    errorEmail: {
      title: 'errorEmail',
      description: 'errorEmail',
      default: "L'e-mail est requis",
      type: 'string',
    },
    errorCheckbox: {
      title: 'errorCheckbox',
      description: 'erroCheckbox',
      default: 'Ce champ est obligatoire',
      type: 'string',
    },
    errorOptin: {
      title: 'errorOptin',
      description: 'error to warn user that he must opt in to newsletter',
      default: '',
      type: 'string',
    },
    genericErrorMessage: {
      title: 'genericErrorMessage',
      description: 'genericErrorMessage',
      default: 'Ce champ est requis',
      type: 'string',
    },
    genericApiErrorMessage: {
      title: 'genericApiErrorMessage',
      description: 'genericApiErrorMessage',
      default: '',
      type: 'string',
    },
    shouldLogInErrorMessage: {
      title: 'shouldLogInErrorMessage',
      description: 'shouldLogInErrorMessage',
      default: '',
      type: 'string',
    },
    registeredErrorMessage: {
      title: 'registeredErrorMessage',
      description: 'registeredErrorMessage',
      default: '',
      type: 'string',
    },
  },
}
export default PreLaunchForm
