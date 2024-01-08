/**
 * @param {status,successMessageInsideButton,userMessages}
 * @returns after submit messages to display (if !successMessageInsideButton only error messages will be considered)
 */
import React, { FC } from "react";
import { useCssHandles, applyModifiers } from "vtex.css-handles";
import { CSS_HANDLES } from "../utils/utils";

interface AfterSubmitMessagesProps {
  status: string;
  successMessageInsideButton: boolean;
  userMessages: MessagesProps;
}

interface MessagesProps {
  shouldLogInErrorMessage: string;
  registeredErrorMessage: string;
  genericApiErrorMessage: string;
  successMessage: string;
}

const AfterSubmitMessages: FC<AfterSubmitMessagesProps> = ({
  status,
  successMessageInsideButton,
  userMessages,
}) => {
  /**
   * handles for style
   */
  const handles = useCssHandles(CSS_HANDLES);

  /**
   * Check error status
   * @returns properly error message to shown
   */
  const parseErrorMessage = () => {
    switch (status) {
      case "LOGIN_ERROR":
        return userMessages?.shouldLogInErrorMessage;
      case "REGISTERED_ERROR":
        return userMessages?.registeredErrorMessage;
      default:
        return userMessages?.genericApiErrorMessage;
    }
  };

  return (
    <React.Fragment>
      {/**
       * Submit done succesfully and option to show successMessageInsideButton === false
       */}
      {status === "SUCCESS" && !successMessageInsideButton && (
        <div
          className={`${applyModifiers(
            handles["container__text-messages"],
            "success"
          )}`}
        >
          <p className={`${handles["text__message-success"]} tc`}>
            {userMessages?.successMessage}
          </p>
        </div>
      )}
      {/**
       * Submit goes wrong, show error message
       */}
      {status !== "SUCCESS" && status !== "LOADING" && (
        <div
          className={`${applyModifiers(
            handles["container__text-messages"],
            "error"
          )}`}
        >
          <p className={`${handles["text__message-error"]} c-danger tc`}>
            {parseErrorMessage()}
          </p>
        </div>
      )}
    </React.Fragment>
  );
};

export default AfterSubmitMessages;
