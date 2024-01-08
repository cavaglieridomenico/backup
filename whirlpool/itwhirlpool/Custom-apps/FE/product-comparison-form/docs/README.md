# PRODUCT COMPARISON FORM

This custom app render a form in the Product Comparison Page (*/product-comparison*), by subscribing to the form, the user will receive an email with the product comparison displayed on the product comparison page as a PDF. As like other forms user has also the possibility to subscribe to newsletter (this is optional) flagging the related checkbox in the form (for sure in this case all checks needed for the newsletter subscribtion are made).

The custom app takes the name of **"product-comparison-form"**.

## Configuration 

In order to configure it correctly you have to do these steps:

  1. Install the VTEX Product Comparison app in your workspace --> **vtex install vtex.product-comparison@0.x**
  2. Add the product comparison form dependency in the Store Theme *manifest.json* --> **{vendor}.product-comparison-form@0.x**
  3. Add the block related to the form in *product-comparison.jsonc* to see it in the product comparison page --> **"comparison-form"**

After these steps you will be able to link or install correctly both the Theme and the Product Comparison Form custom app.

The *vtex.product-comparison* custom app is very important to let product comparison form app works correctly as in these app we use for example the ProductComparison Context provided directly from VTEX. 

Another thing is that installing VTEX Product Comparison you can limit the number of comparable products, this is quite important as the default value is 10 but a PDF with 10 products comparable will not be readable, for this reason we suggest set this limit to 4. To do this:
  1. Go into the Admin section
  2. Apps section (specifically installed ones)
  3. Search for *"Product Comparison* 
  4. Click on settings and change the bucket size

## Customization

To customize the form you can simply use *Tachyons* on form components or you can edit the CSS file present in the Store Theme.

Going into the Store Theme folder under *styles/css* folder you will find the css file: **{vendor}.product-comparison-form.css**, there you can customize the style.

## Documentation

If you want to check more detail regarding the VTEX Product Comparison or other things mentioned in this doc you can check here:
  - [Product Comparison](https://developers.vtex.com/vtex-developer-docs/docs/vtex-product-comparison)
  - [Tachyons](https://tachyons.io/docs/)

