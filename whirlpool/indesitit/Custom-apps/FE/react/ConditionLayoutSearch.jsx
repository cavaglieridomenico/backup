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
      let reg = new RegExp(conditions + '$'); 
      let pathToCheck = window.location.pathname.split("/")[3];
      const result = conditions === undefined ? false : reg.exec(pathToCheck) ? true : false;
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
