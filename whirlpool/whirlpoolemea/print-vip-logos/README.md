# print-vip-logos@0.x
### Examples of use

```json
"print-vip-logos": {
    "children": [
      "rich-text"
    ]
  },

```or
"print-vip-logos#exp2": {
    "children": [],
    "props": {
      "blockClass": "blockClass"
    }
  },

```

### Configuration 

| Prop name             | Type  | Description                                                                          | Default value |
| ----------------------| ----- | -------------------------------------------------------------------------------------| ------------- |
| `children`            | `any` | Allows to pass a  component that will be rendered as a children                      | `null`          |

### In which accounts the application is installed 
- UKCC

### CSS Customization [CSS HANDLES]

```--container``` class to change the container of the image printed

`--vipImage` class to change the image style

## How to use it

- Uninstall the account.print-vip-logos@x.x in the working account.
- Install the whirlpoolemea.print-vip-logos@x.x in the desired account.
- Insert whirlpoolemea.print-vip-logos@x.x as peer dependency.
- Adapt the CSS from the theme
