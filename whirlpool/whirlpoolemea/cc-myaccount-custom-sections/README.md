# cc-myaccount-custom-sections@1.x
Is useful if:
- You need to have custom sections in MyAccount

## **Examples of use**

```json
//plugins.json
{
  // Here you can insert the custom page
  "my-account-pages > my-account-page": [
    "my-account-page.wishlist-page",
    "invoice-page",
    "ff-page"
  ],
  // Here you can insert the MyAccount menu link that points to the custom pages 
  "my-account-menu > my-account-link": [
    "my-account-link.wishlist-link",
    "invoice-link",
    "ff-link",
    "logout-link"
  ]
}
```

 > You can choose to fill the section directly from the custom app or from theme 

<br>

## **Admin Props**

| Prop name                     | Type                                                      | Description| Default value |
| ----------------------------- | --------------------------------------------------------- |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `EPP_bindingId`                  | `string`       | EPP binding ID                                    | `''`        |
| `FF_bindingId`             | `string`       |FF binding ID                   | `''`        |
| `VIP_bindingId`                 | `string`       | VIP binding ID                                            | `''`        |
| `ProfileSectionUrl`       | `string`       | Define the Profile section Url                                                               | `/profile`        |
| `FnFSectionUrl`                      | `string`      | Define the Family and Friends section Url            | `/friends`        |
| `InvoiceSectionUrl`              | `string`       | Define the Invoice section Url                                 | `/invoices`        |
| `hasGA4`              | `boolean`       | Define if the project contains GA4                                | `false`        |


## **In which accounts the application is installed**

- ukccwhirlpool
- itccwhirlpool

## **CSS Customization [styles.css]**

Use the custom classes defined in the app.


## **How to use it**

- Uninstall the account.myaccount-custom-sections@x.x in the working account.
- Install the whirlpoolemea.myaccount-custom-sections@x.x in the desired account.
- Insert whirlpoolemea.myaccount-custom-sections@x.x as peer dependency.
- Import the CSS from ukccwhirlpool or itccwhirlpool theme.
- Adapt the CSS.
