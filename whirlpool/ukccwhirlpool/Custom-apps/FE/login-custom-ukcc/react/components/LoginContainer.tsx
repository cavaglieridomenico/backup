import React from "react";
import LoginForm from "./LoginForm";
import ForgotPassword from "./ForgotPassword";
import SetPassword from "./SetPassword";
import { useLogin } from "../context/LoginContext";
import { Routes } from "../context/LoginContext";

interface LoginContainerProps {
  optinLink: string;
  isExternalLink: boolean;
  isVIP: boolean;
  isAuth: boolean;
  tooltipModalImage: string;
  tooltipModalText: string;
  formTitle?: string;
  formSubtitle?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
}

const LoginContainer: React.FC<LoginContainerProps> = ({
  optinLink,
  isExternalLink,
  isVIP,
  isAuth,
  tooltipModalImage,
  tooltipModalText,
  formTitle,
  formSubtitle,
  emailLabel,
  emailPlaceholder
}) => {
  const { route } = useLogin();
  return (
    <div>
      {route == Routes.LOGIN && (
        <LoginForm
          optinLink={optinLink}
          isExternalLink={isExternalLink}
          isVIP={isVIP}
          isAuth={isAuth}
          tooltipModalImage={tooltipModalImage}
          tooltipModalText={tooltipModalText}
          formTitle={formTitle}
          formSubtitle={formSubtitle}
          emailLabel={emailLabel}
          emailPlaceholder={emailPlaceholder}
        />
      )}
      {route == Routes.VALIDATION && <SetPassword />}
      {route == Routes.FORGOT && <ForgotPassword />}
    </div>
  );
};

export default LoginContainer;
