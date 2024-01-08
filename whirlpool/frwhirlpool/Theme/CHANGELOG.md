# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [10.0.0] - 2023-06-26

### Added

[SEOPOD-535](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-535) Added hrefLangs feature on PLPs.

## [9.0.8] - 2022-21-06

- [RUN-1794](https://whirlpoolgtm.atlassian.net/browse/RUN-1794) Add strikethrough text, additional text in main banner

## [9.0.7] - 2023-06-20

- [SEOPOD-1020](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-1020) Fix pagination issue on PLPs (show more button)

## [9.0.6] - 2023-06-15

[SCTASK0913913] updated privacy policy

## [9.0.5] - 2023-05-31

[RUN-1662](https://whirlpoolgtm.atlassian.net/browse/RUN-1662) [T&C page] Change structure of DISPONIBILITE DES PIECES DETACHEES section.

## [9.0.4] - 2023-05-17

[SEOPOD-923](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-923) Set fixed width and height for Homepage images to reduce CLS and improve performance.

## [9.0.3] - 2023-05-17

[SEOPOD-924](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-924) Set fixed width and height + minHeight for PDP images to reduce CLS and improve performance.

## [9.0.2] - 2023-05-17

[SEOPOD-925](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-925) Set fixed width and height for PLP images to reduce CLS and improve performance.

## [9.0.1] - 2023-05-16

- [SEOPOD-861](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-861) removed sku-selector app
- [SEOPOD-861](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-861) added new props for the app whirlpoolemea.product-image

## [9.0.0] - 2023-05-15

### Released

- Back in stock _whirlpoolemea.back-in-stock_ sponsor app added in peer dependencies in order to use the **back-in-stock** block for the form.
- Removed dependency to old back in stock app _frwhirlpool.availability-subscriber-custom_ and related _availability-subscriber-custom_ block in StoreTheme.
  Jira tickets:
  - Story, [DC-1203](https://whirlpoolgtm.atlassian.net/browse/DC-1203)
  - Release, [DC-1312](https://whirlpoolgtm.atlassian.net/browse/DC-1312)

## [8.0.6] - 2023-05-10

Fix pre order page and pdp

## [8.0.5] - 2023-05-10

Fix pre order page

## [8.0.4] - 2023-05-10

[SCTASK0900810] updated file vtex.info-card-list.css

## [8.0.3] - 2023-05-09

fix style on file frwhirlpool.slider-layout.css

.sliderTrack--shelfBlackFriday{
width: 187% !important;
}
--removed

## [8.0.2] - 2023-05-09

### Added

- [SEOPOD-855](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-855?atlOrigin=eyJpIjoiMzJmNTRhNDllN2ZjNDk4MDkxOWI4ZDlhMzE4MmJiNTgiLCJwIjoiaiJ9)
  added font-display: swap

## [8.0.1] - 2023-05-05

### Added

- **product.jsonc** added video section between _bundles_ and _tabPDP_ [SCTASK0894397](https://whirlpool.service-now.com/sc_task.do?sys_id=658fc06787f5e19042138409dabb3584)

## [8.0.0] - 2023-05-03

- [RUN-1254](https://whirlpoolgtm.atlassian.net/browse/RUN-1254) PDP pre-order: add information
- [RUN-1494](https://whirlpoolgtm.atlassian.net/browse/RUN-1494) Pre-order LP: breadcrumb, countdown, faq, gallery images
- [RUN-1320](https://whirlpoolgtm.atlassian.net/browse/RUN-1320) Pre-order products: update availability info
- [RUN-1353](https://whirlpoolgtm.atlassian.net/browse/RUN-1353) PLP/Cart Add availability date of pre-order products

## [7.0.28] - 2023-05-01

stable version released

## [7.0.27] - 2023-04-19

updated no-frost-w9.jsonc file / added new blocks inside "slider-layout-whl#caruselTextBannerW9" :
"flex-layout.col#caruselTextBannerW9card1",
"flex-layout.col#caruselTextBannerW9card2",
"flex-layout.col#caruselTextBannerW9card3",
"flex-layout.col#caruselTextBannerW9card4",
"flex-layout.col#caruselTextBannerW9card5",
"flex-layout.col#caruselTextBannerW9card6",
"flex-layout.col#caruselTextBannerW9card7"

## [7.0.26] - 2023-04-19

### Changed

- **manifest.json** update _frwhirlpool.custom-category_ dependency [SCTASK0895429](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=d42220b8874a2110d2b72f45dabb3565%26sysparm_view=RPTb6af9f9587008954e4bc7447cebb35c7)

## [7.0.25] - 2023-04-17

fixed The product characteristics that are incorrectly formatted in tablet [INC2361161](https://whirlpool.service-now.com/incident.do?sys_id=ef538c04879a699042138409dabb35c0&sysparm_view=&sysparm_domain=null&sysparm_domain_scope=null&sysparm_record_row=1&sysparm_record_rows=2&sysparm_record_list=stateIN1%2c3%2c2%2c9%5eassignment_group%3dfb66e9141b373090ee1f0d85604bcbe0%5eORDERBYDESCnumber)

## [7.0.23] - 2023-04-11

### Added

- **menu.jsonc** added new footer item [SCTASK0894477](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=076a74a78735259042138409dabb3552)

## [7.0.22] - 2023-03-04

- [RUN-1051](https://whirlpoolgtm.atlassian.net/browse/RUN-1051) Pre-order PDP: add T&C info, badge and review estimation delivery process

## [7.0.19] - 2023-03-28

- [D2CA-1409](https://whirlpoolgtm.atlassian.net/browse/D2CA-1409) add youreko badge plp and pdp

## [7.0.18] - 2023-03-20

- [RUN-198](https://whirlpoolgtm.atlassian.net/browse/RUN-198) PLP Block Wrapping with experimental-visibility

## [7.0.17] - 2023-03-13

- Improve CMS vision for pre-order page

## [7.0.16] - 2023-03-13

- [RUN-738](https://whirlpoolgtm.atlassian.net/browse/RUN-738) PDP: Sort by options need to be translated
- [RUN-1111](https://whirlpoolgtm.atlassian.net/browse/RUN-1111) Product card Alignment on Pre order page

## [7.0.15] - 2023-03-08

- [RUN-191](https://whirlpoolgtm.atlassian.net/browse/RUN-191) PDP Block Wrapping
- [RUN-175](https://whirlpoolgtm.atlassian.net/browse/RUN-175) Optimizing all layouts mobile
- [RUN-183](https://whirlpoolgtm.atlassian.net/browse/RUN-183) PDP Mobile Optimization

## [7.0.14] - 2023-03-06

### fixed

- [RUN-743](https://whirlpoolgtm.atlassian.net/browse/RUN-743) Fixed the alignment of the bundles' product cards.
- [RUN-193](https://whirlpoolgtm.atlassian.net/browse/RUN-193) Optimized all the image assets in the theme.

## [7.0.13] - 2023-03-06

- [RUN-758](https://whirlpoolgtm.atlassian.net/browse/RUN-758) Pre-order landing page - Leo and Da Vinci
- [RUN-757](https://whirlpoolgtm.atlassian.net/browse/RUN-757) Bundles on PDP - enable switching off/on

## [7.0.12] - 2023-03-01

- [RUN-765](https://whirlpoolgtm.atlassian.net/browse/RUN-765) PDP Popup cross sell.

## [7.0.9] - 2023-02-27

- [RUN-566](https://whirlpoolgtm.atlassian.net/browse/RUN-566) Flixmedia implementation.

## [7.0.7] - 2023-02-15

- [RUN-145] Popup cross sell: new UX/UI.

## [7.0.6] - 2023-02-15

### fixed

- [RUN-148](https://whirlpoolgtm.atlassian.net/browse/RUN-148) Fixed some minor issues for the injection of Youreko's badge in PLPs and PDPs.

## [7.0.5] - 2023-02-01

### added

- [RUN-225](https://whirlpoolgtm.atlassian.net/browse/RUN-225) Search bar: Add price and instock/oos info on researched product.

## [7.0.2] - 2023-01-30

### added

- [RUN-316](https://whirlpoolgtm.atlassian.net/browse/RUN-316) Added a new collection's badge in PDP, PLP and carousels.

## [7.0.1] - 2023-01-24

### fixed

- fixed seo text on mobile for custom plp [INC2319542](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=e5c26b708764a15c5e0ebae6dabb353f%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [7.0.0] - 2023 - 01 - 23

- [RUN-307](https://whirlpoolgtm.atlassian.net/browse/RUN-307) Implement Bundle IT solution

## [6.0.11] - 2023 - 01 - 23

- [RUN-325](https://whirlpoolgtm.atlassian.net/browse/RUN-325) PDP for discontinued products: re-design and increasing the UX

## [6.0.10] - 2023 - 01 - 20

- Fixed mobile "add to cart" button shown for not in stock products

## [6.0.9] - 2023 - 01 - 20

- Fixed desktop "add to cart" button shown for not in stock products

## [6.0.8] - 2023 - 01 - 16

- Had to bump the version again because of Husky causing problems

## [6.0.7] - 2023 - 01 - 16

- Added the block into header.jsonc and manifest reference for the custom app wia-canonical-fix

## [6.0.5] - 2023-01-09

-[RUN-290](https://whirlpoolgtm.atlassian.net/browse/RUN-290) CR: alignment of the carousel in desktop

## [6.0.4] - 2023-01-06

[INC2313123](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=f62fa0a4975869985b0eb9bfe153af1c%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

### Added

- **default-shelf.jsonc** vtex.product-highlights@2.x:product-highlights#badgePromoPDP and vtex.product-highlights@2.x:product-highlights#badgePromoPLP added highlightName "-30€ de remboursement différé","-40€ de remboursement différé","-50€ de remboursement différé","-70€ de remboursement différé","-80€ de remboursement différé","-100€ de remboursement différé"

## [6.0.3] - 2022-12-22

- Fixed hidden menu in footer

## [6.0.2] - 2022-12-20

- Fixed hidden menu in footer

## [6.0.1] - 2022-12-14

- Removed chatbot from theme and update shippingCustom custom app

## [5.0.0] - 2022-12-05

- Updated with sponsor apps and Analytics enhancement

## [3.0.14-beta.20] - 2022-12-06

- Removed the old fonts
- Removed unused fonts and font faces
- Added new woff2 fonts

## [3.0.13] - 2022-11-29

### fixed

- Fixed reverted content

## [3.0.12] - 2022-11-24

### fixed

- Fixed black friday page

## [3.0.11] - 2022-11-22

### Added

- [WI-893] Resolve bug related to Black friday carousel

## [3.0.10] - 2022-11-21

### fixed

- Adjust conditional layout for cashback offer

## [3.0.9] - 2022-11-21

### fixed

- Add conditional layout for another cashback offer

## [3.0.8] - 2022-11-21

### fixed

- Add conditional layout for cashback offer

## [3.0.7] - 2022-11-15

### fixed

- Fixed black friday landing carousels

## [3.0.4] - 2022-11-15

### fixed

- Remove unused blocks from product.jsonc to clean pdp

## [3.0.3] - 2022-11-15

### fixed

- Fixed black friday landing

## [3.0.2] - 2022-11-14

### updated

- Added cashback offer badge for collection 429 and 430

## [3.0.1] - 2022-11-08

### updated

- CHanged black friday title

## [3.0.0] - 2022-11-02

### added

- New black friday page

## [1.0.350] - 2022-11-02

### added

- Added fast delivery

## [1.0.349] - 2022-10-26

### added

- added a position relative to the additional services box on mobile **frwhirlpool.servizi-aggiuntivi-pdp.css** [INC2278541](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=471e20dd97369590a701d400f153afa3%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [1.0.346] - 2022-10-18

### Changed

- Activated cash back offer for collection 418, 419, 420

## [1.0.344] - 2022-10-18

### Changed

- restored lead time label [SCTASK0838187](https://whirlpool.service-now.com/nav_to.do?uri=%2Fsc_task.do%3Fsys_id%3Db14291b687129190d2b72f45dabb3527)

## [1.0.343] - 2022-10-17

### Fixed

-fix style for well being articles templates [INC2271678](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=c0acb68187ee959015ae65b73cbb35f2%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [1.0.342] - 2022-10-17

- Added "head-json-component" blocks to wellbeing , wellbeing-article and wellbeing-category and declaration in the manifest

## [1.0.340] - 2022-10-13

### Fixed

hide out of stock labelon PDP PLP [INC2271523](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=a42a5e4947e6dd54107926c2846d437e%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [1.0.339] - 2022-10-13

### Fixed

fixed line-hieght title/paragraph **vtex.rich-text.css** [INC2270178](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=cd989b1c87aed95015ae65b73cbb3586%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [1.0.338] - 2022-10-13

### Fixed

The version installed in master **1.0.337** not merged/present in the main. resloving this incident by releasing the **1.0.336** as **1.0.338** [INC2269880](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=7153738087e2595015ae65b73cbb358a%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [1.0.336] - 2022-10-03

### Fixed

Fix bug related to additional services on mobile pdp [WI-629](https://whirlpoolgtm.atlassian.net/browse/WI-629)

## [1.0.335] - 2022-09-28

### Added

Add alma widget to pdp

## [1.0.334] - 2022-09-28

### Changed

Add pdf link for some pdp article inside specific collection

## [1.0.304] - 2022-09-2

### Changed

New additional services style [WI-275](https://whirlpoolgtm.atlassian.net/browse/WI-275)

## [1.0.303] - 2022-09-19

### Changed

Changed french days page [WI-517](https://whirlpoolgtm.atlassian.net/browse/WI-517)

## [1.0.302] - 2022-09-19

### Changed

Align homepage banner with the one on whirlpool Italy. Copied the same component and brought it on France

## [1.0.300] - 2022-09-14

[SCTASK0801193](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=1a61488b9790d110c2a8b0afe153af01%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

### Changed

- **product.jsonc** changed _condition-layout.product#hasCashbackSoldes9_ and related _link.product#hasCashbackSoldes9_ to add PDF link for collection 400 and 401.

### Added

- **default-shelf.jsonc** vtex.product-highlights@2.x:product-highlights#badgePromoPDP and vtex.product-highlights@2.x:product-highlights#badgePromoPLP added highlightName "60€ remboursés" to handle collection 401 badge.

## [1.0.299] - 2022-09-14

[WI-175](https://whirlpoolgtm.atlassian.net/browse/WI-175)

- Release energy label logo and link inside checkout, cart and order confirmation

## [1.0.298] - 2022-09-13

Fixed back to school promotions page by adding a toggle layout

## [1.0.297] - 2022-09-12

[DC-844] Release the FE activities for the Product Comparison Form

## [1.0.295] - 2022-08-29

[DC-832](https://whirlpoolgtm.atlassian.net/browse/DC-832)

- Release Fix Parallel Campaign for WH FR

## [1.0.294] - 2022-08-09

### Added

- _helmet-components.homepage_ block in **home.jsonc**, block related to _helmet-components_ custom app and used to add meta tag for Facebook. [SCTASK0813177](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=e4d2e37197011d145f83b3a3f153af6c%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.293] - 2022-08-02

[RB-1005](https://whirlpoolgtm.atlassian.net/browse/RB-1005)
Fix Log out section: border overlapping

## [1.0.292] - 2022-08-01

### Changed

- **home.jsonc** commented fold blocks in order to let the SEO description at the end of the homepage available even without scrolling the page to the end. [INC2231266](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=9040cc0c87495190e4dc53d73cbb3518%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [1.0.291] - 2022-07-28

[RB-1022](https://whirlpoolgtm.atlassian.net/browse/RB-1022)
Fix the banner in Mobile Custom PLP

## [1.0.290] - 2022-07-27

[RB-1022](https://whirlpoolgtm.atlassian.net/browse/RB-1022)
Integrate a new Banner in the PLP - only Mobile Version [WHR FR]

## [1.0.289] - 2022-07-27

### Changed

- **custom-plps.jsonc** changed block _search-result-layout.mobile_ in _search-result-layout.customQuery#customPLP_ to _search-result-layout.mobile#customPLP_ in order to have mobile layout as the desktop one (mainly for breadcrumbs). [SCTASK0810339](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=db90e25b47bc5d109a54d65c346d436a%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff).

## [1.0.286] - 2022-07-25

### Added

- **product.jsonc** added _condition-layout.product#hasCashbackSoldes9_ and related _link.product#hasCashbackSoldes9_ to add PDF link for collection 386 and 387. [SCTASK0801193](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=1a61488b9790d110c2a8b0afe153af01%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [Unreleased]

## [1.0.285] - 2022-07-20

[RB-967](https://whirlpoolgtm.atlassian.net/browse/RB-967)
HomePage Arrows on the Mobile Carousel [WHR FR]

## [1.0.278] - 2022-06-27

### Changed

- **wellbeing.jsonc** and **nouveautes-jsonc** changed breadcrumbs as required from business. [SCTASK0778436](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=48ff6be0479345dc073e68aaf36d433b%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.277] - 2022-06-23

[RB-881](https://whirlpoolgtm.atlassian.net/browse/RB-881)
Remove responsive layout - Page Articles

## [1.0.275] - 2022-06-21

### Added

- **default-shelf.jsonc** added "Soldes" in vtex.product-highlights@2.x:product-highlights#badgePromoPLP and vtex.product-highlights@2.x:product-highlights#badgePromoPDP in order to show "Soldes" collection badge. [SCTASK0797795](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=7d1c9a50971815545b0eb9bfe153afdd%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.273] - 2022-06-14

### Changed

- **T&C-template.jsonc** and **vtex.rich-text.css** added black border in a part of text as for legal requirment. [SCTASK0794589](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=1aa6c13d978cdd505b0eb9bfe153afb4%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.272] - 2022-06-14

[RB-825] Release two badge on PLP/PDP

## [1.0.271] - 2022-06-09

### Changed

- Ripristinated the wellbeing access point in the header to go live in prod with it

## [1.0.270] - 2022-06-09

### Changed

- Commented out the wellbeing access point in the header to go live in prod without it

## [1.0.269] - 2022-06-09

### Changed

- Made fixes on Wellbeing section

## [1.0.268] - 2022-05-30

### Added

- **product.jsonc** added _condition-layout.product#hasCashbackSoldes8_ and _condition-layout.product#hasCashbackSoldes7_ to add PDF link for collection 375. [SCTASK0787665](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=f43fbcf7472f4950a6c91978f36d4330%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.267] - 2022-05-24

### Added

- **product.jsonc** added _condition-layout.product#hasCashbackSoldes6_ and _condition-layout.product#hasCashbackSoldes7_ to add PDF link for respectively collections 364, 365, 366 and 371, 372, 373, 374.
- **default-shelf.jsonc** added highlightName "400€ remboursés" to handle badge collection 374.

MoB tickets:

- [SCTASK0785015](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=a26af5b147634d50a6c91978f36d437f%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)
- [SCTASK0786784](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=44a1e21347634150a6c91978f36d43bf%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.266] - 2022-05-24

### Added

- [RB-697/604] Added new PLP subcategories template (lavage).

## [1.0.265] - 2022-05-16

### Added

- [RB-571/2/3/4/5] Added new Wellbeing (Bien-etre) section: Homepage, Category, Article, PLP and 6th Sense pages.

## [1.0.264] - 2022-05-13

### Added

- Added PDF cashback link for collection ID _363_ in **product.jsonc** [SCTASK0782087](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=103129af47d7c5dca6c91978f36d433d%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.263] - 2022-05-11

### Removed

Removed "display: none" that was causing badge and pdf link to not be shown for collection 329 and 330:

- **css/product/vtex.rich-text.css** --> _wrapper--cashbackPDF_
- **css/vtex.flex-layout.css** --> _flexRow--soldesCashbackRow_
  [SCTASK0781056](https://whirlpool.service-now.com/sc_task.do?sys_id=ca8307f24753c99ca6c91978f36d4312&sysparm_record_target=sc_task&sysparm_record_row=2&sysparm_record_rows=23&sysparm_record_list=assignment_group%3Dfb66e9141b373090ee1f0d85604bcbe0%5EstateIN1%2C-5%2C2%5EORDERBYDESCopened_at)

## [1.0.262] - 2022-05-11

[RB-728] Searchbar titles

## [1.0.261] - 2022-05-09

[RB-675] Release new searchbar funcionality

## [1.0.259] - 2022-05-03

[RB-629] Fix promo badge and link Special Offer

## [1.0.257] - 2022-05-03

[RB-629] Release promo badge and link Special Offer

## [1.0.254] - 2022-04-11

### Changed

- Removed duplicated _minicart.v2_ from _flex-layout.row#mobile_ and _flex-layout.row#desktop_ in _header.jsonc_ as this cause a duplicated minicart view when a product is added to the cart. [INC2170538](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=bcd95dd81bbe4dd019e60f66624bcb49%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8).
- Changed some css rules for _sliderTrackContainer_ in _frwhirlpool.slider-layout.css_ in order to display sliders corretly. [INC2170410](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=51b005141b72c9d01de88666624bcbcb%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [1.0.253] - 2022-04-04

### Changed

- **w-cottura.jsonc** changed the video component from _"video#cottura"_ to _"flex-layout.row#iframeLandingPage"_ which use iframe component and support Thron video. [SCTASK0758308](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=5f783e631bc6451499f51f47b04bcbca%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.252] - 2022-03-29

[WHP FR - FUNREQ40 Promotion View/click](https://whirlpoolgtm.atlassian.net/browse/D2CA-609)

- Added `analytics-wrapper-component` from HP UK
- Wrapped button of promotion banners in homepage with `analytics-wrapper-component` to enable `eec.promotionView` and `eec.promotionClick` analytics events to trigger

## [1.0.251] - 2022-03-28

### Added

- "_condition-layout.product_" for collections with ID 329, 330. [SCTASK0764055](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=a1c7744d976645108a979c14a253af2e%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.249] - 2022-03-25

### Added

- "_condition-layout.product_" for collections with ID 326, 327, 328. [SCTASK0763532](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=7306a284472a495091493518946d4341%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.248] - 2022-03-24

[RB-463] Add breadcrumbs custom on PLP and PDP

## [1.0.247] - 2022-03-15

### Changed

- **vtex.search-result.css** commented _.filterTemplateOverflow {}_ in order to show scroll bar in filter with many options. [INC2153202](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=d4e2ca6f97020d106aa7fe3bf253af62%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [1.0.244] - 2022-02-21

### Changed

- Added _promotion-menu_ and _promotions-submenu_ to header for "_Nos Offres_" and also the reference to related custom app **_frwhirlpool.promotions-submenu_**.
  Jira ticket: [RB-158](https://whirlpoolgtm.atlassian.net/browse/RB-158)
  MOB ticket: [SCTASK0744479](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=b81461591b2d41906147a688b04bcb66%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [1.0.243] - 2022-02-10

## [1.0.242] - 2022-02-10

## [1.0.241] - 2022-02-02

## [1.0.240] - 2022-01-28

## [1.0.239] - 2022-01-27

## [1.0.237] - 2022-01-24

## [1.0.236] - 2022-01-24

## [1.0.180] - 2021-11-24

## [1.0.151] - 2021-10-11

## [1.0.147] - 2021-10-08

## [1.0.146] - 2021-10-07

## [1.0.145] - 2021-10-07

## [1.0.144] - 2021-10-07

## [1.0.143] - 2021-10-07

## [1.0.142] - 2021-10-07

## [1.0.139] - 2021-10-06

## [1.0.136] - 2021-10-05

## [1.0.135] - 2021-10-05

## [1.0.134] - 2021-10-05

## [1.0.132] - 2021-10-04

## [1.0.131] - 2021-10-04

## [1.0.130] - 2021-10-04

## [1.0.129] - 2021-10-04

## [1.0.127] - 2021-10-02

## [1.0.126] - 2021-10-01

## [1.0.125] - 2021-10-01

## [1.0.120] - 2021-10-01

## [1.0.119] - 2021-10-01

## [1.0.118] - 2021-10-01

## [1.0.116] - 2021-09-30

## [1.0.115] - 2021-09-30

## [1.0.111] - 2021-09-29

## [1.0.110] - 2021-09-29

## [1.0.108] - 2021-09-28

## [1.0.107] - 2021-09-28

## [1.0.104] - 2021-09-27

## [1.0.101] - 2021-09-24

## [1.0.100] - 2021-09-24

## [1.0.98] - 2021-09-23

## [1.0.96] - 2021-09-23

## [1.0.95] - 2021-09-23

## [1.0.94] - 2021-09-23

## [1.0.93] - 2021-09-23

## [1.0.92] - 2021-09-21

## [1.0.91] - 2021-09-21

## [1.0.90] - 2021-09-20

## [1.0.86] - 2021-09-18

## [1.0.85] - 2021-09-17

## [1.0.84] - 2021-09-17

## [1.0.82] - 2021-09-17

## [1.0.81] - 2021-09-17

## [1.0.80] - 2021-09-16

## [1.0.79] - 2021-09-16

## [1.0.77] - 2021-09-15

## [1.0.76] - 2021-09-13

## [1.0.75] - 2021-09-13

## [1.0.67] - 2021-09-08

## [1.0.66] - 2021-09-08

## [1.0.64] - 2021-09-07

## [1.0.59] - 2021-09-03

## [1.0.9] - 2021-07-26

## [1.0.8] - 2021-07-26

## [1.0.7] - 2021-07-26

## [1.0.0] - 2021-07-20

## [0.0.8] - 2021-07-01

## [0.0.7] - 2021-07-01

## [0.0.6] - 2021-07-01

## [0.0.4] - 2021-06-14

## [0.0.3] - 2021-06-11

## [5.0.0] - 2021-03-27

## [4.1.0] - 2021-03-27

## [3.41.0] - 2020-10-08

### Added

- Example of [vtex.product-highlight](https://github.com/vtex-apps/product-highlights) usage.

### Changed

- Change files and folder structure so it's easier to find the blocks.

### Removed

- Unused blocks.

## [3.40.0] - 2020-10-07

### Added

- "Contact us" page as example of [vtex.store-form](https://github.com/vtex-apps/store-form) usage.

## [3.39.2] - 2020-10-06

### Fixed

- `minicart.v2` opening itself on **all** `addToCart` events, including the ones triggered by quantity changes in the checkout cart.

## [3.39.1] - 2020-10-05

### Fixed

- `icon-cart` being bigger than it should.

## [3.39.0] - 2020-09-30

### Added

- Example of how to make the `minicart.v2` block respond to the `addToCart` pixel event.

## [3.38.0] - 2020-09-10

### Added

- `disclosure-layout` example.

### Removed

- `public` folder.

## [3.37.2] - 2020-07-30

### Fixed

- Active **background** `action-secondary` color from `#dbe9fd` to `#d2defc`
- Active **border** `action-secondary` color from `#dbe9fd` to `#d2defc`

## [3.37.1] - 2020-07-08

### Changed

- Change URL of the docs in README

## [3.37.0] - 2020-05-18

### Changed

- PreventRouteChange to `false`.

## [3.36.0] - 2020-05-11

### Added

- Add input values for recursive assemblies

## [3.35.0] - 2020-04-13

### Added

- `aspectRatio` and `maxHeight` on `product-summary-image#shelf`.

### Fixed

- Some styles on product summary and price components.

## [3.34.0] - 2020-04-07

### Added

- `fetch-more` and `fetch-previous` buttons on mobile.

## [3.33.0] - 2020-04-02

### Changed

- Price blocks on `product-summary` and on the PDP to use the new blocks from `vtex.product-price`
- Product title style on PDP.

## [3.32.0] - 2020-03-20

### Changed

- Use `__fold__.experimentalLazyAssets` on home.

## [3.31.0] - 2020-03-19

### Added

- `product-gifts` block to `store.product`.

## [3.30.1] - 2020-03-06

### Fixed

- Fix version of the app.

## [3.29.0] - 2020-03-06

## [3.28.0] - 2020-03-05

### Added

- `__fold__` blocks on home.
- `aspectRatio` prop on `product-images`.

## [3.27.0] - 2020-03-03

### Added

- `store.not-found#search` block.

## [3.26.1] - 2020-02-20

### Changed

- Limit the width of the search bar input instead of its container.

### Fixed

- Logo animation when header sticks to the top of the page.

### Added

- `prefers-reduced-motion` query to remove animation for users which don't want unnecessary animations.

## [3.26.0] - 2020-02-18

### Changed

- Refactor the `header` with native IO blocks.

### Added

- Animations to the `header` when it sticks to the top of the page.

## [3.25.0] - 2020-02-06

### Changed

- `vtex.carousel` in favor of using `list-context.image-list` and `slider-layout`.
- `vtex.shelf` in favor of using `list-context.product-list` and `slider-layout`.

## [3.24.0] - 2020-02-05

### Added

- `height` on `product-summary-image`

## [3.23.2] - 2020-02-03

### Changed

- Make search use cold prices by default.

## [3.23.1] - 2020-01-27

### Fixed

- Use default `minicart.v2` from `vtex.minicart`.

## [3.23.0] - 2020-01-27

### Added

- `store.not-found#product` block.

## [3.22.0] - 2020-01-23

### Added

- `product-bookmark` blocks.

## [3.21.2] - 2020-01-22

### Fixed

- Layout on search pages with few results but a big filter sidebar.

## [3.21.1] - 2019-12-27

### Fixed

- Use docs builder.

## [3.21.0] - 2019-12-20

### Added

- `showValueNameForImageVariation` to `sku-selector`.

### Changed

- Remove product-identifier.

## [3.20.2] - 2019-12-19

### Fixed

- Menu links and layout

## [3.20.1] - 2019-12-18

### Changed

- Use `styles-builder@2.x`.

## [3.20.0] - 2019-12-17

### Changed

- Use new flexible `minicart.v2` and `add-to-cart-button`.

### Added

- Custom CSS styles for `product-identifier`.

## [3.20.0-beta.0] - 2019-12-11

## [3.20.0-beta] - 2019-12-06

## [3.19.2] - 2019-12-16

### Fixed

- `minItemsPerPage` prop in `shelf#home` block.

## [3.19.1] - 2019-12-03

## [3.18.2] - 2019-12-03

### Fixed

- Add missing dependencies

## [3.18.1] - 2019-11-11

### Fixed

- Use the proper API to space SKU Selector

## [3.18.0] - 2019-11-11

### Fixed

- Product page spacing issues.

### Added

- Product description.

## [3.17.2] - 2019-11-08

### Added

- Use `skusFilter` `FIRST_AVAILABLE` value.

## [3.17.1] - 2019-11-06

### Fixed

- Remove usage of deprecated selectors.

## [3.17.0] - 2019-11-06

### Changed

- PreventRouteChange to `true`.

## [3.16.2] - 2019-10-17

### Changed

- Default font.

## [3.16.1] - 2019-10-08

## [3.16.0] - 2019-10-07

### Added

- The `search-fetch-previous` block to the search result.

## [3.15.1] - 2019-09-23

## [3.15.0] - 2019-09-18

### Added

- Add sitemap builder with about-us url

## [3.14.0] - 2019-09-18

### Added

- Product Customizer to PDP.

## [3.13.1] - 2019-09-10

### Fixed

- Use `search-fetch-more`.

## [3.13.0] - 2019-09-10

### Changed

- Use flexble layout for `search-result`.

## [3.12.0] - 2019-08-27

### Added

- Accordion menu to footer on mobile.

## [3.11.0] - 2019-08-20

### Changed

- Use `flex-layout` to define the `footer` block.

### Fixed

- Missing padding in the Footer.

## [3.10.0] - 2019-08-16

### Removed

- `product-add-to-list-button` from `flex-layout.col#product-image` so that it isn't rendered in the products page.

### Added

- New props (`minItemsPerPage` and `paginationDotsVisibility`) for the Shelf component to `shelf#home`.

## [3.9.1] - 2019-08-14

### Fixed

- Remove incorrect props from search-result block.

## [3.9.0] - 2019-08-07

### Added

- created a `breadcrumb` block with `showOnMobile` set to true

## [3.8.0] - 2019-08-01

### Added

- `mobileLayout` prop to `search-result` block.

## [3.7.2] - 2019-07-31

### Fixed

- Add product-review-form block to avoid falling back to the default layout.

## [3.7.1] - 2019-07-26

### Changed

- fixed some errors in the category-menu

## [3.7.0] - 2019-07-23

### Added

- `displayThumbnailsArrows` to the `product-images` block.

## [3.6.1] - 2019-07-17

### Changed

- Split the blocks.json into multiple files.

## [3.6.0] - 2019-07-04

### Added

- Add `product-identifier.product` to the product page.
- Add `product-identifier.summary` to the product summary.

## [3.5.1] - 2019-06-12

### Fixed

- Show the heart icon of wish list in product details.

## [3.5.0] - 2019-06-11

### Added

- Product Review interfaces to PDP and shelf.

### Changed

- `product-summary` to `product-summary.shelf` so it's possible to add product review interfaces in the shelf.

## [3.4.2] - 2019-06-11

### Added

- Example of institutional page.

## [3.4.1] - 2019-06-10

### Changed

- Use new `filter-navigator`.

## [3.4.0] - 2019-06-04

## [3.3.0] - 2019-06-04

### Changed

- Changed logo position in header.

## [3.3.0] - 2019-06-04

### Changed

- Product details is now broken down into smaller blocks, inserted directly into `store.product`.

## [3.2.1] - 2019-05-28

### Fixed

- `labelListPrice` and `labelSellingPrice` defaults.

## [3.2.0] - 2019-05-28

### Added

- `LocaleSwitcher` component to the `Header`.

## [3.1.1] - 2019-05-27

## [3.1.0] - 2019-05-25

### Fixed

- Changed the way props are declared in product-summary and product-details.

### Changed

- New store layout using flexible blocks for Header and Footer.

## [2.4.1] - 2019-05-17

### Added

- Add `under construction` status to product kit

## [2.4.0] - 2019-05-09

### Added

- Add `labelListPrice` in product-details and summary blocks.

## [2.3.1] - 2019-05-06

## [2.3.0] - 2019-03-27

### Added

- Add `product-highlights` in `product-details#default` block.

## [2.2.2] - 2019-05-02

- Add `store.orderplaced` block definition to `blocks.json`.

## [2.2.1] - 2019-03-18

### Fixed

- Include missing dependencies. Previously, it was working only due to a dependency leak on IO, but the store-theme was breaking since that problem was fixed.

## [2.2.0] - 2019-02-18

### Changed

- Update app name to `store-theme` instead of `dreamstore`.
- Change `related-products` for `shelf.relatedProducts`.

## [2.1.0] - 2019-02-12

### Added

- Add product-specifications in product-details block.

## [2.0.2] - 2019-02-05

### Fixed

- Moved hard-coded store version dependency from 2.0.0 to 2.x

## [2.0.1] - 2019-02-05

### Added

- Add new required blocks for `ProductDetail`.

## [2.0.0] - 2019-02-01

### Added

- Add profile challenge block on account.
- Bye `pages.json`! Welcome `store-builder`.
- Add styles builder 1.x
- Two new nav icons.
- New Icon for telemarketing.
- Default padding setted on body.
- Dreamstore with Design Tokens! :tada

### Changed

- Configure blocks props.
- Remove `global.css` and bump `vtex.store` to 2.0.0.
- Adjust search-result blocks configuration.

## [1.18.6] - 2018-12-20

### Fixed

- Remove Fabriga font from global.css.

## [1.18.5] - 2018-11-23

### Changed

- Update Search Result icons.

## [1.18.4] - 2018-11-23

### Changed

- Update Profile and Minicart Icon.

## [1.18.3] - 2018-11-07

### Fixed

- Fix paddings to match header.

## [1.18.2] - 2018-11-01

### Added

- `IconPack` component to serve the icon used by the dreamstore components.

## [1.18.1] - 2018-10-25

## [1.18.0] - 2018-10-02

### Added

- Component definitions for `vtex.search-result` new extension points.

## [1.17.0] - 2018-10-02

### Removed

- Remove unused queries and tests.

## [1.16.0] - 2018-09-26

### Changed

- Import footer from the new app `vtex.dreamstore-footer`.

## [1.15.2] - 2018-09-20

### Fixed

- Remove Category Menu CSS class definition.

### Changed

- Remove `package-lock.json` from react/ folder.

## [1.15.1] - 2018-09-19

### Changed

- Moved product details breadcrumb to be inside of the `ProductDetails`.

## [1.15.0] - 2018-09-18

### Added

- `Header` standalone component.

## [1.14.1] - 2018-09-18

### Added

- Add again Telemarketing app to the Header extension point.

## [1.14.0] - 2018-09-14

### Added

- `Logo` and `SearchBar` as extensions of the `Header`.

## [1.13.3] - 2018-09-12

### Added

- Page padding class to allow apps to have same default padding.

### Removed

- Unused dependency `vtex.product-summary`

## [1.13.2] - 2018-09-05

### Fixed

- **HotFix** Remove telemarketing app from dreamstore.

## [1.13.1] - 2018-09-05

### Fixed

- Fix malformed release.

## [1.13.0] - 2018-09-05

### Added

- Add `vtex.my-account` app.

## [1.12.2] - 2018-08-30

### Changed

- Bump version of `vtex.store-components` and `vtex.styleguide`.

## [1.12.1] - 2018-08-24

### Fixed

- Fix carousel position in home page.

## [1.12.0] - 2018-08-24

### Changed

- Renamed `SearchResult` to `index`.
- Bumped `vtex.search-result` to version 1.x.

## [1.11.0] - 2018-08-24

### Changed

- Bump major of `vtex.category-menu`.

## [1.10.5] - 2018-08-17

### Changed

- Update `menu` and `minicart` versions to 1.x.

## [1.10.4] - 2018-08-17

## [1.10.3] - 2018-08-16

### Fixed

- Rollback rename `CategoriesHighlights`.

## [1.10.2] - 2018-08-16

### Changed

- Undeprecate v1.10.1.

## [1.10.1] - 2018-08-15

### Changed

- `CategoriesHighlights` to `CategoriesHightlighted`.
- Bump `vtex.telemarketing` to 1.x.

## [1.10.0] - 2018-08-14

## [1.9.5] - 2018-08-13

### Added

- Component `ImpersonateCustomer` to `Header`.
- DepartmentHeader component to wrap Carousel and MainCategories components.
- Department page template.

## [1.9.4] - 2018-08-02

### Changed

- Bump `vtex.styleguide` major version.

## [1.9.3] - 2018-07-30

### Fixed

- Fix the `my-orders` rendering error.

## [1.9.2] - 2018-07-27

### Changed

- Update `vtex.login` version.

## [1.9.1] - 2018-07-24

### Changed

- Bump my-orders version dependency to use stable.

## [1.7.0] - 2018-07-09

### Added

- Loading extension to pages.json

## [1.6.0] - 2018-7-6

### Added

- Add ProductKit to pages.json

## [1.5.1] - 2018-7-6

### Removed

- Moved `store/login/container` to `vtex.store`.

## [1.5.0] - 2018-7-6

### Added

- `vtex.login/LoginContent` to `store/login/container` extension point.

## [1.4.0] - 2018-7-6

### Added

- Add `SearchResult` to the brand page.

## [1.3.2] - 2018-7-4

### Changed

- Use `store-components/Header` instead internal component `Header`.

## [1.3.1] - 2018-6-27

### Changed

- `pages.json` to inject `search-result` into `CategoryPage`

### Fixed

- Remove the integration with `vtex.my-orders-app`.

## [1.3.0] - 2018-6-20

### Added

- Add `vtex.shelf/RelatedProducts` component to the product page.

## [1.2.2] - 2018-6-15

### Fixed

- Fix incorrect build made by builder-hub

## [1.2.1] - 2018-6-14

### Fixed

- Fix my-orders-app version in manifest.json

## [1.2.0] - 2018-6-14

### Added

- Add integration with `vtex.search-result`.
- Add integration with `vtex.my-orders-app`.

### Removed

- Remove dependency `vtex.gallery`.
- Remove `GalleryWrapper` component.
- Remove file `queries/productsQuery.gql`.

### Fixed

- Adapt Top Menu CSS to integrate `vtex.login`.

## [1.1.0] - 2018-6-8

### Added

- _Login_ component to the _Header_.
- Add `vtex.styleguide` dependency.

## [1.0.0] - 2018-6-4

### Added

- Add the breadcrumb component to the SearchPage and ProductPage

### Fixed

- Removed redundant Spinner in _ProductPage_ Component.

### Added

- **Breaking Change** Now, dreamstore-theme is a template based on `vtex.store`.
- Add free billing policy in `manifest.json`.
- Add the breadcrumb component to the `SearchPage` and `ProductPage`.

### Changed

- Changed `postreleasy` script to publish only on vtex vendor.

## [0.3.5] - 2018-05-21

### Fixed

- Fix pages dependency to be able to use `ExntesionContainer` again.
- `Topbar` when scrolled overlapped the `VTEX-topbar`.
- Update css product details class for the spinner be in the center.

## [0.3.4] - 2018-05-19

### Changed

- Update version of `vtex.storecomponents` to 1.x

## [0.3.3] - 2018-05-18

### Added

- Add toast message system to be used on error scenarios.

### Fixed

- Fix padding top of product page content

## [0.3.2] - 2018-05-18

### Fixed

- Top menus covering great portion of the page.
- Fix pages error when ExtensionContainer was used.

## [0.3.1] - 2018-05-12

### Fixed

- Display category menu only in large screens.
- Fix padding-top of Product page.

## [0.3.0] - 2018-05-12

### Added

- Add category menu and fix padding.
- Add the search bar component and make header responsive again.

### Fixed

- Fix minicart div position
- Remove flex box from product page to fix non-expected behavior of react-slick

## [0.2.0] - 2018-05-11

### Added

- Show success toast when a product is add to the cart.
- Add responsive layout to the header.
- Add gallery to the search page.

## [0.1.0] - 2018-05-11

### Added

- Add the search bar component

### Changed

- Replace own Footer implementation by `vtex.storecomponents/Footer` component.

## [0.0.11] - 2018-05-09

### Added

- Add Product Details app.

### Deprecated

- Remove legacy implementations of buy button and minicart.

## [0.0.10] - 2018-05-09

### Added

- Add Minicart app.

## [0.0.9] - 2018-05-07

### Added

- Add Menu app on top bar.

### Deprecated

- Remove the own implementation of shelf to add the app.
