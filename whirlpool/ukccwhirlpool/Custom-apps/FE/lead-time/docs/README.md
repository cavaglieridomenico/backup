# Lead-time

Lo scopo di questa applicazione e di informare l'utete , con una stima sulla disponibilita' del prodotto in caso questo fosse out-of-stock, in caso contrario mostrare la disponibilita' del prodotto. 

![alma-widget](https://images2.imgbox.com/d5/58/hhBUnREQ_o.png)

---
<br>
 
## ⚙️ Configuration 

1. Install the app in the account `vtex install` and add to your theme's dependencies in the `manifest.json`. For example:

```json
"dependencies": {
    "ukccwhirlpool.lead-time": "0.x",
  }
```

2. Add the  block to a store template and inside a block of your choise. For example:

```json
"flex-layout.col#lead-time": {
    "children": ["lead-time"]
  },
```

> Lead-time block **doesn't support** any children.

---
<br>

## 🧩 Interfaces

Here is the full list of **interfaces** exported by this app:

| Block name | Decription |
| ---------- | ---------- |
|  [ `lead-time` ](/doc-apps/ukccwhirlpool.lead-time@0.x/Lead-time)| Renders the block responsible for displaying information provided by lead-time. |
|

---
<br>

## 🔒API Endpoints Configuration

This app doesn't contain any endpoint.

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
