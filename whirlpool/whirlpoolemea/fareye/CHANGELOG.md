# Changelog

## [1.0.10] - 2023-08-09

### Added

- Added logic to manage errors of retrieve endpoint

## [1.0.9] - 2023-07-18

### Added

- Added check in order to redirect the user to the shipping section if the orderform has no reservation and if there are slots available

## [1.0.8] - 2023-07-11

### Added

- Added call to the **reserve slot endpoint** also on the modify payment button

## [1.0.7] - 2023-07-06

### Added

- Added call to the **reserve slot endpoint** also on the _go-to-payment_ button from profile to payment section

## [1.0.6] - 2023-07-04

### Changed

- Changed the way the onclick function on _btn-go-to-payment_ is set to always call the BE endpoint. [INC2408393](https://whirlpool.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D7915fd0a877fad105e0ebae6dabb35c9%26sysparm_record_target%3Dincident%26sysparm_record_row%3D2%26sysparm_record_rows%3D3%26sysparm_record_list%3DstateIN1%252C3%252C2%252C9%255Eassignment_group%253Dfb66e9141b373090ee1f0d85604bcbe0%255EORDERBYDESCopened_at)

### Added

- Added alert in case an user clicks on the go to payment button without having selected the slot in case there are slots available. [INC2408393](https://whirlpool.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D7915fd0a877fad105e0ebae6dabb35c9%26sysparm_record_target%3Dincident%26sysparm_record_row%3D2%26sysparm_record_rows%3D3%26sysparm_record_list%3DstateIN1%252C3%252C2%252C9%255Eassignment_group%253Dfb66e9141b373090ee1f0d85604bcbe0%255EORDERBYDESCopened_at)

## [1.0.5] - 2022-21-06

- Fix calendar visibility App Fareye

## [1.0.2] - 2022-21-06

- Release App Fareye

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).
