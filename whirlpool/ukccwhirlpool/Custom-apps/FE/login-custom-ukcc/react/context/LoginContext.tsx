import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRuntime } from "vtex.render-runtime";
// import { useQuery } from "react-apollo";
// import getSession from "../graphql/getSession.graphql";
import { defineMessages, useIntl } from "react-intl";
import { usePixel } from "vtex.pixel-manager";
import {
  FORGOT_API,
  LOGIN_API,
  PATCH_API,
  SETPASSWORD_API,
  SIGNUP_API,
  VIP_VALIDATION_API,
} from "../config/config";

interface Context {
  locale: string;
  tradePolicy: string;
  isEPP: boolean;
  isFF: boolean;
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
  loginGuestFormValues: {companyPassword: string},
  loginGuestFetchResponse: boolean | undefined,
  isGuestSubmitting: boolean,
  handleChangeInputGuestLogin: any,
  setIsGuestSubmitting: any,
  fetchResolver: () => void,
  //SignUp Form
  isRegistrationModalOpen: boolean;
  setIsRegistrationModalOpen: any;
  signUpFormValues: SignUpFormValues;
  shouldPrefillEmail: boolean;
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
  id: string;
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

export function getQueryParams(url: string) {
  const paramsArr = url?.slice(url?.indexOf("?") + 1)?.split("&");
  const params: any = {};
  paramsArr?.map((param: string) => {
    const [key, val] = param?.split("=");
    params[key] = decodeURIComponent(val);
  });
  return params;
}

export const LoginContextProvider: React.FC = ({ children }) => {
  const {
    production,
    culture,
    binding,
    route: runtimeRoute,
    account
  } = useRuntime();
  const intl = useIntl();
  const { push } = usePixel();
  const returnUrl = runtimeRoute?.queryString?.returnUrl || "/";
  const [prevPage, setPrevPage] = useState("");
  const dataLayer = ((window as unknown) as WindowGTM).dataLayer || [];

  let tradePolicy: string;
  if (!account.includes("qa")) {
    tradePolicy =
      binding?.id == "66725b3f-c66a-4dee-b801-b7d1d1169aea"
        ? "1"
        : binding?.id == "731bc383-7aba-437b-ac4c-eeefc1d45b93"
        ? "2"
        : "3";
  } else {
    tradePolicy =
      binding?.id == "fff1572c-d658-45ce-9eb1-7afedc65533d"
        ? "1"
        : binding?.id == "5df62c7d-0555-49c0-a569-716dbe8c774d"
        ? "2"
        : "3";
  }
  const isEPP = tradePolicy == "1";
  const isFF = tradePolicy == "2";
  const isVIP = tradePolicy == "3";
  console.log(isEPP ? "isEPP" : isFF ? "isFF" : "isVIP");

  const locale = culture?.locale;
  const accessCode = getQueryParams(window.location?.href)["sid"];

  const HOST =
    !production || window.location?.hostname?.includes("myvtex.com")
      ? `?host=${binding?.canonicalBaseAddress?.split("/")?.[0]}`
      : "";

  /*------------------------------------------------------------------------------------------------------------*/

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

  const loginFormFetch = (isAuth: boolean) => {
    setLoginResponse(undefined);
    let api = LOGIN_API;
    if (isVIP && !isAuth) {
      api = VIP_VALIDATION_API;
    }
    fetch(api + HOST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginFormValues),
    })
      .then((response) => {
        /* --- event Login ---*/
        if (response.ok) {
          push({
            event: "personalArea",
            section: "Personal Area",
            type: "login",
          });
        }
        setLoginFetchResponse(response.ok), setIsSubmitting(false);
        return response.ok ? response.json() : Promise.resolve({ error: true });
      })
      .then((res) => {
        if (isVIP) {
          window.sessionStorage.setItem("sid", res?.sid);
        }
        window.sessionStorage.setItem("invitations", res?.invitations);
        setLoginResponse(res);
      });
  };

  const emptyBody: any = {};

  useEffect(() => {
    if (loginResponse && !loginResponse?.error) {
      window.localStorage.setItem("userCluster", loginResponse.userCluster);
      fetch(PATCH_API + HOST, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: emptyBody,
      }).then((response) => {
        setLoginFetchResponse(response.ok);
        if (response.ok) {
          window.sessionStorage.setItem("loggedIn", "true");
          window.sessionStorage.setItem("justLoggedIn", "true");
          window.location.href = production
            ? returnUrl
            : returnUrl + `?__bindingAddress=${binding?.canonicalBaseAddress}`;
        }
      });
    }
  }, [loginResponse]);

  /*------------------------------------------------------------------------------------------------------------*/

  /*--- SIGNUP FORM ---*/
  //Sign Up Form Values
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const [signUpFormValues, setSignUpFormValues] = useState({
    name: "",
    surname: "",
    email: isFF || isVIP ? runtimeRoute?.queryString?.email : "",
    optin: false,
    tradePolicy: "",
    locale: locale,
    accessCode: isVIP && accessCode ? accessCode : "",
    id: "",
  });

  const shouldPrefillEmail =
    (isFF || isVIP) && runtimeRoute?.queryString?.email;

  const [signUpFetchResponse, setSignUpFetchResponse]: any = useState(true);
  const [isSignUpSubmitting, setIsSignUpSubmitting] = useState(false);
  const [signUpResponse, setSignUpResponse] = useState<{
    responseBody: string;
    status: number;
  }>();

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

  const signupFormFetch = async () => {
    /* --- event Start Registration ---*/
    push({
      event: "personalArea",
      section: "Personal Area",
      type: "registration",
    });
    /* ------ */
    setSignUpResponse(undefined);
    const response = await fetch(SIGNUP_API + HOST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpFormValues),
    });
    if (response.ok) {
      if (signUpFormValues.optin) {
        //GA4FUNREQ61
        push({
          event: "ga4-optin",
        });
      }
      
      push({
        event: "personalArea",
        type: "Registration",
        section: "Personal Area",
      })
      setPrevPage(Routes.REGISTRATION);
      setRoute(Routes.VALIDATION);
    }
    const responseBody = await response.text();
    setSignUpFetchResponse(response.ok),
      setIsSubmitting(false),
      setIsSignUpSubmitting(false);
    setSignUpResponse({
      responseBody: responseBody,
      status: response.status,
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
    fetch(SETPASSWORD_API + HOST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(setPasswordFormValues),
    })
      .then((response) => {
        setIsSetPasswordSubmitting(false);
        // setSetPasswordResponse(response.status);
        return response.ok
          ? response.json()
          : Promise.resolve({ error: JSON.stringify(response.status) });
      })
      .then((res) => {
        window.sessionStorage.setItem("invitations", res?.invitations);
        setSetPwdResponse(res);
      });
  };

  useEffect(() => {
    if (setPwdResponse && !setPwdResponse?.error) {
      window.localStorage.setItem("userCluster", setPwdResponse?.userCluster);
      fetch(PATCH_API + HOST, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: emptyBody,
      }).then((response) => {
        if (response.ok) {
          window.sessionStorage.setItem("loggedIn", "true");
          window.sessionStorage.setItem("justLoggedIn", "true");
          window.location.href = production
            ? returnUrl
            : returnUrl + `?__bindingAddress=${binding?.canonicalBaseAddress}`;
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
    fetch(FORGOT_API + HOST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(forgotFormValues),
    }).then((response) => {
      response.text();
      if (response.ok) {
        dataLayer.push({
          event: "forgot_password",
        });
        setRoute(Routes.VALIDATION);
      }
      setForgotFetchResponse(response.ok);
      setIsForgotSubmitting(false);
      return setForgotResponse(response.status);
    });
  };

  /*--- LOGIN GUEST FORM ---*/
  //Login Form Values
  const [loginGuestFormValues, setLoginGuestFormValues] = useState<{companyPassword: string}>({
    companyPassword: ""
  });
  const [loginGuestFetchResponse, setLoginGuestFetchResponse] = useState<boolean | undefined>(undefined);
  const [isGuestSubmitting, setIsGuestSubmitting] = useState<boolean>(false);

  const handleChangeInputGuestLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginGuestFormValues({
      ...loginGuestFormValues,
      [name]: value,
    });
  };

  /*------------------------------------------------------------------------------------------------------------*/

  /*--- REGEXES ---*/
  const upperCaseRegex = /[A-Z]+/;
  const lowerCaseRegex = /[a-z]+/;
  const numberRegex = /[\d]+/;

  /*--- ROUTING STATES ---*/
  const [route, setRoute] = useState(Routes.LOGIN);

  const fetchResolver = async () => {
    const { companyPassword } = loginGuestFormValues
    const response = await fetch(VIP_VALIDATION_API + HOST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({accessCode: accessCode ? accessCode : companyPassword, tradePolicy }),
    });

    if (response.ok) {
      const responseData = await response.json()
      window.localStorage.setItem("userCluster", responseData.userCompany);
      window.sessionStorage.setItem("sid", accessCode ? accessCode : companyPassword);
      window.location.href = production
        ? "/"
        : `/?__bindingAddress=${binding?.canonicalBaseAddress}`;
      if (!accessCode) {
        setLoginGuestFetchResponse(true);
        setIsGuestSubmitting(false);
      }
      return;
    }
    if (!accessCode) {
      setIsGuestSubmitting(false);
      setLoginGuestFetchResponse(false);
    }
    const responseBody = await response.text();
    if (
      response.status == 403 &&
      responseBody == "VIP invited, access denied"
    ) {
      setIsRegistrationModalOpen(true);
    }
  };

  /*--- VIP VALIDATION ---*/
  useEffect(() => {
    if (isVIP && accessCode) {
      fetchResolver();
    } else if (isVIP && !accessCode) {
      const sessionAccessCode = window?.sessionStorage?.getItem("sid");
      setSignUpFormValues({
        ...signUpFormValues,
        accessCode: sessionAccessCode,
        tradePolicy: tradePolicy,
      });
    }
  }, []);

  const context = useMemo(
    () => ({
      locale,
      tradePolicy,
      isEPP,
      isFF,
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
      loginGuestFormValues,
      loginGuestFetchResponse,
      isGuestSubmitting,
      handleChangeInputGuestLogin,
      setIsGuestSubmitting,
      fetchResolver,
      route,
      setRoute,
      signUpFormValues,
      shouldPrefillEmail,
      handleChangeInputSignUp,
      isRegistrationModalOpen,
      setIsRegistrationModalOpen,
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
      isEPP,
      isFF,
      isVIP,
      loginFormValues,
      loginFetchResponse,
      isSubmitting,
      loginResponse,
      loginGuestFormValues,
      loginGuestFetchResponse,
      isGuestSubmitting,
      route,
      isRegistrationModalOpen,
      signUpResponse,
      signUpFormValues,
      shouldPrefillEmail,
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
 * Use this hook to access the login context.
 * @example const { locale } = useLogin()
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
