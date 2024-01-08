import React, { useState, useEffect } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useIntl } from 'react-intl'
import { useMutation } from 'react-apollo'
// import { Button, Input, Checkbox } from 'vtex.styleguide'
import { Button, Input } from 'vtex.styleguide'
import { useProduct } from 'vtex.product-context'
import type { Seller } from 'vtex.product-context'
import { Checkbox } from 'vtex.styleguide';
import { usePixel } from 'vtex.pixel-manager';


import ADD_TO_AVAILABILITY_SUBSCRIBER_MUTATION from './graphql/addToAvailabilitySubscriberMutation.graphql'
import styles from './AvailabilitySubscriber.css'
import { getDefaultSeller } from './utils/sellers'

interface MutationVariables {
  acronym: string
  document: {
    fields: Array<{
      key: string
      value?: string | null
    }>
  }
}
interface Props {
  /* Product's availability */
  available?: boolean
  /* SKU id to subscribe to */
  skuId?: string
  /* spare plp */
  isPlp?: boolean
  addToCartButtonModalTitle: string,
  addToCartButtonModalText: string,
  emailMeSuccessMessage: string,
  emailMeErrorMessage: string,
  addToCartButtonModalEmailMeLabelName: string,
  addToCartButtonModalEmailMeLabelEmail: string,
  addToCartButtonModalEmailMeLabelConfirmEmail: string,
  addToCartButtonModalEmailMeLabelMandatoryField: string,
  addToCartButtonModalEmailMeLabelErrorIncompleteForm: string,
  addToCartButtonModalEmailMeLabelErrorDifferentMail: string,
  addToCartButtonModalEmailMeLabelErrorInvalidMail: string,
  //addToCartButtonModalEmailMeLabelPrivacyNotice: string,
  //addToCartButtonModalEmailMeLabelLinkPrivacyNotice: string,
  //addToCartButtonModalEmailMeLabelLinkUrlPrivacyNotice: string,
  addToCartButtonModalEmailMeLabelPrivacyData: string,
  addToCartButtonModalEmailMeLabelPrivacyDataSecondPart: string,
  addToCartButtonModalEmailMeLabelLinkPrivacyData: string,
  addToCartButtonModalEmailMeLabelLinkUrlPrivacyData: string,
  addToCartButtonModalEmailMeLabelErrorPrivacyData: string,
  modalTrigger: string,
  referenceNumberLabel: string,
  outOfStockLabel: string,
  closeModalButtonLabel: string,
  sendModalButtonLabel: string
}

const isAvailable = (commertialOffer?: Seller['commertialOffer']) => {
  return (
    commertialOffer &&
    (Number.isNaN(+commertialOffer.AvailableQuantity) ||
      commertialOffer.AvailableQuantity > 0)
  )
}

/**
 * Availability Subscriber Component.
 * A form where users can sign up to be alerted
 * when a product becomes available again
 */
function AvailabilitySubscriber(props: Props) {
  const [showModal, setShowModal] = useState(false)
  const [confirmEmailAddress, setConfirmEmailAddress] = useState("")
  const [showErrorMail, setShowErrorMail] = useState(false)
  const [showIncompleteForm, setShowIncompleteForm] = useState(false)
  const [showInvalidMail, setShowInvalidMail] = useState(false)
  const [showPrivacyCheckboxError, setShowPrivacyCheckboxError] = useState(false)
  const [showEmailMeResponseModal, setShowEmailMeResponseModal] = useState(false)
  const [emailMeCheckedPrivacy, setEmailMeCheckedPrivacy] = useState(false)
  //const emailMeFormLanguage = runtime.culture.locale;
  const modalTitle = "Wir benachrichtigen Sie per E-Mail, sobald der Artikel wieder verfügbar ist.";
  //const modalText = props.addToCartButtonModalText;
  const emailMeSuccessMessage = "E-Mail erfolgreich registriert"
  const emailMeErrorMessage = "Fehlgeschlagen, bitte versuchen Sie es erneut"
  const addToCartButtonModalEmailMeLabelName = "Name *";
  const addToCartButtonModalEmailMeLabelEmail = "E-Mail-Adresse *";
  const addToCartButtonModalEmailMeLabelConfirmEmail = "E-Mail-Adresse wiederholen *";
  const addToCartButtonModalEmailMeLabelMandatoryField = "Felder mit (*) sind Pflichtfelder";
  const addToCartButtonModalEmailMeLabelErrorIncompleteForm = "All the fields are mandatory";
  const addToCartButtonModalEmailMeLabelErrorDifferentMail = "Email addresses must the same";
  const addToCartButtonModalEmailMeLabelErrorInvalidMail = "Email addresses must be valid";
  /*const addToCartButtonModalEmailMeLabelPrivacyNotice = "I have read and understood the content of the ";
  const addToCartButtonModalEmailMeLabelLinkPrivacyNotice = "privacy notice.";
  const addToCartButtonModalEmailMeLabelLinkUrlPrivacyNotice = "https://www.hotpoint.co.uk/privacy-policy";*/
  const addToCartButtonModalEmailMeLabelPrivacyData = "Ich verstehe und bestätige den Inhalt der "
  const addToCartButtonModalEmailMeLabelLinkPrivacyData = "Datenschutzerklärung"
  const addToCartButtonModalEmailMeLabelPrivacyDataSecondPart = " und ich willige in die Verarbeitung meiner personenbezogenen Daten ein, damit Bauknecht mich per E-Mail informieren kann, wenn das Produkt wieder verfügbar ist. Die Daten werden maximal für 30 Tage gespeichert.";
  const addToCartButtonModalEmailMeLabelLinkUrlPrivacyData = "https://www.bauknecht.de/seiten/datenschutzerklaerung";
  const addToCartButtonModalEmailMeLabelErrorPrivacyData = "The Checkbox must be checked";
  const outOfStockIcon = 'data:image/svg+xml,%3Csvg xmlns="http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"%3E%3Cpath fill="%23b24c24" fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1Zm3.707 8.707a1 1 0 0 0-1.414-1.414L12 10.586L9.707 8.293a1 1 0 1 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293Z" clip-rule="evenodd"%2F%3E%3C%2Fsvg%3E'
  const modalTrigger = "BENACHRICHTIGUNG ANFRAGEN"
  const referenceNumberLabel = "Reference Number"
  const outOfStockLabel = "Zurzeit nicht im Shop verfügbar"
  const closeModalButtonLabel = "Schließen"
  const sendModalButtonLabel = "Absenden"
  //const runtime = useRuntime();
  //const emailMeFormLanguage = runtime.culture.language;

  const { push } = usePixel();


  const productContext = useProduct()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [didBlurEmail, setDidBlurEmail] = useState(false)
  // const [isPrivacy, setIsPrivacy] = useState(false)

  const [signUp, { loading, error, data }] = useMutation<
    unknown,
    MutationVariables
  >(ADD_TO_AVAILABILITY_SUBSCRIBER_MUTATION)

  const intl = useIntl()

  const seller = getDefaultSeller(productContext.selectedItem?.sellers)

  const available = props.available ?? isAvailable(seller?.commertialOffer)
  const skuId = props.skuId ?? productContext.selectedItem?.itemId
  const isPlp = props.isPlp

  // Render component only if the product is out of stock
  if (available || !skuId) {
    return null
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const variables: MutationVariables = {
      acronym: 'AS',
      document: {
        fields: [
          {
            key: 'skuId',
            value: skuId,
          },
          {
            key: 'name',
            value: name,
          },
          {
            key: 'email',
            value: email,
          },
          {
            key: 'notificationSend',
            value: 'false',
          },
          {
            key: 'createdAt',
            value: new Date().toISOString(),
          },
          {
            key: 'sendAt',
            value: null,
          },
        ],
      },
    }

    const signUpMutationResult = await signUp({
      variables,
    })

    if (!signUpMutationResult.errors) {
      setName('')
      setEmail('')
      if (isPlp) {
        setConfirmEmailAddress('')
        setShowModal(false)
        setShowEmailMeResponseModal(true)
      }
      handlePushEvent()
    } else {
      if (isPlp) {
        setName('')
        setEmail('')
        setConfirmEmailAddress('')
        setShowModal(false)
        setShowEmailMeResponseModal(true)
      }
    }

    const event = new CustomEvent('message:success', {
      detail: {
        success: true,
        message: intl.formatMessage({
          id: 'store/availability-subscriber.added-message',
        }),
      },
    })

    document.dispatchEvent(event)
  }

  const validateEmail = (newEmail: string) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    setEmailError(!emailRegex.test(newEmail.toLowerCase()))
  }
  // console.log("privacy",isPrivacy);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    validateEmail(e.target.value)
  }

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleCloseModal: React.MouseEventHandler = event => {
    event.stopPropagation()
    event.preventDefault()
    setShowModal(false)
    setShowEmailMeResponseModal(false)
  }

  let emailErrorMessage = ''

  if (didBlurEmail && emailError) {
    emailErrorMessage = intl.formatMessage({
      id: 'store/availability-subscriber.invalid-email',
    })
  }

  // const isFormDisabled = name === '' || email === '' || emailError || loading || isPrivacy === false
  const isFormDisabled = name === '' || email === '' || emailError || loading

  const handleEmailMe: React.MouseEventHandler = event => {
    event.stopPropagation()
    event.preventDefault()
    setShowModal(true)
  }
  const preventEvent: React.MouseEventHandler = event => {
    event.stopPropagation()
    event.preventDefault()
  }

  const handleSendModal = (e: any) => {
    if (email && confirmEmailAddress && name) {
      if (email === confirmEmailAddress) {
        if (validateEmailModal(email)) {
          if (emailMeCheckedPrivacy) {
            handleSubmit(e);
            setShowModal(false)
          } else {
            setShowPrivacyCheckboxError(true)
          }
        } else {
          setShowInvalidMail(true)
        }
      }
      else {
        setShowErrorMail(true)
      }
    }
    else {
      setShowIncompleteForm(true)
    }
  }



  function validateEmailModal(email: any) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  useEffect(() => {
    setShowErrorMail(false)
    setShowInvalidMail(false)
    setShowIncompleteForm(false)
    setShowPrivacyCheckboxError(false)
  }, [email, confirmEmailAddress, name])

  const handlePushEvent = () => {
    push({
      'event': 'emailMeWhenAvailableSpare',
      'product': productContext?.product
    })
  }



  if (isPlp) {
    return (

      <>
        <div className={styles.emailMeButtonContainer}>
          <button className={styles.buttonEmailMe}
            onClick={
              (e) => {
                preventEvent(e);
                handleEmailMe(e);
              }
            }>

            {modalTrigger}
          </button>
        </div>

        {showModal && (
          <div className={styles.emailMeModalCentered} onClick={(e) => preventEvent(e)}>
            <div onClick={handleCloseModal} className={styles.emailMeModalOverlay}></div>
            <div className={styles.emailMeModalWrapper}>
              <div className={styles.emailMeModal}
              >
                <div
                  className={styles.emailMeModalClose}
                  onClick={handleCloseModal}
                >
                  &times;
                </div>
                <div className={styles.emailMeModalTitle}>
                  {modalTitle}
                </div>
                <div className={styles.emailMeModalImageDetailsRow}>
                  {/* div row per immagine e dati prodotto */}
                  <img src={productContext?.selectedItem?.images[0].imageUrl} className={styles.emailMeImage}></img>
                  <div className={styles.emailMeModalProductDetailsColumn}>
                    <div className={styles.emailMeModalProductName}>
                      {productContext?.selectedItem?.name}
                    </div>
                    <div className={styles.emailMeModalProductReference}>
                      {referenceNumberLabel}: {productContext?.product?.productReference}
                    </div>
                    <div className={styles.emailMeModalOutOfStock}>
                      <div className={styles.emailMeModalOutOfStockIcon}>
                        <img src={outOfStockIcon} />
                      </div>
                      <div className={styles.emailMeModalOutOfStockLabel}>{outOfStockLabel}</div>
                    </div>
                  </div>

                </div>

                {/*<div className={styles.emailMeModalSubitle}>
            {modalText}
          </div>
          */}
                <div className={styles.emailMeModalForm}>
                  <div className={styles.emailMeModalFormWrapper}>
                    <input
                      placeholder={addToCartButtonModalEmailMeLabelName}
                      className={styles.emailMeModalInput}
                      value={name}
                      onChange={(e) => {
                        setName(e.currentTarget.value)
                      }} />
                    <label className={styles.emailMeModalFormText}>{addToCartButtonModalEmailMeLabelName}</label>
                  </div>
                  <div className={styles.emailMeModalFormWrapper}>

                    <input
                      placeholder={addToCartButtonModalEmailMeLabelEmail}
                      className={styles.emailMeModalInput}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.currentTarget.value)
                      }} />
                    <label className={styles.emailMeModalFormText}>{addToCartButtonModalEmailMeLabelEmail}</label>
                  </div>
                  <div className={styles.emailMeModalFormWrapper}>

                    <input
                      placeholder={addToCartButtonModalEmailMeLabelConfirmEmail}
                      className={styles.emailMeModalInput}
                      value={confirmEmailAddress}
                      onChange={(e) => {
                        setConfirmEmailAddress(e.currentTarget.value)
                      }} />
                    <label className={styles.emailMeModalFormText}>{addToCartButtonModalEmailMeLabelConfirmEmail}</label>
                  </div>
                  <p>{addToCartButtonModalEmailMeLabelMandatoryField}</p>
                  {showIncompleteForm &&
                    <div className={styles.emailMeModalFormTextError}>{addToCartButtonModalEmailMeLabelErrorIncompleteForm}</div>}
                  {showErrorMail &&
                    <div className={styles.emailMeModalFormTextError}>{addToCartButtonModalEmailMeLabelErrorDifferentMail}</div>}
                  {showInvalidMail &&
                    <div className={styles.emailMeModalFormTextError}>{addToCartButtonModalEmailMeLabelErrorInvalidMail}</div>}
                  {/*<p>{addToCartButtonModalEmailMeLabelPrivacyNotice}<a href={addToCartButtonModalEmailMeLabelLinkUrlPrivacyNotice} target="_blank" onClick={(e) => e.stopPropagation()}>{addToCartButtonModalEmailMeLabelLinkPrivacyNotice}</a></p>*/}
                  <div>
                    <label
                      className={styles.emailMeCheckboxLabel}
                      onClick={() => {
                        setEmailMeCheckedPrivacy(!emailMeCheckedPrivacy)
                      }
                      }>
                      <div className={styles.emailMeCheckbox}>
                        <Checkbox
                          checked={emailMeCheckedPrivacy}
                          onChange={() => setEmailMeCheckedPrivacy(!emailMeCheckedPrivacy)}
                        />
                      </div>
                      <div>
                        {addToCartButtonModalEmailMeLabelPrivacyData}
                        <a href={addToCartButtonModalEmailMeLabelLinkUrlPrivacyData} target="_blank" onClick={(e) => e.stopPropagation()}>{addToCartButtonModalEmailMeLabelLinkPrivacyData}</a>
                        {addToCartButtonModalEmailMeLabelPrivacyDataSecondPart}
                      </div>
                    </label>
                  </div>
                  {showPrivacyCheckboxError &&
                    <div className={styles.emailMeModalFormTextError}>{addToCartButtonModalEmailMeLabelErrorPrivacyData} </div>}

                </div>
                <div className={styles.emailMeModalButtonsRow}>
                  {/* row bottoni */}
                  <div
                    className={styles.emailMeModalButtonClose}
                    onClick={() => setShowModal(false)}>{closeModalButtonLabel}</div>
                  <div
                    className={styles.emailMeModalButtonSend}
                    onClick={(e) => { handleSendModal(e) }}>{sendModalButtonLabel}</div>
                </div>

              </div>
            </div>
          </div>
        )}

        {showEmailMeResponseModal && (
          <div onClick={(e) => preventEvent(e)}>
            <div onClick={handleCloseModal}
              className={styles.emailMeModalOverlay}></div>
            <div className={styles.emailMeModalWrapper}>
              <div className={styles.emailMeModal}
              >
                <div
                  className={styles.emailMeModalClose}
                  onClick={() => setShowEmailMeResponseModal(false)}
                >
                  &times;
                </div>
                <div className={styles.emailMeResponseModalText}>
                  {!error && data && (
                    <div className={styles.successModal}>
                      {emailMeSuccessMessage}
                    </div>
                  )}
                  {error && (
                    <div className={`${styles.error} c-danger`}>
                      {{ emailMeErrorMessage }}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </>

    )

  }
  else {
    return (
      <div className={styles.subscriberContainer} id="backInStockForm">
        <div className={`${styles.title} t-body mb3`}>
          {/* "store/availability-subscriber.privacy" */}
          {intl.formatMessage({ id: 'store/availability-subscriber.title' })}
        </div>
        <div className={`${styles.subscribeLabel} t-small fw3`}>
          {/* {intl.formatMessage({
          id: 'store/availability-subscriber.subscribe-label',
        })}
        <br /> */}
          Ihre E-Mailadresse wird gemäß unseren <a className={styles.privacyLink} href='/seiten/datenschutzerklaerung'>Datenschutzbestimmungen</a> verarbeitet.
        </div>
        <form className={`${styles.form} mb4`} onSubmit={e => handleSubmit(e)}>
          <div >
            <div className={`${styles.content} flex-ns justify-between mt4 mw6`}>
              <div className={`${styles.input} ${styles.inputName} w-100 mr5 mb4`}>
                <Input
                  name="name"
                  type="text"
                  placeholder={intl.formatMessage({
                    id: 'store/availability-subscriber.name-placeholder',
                  })}
                  value={name}
                  onChange={handleNameChange}
                />
              </div>
              <div className={`${styles.input} ${styles.inputEmail} w-100 mr5 mb4`}>
                <Input
                  name="email"
                  type="text"
                  placeholder={intl.formatMessage({
                    id: 'store/availability-subscriber.email-placeholder',
                  })}
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => setDidBlurEmail(true)}
                  error={didBlurEmail && emailError}
                  errorMessage={emailErrorMessage}
                />
              </div>

            </div>
            {/* <div className={`${styles.checkbox}`}>
          <Checkbox
              name="privacy"
              id="privacy"
              checked={isPrivacy}
              type="text"
              placeholder={intl.formatMessage({
                id: 'store/availability-subscriber.email-placeholder',
              })}
              value={isPrivacy}
              onChange={(e: any) => {
                setIsPrivacy(e.target.checked);
              }}
              required={true}
            label=""  
            
            /><span> {intl.formatMessage({
              id: 'store/availability-subscriber.privacy',
            })}</span>
          </div> */}
            <div className={`${styles.submit} flex items-center mb4`}>
              <Button
                className={styles.avvisamiBtn}
                type="submit"
                variation="primary"
                size="small"
                disabled={isFormDisabled}
                isLoading={loading}
              >
                {intl.formatMessage({
                  id: 'store/availability-subscriber.notifiy-me',
                })}
              </Button>
            </div>
          </div>
          {!error && data && (
            <div className={`${styles.success} t-body c-success`}>
              {intl.formatMessage({
                id: 'store/availability-subscriber.added-message',
              })}
            </div>
          )}
          {error && (
            <div className={`${styles.error} c-danger`}>
              {intl.formatMessage({
                id: 'store/availability-subscriber.error-message',
              })}
            </div>
          )}
        </form>
      </div>
    )
  }
}

AvailabilitySubscriber.schema = {
  title: "Avalability subscriber",
  description: "Avalability subscriber",
  type: "object",
  properties: {
    modalTitle: {
      title: "modalTitle",
      description: "modalTitle",
      default: undefined,
      type: "string",
    },
    modalTrigger: {
      title: "Label of the modal trigger",
      description: "Label of the modal trigger",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelName: {
      title: "addToCartButtonModalEmailMeLabelName",
      description: "addToCartButtonModalEmailMeLabelName",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelEmail: {
      title: "addToCartButtonModalEmailMeLabelEmail",
      description: "addToCartButtonModalEmailMeLabelEmail",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelConfirmEmail: {
      title: "addToCartButtonModalEmailMeLabelConfirmEmail",
      description: "addToCartButtonModalEmailMeLabelConfirmEmail",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelMandatoryField: {
      title: "addToCartButtonModalEmailMeLabelMandatoryField",
      description: "addToCartButtonModalEmailMeLabelMandatoryField",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelErrorIncompleteForm: {
      title: "addToCartButtonModalEmailMeLabelErrorIncompleteForm",
      description: "addToCartButtonModalEmailMeLabelErrorIncompleteForm",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelErrorDifferentMail: {
      title: "addToCartButtonModalEmailMeLabelErrorDifferentMail",
      description: "addToCartButtonModalEmailMeLabelErrorDifferentMail",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelErrorInvalidMail: {
      title: "addToCartButtonModalEmailMeLabelErrorInvalidMail",
      description: "addToCartButtonModalEmailMeLabelErrorInvalidMail",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelPrivacyData: {
      title: "addToCartButtonModalEmailMeLabelPrivacyData",
      description: "addToCartButtonModalEmailMeLabelPrivacyData",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelPrivacyDataSecondPart: {
      title: "addToCartButtonModalEmailMeLabelPrivacyDataSecondPart",
      description: "addToCartButtonModalEmailMeLabelPrivacyDataSecondPart",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelLinkPrivacyData: {
      title: "addToCartButtonModalEmailMeLabelLinkPrivacyData",
      description: "addToCartButtonModalEmailMeLabelLinkPrivacyData",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelLinkUrlPrivacyData: {
      title: "addToCartButtonModalEmailMeLabelLinkUrlPrivacyData",
      description: "addToCartButtonModalEmailMeLabelLinkUrlPrivacyData",
      default: undefined,
      type: "string",
    },
    addToCartButtonModalEmailMeLabelErrorPrivacyData: {
      title: "addToCartButtonModalEmailMeLabelName",
      description: "addToCartButtonModalEmailMeLabelName",
      default: undefined,
      type: "string",
    },
    referenceNumberLabel: {
      title: "referenceNumberLabel",
      description: "referenceNumberLabel",
      default: undefined,
      type: "string",
    },
    outOfStockLabel: {
      title: "addToCartButtonMooutOfStockLabeldalEmailMeLabelName",
      description: "outOfStockLabel",
      default: undefined,
      type: "string",
    },
    emailMeSuccessMessage: {
      title: "emailMeSuccessMessage",
      description: "emailMeSuccessMessage",
      default: undefined,
      type: "string",
    },
    emailMeErrorMessage: {
      title: "emailMeErrorMessage",
      description: "emailMeErrorMessage",
      default: undefined,
      type: "string",
    },
    closeModalButtonLabel: {
      title: "closeModalButtonLabel",
      description: "closeModalButtonLabel",
      default: undefined,
      type: "string",
    },
    sendModalButtonLabel: {
      title: "sendModalButtonLabel",
      description: "sendModalButtonLabel",
      default: undefined,
      type: "string",
    }
  }
};

export default AvailabilitySubscriber