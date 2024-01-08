/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { Helmet } from 'vtex.render-runtime'

const hreflangHomeComponent = () => {
    const hreflangList = [
        {
            link: "https://www.indesit.pl/",
            country: "pl-PL"
        },
        {
            link: "https://www.indesit.fr/",
            country: "fr-FR"
        },
        {
            link: "https://www.indesit.cz/",
            country: "cs-CZ"
        },
        {
            link: "https://www.indesit.be/nl_BE",
            country: "nl-BE"
        },
        {
          link: "https://www.indesit.be/fr_BE",
          country: "fr-BE"
        },
        {
            link: "https://www.indesit.bg/",
            country: "bg-BG"
        },
        {
            link: "https://www.indesit.dk/",
            country: "da-DK"
        },
        {
            link: "https://www.indesit.gr/",
            country: "el-GR"
        },
        {
            link: "https://www.indesit.es/",
            country: "es-ES"
        },
        {
            link: "https://www.indesit.ee/",
            country: "et-EE"
        },
        {
            link: "https://www.indesit.ie/",
            country: "en-IE"
        },
        {
            link: "https://www.indesit.it/",
            country: "it-IT"
        },
        {
            link: "https://www.indesit.lv/",
            country: "lv-LV"
        },
        {
            link: "https://www.indesit.lt/",
            country: "lt-LT"
        },
        {
            link: "https://www.indesit.hu/",
            country: "hu-HU"
        },
        {
            link: "https://www.indesit.no/",
            country: "no-NO"
        },
        {
            link: "https://www.indesit.at/",
            country: "de-AT"
        },
        {
            link: "https://www.indesit.pt/",
            country: "pt-PT"
        },
        {
            link: "https://www.indesit.ro/",
            country: "ro-RO"
        },
        {
            link: "https://www.indesit.ch/de_CH",
            country: "de-CH"
        },
        {
            link: "https://www.indesit.ch/it_CH",
            country: "it-CH"
        },
        {
            link: "https://www.indesit.ch/fr_CH",
            country: "fr-CH"
        },
        {
            link: "https://www.indesit.sk/",
            country: "sk-SK"
        },
        {
            link: "https://www.indesit.fi/",
            country: "fi-FI"
        },
        {
            link: "https://www.indesit.se/",
            country: "sv-SE"
        },
        {
            link: "https://www.indesit.hr/",
            country: "hr-HR"
        },
        {
            link: "https://www.indesit.nl/",
            country: "nl-NL"
        },
        {
            link: "https://www.indesit.co.uk/",
            country: "en-GB"
        },
        {
            link: "https://www.indesit.ua/uk_UA",
            country: "uk-UA"
        },
        {
            link: "https://www.indesit.ua/ru_UA",
            country: "ru-UA"
        },
        {
            link: "https://www.ba.indesit.com/",
            country: "bs-BA"
        },
        {
            link: "https://www.indesit.ae/ar_AE",
            country: "ar-AE"
        },
        {
          link: "https://www.indesit.ae/en_AE",
          country: "en-AE"
        },
        {
          link: "https://www.indesit.com/",
          country: "x-default"
        },
        {
            link: "https://www.indesit.de/",
            country: "de-DE"
        }
    ]


    return <Helmet>
      { hreflangList.map((x) => {
         return <link key={x.country} rel="alternate" hrefLang={x.country} href={x.link}/>
    })}
    </Helmet>
}


export default hreflangHomeComponent
