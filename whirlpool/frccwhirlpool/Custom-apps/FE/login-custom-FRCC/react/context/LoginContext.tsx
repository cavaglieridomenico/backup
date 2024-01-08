import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { useRuntime } from "vtex.render-runtime";
// import { useQuery } from "react-apollo";
// import getSession from "../graphql/getSession.graphql";
import { useIntl, defineMessages } from "react-intl";
import {
  LOGIN_API,
  SIGNUP_API,
  SETPASSWORD_API,
  FORGOT_API,
  PATCH_API,
} from "../config/config";
import { usePixel } from "vtex.pixel-manager";

interface Context {
  locale: string;
  tradePolicy: string;
  isVIP: boolean;
  errorMessages: any;
  route: Routes;
  setRoute: any;
  upperCaseRegex: RegExp;
  lowerCaseRegex: RegExp;
  numberRegex: RegExp;
  //Login Form
  loginFormValues: LoginFormValues;
  handleChangeInputLogin: any;
  loginFormFetch: any;
  loginFetchResponse: any;
  isSubmitting: boolean;
  setIsSubmitting: any;
  loginResponse: any;
  setLoginResponse: any;
  //SignUp Form
  signUpFormValues: SignUpFormValues;
  handleChangeInputSignUp: any;
  signUpFetchResponse: boolean;
  isSignUpSubmitting: boolean;
  setIsSignUpSubmitting: any;
  signUpResponse: any;
  setSignUpResponse: any;
  signupFormFetch: any;
  handleChangeOptinCheckboxSignUp: any;
  //SetPassword Form
  setPasswordFormValues: SetPasswordValues;
  setSetPasswordFormValues: any;
  isSetPasswordSubmitting: boolean;
  setIsSetPasswordSubmitting: any;
  setPasswordFetchResponse: boolean;
  setSetPasswordFetchResponse: any;
  setPasswordResponse: any;
  setSetPasswordResponse: any;
  setPasswordFormFetch: any;
  handleChangeInputSetPassword: any;
  //Forgot Password Form
  forgotFormValues: ForgotValues;
  setForgotFormValues: any;
  forgotFetchResponse: boolean;
  setForgotFetchResponse: any;
  isForgotSubmitting: any;
  setIsForgotSubmitting: any;
  forgotResponse: any;
  setForgotResponse: any;
  handleChangeInputForgot: any;
  forgotFormFetch: any;
  prevPage: string;
  setPrevPage: any;
}

interface LoginFormValues {
  email: string;
  password: string;
  tradePolicy: string;
}
interface SignUpFormValues {
  name: string;
  surname: string;
  email: string;
  optin: boolean;
  tradePolicy: string;
  locale: string;
  accessCode: string;
}
interface SetPasswordValues {
  password: string;
  accessKey: string;
  tradePolicy: string;
}
interface ForgotValues {
  email: string;
  locale: string;
  tradePolicy: string;
}

interface WindowGTM extends Window {
  dataLayer: any[];
}

export enum Routes {
  LOGIN = "login",
  REGISTRATION = "registration",
  FORGOT = "forgot",
  VALIDATION = "validation",
}

const LoginContext = createContext<Context>({} as Context);

export const LoginContextProvider: React.FC = ({ children }) => {
  const {
    // production,
    culture,
    binding,
    route: runtimeRoute,
    query,
  } = useRuntime();
  const intl = useIntl();
  const { push } = usePixel();
  const returnUrl = runtimeRoute?.queryString?.returnUrl || "/";
  const [prevPage, setPrevPage] = useState("");
  const dataLayer = ((window as unknown) as WindowGTM).dataLayer || [];

  /*--- QUERY FOR TRADE POLICY ---*/
  // const { data } = useQuery(getSession, {
  //   fetchPolicy: "no-cache",
  //   onCompleted() {
  //     setLoginFormValues({
  //       ...loginFormValues,
  //       tradePolicy: data?.session?.namespaces?.store?.channel?.value,
  //     });
  //     setSignUpFormValues({
  //       ...signUpFormValues,
  //       tradePolicy: data?.session?.namespaces?.store?.channel?.value,
  //     });
  //     setSetPasswordFormValues({
  //       ...setPasswordFormValues,
  //       tradePolicy: data?.session?.namespaces?.store?.channel?.value,
  //     });
  //     setForgotFormValues({
  //       ...forgotFormValues,
  //       tradePolicy: data?.session?.namespaces?.store?.channel?.value,
  //     });
  //   },
  // });

  /*--- STATES ---*/

  /*--- CONSTS ---*/
  // const tradePolicy = data?.session?.namespaces?.store?.channel?.value;
  const tradePolicy =
    binding?.id == "1bbaf935-b5b4-48ae-80c0-346623d9c0c9"
      ? "1"
      : binding?.id == "b9f7bf3a-c865-4169-8950-4fbb8b55ec09"
      ? "2"
      : "3";
  const isVIP = tradePolicy == "3";
  const locale = culture?.locale;
  const accessCode = runtimeRoute?.queryString?.sid || query?.sid;

  useEffect(() => {
    setLoginFormValues({
      ...loginFormValues,
      tradePolicy: tradePolicy,
    });
    setSignUpFormValues({
      ...signUpFormValues,
      tradePolicy: tradePolicy,
    });
    setSetPasswordFormValues({
      ...setPasswordFormValues,
      tradePolicy: tradePolicy,
    });
    setForgotFormValues({
      ...forgotFormValues,
      tradePolicy: tradePolicy,
    });
  }, [tradePolicy]);

  /*------------------------------------------------------------------------------------------------------------*/

  /*--- LOGIN FORM ---*/
  //Login Form Values
  const [loginFormValues, setLoginFormValues] = useState({
    email: "",
    password: "",
    tradePolicy: "",
  });

  const handleChangeInputLogin = (e: any) => {
    setLoginFetchResponse(true);
    const { name, value } = e.target;
    setLoginFormValues({
      ...loginFormValues,
      [name]: value,
    });
  };

  const [loginFetchResponse, setLoginFetchResponse]: any = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginResponse, setLoginResponse]: any = useState();

  let host = binding?.canonicalBaseAddress?.split("/")[0];

  const loginFormFetch = () => {
    setLoginResponse(undefined);
    fetch(`${LOGIN_API}?host=${host}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginFormValues),
    })
      .then((response) => {
    
        setLoginFetchResponse(response.ok), setIsSubmitting(false);
        // GA4FUNREQ24
        if (response?.ok) {
          push({
            event: "ga4-personalArea-login",
          });
        }

        return response.ok ? response.json() : Promise.resolve({ error: true });
      })
      .then((res) => setLoginResponse(res));
  };

  const emptyBody: any = {};

  useEffect(() => {
    if (loginResponse && !loginResponse?.error) {
      window.localStorage.setItem("userCluster", loginResponse.userCluster);
      fetch(PATCH_API, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: emptyBody,
      }).then((response) => {
        setLoginFetchResponse(response.ok);
        if (response.ok) {
          window.sessionStorage.setItem("loggedIn", "true");
          window.sessionStorage.setItem("justLoggedIn", "true");
          window.location.href = returnUrl;
        }
      });
    }
  }, [loginResponse]);

  /*------------------------------------------------------------------------------------------------------------*/

  /*--- SIGNUP FORM ---*/
  //Sign Up Form Values
  const [signUpFormValues, setSignUpFormValues] = useState({
    name: "",
    surname: "",
    email: "",
    optin: false,
    tradePolicy: "",
    locale: locale,
    accessCode: isVIP && accessCode ? accessCode : "",
  });

  const [signUpFetchResponse, setSignUpFetchResponse]: any = useState(true);
  const [isSignUpSubmitting, setIsSignUpSubmitting] = useState(false);
  const [signUpResponse, setSignUpResponse]: any = useState();

  const handleChangeInputSignUp = (e: any) => {
    setIsSignUpSubmitting(false);
    const { name, value } = e.target;
    setSignUpFormValues({
      ...signUpFormValues,
      [name]: value,
    });
  };

  const handleChangeOptinCheckboxSignUp = () => {
    setSignUpFormValues({
      ...signUpFormValues,
      optin: !signUpFormValues.optin,
    });
  };

  const signupFormFetch = () => {
    let host = binding?.canonicalBaseAddress?.split("/")[0];

    setSignUpResponse(undefined);

    fetch(`${SIGNUP_API}?host=${host}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpFormValues),
    }).then((response) => {
      if (response.ok) {
        if (signUpFormValues.optin) {
          //Deprecated Analytics event:
          //push({ event: "LeadGeneration", data: "user_registration" });

          //GA4FUNREQ61
          push({
            event: "ga4-optin",
          });
        }
        // GA4FUNREQ23
        push({
          event: "ga4-personalArea",
          section: "Personal Area",
          type: "registration",
        });
        setPrevPage(Routes.REGISTRATION);
        setRoute(Routes.VALIDATION);
      } else {
        dataLayer.push({
          event: "personalArea",
          eventCategory: "Personal Area",
          eventAction: "Registration",
          eventLabel: "Registration: ko",
        });
      }
      setSignUpFetchResponse(response.ok), setIsSubmitting(false);
      return setSignUpResponse(response.status);
    });
  };

  /*------------------------------------------------------------------------------------------------------------*/

  /*--- SETPASSWORD FORM ---*/
  //Set Password Form Values
  const [setPasswordFormValues, setSetPasswordFormValues] = useState({
    password: "",
    accessKey: "",
    tradePolicy: "",
  });

  const [setPasswordFetchResponse, setSetPasswordFetchResponse]: any = useState(
    true
  );
  const [isSetPasswordSubmitting, setIsSetPasswordSubmitting] = useState(false);
  const [setPasswordResponse, setSetPasswordResponse]: any = useState();
  const [setPwdResponse, setSetPwdResponse]: any = useState();

  const handleChangeInputSetPassword = (e: any) => {
    setIsSetPasswordSubmitting(false);
    const { name, value } = e.target;
    setSetPasswordFormValues({
      ...setPasswordFormValues,
      [name]: value,
    });
  };

  const setPasswordFormFetch = () => {
    setSetPasswordResponse(undefined);
    fetch(SETPASSWORD_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(setPasswordFormValues),
    })
      .then((response) => {
        dataLayer.push({
          event: "personalArea",
          eventCategory: "Personal Area",
          eventAction:
            prevPage == Routes.REGISTRATION ? "Registration" : "Login",
          eventLabel: `${
            prevPage == Routes.REGISTRATION ? "Registration:" : "Login:"
          } ${response.ok ? "ok" : "ko"}`,
        });
        setIsSetPasswordSubmitting(false);
        // setSetPasswordResponse(response.status);
        return response.ok
          ? response.json()
          : Promise.resolve({ error: JSON.stringify(response.status) });
      })
      .then((res) => {
        setSetPwdResponse(res);
      });
  };

  useEffect(() => {
    if (setPwdResponse && !setPwdResponse?.error) {
      window.localStorage.setItem("userCluster", setPwdResponse?.userCluster);
      fetch(PATCH_API, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: emptyBody,
      }).then((response) => {
        if (response.ok) {
          window.sessionStorage.setItem("loggedIn", "true");
          window.sessionStorage.setItem("justLoggedIn", "true");
          window.location.href = returnUrl;
        }
      });
    } else if (setPwdResponse?.error) {
      setSetPasswordResponse(setPwdResponse?.error);
      setSetPasswordFetchResponse(false);
    }
  }, [setPwdResponse]);

  /*------------------------------------------------------------------------------------------------------------*/

  /*--- FORGOT PASSWORD FORM ---*/
  //Set Password Form Values
  const [forgotFormValues, setForgotFormValues] = useState({
    email: "",
    locale: locale,
    tradePolicy: "",
  });

  const [forgotFetchResponse, setForgotFetchResponse]: any = useState(true);
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const [forgotResponse, setForgotResponse]: any = useState();

  const handleChangeInputForgot = (e: any) => {
    setIsForgotSubmitting(false);
    const { name, value } = e.target;
    setForgotFormValues({
      ...forgotFormValues,
      [name]: value,
    });
  };

  const forgotFormFetch = () => {
    setForgotResponse(undefined);
    fetch(FORGOT_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(forgotFormValues),
    }).then((response) => {
      response.text();
      if (response.ok) {
        dataLayer.push({
          event: "personalArea",
          eventCategory: "Personal Area",
          eventAction: "Forgot password",
        });
        setRoute(Routes.VALIDATION);
      }
      setForgotFetchResponse(response.ok);
      setIsForgotSubmitting(false);
      return setForgotResponse(response.status);
    });
  };

  /*------------------------------------------------------------------------------------------------------------*/

  /*--- REGEXES ---*/
  const upperCaseRegex = /[A-Z]+/;
  const lowerCaseRegex = /[a-z]+/;
  const numberRegex = /[\d]+/;

  /*--- ROUTING STATES ---*/
  const [route, setRoute] = useState(Routes.LOGIN);

  const context = useMemo(
    () => ({
      locale,
      tradePolicy,
      isVIP,
      loginFormValues,
      handleChangeInputLogin,
      loginFormFetch,
      errorMessages: intl?.messages,
      upperCaseRegex,
      lowerCaseRegex,
      numberRegex,
      loginFetchResponse,
      isSubmitting,
      setIsSubmitting,
      loginResponse,
      setLoginResponse,
      route,
      setRoute,
      signUpFormValues,
      handleChangeInputSignUp,
      signUpFetchResponse,
      isSignUpSubmitting,
      setIsSignUpSubmitting,
      signUpResponse,
      setSignUpResponse,
      signupFormFetch,
      handleChangeOptinCheckboxSignUp,
      setPasswordFormValues,
      setSetPasswordFormValues,
      isSetPasswordSubmitting,
      setIsSetPasswordSubmitting,
      setPasswordFetchResponse,
      setSetPasswordFetchResponse,
      setPasswordResponse,
      setSetPasswordResponse,
      setPasswordFormFetch,
      handleChangeInputSetPassword,
      forgotFormValues,
      setForgotFormValues,
      forgotFetchResponse,
      setForgotFetchResponse,
      isForgotSubmitting,
      setIsForgotSubmitting,
      forgotResponse,
      setForgotResponse,
      handleChangeInputForgot,
      forgotFormFetch,
      prevPage,
      setPrevPage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      locale,
      tradePolicy,
      isVIP,
      loginFormValues,
      loginFetchResponse,
      isSubmitting,
      loginResponse,
      route,
      signUpResponse,
      signUpFormValues,
      signUpFetchResponse,
      isSignUpSubmitting,
      setPasswordFormValues,
      isSetPasswordSubmitting,
      setPasswordFetchResponse,
      setPasswordResponse,
      forgotFormValues,
      forgotFetchResponse,
      isForgotSubmitting,
      forgotResponse,
      prevPage,
    ]
  );

  return (
    <LoginContext.Provider value={context}>{children}</LoginContext.Provider>
  );
};

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
export const useLogin = () => {
  const context = useContext(LoginContext);

  if (context === undefined) {
    throw new Error("useLogin must be used within LoginContextProvider");
  }

  return context;
};

export default { LoginContextProvider, useLogin };

defineMessages({
  emptyError: {
    defaultMessage: "This field can't be empty",
    id: "store/custom-login.errors.empty",
  },
  emailError: {
    defaultMessage: "The inserted mail is not a valid email",
    id: "store/custom-login.errors.invalid-email",
  },
  passwordError: {
    defaultMessage:
      "Your password must contain: at least 8 characters, including numbers, lowercase and uppercase",
    id: "store/custom-login.errors.invalid-password",
  },
  passwordErrorSpace: {
    defaultMessage: "Your password cannot contain white spaces",
    id: "store/custom-login.errors.invalid-password-spaces",
  },
  invalidAccessCode: {
    defaultMessage: "Insert a valid 6-digit passcode",
    id: "store/custom-login.errors.invalidAccessCode",
  },
  password2Error: {
    defaultMessage: "Password confirmation is incorrect",
    id: "store/custom-login.errors.invalid-password2",
  },
});
