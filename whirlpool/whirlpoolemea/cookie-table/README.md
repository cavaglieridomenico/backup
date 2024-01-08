# cookie-table

this app allow to show the page of cookies used for cookielaw


### Examples of use

- NORMAL: 
```json
"flex-layout.row#table": {
    "children": ["Cookie-table"],
    "props": {
      "blockClass": "rowTable",
      "cookieGroups": ["C0001", "C0002", "C0003", "C0007"],
      "cookieFields": ["Name", "Host", "Length"]
    }
  }
  
## changelog 1.0.11-beta 02/12/22 
  fixed logic to construct the link and the sentece. 
  When installed by default you will see the formatted message in the content.
  The formatted messages are updated to 02/12/22 by every country prod 
  **REMEMBER** FIX FOOTER CONTENT BY CMS


### In which accounts the application is installed

- every workspace
  

## How to use it

- Uninstall the account.cookie-table-one-trust@x.x or account.cookie-table@x.x in the working account.
- Install the whirlpoolemea.cookie-table@x.x in the desired account.
- Insert whirlpoolemea.cookie-table@x.x as peer dependency in theme manifest.
- remember to set in theme the cookies strings you have to to show :
  - "cookiesIds":[  ["xxxxx", "xxxxx", "xxxxx", "xxxxx"] ]

PS: in PLWH ahve to change in theme-> hide themaTitle and cookiepopup
     ```json 
         "flex-layout.row#cookieTitleFooter": {
          "children":[/*"Cookie-table.themaTitle#footer"*/],
          "props":{
            "blockClass": "cookieTitleFooter"
            }
            },
        // "Cookie-table.themaTitle#footer":{
        // "props":{
        // "linkLabel": "Ustawienia dotyczące Cookies poprzez centrum preferencji"
        // }
        // },

        in file:informativa-sui-cookie.jsonc, hide cookiepopup :
        
         "flex-layout.row#cookiePopup": {
          "children": [/*"Cookie-table.cookiePopup"*/],
          "props": {
          "blockClass": ["rowLink"/*, "cookiePopup"*/]
          }
          },
      ```

