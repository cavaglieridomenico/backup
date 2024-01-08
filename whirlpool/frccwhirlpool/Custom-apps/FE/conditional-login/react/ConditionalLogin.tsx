import React, { useEffect, useState } from "react";
import styles from "./style.css";

const sessionAPI = "/api/sessions";

interface ConditionalLoginProps { }

const ConditionalLogin: StorefrontFunctionComponent<ConditionalLoginProps> = ({ }) => {
  const [isAuthenticated, setAuthenticated] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

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
        // console.log(res);
        // debugger;
        if (
          res.namespaces.profile !== undefined &&
          res.namespaces.profile.isAuthenticated.value === "true"
        ) {
          setAuthenticated(res.namespaces.profile.isAuthenticated.value);
          if (res.namespaces.profile.firstName && res.namespaces.profile.firstName.value) {
            setName(res.namespaces.profile.firstName.value);
          } else if (res.namespaces.profile.email) {
            setEmail(res.namespace.profile.email.value);
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="28"
        viewBox="0 0 22 28"
      >
        <g fill="none" fill-rule="evenodd">
          <g stroke="#505050">
            <g>
              <g>
                <path
                  d="M10.5 0C6.91 0 4 2.94 4 6.565c0 3.626 2.91 6.565 6.5 6.565S17 10.19 17 6.565C17 2.939 14.09 0 10.5 0M0 25.25c0-5.578 4.477-10.1 10-10.1s10 4.522 10 10.1"
                  transform="translate(-1369 -37) translate(1370 38.38)"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>

      {isAuthenticated === "true" ? (
        name !== "" ? (
          <label className={styles.menuItemLabel}>
            {capitalizeString(name)}
          </label>
        ) : (
          <label className={styles.menuItemLabel}>
            {capitalizeString(email)}
          </label>
        )
      ) : null}
    </div>
  );
};

ConditionalLogin.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {},
};

export default ConditionalLogin;
