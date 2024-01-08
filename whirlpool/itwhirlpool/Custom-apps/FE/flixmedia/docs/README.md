📢 Use this project, [contribute](https://github.com/vtex-apps/flixmedia) to it or open issues to help evolve it using [Store Discussion](https://github.com/vtex-apps/store-discussion).

# Flixmedia

Flixmedia first party integration app. The [solution](https://flixmedia.eu/) enhances your website content, capturing retail partners, engaging shoppers, and increasing sale rates.

## Configuration

### Step 1 - Installing the Flixmedia app

#### Using VTEX App Store 

1. Access the Apps section in your account's admin page.
2. Look for the Flixmedia app.
3. Click on the `Install` button.

#### Using VTEX IO Toolbelt

In your terminal, log into your VTEX account and [install](https://vtex.io/docs/recipes/development/installing-an-app/) the `vtex.flixmedia@0.x` app.

> ℹ️ *You can confirm if the app has been properly installed by running `vtex ls`.*

### Step 2 - Defining the app settings

1. Access the Flixmedia app in your admin's Apps section.
2. Fill out the fields according to your Flixmedia data.
3. Save your changes.

![flixmedia-gif](https://user-images.githubusercontent.com/52087100/101814695-41cca680-3afd-11eb-975e-5db39d825f98.gif)

### Step 3 - Updating your store theme 

1. Add the Flixmedia app to your theme's dependencies in the `manifest.json` file:

```diff
 dependencies: {
+  "vtex.flixmedia": "0.x"
 }
```

2. Declare the `product-details.flixmedia` block in the `store.product`'s children list, as shown below:

```json
"store.product": {
  "children": [
    "product-description.flixmedia",
  ]
}
```

3. [Deploy your changes](https://vtex.io/docs/recipes/store-management/making-your-theme-content-public/).

## Customization

No CSS Handles are available yet for the app customization.

## Contributors ✨

Thanks goes to these wonderful people:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!

<!-- DOCS-IGNORE:end -->
