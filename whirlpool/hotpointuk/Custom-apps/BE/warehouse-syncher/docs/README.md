# Warehouse Syncher - Vtex x CNET

The warehouse-synceher application is in the UK market in order to keep the reservations synced between the eCommerce and the other channels. 

## Installation
It is possible to install in your store by using the VTEX IO Toolbelt. <br>
[Install](https://vtex.io/docs/recipes/development/installing-an-app/) the `hotpointuk.warehouse-synceher` app.<br>
You can confirm that the app has now been installed by running `vtex ls` again. 


## How it works
The application is based on events and exposed routes. 
* when a new order is created (and as a result a new inventory reservation is in place) the app will receive the notification from the order-broadcaster and will call CNET to propagate such information.
* When CNET has a new reservation, it will call the sync API in order to also reserve the slot on VTEX

On VTEX, reservation are managed using the [OOTB services](https://developers.vtex.com/docs/api-reference/logistics-api#post-/api/logistics/pvt/inventory/reservations).
Also, if the country has a marketplace, the sendNotificationtoMP middleware is used to call the marketplace and update the product availability specification if the product was in stock and became out of stock, 

## Exposed Services and subscribed events
The application exposes the following APIs.
In order to find the correct API path, please search the apiName in the `node/service.json` file

| Method | Api Name               | Description                          | 
|--------|------------------------|--------------------------------------|
| POST | sync | API called by CNET in order to manage a reservation (create / delete). |
| POST | notify | API exposed by the VTEX marketplace, called by the seller in order to update in the marketplace the specifications of that product related to the inventory |
| POST | manualSync | API used by the Maintenance team, called to simulate the reservation call made by CNET |


### Events management
The warehouse-synceher does not generate any event, but subscribes to the following: 


|Sender                 | Event Name       | Description                           | 
| --------------------- | ---------------- | ------------------------------------- |
| vtex.orders-broadcast | order-accepted   | Retrieves the current stock/reservation information for each order line and sends them to CNET |
| vtex.orders-broadcast | handling         | Retrieves the current stock/reservation information for each order line and sends them to CNET |


## Configuration Parameters

