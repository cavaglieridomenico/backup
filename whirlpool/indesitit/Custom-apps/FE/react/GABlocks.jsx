import React, { useEffect } from "react";
import ReactGA from "react-ga";

export default function GABlocks() {
  ReactGA.initialize("GTM-PJRS8Z4");

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
      ReactGA.pageview(window.location.href + window.location.search);
    }
  };

  // function loadGABlock() {
  //   var head = document.getElementsByTagName("head")[0];
  //   var script = document.createElement("script");
  //   script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  //       new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  //       j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  //       'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  //       })(window,document,'script','dataLayer','GTM-PJRS8Z4')`;
  //   head.appendChild(script); }

  return (
    <></>
    // <noscript>
    //   <iframe
    //     src="https://www.googletagmanager.com/ns.html?id=GTM-PJRS8Z4"
    //     height="0"
    //     width="0"
    //     style={{ display: "none", visibility: "hidden" }}
    //   />
    // </noscript>
  );
}
