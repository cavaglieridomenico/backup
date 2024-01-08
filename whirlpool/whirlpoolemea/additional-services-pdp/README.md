# additional-services-pdp@1.x

Is useful for show the pages additional info in pdp, for example
- delivery
- price of installation
- etc etc.

### Examples of use

```json
"additional-services-pdp": {
    "props": {
      "servicesToPush":[
        {
          "Id": 11,
          "ServiceTypeId": 10,
          "Name": "Lieferung an den Verwendungsort",
          "Price": 0,
          "Description": "Innerhalb von 4-6 Werktagen.",
          "__typename": "AdditionalService"
        },
        {
          "Id": 12,
          "ServiceTypeId": 11,
          "Name": "Express Lieferung an den Verwendungsort",
          "Price": 19,
          "Description": "Innerhalb von 3 Werktagen.",
          "__typename": "AdditionalService"
       },
       {
        "Id": 11,
        "ServiceTypeId": 10,
        "Name": "hallo hallo madame",
        "Price": 0,
        "Description": "Innerhalb von 4-6 Werktagen.",
        "__typename": "AdditionalService"
      }
      ]
    }
  },
```

### in wich account is used

- itWH
- frWH
- PLWH
- HPIT
- bkde
- hpuk(atm not work)

### CSS Customization [CSS HANDLES]

``` servTitleStyle ``` : Title of Table
``` servAggTooltip ``` : not used
``` serviceTitle ``` : box container of title
``` whirlClub ``` :not used
``` serviziAggiuntiviTable ``` : table of contents
``` servAggRow ``` : text row
``` servOptions ``` : container of text of service
``` servOptionsDiscount ``` : container of text of discount
``` freeLabel ``` : when cost is 0 FREE label appear and this is the style
``` labelPrice ``` : Label Price Style
``` twoYearsWarranty ``` : text of warranty
``` warrantyServicesTitle ``` : title for warranty
``` addServicesTitleContainer ``` :container of service's name
``` addServicesTitleMarkLogo ``` : img to the left of service's name
``` mainContainer ``` :not used
``` tabLinkContainer ``` :not used
``` warrantyTabLink ``` :
``` warrantySecondTitle ``` :
``` baseTitle ``` :
``` clicked ``` :
``` infoIcon ``` : (i) to the right of table's title
``` carefreeUnorderedContainer ``` :
``` lastParagraph ``` :
``` modalListItem ``` :
``` textMainContainer ``` :




## How to use it

- Uninstall the account.additional-services-pdp@x.x in the working account.
- Install the whirlpoolemea.additional-services-pdp@x.x in the desired account.
- Insert whirlpoolemea.additional-services-pdp@x.x as peer dependency.
- remember to modify the theme where you are going to install as written upside, adding props that are missed in db response

