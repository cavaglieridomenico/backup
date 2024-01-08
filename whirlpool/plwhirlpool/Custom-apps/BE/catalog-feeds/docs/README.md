# Feed Builder
IO service for serving catalog feed files in formats that are not supported by the VTEX XML catalog export functionality. <br>
The feed builder currently supports the feed for the following platforms: 
- [ceneo](https://www.ceneo.pl/) : [Jira Story](https://whirlpoolgtm.atlassian.net/browse/RUN-432)
- [awin](https://www.awin.com/) : [Jira Story](https://whirlpoolgtm.atlassian.net/browse/RUN-1106)


## Installation
It is possible to install in your store by using the VTEX IO Toolbelt. <br>
[Install](https://vtex.io/docs/recipes/development/installing-an-app/) the `plwhirlpool.log-export` app.<br>
You can confirm that the app has now been installed by running `vtex ls` again. 

## Exposed Services
The application exposes the following public URLs.

| Method | Path               | Description                                             |
|--------|--------------------|---------------------------------------------------------|
| GET    | /v1/feed/ping      | internal route used for application keepalive purposes. |
| GET    | /v1/feed/ceneo.xml | catalog feed in the ceneo.pl format                     |
| GET    | /v1/feed/awin.xml  | catalog feed in the awin format                         |


## Application behaviour description
The application useses a catalog collection in order to find the products that need to be exported to the external provider. <br>
**NOTE**: The collection needs to be manually managed by the business.
**NOTE 2**: The same collection is used for all the feeds.


After one of the services is called, the catalog information is loaded for that collection; the retrieval can be done from vBase (used as cache) or from the catalog graphQL API. 
At this point, the VTEX catalog information is converted in the format specific for the feed requested. 

## Configuration
The application has the following configuration parameters: 

| Parameter    | Type   | Description                                                                     |
|--------------|--------|---------------------------------------------------------------------------------|
| collectionId | string | Identifier of the collection to be exported in the feeds.                       |
| publicUrl    | string | base URL to be used to compose the product details URL to be placed in the feed |
| shippingCost | numer  | cost of the delivery to be sent to Awin                                         |
| shippingTime | string | Delivery time for the product to be sent to Awin                                |
| cachePeriod  | numer  | number of minutes that the catalog information cache remains valid.             |
