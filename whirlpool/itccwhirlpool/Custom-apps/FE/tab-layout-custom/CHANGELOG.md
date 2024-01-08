# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.4] - 2022-02-24

### Fixed

- Updated docs.

## [0.4.3] - 2021-04-09
### Fixed
- Uses IOMessage string formatter to translate correctly the tab item label

## [0.4.2] - 2020-11-13
### Changed
- Do not render `tab-list.item` if label is empty.

## [0.4.1] - 2020-11-09
### Fixed
- Update the app documentation.

## [0.4.0] - 2020-03-30
### Added
- New block `tab-list.item.children`.

## [0.3.0] - 2020-02-28
### Added
- Make tab label editable through Site Editor.

## [0.2.0] - 2020-02-05
### Added
- `listItemActive` CSS Handle.

## [0.1.0] - 2019-12-03
### Deprecated
- `defaultActiveTab` on `TabListItem`.

### Added
- `defaultActiveTabId` on `TabLayout`.

### Changed
- Make render first tab content if `defaultActiveTabId` is not provided, to correctly render data in SSR.

## [0.0.2] - 2019-11-05

## [0.0.1] - 2019-09-20
### Added
- Initial release
