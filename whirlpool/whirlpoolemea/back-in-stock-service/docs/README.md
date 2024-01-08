# Back In Stock Service

This app managed the Back in stock (BIS) and Out of stock (OOS) feautures using SFMC-integration app as well, in order to send the notification via SFMC.
For this reason check if in the SFMC-integration app is added the middleware back-in-stock in order to handle the event triggered by the back-in-stock-service app.

Master Data:
This app require to set in the MD of the account:
- an Entity "BS" to collect the user's subscription
- set a trigger for the BS entity in order to managed the out of stock feature via endpoint --> condition: if user, after 30 days, it is not notified yet for the BIS

Appsettings:
BIS feauture is called by GCP batch each 30 min. So it is required to set in the appsettings the authentication keys of GCP.
Otherwise you should add the BIS and OOS keys provided from SFMC.

This app it has been installed in:
- whirlpool it d2c
- hotpoint it d2c
- whirlpool fr d2c
- bauknecht de d2c