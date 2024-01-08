//@ts--nocheck
import React, { useState, useEffect } from 'react';
//import { runtime } from './__fixtures__/runtime';
import  { useProduct }  from 'vtex.product-context';
import { useRuntime } from 'vtex.render-runtime';
import { Checkbox } from 'vtex.styleguide';
import styles from './styles.css';

interface BackInStockStandaloneProps {
  addToCartButtonModalTitle: string,
  addToCartButtonModalText: string,
  addToCartButtonModalEmailMeResponse201: string,
  addToCartButtonModalEmailMeResponse304: string,
  addToCartButtonModalEmailMeResponse500: string,
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
  addToCartButtonModalEmailMeLabelPrivacyDataSecondPart:string,
  addToCartButtonModalEmailMeLabelLinkPrivacyData: string,
  addToCartButtonModalEmailMeLabelLinkUrlPrivacyData: string,
  addToCartButtonModalEmailMeLabelErrorPrivacyData: string,
  modalTrigger: string,
  referenceNumberLabel: string,
  outOfStockLabel: string,
  closeModalButtonLabel: string,
  sendModalButtonLabel: string
  
}
const BackInStockStandalone: StorefrontFunctionComponent<BackInStockStandaloneProps> = (props) => {
  const [showModal, setShowModal] = useState(false)
  const [emailMeUserName, setEmailMeUserName] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [confirmEmailAddress, setConfirmEmailAddress] = useState("")
  const [showErrorMail, setShowErrorMail] = useState(false)
  const [showIncompleteForm, setShowIncompleteForm] = useState(false)
  const [showInvalidMail, setShowInvalidMail] = useState(false)
  const [showPrivacyCheckboxError, setShowPrivacyCheckboxError] = useState(false)
  const [showEmailMeResponseModal, setShowEmailMeResponseModal] = useState(false)
  const [emailMeResponseStatus, setEmailMeResponseStatus] = useState("")
  const [emailMeCheckedPrivacy, setEmailMeCheckedPrivacy] = useState(false)
  //const emailMeFormLanguage = runtime.culture.locale;
  const modalTitle = "Wir benachrichtigen Sie per E-Mail, sobald der Artikel wieder verfügbar ist.";
  //const modalText = props.addToCartButtonModalText;
  const emailMeResponse201 = props.addToCartButtonModalEmailMeResponse201;
  const emailMeResponse304 = props.addToCartButtonModalEmailMeResponse304;
  const emailMeResponse500 = props.addToCartButtonModalEmailMeResponse500;
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
  const modalTrigger = "RÜCKMELDUNG"
  const referenceNumberLabel = "Reference Number"
  const outOfStockLabel = "Zurzeit nicht im Shop verfügbar"
  const closeModalButtonLabel = "Schließen"
  const sendModalButtonLabel = "Absenden"
  const runtime = useRuntime();
  const emailMeFormLanguage = runtime.culture.language;



  const productContext = useProduct();

  useEffect(() => {
    setShowErrorMail(false)
    setShowInvalidMail(false)
    setShowIncompleteForm(false)
    setShowPrivacyCheckboxError(false)
  }, [emailAddress, confirmEmailAddress, emailMeUserName])

  const handleCloseModal: React.MouseEventHandler = event => {
    event.stopPropagation()
    event.preventDefault()
    setShowModal(false)
  }

  const preventEvent: React.MouseEventHandler = event => {
    event.stopPropagation()
    event.preventDefault()
  }

  const handleEmailMe: React.MouseEventHandler = event => {
    event.stopPropagation()
    event.preventDefault()
    setShowModal(true)
  }
  function validateEmail(email:any) {
    let re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const sendMail = () => {
    fetch('/v1/backinstock/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: emailAddress,
        refId: productContext?.product?.productReference,
        userName: emailMeUserName || "",
        language: emailMeFormLanguage
      })
    })
      .then(res => {
        setEmailMeResponseStatus(res.status.toString())
        return res.text()
      })
      .then(() => {
        setShowEmailMeResponseModal(true)
      })
      .catch(error => { console.log(error) })
      
  }

  const handleSendModal = () => {
    if (emailAddress && confirmEmailAddress && emailMeUserName) {
      if (emailAddress === confirmEmailAddress) {
        if (validateEmail(emailAddress)) {
          if (emailMeCheckedPrivacy) {
            sendMail();
            setShowModal(false)
          } else {
            setShowPrivacyCheckboxError(true)
            sendMail();
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



  return (
    <><div className={styles.emailMeButtonContainer}>
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
                          value={emailMeUserName}
                          onChange={(e) => {
                            setEmailMeUserName(e.currentTarget.value)
                          }} />
                        <label className={styles.emailMeModalFormText}>{addToCartButtonModalEmailMeLabelName}</label>
                      </div>
                      <div className={styles.emailMeModalFormWrapper}>

                        <input
                          placeholder={addToCartButtonModalEmailMeLabelEmail}
                          className={styles.emailMeModalInput}
                          value={emailAddress}
                          onChange={(e) => {
                            setEmailAddress(e.currentTarget.value)
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
                            <a href={addToCartButtonModalEmailMeLabelLinkUrlPrivacyData} target="_blank"  onClick={(e) => e.stopPropagation()}>{addToCartButtonModalEmailMeLabelLinkPrivacyData}</a>
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
                        onClick={() => { handleSendModal() }}>{sendModalButtonLabel}</div>
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
                      {emailMeResponseStatus === "201" ?
                        <div>{emailMeResponse201}</div> :
                        emailMeResponseStatus === "304" ?
                          <div>{emailMeResponse304}</div> :
                          emailMeResponseStatus === "500" ?
                            <div>{emailMeResponse500}</div> :
                            <div></div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}
          
        </>
  )
};

BackInStockStandalone.schema = {
  title: "Back in Stock Standalone",
  description: "Back in Stock Standalone",
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

export default BackInStockStandalone