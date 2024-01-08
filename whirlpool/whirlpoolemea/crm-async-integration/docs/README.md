# CRM async
This application is used for the integration with the Whirlpool SAP CRM. 

## Installation

## Subscribed Events
This application is subscribed to the following events

| Event Name | Action |
| - | - |
| fetch-user-data-from-crm | This event triggers the retrieval of customer related information from the CRM. <br>Currently, the event is triggered only in the closed communities when a customer register or logs in. <br>**Trigger app**: cc-login |
| crm-recover-plan | This event is used in order to recover potentially missed user syncronization users; <br> the system will search for all CL entities without the crmBPId Field and will resend those users to the CRM <br> **Trigger app**: cc-login|
| crm-newsletter-subscription | Creates or updates the customer in the CL with the data received as event parameters and notifies GCP or the CRM based on the configuration settings. <br>**Trigger app**:<br> hotpointit.api-wrapper<br>hotpointuk.api-wrapper<br>whirlpoolemea.back-in-stock-email-trigger |
| order-created | This event is used to send customers to the CRM when they purchase in a website where the smartCheckout needs to be disabled by business requirement. The email of the customer is taken from the order custom data |
| setup | Event used to detect app installation and trigger initialization tasks, above all a cron to avoid service downscaling |


## Exposed Services

| Method | Service Name | Description |
| - | - | -| 
| POST | Ping | Returns always a 200 OK. Used for keepalive purposes |
| POST | notificationHandler | Endpoint called by the MD trigger every time a user subscribes to the Newsletter or registers to the website |
| POST | setCrmBpId | Updates the crmBpId of the customer with the one passed as body parameter. <br> This method is used in case of CRM asyncronous behaviour |
| GET | getUserDataFromVtex | Retrieves and returns the information about the user passed. <br> This service expects the VTEX internal ID of the CL entity in orer to return data |
| DELETE | deleteUserDataFromVtex | Removes the record of the customer from master data.<br>This service expects the internal VTEX userId  |
| GET | getUserDataFromCRM | Fetches the information about the customer and returns the XML to be sent to the CRM in order to create/update the customer |
| POST | eppExportHandler | Used in closed communities to manage the employee export. Imports the Employees profiles into a dedicated entity.<br>Based on the import type, the service will handle delta or full imports.  |
| POST | guestUserRegistration | This API call has the same logic of the order-created event. It was used in order to recover events that went lost, for example after CRM outages, when the event did not pass through the middleware queues. |
| POST | registrationForm | Creates or updates a CL entity and triggers the `crm-newsletter-subscription` event |
| GET | crmBackflowStatus | Just returns the pixelCrmBackflow event from the app settings.<br>Used to enable/disable the fetchDataFromCRM call done when accessing to the myAccount |
| POST | productRegistration | Used to support the Product Registration form where embedded in the D2C website.<br>Product registration is enabled in: \[hotpoint.it\] |

### Authentication
All the exposed services, except the ones in the following list, require authentication in order to be used. 
- ping
- crm backflow
- productRegistration

Depending on the service, there are 2 ways of authentication: 
- **MD authentication**: the `enabledMDKeyHash` appSettings needs to be equal to the first 65 characters of the sha512 of the passed `app-key` header
- **VTEX authentication**: the `X-VTEX-API-AppKey` and `X-VTEX-API-AppToken` will be checked against the `enabledAPICredentials` appSettings value. 

In order to verify which type of authentication is used, please check the *crm-async-integration/index* file


## App Settings
The application has the following configuration parameters: 

| Parameter  | Type   | Description                                                                         |
|------------|--------|-------------------------------------------------------------------------------------|
| crmEnvironment | enum | This configuration will select if the communication needs to go to the Prod or QA CRM environment |
| crmPassword | string | AES encode password for the CRM communication  |
| useSapPo | boolean | If true, use the SAP PO wsdl and endpoint |
| isUkProject | boolean | Use true if the project is HP UK |
| doubleOptin | boolean | True, if the website requires the double optin |
| checkoutAsGuest | boolean | True, if the smartCheckout is disabled in the account |
| newsletterAsGuest | boolean | True, if the newsletter event needs to be propagated to the CRM |
| newsletterMDEntity | string | If the newsletter subscriptions are saved in a different entity then the CL, use this field to use that entity |
| attrOptin | String | List of comma separated marketing attributes values of the CRM. If at least one of this is true, then the newsletterSubscription can be set to true during the crm backflow |
| attrSourceCampaign | string | name of the attribute to use in order to send the campaign to the CRM  |
| allowedStates | string | list of comma separated ISO 3166-2 state codes that are allowd to be sent to the CRM |
| defaultLocale | string | default locale that will be sent to the CRM if we don't know the navigation language of the customer |
| defaultSource | string | Only used in CC UK, this is the source from where the registration comes from |
| defaultCountry | string | default country that will be sent to the CRM |
| webIdPrefix | string | prefix to be applied to the vetxUserId field when communicating to the CRM |
| maxNumOfCharForWebId | number | if webIdPrefix+userId is longer then this value, the extra characters will be removed |
| maxNumOfDigitsForPhone | number | if the phoneNumber is longer then this value, the extra digits will be removed |
| crmRecoverPlan | boolan | true, if the crmRecoverPlan needs to be triggered |
| crmRecoverPlanStartDate | string | Consider for the recovery plan only consumers with empty crmBpId and created after this date   |
| newsletterAsGuestThroughGCP | boolean | If true, the user created via newsletter subscription need to be propagated via GCP |
| gcpHost | string | Hostname of the GCP service to call for user creation  |
| gcpProjectId | string | ProjectId used for the google authentication process |
| gcpClientEmail | string | Email used for the google authentication process |
| gcpPrivateKey | string | PrivateKey used for the google authentication process |
| gcpTargetAudience | string | Audience used when fetching the google authorization token |
| gcpBrand | string | default brand to use when asking GCP to create a new user in the CRM |
| gcpCountry | string | default country to use when asking GCP to create a new user in the CRM |
| crmEntityName | string | Name of the entity used to store information to send to the CRM |
| enabledAPICredentials | String | list of \<api key\>:\<api token\> strings, separated by a semicolumn (;) that can be used to call the authenticated backend services.<br><br>NOTE: for both API key and API token, they are not directly copied but are first hashed using SHA512 and then only the first 64 characters need to be saved into the configuration.<br>For more details, please check the `crm-async-integration/node/middlewares/checkCredentials.ts` |
| MDKey | string | app key to be configured for masterData API calls. This config is the first 64 characters of the key sha512 digest. For more information, check `crm-async-integration/node/middlewares/checkCredentials.ts` |
| enabledMDKeyHash | boolean | If false, all MD authentication will return 403-unauthorized |
| localTimeLocale | string | locale to be used in order to format the current timestamp into the `WebChgTime` parameter of the CRM call |
| localTimeZone | string | timezone to be used in order to format the current timestamp into the `WebChgTime` parameter of the CRM call |
| authCookie | string | Name of the authentication cookie, used to get information of the currently logged in user during the CRM backflow |
| pixelCrmBackflow | boolean | If true, enables the CRM backflow process when accessing the myAccount |
| isCCProject | pixelCrmBackflow | True, if the country is a closed community |
| epp.mdEntityName | string | Acronym of the entity where Employee data is stored and verified against during the login and registration process |
| epp.whiteList | Array of String | List of emails or clock numbers that can access the website even if not in the export from success factor. <br> Usually this configuration is used for tests and technical users, such as users for test automaton |
| epp.keyFields | Array of string | used in pair with `epp.whiteList`, each element identifies if the epp.whiteList element in the same position is an email or a clock number |
| epp.tradePolicyId | string | ID of the trade policy for the EPP community |
| epp.loginUrl | string | value of the `EU_CONSUMER_EPP_LINK` attribute to send to the CRM when the customer belongs to the EPP community |
| epp.attrOptinCC | String | Overwrites the `attrOptin` if the logged in customer belogs to the EPP community |
| ff.mdEntityName | string | Currently not used |
| ff.tradePolicyId | string | ID of the trade policy for the FF community |
| ff.loginUrl | string | value of the `EU_CONSUMER_FF_LINK` attribute to send to the CRM when the customer belongs to the EPP community |
| ff.attrOptinCC | String | Overwrites the `attrOptin` if the logged in customer belogs to the FF community |
| vip.mdEntityName | String | Acronym of the entity where VIP company information is stored |
| vip.tradePolicyId | string |  ID of the trade policy for the VIP community |
| vip.loginUrl | string | value of the `EU_CONSUMER_VIP_LINK` attribute to send to the CRM when the customer belongs to the VIP community |
| vip.attrOptinCC | String | Overwrites the `attrOptin` if the logged in customer belogs to the VIP community |
| productRegistration.Contactallowance | string | Constant value to be sent to the CRM in the `Contactallowance` field |
| productRegistration.Dataorigintype | string | Constant value to be sent to the CRM in the `Dataorigintype` field |
| productRegistration.OtherInfo | string | Constant optional value to be sent to the CRM in the `IsOtherData.OtherInfo` field |
| productRegistration.Zz0010 | string | Constant value to be sent to the CRM in the `Zz0010` field |
| productRegistration.Zz0018 | string | Constant value to be sent to the CRM in the `Zz0018` field |
| productRegistration.Zz0020 | string | Constant value to be sent to the CRM in the `Zz0020` field |
| taxonomy | Array of Objects | List of objects with the following fields: <br> - ID: name of the category the product belongs to <br>- Product Family: family categorization in the CRM. This information goes to the ZZ0011 field in the CRM request<br>-MAG Code: Product categorization in the CRM. This information goes into the ZZ0012 field. 
|


