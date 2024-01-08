<!-- @format -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.0.12]

### Added

- Suspense implementation

### Removed

- Bloatware

## [0.0.10] - 2022-02-23

- Removed Skeletons and cleaned the majority of the unnecessary code

## [0.0.9] - 2023-07-03

- Fixed title [SEOPOD-1041](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-1041)

## [0.0.8] - 2022-02-15

- This does not suck anymore
- Render a Suspense by default (for LCP improvement), except for case where at specific child ID it renders Skeleton (for CLS improvement)
