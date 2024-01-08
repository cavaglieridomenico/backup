# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
## [14.0.5] - 2023-09-12
- [ADYEN] - [Payment]
- **checkout.jsonc**
Added new payment methods for adyen transaction flow
- **manifest.json**
added new dependency which points to an app that handles 3ds security challenge for checkout
## [14.0.4] - 2023-09-07

### Fixed

- **product-summary-plp.jsonc** and **product.jsonc** fixed condition for display _rich-text#schedaProdotto_ in case of missing product-fiche [INC2443969](https://whirlpool.service-now.com/nav_to.do?uri=incident.do%3Fsys_id=db1f1e924741b914a6c91978f36d434d%26sysparm_stack=incident_list.do%3Fsysparm_query=active=true)

## [14.0.2] - 2023-09-05

## [14.0.1] - 2023-08-25

### Fixed

- **vtex.store-components.css** fixed search bar css [INC2436747](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=35dc15fd47bc7d10e8e97161e36d433a%26sysparm_view=RPT9bcc09561bff3810708f26db234bcb61)

## [14.0.0] - 2023-08-21

- [RUN-2063](https://whirlpoolgtm.atlassian.net/browse/RUN-2063) - Add buy-together custom app for ITCC

## [13.0.1] - 2023-08-21

- [RUN-2066](https://whirlpoolgtm.atlassian.net/browse/RUN-2066) - [Home page] Search bar: align with other websites

## [13.0.0] - 2023-08-08

- [RUN-2065](https://whirlpoolgtm.atlassian.net/browse/RUN-2065) - release support center button

## [12.0.1] - 2023-08-07

- [RUN-2072](https://whirlpoolgtm.atlassian.net/browse/RUN-2072) - New visualization Blue menu
- [RUN-2064](https://whirlpoolgtm.atlassian.net/browse/RUN-2064) - [Home page] Improvement home page visualization
- [RUN-2067](https://whirlpoolgtm.atlassian.net/browse/RUN-2067) - [PLP] Fix product cards dimension
- [RUN-2068](https://whirlpoolgtm.atlassian.net/browse/RUN-2068) - [PLP] Filters behavior [IT CC]
- [RUN-2073](https://whirlpoolgtm.atlassian.net/browse/RUN-2073) - Centered PLP content [IT CC]

## [12.0.0] - 2023-08-01

- [RUN-1874](https://whirlpoolgtm.atlassian.net/browse/RUN-1874) [HomePage] Add subscription form

## [11.0.0] - 2023-08-01

- [RUN-1185](https://whirlpoolgtm.atlassian.net/browse/RUN-1185) Home page: add a countdown banner

## [10.0.1] - 2023-07-25

[INC2420234] fixed style issue in whirlpoolemea.cc-login.css

## [10.0.0] - 2023-07-24

- [RUN-1872](https://whirlpoolgtm.atlassian.net/browse/RUN-1872) [Home Page] Insert Order status home page section [IT CC]

## [9.0.3] - 2023-07-17

### Fixed

- **vtex.sticky-layout.css** fixed sticky banner for large screen [INC2414354](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=dd531324970075905b0eb9bfe153af9e)

## [9.0.2] - 2023-07-13

### Fixed

- **checkout.jsonc** fixed worldpay id, QA id (202) was present instead of PROD one (201)

## [9.0.0] - 2023-07-10

- [RUN-1873](https://whirlpoolgtm.atlassian.net/browse/RUN-1873) [HomePage] Category section

## [8.0.0] - 2023-07-10

- [RUN-1865](https://whirlpoolgtm.atlassian.net/browse/RUN-1865) Update whirlpolemea app to integrate fareye

## [7.0.55] - 2023-07-07

## [7.0.52] - 2023-06-27

- [RUN-1871](https://whirlpoolgtm.atlassian.net/browse/RUN-1871) Replace vertical banner with horizontal banner on homepage

## [7.0.51] - 2023-06-26

- [RUN-1585](https://whirlpoolgtm.atlassian.net/browse/RUN-1585) Responsiveness of the images and cards
- [RUN-1742](https://whirlpoolgtm.atlassian.net/browse/RUN-1742) Reduce blank space [Carousel/PLP]

## [Unreleased]

## [7.0.50] - 2023-06-21

- [SCTASK0920203](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=cb1c4aa3471f6990b079908f746d43a4) fix banner img as background

## [7.0.49] - 2023-06-21

-[RUN-1791](https://whirlpoolgtm.atlassian.net/browse/RUN-1791) Add Fareye integration

## [7.0.48] - 2023-06-19

- [RUN-1646](https://whirlpoolgtm.atlassian.net/browse/RUN-1646) Update table structure in 2.2 section

## [7.0.47] - 2023-05-16

### Changed

- Restored order by price DESC and ASC in _epp_ and _ff_ [SCTASK0906906](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do%3Fsys_id=7569d3e3476ea5103bb30272e36d4310%26sysparm_stack=sc_task_list.do%3Fsysparm_query=active=true)

## [7.0.46] - 2023-05-01

fix support padding link

## [7.0.45] - 2023-05-01

stable version released

## [7.0.44] - 2023-04-18

### Changed

- Changed VIP autologin flow, added new Guest Form and new Guest field in Registration one.

## [7.0.42] - 2023-03-28

### Changed

- **vtex.wish-list.css** changed wish list icon to have the heart filled [SCTASK0887524](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=f7b3df18c365e110d19bafdc7a013127%26sysparm_view=RPTb6af9f9587008954e4bc7447cebb35c7)
- **cart.jsonc** _product-summary-custom.shipping_ changed _hasDiscountTooltip_ prop to not display discount tooltip [SCTASK0891371](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=2d23de688771611478f2dcaabbbb35cf%26sysparm_view=RPTb6af9f9587008954e4bc7447cebb35c7)

## [7.0.41] - 2023-03-09

### Changed

- **cart.jsonc**, **product-availability.jsonc**, **product.jsonc**, **product-summary.jsonc** changed logic to consider products as out of stock [INC2343370](https://whirlpool.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D1b0fe9b7875de11042138409dabb3501)

## [7.0.40] - 2023-02-22

### Added

- Added Analytics GA4 enhancement

## [7.0.38] - 2023-02-06

## [7.0.37] - 2023-02-06

## [7.0.36] - 2023-02-02

## [7.0.35] - 2023-02-01

## [7.0.34] - 2023-01-31

## [7.0.33] - 2023-01-30

## [7.0.32] - 2023-01-27

## [7.0.31] - 2023-01-27

## [7.0.26] - 2023-01-25

## [7.0.25] - 2023-01-25

## [7.0.24] - 2023-01-25

## [7.0.23] - 2023-01-25

## [7.0.20] - 2023-01-20

## [7.0.19] - 2023-01-19

## [7.0.18] - 2023-01-19

## [7.0.17] - 2023-01-18

## [7.0.16] - 2023-01-18

## [7.0.15] - 2023-01-17

- [CCITA-1322](https://whirlpoolgtm.atlassian.net/browse/CCITA-1322)

## [7.0.14] - 2023-01-17

## [7.0.12] - 2023-01-17

## [7.0.11] - 2023-01-16

## [7.0.10] - 2023-01-16

## [7.0.9] - 2023-01-16

## [7.0.8] - 2023-01-16

-[ccita-1369](https://whirlpoolgtm.atlassian.net/browse/CCITA-1369)

## [7.0.7] - 2023-01-16

- [CCITA-1349](https://whirlpoolgtm.atlassian.net/browse/CCITA-1349)

## [7.0.6] - 2023-01-16

## [7.0.5] - 2023-01-16

## [7.0.4] - 2023-01-16

## [7.0.3] - 2023-01-13

## [7.0.1] - 2023-01-13

-[ccita-1330](https://whirlpoolgtm.atlassian.net/browse/CCITA-1330), [ccita1329](https://whirlpoolgtm.atlassian.net/browse/CCITA-1329)

## [7.0.1] - 2023-01-12

## [6.0.1] - 2022-12-27

- Added checkout io

## [5.0.43] - 2022-12-23

## [5.0.42] - 2022-12-23

## [5.0.41] - 2022-12-15

- [CCITA-1151](https://whirlpoolgtm.atlassian.net/browse/CCITA-1151)

## [5.0.40] - 2022-12-14

## [5.0.39] - 2022-12-12

- [CCITA-1214](https://whirlpoolgtm.atlassian.net/browse/CCITA-1214)

## [5.0.38] - 2022-12-07

## [5.0.37] - 2022-12-06

-[CCITA-972](https://whirlpoolgtm.atlassian.net/browse/CCITA-972), [CCITA-932](https://whirlpoolgtm.atlassian.net/browse/CCITA-932), [CCITA-1160](https://whirlpoolgtm.atlassian.net/browse/CCITA-1160), [CCITA-968](https://whirlpoolgtm.atlassian.net/browse/CCITA-968)

## [5.0.36] - 2022-12-05

## [5.0.35] - 2022-12-02

- NEW UI: [ITCC-965](https://whirlpoolgtm.atlassian.net/browse/CCITA-965), [ITCC-985](https://whirlpoolgtm.atlassian.net/browse/CCITA-985), [ITCC900](https://whirlpoolgtm.atlassian.net/browse/CCITA-900), [ITCC921](https://whirlpoolgtm.atlassian.net/browse/CCITA-921)

## [5.0.34] - 2022-12-01

- [ITCC-1152](https://whirlpoolgtm.atlassian.net/browse/CCITA-1152)

## [5.0.33] - 2022-11-30

## [5.0.32] - 2022-11-29

## [5.0.31] - 2022-11-28

- [ITCC-1115](https://whirlpoolgtm.atlassian.net/browse/CCITA-1115), [ITCC-1084](https://whirlpoolgtm.atlassian.net/browse/CCITA-1084)

## [5.0.30] - 2022-11-25

- [ITCC-685](https://whirlpoolgtm.atlassian.net/browse/CCITA-685)

## [5.0.29] - 2022-11-24

- test maintenance page, no tickets related.

## [5.0.28] - 2022-11-24

- test maintenance page, no tickets related.

## [5.0.27] - 2022-11-24

- [ITCC-1116](https://whirlpoolgtm.atlassian.net/browse/CCITA-1116) & [ITCC-1085](https://whirlpoolgtm.atlassian.net/browse/CCITA-1085)

## [5.0.26] - 2022-11-24

- [ITCC-356](https://whirlpoolgtm.atlassian.net/browse/CCITA-356) added maintenance page to theme

## [5.0.25] - 2022-11-23

## [5.0.24] - 2022-11-23

## [5.0.23] - 2022-11-22

- [ITCC-1025](https://whirlpoolgtm.atlassian.net/browse/CCITA-1025) and [ITCC-1066](https://whirlpoolgtm.atlassian.net/browse/CCITA-1066)

## [5.0.22] - 2022-11-21

- [ITCC-1087](https://whirlpoolgtm.atlassian.net/browse/CCITA-1087) fixed issue with "itccwhirlpool.product-description:product-description#main" by commenting the title prop.

## [5.0.21] - 2022-11-21

- [ITCC-694](https://whirlpoolgtm.atlassian.net/browse/CCITA-694) and [ITCC-1087](https://whirlpoolgtm.atlassian.net/browse/CCITA-1087)

## [5.0.20] - 2022-11-18

## [5.0.19] - 2022-11-17

## [5.0.18] - 2022-11-16

### Added

- [ITCC-1011](https://whirlpoolgtm.atlassian.net/browse/CCITA-1011) added CTA add to cart inside sticky bar.

## [5.0.17] - 2022-11-16

## [5.0.16] - 2022-11-15

## [5.0.15] - 2022-11-11

## [5.0.14] - 2022-11-04

## [5.0.13] - 2022-11-03

## [5.0.12] - 2022-11-02

## [5.0.11] - 2022-10-27

## [5.0.10] - 2022-10-25

## [5.0.9] - 2022-10-24

## [5.0.7] - 2022-10-20

## [5.0.6] - 2022-10-20

## [5.0.5] - 2022-10-20

## [5.0.4] - 2022-10-19

## [5.0.3] - 2022-10-14

## [5.0.2] - 2022-10-12

## [5.0.1] - 2022-10-07

## [4.0.9] - 2022-10-07

## [4.0.8] - 2022-10-06

## [4.0.7] - 2022-10-06

## [4.0.6] - 2022-10-06

## [4.0.5] - 2022-10-04

## [4.0.4] - 2022-09-30

## [4.0.3] - 2022-09-30

## [4.0.2] - 2022-09-28

## [4.0.1] - 2022-09-23

## [2.0.2] - 2022-09-15

## [2.0.1] - 2022-09-12

## [1.0.1] - 2022-09-07

## [0.0.8] - 2022-09-07

## [0.0.7] - 2022-09-07

## [0.0.6] - 2022-08-31

## [0.0.5] - 2022-08-31

## [0.0.4] - 2022-08-31

## [0.0.2] - 2022-08-02

## [0.0.2] - 2022-08-02

## [0.0.120] - 2022-07-07

### Changed

- changed component add-to-cart-button with add-to-cart-custom.

## [0.0.119] - 2022-06-13

### Changed

- **T&Cs-template.jsonc**, **supportCC.jsonc** and **vtex.rich-text.css** added rich-text in order to have a part of text with border color black for legal reasons. [SCTASK0794589](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=1aa6c13d978cdd505b0eb9bfe153afb4%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [0.0.112] - 2022-04-06

## [0.0.111] - 2022-04-04

## [0.0.110] - 2022-04-04

## [0.0.109] - 2022-03-29

## [0.0.108] - 2022-03-23

## [0.0.107] - 2022-03-23

## [0.0.106] - 2022-03-23

## [0.0.102] - 2022-03-22

## [0.0.101] - 2022-03-22

## [0.0.100] - 2022-03-22

## [0.0.99] - 2022-03-22

## [0.0.98] - 2022-03-21

## [0.0.97] - 2022-03-19

## [0.0.96] - 2022-03-19

## [0.0.95] - 2022-03-18

## [0.0.94] - 2022-03-18

## [0.0.93] - 2022-03-18

## [0.0.92] - 2022-03-17

## [0.0.91] - 2022-03-14

## [0.0.90] - 2022-03-12

## [0.0.89] - 2022-03-12

## [0.0.88] - 2022-03-12

## [0.0.87] - 2022-03-12

## [0.0.86] - 2022-03-12

## [0.0.85] - 2022-03-12

## [0.0.74] - 2022-03-09

## [0.0.72] - 2022-03-02

## [0.0.71] - 2022-03-02

## [0.0.69] - 2022-02-25

## [0.0.68] - 2022-02-24

## [0.0.67] - 2022-02-23

## [0.0.66] - 2022-02-23

## [0.0.65] - 2022-02-22

## [0.0.64] - 2022-02-22

## [0.0.63] - 2022-02-21

## [0.0.59] - 2022-02-16

## [0.0.58] - 2022-02-15

## [0.0.57] - 2022-02-07

## [0.0.56] - 2022-02-02

## [0.0.51] - 2022-01-28

## [0.0.44] - 2022-01-20

## [0.0.43] - 2022-01-20

## [0.0.42] - 2022-01-20

## [0.0.36] - 2022-01-19

## [0.0.35] - 2022-01-19

## [0.0.34] - 2022-01-19

## [0.0.33] - 2022-01-19

## [0.0.32] - 2022-01-18

## [0.0.30] - 2022-01-18

## [0.0.29] - 2022-01-17

## [0.0.25] - 2022-01-14

## [0.0.24] - 2022-01-14

## [0.0.23] - 2022-01-14

## [0.0.22] - 2022-01-14

## [0.0.21] - 2022-01-13

## [0.0.20] - 2022-01-13

## [0.0.19] - 2022-01-12

## [0.0.15] - 2022-01-07

## [0.0.14] - 2022-01-07

## [0.0.13] - 2021-12-30

## [0.0.12] - 2021-12-27

## [0.0.11] - 2021-12-24

## [0.0.10] - 2021-12-23

## [0.0.9] - 2021-12-22

## [0.0.8] - 2021-12-22

## [0.0.7] - 2021-12-21

## [0.0.6] - 2021-12-21

## [0.0.5] - 2021-12-20

## [0.0.4] - 2021-12-15

## [0.0.3] - 2021-11-26

## [0.0.2] - 2021-11-24

## [2.0.8] - 2021-11-22

## [2.0.7] - 2021-11-18

## [2.0.6] - 2021-11-16

## [2.0.5] - 2021-11-16

## [2.0.4] - 2021-11-12

## [2.0.3] - 2021-11-10

## [2.0.2] - 2021-11-08

## [2.0.1] - 2021-10-28

## [2.0.0] - 2021-10-28

## [1.0.94] - 2021-10-28

## [1.0.93] - 2021-10-27

## [1.0.92] - 2021-10-27

## [1.0.91] - 2021-10-22

## [1.0.90] - 2021-10-19

## [1.0.89] - 2021-10-18

## [1.0.88] - 2021-10-18

## [1.0.87] - 2021-10-18

## [1.0.86] - 2021-10-14

## [1.0.85] - 2021-10-14

## [1.0.84] - 2021-10-13

## [1.0.83] - 2021-10-12

## [1.0.82] - 2021-10-11

## [1.0.81] - 2021-10-06

## [1.0.78] - 2021-10-04

## [1.0.77] - 2021-09-23

## [1.0.76] - 2021-09-16

## [1.0.75] - 2021-09-14

## [1.0.74] - 2021-09-07

## [1.0.73] - 2021-09-02

## [1.0.72] - 2021-09-02

## [1.0.71] - 2021-09-02

## [1.0.70] - 2021-09-02

## [1.0.69] - 2021-08-10

## [1.0.68] - 2021-08-04

## [1.0.67] - 2021-08-02

## [1.0.66] - 2021-07-30

## [1.0.65] - 2021-07-30

## [1.0.63] - 2021-07-29

## [1.0.62] - 2021-07-08

## [1.0.59] - 2021-06-21

## [1.0.56] - 2021-05-28

## [1.0.55] - 2021-05-26

## [1.0.54] - 2021-05-21

## [1.0.53] - 2021-05-21

## [1.0.52] - 2021-05-21

## [1.0.51] - 2021-05-21

## [1.0.50] - 2021-05-21

## [1.0.49] - 2021-05-21

## [1.0.48] - 2021-05-21

## [1.0.47] - 2021-05-21

## [1.0.46] - 2021-05-21

## [1.0.45] - 2021-05-20

## [1.0.44] - 2021-05-18

## [1.0.43] - 2021-05-17

## [1.0.42] - 2021-05-14

## [1.0.41] - 2021-05-14

## [1.0.40] - 2021-05-13

## [1.0.39] - 2021-05-12

## [1.0.31] - 2021-05-03

## [1.0.29] - 2021-04-30

## [1.0.28] - 2021-04-30

## [1.0.27] - 2021-04-30

## [1.0.25] - 2021-04-30

## [1.0.24] - 2021-04-28

## [1.0.23] - 2021-04-28

## [1.0.22] - 2021-04-28

## [1.0.20] - 2021-04-27

## [1.0.19] - 2021-04-26

## [1.0.17] - 2021-04-25

## [1.0.10] - 2021-04-23

## [1.0.9] - 2021-04-23

## [1.0.8] - 2021-04-23

## [1.0.7] - 2021-04-21

## [1.0.6] - 2021-04-20

## [1.0.5] - 2021-04-20

## [1.0.3] - 2021-04-01

## [1.0.2] - 2021-04-01

## [1.0.1] - 2021-03-31

## [4.3.0] - 2021-01-14

### Added

- Example of multiple search gallery layouts usage

## [4.2.1] - 2020-12-14

### Fixed

- Unnecessary `max-width` style in the input of `search-bar` block which causes the style to break when the `search-bar` needs to be bigger`.

## [4.2.0] - 2020-11-30

### Added

- Example of [vtex.store-video](https://github.com/vtex-apps/store-video) usage.

## [4.1.0] - 2020-11-16

### Changed

- Update `vtex.order-placed@1.x` to `vtex.order-placed@2.x`.

## [4.0.0] - 2020-10-30

### Added

- Example of [vtex.product-specifications](https://github.com/vtex-apps/product-specifications) usage.

### Changed

- Use new major of [vtex.reviews-and-ratings](https://github.com/vtex-apps/reviews-and-ratings).

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
