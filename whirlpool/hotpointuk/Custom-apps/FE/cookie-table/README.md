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
      //This prop is useful if you want to print cookies list from the first id and contents (name and desc from the second id)
      "mappedCookies": {"C0001": "XXXX", "C0002": "XXXX", "C0003": "XXXX", "C0007": "XXXX"},
      "cookieFields": ["Name", "Host", "Length"]
    }
  }
```

### In which accounts the application is installed

- every workspace

## How to use it

- Uninstall the account.cookie-table-one-trust@x.x or account.cookie-table@x.x in the working account.
- Install the whirlpoolemea.cookie-table@x.x in the desired account.
- Insert whirlpoolemea.cookie-table@x.x as peer dependency in theme manifest.
- remember to set in theme the cookies strings you have to to show :
  - "cookiesIds":[ ["xxxxx", "xxxxx", "xxxxx", "xxxxx"] ]

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
