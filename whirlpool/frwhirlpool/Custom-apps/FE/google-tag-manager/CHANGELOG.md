# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
## [0.0.65] - 2023-05-23
- [D2CA-1599](https://whirlpoolgtm.atlassian.net/browse/D2CA-1599) add cta_click add to card.
## [0.0.62] - 2023-01-24

- fixed label for cta_click

## [0.0.59] - 2022-12-05

- released stable version

## [0.0.59-beta.0] - 2022-12-01

- removed analytics scripts:
  this app refers exclusively to frwhirlpool, all the props are moved to the whirlpoolemea.google-tag-manager app
- removed analytics events that have been moved to whirlpoolemea.google-tag-manager app:
  ‘filterManipulation’, ‘orderPlaced’, ‘add_to_wishlist’
- updated analytics event to GA4 standard: ‘pageview’, ‘feReady’
- added contentGroupingSecond property

## [0.0.58] - 2022-11-23

- Added CTA click tracking for Black Friday

## [0.0.57] - 2022-11-23

- Added CTA click tracking for Black Friday

## [0.0.56] - 2022-08-10

- Add optional chaining to `window.history.state.state.navigationRoute.id` causing `pageView` and `feReady` to not to trigger in personal area page when landing on page after clicking on person icon

## [0.0.55] - 2022-08-10

[WHP FR - userType adjustments in pageView, feReady and checkout - FE](https://whirlpoolgtm.atlassian.net/browse/D2CA-832)

- Change way of populating `userType` field for `pageView` and `feReady`
  - Possible values: `prospect`, `cold customer`, `hot customer`

## [0.0.53] - 2022-08-02

[WHP FR (well being) - sidebar CTA in the WB pages triggers a “WB Card CTA” dataLayer](https://whirlpoolgtm.atlassian.net/browse/D2CA-900)

- Add check to ensure that URL includes `produits` for `eventCategory` to be `WB to LP CTA`
  [WHP FR (well being) - the event action of the “WB to LP CTA” crops the parameters after “prodotti” (in italian)](https://whirlpoolgtm.atlassian.net/browse/D2CA-901)
- Change URL `href` of `analytics-wrappers` in CMS via `https://frwhirlpool.myvtex.com/admin/cms/site-editor/`
  [WHP FR (well being) - the event label of the CTA crops contains pages in which there are no WB CTAs - part 2](https://whirlpoolgtm.atlassian.net/browse/D2CA-963)
- Push `wellBeing_discoverMore` events only for `well-being` pages

## [0.0.52] - 2022-07-04

[WHP FR - productCategory is not populated](https://whirlpoolgtm.atlassian.net/browse/D2CA-837)

- Change way of populating `product-category` field for `pageView` and `feReady` analytics events as it was getting `product-category` only for PDP
- Approach of getting `product-category` also for PLP based on `frccwhirlpool`

## [0.0.50] - 2022-06-09

### Changed

- Added new events for Wellbeing section.

## [0.0.50] - 2022-05-24

### Changed

- Added events related to new PLP subcategories (lavage).

## [0.0.49] - 2022-05-16

### Changed

- Added events related to Wellbeing section.

## [0.0.48] - 2022-05-09

### Changed

- **enhancedEcommerceEvents.ts**, fixed some dimensions fields issues.
- **extraEvents.ts**, fixed pageView issues.
- Checkout UI custom JS from "/admin/vtex-checkout-ui-custom/".

  MOB tickets:

  - [SCTASK0763390](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=0650ed4c1b228d1819e60f66624bcb84)
  - [SCTASK0763392](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=a803214c1b628d1819e60f66624bcb3b)
  - [SCTASK0762648](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=5373b42f1b16495099f51f47b04bcbf0)
  - [SCTASK0766514](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=f5928b961ba20190fb8954a7624bcbbc)

## [0.0.47] - 2022-03-29

[WHP FR - FUNREQ40 Promotion View/click](https://whirlpoolgtm.atlassian.net/browse/D2CA-609)

- Adjust name of analytics event to `eec.promotionView` and `eec.promotionClick`
- Added clearance of previous ecomm object before triggering `eec.promotionView` and `eec.promotionClick` analytics events

## [0.0.46] - 2022-03-22

[Adding Variable in pageView (main section content grouping) - (WHPFR)](https://whirlpoolgtm.atlassian.net/browse/D2CA-374)

- **extraEvents.ts** - added main content grouping for pageView analytics event

## [0.0.45] - 2022-03-21

### Updated

- **enhancedEcommerceEvents.ts** added dimension8 value telling if a product is "In Stock" or "Out of Stock".
  - Ticket: [WHP FR - New parameter for Availability - GTM impl./TEST](https://whirlpoolgtm.atlassian.net/browse/D2CA-480)
  - [SCTASK0749896](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=31bb82f51b75c510708f26db234bcb70%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [0.0.43] - 2021-12-06

## [0.0.42] - 2021-12-06

## [0.0.41] - 2021-11-23

## [0.0.38] - 2021-10-05

## [0.0.37] - 2021-10-05

## [0.0.36] - 2021-10-02

## [0.0.35] - 2021-10-02

## [0.0.34] - 2021-10-02

## [0.0.33] - 2021-10-02

## [0.0.23] - 2021-09-23

## [0.0.22] - 2021-08-31

## [0.0.17] - 2021-08-26

## [0.0.16] - 2021-08-26

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

- `category` field in `orderPlaced`, `productClick`, `productImpression`, `addToCart, and`removeFromCart`.

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
