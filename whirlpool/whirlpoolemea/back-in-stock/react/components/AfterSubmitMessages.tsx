/**
 * @param {status,statusBackInStock,userMessages}
 * @returns after submit messages to display (if !successMessageInsideButton only error messages will be considered)
 */
import React, { FC } from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { CSS_HANDLES } from '../utils/utils'

interface AfterSubmitMessagesProps {
  statusNewsletter?: string
  statusBackInStock: string
  userMessages: MessagesProps
}

interface MessagesProps {
  shouldLogInErrorMessage: string
  registeredErrorMessage: string
  genericApiErrorMessage: string
  errorMessageSubscriptionToBIS: string
  successMessageNewsletter: string
  successMessageSubscriptionToBIS: string
}

const AfterSubmitMessages: FC<AfterSubmitMessagesProps> = ({
  statusNewsletter,
  statusBackInStock,
  userMessages,
}) => {
  /**
   * handles for style
   */
  const handles = useCssHandles(CSS_HANDLES)

  /**
   * Check error status
   * @returns properly error message to shown
   */

  const parseErrorMessageToSubscription = () => {
    switch (statusBackInStock) {
      case 'ERROR':
        return userMessages?.errorMessageSubscriptionToBIS
      default:
        return userMessages?.genericApiErrorMessage
    }
  }

  const parseErrorMessageNewsLetter = () => {
    switch (statusNewsletter) {
      case 'LOGIN_ERROR':
        return userMessages?.shouldLogInErrorMessage
      case 'REGISTERED_ERROR':
        return userMessages?.registeredErrorMessage
      default:
        return userMessages?.genericApiErrorMessage
    }
  }

  return (
    <React.Fragment>
      {/**
       * Newsletter subscription done succesfully
       */}
      {statusNewsletter && statusNewsletter === 'SUCCESS' && (
        <div
          className={`${applyModifiers(
            handles['container__text-messages'],
            'success'
          )}`}
        >
          <p className={`${handles['text__message-success']} tc`}>
            {userMessages?.successMessageNewsletter}
          </p>
        </div>
      )}
      {/**
       * Newsletter subscription goes wrong, show error message
       */}
      {statusNewsletter &&
        statusNewsletter !== 'SUCCESS' &&
        statusNewsletter !== 'LOADING' && (
          <div
            className={`${applyModifiers(
              handles['container__text-messages'],
              'error'
            )}`}
          >
            <p className={`${handles['text__message-error']} tc`}>
              {parseErrorMessageNewsLetter()}
            </p>
          </div>
        )}
      {/**
       * Back In Stock Subscription done succesfully
       */}
      {statusBackInStock === 'SUCCESS' && (
        <div
          className={`${applyModifiers(
            handles['container__text-messages'],
            'success'
          )}`}
        >
          <p className={`${handles['text__message-success']} tc`}>
            {userMessages?.successMessageSubscriptionToBIS}
          </p>
        </div>
      )}
      {/**
       * Back In Stock Subscription goes wrong, show error message
       */}
      {statusBackInStock !== 'SUCCESS' && (
        <div
          className={`${applyModifiers(
            handles['container__text-messages'],
            'error'
          )}`}
        >
          <p className={`${handles['text__message-error']} tc`}>
            {parseErrorMessageToSubscription()}
          </p>
        </div>
      )}
    </React.Fragment>
  )
}

export default AfterSubmitMessages
