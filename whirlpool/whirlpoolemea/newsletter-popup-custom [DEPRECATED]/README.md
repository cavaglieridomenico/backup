# DEPRECATED
this app is deprecated, look for a new one: whirlpoolemea.newsletter-custom-app
# newsletter-popup-custom@1.x
Is useful if:
- You need to show a popup to invite users to subscribe a newsletters or something similar


### Examples of use

- NORMAL: 
```json
{
   "newsletter-popup#header": {
    "props": {
      "time": 0.25 // default time is 1 = 60 sec -> 60 / 4 = 15 res
    },
    "children": ["newletter-form"]
  },
  /*.-----------------.*/
  "footer-layout.desktop": {
    "children": [
      "newsletter-popup#footer",
      "flex-layout.row#spaceFooter",
      "flex-layout.row#footer-1-desktop"
    ]
  },
}
```
### Configuration

| Prop name                                 | Type       | Description                                        | Default value |
| ----------------------------------------- | ---------- | -------------------------------------------------- | ------------- |
| `title`                                   | `string`   | Title of popup                                     | `''`          |
| `imageTrigger`                            | `boolean`  | Allow to use or not side image in popup            | `false`       |
| `textButton`                              | `string`   | Button text that allow to accept subscription      | `''`          |
| `namePlaceholder`                         | `string`   | Set Placeholder input name                         | `{}`          |
| `surnamePlaceholder`                      | `string`   | Set Placeholder input surname                      | `false`       |
| `emailPlaceholder`                        | `string`   | Set Placeholder input email                        | `""`          |
| `nameLabel`                               | `string`   | Set label on input name                            | `""`          |
| `surnameLabel`                            | `string`   | Set label on input surname                         | `""`          |
| `emailLabel`                              | `string`   | Set label on input email                           | `""`          |
| `name`                                    | `boolean`  | Set name input on/off                              | `''`          |
| `surname`                                 | `boolean`  | Set surname input on/off                           | `''`          |
| `labelCheck`                              | `string`   | Set Checkbox text                                  | `''`          |
| `alreadyRegisteredForNewsletterUserLabel` | `string`   | text for who is already regeistered                | `{}`          |
| `alreadyRegisteredUserLabel`              | `string`   | text Label for who is already regeistered          | `false`       |
| `successLabel`                            | `string`   | text for success subscription                      | `""`          |
| `promoActive`                             | `boolean`  | Set promotion text on/off (in PLWH for example)    | `""`          |
| `promotionText`                           | `[string]` | Set promotion text multiline                       | `""`          |
| `privacyPolicyText`                       | `[string]` | Set pvacy text multiline allow  tag HTML like HREF | `""`          |


### In which accounts the application is installed

- itwhirlpool 
- frwhirlpool 
- plwhirlpool
- hpuk
- hpit
- 
### css

container -> conatiner of popup
link -> link color, have to add class when set href in policy text
containerForm -> form container in popup
titleForm ->  shape of title in popup
descriptionForm -> shape of subtitle in popup
fieldContainer-> fileds of inputs
submitContainer-> container of submit button
informativa-> container of privacytext 
privacy-> shape of privacytext
colorEdb112-> button color
successClass-> shape of content if action have success
errorClass-> shape of content if error message
loaderForm-> shape of loading
containerFormLeft-> if needed image this split container in 50% (not used)
containerFormRight-> if needed image this split container in 50% (used)
containerNoImage-> when choose to dont set image this substitute containerFormRight
invalidInput-> shape of error input text
input-> shape of input boxes

## How to use it

- Uninstall the account.newsletter-popup-custom@x.x in the working account.
- Install the whirlpoolemea.newsletter-popup-custom@x.x in the desired account.
- Insert whirlpoolemea.newsletter-popup-custom@x.x as peer dependency.
- remember to try and check CSS of country because could be different and needed to fix
