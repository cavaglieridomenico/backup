# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [0.2.54] - 2023-06-21
[SCTASK0916827]
[SCTASK0916824]
Implemented {promotionText} prop in "newletter-form" interface 
## [0.2.49] - 2023-03-01

Legal requirement:
- [RUN-902](https://whirlpoolgtm.atlassian.net/browse/RUN-902) Insert a new field with the link of preference cookie (One Trust) 
- [RUN-589](https://whirlpoolgtm.atlassian.net/browse/RUN-589) Checkout: Update Consent Wording
- [RUN-588](https://whirlpoolgtm.atlassian.net/browse/RUN-588) Update Marketing Consent Wording
- [RUN-583](https://whirlpoolgtm.atlassian.net/browse/RUN-583) Update on Cookie Notice
- [RUN-552](https://whirlpoolgtm.atlassian.net/browse/RUN-552) Update on Privacy Notice 

## [0.2.48] - 2023-01-20

- Changed the way external campaign is setted/retrieved in the URL in order to prevent issues on path that contains **?SOME_CHARACTERS** [SCTASK0869497](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=b1be00414760a910e8e97161e36d43c9)

## [0.2.47] - 2022-01-19

- Updated the CRM flow for newsletter subscription if user is registered OR if it's only subscribed to newsletter.

## [0.2.46] - 2022-12-21

- released stable version

## [0.2.46-beta.0] - 2022-12-19

### added

- added Analytics GA4 enhancement

## [0.2.45] - 2022-11-21

### changed

- [RB-1583](https://whirlpoolgtm.atlassian.net/browse/RB-1583) - Changed the newsletterform's props interface to accept markdown language in order to enable the addition via CMS of links.

## [0.2.43] - 2022-11-04

### changed

- added cta click tracking for Black Friday and new context to know if the NewsLetterForm is used in automatic or not

## [0.2.42] - 2022-11-03

### fixed

- fixed layout CSS for search reviews in PDP modal [SCTASK0847210](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=e293912397f615505b0eb9bfe153afce%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)

## [0.2.41] - 2022-10-25

### Added

- **verify.ts** add german characters to the regex name surname validation [SCTASK0839478](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=7d661bc887225954e4dc53d73cbb3536%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)

## [0.2.40] - 2022-10-24

### Removed

- **LandingPageForm.tsx** Removed paragraph with wrong message [SCTASK0843012](https://whirlpool.service-now.com/nav_to.do?uri=%2Fsc_task.do%3Fsys_id%3D7e16a94b47e259d43bb30272e36d43a9)

## [0.2.39] - 2022-10-19

### Changed

- [RB-1253](https://whirlpoolgtm.atlassian.net/browse/RB-1253) Changed the style of the Popup and of Form to align with HP UK.

## [0.2.38] - 2022-10-05

### Changed

- Changed how the campaign can be setted from CMS SiteEditor section and how the campaign is retrieved (it will be retrieved from URL if present otherwise from SiteEditor value).
  [DC-1026](https://whirlpoolgtm.atlassian.net/browse/DC-1026)

## [0.2.37] - 2022-10-04

## [0.2.36] - 2022-09-13

Made texts of Popup and Landing Page editable via CMS

## [0.2.35] - 2022-07-04

## [0.2.34] - 2022-06-23

## [0.2.33] - 2022-06-22

## [0.2.32] - 2022-06-21

## [0.2.31] - 2022-06-20

## [0.2.30] - 2022-06-20

## [0.2.28] - 2022-06-14

## [0.2.27] - 2022-06-13

## [0.2.26] - 2022-05-18

## [0.2.21] - 2022-04-20

[DCBKDEB-80](https://whirlpoolgtm.atlassian.net/browse/DCBKDEB-80)

Lateral padding of checkbox-input removed.

## [0.2.20] - 2022-04-19

[DCBKDEB-80](https://whirlpoolgtm.atlassian.net/browse/DCBKDEB-80)

[DCBKDEB-81](https://whirlpoolgtm.atlassian.net/browse/DCBKDEB-81)

Form for the registration to the newsletter added. Logics behind the registration updated. Thank-you page updated.

## [0.0.19] - 2022-01-25

Add leadGeneration analytics event on opt-in for newsletter [D2CA-342](https://whirlpoolgtm.atlassian.net/browse/D2CA-342)

## [0.0.2]

## Added

- Error message when user is already registred

## [0.0.1]

## Added

- First release
