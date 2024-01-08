# app-fe-test@1.x
Is useful if:

- You need to have a custom link with more option that allow link by vtex

### Examples of use

- NORMAL: 
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
### Configuration

| Prop name            | Type      | Description                                                   | Default value |
| -------------------- | --------- | ------------------------------------------------------------- | ------------- |
| `label`              | `string`  | Set text of link                                              | `''`          |
| `href`               | `string`  | Link to set for specific event                                | `''`          |
| `target`             | `string`  | Set where open the link, in new page or same page for example | `''`          |
| `isAnalyticsEvent`   | `boolean` | Set true or false if it's analytics event or not              | `false`       |
| `analyticsEventName` | `string`  | Set the name of analytics event                               | `false`       |
| `analyticsType`      | `String`  | Set the type of analytics event                               | `""`          |
| `isPrevent`          | `boolean` | Set if it's a prevent or not                                  | `false`       |



### In which accounts the application is installed

- hotpointit
- hotpointuk
- frwhirlpool
- itwhirlpool
- plwhirlpool
- bauknechtde

### CSS Customization [CSS HANDLES]

```--linkContainer```
```--link```
```--label```
```--childrenContainer```
```--buttonLink```

## How to use it

- Uninstall the account.app-fe-test@x.x in the working account.
- Install the whirlpoolemea.app-fe-test@x.x in the desired account.
- Insert whirlpoolemea.app-fe-test@x.x as peer dependency.


