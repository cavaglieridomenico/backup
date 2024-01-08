# CRM async
This application is used for the integration with the Whirlpool SAP CRM. 

## Installation

## Subscribed Events
This application is subscribed to the following events

| Event Name | Action |
| - | - |
| crm-wake-up-services | Event used to keep the CRM app alive. Makes calls to the API endpoints exposed by this app | 

## Exposed Services

| Method | Service Name | Description |
| - | - | -| 
| POST | notificationHandler | Endpoint called by the MD trigger every time a user subscribes to the Newsletter or registers to the website |
| POST | setCrmBpId | Updates the crmBpId of the customer with the one passed as body parameter. <br> This method is used in case of CRM asyncronous behaviour |
| GET | getUserDataFromVtex | Retrieves and returns the information about the user passed. <br> This service expects the VTEX internal ID of the CL entity in orer to return data |
| GET | getUserDataFromCRM | Fetches the information about the customer and returns the XML to be sent to the CRM in order to create/update the customer |
| GET | deleteEntryFromVbase | Used to remove a customer from vBase, used as cache because MasterData search does not index fast enough |


### Authentication
All the exposed services, except the ones in the following list, require authentication in order to be used. 
- crm backflow
- deleteEntryFromVbase

Depending on the service, there are 2 ways of authentication: 
- **MD authentication**: the `enabledMDKeyHash` appSettings needs to be equal to the first 65 characters of the sha512 of the passed `app-key` header
- **VTEX authentication**: the `X-VTEX-API-AppKey` and `X-VTEX-API-AppToken` will be checked against the `enabledAPICredentials` appSettings value. 

In order to verify which type of authentication is used, please check the *crm-async-integration/index* file


## App Settings
The application has the following configuration parameters: 

| Parameter  | Type   | Description                                                                         |
|------------|--------|-------------------------------------------------------------------------------------|
| crmEnvironment | enum | This configuration will select if the communication needs to go to the Prod or QA CRM environment |
| server | enum | Used to select if the communication needs to go to SAP PO or SAP CRM |
| crmPassword | string | AES encode password for the CRM communication  |
| gcpHost | string | Hostname of the GCP service to call for user creation  |
| gcpProjectId | string | ProjectId used for the google authentication process |
| gcpClientEmail | string | Email used for the google authentication process |
| gcpPrivateKey | string | PrivateKey used for the google authentication process |
| gcpTargetAudience | string | Audience used when fetching the google authorization token |
| enabledAPICredentials | String | list of \<api key\>:\<api token\> strings, separated by a semicolumn (;) that can be used to call the authenticated backend services.<br><br>NOTE: for both API key and API token, they are not directly copied but are first hashed using SHA512 and then only the first 64 characters need to be saved into the configuration.<br>For more details, please check the `crm-async-integration/node/middlewares/checkCredentials.ts` |
| MDKey | string | app key to be configured for masterData API calls. This config is the first 64 characters of the key sha512 digest. For more information, check `crm-async-integration/node/middlewares/checkCredentials.ts` |
| enabledMDKeyHash | boolean | If false, all MD authentication will return 403-unauthorized |
| authCookie | string | Name of the authentication cookie, used to get information of the currently logged in user during the CRM backflow |

