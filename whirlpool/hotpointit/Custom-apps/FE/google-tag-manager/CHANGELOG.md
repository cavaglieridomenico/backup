# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.0.72] - 2023-04-03

- added tracking of back in stock subscription

## [0.0.68] - 2022-12-19

- changed contentGrouping of pageview to have the value 'Marketing' to accomplish the guidelines for Masterchef landing page

## [0.0.67] - 2022-12-14

- released stable version

## [0.0.67-beta.0] - 2022-12-12

- removed analytics scripts:     
this app refers exclusively to hotpointit, all the props are moved to the whirlpoolemea.google-tag-manager app
- removed analytics events that have been moved to whirlpoolemea.google-tag-manager app:
‘filterManipulation’, ‘orderPlaced’, ‘add_to_wishlist’
- updated analytics event to GA4 standard: ‘pageview’, ‘feReady�

## [0.0.69] - 2023-01-09

## [0.0.64] - 2022-12-01

## [0.0.63] - 2022-11-30
## [0.0.62] - 2022-11-04

### Changed

- added cta click tracking for BF in **enhancedEcommerceEvents.ts**
- added file **commonMethods.ts**

## [0.0.60] - 2022-10-10

### Changed

- added contentGroupingSecond to PageView event in **extraEvents.ts**

## [0.0.59] - 2022-10-10

## [0.0.58] - 2022-09-12

### Added

-Added new popup on support pages. [SCTASK0804751](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=0e2c57bd472c5998c6415701e36d43c0%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)

## [0.0.57] - 2022-07-26

### Changed

- **enhancedEcommerceEvents.ts** changed "list" attribute in `eec.productDetail`. Now when there is no previous `eec.productClick`, the "list" attribute will be empty

## [0.0.56] - 2022-06-30
[D2CA-851: KPI Availability - HP IT](https://whirlpoolgtm.atlassian.net/browse/D2CA-851)
- Add `dimension8` for `eec.productDetail` analytics event
- Trigger `eec.productDetail` analytics event for `Not Sellable Online` products, pixel message received from `discontinued-products` custom app from **UnsellableProducts.tsx** 

### Changed
**enhancedEcommerceEvents.ts**

## [0.0.55] - 2022-06-30
No change

## [0.0.54] - 2022-03-24

### Added

- **enhancedEcommerceEvents.ts** added handle of events *vtex:cs_contact* in order to intercept events triggered in cs contacts button in "*assistenza/assistenza-tecnica-autorizzata*" pages. [SCTASK0750882](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=6f57e8e687fd45503b85fc07cebb35dd%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [0.0.53] - 2022-03-17
[HPIT - FUNREQ40 Promotion View/click](https://whirlpoolgtm.atlassian.net/browse/D2CA-147)
- Adjust name of analytics event to `eec.promotionView` and `eec.promotionClick`
- Added clearance of previous ecomm object before triggering `eec.promotionView` and `eec.promotionClick` analytics events

## [0.0.52] - 2022-02-22
[D2CA-530: HPIT: Bugfix: When user lands on a wrong product page, pageView, feReady and errorPage event does not trigger](https://whirlpoolgtm.atlassian.net/browse/D2CA-530)

## [0.0.51] - 2022-02-22

## [0.0.50] - 2022-02-22

## [0.0.49] - 2022-02-22

## [0.0.48] - 2022-02-22

## [0.0.47] - 2022-02-22

## [0.0.46] - 2022-02-22

## [0.0.45] - 2022-02-22

## [0.0.44] - 2022-02-14
[D2CA-516: Adding Variable in pageView (main section content grouping) - (HPIT)](https://whirlpoolgtm.atlassian.net/browse/D2CA-516)

## [0.0.43] - 2022-02-14

## [0.0.42] - 2022-02-09
[D2CA-515 :HPIT - pageView - feReady (FE)](https://whirlpoolgtm.atlassian.net/browse/D2CA-515)

## [0.0.41] - 2021-11-25

## [0.0.38] - 2021-11-17

## [0.0.36] - 2021-11-17

## [0.0.35] - 2021-11-17

## [0.0.33] - 2021-11-16

## [0.0.32] - 2021-11-16

## [0.0.30] - 2021-11-11

## [0.0.28] - 2021-11-09

## [0.0.27] - 2021-11-05

## [0.0.26] - 2021-11-05

## [0.0.25] - 2021-11-05

## [0.0.24] - 2021-11-05

## [0.0.23] - 2021-11-05

## [0.0.21] - 2021-10-25

## [0.0.20] - 2021-10-22

## [0.0.19] - 2021-10-22

## [0.0.18] - 2021-10-18

## [0.0.17] - 2021-10-18

## [0.0.16] - 2021-10-06

## [0.0.17] - 2021-05-10

## [0.0.15] - 2021-05-10

## [0.0.14] - 2021-05-10

## [2.9.0] - 2021-01-18
### Added
- Legacy events to dataLayer:
  - `homeView`
  - `categoryView`
  - `departmentView`
  - `internalSiteSearchView`
  - `productView`
  - `otherView`

## [2.8.1] - 2021-01-12
### Fixed
- Docs regarding Custom HTML tags.

## [2.8.0] - 2020-12-28
### Added
- `allowCustomHtmlTags` option on `settingsSchema`.

## [2.7.1] - 2020-12-18
### Added
- Public metadata information following App Store standards
- Billing Options structure following App Store standards

## [2.7.0] - 2020-12-08
### Added
- `list` property to `productClick`.

## [2.6.0] - 2020-12-01
### Added
- Events `promoView` and `promotionClick`.

## [2.5.1] - 2020-09-15
### Changed
- Replace handler of `vtex:cart` event to `vtex:cartLoaded`.

## [2.5.0] - 2020-09-14

## [2.4.1] - 2020-06-17
### Fixed
- Updated README.md file

## [2.4.0] - 2020-04-07
### Added
- Enable configuration by binding.

## [2.3.0] - 2020-02-12
### Added
- Event `userData`.

## [2.2.1] - 2020-02-11
### Fixed
- Events typings.

## [2.2.0] - 2019-09-12
### Changed

- Get blacklist values from server.

## [2.1.1] - 2019-09-09
### Changed
- Change `productDetail` event to send `id` and `variant` of the visible SKU
- Change `productClick` event to send `id` of the visible SKU
- Change `productImpression` event to send `id` of the visible SKU

## [2.1.0] - 2019-08-30

## [2.0.8] - 2019-07-23
### Fixed
- `category` field in `orderPlaced`, `productClick`, `productImpression`, `addToCart, and `removeFromCart`.

## [2.0.7] - 2019-07-23
### Added
- Event `productClick`.

## [2.0.6] - 2019-07-09

## [2.0.5] - 2019-06-27

### Fixed

- Build assets with new builder hub.

## [2.0.4] - 2019-05-27

### Fixed

- Use ES5.
- Avoid using global scope.

## [2.0.3] - 2019-05-27

## [2.0.2] - 2019-05-25

## [2.0.1] - 2019-05-25

## [2.0.0] - 2019-05-25
### Changed
- Ported to pixel builder 0

## [1.5.1] - 2019-05-23

### Fixed

- Typo in `orderPlaced` Enhanced Ecommerce property.

## [1.5.0] - 2019-05-22

### Added

- Event `productImpression`.

### Changed

- Add Enhanced Ecommerce data to `orderPlaced` event.

## [1.4.0] - 2019-05-22

### Added

- Event `pageView`.
- Property `event: 'productDetail'` to product view event.

## [1.3.0] - 2019-05-09

### Fixed

- Use the right price property.

### Added

- Event `removeFromCart`.
- Event `orderPlaced`.

## [1.2.0] - 2019-03-18

### Added

- Add `pixel` policy.

## [1.1.0] - 2019-01-25

## [1.0.0] - 2019-01-16

### Changed

- Migrate the app to typescript.
- Update to use new pixel API.

## [0.1.2] - 2018-12-04

### Fixed

- Add billingOptions on manifest.json.

## [0.1.1] - 2018-12-03

### Added

- Add full description to publish in Apps Store.

### Changed

- Change the Readme to reflect the Setup of the service.

## [0.1.0] - 2018-09-26

### Added

- MVP of `Google Tag Manager`.
