# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [16.0.4] - 2023-08-09
## [16.0.3] - 2023-08-01

### Fixed

[SEOPOD-1090](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-1090) Fix pagination issue on PLPs (correct anchor element added to fetch more buttons).

## [16.0.2] - 2022-07-17

- [RUN-1479](https://whirlpoolgtm.atlassian.net/browse/RUN-1479) [Header] Add a new voice in the menu [WHR IT]
  
## [16.0.1] - 2022-07-10

### Added
[run-1866](https://whirlpoolgtm.atlassian.net/browse/RUN-1866) add integration with fareye inside pixel app
## [16.0.0] - 2022-06-28

### Added

[SEOPOD-534](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-534) Added hrefLangs feature in PLPs.

## [15.0.3] - 2022-06-27

- [SEOPOD-941](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-941) added fold for lazy loading after slider in mobile homepage

## [15.0.2] - 2022-21-06

- [SCTASK0920203](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=cb1c4aa3471f6990b079908f746d43a4) fix banner img as background

## [15.0.1] - 2022-21-06

- [RUN-1794](https://whirlpoolgtm.atlassian.net/browse/RUN-1794) Add strikethrough text, additional text in main banner

## [15.0.0] - 2022-21-06

- [RUN-1830](https://whirlpoolgtm.atlassian.net/browse/RUN-1830) - Release app fareye WHP IT

## [14.0.2] - 2023-06-19

- [RUN-1646](https://whirlpoolgtm.atlassian.net/browse/RUN-1646) Update table structure in 2.2 section

## [14.0.0] - 2023-05-30

### Added

- added _whirlpoolemea.meta-helmet-handler_ peerDependency to inject the meta tag inside the **store.custom#landingPage** template in order no add the noindex attribute to the `assistenza-fuori-garanzia` pages [SCTASK0912503](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=4f8ef8a0470bad1063277645d36d4333%26sysparm_view=RPTb6af9f9587008954e4bc7447cebb35c7)

## [13.0.12] - 2023-05-22

- [SEOPOD-910](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-910) added optimized icons in the banner-below-header

## [13.0.11] - 2023-05-17

Fix image unsellable products pdp

## [13.0.10] - 2023-05-17

- [SEOPOD-863](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-863) removed sku-selector app
- [SEOPOD-863](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-863) added new props for the app whirlpoolemea.product-image
- [SEOPOD-908](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-908) added loading attribute to banner-warranty-10 image
- [SEOPOD-908](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-908) added a resized warranty banner image in CMS, in phone view only

## [13.0.9] - 2023-05-17

- [RUN-1186](https://whirlpoolgtm.atlassian.net/browse/RUN-1186) PDP: CS update promo banner

## [13.0.8] - 2023-05-10

Fix PDP Pre order part

## [Unreleased]

## [5.0.14] - 2023-05-09

fix style on file itwhirlpool.slider-layout.css

.sliderTrack--shelfBlackFriday{
width: 187% !important;
}
--removed

## [13.0.6] - 2023-05-09

- [RUN-1480](https://whirlpoolgtm.atlassian.net/browse/RUN-1480) Improving filter section in custom PLP template

## [13.0.5] - 2023-05-02

- [SEOPOD-905](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-905) Fixed images width and height in Homepage to reduce CLS.

## [13.0.4] - 2023-05-02

- [SEOPOD-903](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-903) Fixed images width and height in PDP to reduce CLS.

## [13.0.3] - 2023-05-02

- [SEOPOD-904](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-904) Fixed images width and height in PLP to reduce CLS.

## [13.0.2] - 2023-05-01

stable version released

## [12.0.1] - 2023-04-19

### Changed

- Changed position of the _Price Drop Alert_ button both for mobile and desktop. [DC-1702](https://whirlpoolgtm.atlassian.net/browse/DC-1702)

## [12.0.0] - 2023-04-06

### Added

- **product.jsonc** added _promotional-offer_ component [SCTASK0890456](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=263c63b7c3ed61d0d19bafdc7a01313e%26sysparm_view=RPTb6af9f9587008954e4bc7447cebb35c7)

- [RUN-996](https://whirlpoolgtm.atlassian.net/browse/RUN-996) Create template with SNCE content + Product carousel [WHP IT]

## [11.0.0] - 2023-03-29

## [10.0.5] - 2023-03-28

### added youreko

- [D2CA-1409](https://whirlpoolgtm.atlassian.net/browse/D2CA-1409) added youreko badge to PDP & PLP

## [10.0.4] - 2023-03-28

### Fixed

- [SEOPOD-841](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-841) Fixed WIA pages canonical and robots.

## [10.0.0] - 2023-03-22

### Added

- Added _whirlpoolemea.price-drop-custom_ app in order to render the **Price Drop Alert Form**. The form has been added in _product.jsonc_ file.
  Jira tickets:
  - release: [DC-1350](https://whirlpoolgtm.atlassian.net/browse/DC-1350)
  - story: [DC-1164](https://whirlpoolgtm.atlassian.net/browse/DC-1164)

## [9.0.25] - 2023-03-21

- [RUN-1045](https://whirlpoolgtm.atlassian.net/browse/RUN-1045) Pre-order PDP: add T&C info, badge and review estimation delivery process

## [9.0.23] - 2023-03-14

### fixed

- fixed style and slider for image and video in pdp mobile [INC2341273](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=37df03cac3992950d19bafdc7a013168)

## [9.0.22] - 2023-03-14

- [RUN-1110](https://whirlpoolgtm.atlassian.net/browse/RUN-1110) - Product card Alignment on Pre order page.

## [9.0.21] - 2023-03-13

- [SEOPOD-212](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-212) Fixed text alignment of title on mobile and name of block

## [9.0.18] - 2023-03-07

- [SEOPOD-212](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-212) Removed usage of “accessories-custom-h1”

## [9.0.17] - 2023-03-06

- [SEOPOD-832](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-832) Removed unused custom apps

##[9.0.16] - 2023-03-07

- [RUN-565](https://whirlpoolgtm.atlassian.net/browse/RUN-565) Pre-order landing page - Leo and Da Vinci

## [9.0.15] - 2023-03-06

- [RUN-746](https://whirlpoolgtm.atlassian.net/browse/RUN-746) PDP - products with long name overlap availability info
- [RUN-769](https://whirlpoolgtm.atlassian.net/browse/RUN-769) Migrate the sandbox template Youreko of HP IT on WHR IT, add header and footer to sandbox template

## [9.0.12] - 2023-02-28

### added

- Added the price and the icons to additional services in PLP and to dimensions specifications. [RUN-210](https://whirlpoolgtm.atlassian.net/browse/RUN-210)

## [9.0.11] - 2023-02-27

### added

- Added a new modal component inside PDPs: **product.jsonc** and **sticky-info.jsonc** for the WPRO accessories' cross selling [RUN-156](https://whirlpoolgtm.atlassian.net/browse/RUN-156)

## [9.0.10] - 2023-02-22

### removed

- hide "slider-layout#blackFridayReviews" from prelancio page **layoutAttesa2022.jsonc** [SCTASK0879761](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=d7bba72947c5a9148f9e7e35f16d43df)

## [9.0.9] - 2023-02-20

- [RUN-231](https://whirlpoolgtm.atlassian.net/browse/RUN-231) [A/B Test] Home Page: value proposition banner

## [9.0.6] - 2023-02-07

### change

- changed the support chat's icon as per [RUN-337](https://whirlpoolgtm.atlassian.net/browse/RUN-337) and released the new FAQs version in prod as per [RUN-157](https://whirlpoolgtm.atlassian.net/browse/RUN-157)

## [9.0.5] - 2023-02-07

### add

- add video bloc in prelancio page template **layoutAttesa2022.jsonc** [SCTASK0871458](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=9e61a2ba872825505e0ebae6dabb35d0)

## [9.0.3] - 2023-02-03

### fix

- hide support submenu [SCTASK0874478](https://my.whirlpool.com/sc_task.do?sys_id=55d5fa388734e1940ae5311d0ebb3557)

## [9.0.2] - 2023-01-31

### fix

- hide support submenu [SCTASK0865816](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=903d5df14750a910a6c91978f36d43e0)

## [9.0.0] - 2023-01-30

- [RUN-303](https://whirlpoolgtm.atlassian.net/browse/RUN-303) Bundle solution with buy-together

## [8.0.13] - 2023-01-25

### fixed

- fix cplp cards accessories [INC2322543](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=b06fdebe87e425505e0ebae6dabb35f9%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [8.0.12] - 2023-01-25

### fixed

- fix custom plp card when has one single product [INC2322677](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=57ee462287e02d105e0ebae6dabb3538%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [8.0.11] - 2023-01-25

### fixed

- fix custom plp card when has one single product [INC2321474](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=2db7cc8287ec21105e0ebae6dabb3576%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [8.0.10] - 2023-01-23

### changed

-[RUN-291](https://whirlpoolgtm.atlassian.net/browse/RUN-291) Add dimension as a filter

## [8.0.9] - 2023-01-18

### fixed

- update filters on custom plp pages [INC2317082](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=72534fe787d82dd85e0ebae6dabb3593%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

### fixed

- fixed funzioani speciali filter on mobile view [INC2315216](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=c4743a4a87d8a9985e0ebae6dabb3540%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [8.0.7] - 2023-01-11

### fixed

- fixed plp filters, hide leadtime from plp cards on desktop and new taxonomy

## [8.0.6] - 2023-01-10

### fixed

- fixed plp product cards for tablet [INC2313743](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=675c13958710ad585e0ebae6dabb351c%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [8.0.5] - 2023-01-09

-[RUN-290](https://whirlpoolgtm.atlassian.net/browse/RUN-290) CR: alignment of the carousel in desktop

## [8.0.4] - 2022-11-17

### fixed

- fixed link style in benessere articles [SCTASK0861651](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=4da299d747f3d518a6c91978f36d4306%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)

## [8.0.2] - 2022-12-20

- [RB-827] Search bar: Add price and instock/oos info on researched product
- [RB-903] PLP/PDP: Add instock/oos info
- [RB-925] Registration form Black friday: enhancement for the template

## [8.0.2] - 2022-12-20

- Release after freeze period

## [7.0.13] - 2022 - 12 - 15

- Added custom app wia-canonical-fix
- Added new routes for wia
- Added custom stores for the new routes

## [7.0.12] - 2022-11-24

### Added

- Resolve bug related to Black friday carousel

## [7.0.11] - 2022-11-22

### Added

- Resolve bug related to Black friday carousel

## [7.0.13] - 2022-12-15

- Removed the old fonts
- Removed unused fonts and font faces
- Added new woff2 fonts

## [7.0.10] - 2022-11-17

### Added

- added the OOW popup to contattaci page [INC2290253](https://whirlpool.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3Da565ced047dbd510a6c91978f36d4332%26sysparm_view%3D%26sysparm_domain%3Dnull%26sysparm_domain_scope%3Dnull%26sysparm_record_row%3D1%26sysparm_record_rows%3D4%26sysparm_record_list%3Dassignment_group%253dfb66e9141b373090ee1f0d85604bcbe0%255estateIN1%252c3%252c2%255eORDERBYDESCopened_at)

## [7.0.9] - 2022-11-16

### Fixed

- Fix on footer menu

## [7.0.8] - 2022-11-15

### Fixed

- Fix on black friday carousels

## [7.0.7] - 2022-11-11

### FIxed

- FIx on black friday carousels

## [7.0.6] - 2022-11-11

### Changed

- hide satispay logo from footer

## [7.0.5] - 2022-11-08

### Changed

- changed black friday title

## [7.0.4] - 2022-11-03

### Changed

- changed template support desktop and mobile
  [SCTASK0838777](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=277b030b97dad5545f83b3a3f153afe1%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)
  [SCTASK0839310](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=701a528c87ae9dd0d2b72f45dabb3546%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)

## [7.0.3] - 2022-11-02

### Added

Added toggle layout to black friday page

## [7.0.1] - 2022-10-31

### fixed

-fixed suggested products carousel on landingPage template **landingPage.jsonc**. [INC2279795](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=07fcaf3147b211143bb30272e36d437d%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [7.0.0] - 2022-10-26

### Added

Updated black friday 2022 landing page. Added faq, blackfridayregistrationform and timer-component to peerdependencies

## [6.0.31] - 2022-10-25

### Added

- **comparison-form** block in _product-comparison.jsonc_ file in order to render the Product Comparison form (implemented in _product-comparison-form_ custom app) in the product comparison page.
- **itwhirlpool.product-comparison-form.css** in order to handle style for the _comparison-form_ block

## [6.0.30] - 2022-10-24

## [6.0.29] - 2022-10-18

- Added custom app 'product-meta-handler' in product.jsonc , unsellable-products and discontinued products and manifest reference

## [6.0.28] - 2022-10-17

### added

-Filter subcategories links on category plp

## [6.0.24] - 2022-09-28

### fixed

-fixed promozioni page error

## [6.0.23] - 2022-09-28

### Added

-Added analytics wrapper to promotion banner in home page **home.jsonc** and /promozioni page **template-home2.jsonc**. [SCTASK0818697](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=b78955729799155c26c6362e6253af87%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)

## [6.0.21] - 2022-09-19

### Added

- Remove password rule tooltip when user makes login and leave it when user register

## [6.0.18] - 2022-09-14

### Added

- Display energy label on checkout and order confirmation

## [6.0.17] - 2022-09-13

### fixed

-fixed CSS merge conflict **"\vtex.rich-text.css"** , **"vtex.flex-layout.css"**

## [6.0.16] - 2022-09-13

### Added

-Added new popup on support pages. [SCTASK0804751](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=0e2c57bd472c5998c6415701e36d43c0%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)

## [6.0.15] - 2022-09-12

- fixed scheda tecnica link on PDP [INC2245347](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=31905659872d1950d2b72f45dabb351f%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356)

## [6.0.14] - 2022-09-14

- Fixed manifest that caused crash on pdp

## [6.0.13] - 2022-09-12

- Promotions page redesing
  [WI-196](https://whirlpoolgtm.atlassian.net/browse/WI-196)

## [6.0.12] - 2022-09-06

- A/B Test [PLP/Carousels - IT] Product card re-design (desktop only):
  [RB-750](https://whirlpoolgtm.atlassian.net/browse/RB-750)

## [4.0.199] - 2022-09-05

[WI-228] (<https://whirlpoolgtm.atlassian.net/browse/WI-228>)

- Black friday new landing page

## [4.0.198] - 2022-08-31

[WI-135] (<https://whirlpoolgtm.atlassian.net/browse/WI-135>)

- Adjust the usability of the PLP filters on mobile

[WI-268] (<https://whirlpoolgtm.atlassian.net/browse/WI-268>)

- Bugfix - fixed Layout bug on registration page

## [4.0.193] - 2022-08-01

[RB-877] (<https://whirlpoolgtm.atlassian.net/browse/RB-877>)

- Added in header the new stripe popup-custom component for Homepage and commented out old code in Header

## [4.0.191] - 2022-07-25

[DC-635] (<https://whirlpoolgtm.atlassian.net/browse/DC-635>)

- Release CRM development

## [4.0.190] - 2022-07-18

### Added

- Added **"newsletter-popup#footer"** in PDPs and other pages were it was missing. [SCTASK0807331](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=bfb057c097f05950e98337e3f153af64%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [4.0.189] - 2022-07-18

Hide the 9999 review filter in PLP

## [4.0.188] - 2022-07-13

[RB-1062] (<https://whirlpoolgtm.atlassian.net/browse/RB-1062>)
This ticket tracks CRM activity releases
<https://whirlpoolgtm.atlassian.net/browse/DC-548>
<https://whirlpoolgtm.atlassian.net/browse/DC-549>

## [4.0.186] - 2022-06-24

### Added

- Added image in "Lavaggio e Asciugatura" menu item **menu-items.jsonc**. [INC2212112](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=9d569b94875c95505e0ebae6dabb3549%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [4.0.181] - 2022-06-23

[RB-881] (<https://whirlpoolgtm.atlassian.net/browse/RB-881>)
Remove responsive layout - Page Articles

## [4.0.180] - 2022-06-20

[RB-873] Added esplora categoria block on desktop size

## [4.0.178] - 2022-06-10

Fixed graphic issue in header that came out after Wellbeing release

## [4.0.177] - 2022-06-09

Ripristinated menu item header "Wellbeing"

## [4.0.176] - 2022-06-09

Commented menu item header "Wellbeing"

## [4.0.175] - 2022-06-08

Release Wellbeing

## [4.0.174] - 2022-06-08

Release Fuorisalone custom listener for tracking

## [4.0.173] - 2022-06-06

Release Fix Fuorisalone on Tablet

## [4.0.172] - 2022-06-03

[DC-488] Release new Fuorisalone template

## [4.0.171] - 2022-05-31

[RB-898] Create a landing page with sandbox for Fuorisalone

## [4.0.169] - 2022-05-16

### Changed

- Fonts got converted to woff2 format and searchBarContainer :global(.vtex-styleguide-9-x-input) got his height defined since it's always the same in all the resolutions
- Revented font implementation done in the first minor release candidate due to a business requirments

- **home.jsonc** changed _autoplay_ prop for slider in home page from 15s to 10s.
- **everest-serie-400.jsonc** removed CTA button from an info-card.
  MOB tickets:
  - [SCTASK0770626](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=351b12e587b249105e0ebae6dabb352d%26sysparm_view=rpt-tempfdcf17dd1b00c198f845a687b04bcbff_fab1c41c1be5f45019e60f66624bcba0)
  - [SCTASK0773632](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=7e9dba1887c3c5905e0ebae6dabb35b8%26sysparm_view=rpt-tempfdcf17dd1b00c198f845a687b04bcbff_fab1c41c1be5f45019e60f66624bcba0)

## [4.0.168] - 2022-05-11

Searchbar: Add titles

## [4.0.167] - 2022-05-10

Wellbeing homepage: Change label breadcrumb

## [4.0.164] - 2022-05-10

[RB-694][rb-695] Wellbeing article: scrolling existing banner + new banner

## [4.0.163] - 2022-05-09

[RB-675] Fix bug in home carousel

## [4.0.161] - 2022-05-09

[RB-675] Release the new searchbar functionality

## [4.0.160] - 2022-05-04

[RB-550] Release the new gate-page-hub

## [4.0.158] - 2022-04-26

[RB-469] Release the new gate-page-hub

## ["4.0.157"]

- Added css properties for : searchBarContainer , buttonContainer , stickyContainer and infoCardContainer--carouselHomeTop to fix some cls issue

## [4.0.153] - 2022-04-11

Release new cookie policy

## [4.0.152] - 2022-04-11

### Changed

- Removed duplicated _minicart.v2_ from _flex-layout.row#mobile_ and _flex-layout.row#desktop_ in _header.jsonc_ as this cause a duplicated minicart view when a product is added to the cart. [INC2170538](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=bcd95dd81bbe4dd019e60f66624bcb49%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8).
- Analytics wrapper for slider banner in Homepage and removed some duplicated blocks. [RB-27](https://whirlpoolgtm.atlassian.net/browse/RB-27)

## [4.0.151] - 2022-03-30

### Changed

- **vtex.menu.css** added two css rules in media query _max-width: 700px_ to fix bug on mobile menu opening and closing menu items (from _"+"_ and _"-"_ icons). [INC2163050](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=464213651ba2815099f51f47b04bcb92%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [4.0.150] - 2022-03-25

[RB-501] Release new search bar

## [4.0.149] - 2022-03-25

[RB-501] Fix label giorni lavorativi for A/B Test delivery block

## [4.0.148] - 2022-03-25

### Changed

- **product.jsonc** removed _"responsive-layout.mobile"_ as it was duplicated in _"store.product.product-comparison"_ causing first content in PDPs mobile to be duplicated. [INC2162057](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=46df99841b2e81904e7dedf1b24bcb6e%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [4.0.146] - 2022-03-24

[RB-501] Release the delivery block hide for A/B Test

## [4.0.144] - 2022-03-16

Fix bug on the search-bar for the A/B Test

## [Unreleased]

## [6.0.29] - 2022-10-19

## [4.0.196] - 2022-08-16

## [4.0.195] - 2022-08-16

## [4.0.165] - 2022-05-10

## [4.0.156] - 2022-04-19

## [4.0.155] - 2022-04-19

## [4.0.143] - 2022-03-16

## [4.0.142] - 2022-03-16

### fix new search bar and hide it for google optimize A/B test, fix on newSearchBar

## [4.0.142] - 2022-03-16

### fix new search bar and hide it for google optimize aA/B test

## [4.0.141] - 2022-03-11

## [4.0.140] - 2022-03-11

### Changed

[RB-376] added new search bar and hiding it for google optimize aA/B test

### Changed

[RB-78] Added development related to the cut price, if the product has cut price or promotion shows "Risparmi" or discount percentage. Product info from custom promotion-form-to-date.

## [4.0.136] - 2022-02-21

### Changed

- Changed _"vtex.product-highlights@2.x:product-highlights"_ for promotion from "vtex.product-highlights@2.x:product-highlights#promotion" to **"vtex.product-highlights@2.x:product-highlights#promo"** because the first was not working. [INC2139559](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=203691f487714d503b85fc07cebb35b0%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [4.0.134] - 2022-02-18

### Changed

- Added _Toggle Layout Chat Widget_ in almost all pages in order to have chat widget where the business whant to have it.
  Jira ticket: [RB-159](https://whirlpoolgtm.atlassian.net/browse/RB-159)
  MOB ticket: [SCTASK0744475](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=508061191be941906147a688b04bcb48%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [4.0.133] - 2022-02-14

### Removed

block-> product.jsonc removed experimental visibility layout as wrapper, since skeleton was injected directly on specific custom app render logic: VideoThron (which provides main image PDP) and ServiziAggiuntiviPdp (which provides product specifications)
