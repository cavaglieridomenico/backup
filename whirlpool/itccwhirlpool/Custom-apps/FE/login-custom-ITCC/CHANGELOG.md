# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.0.71] - 2023-08-02
- fix userCompany saved in sessionStorage - [D2CA-1819](https://whirlpoolgtm.atlassian.net/browse/D2CA-1819)

## [0.0.69] - 2023-04-18

### Changed

- Changed VIP autologin flow, added new Guest Form and new Guest field in registration form.

[RUN-1055](https://whirlpoolgtm.atlassian.net/browse/RUN-1055)

## [0.0.68] - 2023-03-24

### Added

- new message *store/custom-login.signup-form.error-VIPaccessCode* used for the invalid VIP access code
- **LoginContext.tsx** set *IsSignUpSubmitting* to **false** after completing the sign up API call, to remove the infinity loader

[SCTASK0883886](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=d7599cad47112150b079908f746d435f%26sysparm_view=RPTb6af9f9587008954e4bc7447cebb35c7)

## [0.0.67] - 2023-03-14

### Changed

- **LoginContext.tsx** changed how the access code is retrieved to fix autologin issues

## [0.0.65] - 2022-02-22

### Added

- added Analytics GA4 enhancement

## [0.0.56] - 2022-01-03

Add session storage param for invitations. -[ITCC-1064](https://whirlpoolgtm.atlassian.net/browse/CCITA-1231)

## [0.0.55] - 2022-12-02

- loader and input font fix

## [0.0.54] - 2022-12-02

## [0.0.53] - 2022-12-02

-[ITCC-921](https://whirlpoolgtm.atlassian.net/browse/CCITA-921)

## [0.0.52] - 2022-11-28

-[ITCC-1064](https://whirlpoolgtm.atlassian.net/browse/CCITA-1064)

## [0.0.51] - 2022-11-25

- [ITCC-674](https://whirlpoolgtm.atlassian.net/browse/CCITA-674)

## [0.0.50] - 2022-11-24

- [ITCC-1008](https://whirlpoolgtm.atlassian.net/browse/CCITA-1008) added setItem accessCode for all vip cases not only with invite url.

## [0.0.49] - 2022-11-21

### Added

- [ITCC-618](https://whirlpoolgtm.atlassian.net/browse/CCITA-618) added modal open feature when sid is in vip url.
