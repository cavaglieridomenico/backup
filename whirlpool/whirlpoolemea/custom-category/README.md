# Custom category

This application allows you to show on screen the category section that is present in the homepage of UK CC website.

[![Immagine-2023-06-07-124643.png](https://i.postimg.cc/W42mv89X/Immagine-2023-06-07-124643.png)](https://postimg.cc/YvsLN6BW)

<br>

## ⚙️ Configuration 

1. Install the app in the account `vtex install` and add to your theme's dependencies in the `manifest.json`. For example:

```json
"dependencies": {
    "whirlpoolemea.custom-category": "0.x",
  }
```

2. Add the `custom-category` block to a store template and inside a block of your choise. For example:

```json
"custom-category#categories": {
    "props": {
      "isArticles": false,
      "categories": [
        {
          "categoryName": "Washing machine",
          "categoryLink": "#",
          "imageLink": "https://images.unsplash.com/photo-1610128361323-6e941c97f023?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=389&q=80"
        },
      ]
    }
  },
  ```

  > The application supports the **isArticle** prop that shows the display differently. If it is **true** the lock will be displayed as article, if it is **false** it will display as the category shown on the screen in the homepage.

  > For the purpose of the development of showing categories, the part relating to visulization as an article has not been deepened.

  <br>

## 🧩 Interfaces

Here is the full list of **interfaces** exported by this app:

| Block name | Decription |
| ---------- | ---------- |
|  [ `custom-category` ](/whirlpoolemea.custom-category@0.x/CustomCategory)| Renders the block responsible for displaying information about category section |

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
