
# Introduction
This application is used as a proxy between GCP and VTEX in order to support the fiscal printer in Poland

## Jira Story
https://whirlpoolgtm.atlassian.net/browse/RB-770


# Services exposed

- **/_v1/order-proxy/:id** <br>This service will take order lines with multiple quantities and will split them into multiple lines of quantity 1.


# Installation
To install this app, just run the 

```
vtex install plwhirlpool.order-proxy
```

# Configurations
This application does not require any configuration