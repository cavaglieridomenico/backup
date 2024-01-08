📢 Use this project, [contribute](https://github.com/{whirlpoolemea}/{price-drop-custom-ferrini}) 

# Whirlpoolemea price-drop-custom

Use this app if you want add the service in the product page(PDP)
to let the user to receive an e-mail when the price of the product drop.

## Configuration 
 
To add this service in your website you need to do:

1. Adding the app as a theme peerDependencies in the theme's `manifest.json` file;
2. Declaring the app's inside PDP, product.jsonc block from the theme:
3. Add follow code in country theme where do you want see the trigger button of form

### Examples of use
  
### product.jsonc
```jsonc
  "flex-layout.col#price-drop-form": {
    "title": "Flex Layout Col - Price Drop Form",
    "children": [
      "modal-trigger#price-drop-form"
    ]
  },
  "modal-trigger#price-drop-form": {
    "title": "Modal Trigger - Price Drop Form",
    "children": [
      "rich-text#price-drop-form",
      "modal-layout#price-drop-form"
    ],
    "props": {
      "blockClass": "priceDropForm"
    }
  },
  "rich-text#price-drop-form": {
    "title": "Rich Text - Price Drop Form",
    "props": {
      "text": "Preiswecker",
      "blockClass": "priceDropFormButton"
    }
  },
  "modal-layout#price-drop-form": {
    "title": "Modal Layout - Price Drop Form",
    "children": [
      "modal-header#price-drop-form",
      "modal-content#price-drop-form"
    ],
    "props": {
      "blockClass": "priceDropForm"
    }
  },
  "modal-header#price-drop-form": {
    "title": "Modal Header - Price Drop Form",
    "props": {
      "blockClass": "priceDropForm"
    }
  },
  "modal-content#price-drop-form": {
    "title": "Modal Content - Price Drop Form",
    "children": [
      "price-drop-form"
    ],
    "props": {
      "blockClass": "priceDropForm"
    }
  },
  ```

### vtex.modal-layout.css
```css
  .modal--priceDropForm {
  /* Cuz chat button has z-index:99999 */
	z-index: 100000 !important;
	}

	.paper--priceDropForm {
	padding: 0 !important;
	}
```
### vtex.rich-text.css
```css
  .paragraph--priceDropFormButton {
	  height: 100%;
	  border: 1px solid #505050;
	  display: flex;
	  justify-content: center;
	  align-items: center;
	  line-height: 1;
	  font-size: 0.9rem;
	  font-family: myriadSemibold;
	  color: #505050;
	  margin: 0 7px;
	  min-height: 100%;
	  cursor: pointer;
	  padding: 0.8rem;
	  transition: all 0.3s ease;
	}
	.paragraph--priceDropFormButton:hover {
	  border-color: #edb112;
	  color: #edb112;
	}
```
### Components 
1. As you can see there is a VTEX modal,and VTEX button trigger,that call our component: price drop service.
2. Success Messages and Error Messages are handled by component: Aftersubmitmessages
3. In Utils you can find AppSettings Handle CSS and all Messages
4. FormSkeleton is the cropped space used when the app is in loading
5. In Global.d.ts you can find any interfaces and Status Info


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
| `campaign`                              | `string`        | Name of promo, it's set by business in cms                   | `FORM_PDP_PRICEDROP`                                                         |
| `submitButtonText`                      | `string`        | Text button to show in submit button set by cms              | ``                                                                           |
| `successMessageNewsletter`              | `string`        | Success message to register to newsletter                    | `Subscription to newsletter done succesfully`                                |
| `successMessagePriceDrop`               | `string`        | Success message to register to price drop alert              | `Subscription to Price Drop Alert done succesfully`                          |
| `registeredErrorMessage`                | `string`        | Error message if user is already registered to newsletter    | `This email is already registered!`                                          |
| `shouldLogInErrorMessage`               | `string`        | Error message if a guest try to change newsletter preference | `This email is already associated to one account, please log in to continue` |
| `errorMessagePriceDrop`                 | `string`        | Error message if price alert receive response!=200           | `Subscription to Price Drop failed, retry`                                   |

 
## Modus Operandi 
NL: newsletter
DA: price drop alert

  ### Guest
  - User not registered click on button to show form, insert all data and submit, a new user will be created, with NL preferences and DA subscription  
  - User registered click on button to show form, insert all data and submit, Error, need to be logged to change NL preferences, SUCCESS DA
  - User registered click on button to show form, insert all data and submit, without any checkbox for NL subscription, SUCCESS DA
   ### Logged in
  - User could only set the checkboxes to subscribe his account to NL or DA.
  - IF all checkboxes to subscribe to NL are not checked it show an error.
  - If all NL checkboxes are checked user will be subscripted to NL
  - If all required checkboxes are checked user will be subscripted to DA

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
