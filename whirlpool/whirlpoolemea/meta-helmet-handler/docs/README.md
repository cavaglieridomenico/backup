# Meta Helmet Handler

This application handles the embedding of custom meta tag into the website by using Helmet.

---

<br>

## ⚙️ Configuration

1. Install the app in the account `vtex install` and add to your theme's dependencies in the `manifest.json`. For example:

```json
"peerDependencies": {
    "whirlpoolemea.meta-helmet-handler": "0.x",
  }
```

2. Add the `custom-meta-helmet` block to a store template. For example:

```json
"store.custom#meta-helmet-test": {
    "blocks": [ "custom-meta-helmet#no-index", "flex-layout.row#foo", "flex-layout.row#bar"]
  },
```

3. Define the props to pass to the component. For example:

```json
"custom-meta-helmet#no-index": {
    "title": "Meta Tags handler",
    "props": {
      "metaTags": [{
        "isActive": true,
        "name": "robots",
        "content": "noindex"
      }]
    }
  },
```

---

<br>

## 🧩 Interfaces

Here is the full list of **interfaces** exported by this app:

| Block name                                                                       | Decription                                            |
| -------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [`custom-meta-helmet`](/docs/whirlpoolemea.meta-helmet-handler/CustomMetaHelmet) | Inject the meta tags saved inside the CMS site-editor |

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

| CSS Handles              |
| ------------------------ |
| <code>CSS handles</code> |

---

<br>

## 🔗 Useful links

VTEX Helmet documentation: https://github.com/vtex-apps/render-runtime

React Helmet doc: https://www.npmjs.com/package/react-helmet
