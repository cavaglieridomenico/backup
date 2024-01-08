/**
 * @param {status,statusPriceDrop,userMessages}
 * @returns after submit messages to display (if !successMessageInsideButton only error messages will be considered)
 */
import React, { FC } from 'react'
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import { CSS_HANDLES } from '../utils/utils'

interface AfterSubmitMessagesProps {
  statusNewsletter?: string
  statusPriceDrop: string
  userMessages: MessagesProps
}

interface MessagesProps {
  shouldLogInErrorMessage: string
  registeredErrorMessage: string
  genericApiErrorMessage: string
  errorMessagePriceDrop: string
  successMessageNewsletter: string
  successMessagePriceDrop: string
}

const AfterSubmitMessages: FC<AfterSubmitMessagesProps> = ({
  statusNewsletter,
  statusPriceDrop,
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

  const parseErrorMessagePriceDrop = () => {
    switch (statusPriceDrop) {
      case 'ERROR':
        return userMessages?.errorMessagePriceDrop
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
       * Price Drop Subscription done succesfully
       */}
      {statusPriceDrop === 'SUCCESS' && (
        <div
          className={`${applyModifiers(
            handles['container__text-messages'],
            'success'
          )}`}
        >
          <p className={`${handles['text__message-success']} tc`}>
            {userMessages?.successMessagePriceDrop}
          </p>
        </div>
      )}
      {/**
       * Price Drop Subscription goes wrong, show error message
       */}
      {statusPriceDrop !== 'SUCCESS' && (
        <div
          className={`${applyModifiers(
            handles['container__text-messages'],
            'error'
          )}`}
        >
          <p className={`${handles['text__message-error']} tc`}>
            {parseErrorMessagePriceDrop()}
          </p>
        </div>
      )}
    </React.Fragment>
  )
}

export default AfterSubmitMessages
