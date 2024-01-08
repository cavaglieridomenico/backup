# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.1.83] - 2023-01-24

- fixed type label for cta_click

## [0.1.80] - 2022-12-14

- released stable version

## [0.1.80-beta.0] - 2022-12-12

- removed analytics scripts:     
this app refers exclusively to hotpointit, all the props are moved to the whirlpoolemea.google-tag-manager app
- removed analytics events that have been moved to whirlpoolemea.google-tag-manager app:
‘filterManipulation’, ‘orderPlaced’, ‘add_to_wishlist’
- updated analytics event to GA4 standard: ‘pageview’, ‘feReady�

## [0.1.81] - 2023-01-09

## [0.1.79] - 2022-11-23
### Changed
- added CTA clicks events for Black Friday

## [0.1.77] - 2022-09-14

## [0.1.76] - 2022-09-14

## [0.1.75] - 2022-08-09

### Changed

- **extraEvents.tsx** changed *categoryPath* as it was causing an issue on CMS SiteEditor for *urzadzenia/inne-produkty/dodatkowe-produkty* PLP, and also from the site in this PLP applying filters was causing an issue. [INC2233787](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=81e7faed9781d9d08f19bce3a253afc4%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.1.73] - 2022-07-11
[D2CA-787: KPI Availability - WHP PL](https://whirlpoolgtm.atlassian.net/browse/D2CA-787)
- Trigger `eec.productDetail` analytics event for `Not Sellable Online` products, pixel message received from `discontinued-products` custom app from **UnsellableProducts.tsx** 

### Changed
**enhancedEcommerceEvents.ts**
## [0.1.72] - 2022-04-19

### Changed

- **enhancedEcommerceEvents.ts**, changed *vtex:filterManipulation*, specifically the *"ClearFilter"* interaction that it's triggered on mobile version when "Clear" button is clicked. [INC2172227](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=eda7252d47368910c6415701e36d43d1%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.1.71] - 2022-03-31

### Changed

- fixed last release 0.1.70 that had some errors caused to a wrong merge. Specifically on those files: **enhancedEcommerceEvents.ts** and **extraEvents.ts**.
  [INC2164832](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=464213651ba2815099f51f47b04bcb92%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.1.57] - 2022-03-17

## [0.1.56] - 2022-02-24

## [0.1.55] - 2022-02-22

## [0.1.54] - 2022-02-22

## [0.1.53] - 2022-02-18

## [0.1.52] - 2022-02-17

## [0.1.51] - 2022-02-17

## [0.1.50] - 2022-02-17

## [0.1.49] - 2022-02-17

## [0.1.48] - 2022-02-17

## [0.1.47] - 2022-02-17

## [0.1.46] - 2022-02-17

## [0.1.45] - 2022-02-15

## [0.1.44] - 2022-02-15

## [0.1.43] - 2022-02-11

## [0.1.42] - 2022-02-11

## [0.1.41] - 2022-02-11

## [0.1.40] - 2022-02-11

## [0.1.39] - 2022-02-03

## [0.1.38] - 2022-02-03

## [0.1.37] - 2022-02-03

## [0.1.36] - 2022-02-03

## [0.1.35] - 2022-02-02

## [0.1.34] - 2022-02-02

## [0.1.33] - 2022-02-02

## [0.1.32] - 2022-02-02

## [0.1.31] - 2022-01-28

## [0.1.30] - 2022-01-28

## [0.1.29] - 2022-01-28

## [0.1.28] - 2022-01-28

## [0.1.27] - 2022-01-28

## [0.1.26] - 2022-01-28

## [0.1.25] - 2022-01-28

## [0.1.24] - 2022-01-28

## [0.1.23] - 2022-01-28

## [0.1.22] - 2022-01-28

## [0.1.21] - 2022-01-28

## [0.1.20] - 2022-01-28

## [0.1.19] - 2022-01-28

## [0.1.18] - 2022-01-28

## [0.1.17] - 2022-01-28

## [0.1.16] - 2022-01-28

## [0.1.15] - 2022-01-28

## [0.1.14] - 2022-01-28

## [0.1.13] - 2022-01-28

## [0.1.12] - 2022-01-28

## [0.1.11] - 2022-01-28

## [0.1.10] - 2022-01-28

## [0.1.9] - 2022-01-28

## [0.1.8] - 2022-01-28

## [0.1.7] - 2022-01-28

## [0.1.6] - 2022-01-28

## [0.1.5] - 2022-01-28

## [0.1.4] - 2022-01-28

## [0.1.3] - 2022-01-28

## [0.1.2] - 2022-01-11

## [0.1.1] - 2022-01-11

## [0.0.21] - 2021-11-23

## [0.0.20] - 2021-11-23

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
