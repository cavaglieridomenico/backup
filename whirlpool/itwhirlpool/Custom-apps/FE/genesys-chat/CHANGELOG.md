# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
## [Unreleased]

## [1.0.22] - 2022-10-19

## [1.0.21] - 2022-08-01

### Changed

- **body.html** moved input line for name surname and email at the bottom as how it looks in Indesit IT.
- **head.html** changed reference to css file (genesys7.css).
[SCTASK0812235](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=26109728478d91909a54d65c346d436f%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.20] - 2022-07-27

### Changed

Changes mentioned below are part of automatization of chat with the bot:
- **body.html** removed "Motivazione" fields and changed input value with id "*genesys_webchat_endpoint*" to "GlobalChatSwitchboard".
- **head.html** changed references to js and css file (m-chat88.js and genesys6.css).
[SCTASK0793964](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=b188bdb497409118e98337e3f153afd3%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.19] - 2022-06-14

### Changed

- **body.html** changed label chat availability to show that is available also on saturday from 9.00 to 13.00 and **head.html** related JS file in order to let the chat be active also on saturday from 9.00 to 13.00. [INC2206951](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=b7a93e0d970415100341b4efe153afcb%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [1.0.18] - 2022-06-09

### Changed

- **body.html** changed chat reasons as it seems like in this page */supporto/fissa-un-appuntamento/online-garanzia-estesa/#/login* genesys chat took reasons from body.html and not from the JS file added in *head.html* file. [SCTASK0792738](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=a53a53c4978851d4c2a8b0afe153af6e%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.17] - 2022-05-19

[WHPIT fix - funreq24 chat reason](https://whirlpoolgtm.atlassian.net/browse/D2CA-691)
- Adjusted chat `reason` to English in `m-chat86.js`

## [1.0.16] - 2022-03-16

[RB-151: Unify the behavior of the chat according to the page that is accessed](https://whirlpoolgtm.atlassian.net/browse/RB-151)
- Released by: `Guy Eboulet`
- Modified `reason` in chat list on `m-chat82.js`

## [1.0.15] - 2022-03-15

### Changed

- **head.html** changed the JS reference file from "*m-chat78.js*" to "*m-chat84.js*" in order to have in SELECT_OPTIONS_TRADE only the "MOTIVAZIONE": "Informazioni prodotto".

## [1.0.13] - 2022-02-18

### Changed

- *head.html* changed the js reference file from "m-chat77.js" to "m-chat78.js". 
  Jira ticket: [RB-159](https://whirlpoolgtm.atlassian.net/browse/RB-159)
  MOB ticket: [SCTASK0744475](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=508061191be941906147a688b04bcb48%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)


## [1.0.12] - 2022-02-14

### Changes

- *head.html* changed the js reference file from "m-chat76.js" to "m-chat77.js". [SCTASK0746750](https://whirlpool.service-now.com/sc_task.do?sys_id=ad5572aa1b6905d06147a688b04bcb39&sysparm_view=&sysparm_domain=null&sysparm_domain_scope=null&sysparm_record_row=1&sysparm_record_rows=12&sysparm_record_list=assignment_group%3dfb66e9141b373090ee1f0d85604bcbe0%5estateIN1%2c-5%2c2%5eORDERBYDESCnumber)

## [1.0.10] - 2021-11-18

## [1.0.7] - 2021-06-23
- added new reason
- modified dropdown selection text
## [Release]

## [1.1.0]

- New release
## [1.0.0]

- First release
## [Unreleased]

## [1.0.4] - 2021-04-10

## [1.0.3] - 2021-04-02

## [1.0.2] - 2021-04-02

## [1.0.1]

- Patch
