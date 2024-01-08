# Back in stock email trigger
The back-in-stock email trigger is an application used to trigger the back in stock email. 

## Installation
It is possible to install in your store by using the VTEX IO Toolbelt.
[Install](https://vtex.io/docs/recipes/development/installing-an-app/) the `plwhirlpool.back-in-stock-email-trigger` app. You can confirm that the app has now been installed by running `vtex ls` again. 


## Exposed Services
- **POST: /app/catalog/pvt/stockkeepingunit/back-in-stock**: creates a new internal route for an unsellable or discontinued product

### Authentication
All the services exposed by this application are protected using the VTEX api tokens. 

|  Name | Description |
|-|-|
| X-VTEX-API-AppKey | api key of the account |
| X-VTEX-API-AppToken | api token of the account |

 ⚠️ **NOTE** ⚠️: <br> the API key and tokens are currently hardcoded into the application, so it's recommended to update this application in order to have those parameters (possibibly encoded) into the app settigns


### Back In Stock

Body Fields: 
|  Name | Description |
|-|-|
| refId | Reference Id of the item went back in stock |

With such information, 
- The Sku details are retrieved
- The *Availability Subscriber* entity is searched. 

Each entry of the *Availability Subscriber* is updated with: 
- *notificationSend* : true
- *productImageUrl*: main image of the product
- *productUrl* link to the product URL
- *sendAt*: current timestamp
- *skuRefId* : sku reference id


## Master Data entities and triggers
This application uses the OOTB AS (Availability Ssubscriber) entity. 

### Triggers
When the AS entity gets updated with "NotificationSend = true", then the **back-in-stock-notification** email template is sent.

## Configuration
This application does not have any configuration