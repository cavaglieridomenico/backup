/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { Helmet } from 'vtex.render-runtime'

const hreflangHomeComponent = () => {
    const hreflangList = [
        {
            link: "https://www.whirlpool.pl/",
            country: "pl-PL"
        }, 
        {
            link: "https://www.whirlpool.fr/",
            country: "fr-FR"
        },  
        {
            link: "https://www.whirlpool.it/",
            country: "it-IT"
        },     
        {
            link: "https://www.whirlpool.eu/",
            country: "x-default"
        },
        {
            link: "https://www.whirlpool.at/",
            country: "de-AT"
        },
        {
            link: "https://www.whirlpool.bg/",
            country: "bg-BG"
        },
        {
            link: "https://www.whirlpool.hr/",
            country: "hr-HR"
        },
        {
            link: "https://www.whirlpool.dk/",
            country: "da-DK"
        },
        {
            link: "https://www.whirlpool.ee/",
            country: "et-EE"
        },
        {
            link: "https://www.whirlpool.fi/",
            country: "fi-FI"
        },
        {
            link: "https://www.whirlpool.de/",
            country: "de-DE"
        },
        {
            link: "https://www.whirlpool.gr/",
            country: "el-GR"
        },
        {
            link: "https://www.whirlpool.ie/",
            country: "en-IE"
        },
        {
            link: "https://www.whirlpool.lv/",
            country: "lv-LV"
        },
        {
            link: "https://www.whirlpool.lt/",
            country: "lt-LT"
        },
        {
            link: "https://www.whirlpool.rs/",
            country: "sr-RS"
        },
        {
            link: "https://www.whirlpool.si/",
            country: "sl-SI"
        },
        {
            link: "https://www.whirlpool.be/fr_BE",
            country: "fr-BE"
        },
        {
            link: "https://www.whirlpool.be/nl_BE",
            country: "nl-BE"
        },
        {
            link: "https://www.whirlpool.cz/",
            country: "cs-CZ"
        },
        {
            link: "https://www.whirlpool.hu/",
            country: "hu-HU"
        },
        {
            link: "https://www.whirlpool.nl/",
            country: "nl-NL"
        },
        {
            link: "https://www.whirlpool.pt/",
            country: "pt-PT"
        },
        {
            link: "https://www.whirlpool.ro/",
            country: "ro-RO"
        },
        {
            link: "https://www.whirlpool.sk/",
            country: "sk-SK"
        },
        {
            link: "https://www.whirlpool.es/",
            country: "es-ES"
        },
        
        {
            link: "https://www.whirlpool.com.eg/en_EG",
            country: "en-EG"
        },
        {
            link: "https://www.whirlpool.com.eg/ar_EG",
            country: "ar-EG"
        },
        {
            link: "https://www.whirlpool.sa/en_SA",
            country: "en-SA"
        },
        {
            link: "https://www.whirlpool.sa/ar_SA",
            country: "ar-SA"
        },
        {
            link: "https://www.whirlpool.co.za/",
            country: "en-ZA"
        },
        {
            link: "https://www.whirlpool.ma/",
            country: "fr-MA"
        },
        {
            link: "https://www.whirlpool.se/",
            country: "sv-SE"
        },
        {
            link: "https://www.whirlpool.ae/en_AE",
            country: "en-AE"
        },
{
            link: "https://www.whirlpool.com.ua/",
            country: "uk-UA"
        }
    ]

   
    return <Helmet>
      { hreflangList.map((x) => {
         return <link key={x.country} rel="alternate" hrefLang={x.country} href={x.link}/>      
    })}
    </Helmet>
}


export default hreflangHomeComponent