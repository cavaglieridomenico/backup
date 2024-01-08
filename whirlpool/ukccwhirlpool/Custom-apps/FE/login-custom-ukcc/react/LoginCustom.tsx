import React, { Suspense, lazy, useEffect } from "react";
import { useRuntime } from "vtex.render-runtime";
import { LoginContextProvider } from "./context/LoginContext";
import style from "./style.css";
import "./styles.global.css";

interface LoginCustomProps {
  optinLink: string;
  isExternalLink: boolean;
  tooltipModalImage: string;
  tooltipModalText: string;
  guestFormTitle?: string;
  companyPasswordLabel?: string;
  companyPasswordPlaceholder?: string;
  guestFormSubtitle?: string;
  guestCtaLabel?: string;
  guestFormError?: string;
  formTitle?: string;
  formSubtitle?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
}

const LoginCustom: StorefrontFunctionComponent<LoginCustomProps> = ({
  optinLink,
  isExternalLink,
  tooltipModalImage,
  tooltipModalText,
  guestFormTitle,
  companyPasswordLabel,
  companyPasswordPlaceholder,
  guestFormSubtitle,
  guestCtaLabel,
  guestFormError,
  formTitle,
  formSubtitle,
  emailLabel,
  emailPlaceholder
}) => {
  const { production, binding, account } = useRuntime();
  let tradePolicy;
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
  const isVIP = tradePolicy == "3";
  // CHECK ALSO UNDEFINED AS STRING BECAUSE SOMETIMES IT ARRIVES LIKE THAT
  // const isGuestAlreadyLogged = window?.sessionStorage?.getItem("sid") && window?.sessionStorage?.getItem("sid") !== "undefined";

  const LoginGuestForm = lazy(() => import("./components/LoginGuestForm"))
  const LoginContainer = lazy(() => import("./components/LoginContainer"))
  const loaderFallback = <div className={style.loaderFormContainer}>
                <div className={style.loaderForm}></div>
              </div>

  useEffect(() => {
    if (!isAuth) {
      const isLogged = sessionStorage.getItem("loggedIn");
      if (isLogged) {
        //Check if the user is logged-in
        if (isLogged == "true") {
          window.location.href = production
            ? "/"
            : `/?__bindingAddress=${binding?.canonicalBaseAddress}`;
        }
      }
    }
  }, []);
  const pathname = typeof window.location !== "undefined" ? window.location.pathname : "";
  const isAuth = pathname === "/authentication";

  console.log(tooltipModalImage, "tooltipModalImage");
  return (
    <LoginContextProvider>
      <div className={style.formLogin}>
        <Suspense fallback={loaderFallback}>
          {isVIP && !isAuth && (
            <>
              <LoginGuestForm
                isVIP={isVIP}
                guestFormTitle={guestFormTitle}
                companyPasswordLabel={companyPasswordLabel}
                companyPasswordPlaceholder={companyPasswordPlaceholder}
                guestFormSubtitle={guestFormSubtitle}
                guestCtaLabel={guestCtaLabel}
                guestFormError={guestFormError}
              />
              <div className={style.divider}>OR</div>
            </>
          )}
          <div className={style.firstFormLogin}>
            <LoginContainer
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
          </div>
        </Suspense>
      </div>
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
