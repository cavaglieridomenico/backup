import React, { useEffect, useState } from "react";
import styles from "./style.css";
import { useIntl } from "react-intl";

interface ConditionalLoginInterface {
  iconAccount: string;
}

const sessionAPI = "/api/sessions";

const ConditionalLogin: StorefrontFunctionComponent<
  ConditionalLoginInterface
> = ({ iconAccount }) => {
  const intl = useIntl();
  const [isAuthenticated, setAuthenticated] = useState<string>("");
  const [name, setName] = useState<string>("");

  const capitalizeString = (value: string) => {
    const loweredString = value.toLowerCase();
    return `${loweredString.charAt(0).toUpperCase()}${loweredString.slice(1)}`;
  };

  useEffect(() => {
    fetch(`${sessionAPI}?items=*`, {
      method: "GET",
      credentials: "same-origin",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
    })
      .then((res: any) => res.json())
      .then((res: any) => {
        if (
          res.namespaces.profile !== undefined &&
          res.namespaces.profile.isAuthenticated.value === "true"
        ) {
          setAuthenticated(res.namespaces.profile.isAuthenticated.value);
          if (
            res.namespaces.profile.firstName &&
            res.namespaces.profile.firstName.value
          ) {
            setName(res.namespaces.profile.firstName.value);
          }
        }
      });
  }, []);

  return (
    <div
      className={styles.menuItemContainer}
      onClick={() =>
        (window.location.href = isAuthenticated ? "/account" : "/login")
      }
    >
      <img src={iconAccount} alt="account-icon" className={styles.accountcon} />

      {name !== "" ? (
        <label className={styles.menuItemLabel}>{capitalizeString(name)}</label>
      ) : (
        <label className={styles.menuItemLabel}>
          {intl.formatMessage({ id: "store/conditional-login.myAccountLabel" })}
        </label>
      )}
    </div>
  );
};

ConditionalLogin.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {
    iconAccount: {
      title: "Account Icon",
      type: "string",
      description: "Insert the image url (ex. /arquivos/filename.jpg)",
      default: "/arquivos/",
    },
  },
};

export default ConditionalLogin;
