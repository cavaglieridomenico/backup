import React from "react";
import LoginForm from "./LoginForm";
import ForgotPassword from "./ForgotPassword";
import SetPassword from "./SetPassword";
import { useLogin } from "../context/LoginContext";
import { Routes } from "../context/LoginContext";
import RegistrationForm from "./RegistrationForm";

interface LoginContainerProps {
  optinLink: string;
  isExternalLink: boolean;
}

const LoginContainer: React.FC<LoginContainerProps> = ({
  optinLink,
  isExternalLink,
}) => {
  const { route } = useLogin();
  return (
    <div>
      {route == Routes.LOGIN && <LoginForm />}
      {route == Routes.REGISTRATION && (
        <RegistrationForm
          optinLink={optinLink}
          isExternalLink={isExternalLink}
        />
      )}
      {route == Routes.VALIDATION && <SetPassword />}
      {route == Routes.FORGOT && <ForgotPassword />}
    </div>
  );
};

export default LoginContainer;
