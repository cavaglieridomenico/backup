/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react'
import { Helmet } from 'vtex.render-runtime'

const hreflangHomeComponent = () => {
  const hreflangList = [
    {
      link: 'https://www.bauknecht.de/',
      country: 'de-DE',
    },
    {
      link: 'https://www.bauknecht.at/',
      country: 'de-AT',
    },
    {
      link: 'https://www.bauknecht.be/fr_BE',
      country: 'fr-BE',
    },
    {
      link: 'https://www.bauknecht.be/nl_BE',
      country: 'nl-BE',
    },

    {
      link: 'https://www.bauknecht.dk/',
      country: 'da-DK',
    },
    {
      link: 'https://www.bauknecht.nl/',
      country: 'nl-NL',
    },
    {
      link: 'https://www.bauknecht.ch/de_CH',
      country: 'de-CH',
    },
    {
      link: 'https://www.bauknecht.ch/fr_CH',
      country: 'fr-CH',
    },
    {
      link: 'https://www.bauknecht.ch/de_CH',
      country: 'de-CH',
    },
    {
      link: 'https://www.bauknecht.lu/',
      country: 'fr-LU',
    },
    {
      link: 'https://www.bauknecht.eu/',
      country: 'x-default',
    },
    {
      link: "https://www.bauknecht.no/",
      country: "no-NO"
    },
    {
      link: "https://www.bauknecht.se/",
      country: "sv-SE"
    }
  ]

  return (
    <Helmet>
      {hreflangList.map(x => {
        return (
          <link
            key={x.country}
            rel="alternate"
            hrefLang={x.country}
            href={x.link}
          />
        )
      })}
    </Helmet>
  )
}

export default hreflangHomeComponent
