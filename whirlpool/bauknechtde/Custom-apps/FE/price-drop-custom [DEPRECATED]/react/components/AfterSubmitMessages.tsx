import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { messages, CSS_HANDLES } from '../utils/utilsFunction'

interface AfterSubmitMessagesProps {
  adviseMessage: string
  optinMessage?: string
}

interface MessageToShow {
  defaultMessage: string
  id: string
}

const AfterSubmitMessages: StorefrontFunctionComponent<
  AfterSubmitMessagesProps
> = ({ adviseMessage, optinMessage }) => {
  const { formatMessage } = useIntl()
  const handles = useCssHandles(CSS_HANDLES)
  // Handle states
  const [isOptinError, setIsOptinError] = useState<boolean>(false)
  const [isAdviseError, setIsAdviseError] = useState<boolean>(false)
  const [optinMessageToShow, setOptinMessageToShow] = useState<MessageToShow>()
  const [adviseMessageToShow, setAdviseMessageToShow] =
    useState<MessageToShow>()

  // Function to set errors in order to track if message need to be shown
  // in red color
  const handleErrorMessages = (advise: string, optin?: string) => {
    if (advise.includes('error')) {
      setIsAdviseError(true)
    }
    if (optin && optin.includes('error')) {
      setIsOptinError(true)
    }
  }

  // Handle Optin Message to show
  const handleOptinMessage = () => {
    switch (optinMessage) {
      case 'successRegisteredToNL':
        setOptinMessageToShow(messages.successRegisteredToNL)
        break
      case 'errorRegisterToNL':
        setOptinMessageToShow(messages.errorRegisterToNL)
        break
      case 'errorMustBeLogeedIn':
        setOptinMessageToShow(messages.errorMustBeLogeedIn)
        break
      default:
        break
    }
  }

  // Handle price drop message
  const handlePricedropMessage = () => {
    // Handle Advise message
    switch (adviseMessage) {
      case 'successPriceDropAlert':
        setAdviseMessageToShow(messages.successPriceDropAlert)
        break
      case 'errorPriceDropAlert':
        setAdviseMessageToShow(messages.errorPriceDropAlert)
        break
      default:
        break
    }
  }

  useEffect(() => {
    // Handle errors messages
    handleErrorMessages(adviseMessage, optinMessage)
    // Handle Optin Message if present
    if (optinMessage) handleOptinMessage()
    // Handle Price Drop Advise message
    handlePricedropMessage()
  }, [])

  return (
    <div className={`flex flex-column justify-center items-center`}>
      {/* OPTIN MESSAGE*/}
      {optinMessageToShow && !isOptinError && (
        <div className={`${handles['form__text-success']} mt2 tc`}>
          {formatMessage(optinMessageToShow)}
        </div>
      )}
      {/* ERROR OPTIN */}
      {optinMessageToShow && isOptinError && (
        <div className="c-danger mt2 tc">
          {formatMessage(optinMessageToShow)}
        </div>
      )}
      {/* ADVISE MESSAGE*/}
      {adviseMessageToShow && !isAdviseError && (
        <div className={`${handles['form__text-success']} mt2 tc`}>
          {formatMessage(adviseMessageToShow)}
        </div>
      )}
      {/* ERROR ADVISE */}
      {adviseMessageToShow && isAdviseError && (
        <div className="c-danger mt2 tc">
          {formatMessage(adviseMessageToShow)}
        </div>
      )}
    </div>
  )
}

export default AfterSubmitMessages
