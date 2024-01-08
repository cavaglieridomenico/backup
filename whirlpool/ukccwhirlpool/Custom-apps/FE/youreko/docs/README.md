# Youreko

This application is a pixel app responsible for managing the injection of the Youreko script into the website.

![youreko](https://thumbs2.imgbox.com/0c/9e/nigDunGg_t.png)

---
<br>

## ⚙️ Configuration 

1. You only need to install the app in the account `vtex install` since it's a pixel app.

> To function properly, the script requires a custom block with a **specific ID** (e.g. `youreko-placeholder` ) where the badge will be injected. The ID can be coordinated with the Youreko team (contact reference: patrick.verdon@youreko.com).

2. To inject the correct script into the website, you need to have a script src link provided by the Youreko team. For example: 

```js
// head.html

s.src = "https://static.youreko.com/js/partners/...."
```

3. Additionally, there is a specific script that needs to be injected exclusively on the Thank you page.

> ⚠️ You have to inject a script for <u>each product</u> 

```js
`https://static.youreko.com/js/partners/.../.../youreko.energy-review.account.all.min.js?action=purchase&productType=${categoryLink}&manufacturer=AEG&model=${commercialCode}&price=${producPrice}`
```

Here is the list of variables that you need to pass to the script:
| Variable name | Description |
|--------------|--------------|
| `categoryLink` | Link of the product category |
| `commercialCode` | Commercial code of the product |
| `producPrice` | Product price |
---
<br>

## 🧩 Interfaces

No interfaces are needed.

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

Thank You Page doc link: [Doc](./Youreko_Installation_-_www.privilegepurchaseclub.co.uk.pdf)
