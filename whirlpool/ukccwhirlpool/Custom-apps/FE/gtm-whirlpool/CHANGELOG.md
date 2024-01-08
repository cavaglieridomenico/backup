# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.43] - 2023-03-13

## [0.1.42] - 2023-02-20

## [0.1.40-beta.0] - 2022-01-27 
- added Analytics GA4 enhancement

## [0.1.39] - 2022-12-14

## [0.1.38] - 2022-12-14

## [0.1.37] - 2022-11-15

## [0.1.36] - 2022-10-26

## [0.1.34] - 2022-10-25

## [0.1.33] - 2022-10-19

## [0.1.32] - 2022-10-19

## [0.1.31] - 2022-10-12

## [0.1.30] - 2022-10-06

## [0.1.29] - 2022-09-27

## [0.1.28] - 2022-09-27

## [0.1.27] - 2022-09-27

## [0.1.26] - 2022-09-15

## [0.1.25] - 2022-09-13

## [0.1.24] - 2022-08-31

## [0.1.21] - 2022-08-05

## [0.1.18] - 2022-05-23
Ticket: [[GA] - Pageview issues - contentGroupigSecod](https://whirlpoolgtm.atlassian.net/browse/FRCC-1041)
- Hotfix for `contentGroupingSecond` as `develop` branch was merged into `main` causing override of variable `mappedContentGrouping` in `extraEvents.ts` 
## [0.1.17] - 2022-05-19
Ticket: [[GA] - Pageview issues - contentGroupigSecod](https://whirlpoolgtm.atlassian.net/browse/FRCC-1041)
- Added mapping of `product-category` for `contentGroupingSecond`
- Fix `contentGrouping` is `(Other)` for filtered PLP
  - Expected value is `Catalog` 

## [0.1.16] - 2022-05-18

- Fixed information on Custom Dimension User Company value[FRCC-1056](https://whirlpoolgtm.atlassian.net/browse/FRCC-1056)

## [0.1.15] - 2022-05-11

Ticket: [[GA] Product list issues](https://whirlpoolgtm.atlassian.net/browse/FRCC-1025)
- Update `list` value for `eec.impressionView` and `eec.productClick` analytics events
- For `eec.productClick` `list` value:
  - Get `list` valued based on `productId` of viewed item in `eec.impressionView`
  - As fallback in case user clicks on product card before `eec.impressionView`, get `list` value based on previous `pageView` event
- Prevent `eec.impressionView` to trigger for [product-comparison page](https://frccwhirlpool.myvtex.com/product-comparison)

## [0.1.14] - 2022-04-04

## [0.1.13] - 2022-03-25

## [0.1.12] - 2022-03-25

## [0.1.11] - 2022-03-23

## [0.1.10] - 2022-03-22

## [0.1.9] - 2022-03-22

## [0.1.8] - 2022-03-22

## [0.1.7] - 2022-03-18

## [0.1.6] - 2022-03-17

## [0.1.5] - 2022-03-16

## [0.1.4] - 2022-03-14

## [0.1.3] - 2022-03-12

## [0.1.2] - 2022-03-12

## [0.0.43] - 2022-03-11

## [0.0.42] - 2022-03-09

## [0.0.41] - 2022-03-09

## [0.0.40] - 2022-03-08

## [0.0.39] - 2022-03-08

## [0.0.38] - 2022-03-07

## [0.0.37] - 2022-03-07

## [0.0.36] - 2022-03-07

## [0.0.35] - 2022-03-07

## [0.0.34] - 2022-03-07

## [0.0.33] - 2022-03-02

## [0.0.32] - 2022-03-02

## [0.0.31] - 2022-03-02

## [0.0.28] - 2022-02-03

Switched dimension4 and dimension5

Ticket: [WHP IT - Fix/update DataLayer Ecommerce](https://whirlpoolgtm.atlassian.net/browse/D2CA-189)
## [0.0.24] - 2021-12-14

Added errorPage analytics event when no search results returned

Ticket: [D2CA-292: WHP IT- errorPage not track in case of result not found (FE)](https://whirlpoolgtm.atlassian.net/browse/D2CA-292)

## [0.0.23] - 2021-12-14

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
