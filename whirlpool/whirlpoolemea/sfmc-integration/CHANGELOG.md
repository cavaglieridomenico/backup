# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## To be released:

## [2.1.13] - 2023-09-05

### Added
- added logic to send the additional services in the order confirmation totals. The logic is triggered by a new app setting (serviceInTotals). Ticket reference: https://whirlpoolgtm.atlassian.net/browse/RUN-1892

## [2.1.11] - 2023-05-30

Added check to controll if an order has got a reservation due to checkReservationForCustomDeliveryLable:boolean retrieved from the appSettings  (FarEye must be be already installed on the country). This value changes the estematedDeliveryDate sent to SFMC in confCancEmailMapper(). The new value is retrived by the appSettings in the field noReservationDeliveryLable:string

## [2.1.9] - 2023-05-30

- Added paid delivery logic in mapper

## [2.1.6] - 2023-05-16

- **mapper.ts** changed: fixed static additioanl services into the email.

## [2.1.2] - 2023-03-21

### Changed

- **mapper.ts** changed _formatPrice_ function to fix the price calculation in case the price is less than 10 cents [INC2350002](https://whirlpool.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D47f5051c47f9a11063277645d36d438e%26sysparm_record_target%3Dincident%26sysparm_record_row%3D1%26sysparm_record_rows%3D4%26sysparm_record_list%3DstateIN1%252C3%252C2%252C9%255Eassignment_group%253Dfb66e9141b373090ee1f0d85604bcbe0%255EORDERBYDESCopened_at)

## [2.0.22] - 2023-02-17

### Changed

- **VtexMP.ts** changed _memoryCache_ keys to fix the retrieval of the info from the wrong account [INC2333502](https://whirlpool.service-now.com/incident.do?sys_id=572632219781e15c5b0eb9bfe153afa5)

## [2.0.20] - 2023-02-13

- app updated in order to integrate BK DE requirement
  - included Price Drop service
  - improved the management of spare

## [2.0.18] - 2022-12-20

### Updated

- mapper.ts in order to manage spare and accessories about the confirmation email

## [Unreleased]

## [0.1.0] - 2020-07-22

## [0.0.3] - 2020-07-13

## [0.0.2] - 2020-07-13

### Changed

- Add first version of docs
