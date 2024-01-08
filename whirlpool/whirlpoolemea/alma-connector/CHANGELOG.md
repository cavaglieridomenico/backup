# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [2.1.8]
- removed console logs
## [2.1.5]
### Changed

- **connector.ts** and **paymentMapping.ts** changed _purchase amount_ calculation due to wrong result in some cases [INC2277758](https://whirlpool.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D45d1637c47b2d15063277645d36d439d)

## [2.1.4]
### Removed

- **connector.ts** removed _scored yes_ from the states that approve the payment

## [2.1.3] - 2022-10-19

### Added

- **getPayment.ts** and **connector.ts** implemented logs [INC2271006](https://whirlpool.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D3abfb1b0972619d45f83b3a3f153af05)

### Changed

- **connector.ts** changed _cancel_ function to refund payment only if at least one installment is paid, otherwise trigger the payment cancellation. [INC2271006](https://whirlpool.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D3abfb1b0972619d45f83b3a3f153af05)
- **getPayment.ts** changed how the cancel notification is handled. Now payment is always marked as denied and the user is redirected to the checkout page with a popup error message [INC2271006](https://whirlpool.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D3abfb1b0972619d45f83b3a3f153af05)

### Added

- Created connector
