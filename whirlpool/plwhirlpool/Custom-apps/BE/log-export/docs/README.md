# Log Export ![https://img.shields.io/badge/-Deprecated-red](https://img.shields.io/badge/-Deprecated-red)
The Log export application is an admin application used in order to download custom logs. 
This application is deprected. <br>
<u>Replacement app:</u> whirlpoolemea.log-export

**NOTE**: if this application was not replaced yet, please test carefully in the QA environment before replacing.  

## Services exposed
- **GET apps/log/export** : this endpoint returns a list of logs
- **POST apps/log/export** : this endpoint removes logs

### Read Logs
The read log service is used to read logs from the LC (Log Custom) entity. 
It can receive the following query parameters: 

| Param Name | Description |
|-|-|
| from | start date since when you need the logs |
| to | date till  you need the logs |

This service will return a zipped json file containing the logs of all the apps between the requested dates. 

### Delete Logs
This service is used to delete a list of log entries by log internal identifier. 
The request body is the array of IDs that you need to delete. 
**Authentication**: in order to call this endpoint, the following headers must be passed: 

|  Name | Description |
|-|-|
| x-vtex-api-appkey | api key of the account |
| x-vtex-api-apptoken | api token of the account |

**NOTE** this app has the api key and token of all the account hardcoded. That is the main reason why :
- It needs to be replaced with the whirlpoolemea one
- It might not work on all the accounts just by replacing the vendor 


## Admin UI Exposed
This application offers a panel in the admin console, in the _other_ section where the admin can:
1. select start date
2. select end date
3. download the logs in the selected timeframe 


## Installation

It is possible to install in your store by using the VTEX IO Toolbelt.
[Install](https://vtex.io/docs/recipes/development/installing-an-app/) the `plwhirlpool.log-export` app. You can confirm that the app has now been installed by running `vtex ls` again. 

## Configurations
This application does not require any configuration
