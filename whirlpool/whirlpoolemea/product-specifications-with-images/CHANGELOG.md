# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.0.5] - 2023-08-25

### Fixed

- **ProductSpecificationsWithImages.tsx** fixed image visualization in case of non-JSON description

# [2.0.4] - 2023-08-24

## Changed
[RUN-2105](Fix MT images for HPIT and WHRIT)
# [2.0.3] - 2023-04-2

## Changed

- **fr.json** update _store/p-s-w-i.readLess_ message [SCTASK0901415](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do%3Fsys_id=e0545c4e97922950372a3a121153af7b%26sysparm_stack=sc_task_list.do%3Fsysparm_query=active=true)

# [2.0.2] - 2023-03-27

[SEOPOD-854](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-854?atlOrigin=eyJpIjoiMDk2MDkzOGQ0ZWI3NGYyNTg5NDU0YjI0MTEyMjY1MjgiLCJwIjoiaiJ9)

- Added loading attribute ("lazy")
- Added fetchpriority ("low") attribute
- Modified src attribute to get images in .webp format

# 2.0.1

Released stable version

# 2.0.1-beta

Added class to images so you can change style with css

## [unreleased]

- Alt text

## [1.1.2] 2021-03-12

### Added

- Better error handling when an image can't be loaded
- Default image settable by `/admin`

## [1.1.1] 2021-03-10

### Fixed

- Fixed minor bug regardig a change in the backend apis and how they provide images

## [1.1.0]

- New release

## [1.0.3] 2021-02-09

### Changed

- Fixed minor bug regardig `Warning: Each child in a list should have a unique "key" prop`

## [1.0.2] 2021-02-09

### Changed

- Fixed minor bug regardig `Warning: Each child in a list should have a unique "key" prop`

## [1.0.1] 2021-02-09

### Added

- Responsive tablet and mobile style
- Empty function to substitute broken/malfunctioning urls when loading images with a fallback url

## [1.0.0] 2021-02-01

- First release

### Changed

- App name in manifest/store

## [0.0.8]

### Changed

- App name in interface

### Added

- UI from whirlpool.it

### Removed

- Useless file (getCurrency.ts)

## [0.0.7]

### Added

- Parametrization from Admin pageadded parametrization from Admin page

## [0.0.6]

### Added

- Copied some logic from original ProductSpecificationsGroup component (useMemo and stuff about filters)
- Added filtering and interfaces relative to the addition of the image
