# GMC Supplementary feeds

App name: gmc-supplementary-feeds

Description: Useful app for creating supplementary feeds for Google Merchant Center 

## App Settings

  - vtex settings 
  
    - categoryIds: Category Ids of the products to be included in the feed (comma separated)

  - Feeds Settings

    - feedName: useful for retrieving proper feed settings
    - salesPolicy: Sales policy id used to filter the products that will be included in the feed
    - removeOutOfStock: flag that indicates if out stock products shell be included in the feed
    - xmlFeedTitle: Label to be used in the `title` tag
    - xmlFeedLink: Label to be used in the `link` tag
    - xmlFeedDescription: Label to be used in the `description` tag
    - deliveryServiceName: Name of the delivery service

## Rest services exposed
Routes:
  - getShippingPriceSupplementaryFeed: (GET) useful to retrieve supplementary feed with delivery cost info. It'ss needed in projects that have delivery at cost service
