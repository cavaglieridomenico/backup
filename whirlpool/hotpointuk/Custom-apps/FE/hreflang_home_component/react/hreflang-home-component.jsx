/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { Helmet } from 'vtex.render-runtime'

const hreflangHomeComponent = () => {
    const hreflangList = [
        {
            link: "https://www.hotpoint.co.uk/",
            country: "en-GB"
        },
        {
            link: "https://www.hotpoint.bg/",
            country: "bg-BG"
        },
        {
            link: "https://www.hotpoint.ee/",
            country: "et-EE"
        }, 
        {
            link: "https://www.hotpoint.fr/",
            country: "fr-FR"
        },  
     
        {
            link: "https://www.hotpoint.ie/",
            country: "en-IE"
        },
        {
            link: "https://www.hotpoint.it/",
            country: "it-IT"
        },
        {
            link: "https://www.hotpoint.lt/",
            country: "lt-LT"
        },
        {
            link: "https://www.hotpoint.lv/",
            country: "lv-LV"
        },
        {
            link: "https://www.hotpoint.pl/",
            country: "pl-PL"
        },
        {
            link: "https://www.hotpoint.pt/",
            country: "pt-PT"
        },
        {
            link: "https://www.hotpoint.ro/",
            country: "ro-RO"
        },
        {
            link: "https://www.hotpoint.es/",
            country: "es-ES"
        },
        {
            link: "https://www.hotpoint.eu/",
            country: "x-default"
        }
    ]

   
    return <Helmet>
      { hreflangList.map((x) => {
         return <link key={x.country} rel="alternate" hrefLang={x.country} href={x.link}/>      
    })}
    </Helmet>
}


export default hreflangHomeComponent