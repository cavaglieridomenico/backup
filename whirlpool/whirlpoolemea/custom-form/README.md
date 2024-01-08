# custom-form@1.x

Is useful for show the pages dedicated to refound accesories or products

### Examples of use

- NORMAL: 
```json
"store.custom#reso-accessorio": {
    "blocks": [
      "breadcrumb#SostituzioneProdottoDanneggiato1",
      "flex-layout.row#spaceSmall",
      "flex-layout.row#SostituzioneProdottoText1",
      "flex-layout.row#halfSpace",
      "flex-layout.row#ResoAccessori",
      "analytics"
    ]
  },
  "flex-layout.row#ResoAccessori":{
    "props":{
      "blockClass":"CustomFormRow"
    },
    "children":["custom-form"]
  },
```
### Configuration

| Prop name | Type | Description | Default value |
| --------- | ---- | ----------- |-------------------------------------  | ------------- |
| `url`                      | `string`   | url for submit form                                | `''`          |
| `isReturn`                 | `boolean`  | Value for check if is a refound                    | `false`       |
| `isProduct`                | `boolean`  | Value for check if is a product                    | `[{}]`        |
| `privacyLabel`             | `[string]` | Label to privacy treatment advice                  | `[{}]`        |
| `privacyLinkLabel`         | `[string]` | Name of link to privacy treatment                  | `''`          |
| `privacyLink`              | `string`   | Link to privacy treatment                          | `''`          |


### CSS Customization [CSS HANDLES]

```--container``` class to change the container of the specification printed


### In which accounts the application is installed

- ITWH
- ITCC


## How to use it

- Uninstall the account.custom-form@x.x in the working account.
- Install the whirlpoolemea.custom-form@x.x in the desired account.
- Insert whirlpoolemea.custom-form@x.x as peer dependency.

