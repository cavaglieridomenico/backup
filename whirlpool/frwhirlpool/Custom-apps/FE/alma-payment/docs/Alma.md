[⬅️ Back](./README.md)

# `"alma"` (interface)

This app interface goes inside the theme, in a part where the product context (PDP or PLP) is present.

    

---
<br>

## ⚙️ Configuration 

For proper functionality, the app requires a **merchant ID** that should replace the currently entered one.

> ⚠️ <u>The merchant id is unique for each alma account</u>

    

```js
    //Alma.tsx
    const widgets = alma?.Widgets.initialize(
        "xxxxxxxxxxxxxxxxxx", // merchant id
        alma.ApiMode.LIVE
    );
```

---
<br>

## ⚒️ Props:

This app doesn't contain any props.

| Prop name | Type | Description | Default value |
| --------- | ---- | ----------- | ------------- |
| `prop name` | `type` | description | `""` |

---
