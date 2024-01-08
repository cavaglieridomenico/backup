# Payment app
The *Payment* app adds a verification step to the checkout process, responsible for allowing or forbidding an order placement.
In this case, the APP shows an iFrame of the payment provider page, where the customer actually inserts its credit card. 

## Installation
It is possible to install in your store by using the VTEX IO Toolbelt.
[Install](https://vtex.io/docs/recipes/development/installing-an-app/) the `worldpay-payment-app` app. You can confirm that the app has now been installed by running `vtex ls` again. 


## App description

The application takes in the paylod of the createPayment response and expects the following parameters. 

| Param Name | Param Type | Description | 
| - | - | - | 
| paymentUrl  | string | URL to be passed to the WorldPay frontEnd library  |
| deniedUrl  | string | VTEX URL to be calle in case of payment denined |
| helperPageUrl  | string | Link to the HTML page used by the WorldPay front-end library to create the iframe |
| locale  | string | Locale to use when loading the iframe |

With such parameters, the FrontEnd loads the WorldPay library and uses it to draw the iframe. 
When the payment is completed, the library will call a specified function. 
The worldpay-payment-app component will
- trigger the `transactionValidation.vtex` event with `true` status in case of successful payment
- call the deniedUrl in case the payment was cancelled by the customer
- Otherwise, trigger the `transactionValidation.vtex` event with `false` status