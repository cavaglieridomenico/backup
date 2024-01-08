import React, { useEffect } from "react";

export default function EmbeddedServiceLocator() {
  useEffect(() => {
    getEmbeddedServiceLocatorData();
  }, []);

  function getEmbeddedServiceLocatorData() {
    const script = document.createElement("script");
    script.id = "store-locator-bootstrap";
    script.src =
      "https://store-locator.dev.wpsandwatch.com/static/bootstrap.js";
    script.type = "text/javascript";
    document.body.appendChild(script);
  }
  
  return (
    <div
      id="store-locator-app"
      data-brand="ID"
      data-country="FR"
      data-locale="fr_FR"
      data-type="service"
    ></div>
  );
}
