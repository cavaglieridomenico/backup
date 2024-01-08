# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [0.1.2] - 2023-04-18
### added
added event preorder cta-click, [D2CA-1565](https://whirlpoolgtm.atlassian.net/browse/D2CA-1565)
- 
## [0.1.1] - 2023-02-22

## [0.0.89] - 2023-01-17

## [0.0.88] - 2023-01-09

## [0.0.87] - 2022-12-21
- released stable version

## [0.0.87-beta.0] - 2022-12-19
- Added Analytics GA4 enhancement

## [0.0.85] - 2022-11-14
- Added cta_click tracking in **enhancedEcommerceEvents.ts**
- Added new file for common methods **commonMethods.ts**

## [0.0.82] - 2022-10-10
- Added contentGropingSecond field to pageView event **extraEvents.ts**

## [0.0.82] - 2022-10-04

## [0.0.80] - 2022-08-30

## [0.0.79] - 2022-08-10

## [0.0.78] - 2022-08-08

## [0.0.77] - 2022-07-21

## [0.0.76] - 2022-07-21

## [0.0.75] - 2022-07-21

## [0.0.74] - 2022-07-21

## [0.0.73] - 2022-07-21

## [0.0.72] - 2022-07-11

## [0.0.71] - 2022-07-08

## [0.0.70] - 2022-07-05

## [0.0.69] - 2022-07-05

## [0.0.68] - 2022-07-04

## [0.0.67] - 2022-07-04

## [0.0.66] - 2022-07-04

## [0.0.65] - 2022-06-27

## [0.0.64] - 2022-06-27

## [0.0.63] - 2022-06-22

## [0.0.62] - 2022-06-22

## [0.0.61] - 2022-06-20

## [0.0.60] - 2022-06-17

## [0.0.59] - 2022-06-16

## [0.0.58] - 2022-06-16

## [0.0.57] - 2022-06-16

## [0.0.56] - 2022-06-16

## [0.0.55] - 2022-06-13

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
