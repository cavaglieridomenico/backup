import React, { useEffect, useState } from "react";

export default function ConditionLayoutSearch({
  Else,
  Then,
  conditions,
  children,
}) {
  const [result, setResult] = useState(false);

  const checkHistory = window.history ? window.history.state.key : "";

  useEffect(() => {
    checkPath();
    // define callback as separate function so it can be removed later with cleanup function
    const onLocationChange = () => {
      checkPath();
    };
    window.addEventListener("popstate", onLocationChange);
    // clean up event listener
    return () => {
      window.removeEventListener("popstate", onLocationChange);
    };
  }, [result, checkHistory]);

  useEffect(() => {
    checkPath();
    // define callback as separate function so it can be removed later with cleanup function
    const onLocationChange = () => {
      checkPath();
    };
    window.addEventListener("popstate", onLocationChange);
    // clean up event listener
    return () => {
      window.removeEventListener("popstate", onLocationChange);
    };
  }, []);

  const checkPath = () => {
    if (
      window.location.href &&
      window.location.href !== undefined &&
      window.location.href !== null
    ) {
      let location = window.location.href;
      let pathToCheck = window.location.pathname.split("/")[3];

      if (conditions == "zamrażarki") {
        location = location.replace("ż", "z");
      }
      if (pathToCheck == "zamra%C5%BCarki") {
        pathToCheck = pathToCheck.replace("%C5%BC", "z");
      }
      if (conditions == "płyty") {
        location = location.replace("ł", "l");
      }
      if (pathToCheck == "p%C5%82yty") {
        pathToCheck = pathToCheck.replace("%C5%82", "l");
      }
      let reg = new RegExp(conditions + "$");
      let result = reg.exec(pathToCheck) ? true : false;
      if (
        conditions === "suszarki" &&
        window.location.href.indexOf("pralkosuszarki") > -1
      ) {
        result = false;
      }
      setResult(result);
    }
  };

  if (result) {
    if (Then) {
      return <Then />;
    }

    return <>{children}</>;
  }

  if (Else) {
    return <Else />;
  }

  return null;
}
