# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [0.0.120] - 2023-09-11
## [0.0.119] - 2023-09-06

### Fixed

- **Manuals.jsx** and **EmbeddedManuals.jsx** fixed script src endpoint from _https://wpeu.docs.staging.wpsandwatch.com/js/bootstrap.js_ to _https://docs.whirlpool.eu/js/bootstrap.js_. [INC2442492](https://whirlpool.service-now.com/nav_to.do?uri=incident.do%3Fsys_id=b7404e45474939d08f9e7e35f16d43a8%26sysparm_stack=incident_list.do%3Fsysparm_query=active=true)

## [0.0.118] - 2023-05-04

### Fixed

- changed label in contact form

## [0.0.117] - 2023-03-28

### Fixed

- fixed youreko_badge tracking for analytics

## [0.0.116] - 2023-03-21

### Fixed

- [SEOPOD-865](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-865) Fixed discontinued dishwashers 404 errors

## [0.0.115] - 2023-03-21

### Fixed

- [SEOPOD-877](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-877) Fixed UX of the label "Classe energetica" for discontinued products

## [0.0.114] - 2023-02-13

### Added

- Made the _phone_ field mandatory [SCTASK0868005](https://whirlpool.service-now.com/sc_task.do?sys_id=1e5cd00c97a8a9905b0eb9bfe153af02)

## [0.0.111] - 2023-01-16

- SCTASK0844784: updated reason list for contact us form


## [0.0.110] - 2023-01-11

- Released stable version

## [0.0.110-beta.0] - 2023-01-09

### Added

- Added Analytics GA4 enhancement

## [0.0.107] - 2022-11-03

### Changed

- changed template support desktop and mobile
  [SCTASK0838777](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=277b030b97dad5545f83b3a3f153afe1%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)
  [SCTASK0839310](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=701a528c87ae9dd0d2b72f45dabb3546%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)

## [0.0.76] - 2022-09-15

### Changed

-feReady update fetch url with the wrapper endpoint '/_v/wrapper/api/catalog/category/'[INC2241077](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=c972807687159198d2b72f45dabb357b%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)
## [0.0.105] - 2022-09-12

### Added

-Added new popup on support pages. [SCTASK0804751](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=0e2c57bd472c5998c6415701e36d43c0%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)

## [0.0.104] - 2022-09-12
### Changed

-feReady push for Google Analytics. [INC2241077](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=c972807687159198d2b72f45dabb357b%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

### Changed

- **NotFoundEvent.tsx** commented _fePages_ function that was causing issue on errorPage and feReady push for Google Analytics. [INC2236985](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=3bdd6e37978d9dd4a701d400f153afcc%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.0.99] - 2022-07-27

### Changed

- **ContactUsCarouselMobile.jsx** changed label for "Chat Online" box to "Chatta con noi tramite il nostro servizio Indesit Live Chat" for mobile. [SCTASK0810925](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=3d8544f39738d5508f19bce3a253afe6%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [0.0.96] - 2022-07-19

### Changed

- Changed only the **manifest.json**, it seems like in the last version *v0.0.95* there was an issue causing some carousel images in homepage to not be shown. Maybe with the last version 0.0.95 not all the code has been pushed in branch *main*. [INC2225594](https://whirlpool.service-now.com/nav_to.do?uri=incident.do%3Fsys_id=b06bb64147781550e8e97161e36d4365%26sysparm_stack=incident_list.do%3Fsysparm_query=active=true)

## [0.0.80] - 2022-06-08

### Added

- **ContacUsCarouselMobile.jsx** added some text for mobile version in carousel with contact us boxes. [SCTASK0789305](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=ff8b9be987f30d105e0ebae6dabb35b0%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [0.0.79] - 2022-06-06

### Changed

- **EmbeddedTroubleShooting.jsx** merged changes done in [performance](http://obiwan.replynet.prv/commerce/whirlpool/-/commit/44b260894bd507281507ba492ada9e1fd55227b8) linked commit.

## [0.0.77] - 2022-05-30

### Changed

- **EmbeddedManuals.jsx** fixed UI for mobile. [SCTASK0787549](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=139b583347278550073e68aaf36d43c8%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [0.0.76] - 2022-05-30

### Changed

- **ButtonLayerAccordion.jsx** added question mark in order to prevent blank page on discontinued products. [INC2197788](https://whirlpool.service-now.com/incident.do?sys_id=4929aa5c4773c110e8e97161e36d4339)

## [0.0.75] - 2022-05-24

### Changed

- **EmbeddedTroubleShooting.jsx** check if script with src: *//icb.prod.wpsandwatch.com/static/bootstrap.js* exists and remove it in order to prevent easy service form to be shown instead of the trouble shooting one. [INC2192848](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=e7d2342547670910c6415701e36d4359%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.0.61] - 2022-03-28

### Changed

- Changed API call in order to get info for *matching technologies, documents ext..* in PDPs. Changed files: Instructions.tsx, MatchingTechnologies.tsx, ProductFiche.tsx and ProductSpecificationsWithRules.tsx. [INC2161544](https://whirlpool.service-now.com/incident.do?sys_id=29d855f3475249d88a2159f2846d43e0&sysparm_record_target=incident&sysparm_record_row=2&sysparm_record_rows=3&sysparm_record_list=assignment_group%3Dfb66e9141b373090ee1f0d85604bcbe0%5EstateIN1%2C3%2C2%5EORDERBYnumber)

## [0.0.56] - 2022-03-18

### Changed

- **WarrantyCarouselMobile.jsx** updated title for card *"Contratto di garanzia estesa"* that was missing in last release.

## [0.0.55] - 2022-03-18

### Changed

- **WarrantyCarouselMobile.jsx** changed text for card *"Contratto di garanzia estesa"*. [SCTASK0759236](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=b2946eb0479a891891493518946d4392%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [0.0.54] - 2022-03-18

### Changed

- **PhoneSupportModalMobile.jsx** updated phone number and made it clickable. 
  Mob tickets: [SCTASK0748392](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=d13d04981b75cd145042a7d8b04bcb5e%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)
  [SCTASK0756337](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=70c956ae1b424550fb8954a7624bcb44%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

- Merged the other updates made in previous releases.

## [0.0.51] - 2022-02-14

### Changed

- *Manuals.jsx* and *EmbeddedManuals.jsx* changed data-language from "en" to "it". [SCTASK0744554](https://whirlpool.service-now.com/sc_task.do?sys_id=c968f11d1ba98d505042a7d8b04bcb4d&sysparm_record_target=sc_task&sysparm_record_row=2&sysparm_record_rows=12&sysparm_record_list=assignment_group%3Dfb66e9141b373090ee1f0d85604bcbe0%5EstateIN1%2C-5%2C2%5EORDERBYDESCnumber)
## [0.0.49] - 2022-02-01

## [0.0.48] - 2022-02-01

### Added
- Initial release.
