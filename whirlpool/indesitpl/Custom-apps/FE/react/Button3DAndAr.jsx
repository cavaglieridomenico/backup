import React from "react";
import { useEffect } from "react";

import { useProduct } from "vtex.product-context";

export default function Button3DAndAr() {
  useEffect(() => {
    button3DAndAr();
    return () => {
      button3DAndAr();
    };
  }, [commercialCodeValue]);

  const { product } = useProduct();

  const commercialCode = product.properties.find(
    (prop) => prop.name === "CommercialCode_field"
  );

  let commercialCodeValue = commercialCode.values[0].replace(/ /g, "");

  function button3DAndAr() {
    if (document.getElementById("script_flixmedia")) {
      document.getElementById("script_flixmedia").remove();
    }
    var script = document.createElement("script");
    script.id = "script_flixmedia";
    script.type = "text/javascript";
    script.src = "//media.flixfacts.com/js/loader.js";
    script.setAttribute("data-flix-distributor", "16306");
    script.setAttribute("data-flix-language", "en");
    script.setAttribute("data-flix-mpn", commercialCodeValue);
    script.setAttribute("data-flix-ean", "");
    script.setAttribute("data-flix-hotspot", "true");
    script.setAttribute("data-flix-autoload", "hotspot");
    script.setAttribute("data-flix-3d", "flix-3dfw");
    script.setAttribute("data-flix-brand", "Whirlpool");
    if (window.innerWidth <= 1024) {
      script.setAttribute("forcedstop", "false");
      script.setAttribute("mobileHotspot", "Y");
    }
    script.crossOrigin = true;
    script.async = true;
    document.head.appendChild(script);
  }
  return <></>;
}
