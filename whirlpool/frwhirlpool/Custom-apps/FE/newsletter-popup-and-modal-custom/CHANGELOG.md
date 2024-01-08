# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.38] - 2023-01-24
- fixed label for cta_click

## [0.2.37] - 2023-01-20

- Changed the way external campaign is setted/retrieved in the URL in order to prevent issues on path that contains **?SOME_CHARACTERS** [SCTASK0869497](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=b1be00414760a910e8e97161e36d43c9)

## [0.2.36] - 2022-11-23

- Added CTA click tracking for Black Friday

## [0.2.34] - 2022-11-10

- Add fallback link on react prop because the default on cms doesn't work properly

## [0.2.33] - 2022-11-10

- Editable url from cms

## [0.2.32] - 2022-11-10

- Temporary change of the url

## [0.2.31] - 2022-08-29

[DC-832](https://whirlpoolgtm.atlassian.net/browse/DC-832)

- Release Fix Parallel Campaign for WH FR

## [0.2.30] - 2022-08-09

[RB-1127](https://whirlpoolgtm.atlassian.net/browse/RB-1127)

- Graphic fix on CSS for borders of form

## [0.2.29] - 2022-06-22

### changed

-changed the way how the the newsletter block work from opening a popup at the same page to opening a new landingpage with the same form in the popup

## [0.2.28] - 2022-06-13

[RB-879: [HomePage NEW Popup for Soldes WHR FR](https://whirlpoolgtm.atlassian.net/browse/RB-879)

- Add New popup for soldes

## [0.2.27] - 2022-05-23

### Changed

- Changed Formatted messages in _messages_ folder. [SCTASK0783868](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=6d03238d47a34150a6c91978f36d4390%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [0.2.26] - 2022-05-03

[D2CA-641: WHP FR - Funreq52 - insert one parameter in DL - FE impl](https://whirlpoolgtm.atlassian.net/browse/D2CA-641)

- Add `email` field for `leadGeneration` analytics event

## [0.2.25] - 2022-04-13

### Added

- added text-align justify in style.css for _.informativa :global(.vtex-checkbox\_\_line-container)_. (version bumped to 0.2.25 as in ws master there was version 0.2.24)

## [0.0.2]

## Added

- Error message when user is already registred

## [0.0.1]

## Added

- First release
