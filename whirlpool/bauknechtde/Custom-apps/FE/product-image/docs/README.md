# Product-image
Is useful if:
- You need to show image in a PDP or PLP by an external link in site editor
<br></br>

### The app accepts optional props only from the Theme
### Examples of use
- Without optional props
```json
"flex-layout.col#pdpStickyImageProdottoImage": {
    "props": {
      "blockClass": "stickyImageContainer"
    },
    "children": ["product-image#sticky"]
},
"product-image#sticky": {
    "props": {
      "blockClass": "sticky"
    }
},
```
- With optional props
```json
"flex-layout.col#pdpStickyImageProdottoImage": {
    "props": {
      "blockClass": "stickyImageContainer"
    },
    "children": ["product-image#sticky"]
},
"product-image#sticky": {
    "props": {
      "blockClass": "sticky",
      //optional props:
      "isConditionalFetch": true,
      "conditionalBreakpoint": 600,
      "width": 120,
      "height": 120,
      "loading": "lazy",
      "fetchpriority": "low"
    }
},
```
<br></br>

### Configuration

| Prop name | Type | Description | Default |
| ----------- | ----------- | ----------- | ----------- |
| `isConditionalFetch` | `boolean` | Set if at a given max width breakpoint the image should not be downloaded | `false` |
| `conditionalBreakpoint` | `string` or `number` | Set max width viewport breakpoint value at which image should not be downloaded | `1100` |
| `width` | `string` or `number` | Set width value of image in URL's src attribute | `800` |
| `height` | `string` or `number` | Set height value of image in URL's src attribute | `auto` |
| `loading` | `string` | Set value of loading attribute between eager and lazy | `eager` |
| `fetchpriority` | `string` | Set value of fetchpriority attribute between high, low and auto | `auto` |

<br></br>
