# catalog export
This application is used by the business to download a report of the catalog, with the format requested by the business. 

## Installation
It is possible to install in your store by using the VTEX IO Toolbelt.
[Install](https://vtex.io/docs/recipes/development/installing-an-app/) the `plwhirlpool.catalog-export` app.
You can confirm that the app has now been installed by running `vtex ls` again. 

## Exposed Services
- **GET /catalog/export**: allows the business customer to download the catalog CSV.

###  Catalog Export
The catalog exports reads: 
- The entire catalog of SKUs
- The sales channels information
- The promotions

with such informations a table with all the information per SKU is built. 


## MasterData entities and triggers
This application does not use any master data entity or trigger. 


## Configuration
This application does not have any configuration


## Catalog Export CSV Fields

The report is constructed so that there is <u>a line for each line of each order </u>

|Field Name| Description|
|-|-|
|Sku Id| VTEX internal id of the SKU. |
|Product Id| VTEX internal id of the product |
|12nc| 12 characters product identifier. |
|Commercial code| Commercial code of the product |
|Description| Product Description |
|Category| Category of the product |
|Brand| brand of the product |
|Construction type| Product's construction type. Can be Built-in or freestanding |
|Visibile| True, if the product is active. <br> False otherwise |
|Discontinued| True, if the product is discontinued. <br> False otherwise |
| <sales_channel> - Sellable | Sellability for trade policy*  |
| <sales_channel> - List price | **listPrice** field of the FixedPrice defined for the salesChannel |
| <sales_channel> - Sale price | **Value field** of the FixedPrice defined for the salesChannel  |
| <sales_channel> - Market price | **commertialOffer.Price** specified by the getProductDetails API call |
|Stock| Total qauntity - reserved quantity |
|Minimum quantity threshold| Minimum quantity threshold specification of the product |
|Available| Yes, if Stock > Minimum quantity threshold; <br> false otherwise |
|Active promo| Name of the first promotion applicable to the SKU|
| Promo begin date | Start date of the first promotion applicable to the SKU |
| Promo end date | End date of the first promotion applicable to the SKU |
|Energy label| Value of the energy label specification |
|Score| Catalog score of the product |
|Gifts| List of skus, separated by comma, of the accessories gifted buying the SKU |
|MDA Cross-sell| List of cross sell products (SKU complement type 1) |
|MDA Up-sell| List of upsell products (SKU complement type 2) |
|WPRO Cross-sell| List of cross-sell accessories  (SKU complement type 3) |
|Product url| Link to the product PDP |
| <Service Name> - <Serfice Price>| List of the services that the SKU can have and price of the service for that SKU. |


\* The mapping between the sellability per salesChannel and the sellability specification is done manually in the constants file