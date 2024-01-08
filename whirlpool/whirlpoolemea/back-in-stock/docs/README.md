📢 Use this project

# Whirlpoolemea back-in-stock

Use this app if you want add this service:
to let the user to receive an e-mail when the item temporarily not available is back in stock.

## Configuration 
 
To add this service in your website you need to do:

1. Adding the app as a theme peerDependencies in the theme's `manifest.json` file;
2. Declaring the app's inside discontinued-products.jsonc and product.jsonc (in main desktop and mobile)
3. You have to set all properties by CMS, else you will display only an empty form
4. to find app in CMS you have to choose main desktop/mobile, enter in to back in stock.

### Examples of use
  
### discontinued-products.jsonc
```jsonc
  "flex-layout.col#right-col-discontinued": {
    "props": {
      "blockClass": "product-desc-info",
      "preventVerticalStretch": true,
      "rowGap": 0
    },
    "children": ["condition-layout.product#backInStock",]
  },
  "flex-layout.col#single-col-discontinued": {
    "props": {
      "blockClass": "product-desc-info",
      "preventVerticalStretch": true,
      "rowGap": 0
    },
    "children": ["condition-layout.product#backInStock"]
  }
  ```

### product.jsonc
```jsonc
  "flex-layout.row#product-main": {
    "title": "Product Container - Desktop",
    "props": {
    },
    "children": ["flex-layout.col#product-image", "flex-layout.col#right-col"]
  },
  "flex-layout.col#product-main-tablet": {
    "props": {
    },
    "children": ["flex-layout.col#single-col"]
  },
  "flex-layout.col#product-mobile-container": {
    "title": "FlexCol - Product",
    "props": {
    },
    "children": [
      "condition-layout.product#isAvailableStickyMobile",
      "flex-layout.col#single-col"
    ]
  },
  "flex-layout.col#right-col": {
    "props": {
      "blockClass": "product-desc-info",
      "preventVerticalStretch": true,
      "rowGap": 0
    },
    "children": [
      "condition-layout.product#backInStock",
    ]
  },
  "flex-layout.col#single-col": {
    "title": "Single col",
    "props": {
      "blockClass": "product-desc-info",
      "preventVerticalStretch": true,
      "rowGap": 0
    },
    "children": [
      "condition-layout.product#backInStock",
    ]
  },
  "condition-layout.product#backInStock": {
    "title":"Back in stock",
    "props": {
      "conditions": [
        {
          "subject": "specificationProperties",
          "arguments": {
            "name": "sellable",
            "value": "true"
          }
        }
      ],
      "Then": "condition-layout.product#isDiscontinuedBackInStock"
    }
  },
    "condition-layout.product#isDiscontinuedBackInStock": {
    "props": {
      "conditions": [
        {
          "subject": "specificationProperties",
          "arguments": {
            "name": "isDiscontinued",
            "value": "true"
          }
        }
      ],
      "Then": null,
      "Else": "back-in-stock"
    }
  },
  ```


### Components 
   
1. Success Messages and Error Messages are handled by component: Aftersubmitmessages
2. In Utils you can find AppSettings Handle CSS and all Messages
3. FormSkeleton is the cropped space used when the app is in loading
4. In Global.d.ts you can find any interfaces and Status Info


### Props

| Prop name                               | Type            | Description                                                  | Default value                                                                |
| --------------------------------------- | --------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `title`                                 | `string`        | Title of form, set by cms or theme                           | ``                                                                           |
| `subtitles`                             | `array string`  | Eventual subtitles set by cms                                | ``                                                                           |
| `namePlaceholder`                       | `string`        | Placeholder in name input set by cms                         | ``                                                                           |
| `surnamePlaceholder`                    | `string`        | Placeholder in surname input set by cms                      | ``                                                                           |
| `emailPlaceholder`                      | `string`        | Placeholder in e-mail input set by cms                       | ``                                                                           |
| `showInputLabels`                       | `boolean`       | Allow to show label over input fields                        | `false`                                                                      |
| `nameLabel`                             | `string`        | Label on name input set by cms                               | ``                                                                           |
| `surnameLabel`                          | `string`        | Label on surname input set by cms                            | ``                                                                           |
| `emailLabel`                            | `string`        | Label on e-mail input set by cms                             | ``                                                                           |
| `checkboxes`                            | `checkboxprops` | Is the object who have the info about checkboxes             | ``                                                                           |
| `checkboxRequired`                      | `boolean`       | Is the checkbox required? set it in cms                      | ``                                                                           |
| `checkboxNewsletter`                    | `boolean`       | Is the checkbox required? set it in cms                      | ``                                                                           |
| `checkboxError`                         | `string`        | Error text if required checkbox is not checked               | ``                                                                           |
| `privacyPolicyTextArray`                | `array string`  | Eventual privacy text set by cms                             | ``                                                                           |
| `privacyPolicyTextArrayAfterCheckboxes` | `array string`  | Eventual privacy text after checkboxes set by cms            | ``                                                                           |
| `errorRequiredField`                    | `string`        | Error message if inputs are empty                            | ``                                                                           |
| `errorInvalidMail`                      | `string`        | Error message email if wrong or empty                        | ``                                                                           |
| `campaign`                              | `string`        | Name of promo, it's set by business in cms                   | `FORM_LP_BACKINSTOCK`                                                        |
| `submitButtonText`                      | `string`        | Text button to show in submit button set by cms              | ``                                                                           |
| `successMessageNewsletter`              | `string`        | Success message to register to newsletter                    | `Subscription to newsletter done succesfully`                                |
| `successMessageSubscriptionToBIS`       | `string`        | Success message to register to back in stock                 | `Subscription to Back in Stock done succesfully`                             |
| `registeredErrorMessage`                | `string`        | Error message if user is already registered to newsletter    | `This email is already registered!`                                          |
| `shouldLogInErrorMessage`               | `string`        | Error message if a guest try to change newsletter preference | `This email is already associated to one account, please log in to continue` |
| `errorMessageSubscriptionToBIS`         | `string`        | Error message if receive response!=200                       | `Subscription to Back in Stock failed, retry`                                |

 
## Modus Operandi 
NL: newsletter
BS: back in stock

  ### Guest
  - User not registered click on button to show form, insert all data and submit, a new user will be created, with NL preferences and BS subscription  
  - User registered click on button to show form, insert all data and submit, Error, need to be logged to change NL preferences, SUCCESS BS
  - User registered click on button to show form, insert all data and submit, without any checkbox for NL subscription, SUCCESS BS
   ### Logged in
  - User could only set the checkboxes to subscribe his account to NL or BS.
  - IF all checkboxes to subscribe to NL are not checked it show an error.
  - If all NL checkboxes are checked user will be subscripted to NL
  - If all required checkboxes  are checked (OR IF NONE) user will be subscripted to BS

## Customization

Remember to create a css file in theme folder that contain all handle css
  
| CSS Handles                |
| -------------------------- |
| `form__container`          |
| `container__title`         |
| `container__text-subtitle` |
| `form__container-inputs`   |
| `form__container-name`     |
| `form__container-surname`  |
| `form__container-email`    |
| `container__privacy`       |
| `container__text-privacy`  |
| `form__container-checkbox` |
| `form__checkbox`           |
| `form__container-btn`      |
| `form__button-disabled`    |
| `form__button-enabled`     |
| `container__text-messages` |
| `form__container-text`     |
| `text__message-success`    |
| `text__message-error`      |
| `text__message-warning`    |
| `skeleton__wrapper`        |
| `skeleton`                 |



## Whirlpoolemea tips:
- Remember to set billing options inside manifest of app (check any other app whirlpoolemea)
- Remember to add the app in the peer-dependencies of manifest's theme (check any other app whirlpoolemea)
