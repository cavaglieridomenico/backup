# Worldpay connector
The worldPay connector is the application used to connect with the WorldPay payment gateway using the [Hosted Integration](https://developerengine.fisglobal.com/apis/wpg/hostedintegration)


**NOTE**: this connector was developed before the [payment provider starter app](https://github.com/vtex-apps/payment-provider-example) was officially released and it was never updated to use that framework. 

## Installation
It is possible to install in your store by using the VTEX IO Toolbelt.
[Install](https://vtex.io/docs/recipes/development/installing-an-app/) the `plwhirlpool.worldpay-connector` app. You can confirm that the app has now been installed by running `vtex ls` again. 

**NOTE**: Usually payment connectors don't need installation. 
In this case, connector specific configurations were modelled as appSettigs, an installation per account is mandatory. 

## Configurations
The application has the following configuration parameters: 

| Parameter        | Type    | Description                                                                                              |
|------------------|---------|----------------------------------------------------------------------------------------------------------|
| wpUrl            | string  | URL of the WorldPay API to call                                                                          |
| merchantCode     | string  | Merchant Identifier for the specific country                                                             |
| installationID   | String  | Installation ID, to be found in the worldpay administrative console                                      |
| wpusername       | String  | API Username, to be found in the worldpay administrative console                                         |
| wppassword       | String  | API Password, to be configured in the worldpay administrative console                                    |
| paymentAppName   | String  | Name of the app that needs to display the front-end. Should always be `plwhirlpool.worldpay-payment-app` |
| locale           | String  | Locale to use when loading the worldpay iframe                                                           |
| wpVersion        | String  | Worldpay API version to use                                                                              |
| gcpappkey        | String  | VETX X-API-key to be used by GCP to call VTEX                                                            |
| gcpapptoken      | String  | VETX X-API-token to be used by GCP to call VTEX. <br> This parameter is encoded with sha-256             |
| useXipay         | boolean | True, if the full sap integration is enabled in the country                                              |
| xipayUrl         | string  | URL of the XiPay create payment url. Required if useXipay is true                                        |
| xipayUsername    | string  | Username to use in the communication with XiPay. Required if useXipay is true                            |
| xipayPassword    | string  | Password to use in the communication with  XiPay. Required if useXipay is true                           |
| xipayMerchantid  | string  | MerchantId to use in the communication with  XiPay. Required if useXipay is true                         |
| sapmid           | string  | SAP MerchantId to use in the communication with  GCP.                                                    |
| sapgl            | string  | SAP MerchantId to return to GCP.                                                                         |
| sapgl            | string  | SAP GL account to return to GCP                                                                          |
| p24DelayToCancel | string  | P24 transaction time to cancel in seconds                                                                |



## Services Exposed
The application exposes the following APIs.
In order to find the correct API path, please search the apiName in the `node/service.json` file

| Method | Api Name               | Description|
|-|-|-|
|GET|paymentmethods| Returns the list of payment methods supported by the connector. |
|GET | providermanifest | Returns the manifest of the payment provider, with the payment methods and the list of custom fields supported |
|POST|createpayment| Creates the payment in worldPay and returns the URL to use when creating the iframe |
|POST|capturepayment| When the full sap integration is disabled, calls WorldPay to [capture](https://developerengine.fisglobal.com/apis/wpg/manage/modificationrequests#capture) the payment. |
|POST|cancelpayment| This method calls WorldPay to [cancel](https://developerengine.fisglobal.com/apis/wpg/manage/modificationrequests#cancel) the payment. |
|POST|refundpayment| This method calls WorldPay to [refund](https://developerengine.fisglobal.com/apis/wpg/manage/modificationrequests#refund) the payment. |
|POST| notification | Endpoint that WorldPay need to call at the payment authorization time  |
|POST| paymentdenied | Endpoint called when the payment gets denied. When happens, the the callback with the payment cancelled is called |
|GET| helperpage | Exposes the helper page, as requested by the [WorldPay docs](https://developerengine.fisglobal.com/apis/wpg/hostedintegration/javascriptsdk).  |
|GET| sapdata | Endpoint used by GCP during the order submission. Used to get payment details |
|GET| getvbase | gets the order payent information from vBase instead of using masterData, to avoid issues with MD not updated when notifications arrives   |
|GET| vtexPing | Endpoint exposed to VTEX for keepalive purposes |


## MasterData Entities
In order to support the connector, the following MD entities are used: 

| Entity Name | Description                                           |
|-------------|-------------------------------------------------------|
| WP          | Contains information about the payment for each order |
| LC          | Contains logs, with appName = worldpay-connector      |


## vBase Usage
vBase is used as a faster copy for the WP entities, where only the searh by orderId is allowed. 
Being used like a cache, its values are created at the payment creation and are removed when the payments gets captured or cancelled. 

- **Bucket name** : worldpay_payments
- **entity key** : <<orderId>>
- **entity value** : The payment for the order


## Manifest custom fields
In the manifest, the following custom fields are used: 

| Field Name  | Field Type |Description  |
|-------------|------------|----------------------------------------------------------------------------------------------------------------|
| paymentType | enum       | Payment type; can be credit cards or Bank Transfer. <br> In case bank transfer is used, then the customer will be redirected to the P24 payment page |
