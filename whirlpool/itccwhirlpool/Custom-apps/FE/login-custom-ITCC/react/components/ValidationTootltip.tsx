import React from "react";
import style from "../style.css";
import { useLogin } from "../context/LoginContext";
import { useIntl, defineMessages } from "react-intl";

interface ValidationTootltipProps {
  values: any;
}

const ValidationTootltip: React.FC<ValidationTootltipProps> = ({ values }) => {
  const { upperCaseRegex, lowerCaseRegex, numberRegex } = useLogin();
  /*--- INTL ---*/
  const intl = useIntl();

  return (
    <div className={style.modalContainer}>
      <div className={style.modalContainerTitle}>
        {intl.formatMessage(messages.titleText)}
      </div>
      <div
        className={
          values.password == ""
            ? style.modalContainerLabel
            : upperCaseRegex.test(values.password)
            ? style.modalContainerLabelSuccess
            : style.modalContainerLabelFail
        }
      >
        <div className={style.tootltipTextDiv}>
          <span className={`${style.tooltipText} ${style.tooltipTextLeft}`}>
            ABC
          </span>
          <span className={`${style.tooltipText} ${style.tooltipTextRight}`}>
            {intl.formatMessage(messages.upperCaseText)}
          </span>
        </div>
      </div>
      <div
        className={
          values.password == ""
            ? style.modalContainerLabel
            : lowerCaseRegex.test(values.password)
            ? style.modalContainerLabelSuccess
            : style.modalContainerLabelFail
        }
      >
        <div className={style.tootltipTextDiv}>
          <span className={`${style.tooltipText} ${style.tooltipTextLeft}`}>
            abc
          </span>
          <span className={`${style.tooltipText} ${style.tooltipTextRight}`}>
            {intl.formatMessage(messages.lowerCaseText)}
          </span>
        </div>
      </div>
      <div
        className={
          values.password == ""
            ? style.modalContainerLabel
            : numberRegex.test(values.password)
            ? style.modalContainerLabelSuccess
            : style.modalContainerLabelFail
        }
      >
        <div className={style.tootltipTextDiv}>
          <span className={`${style.tooltipText} ${style.tooltipTextLeft}`}>
            123
          </span>
          <span className={`${style.tooltipText} ${style.tooltipTextRight}`}>
            {intl.formatMessage(messages.numberText)}
          </span>
        </div>
      </div>
      <div
        className={
          values.password == ""
            ? style.modalContainerLabel
            : values.password?.length >= 8
            ? style.modalContainerLabelSuccess
            : style.modalContainerLabelFail
        }
      >
        <div className={style.tootltipTextDiv}>
          <span className={`${style.tooltipText} ${style.tooltipTextLeft}`}>
            ***
          </span>
          <span className={`${style.tooltipText} ${style.tooltipTextRight}`}>
            {intl.formatMessage(messages.charactersText)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ValidationTootltip;

const messages = defineMessages({
  titleText: {
    defaultMessage: "Your password must contain:",
    id: "store/custom-login.login-form.tootltip-title",
  },
  upperCaseText: {
    defaultMessage: "A capital letter",
    id: "store/custom-login.login-form.tootltip-uppercase",
  },
  lowerCaseText: {
    defaultMessage: "A lowercase letter",
    id: "store/custom-login.login-form.tootltip-lowercase",
  },
  numberText: {
    defaultMessage: "A number",
    id: "store/custom-login.login-form.tootltip-number",
  },
  charactersText: {
    defaultMessage: "8 characters",
    id: "store/custom-login.login-form.tootltip-characters",
  },
});
