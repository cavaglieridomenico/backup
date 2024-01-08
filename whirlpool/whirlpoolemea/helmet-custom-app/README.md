# Helmet custom app

This application was created to handle topics regarding SEO and performance.

## Hreflang

It is an HTML attribute that allows you to indicate the language of a page and its geographic target.
Hreflang tags help Google to understand that there is a relationship between pages in different languages: these tags will try to show the correct version of the page in the search results.
This feature will have to be used on the homepage, PLP, PDP and probably other pages in the future.

### Homepage

The hrefLangs contained on homepages are managed via custom-app on individual markets and not via this emea app. We will soon try to migrate to this helmet-custom-app so as to facilitate maintainability and future developments.

### PLP

PLPs are currently the only pages that contain lists of hrefLangs managed through this app. The operation is quite simple, there are JSONs in the `data` folder that allow the correct list of hrefLangs to be loaded into the head of the relevant market page. The VTEX component to use is `hreflang-plp-component`.
The next step would be to do a retrieve of the hrefLangs related to each PLP via Graphql queries so as to enable the rendering of these elements server-side and dynamically.

### PDP

Currently in to-do.

## Usage of this application in external VTEX projects

> It is assumed that only the feature regarding PLPs is currently present.

First you need to get our custom-app called "helmet-custom-app" which is on the sponsor account whirlpoolemea. 
If you want to handle the WHPL case just remove the various checks in the `hrefLangPlp` component and use only the JSON that contains the hrefLangs for Whirlpool Poland.

Once this is done you will need to use the block in the theme.
The name, as you can see from the interfaces.json file in the custom-app is `hreflang-plp-component`: this needs to be added to the PLP page so that the hrefLang list is then included correctly.
