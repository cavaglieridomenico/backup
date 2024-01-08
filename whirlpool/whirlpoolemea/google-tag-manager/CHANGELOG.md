# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.2.32] - 2023-08-02

### fixed

- **page-utils.ts** avoid pushing duplicate "pageView" event [D2CA-1818](https://whirlpoolgtm.atlassian.net/browse/D2CA-1818)

## [2.2.31] - 2023-07-11

### added

- **product-utils.ts** add Enhanced conversion datalayer for HPUK [D2CA-1809](https://whirlpoolgtm.atlassian.net/browse/D2CA-1809)

## [2.2.30] - 2023-06-27

### fixed

- **page.ts** fix path to get contentgroupingsecond on filtred plp page [D2CA-1749](https://whirlpoolgtm.atlassian.net/browse/D2CA-1749)
- **product-utils.ts** fix country code for WHRFR & BKDE [D2CA-1785](https://whirlpoolgtm.atlassian.net/browse/D2CA-1785)


## [2.2.29] - 2023-06-27

### Changed

- **pageViewData.ts** changed how the _productCode_ is retrieved to unify the data between SFMC and GA [SCTASK0924194](https://whirlpool.service-now.com/nav_to.do?uri=%2Fsc_task.do%3Fsys_id%3D65c3692b47eba1d0a6c91978f36d4352%26sysparm_stack%3D%26sysparm_view%3D)

## [2.2.28] - 2023-06-15

### added

- **product-utils.ts** added enhanced datalyer for BKDE and WHRFR purchase event.

## [2.2.27] - 2023-06-06

### Changed

- **page.ts** and **product-utils.ts** removed from path the encoded language. This was happening in SP CH and now it removes the /de, /it and /fr from the page while tracking the pdp_view and pageView datalayer

## [2.2.26] - 2023-05-26

### Changed

- **head.html** Changed dataLayer push in order to prevent differences between _dataLayer_ and _window.dataLayer_ variables [SCTASK0913368](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do%3Fsys_id=9c860789978fa95026c6362e6253aff4%26sysparm_stack=sc_task_list.do%3Fsysparm_query=active=true)

## [2.2.25] - 2023-05-22
Implemented handling of multipli GTM ids for parts websites with multiple bindings

## [2.2.24] - 2023-05-11
Implemented handling of OT codes for parts websites with multiple bindings

## [2.2.23] - 2023-03-28
Implemented FUNREQ09A

## [2.2.22] - 2023-03-20

### Released

- [Add Account To Cache Identifier](https://whirlpoolgtm.atlassian.net/browse/RUN-931)

## [2.2.19] - 2023-02-22

### Released

- Released stable version

## [2.2.19-beta.5] - 2023-02-20

- Fixed Analytics event view_cart

## [2.2.18] - 2023-02-06

- Fixed ID UK issue by adding filter of non-analytics pixel messages

## [2.2.17] - 2023-02-02

- Fixed FUNREQSPARE15 in spareparts.ts file

## [2.2.15] - 2023-01-24

- removed console logs

## [2.2.14] - 2023-01-24

- Added event barCode(FUNREQSPARE15) in spareparts.ts

## [2.2.13] - 2023-01-23

- Fixed Analytics events: pdp_view / myModelNumberUkSpare (compatibility with spare parts sites)

## [2.2.12] - 2023-01-19

- Fixed Analytics event: eec.checkout (item price)

## [2.2.11] - 2023-01-19

- Fixed Analytics event for checkout-io (HP UK): eec.checkout
- Fixed Analytics events for HP UK SPARE PARTS: eec.checkout / filterManipulation

## [2.2.10] - 2023-01-18

- Fixed Analytics for user successful login

## [2.2.9] - 2023-01-16

- Fixed Analytics pageView/feReady event for pdp page
- Fixed a module import

## [2.2.7] - 2023-01-12

- Fixed eec.purchase push

## [2.2.6] - 2023-01-10

- Added OT Domain Id's props in manifest for bindings and fixed binding check for product events

## [2.2.5] - 2023-01-10

- Fixed pixel parenthesis and added Blacklist setting (do not use)

## [2.2.3] - 2023-01-09

- Fixed sellable prop and macroCategory(BE).

## [2.2.1] - 2023-01-09

- Fixed logout event (GA4FUNREQ24B)

## [2.2.0] - 2023-01-09

- Added checkout events and update README.md

## [2.1.0-beta.1] - 2022-12-20

- fixed wrong contentGroupingSecond on pages different from pdp/plp

## [2.1.0-beta.0] - 2022-12-19

- added pageView/feReady Analytics events

## [2.0.5] - 2022-12-14

- released stable version

## [Unreleased]

## [2.2.8] - 2023-01-16

## [2.2.6] - 2023-01-10

## [2.2.5] - 2023-01-10

## [2.2.4] - 2023-01-09

## [2.2.3] - 2023-01-09

## [2.2.1] - 2023-01-09

Added setting to manage countries without reviews. The default for the setting is 'bazaarvoice' that is used in most of the countries.
WARNING: After releasing a new version it's necessary to save the settings of the application on all the countries.

## [2.0.5-beta.4] - 2022-12-14

Fixed switch case in page.ts

## [2.0.5-beta.3] - 2022-12-13

Added settings to manage stores without bazaarvoice

## [2.0.5-beta.2] - 2022-12-7

Fixed Analytics filterManipulation event for recipes

## [2.0.4] - 2022-12-5

Released stable version

## [2.0.4-beta.3] - 2022-11-16

Extended support of bazaarvoice data

## [2.0.4-beta.2] - 2022-11-16

Fixed manifest settingsSchema

## [2.0.4-beta.1] - 2022-11-16

Fixed manifest defaults

## [2.0.4-beta.0] - 2022-11-16

whirlpoolemea.google-tag-manager beta release
Consent settings
Fixed some analytics push
Added node package.json

## [2.0.2] - 2022-10-19

## [1.0.1] - 2022-10-19

## [1.0.0] - 2022-07-18

Init app on account whirlpoolemea
