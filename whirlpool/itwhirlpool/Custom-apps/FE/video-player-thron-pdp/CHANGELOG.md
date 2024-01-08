<!-- @format -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.0.39] - 2023-06-19
- [SEOPOD-1033](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-1033) changed the sessId value to download a new version of the Thron video player
- [SEOPOD-1033](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-1033) restored Thumbnail Swiper component in phone view
- [SEOPOD-1033](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-1033) removed every img tag in every Thumbnail in phone view

## [0.0.37] - 2023-05-17

- [SEOPOD-863](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-863) added fetchpriority 'high' only for the first image in the gallery and fetchpriority 'low' for the others
- [SEOPOD-863](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-863) added 'lazy' loading to not visible thumbnail images
- [SEOPOD-950](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-950) removed useless image download (400 width) in mobile and desktop view
- [SEOPOD-950](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-950) removed useless image download (160 width) in mobile and desktop view
- [SEOPOD-950](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-950) removed the entire Thumbnail Swiper component in phone view

## [0.0.36] - 2023-05-02

- [SEOPOD-903](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-903) Fixed images width and height in PDP to reduce CLS.

## [0.0.35] - 2023-04-17

### added

- added icon_full_screen in smaller size [SEOPOD-909](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-909?atlOrigin=eyJpIjoiNmI3YzJiOWZiYmRhNDhhZTg1ZjA1NTY2N2IyY2I2M2EiLCJwIjoiaiJ9)

## [0.0.34] - 2023-03-14

### fixed

- fixed style and slider for image and video in pdp mobile [INC2341273](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=37df03cac3992950d19bafdc7a013168)
## [0.0.33] - 2023-03-02

### Added

- **index.js** added _?_ to prevent the crash of the mobile page after clicking the icon to put the video in full screen [INC2339915](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=9d1d78a9475129103bb30272e36d43f5)

## [0.0.32] - 2022-11-30
- Added GA4 analytic event on large image click
- Removed analytic event on first video view

## [0.0.28]
- Added suspense
- swiper.global.css added fixed height for mobile devices to avoid cls

## [0.0.28] - 2022-04-14

### Added

- **ThumbnailSwiper.js** added these props to *Swiper* component that prevent some slides to not be shown:
  - *observer={true}*
  - *observeParents={true}*
	- *observeSlideChildren={true}*

  [INC2172951](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=967832bd47764150c6415701e36d4347%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.0.26] - 2022-02-24

### Added

- Skeleton is rendered while waiting Image, then when it's available swap
- Defined responsivness of Skeleton with style css

### Changed
- Introduced a Suspense on ProductImage since it improves LCP on pdp page for Desktop
### Removed

### Fixed




