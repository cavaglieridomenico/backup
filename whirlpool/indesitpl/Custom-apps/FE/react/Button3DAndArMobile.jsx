import React from 'react'
import { useEffect } from 'react'

export default function Button3DAndArMobile() {
  useEffect(() => {
    button3DAndArMobile()
  }, [])

  function button3DAndArMobile() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://media.flixcar.com/delivery/js/hotspot/16197/en/mpn/MTWC91483WUK/null/true?&d=16197&l=en&mpn=MTWC91483WUK&brand=Whirlpool&hotspot=true&forcedstop=false&mobileHotspot=Y&ext=.js';
    document.head.appendChild(script);
  }
  return <></>
}
