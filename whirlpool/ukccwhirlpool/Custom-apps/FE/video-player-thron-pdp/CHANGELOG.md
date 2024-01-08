<!-- @format -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.1.58-beta.0] - 2023-01-27
- added Analytics GA4 enhancement



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




