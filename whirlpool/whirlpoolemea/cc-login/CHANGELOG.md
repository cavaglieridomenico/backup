# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [1.1.26] - 2023-08-02
[INC2417139] 'onchangeprofileinfo' custom event catched
## [1.1.25] - 2023-07-31
### Fixed
- **VIPAuthorizationChecker.ts** removed check on _trustVIP_ to fix login in myvtex env
- **CheckHostAndTradePolicy.ts** removed check on _LINKED_ when retrieving _tradePolicyInfo_

## [1.1.24] - 2023-07-18
### Fixed
- [INC2416498](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=7aeb80d28784fdd48791a79d0ebb3549%26sysparm_view=RPTb3a223af4790d5d4c6415701e36d4356) fixed redirect to my account for guest users
## [1.1.23] - 2023-06-28
### Fixed
- removed redirect to my account for logged in users
## [1.1.22] - 2023-06-28
### Fixed
- fixed regression on account icon redirect
## [1.1.20] - 2023-06-28
- [RUN-1745](https://whirlpoolgtm.atlassian.net/browse/RUN-1745) - Update VIP login
## [1.1.19] - 2023-06-28

Implement logic to login as guest just with email [Jira Story RUN-1745](https://whirlpoolgtm.atlassian.net/browse/RUN-1745)

## [1.1.18] - 2023-04-25

### Fixed

- **SignupChecker.ts** fixed VIP registration flow [INC2365040](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=afa7141397122910a701d400f153af6c%26sysparm_view=RPT9bcc09561bff3810708f26db234bcb61)

### Changed

- Update VIP registration flow and vip authorization service, in order to handle the users with autologin disabled [Jira Story RUN-1055](https://whirlpoolgtm.atlassian.net/browse/RUN-1055)

## [1.1.17] - 2023-04-0X

### Changed

- Setup current linter and prettier presets.

## [1.1.11] - 2023-01-30

- removed console logs

## [0.2.0] - 2020-10-29

### Changed

- Update documentation to include Route Params.

## [0.1.1] - 2020-06-26

### Changed

- Adding Github Actions and using vtex/typescript settings.

## [0.1.0] - 2020-06-08

### Changed

- Update to node builder `6.x`

## [0.0.7] - 2020-03-24

## [0.0.6] - 2020-01-11

- Improving the documentation and adding more examples on the handlers.

## [0.0.5] - 2019-11-18

## [0.0.4] - 2019-09-18

## [0.0.3] - 2019-04-26

## [0.0.2] - 2019-04-26

### Changed

- Using new IOClient

## [0.0.1] - 2019-03-29

### Added

- Initial example
