# Product Comparison Form

This application render a form (placed in the Store Theme product comparison page) that allows you to subscribe to a service that will send you an email with a PDF attached that shows the compared products summary.

![product-comparison-form](https://images2.imgbox.com/2d/ea/nYzCFdCa_o.png)

<br>

## ⚙️ Configuration

1. Install the app in the account `vtex install` and add to your theme's dependencies in the `manifest.json`. For example:

```json
  "peerDependencies": {
    "whirlpoolemea.product-comparison-form": "0.x"
  }
```

2. Add the `comparison-form` block to a store template and inside a block of your choice in the comparison page. For example:

```json
{
  "slider-layout-group#comparison-page": {
    "children": [
      // HERE FOR EXAMPLE
      "comparison-form",
      "product-comparison-block.product-summary-row",
      "product-comparison-block.grouped-product-specifications"
    ]
  }
}
```

> The `comparison-form` block **support** many props that you can declare directly from Store Theme or change them from Admin CMS SiteEditor section (see [comparison-form](/whirlpoolemea.product-comparison-form@0.x/ComparisonForm))

## 🧩 Interfaces

Here is the full list of **interfaces** exported by this app:

| Block name                                                                          | Decription                                                            |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| [ `comparison-form` ](/whirlpoolemea.product-comparison-form@0.x/ComparisonForm.md) | Renders the block responsible for displaying product comparison form. |

## 🔒API Endpoints Configuration

You can change the API endpoints and body keys used in the Product Comparison Form directly from **VTEX AppSettings Admin** section:

1. Go to VTEX admin --> _vendor.myvtex.com/admin/apps/whirlpoolemea.product-comparison-form@0.x/setup/_
2. Change endpoint and body keys of desired API calls
3. Click on _SAVE_ button

### API Endpoints props

Below the full list of available props for the API endpoints:

| Prop name            | Type     | Method | Description                                                    | Default value                                  |
| -------------------- | -------- | ------ | -------------------------------------------------------------- | ---------------------------------------------- |
| `sessionApi`         | `string` | GET    | Get user session info (like if it's logged in)                 | `"/api/sessions?items=*"`                      |
| `userInfoApi`        | `string` | GET    | Get user info by email                                         | `"/_v/wrapper/api/user/email/userinfo?email="` |
| `postUserApi`        | `string` | POST   | Subscribe user to newsletter                                   | `"/_v/wrapper/api/user?userId=true"`           |
| `newsletteroptinApi` | `string` | PATCH  | Set isNewsletterOptin to true to already existing VTEX account | `"/_v/wrapper/api/user/newsletteroptin"`       |

### API Endpoints bodys

<code>postUserApi</code> body:

```javascript
{
  email: form.email,
  firstName: form.name,
  lastName: form.surname,
  isNewsletterOptIn: true,
  campaign: targetCampaign
}
```

<code>newsletteroptinApi</code> body:

```javascript
{
  isNewsletterOptIn: true
}
```

## 🔗 Useful links

Vtex Product Comparison doc: https://developers.vtex.com/docs/guides/vtex-product-comparison

## ⚠️ Warnings

Keep in mind to update the version on <code>appInfos</code> const inside the _./react/utils/utils.ts_ file when you release an update of this version that improve its major, for example when version change from **0.x** to **1.x** and so on.  
Otherwise the AppSettings will not be retrieved correctly, this because as you can see they are putted like this:

```typescript
export const appInfos = {
  vendor: 'whirlpoolemea',
  appName: 'product-comparison-form',
  version: '0.x', //As you can see increasing major this will not work anymore
}
```
