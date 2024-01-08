import React, { useEffect } from "react";
import LoginContainer from "./components/LoginContainer";
import { LoginContextProvider } from "./context/LoginContext";
interface LoginCustomProps {
  optinLink: string;
  isExternalLink: boolean;
}

const LoginCustom: StorefrontFunctionComponent<LoginCustomProps> = ({
  optinLink,
  isExternalLink,
}) => {
  useEffect(() => {
    const isLogged = sessionStorage.getItem("loggedIn");
    if (isLogged) {
      //Check if the user is logged-in
      if (isLogged == "true") {
        window.location.href = "/";
      }
    }
  }, []);

  return (
    <LoginContextProvider>
      <LoginContainer optinLink={optinLink} isExternalLink={isExternalLink} />
    </LoginContextProvider>
  );
};

LoginCustom.schema = {
  title: "Login Custom",
  description: "Login custom labels/links",
  type: "object",
  properties: {
    optinLink: {
      title: "Optin Link",
      type: "string",
      description: "The link of the personal data protection page",
      default: "",
    },
    isExternalLink: {
      title: "isExternalLink",
      type: "boolean",
      default: false,
    },
  },
};

export default LoginCustom;
