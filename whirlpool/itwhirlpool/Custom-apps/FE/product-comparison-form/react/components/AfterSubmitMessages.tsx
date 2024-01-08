import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { useCssHandles } from "vtex.css-handles";
import { messages, CSS_HANDLES } from "../utils/utilsFunctions";

interface AfterSubmitMessagesProps {
  comparisonMessage?: string;
  optinMessage?: string;
}

interface MessageToShow {
  defaultMessage: string;
  id: string;
}

const AfterSubmitMessages: StorefrontFunctionComponent<
  AfterSubmitMessagesProps
> = ({ comparisonMessage, optinMessage }) => {
  // Messages and Handles
  const { formatMessage } = useIntl();
  const handles = useCssHandles(CSS_HANDLES);
  // Handle states
  const [isOptinError, setIsOptinError] = useState<boolean>(false);
  const [isComparisonError, setIsComparisonError] = useState<boolean>(false);
  const [optinMessageToShow, setOptinMessageToShow] = useState<MessageToShow>();
  const [comparisonMessageToShow, setComparisonMessageToShow] = useState<MessageToShow>();

  // Function to set errors in order to track if message need to be shown
  // in red color
  const handleErrorMessages = (comparison?: string, optin?: string) => {
    // Check comparison error    
    if (comparison && comparison.includes("error")) {
      setIsComparisonError(true);
    } else {
      setIsComparisonError(false);
    }
    // Check optin error
    if (optin && optin.includes("error")) {
      setIsOptinError(true);
    } else {
      setIsOptinError(false);
    }
  };

  // Handle Optin Message to show
  const handleOptinMessage = () => {
    switch (optinMessage) {
      case "successOptin":
        setOptinMessageToShow(messages.successOptin);
        break;
      case "successOptinUserLogged":
        setOptinMessageToShow(messages.successOptinUserLogged);
        break;
      case "errorOptin":
        setOptinMessageToShow(messages.errorOptin);
        break;
      case "errorOptinUserAlreadyRegistered":
        setOptinMessageToShow(messages.errorOptinUserAlreadyRegistered);
        break;
      case "errorOptinUserMustLogged":
        setOptinMessageToShow(messages.errorOptinUserMustLogged);
        break;
      default:
        break;
    }
  };

  // Handle Product Category Advise Message
  const handleProductCategoryAdviseMessage = () => {
    // Handle Advise message
    switch (comparisonMessage) {
      case "successComparison":
        setComparisonMessageToShow(messages.successComparison);
        break;
      case "errorComparison":
        setComparisonMessageToShow(messages.errorComparison);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Handle errors messages
    handleErrorMessages(comparisonMessage, optinMessage);
    // Handle Optin Message if present
    if (optinMessage) handleOptinMessage();
    // Handle Product Category Advise message
    handleProductCategoryAdviseMessage();
  }, [optinMessage,comparisonMessage]);

  return (
    <div className={`flex flex-column justify-center items-center`}>
      {/* SUCCESS OPTIN MESSAGE*/}
      {optinMessageToShow && !isOptinError && (
        <div className={`${handles["form__text-success"]} mt2`}>
          {formatMessage(optinMessageToShow)}
        </div>
      )}
      {/* ERROR OPTIN */}
      {optinMessageToShow && isOptinError && (
        <div className="c-danger mt2">{formatMessage(optinMessageToShow)}</div>
      )}
      {/* SUCCESS NOTIFY MESSAGE*/}
      {comparisonMessageToShow && !isComparisonError && (
        <div className={`${handles["form__text-success"]} mt2`}>
          {formatMessage(comparisonMessageToShow)}
        </div>
      )}
      {/* ERROR NOTIFY */}
      {comparisonMessageToShow && isComparisonError && (
        <div className="c-danger mt2">{formatMessage(comparisonMessageToShow)}</div>
      )}
    </div>
  );
};

export default AfterSubmitMessages;
