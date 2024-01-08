# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.84] - 2023-09-06

### Added

- **EmbeddedExpiredWarranty.tsx** added _data-layout_ attribute [SCTASK0946408](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do%3Fsys_id=164d391697cd79145b0eb9bfe153af0f%26sysparm_stack=sc_task_list.do%3Fsysparm_query=active=true)

## [0.0.83] - 2023-09-01

### Removed

- Removed info box about the August schedule for the call center [SCTASK0945413](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do%3Fsys_id=106038fc47c939d0e8e97161e36d43ca%26sysparm_stack=sc_task_list.do%3Fsysparm_query=active=true)

## [0.0.79] - 2023-01-11

- released stable version

## [0.0.79-beta.0] - 2023-01-09

### Added

- added Analytics GA4 enhancement

## [0.0.77] - 2022-11-03

### Changed

- changed template support desktop and mobile
  [SCTASK0838777](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=277b030b97dad5545f83b3a3f153afe1%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)
  [SCTASK0839310](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=701a528c87ae9dd0d2b72f45dabb3546%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)

## [0.0.76] - 2022-06-10

### Changed

- **FormServiceCare.jsx** changed contact support mail from *contact_fr_indesit@whirlpool.com* to *contact_fr_whirlpool@whirlpool.com*. [INC2260223](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=f8e6154a474e99d0107926c2846d4364%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [0.0.75] - 2022-09-12

### Changed

-feReady push for Google Analytics. [INC2241077](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=c972807687159198d2b72f45dabb357b%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [0.0.70] - 2022-08-10

### Changed

- **NotFoundEvent.tsx** commented _fePages_ function that was causing issue on errorPage and feReady push for Google Analytics. [INC2236985](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=3bdd6e37978d9dd4a701d400f153afcc%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.0.50] - 2022-06-10

### Changed

- **FormServiceCare.jsx** changed contact support mail to *contact_fr_indesit@whirlpool.com*. [SCTASK0777219](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=c63139139747c9d8e98337e3f153afa2%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [0.0.48] - 2022-05-24

### Changed

- **EmbeddedTroubleShooting.jsx** check if script with src: _//icb.prod.wpsandwatch.com/static/bootstrap.js_ exists and remove it in order to prevent easy service form to be shown instead of the trouble shooting one. [INC2192848](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=e7d2342547670910c6415701e36d4359%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.0.37] - 2022-03-18

### Changed

- **EmbeddedExtendedWarranty.jsx**, changed _data-country_ to _"FR"_ and _data-locale_ to _"fr_FR"_.
  [INC2163962](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=938d221197228d106aa7fe3bf253afb7%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.0.33] - 2022-03-18

### Changed

- Updated **ContactUsCarouselMobile.jsx** and **PhoneSupportModalMobile.jsx** to update phone number.
  [SCTASK0748392](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=d13d04981b75cd145042a7d8b04bcb5e%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [Unreleased]

### Added

- Initial release.
