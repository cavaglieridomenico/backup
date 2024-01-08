import React from 'react'
import { useIntl } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { messages, CSS_HANDLES } from '../utils/utils'

interface AfterSubmitMessagesProps {
  statusNewsletter: string | undefined
  statusComparison: string | undefined
  successMessageComparisonSubscription?: string | undefined
  errorMessageComparisonSubscription?: string | undefined
  successMessageNewsletterSubscription?: string | undefined
  errorMessageNewsletterRegistered?: string | undefined
  errorMessageNewsletterLogin?: string | undefined
  errorMessageApiIssue?: string | undefined
}

const AfterSubmitMessages = ({
  statusNewsletter,
  statusComparison,
  successMessageComparisonSubscription,
  errorMessageComparisonSubscription,
  successMessageNewsletterSubscription,
  errorMessageNewsletterRegistered,
  errorMessageNewsletterLogin,
  errorMessageApiIssue,
}: AfterSubmitMessagesProps) => {
  // Messages and Handles
  const { formatMessage } = useIntl()
  const handles = useCssHandles(CSS_HANDLES)

  return statusNewsletter || statusComparison ? (
    <div className={`flex flex-column justify-center items-center`}>
      {/* NEWSLETTER MESSAGES */}
      {statusNewsletter && statusNewsletter !== 'LOADING' && (
        <>
          {/* SUCCESS NEWSLETTER */}
          {statusNewsletter === 'SUCCESS' && (
            <div className={`${handles['text__message-success']} mt2`}>
              {successMessageNewsletterSubscription ??
                formatMessage(messages.successNewsletter)}
            </div>
          )}
          {/* ERROR USER REGISTERED*/}
          {statusNewsletter === 'REGISTERED_ERROR' && (
            <div className="c-danger mt2">
              {errorMessageNewsletterRegistered ??
                formatMessage(messages.errorNewsletterAlreadyRegistered)}
            </div>
          )}
          {/* ERROR USER MUST LOG IN*/}
          {statusNewsletter === 'LOGIN_ERROR' && (
            <div className="c-danger mt2">
              {errorMessageNewsletterLogin ??
                formatMessage(messages.errorNewsleterMustLoggedIn)}
            </div>
          )}
          {/* ERROR OPTIN GENERIC*/}
          {statusNewsletter === 'GENERIC_ERROR' && (
            <div className="c-danger mt2">
              {errorMessageApiIssue ?? formatMessage(messages.errorNewsletter)}
            </div>
          )}
        </>
      )}
      {/* COMPARISON MESSAGES */}
      {statusComparison && statusComparison !== 'LOADING' && (
        <>
          {/* SUCCESS COMPARISON*/}
          {statusComparison === 'SUCCESS' && (
            <div className={`${handles['text__message-success']} mt2`}>
              {successMessageComparisonSubscription ??
                formatMessage(messages.successComparison)}
            </div>
          )}
          {/* ERROR COMPARISON */}
          {statusComparison === 'ERROR' && (
            <div className="c-danger mt2">
              {errorMessageComparisonSubscription ??
                formatMessage(messages.errorComparison)}
            </div>
          )}
        </>
      )}
    </div>
  ) : (
    <></>
  )
}

export default AfterSubmitMessages
