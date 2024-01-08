# invitation-condition-layout 0.x

### Examples of use
```json

"invitation-condition-layout": {
    "props": {
      "propertyToCheck": "ex",
      "Then": "rich-text#ex",
      "Else": "rich-text#ex2"
    }
  },

```
### Configuration 

| Prop name             | Type     | Description                                                                          | Default value |
| ----------------------| -----    | -------------------------------------------------------------------------------------| ------------- |
| "propertyToCheck"     | `string` | This is the property that will be checked                                            | `invitations` |
| "valueToCheck"        | `string` | This is the property's value that will be checked                                    | `true`        |
| "Then"                | `any`    | If the property and Then exist, print Them                                           | `null`        |
| "Else"                | `any`    | If the property doesn't exist but Else does, print Else                              | `null`        |


### In which accounts the application is installed 
- UKCC
- ITCC

### CSS Customization [CSS HANDLES]

```--wrapper`` first container of the layout
