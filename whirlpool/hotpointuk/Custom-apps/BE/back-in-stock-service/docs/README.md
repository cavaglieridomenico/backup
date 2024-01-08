# Back In Stock Service
back-in-stock-service app can be used to send emails to users that are subscribed at the service when the product back in stock.
If the product, identified by refId, doesn't back in stock within 30 days, it will send out of stock email.

# Master Data Entity

The entity used for this service is BS (back-in-stock service)
It's schema is defined here:

    BS -> email: String!      |
          refId: String!      | --> Required for subscription query
          language: String    |
          userName: String!   |

          isOutOfStock: Boolean   |
          isBackInStock: Boolean  | --> set to false when subscribing to the back in stock service,                                         
          emailSent: Boolean      |     to true when the sendnotification service is invoked

          productName: String   | --> searched and set at the time of subscription through refid

        
# Query GraphQL 

Mutation:
  - Subscribe(email: String!, refId: String!, language: String, userName: String): Boolean

Query:
  - version: String


# Rest services exposed

- "subscribe": /v1/backinstock/subscribe (called by FE when a user subscribes to the service)
      
- "backNotification": /v1/backinstock/notify (called by GCP when a product back in stock)
    
- "outNotification": /v1/outofstock/notify (used only with SFMC integration)
      
- "manualNotification": /v1/backinstock/notify/manual (for development environment only)


# Eventi generati

  - backNotification update the field emailSent and start the trigger back in stock notification that send emails to subscribers
  - outNotification update the field emailSent and start the trigger out of stock notification that send emails to subscribers


# Eventi a cui si sottoscrive
