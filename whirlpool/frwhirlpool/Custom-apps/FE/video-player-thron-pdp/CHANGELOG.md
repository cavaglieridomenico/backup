<!-- @format -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.0.33] - 2023-06-20
- [SEOPOD-953](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-953) removed every img tag in every Thumbnail in phone view
- [SEOPOD-953](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-953) removed useless image download (160 width) in mobile and desktop view
- [SEOPOD-953](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-953) removed useless image download (400 width) in mobile and desktop view

## [0.0.32] - 2023-06-19
- [SEOPOD-1042](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-1042) changed the sessId value to download a new version of the Thron video player

## [0.0.31] - 2023-05-17
[SEOPOD-924](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-924) Set minHeight property on product image to improve CLS and performance.

## [0.0.30] - 2023-05-16

### added

- [SEOPOD-861](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-861) added fetchpriority 'high' only for the first image in the gallery and fetchpriority 'low' for the others
- [SEOPOD-861](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-861) added 'lazy' loading to not visible thumbnail images

## [0.0.29] - 2023-04-17

### added

- added icon_full_screen in smaller size [SEOPOD-906](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-906?atlOrigin=eyJpIjoiZDFlMWU0YmE0MGJjNDU2NWE1NWZiOGEzY2I0ZWQ2ZGYiLCJwIjoiaiJ9)

## [0.0.28] - 2023-03-16

### fixed

- fix image in the pdp for mobile when opening the modale and video style [INC2341273](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=37df03cac3992950d19bafdc7a013168)

## [0.0.27] - 2022-03-08

- [RUN-183](https://whirlpoolgtm.atlassian.net/browse/RUN-183) - PDP Mobile Optimization

## [0.0.32] - 2022-11-30

- Added GA4 analytic event on large image click
- Removed analytic event on first video view

## [0.0.28]

- Added suspense
- swiper.global.css added fixed height for mobile devices to avoid cls

## [0.0.28] - 2022-04-14

### Added

- **ThumbnailSwiper.js** added these props to _Swiper_ component that prevent some slides to not be shown:

  - _observer={true}_
  - _observeParents={true}_ - _observeSlideChildren={true}_

  [INC2172951](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=967832bd47764150c6415701e36d4347%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.0.26] - 2022-02-24

### Added

- Skeleton is rendered while waiting Image, then when it's available swap
- Defined responsivness of Skeleton with style css

### Changed

- Introduced a Suspense on ProductImage since it improves LCP on pdp page for Desktop

### Removed

### Fixed
