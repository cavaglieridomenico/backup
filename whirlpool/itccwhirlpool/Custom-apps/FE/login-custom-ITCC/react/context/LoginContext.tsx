import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRuntime } from "vtex.render-runtime";
// import { useQuery } from "react-apollo";
// import getSession from "../graphql/getSession.graphql";
import { defineMessages, useIntl } from "react-intl";
import { usePixel } from "vtex.pixel-manager";
import { FORGOT_API, LOGIN_API, PATCH_API, SETPASSWORD_API, SIGNUP_API, VIP_VALIDATION_API } from "../config/config";
import "../styles.global.css";

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
  //Login Guest Form
  loginGuestFormValues: LoginGuestFormValues;
  handleChangeInputGuestLogin: any;
  loginGuestFormFetch: any;
  loginGuestFetchResponse: any;
  isGuestSubmitting: boolean;
  setIsGuestSubmitting: any;
  // loginGuestResponse: any;
  // setLoginGuestResponse: any;
  //SignUp Form
  isRegistrationModalOpen: boolean;
  setIsRegistrationModalOpen: any;
  signUpFormValues: SignUpFormValues;
  handleChangeInputSignUp: any;
  signUpFetchResponse: boolean;
  isSignUpSubmitting: boolean;
  setIsSignUpSubmitting: any;
  signUpResponse: any;
  setSignUpResponse: any;
  payloadResponse: any;
  setPayloadResponse: any;
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
  //companyPassword?: string;
}
interface LoginGuestFormValues {
  companyPassword?: string;
}
interface SignUpFormValues {
  name: string;
  surname: string;
  email: string;
  companyPassword?: string;
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

export const LoginContextProvider: React.FC = ({ children }:any) => {
  const { production, culture, binding, route: runtimeRoute, account } = useRuntime();
  const intl = useIntl();
  const { push } = usePixel();
  const returnUrl = runtimeRoute?.queryString?.returnUrl || "/";
  const [prevPage, setPrevPage] = useState("");
  const dataLayer = ((window as unknown) as WindowGTM).dataLayer || [];
  /*--- CONSTS ---*/
  // const tradePolicy = window
  //   ? JSON.parse(
  //       Buffer.from(
  //         (window as any).__RUNTIME__.segmentToken,
  //         "base64"
  //       ).toString()
  //     ).channel
  //   : "4";
  let tradePolicy: string;
  let tradePolicyWs: string;
  if (!account.includes("qa")) {
    tradePolicy = binding?.id == "8c0ae00c-9903-4189-92d7-2043fbb70eb9" ? "1" : binding?.id == "0a4ac151-c0f1-4d4b-be7d-2a741ba24be8" ? "2" : "3";
    tradePolicyWs = window?.location?.href.includes("epp")
      ? "epp.whirlpoolgroup.it"
      : window?.location?.href.includes("ff")
      ? "ff.whirlpoolgroup.it"
      : "vip.whirlpoolgroup.it";
  } else {
    tradePolicy =
      binding?.id == "d2ef55bf-ed56-4961-82bc-6bb753a25e90"
        ? "1"
        : binding?.id == "df038a38-b21d-4a04-adbe-592af410dae3"
        ? "2"
        : "3";
    tradePolicyWs = window?.location?.href.includes("epp")
      ? "testepp123.whirlpoolgroup.it"
      : window?.location?.href.includes("ff")
      ? "testff123.whirlpoolgroup.it"
      : "testvip123.whirlpoolgroup.it";
  }

  const isEPP = tradePolicy == "1";
  const isFF = tradePolicy == "2";
  const isVIP = tradePolicy == "3";

  const checkIfAutologin = (accessCode: string): boolean => {
    const autologinCodes = [
      "2jrse8igj-mmi0-vr3y-8opz-vyjfaf14knm5",
      "es1234si3-ofc0-7f21-0j02-3ita5f303de0",
      "a8ac2d02-e50a-ffec-3e60-679af048c3da",
      "5ih8tnboi-5ugj-mol6-3h6n-r7h3jyopy3me",
      "bdbvxmqkj-uriw-gigs-srwb-rfxjrgucdbye",
      "it3455si3-ofc0-7f21-0d02-7itaenne9it0",
      "r21rmbpff-d9o5-2mdm-wtwg-fc5xf7ps823d"
    ];
    const isAutologin = autologinCodes.indexOf(accessCode) >= 0
    
    return isAutologin;
  }

  console.log(isEPP ? "isEPP" : isFF ? "isFF" : "isVIP");

  const locale = culture?.locale;
  const accessCode = getQueryParams(window.location?.href)["sid"];
  const HOST = !production || window.location?.hostname?.includes("myvtex.com") ? `?host=${tradePolicyWs}` : "";

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
    setLoginGuestFormValues({
      ...loginGuestFormValues
    });
  }, [tradePolicy]);

  /*------------------------------------------------------------------------------------------------------------*/

  /*--- LOGIN FORM ---*/
  //Login Form Values
  const [loginFormValues, setLoginFormValues] = useState({
    email: "",
    password: "",
    tradePolicy: "",
    //companyPassword: ""
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

  const loginFormFetch = () => {
    setLoginResponse(undefined);
    fetch(LOGIN_API + HOST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginFormValues),
    })
      .then((response) => {
        /* --- event Login ---*/
        const section = window?.location?.pathname?.replace("/", "");
        if (response.ok) {
          dataLayer.push({
            event: "personalArea",
            eventCategory: "Personal Area",
            eventAction: "Login",
            eventLabel: `Login from ${section}`,
            type: "login",
          });
        }
        /* ------ */
        dataLayer.push({
          event: "personalArea",
          eventCategory: "Personal Area",
          eventAction: "Login",
          eventLabel: `Login: ${response.ok ? "ok" : "ko"}`,
        });
        setLoginFetchResponse(response.ok), setIsSubmitting(false);
        return response.ok ? response.json() : Promise.resolve({ error: true });
      })
      .then((res) => {
        if (isVIP) {
          window.sessionStorage.setItem("sid", res?.sid);
          window.sessionStorage.setItem("invitations", res?.invitations);
        }

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
          window.location.href = production ? returnUrl : returnUrl + `?__bindingAddress=${binding?.canonicalBaseAddress}`;
        }
      });
    }
  }, [loginResponse]);

  /*------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------*/

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

  const loginGuestFormFetch = async () => {
    const { companyPassword } = loginGuestFormValues
    // setLoginGuestResponse(undefined);
    const response = await fetch(VIP_VALIDATION_API + HOST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({accessCode, tradePolicy, companyPassword}),
    })
    if (response.ok) {
      window.sessionStorage.setItem("sid", accessCode);
      window.location.href = production ? "/" : `/?__bindingAddress=${binding?.canonicalBaseAddress}`;
      setLoginGuestFetchResponse(true);
      setIsGuestSubmitting(false);
      return;
    } else {
      setIsGuestSubmitting(false);
      setLoginGuestFetchResponse(false)
    }
    const responseBody = await response.text();
    console.log(responseBody, "responseBody");
    if (response.status == 403 && responseBody == "VIP invited, access denied") {
      setIsRegistrationModalOpen(true);
    }
  }

  /*------------------------------------------------------------------------------------------------------------*/
  /*--- SIGNUP FORM ---*/
  //Sign Up Form Values
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const [signUpFormValues, setSignUpFormValues] = useState<SignUpFormValues>({
    name: "",
    surname: "",
    email: isFF ? runtimeRoute?.queryString?.email : "",
    optin: false,
    // companyPassword: "",
    tradePolicy: "",
    locale: locale,
    accessCode: isVIP && accessCode ? accessCode : "",
    id: "",
  });

  const [signUpFetchResponse, setSignUpFetchResponse]: any = useState(true);
  const [isSignUpSubmitting, setIsSignUpSubmitting] = useState(false);
  const [signUpResponse, setSignUpResponse]: any = useState();
  const [payloadResponse, setPayloadResponse]: any = useState(null);

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
    setSignUpResponse(undefined);
    fetch(SIGNUP_API + HOST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signUpFormValues),
    }).then(async (response) => {
      if (response.ok) {
        if (signUpFormValues.optin) {
          push({ event: "LeadGeneration", data: "user_registration" });
        }
        /* --- event Start Registration ---*/
        const section = window?.location?.pathname?.replace("/", "");
        dataLayer.push({
          event: "personalArea",
          eventCategory: "Personal Area",
          eventAction: "Start Registration",
          eventLabel: `Start Registration from ${section}`,
          type: "registration",
        });
        /* ------ */
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
      let responseBody = await response.text();
      setPayloadResponse(responseBody);
      setSignUpFetchResponse(response.ok);
      setIsSubmitting(false);
      setIsSignUpSubmitting(false);
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

  const [setPasswordFetchResponse, setSetPasswordFetchResponse]: any = useState(true);
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
        dataLayer.push({
          event: "personalArea",
          eventCategory: "Personal Area",
          eventAction: prevPage == Routes.REGISTRATION ? "Registration" : "Login",
          eventLabel: `${prevPage == Routes.REGISTRATION ? "Registration:" : "Login:"} ${response.ok ? "ok" : "ko"}`,
        });
        setIsSetPasswordSubmitting(false);
        // setSetPasswordResponse(response.status);
        return response.ok ? response.json() : Promise.resolve({ error: JSON.stringify(response.status) });
      })
      .then((res) => {
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
          window.location.href = production ? returnUrl : returnUrl + `?__bindingAddress=${binding?.canonicalBaseAddress}`;
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

  const fetchResolver = async () => {
    const isAutologin = checkIfAutologin(accessCode)
    if (isAutologin) {
      const response = await fetch(VIP_VALIDATION_API + HOST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessCode, tradePolicy }),
        });

      if (response.ok) {
        window.sessionStorage.setItem("sid", accessCode);
        window.location.href = production ? "/" : `/?__bindingAddress=${binding?.canonicalBaseAddress}`;
        return;
      }
      const responseBody = await response.text();
      console.log(responseBody, "responseBody");
      if (response.status == 403 && responseBody == "VIP invited, access denied") {
        setIsRegistrationModalOpen(true);
      }
    }
  };

  /*--- VIP VALIDATION ---*/
  useEffect(() => {
    if (!loginGuestFetchResponse) {
      if (isVIP && accessCode) {
        fetchResolver();
      } else if (isVIP && !accessCode) {
        const sessionAccessCode = window?.sessionStorage?.getItem("sid") ?? "";
        setSignUpFormValues({
          ...signUpFormValues,
          accessCode: sessionAccessCode,
          tradePolicy: tradePolicy,
        });
      }
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
      route,
      setRoute,
      signUpFormValues,
      handleChangeInputSignUp,
      isRegistrationModalOpen,
      setIsRegistrationModalOpen,
      signUpFetchResponse,
      isSignUpSubmitting,
      setIsSignUpSubmitting,
      signUpResponse,
      setSignUpResponse,
      payloadResponse,
      setPayloadResponse,
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
      loginGuestFormValues,
      handleChangeInputGuestLogin,
      loginGuestFormFetch,
      loginGuestFetchResponse,
      isGuestSubmitting,
      setIsGuestSubmitting,
      // loginGuestResponse,
      // setLoginGuestResponse,
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
      // loginGuestResponse,
      route,
      isRegistrationModalOpen,
      signUpResponse,
      payloadResponse,
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

  return <LoginContext.Provider value={context}>{children}</LoginContext.Provider>;
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

function getQueryParams(url: string) {
  const paramsArr = url?.slice(url?.indexOf("?") + 1)?.split("&");
  const params: any = {};
  paramsArr?.map((param: string) => {
    const [key, val] = param?.split("=");
    params[key] = decodeURIComponent(val);
  });
  return params;
}

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
  companyPasswordError:{
    defaultMessage: "The inserted guest code is not valid",
    id: "store/custom-login.errors.invalid-companyPassword",
  },
  passwordError: {
    defaultMessage: "Your password must contain: at least 8 characters, including numbers, lowercase and uppercase",
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
