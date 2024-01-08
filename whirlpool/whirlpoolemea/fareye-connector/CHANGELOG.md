# FarEye Connector

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.6] - 2023-07-19

### Changed

- **fetchDeliverySlots.ts** changed carrierCode stored in custom data when no slots are available
- **getReservationCode.ts** changed reservation code sent in the response when no slots were available.

### Added
- **reserveSlot.ts** added additional check for slots not available.

## [0.1.5] - 2023-07-18

### Added

- **checkBookingStatus.ts** and **deleteOldBooking.ts** added a new log when a reservation is canceled
- **checkBookingStatus.ts** added a new field in the response that indicates if a reservation has been found.

## [0.1.4] - 2023-07-11

### Changed

- **service.json** increased _ttl_ and _replicas_

## [0.1.3] - 2023-07-06

### Added
- added endpoint to check if the order has a reservation (for FE)

## [0.1.2] - 2023-07-06

### Added

- Added ping endpoint and cron job every 5th minute

## [0.0.21] - 2023-02-08

### Added

- **fetchDeliverySlots.ts** added logs with fareye payload and response
- **reserveSlot.ts** added logs with fareye payload and response
