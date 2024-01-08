# store-link-custom@1.x
Is useful if:

- You need to have a custom link with more option that allow link by vtex

### Examples of use

- Link without analytic events: 
```json
"flex-layout.row#bread-theme4": {
    "children": [
      "link#home",
    ],
    "props": {
      "preserveLayoutOnMobile": true,
      "fullWidth": true,
      "blockClass": "breadCustom"
    }
  },
```
```json
     "link#2level": {
    "props": {
      "href": "/",
      "label": "2ndlevel",
      "blockClass": "breadLink"
    }
  },
  "link#3level": {
    "props": {
      "href": "/",
      "label": "3level",
      "blockClass": "breadLink"
    }
  },

```
- Link with analytic events:

First example of an analytic event:
```json
    "link#scrivici": {
    "props": {
      "label": "scrivici",
      "href": "/supporto/contattaci",
      "target": "_blank",
      "isAnalyticsEvent": true,
      "analyticsEventName": "menu_footer_click",
      "isPrevent": false,
      "clickArea": "footer",
      "blockClass": "colonnaMenuSupportoLast"
    }
  }

```
Second example of an analytic event:
```json
    "link#scrivici": {
    "props": {
      "label": "scrivici",
      "href": "/supporto/contattaci",
      "target": "_blank",
      "isAnalyticsEvent": true,
      "analyticsEventName": "contacts_click",
      "isPrevent": false,
      "analyticsType": "email",
      "analyticsData": {"eventLabel": "contact click", "eventAction": "click"},
      "blockClass": "colonnaMenuSupportoLast"
    }
  }
  
```

### Configuration

| Prop name            | Type            | Description                                                   | Default value  |
| -------------------- | --------------- | ------------------------------------------------------------- | -------------- |
| `label`              | `string`        | Set text of link                                              | `''`           |
| `href`               | `string`        | Link to set for specific event                                | `''`           |
| `target`             | `string`        | Set where open the link, in new page or same page for example | `''`           |
| `displayMode`        | `anchor button` | Set display mode between anchor and button                    | `"anchor"`     |
| `isAnalyticsEvent`   | `boolean`       | Set true or false if it's analytics event or not              | `false`        |
| `analyticsEventName` | `string`        | Set the name of analytics event                               | `false`        |
| `analyticsType`      | `string`        | Set the type of analytics event                               | `"typeCustom"` |
| `isPrevent`          | `boolean`       | Set if it's a prevent or not                                  | `false`        |
| `clickArea`          | `string`        | Set if it's a prevent or not                                  | `"click area"` |
| `analyticsData`      | `object || array`        | Object or array of analytics data props                                  | `undefined` |
| `escapeLinkRegex`    | `string || undefined`| If defined, remove a portion of the href that matches the value of the property.                        | `undefined` |
| `replaceEscapedValue`| `string || undefined`| If defined, replace the value of the property escapeLinkRegex. | `undefined` |




### In which accounts the application is installed 
- ITWH 
- ITCC
- UKCC
- BKDE

### CSS Customization [CSS HANDLES]

```--linkContainer```
```--link```
```--label```
```--childrenContainer```
```--buttonLink```

## How to use it

- Uninstall the account.store-link-custom@x.x in the working account.
- Install the whirlpoolemea.store-link-custom@x.x in the desired account.
- Insert whirlpoolemea.store-link-custom@x.x as peer dependency.


## FOR MULTILANG PROJS
- Use rich text as child for the link, this will allow you to leverage on the VTEX internationalization
- Delete `label`  props
- Fix the style, accordingly to the brand guideline
- An example could be checked on itccwhirlpool account