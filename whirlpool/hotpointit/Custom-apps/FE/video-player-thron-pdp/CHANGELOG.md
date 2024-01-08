# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.39] - 2023-05-31

- [SEOPOD-926](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-926) changed the sessId value to download a new version of the Thron video player
- [SEOPOD-926](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-926) restored Thumbnail Swiper component in phone view
- [SEOPOD-926](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-926) removed every img tag in every Thumbnail in phone view

## [0.0.38] - 2023-05-15

- [SEOPOD-921](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-921?atlOrigin=eyJpIjoiMTAxMmMxNzcxMjRmNDE2Mzg5NDBkZjc3MjYyODU2NjEiLCJwIjoiaiJ9) removed the entire Thumbnail Swiper component in phone view
- [SEOPOD-921](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-921?atlOrigin=eyJpIjoiMTAxMmMxNzcxMjRmNDE2Mzg5NDBkZjc3MjYyODU2NjEiLCJwIjoiaiJ9) removed useless image download (width 160) in mobile and desktop view

## [0.0.37] - 2023-05-02

- [SEOPOD-923](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-932) Fixed images width and height in PDP to reduce CLS.

## [0.0.36] - 2023-03-27

[SEOPOD-854](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-854?atlOrigin=eyJpIjoiMDk2MDkzOGQ0ZWI3NGYyNTg5NDU0YjI0MTEyMjY1MjgiLCJwIjoiaiJ9)

### added

- fetchpriority 'high' only for the first image in the gallery and fetchpriority 'low' for the others
- 'eager' loading only for the first image in the gallery and 'lazy' loading for the others
- 'lazy' loading to not visible thumbnail images

## [0.0.35] - 2023-03-16

### fixed

- fix image in the pdp for mobile when opening the modale and video style [INC2341273](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=37df03cac3992950d19bafdc7a013168)

## [0.0.31] - 2023-XX-XX

- Added fetchpriority property to the image tag inside productImage.tsx

## [0.0.30] - 2022-12-14

### Released

- released stable version

## [0.0.30-beta.0] - 2022-12-12

### Updated

- updated analytics events to GA4 standard: ‘productImageClick’, ‘thronVideo’

## [Unreleased]

## [0.0.29] - 2022-08-09

### Added

- Change layout for carousel inside pdp based on the one inside the recipe page
