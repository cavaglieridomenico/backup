import React, { useEffect } from "react";
import LoginContainer from "./components/LoginContainer";
import { LoginContextProvider } from "./context/LoginContext";
import style from "./style.css";
// import ContentLoader from "react-content-loader";
// import style from "./style.css";
import { useRuntime } from "vtex.render-runtime";
import LoginGuestForm from "./components/LoginGuestForm";

interface LoginCustomProps {
  optinLink: string;
  isExternalLink: boolean;
  tooltipModalImage: string;
}

const LoginCustom: StorefrontFunctionComponent<LoginCustomProps> = ({
  optinLink,
  isExternalLink,
  tooltipModalImage,
}) => {
  const { production, binding, account } = useRuntime();
  let tradePolicy;
  console.log("GNA", binding);
  if (!account.includes("qa")) {
    tradePolicy =
      binding?.id == "8c0ae00c-9903-4189-92d7-2043fbb70eb9"
        ? "1"
        : binding?.id == "0a4ac151-c0f1-4d4b-be7d-2a741ba24be8"
        ? "2"
        : "3";
  } else {
    tradePolicy =
      binding?.id == "d2ef55bf-ed56-4961-82bc-6bb753a25e90"
        ? "1"
        : binding?.id == "df038a38-b21d-4a04-adbe-592af410dae3"
        ? "2"
        : "3";
  }
  // const tradePolicy = binding?.id == "8c0ae00c-9903-4189-92d7-2043fbb70eb9" ? "1" : binding?.id == "0a4ac151-c0f1-4d4b-be7d-2a741ba24be8" ? "2" : "3";
  const isVIP = tradePolicy == "3";
  // CHECK ALSO UNDEFINED AS STRING BECAUSE SOMETIMES IT ARRIVES LIKE THAT
  const isGuestAlreadyLogged = window?.sessionStorage?.getItem("sid") && window?.sessionStorage?.getItem("sid") !== "undefined";

  useEffect(() => {
    const isLogged = sessionStorage.getItem("loggedIn");
    const url = window.location.href;
    if (isLogged && !url.includes("itccwhirlpool.myvtex.com")) {
      //Check if the user is logged-in
      if (isLogged == "true") {
        window.location.href = production
          ? "/"
          : `/?__bindingAddress=${binding?.canonicalBaseAddress}`;
      }
    }
  }, []);
  // const { navigate } = useRuntime();
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // const isLogged = sessionStorage.getItem("loggedIn");
  //   // if (isLogged) {
  //   //   //Check if the user is logged-in
  //   //   if (isLogged == "true") {
  //   //     window.location.href = production
  //   //       ? "/"
  //   //       : `/?__bindingAddress=${binding?.canonicalBaseAddress}`;
  //   //   }
  //   // }
  // }, []);

  return (
    <LoginContextProvider>
      {/* {isLoading ? ( */}
      {/* <div className={style.skeletonContainer}>
          <ContentLoader height="500" width="1000" viewBox="0 0 265 230">
            <rect x="15" y="15" rx="4" ry="4" width="350" height="25" />
            <rect x="15" y="50" rx="2" ry="2" width="350" height="150" />
            <rect x="15" y="230" rx="2" ry="2" width="170" height="20" />
            <rect x="60" y="230" rx="2" ry="2" width="170" height="20" />
          </ContentLoader>
        </div>
      ) : ( */}
        <div className={style.formLogin}>
          {isVIP && !isGuestAlreadyLogged && (
              <LoginGuestForm />
          )}
          <div className={style.firstFormLogin}>
            <LoginContainer
              optinLink={optinLink}
              isExternalLink={isExternalLink}
              tooltipModalImage={tooltipModalImage}
          />
          </div>
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
