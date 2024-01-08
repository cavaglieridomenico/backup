import { useEffect } from 'react';

export function useScrollListener (id,classFilter, callBack) {


  useEffect(() => {
      const check = (idT,classFilterT,callbackT) => {
        let selector='#'+idT;
        if(classFilterT){
          selector+='.'+classFilterT;
        }

        const elementT=document.querySelector(selector);
        if(elementT){
          let distanceFromTop = elementT.getBoundingClientRect().top;
          let distanceFromBottom = elementT.getBoundingClientRect().top + elementT.getBoundingClientRect().height;
          let distanceFromLeft = elementT.getBoundingClientRect().left;
          let distanceFromRight = elementT.getBoundingClientRect().left + elementT.getBoundingClientRect().width;

          if (distanceFromTop >= 0 && distanceFromBottom <= window.innerHeight &&  distanceFromLeft>=0 && distanceFromRight<= window.innerWidth) {
            if(callbackT && typeof callbackT === "function") {
              callbackT(idT);
            }
            clearInterval(timerId);
          }
        }
      }

      var timerId = setInterval(()=>check(id,classFilter,callBack), 1000);

      return ()=> clearInterval(timerId);
  },[]);
}
