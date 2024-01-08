# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Fixed wrong redirect [WI-507](https://whirlpoolgtm.atlassian.net/browse/WI-507)

## [0.0.9] - 2022-07-25

- Added condition inside mappings.ts to check if categories are undefined. This way the carousel inside the PDP won't be broken anymore

## [0.0.8] - 2022-03-29

[WHP FR - FUNREQ40 Promotion View/click](https://whirlpoolgtm.atlassian.net/browse/D2CA-609)

- Added `isPrevent` prop that can be set to false so that link can trigger `eec.promotionClick` analytics event for the button in the promotion banner of homepage

## [0.0.7] - 2022-03-29

## [0.0.4] - 2021-05-25

## [0.0.3] - 2021-05-25

## [0.0.2] - 2021-05-25

## [0.7.3] - 2021-02-11
### Added
- `escapeLinkRegex` useful option to use a regexp to remove unwanted characters.

## [0.7.2] - 2021-01-11
### Fixed

- Required fields not being required in `StoreLink` schema.

## [0.7.1] - 2020-12-03
### Fixed

- Use search API slugify method for product brand.

## [0.7.0] - 2020-09-10
### Added

- `scrollTo` option to perform scroll after navigation.
- `formatIOMessage` to link label.

## [0.6.2] - 2020-07-28
### Changed

- Specification group name and specification name use original values of Catalog

## [0.6.1] - 2020-07-24
### Fixed

- README.md file (fixed the Modus Operandi section).
- Props `label` and `buttonProps` of `StoreLink`  being optional but not in typescript.

## [0.6.0] - 2020-06-23
### Added

- Option to get a dynamic value from product specification.

## [0.5.1] - 2020-04-24
### Security

- Bump dependencies versions.

## [0.5.0] - 2020-04-07
### Added

- `queryString` values interpolation.

## [0.4.0] - 2020-03-06
### Added

- `displayMode` prop.

## [0.3.1] - 2020-02-27

### Fixed

- Documentation typos 

## [0.3.0] - 2020-02-19
### Added

- `target` prop to the schema of the components.

## [0.2.0] - 2020-02-19
### Added

- Schema to the blocks.
- `target` prop to all links.

## [0.1.1] - 2020-02-13

### Fixed

- Improper section for props was removed.

## [0.1.0] - 2020-01-31

### Added

- Initial release.
