# Alma payment

This application handles the display of the Alma widget, which shows the available payment plans.

![alma-widget](https://images2.imgbox.com/3d/4a/NtVwF1Px_o.png)

---
<br>

## ⚙️ Configuration 

1. Install the app in the account `vtex install` and add to your theme's dependencies in the `manifest.json`. For example:

```json
"dependencies": {
    "frwhirlpool.alma-payment": "0.x",
  }
```

2. Add the `alma` block to a store template and inside a block of your choise. For example:

```json
"flex-layout.col#alma": {
    "children": ["alma"]
  },
```

> Alma block **doesn't support** any children or props by now, so you don't have to declare it.

---
<br>

## 🧩 Interfaces

Here is the full list of **interfaces** exported by this app:

| Block name | Decription |
| ---------- | ---------- |
|  [ `alma` ](/frwhirlpool.alma-payment@0.x/Alma)| Renders the block responsible for displaying information provided by Alma. |
| ['pixel.alma'](/frwhirlpool.alma-payment@0.x/Pixel) | Import the alma script and CSS file, which includes the widget SDK ( `alma.Widgets` ) used in the React section. |

---
<br>

## 🔒API Endpoints Configuration

This app doesn't contain any enpoint.

### API Endpoints props

### API Endpoints bodys

---
<br>

## 🎨 Customization

This app doesn't use any CSS handles.

| CSS Handles                             |
| --------------------------------------- |
| <code>CSS handles</code>          |

---
<br>

## 🔗 Useful links

Alma doc: https://docs.almapay.com/docs/custom-integration-alma-widget
