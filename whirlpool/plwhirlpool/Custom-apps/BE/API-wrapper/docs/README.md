# API Wrapper
The API wrapper an application used for 2 main purposes: 
- Allow public access to VTEX private APIs (accessible only with API key and token) when needed
- Add utility methods for variuos functionalities. 

## Installation
It is possible to install in your store by using the VTEX IO Toolbelt. <br>
[Install](https://vtex.io/docs/recipes/development/installing-an-app/) the `plwhirlpool.api-wrapper` app.<br>
You can confirm that the app has now been installed by running `vtex ls` again. 

## Exposed Services
The application exposes the following APIs.
In order to find the correct API path, please search the apiName in the `node/service.json` file


| Group       | Method | Api Name               | Description                                                                                                        |
|-------------|--------|------------------------|--------------------------------------------------------------------------------------------------------------------|
| Wrapped API | GET    | getsku                 | Wrapper of the `api/catalog_system/sku/stockkeepingunitbyid/:id` API                                               |
| Utility     | GET    | getorder               | Returnes the billing address of a specified order                                                                  |
| Wrapped API | GET    | getproductspec         | Wrapper of the `/api/catalog_system/pvt/products/:productid/specification` API                                     |
| Wrapped API | GET    | productbyrefid         | Wrapper of the `/api/catalog_system/pvt/products/productgetbyrefid/:refid` API                                     |
| Wrapped API | GET    | getcategory            | Wrapper of the `/api/catalog/pvt/category/:categoryid` API                                                         |
| Utility     | GET    | newsletteroptin        | Sets the isNewsletterOptIn value to true for the currently logged-in user                                          |
| Utility     | GET    | userinfo               | Returns the information of the currently logged user retrieved from the CL                                         |
| Utility     | GET    | userinfobyemail        | Returns the information of the user tied to the email passed as query parameter                                    |
| Utility     | GET    | hasorders              | returns true if the current user has made purchases                                                                |
| Utility     | GET    | userorders             | returns the last order made by the customer logged in                                                              |
| Utility     | GET    | productcategory        | Calls `/api/catalog_system/pvt/products/productgetbyrefid/:refid`; returns the categoryId of that product          |
| Utility     | POST   | user                   | Creates a new CL entity for the user passed as parameter                                                           |
| Utility     | PATCH  | user                   | Updates the CL entity for the currently logged-in user with the request body                                       |
| Wrapped API | GET    | getbrands              | Wrapper of the `/api/catalog_system/pvt/brand/list` API                                                            |
| Wrapped API | GET    | getspecvalues          | Wrapper of the `/api/catalog_system/pub/specification/fieldGet/:specId` API                                        |
| Utility     | GET    | getpromotions          | returns the VTEX promotions, with just start, end date and status                                                  |
| Utility     | GET    | GetPromoBySkuId        | returns the first promotion valid for a passed SKU                                                                      |
| Utility     | GET    | getInvoice             | Allows the download of the invoice if the order associated belongds to the logged-in user                          |
| Utility     | GET    | getInvoices            | Returns the invoices for the user's orders                                                                         |
| Utility     | GET    | GetCouponBySkuId       | Returns the coupons that can be used for a specific skuId                                                          |
| Wrapped API | GET    | GetCategoryTree        | Wrapper of the `/api/catalog_system/pub/category/tree/` API                                                        |
| Utility     | GET    | isServedZipCode        | Receives a skuId and a zipCode. Returns true if the item can be installed in that zipcode                          |
| Utility     | POST   | signUpForBlackFriday   | Inserts the customer in the CL entity (if not present) with the campaignId of the black friday                     |
| Utility     | GET    | additionalServicesInfo | Retrieves and returns the additional services info for the category passed as parameter                            |
| Utility     | GET    | orderHasFgas           | Returns true if one of the items in the order passed via parameter has the fgas specification set to true          |
| Utility     | GET    | recipesList            | ![https://img.shields.io/badge/-Deprecated-red](https://img.shields.io/badge/-Deprecated-red)  Returns the recipes. <br> With Emea Template the recipes are managed on Sandwatch |
| Utility     | GET    | recipeDetail            | ![https://img.shields.io/badge/-Deprecated-red](https://img.shields.io/badge/-Deprecated-red)  Returns the recipe details <br> With Emea Template the recipes are managed on Sandwatch |
| Utility     | GET    | getHotnCold            | Used to retrieve the userType for the GA4 FUNREQs  FUNREQ06 + FUNREQ27 + WHR01 + WHR02 + IN01 + IN02 + HP05 + FUNREQ66 and FUNREQ06 + FUNREQ27 + WHR01 + WHR02 + IN01 + IN02 + HP05 + FUNREQ66 |



### GetOrder
The getOrder API is used to see an order billing address even when not logged in. 
It receives the following parameters: 

| Name | type |Description | 
|-|-|- |
| email | query param | email of the customer who made the order|
| orderId | route param | Id of the order |

If the email of the customer placing the order is the same passed as parameter, the the application will return the billing data contained in the customApp fiscaldata.

### Create User
The createUser API is used to insert a new customer into the CL entity. <br>
It provides validation, if the filed in present, to the campaign field: its length should be <= 30 characters. 

The API expects to receive in the body exactly the parameters that would be sent to the master data entity creation OOTB API.  
In fact, it acts as a validation wrapper aound that API. 

### GetPromoBySkuId

The API expects to receive the  parameters: 

| Name | type |Description | 
|-|-|- |
| skuId | query param | id of the SKU to search promotions for |

With such information, calls the OOTB API in order to determine that that SKU is sellable and available. 
After that, all promotions are retrieved and avaluated to understand if the specified SKU is eligible for that promotion. 

At the first eligible promotion found, the code stops and returns a json object containing: 
- the name of the promotion
- startDate of the promotion
- endDate of the promotion

### GetCouponBySkuId 
The code runs exactly as the `GetPromoBySkuId` function but, when finds a promotion, uses its UTM code in order to search for the coupons that grant that promotion. <br>
The function returns a json object with the coupon code as the single return field value.  

### IsServedZipCode 
The API expects to receive the  parameters: 

| Name | type |Description | 
|-------|-------------|------------------------------------------------------ |
| skuId | query param | id of the SKU to check installation for               |
| zip   | query param | Zip code where the customer selected the installation |

With the skuId, sku details are fetched the the following checks are done: 
- The product is not built-in
- The sku does not support installation as an additional service
- The zipCode is present in the ranges in the ZI masterdata entity. 

If any of the previous points is true, then the API response is positive (the zip code supports installation for that product or the product does not support installation). 

**NOTE** the installation is hardcoded to be the service type with ID = 1

### Get Additional Services Info
This API returns the additional services stored in the SA entity. <br>
It is used whenever the country needs to have Strikethrough prices in the PDP or in the cart for additional services. 

## Master Data Entity Used 
- **CL**, for customer data
- **LC**, for logging
- **IN**, for invoices
- **ZI**, for zipCode installation rules
- **SA**, for additioanl service info
- **RI**, for recipes infromation


## Configuration
The application has the following configuration parameters: 

| Parameter  | Type   | Description                                                                         |
|------------|--------|-------------------------------------------------------------------------------------|
| authcookie | string | The name of the autentication cookie to get info about the currently logged in user |
