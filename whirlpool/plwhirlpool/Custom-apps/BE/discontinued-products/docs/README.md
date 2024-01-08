# Discontinued Products

The discontinued products application is the application that manages the BackEnd integration for **unsellable** and **discontinued** products routes. 

## Installation
It is possible to install in your store by using the VTEX IO Toolbelt.
[Install](https://vtex.io/docs/recipes/development/installing-an-app/) the `plwhirlpool.discontinued-products` app. You can confirm that the app has now been installed by running `vtex ls` again. 


## Exposed Services
- **POST: /_v/api/product/redirect**: creates a new internal route for an unsellable or discontinued product
- **POST: /_v/api/product/redirect/full**: uses the catalog APIs in order to create internals for all unsellable or discontinued products and removes the internal (if present) for non discontinued ones. 

### Authentication
All the services exposed by this application are protected using the VTEX api tokens. 

|  Name | Description |
|-|-|
| X-VTEX-API-AppKey | api key of the account |
| X-VTEX-API-AppToken | api token of the account |

**NOTE** : the API key and tokens are currently hardcoded into the application, so it's recommended to update this application in order to have those parameters (possibibly encoded) into the app settigns


### Create Redirects
This interface receives as body an array containing the redirects. 
Each redirect has the following fields: 

|  Name | Type |Description |
|-|-|-|
| type | string | the type of the redirect. currently supports: <br> -discontinued <br>-unsellable |
|  createRedirect | string or boolean | true, if the redirect needs to be created |
|  productId |string | VTEX internal identifier of the product|
|  productLink | string | Slug of the product (textLink) |

This API will create an internal route for each of the passed products to /discontinued and /unsellable, passing as query parameters the productId and the productLink

### Full Reload
This function will load all the catalog product by product and for each one will get its specifications. 
- if the product has the _isDiscontinued_ specification, a new route to _/discontinued_ will be created
- if the product has the _sellable_ specification equals to _false_, a new route to _/unsellable_ will be created
- otherwise, all internal routes for that product will be deleted.


## Configuration
This application does not have any configuration