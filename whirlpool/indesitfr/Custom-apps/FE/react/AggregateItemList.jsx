import React, { useEffect } from "react";
import { canUseDOM } from "vtex.render-runtime";

const AggregateItemList = () => {
  let i;

  if (canUseDOM) {
    const itemListScripts = document.querySelectorAll(
      'script[type="application/ld+json"]:not([data-react-helmet=true])'
    );
    console.log(itemListScripts);

    if (itemListScripts.length > 1) {
      useEffect(() => {
        for (i = 1; i < itemListScripts.length; i++) {
          if (itemListScripts[i] !== null && itemListScripts[i] !== undefined) {
            if (
              itemListScripts[i].innerHTML !== null &&
              itemListScripts[i].innerHTML !== undefined
            ) {
              console.log("Entrato " + i);
              itemListScripts[i].remove();
            }
          }
        }
      }, [itemListScripts]);
    }
  }

  return <></>;
};

export default AggregateItemList;
