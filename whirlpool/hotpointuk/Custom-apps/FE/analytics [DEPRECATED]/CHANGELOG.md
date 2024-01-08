# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.6] - 2022-11-23

### Changed

- fixed productClick, addToCart, removeFromCart and checkout steps fields for BF in **Analytics.tsx**

## [0.1.4] - 2022-11-04

### Changed

- fixed cta_clicks fields for BF in **Analytics.tsx**

## [0.1.3] - 2022-11-02
- [RB-1501] Common Template: Black Friday Landing Page

## [0.1.1] - 2022-10-26

### Changed

- added cta_clicks for BF in **Analytics.tsx**

## [0.1.0] - 2022-10-26

## [0.0.63] - 2022-10-10

### Changed

- added contentGroupingSecond to pageView event in **Analytics.tsx**

## [0.0.62] - 2022-07-21
[D2CA-802: HP UK: KPI Availability (dimension8), variant, broken pageView and feReady in PDP due to change in product reference ID](https://whirlpoolgtm.atlassian.net/browse/D2CA-802)

- Trigger `eec.productDetail` analytics event for `Not Sellable Online` products, pixel message received from `out-of-stock-products` custom app from **DiscontinuedProducts.tsx** 
- Add `productCategoryIdForPdp` global variable to get `product-category` string

### Changed
**Analytics.tsx**

## [0.0.61] - 2022-04-06
[HP UK - Populate product-category value in pageView and feReady for PLP and filtered PLP](https://whirlpoolgtm.atlassian.net/browse/D2CA-634)
- Get `product-category` from [VTEX CMS](https://hotpointuk.myvtex.com/admin/Site/Categories.aspx) based on number of category
[Adding Variable in pageView (main section content grouping) - (HPUK)](https://whirlpoolgtm.atlassian.net/browse/D2CA-352)
- Added `contentGrouping` field to pageView

## [0.0.60] - 2022-03-02
[HPUK - fix DL error (FE) wrong product page, pageView, feReady and errorPage](https://whirlpoolgtm.atlassian.net/browse/D2CA-571)
- Fixed: When user make a wrong search, delete double/triple DataLayer of error
- Fixed: When user lands on a wrong product page, pageView, feReady and errorPage event does not trigger

## [0.0.59] - 2022-03-02

## [0.0.58] - 2022-02-28
[HPUK - FUNREQ40 Promotion View/click](https://whirlpoolgtm.atlassian.net/browse/D2CA-179)
- Adjust name of analytics event to eec.promotionView
- Added clearance of previous ecomm object before triggering eec.promotionView and eec.promotionClick analytics events

## [0.0.57] - 2022-02-28

## [0.0.56] - 2022-02-21
[Update FUNREQ37 Impression list (HP UK)](https://whirlpoolgtm.atlassian.net/browse/D2CA-517)
- Update list for eec.impressionView and eec.productClick analytics events to "homepage_impression_list"

## [0.0.55] - 2022-02-21
## [0.0.54] - 2022-02-15
[HPUK - adjust list in DL up selling/cross selling carosel](https://whirlpoolgtm.atlassian.net/browse/D2CA-316)
