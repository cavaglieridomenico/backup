import React from "react";
import LoginForm from "./LoginForm";
import ForgotPassword from "./ForgotPassword";
import SetPassword from "./SetPassword";
import { useLogin } from "../context/LoginContext";
import { Routes } from "../context/LoginContext";

interface LoginContainerProps {
  optinLink: string;
  isExternalLink: boolean;
  tooltipModalImage: string;
}

const LoginContainer: React.FC<LoginContainerProps> = ({
  optinLink,
  isExternalLink,
  tooltipModalImage,
}) => {
  const { route } = useLogin();
  return (
    <div>
      {route == Routes.LOGIN && (
        <LoginForm
          optinLink={optinLink}
          isExternalLink={isExternalLink}
          tooltipModalImage={tooltipModalImage}
        />
      )}
      {route == Routes.VALIDATION && <SetPassword />}
      {route == Routes.FORGOT && <ForgotPassword />}
    </div>
  );
};

export default LoginContainer;
