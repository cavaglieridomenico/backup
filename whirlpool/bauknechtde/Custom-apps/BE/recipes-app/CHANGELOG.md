# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [1.0.8] - 2023-04-12
### Removed

- **GetRecipesInfo.ts** removed _Cache-Control no-store_ in production environment

## [1.0.7] - 2022-11-15
### Added

- **GetRecipesInfo.ts** added _É_ to the charachters to normalize [SCTASK0850741](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=b7bc9a57978f59d0c2a8b0afe153afff)

## [1.0.6] - 2022-10-17
### Added

- **GetRecipesInfo.ts** added _sort by createdIn desc_ to the recipes list [SCTASK0837801](https://whirlpool.service-now.com/nav_to.do?uri=%2Fsc_task.do%3Fsys_id%3Dc9c72c2697969dd0a701d400f153af0b)
### Changed
- Setup current linter and prettier presets.

## [1.0.4] - 2020-10-29
### Changed 
Replaced normalize function with a custom one build for the German Language (https://whirlpoolgtm.atlassian.net/browse/DCBKDEB-1137)

### Changed
- Using new IOClient

## [0.0.1] - 2019-03-29

### Added
- Initial example
