# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
## [0.0.63] - 2023-03-07
- fix english label for cta_click
## [0.0.62] - 2023-01-24
- fixed label for cta_click
## [0.0.60] - 2022-11-30
- Removed duplicate analytic event filterManipulation
## [0.0.59] - 2022-11-23
- added cta click for BF
## [0.0.58] - 2022-11-23
- fix field value
## [0.0.57] - 2022-11-23
- added CTA click for Black Friday
## [0.0.56] - 2022-11-23
## [0.0.55] - 2022-10-20
### Removed
-Unsed settingsSchema props from manifest.json
## [0.0.52] - 2022-09-28
### Added
-removed  GA event 'vtex:promotion' **extraEvents.ts** as it was managed with analytics wrapper. [SCTASK0818697](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=b78955729799155c26c6362e6253af87%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)
## [0.0.51] - 2022-09-23
### Added
-added new GA event 'vtex:promotion' **extraEvents.ts**. [SCTASK0818697](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=b78955729799155c26c6362e6253af87%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)
## [0.0.49] - 2022-09-13
### Added
-Added new popup on support pages. [SCTASK0804751](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=0e2c57bd472c5998c6415701e36d43c0%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)

## [0.0.48] - 2022-08-01
- Merged with One Trust
- Google Consent Mode Added
- New configuration added to Admin App 
- `gtag("consent", "default",{
  ad_storage: "denied",
  analytics_storage: "granted",
  functionality_storage: "denied",
  personalization_storage: “denied",
  security_storage: “granted",
  wait_for_update: 2000,
  });
  gtag("set", "ads_data_redaction", true);`

- must be added after dataLayer declaration, before GTM snippet. The analytics_storage value must be granted only for the Italian site.

## [0.0.47] - 2022-08-01
[RB-877](https://whirlpoolgtm.atlassian.net/browse/RB-877)
- Add event stripeCTA click on the new stripe pop-up component in Homepage

## [0.0.46] - 2022-07-26
[RB-429](https://whirlpoolgtm.atlassian.net/browse/RB-429)
- Add event ReedemAPromo on the info card list in HomePage

## [0.0.45] - 2022-06-23
[D2CA-848: KPI Availability - WHP IT](https://whirlpoolgtm.atlassian.net/browse/D2CA-848)
- Trigger `eec.productDetail` analytics event for `Not Sellable Online` products, pixel message received from `discontinued-products` custom app from **UnsellableProducts.tsx** 

### Changed
**enhancedEcommerceEvents.ts**

## [0.0.44] - 2022-06-23
[D2CA-849 - WHP IT: When user clicks on product card, eec.productClick event is not triggered](https://whirlpoolgtm.atlassian.net/browse/D2CA-849)
- Refactor implementation to get `list` parameter based on `eec.impressionView` event using functions `getListImpressionView` and `getListProductClick`

### Changed
**enhancedEcommerceEvents.ts**


## [0.0.43] - 2022-06-23
No changes

## [0.0.42] - 2022-06-08
[RB-901] Release new Analytics event for Fuorisalone 

## [0.0.40] - 2022-05-31
Commented the dim8Value on the "eec.productDetail"

## [0.0.39] - 2022-05-31
[RB-897] Change PageView in the page of Fuorisalone

## [0.0.38] - 2022-05-10
[RB-35: Enhanced Ecommerce GA Tracking](https://whirlpoolgtm.atlassian.net/browse/RB-35)
- Add `dimension6` to following analytics events: 
  - `impressionView`
  - `productClick`
  - `productDetail`
  - `addToCart`
  - `removeFromCart`
  - `checkout`

## [0.0.36] - 2022-05-04
[RB-550: [WELL BEING - IT] HomePage Wellbeing](https://whirlpoolgtm.atlassian.net/browse/RB-550) 
- Add WellBeing events
## [0.0.36] - 2022-04-05

### Changed

- **extraEvents.ts** changed function to get CategoryPath in order to handle PLPs with applied filters for the pageView event. [SCTASK0758783](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=15b102641b5ec15419e60f66624bcbd5%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)
## [0.0.35] - 2022-04-04
[RB-23] Changes pageView event

## [0.0.31-0.0.32] - 2022-02-22
[RB-23] Added filterManipulation event

## [0.0.30] - 2022-02-22
[RB-31] Added showDifferences event

## [0.0.29] - 2022-02-17
[RB-28] Replaced the add-to-wishlist and remove-form-wishlist events with the event wishlist


## [0.0.29] - 2022-03-07
Add prodDetailsTab event 

Ticket: [WHP IT - FUNREQWHR04 - prodDetailsTab](https://whirlpoolgtm.atlassian.net/browse/RB-32)

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
