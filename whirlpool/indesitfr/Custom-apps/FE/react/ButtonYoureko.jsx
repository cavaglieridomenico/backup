import React, { useEffect } from "react";

export default function ButtonYoureko() {
  function getYoureko() {
    const script = document.createElement("script");

    script.async = true;
    script.src =
      "https://static.youreko.com/js/partners/gb/indesit/youreko.energy-review.indesit.all.min.js";
    script.id = "button-youreko";
    script.type = "text/javascript";

    document.body.appendChild(script);
  }

  useEffect(() => {
    getYoureko();
  }, []);

  return <></>;
}

/* export default function ButtonYoureko() {

  const script = document.createElement('script')

  script.async = true;
  script.src = 'https://static.youreko.com/js/partners/gb/indesit/youreko.energy-review.indesit.all.min.js'
  script.id = 'button-youreko'
  script.type = 'text/javascript'

  document.body.appendChild(script)
}  */
