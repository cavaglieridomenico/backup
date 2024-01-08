import React, { FC, useState } from 'react'
import style from './ffstyles.css'
import { useIntl } from 'react-intl'
import { plusSvg, minusSvg, plusSvgColor, minusSvgColor } from './vectors/vectors'
import { useSection } from './providers/context'
import { useRuntime } from "vtex.render-runtime"
import Toast from './components/Toast'


// interface Order {

// }

const FriendInvitation: FC = ({  }) => {
  const { handleSubmit, formError, setFormError, ExpirationDate, putUserResponse, setPutUserResponse, emailValue, setEmailValue } = useSection()

  const intl = useIntl()
  const { culture } = useRuntime()
  const [isOpen, setIsOpen] = useState(false)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const buttonIcon = Buffer.from(isOpen && isButtonHovered ? minusSvgColor : isOpen ? minusSvg : !isOpen && isButtonHovered ? plusSvgColor : plusSvg).toString("base64");

  return (
    <div className={style.invitationContainer}>
        {/* TOAST */}
        {putUserResponse == "OK" &&
        <Toast
        message={intl.formatMessage({ id: "store/ff-section.invite-email-success"})}
        />
        }
        {/* INVITE BUTTON */}
        <div className={style.invitationButtonContainer} onClick={() => {setIsOpen(!isOpen), setFormError(false), setPutUserResponse(undefined)}} onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)}>
        <button className={`${style.invitationButtonIconContainer} bg-action-primary b-action-primary`}>
          <img src={`data:image/svg+xml;base64,${buttonIcon}`} alt="Invite Button Icon" className={style.invitationButtonIcon}/>
        </button>
        <button className={`${style.invitationButtonTextContainer} bg-action-primary b-action-primary`}>
          <span className={style.invitationButtonText}>{intl.formatMessage({ id: "store/ff-section.invite-button-text"})}</span>
        </button>
        </div>
        {/* FORM */}
        <div className={isOpen ? style.invitationFormContainer : style.invitationFormContainerClosed}>
          <form onSubmit={(e: any) => handleSubmit(e)} className={style.invitationForm} >
            {/* Inputs */}
            <div className={style.invitationFormInputs}>
             <div className={style.emailInputContainer }>
              <label className={style.emailLabel} htmlFor="email">{intl.formatMessage({ id: "store/ff-section.invite-email-label"})}</label>
              <input className={!formError ? style.emailInput : style.emailInputError} type="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} onFocus={() => setFormError(false)} placeholder={intl.formatMessage({ id: "store/ff-section.invite-email-placeholder"})}/>
              {formError && <span className={style.errorLabel}>{intl.formatMessage({ id: "store/ff-section.invite-email-error"})}</span>}
              {putUserResponse && putUserResponse != "OK" ? <span className={style.errorLabel}>{culture.locale == "it-IT" || culture.locale == "en-US" ? intl.formatMessage({ id: "store/ff-section.invite-email-already-invited"}) : putUserResponse}</span> : null}
            </div>
            <div className={style.expDateInputConatiner}>
              <label className={style.expDateLabel} htmlFor="date">{intl.formatMessage({ id: "store/ff-section.invite-expDate-label"})}</label>
              <input className={style.expDateInput} type="text" value={ExpirationDate} disabled />
            </div>
            </div>
            {/* Buttons */}
            <div className={style.invitationFormButtons}>
              <button className={style.cancelButton} type="reset" onClick={(e) => {e.preventDefault(), setIsOpen(false), setFormError(false), setPutUserResponse(undefined), setEmailValue("")}}>{intl.formatMessage({ id: "store/ff-section.invite-cancel-button-text"})}</button>
              <button className={style.submitButton} type='submit'>{intl.formatMessage({ id: "store/ff-section.invite-confirm-button-text"})}</button>
            </div>
          </form>
        </div>
      </div>
    )
}

export default FriendInvitation
