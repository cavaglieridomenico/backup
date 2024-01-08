# Coupon Generator
The coupon generator application is an utility used by the business to massively create coupons to distribute to customers. 

## Installation

It is possible to install in your store by using the VTEX IO Toolbelt.
[Install](https://vtex.io/docs/recipes/development/installing-an-app/) the `plwhirlpool.coupon-generator` app. You can confirm that the app has now been installed by running `vtex ls` again. 

## Services exposed
- **GET /v1/coupon/:fileid/coupons.csv** : downloads an export of the currently active coupons

### Generate Coupons
The generate coupon API requires a request body with the following fields: 

| field | type | description |
|-|-|-|
| utmSource | string | utm source of the promotion that the coupon will be attached to |
|utmCampaign | string | utm campaign of the promotion that the coupon will be attached to |
| quantity | number | number of coupons to generate |
| email | string | If present, a report of the generated coupons will be sent to this email |
| couponCode | string | couponCode to be used in the coupon creation in VTEX |

Upon receiving the call, this endpoint will use the [VTEX coupon API](https://developers.vtex.com/docs/api-reference/promotions-and-taxes-api#post-/api/rnb/pvt/coupon/) in order to create the requested number of coupons. 

After this activity is finished, if the email value is present in the request body, an eMail is sent to the business user with the created coupon list. 

### CG Entity and Triggers

The Generated Coupons (CG) entity is used to save data about the generated coupons and send such data via email to the business user. 

| field | description |
|-|-|
| email | email address to send the generated coupon list to |
| subject | subject of the email |
| file | field where the file will be uploaded |

On such entity there is an _update action trigger_ which send an email whith the file document as the attachment. 
*NOTE*: the trigger only fires if the file is not empty

## Admin UI Exposed
In order to use the API, an Admin front-end was developed.
It has a simple form with:
- A dropdown with the list of promotions. By selecting one, the input fields for utmSource and utmCampaign will be automatically selected. 
- Input fields for quantity, email and couponCode. Such inputs can be freely inserted by the business user. 
- A submit button, to call the API and create the coupons


## Configurations
This application does not require any configuration