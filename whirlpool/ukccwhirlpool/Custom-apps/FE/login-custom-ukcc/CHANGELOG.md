# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.0.78] - 2023-09-04
- [RUN-2174](https://whirlpoolgtm.atlassian.net/browse/RUN-2174) - [Support] Add a support section in the login page
## [0.0.77] - 2023-08-02
- fix javascript errors custom events - [D2CA-1830](https://whirlpoolgtm.atlassian.net/browse/D2CA-1830)
## [0.0.75] - 2023-06-28
- [RUN-1745](https://whirlpoolgtm.atlassian.net/browse/RUN-1745) - Update VIP login
## [0.0.74] - 2023-05-10

### Changed

- **LoginContext.tsx** made some changes to the context for handling the new LoginGuestForm component and logic, to enable the VIP Guest login by inserting the access code.

### Added

- **LoginGuestForm.tsx** added new form component for new VIP guest login flow.

## [0.0.73] - 2023-03-14

### Changed

- **LoginContext.tsx** changed how the access code is retrieved to fix autologin issues

## [0.0.68-beta.0] -- 2023-01-27 
- added Analytics GA4 enhancement