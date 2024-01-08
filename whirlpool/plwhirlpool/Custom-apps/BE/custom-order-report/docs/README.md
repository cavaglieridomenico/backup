# Custom Order Report

This application is by the business to download a report of the orders placed in the store in a format that can use for internal purposes. 

## Installation
It is possible to install in your store by using the VTEX IO Toolbelt.
[Install](https://vtex.io/docs/recipes/development/installing-an-app/) the `plwhirlpool.custom-order-report` app. You can confirm that the app has now been installed by running `vtex ls` again. 

## Exposed Services
- **GET /_v/orders/orders-by-time-range**: returns the list of orders within the range passes as parameter. 

## Get Orders by TimeRange
This endpoint allows the creation of a csv with the orders created in the timeframe selected by the admin user. 
Once that is done, the app creates an entry in the OR masterData entity and loads in the file field the csv file.

The response to this API call is just an OK / KO and the result will be sent via email to the customer. 

## OR - MasterData entities and triggers
The OR master data table is used to save Order Reports and send them to the customer. 

### Entity Structure

|Field Name| Description|
|-|-|
| email | email of the admin that asked for the export|
| subject | subject of the email |
| file | file field that will contain the CSV file of the report |

### Entity Trigger
In order to send an email, a trigger on the "attribute changed event" was created. 
The trigger only fires when the `file` field is `not null` and, when it's not, send an email with the "Send an Email" trigger action. 

The subject is retrieved from the entity, while the text of the email is a default text hardcoded in the trigger itself. 

At last, the attachment is the file attribute. 


## Configuration
This application does not have any configuration

## Order Report CSV Fields

The report is constructed so that there is <u>a line for each line of each order </u>

|Field Name| Description|
|-|-|
|Origin| origin fild of the VETX order. |
|Order| order number |
|Sequence| sequence fild of the VETX order |
|Creation Date| order creation date |
|Client Name| First Name of the customer |
|Client Last Name| Last Name of the customer |
|Client Document| Customer's billing identifier, if provided |
|Email| Customer's email |
|Phone| Customer's phone number |
|UF| Customer shipping address state field |
|City| Customer shipping address city field |
|Address Identification| VTEX internal ID of the shipping address |
|Address Type| VTEX address type. |
|Receiver Name| Receiver name in the order address |
|Street| Shipping address street |
|Number| Shipping address house number |
|Complement| Shipping address complement |
|Neighborhood| Shipping address Neighborhood |
|Reference| Hardcoded empty string |
|Postal Code| Shipping address postal code |
|SLA Type| Selected SLA of the first logisticInfo element in the order |
|Courrier| Courrier of the first logisticInfo element in the order |
|Estimate Delivery Date| shippingEstimateDate value of the first logisticInfo element in the order |
|Delivery Deadline| shippingEstimate of the first logisticInfo element in the order |
|Status| Status of the order |
|Last Change Date| Date of last change of the order |
|UtmMedium| UtmMedium of the order's marketing data |
|UtmSource| UtmSource of the order's marketing data |
|UtmCampaign| UtmCampaign of the order's marketing data |
|Coupon| Coupon name of the order's marketing data |
|Payment System Name| Payment method used for this order|
|Installments| Installments used for this order. <br> Only the installments of the first transaction are considered, because no split payment logic was ever requested|
|Payment Value| Price paid from the customer for the order. |
|Quantity_SKU| Quantity bought for that SKU |
|ID_SKU| Id of the SKU |
|Category Ids Sku| Sku category |
|Reference Code| Sku reference code|
|SKU Name|  Sku Name |
|SKU Value| Sku price |
|SKU Selling Price| sku selling price |
|SKU Total Price| sku total price from its price definition |
|SKU Path| detailUrl of the SKU |
|Item Attachments| Hardcoded empty string |
|List Id| Hardcoded empty string |
|List Type Name| Hardcoded empty string |
|Service (Price/ Selling Price)| Array of additioanl services (bundled items) in the format \<item name\>-\<item price \> |
|Shipping List Price| price of the delivery for the order |
|Shipping Value| Actual shipping cost post disconunts, found in the order totals |
|Total Value| Total cost of the order |
|Discounts Totals| Total value of the discounts|
|Discounts Names| Name of the first discount applied, from the rates and benefits Order field. |
|Call Center Email| Order callCenterOperatorData value |
|Call Center Code| Order callCenterOperatorData value |
|Tracking Number| order tracking number value |
|Host| order hostname value |
|GiftRegistry ID| Hardcoded empty string |
|Seller Name| order sellerNames |
|Status TimeLine| Hardcoded "Obsolete" string |
|Obs| OpenTextField value of the order |
|UtmiPart| utmiPart of the order's marketing data |
|UtmiCampaign| utmCampaign of the order's marketing data |
|UtmiPage| utmipage of the order's marketing data |
|Seller Order Id| Hardcoded empty string |
|Acquirer| Acquire in the connectorResponse field of the first payment field instance|
|Authorization Id| authId  in the connectorResponse field of the first payment field instance |
|TID| Transaction ID of the first payment instance of the order |
|NSU| order paymentNSU field |
|Card First Digits| Hardcoded emmpty string, because credit card data is managed by WorldPay |
|Card Last Digits| Hardcoded emmpty string, because credit card data is managed by WorldPay |
|Payment Approved By| Hardcoded emmpty string |
|Cancelled By| account that cancelled the order. Empty if the order is not cancelled |
|Cancellation Reason| Cancellation reason. Empty if the order is not cancelled |
|Gift Card Name| hardCoded Empty string, since the poland country does not use GiftCards |
|Gift Card Caption| hardCoded Empty string, since the poland country does not use GiftCards |
|Authorized Date| Order's payment Authorization date |
|Corporate Name| Corporate name field of the customer's profile data |
|Corporate Document| corporateDocument field of the customer's profile data |
|TransactionId| List of the trasnction ids of the order |
|PaymentId| List of the pciTransactionId field values of the order |
|SalesChannel| Order's sales channel |
|marketingTags| order's marketing tags|
|Delivered| Hardcoded false value |
|SKU RewardValue| Reward value of the SKU. Always 0 since the functionality is not used  |
|Is Marketplace cetified| isCerfitied value of the marketplace field. "N/A" if empty |
|Is Checked In| order isCheckedIn value. "N/A" if null or undefined. |
|Currency Code| Order's currency code |
|Taxes| SKU applied taxes |
|Invoice Numbers| invoice number of the first package of the order |
|Country| country of the order shipping address |
|Input Invoices Numbers| invoice number of the first package of the order |
|Output Invoices Numbers| Hardcoded empty string |
|Status raw value (temporary)| order status |
|Cancellation Data| Order cancellation data value. Empty if null or undefined. |