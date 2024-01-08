import React, { useEffect } from "react";

export default function StoreLocatorPage() {
  useEffect(() => {
    getStoreLocatorData();
  }, []);

  function getStoreLocatorData() {
    const script = document.createElement("script");

    script.src =
      "https://store-locator.prod.wpsandwatch.com/static/bootstrap.js";
    script.id = "store-locator-bootstrap";
    script.type = "text/javascript";

    document.body.appendChild(script);
  }

  return (
    <>
      <div
        id="store-locator-app"
        data-brand="ID"
        data-country="PL"
        data-locale="pl_PL"
      />
    </>
  );
}
