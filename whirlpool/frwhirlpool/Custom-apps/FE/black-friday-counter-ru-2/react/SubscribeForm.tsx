import React, { useState, useEffect } from "react";
import { canUseDOM, Link } from "vtex.render-runtime";
import { useDevice } from 'vtex.device-detector'
import style from "./style.css";
import { Input, Checkbox } from "vtex.styleguide";
import { useIntl, FormattedMessage } from "react-intl";
import messages from "./utils/definedMessages"
import Modal from './components/Modal'
import Loader from "./components/Loader";

interface SubscribeFormProps {
  countdownDate: string,
  buttonLink: string,
  sourceCampaign: undefined | string;
}

const SubscribeForm: StorefrontFunctionComponent<SubscribeFormProps> = ({ countdownDate, buttonLink, sourceCampaign }) => {

  const [mounted, setMounted] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isNameValid, setIsNameValid] = useState<boolean>(true);
  const [isSurnameValid, setIsSurnameValid] = useState<boolean>(true);
  const [optInCheck, setOptInCheck] = useState<boolean>(false);
  const [optInNotChecked, setOptInNotChecked] = useState<boolean>(false) //Know when to display checkbox required message
  const [openModal, setOpenModal] = useState<boolean>(false)  //Know when to display modal after subscription API call
  const [openLoader, setOpenLoader] = useState<boolean>(false) //Know when to display loader 
  const [userRegistered, setUserRegistered] = useState<boolean>(false)  //User already registered in Master Data
  const [timeExpired, setTimeExpired] = useState<boolean>(false)

  const { formatMessage } = useIntl(); //Used for placeholder input formatted message
  const { isMobile } = useDevice()
  const countDate = new Date(countdownDate)
  const now = new Date()

  if(canUseDOM) { //Check when to disable overflow for modals
    isMobile ? (
      openModal || optInNotChecked ? 
        document.body.style.overflow = 'hidden' 
        : 
        document.body.style.overflow = 'unset'
    )
    :
    openModal ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'unset'     
  }

  useEffect(() => {
    setMounted(true)
    if((countDate.getTime()- now.getTime())>=0){
    setTimeout(()=>{
      setTimeExpired(true)
    }, countDate.getTime()- now.getTime())
  }
  else
      setTimeExpired(true)
  }, []);

  useEffect(() => {
    if(optInCheck === true) { //Check the optIn field to know when to remove checkboxRequiredBox (required modal)
      setOptInNotChecked(false)
    }
  }, [optInCheck]);

  const validateEmail = (email: string) => {  //Function to check mail validation
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
  };

  const handleEmailBlur = (e: any) => { //Handle blur on email input field (to show red warning)
    setIsEmailValid(validateEmail(e.target.value));
  };

  const handleNameBlur = (e: any) => { //Handle blur on email input field (to show red warning)
    setIsNameValid(e.target.value !== "");
  };
  const handleSurnameBlur = (e: any) => { //Handle blur on email input field (to show red warning)
    setIsSurnameValid(e.target.value !== "");
  };

  const handleSubscription = async () => {  //Handle click on subscribeButton
    setIsEmailValid(validateEmail(email))
    if(!validateEmail(email))
      return
    if(name === "" ){
      setIsNameValid(false)
      return
    }
    if(surname === "" ){
      setIsSurnameValid(false)
      return
    }
    if(!optInCheck) {
      setOptInNotChecked(true)
      return 
    }
    if(!isEmailValid) {
      return
    }
    setOpenLoader(true)
    const body = {
      "name": name,
      "surname": surname,
      "email": email,
      "optin": true,     
      "sourceCampaign": sourceCampaign,
    }
    const options = { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    };
    fetch("/_v/wrapper/api/campaigns/signup", options)
      .then((response) => {
        if(response.status === 200) {
          setUserRegistered(false)
          setOpenModal(true)
          setOpenLoader(false)
        } 
        else if(response.status === 409) {
          setUserRegistered(true)
          setOpenModal(true)
          setOpenLoader(false)
        }
        else {
          setOpenLoader(false)
        }
        setEmail("")
        setName("")
        setSurname("")
        return
      })
  }

  return (
    <>
    { !timeExpired &&
      <div className={style.subscribeContainer}>
      {mounted &&
        <>
        <div className={style.subscriptionForm}>
        <Input 
        id="subscriptionInput"
        name="Email"
        value={email}
        placeholder={formatMessage(messages.placeholderText)}
        onChange={(e: any) => setEmail(e.target.value)}
        required={true}
        onBlur={handleEmailBlur}
        errorMessage={!isEmailValid ? formatMessage(messages.errorMessage) : null}
        />
        <div className={style.nameSurnameWrapper}>
        <Input 
        id="subscriptionInputName"
        name="Name"
        value={name}
        placeholder={formatMessage(messages.placeholderTextName)}
        onChange={(e: any) => setName(e.target.value)}
        required={true}
        onBlur={handleNameBlur}
        errorMessage={!isNameValid ? formatMessage(messages.errorMessageName) : null}
        />
        <Input 
        id="subscriptionInput"
        name="Surname"
        value={surname}
        placeholder={formatMessage(messages.placeholderTextSurname)}
        onChange={(e: any) => setSurname(e.target.value)}
        required={true}
        onBlur={handleSurnameBlur}
        errorMessage={!isSurnameValid ? formatMessage(messages.errorMessageSurname) : null}
        />
        </div>
        <button 
        className={style.subscriptionButton} 
        onClick={() => handleSubscription()}
        >
        <FormattedMessage {...messages.formButton} />
        </button>
        </div>
        <div className={style.checkboxWrapper} style={{flexDirection: "column"}}>
        <div className={style.checkboxContainer}>
        <Checkbox 
        checked={optInCheck}
        id="optin"
        onChange={() => setOptInCheck(!optInCheck)}
        required={true}
        />
        <label className={style.checkboxText}>
        <FormattedMessage
        {...messages.checkboxLabel}
        values={{
          checkboxLink: (
            <a href={formatMessage(messages.checkboxLabelUrl)} className={style.checkboxLink}>
                        {formatMessage(messages.checkboxLabelUrlText)}
                      </a>
                    ),
                  }}
                  />
                  </label>
                  {!isMobile && //Required message checkbox to show only desktop
                    <div 
                    className={style.checkboxRequired}
                    style={{display: optInNotChecked ? "flex" : "none"}}
                    >
                    <div className={style.orangeSquare}>
                    <p className={style.checkboxRequiredExclamative}>!</p>
                  </div>
                  <p className={style.checkboxRequiredText}>
                    <FormattedMessage {...messages.checkboxRequiredText}/>
                  </p>
                </div>
              }
              </div>
              <p className={style.checkboxTextAsterisk}><FormattedMessage {...messages.checkboxTextAsterisk1}/></p> 
              {/* <p className={style.checkboxTextAsterisk}><FormattedMessage  {...messages.checkboxTextAsterisk2}/></p>  */}
              </div>
              </>
            }
            {openModal && //Modal to open afte subscribe call is gone
              <Modal 
              openModal={openModal} 
              setOpenModal={setOpenModal} 
              userAlreadyRegistered={userRegistered}
              />
            }
            {openLoader &&  //Loader to show until the subscribe call isn't finished
            <Loader openLoader={openLoader} />
          }
          {isMobile &&  //Modal checkbox required to show if checkbox wasn't clicked (FOR MOBILE)
          <div className={style.checkboxRequiredOverlay} style={{display: optInNotChecked ? "flex" : "none"}}>
          <div className={style.checkboxRequired}>
            <img 
              className={style.closeIcon} 
              src="https://frwhirlpool.vtexassets.com/arquivos/close_icon_bf.png" 
              alt="close_icon"
              onClick={() => setOptInNotChecked(false)}
              />
            <div className={style.orangeSquare}>
              <p className={style.checkboxRequiredExclamative}>!</p>
            </div>
            <p className={style.checkboxRequiredText}>
              <FormattedMessage {...messages.checkboxRequiredText}/>
            </p>
          </div>
        </div>
      }
      </div>
    } 
    {
      timeExpired &&
      <div className={style.subscriptionForm}>
        <Link 
        className={style.discoverButton}
        href={buttonLink}
        >
        <FormattedMessage {...messages.formButtonExpired} />
        </Link>
        {/* <p className={style.checkboxTextAsterisk}><FormattedMessage {...messages.checkboxTextAsterisk1}/></p>  */}
        {/* <p className={style.checkboxTextAsterisk}><FormattedMessage  {...messages.checkboxTextAsterisk2}/></p>  */}
      </div>
    }
    </>
      );
    };
    

export default SubscribeForm;
