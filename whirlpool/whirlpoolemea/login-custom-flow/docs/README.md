# Login-custom-flow

  Is a login page, usually you can find at path: {workspace}/login

### Examples of use
```json
"store.login": {
    "parent": {
      "footer": "footer#login"
    },
    "blocks": ["login-content#default", "login-custom-flow"
    ]
  },
```
###  props

| Prop name | Type | Description | Default value |
| --------- | ---- | ----------- |-------------------------------------  | ------------- |
| `textButton`               | `string`   | Is used to set text for register button            | `''`          |
| `textNextStep`             | `string`   | Is used to set the title of register page          | `false`          |
| `promoActive`              | `boolean`  | Is used to set on/off the promotion                | `[{}]`          |
| `promotionText`            | `[string]` | Is used to set array of text about promotion       | `[{}]`          |
| `privacyPolicyText`        | `[string]` | Is used to set array of  text  about privacy 
                                            and policy to give consent, you could inject 
                                            html code it will be parsed                        | `''`          |
| `textAlreadyRegistered`    | `string`   | Is used to set text about already registered users | `''`          |
| `formNamePlaceholder`      | `string`   | Is used to set text in placeholder's name          | `''`          |
| `formSurnamePlaceholder`   | `string`   | Is used to set text for register button            | `''`      |
| `formMailPlaceholder`      | `string`   | Is used to set text for register button            | `''`      |
| `goBackToLogin`            | `string`   | Is used to set text for register button            | `''`      |
| `checkboxes`               | `[string]` | Is used to set text for register button            | `[{}]`      |


### In which accounts the application is installed

- ITWH


### CSS Customization [CSS HANDLES]

``` .formContainer``` class to change the container of the login interface

` .confirmButton` class to change the shape of register button

` .link` class to change the shape of vtex link component

` .privacy` class to change the shape of text used in "privacy and policy"

` .informativa` class used for change shape to link inside "privacy and policy"

` .infoContainer` class to change the container of registration interface

` .inputContainer` class to change padding to set comfy the inputs

` .registered` class to set text shape for registered users


## How to use it

- Uninstall the account.Login-custom-flow@x.x in the working account.
- Install the whirlpoolemea.Login-custom-flow@x.x in the desired account.
- Insert whirlpoolemea.Login-custom-flown@x.x as peer dependency.
- Import the CSS from hotpointuk theme.
