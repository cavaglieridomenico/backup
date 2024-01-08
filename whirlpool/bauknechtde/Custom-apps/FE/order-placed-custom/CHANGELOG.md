# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [0.1.2] - 2023-02-08
[SCTASK0906911] changed message "store/services.title" in de 
## [0.1.1] - 2023-02-08

### Changed

- **DeliveryHeader.tsx** changed regex that splits the receiverName so that the look behind is not used [INC2328791](https://whirlpool.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D22d691ba47f8ed18a6c91978f36d438a)

## [0.0.27] - 2023-01-25

## [0.0.26] - 2022-08-10

### Changed

- **DeliveryHeader.tsx** changed *firstName* and *secondName* consts and the insert of these in div with trim in order to remove spaces. [INC2234799](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=1fa2bfc697095554a701d400f153af19%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.0.25] - 2022-07-04

## [0.0.24] - 2022-06-20

## [0.0.23] - 2022-06-20

## [0.0.22] - 2022-06-03

## [0.0.21] - 2022-06-03

## [0.0.20] - 2022-05-18

## [0.0.19] - 2022-05-18

## [0.0.13] - 2022-01-18

## [0.0.12] - 2021-10-28

## [0.0.11] - 2021-10-26

## [0.0.10] - 2021-10-26

## [0.0.9] - 2021-06-16

## [0.0.8] - 2021-06-16

## [0.0.6] - 2021-04-12

## [0.0.4] - 2021-04-07

## [0.0.3] - 2021-04-07

## [0.0.2] - 2021-04-04

## [2.8.2] - 2021-03-03

### Fixed

- Relative links to the store using the **Link** component from `render-runtime`.

## [2.8.1] - 2021-01-29

### Fixed

- Product Subtotal in `ProductList/Product.tsx`, adding unitMultiplier in product subtotal

## [2.8.0] - 2021-01-19

### Added

- I18n pt-PT.

## [2.7.0] - 2021-01-19

### Added

- `productId` property to `getOrderGroup` query

## [2.6.2] - 2020-12-22

### Fixed

- Types.

## [2.6.1] - 2020-12-22

### Added

- Removing assemblies from the items count

## [2.6.0] - 2020-12-17

### Added

- I18n Cs, Fr, Nl and Ro.

### Fixed

- I18n it.

### Changed

- Crowdin configuration file.

## [2.5.0] - 2020-12-15

### Added

- `parentItemIndex` field in GraphQL query.

## [2.4.3] - 2020-10-21

### Fixed

- Display of embedded info for non `bankIvoice` payments.

## [2.4.2] - 2020-08-04

### Added

- Fixed display of images on the website.

## [2.4.1] - 2020-08-03

### Added

- IO app typings.

## [2.4.0] - 2020-08-03

### Added

- New css handles: `barCodeContainer`, `printButtonWrapper` and `printHintWrapper`.

## [2.3.0] - 2020-07-08

### Added

- Italian translation.

## [2.2.5] - 2020-06-22

## [2.2.4] - 2020-06-22

### Fixed

- `main` tag not working properly in IE 11.
- Possible duped keys in `OrderTotal`.

## [2.2.3] - 2020-05-15

### Fixed

- Typo in messages key.

## [2.2.2] - 2020-05-13

### Added

- Bank invoice helper tooltip.

## [2.2.1] - 2020-04-06

### Fixed

- Order totals.

## [2.2.0] - 2020-04-01

### Added

- Export the `useOrder` and `useOrderGroup` hooks.

## [2.1.0] - 2020-03-10

### Added

- `footer` extension point.

## [2.0.2] - 2020-02-28

### Fixed

- Add the page block to the docs.

## [2.0.1] - 2020-02-28

### Fixed

- English translation.

## [2.0.0] - 2020-02-03

## [1.7.1] - 2019-11-21

### Fixed

- Use `vtex.totalizer-translator` to correctly list all taxes applied to an order.

## [1.7.0] - 2019-11-21

### Added

- **de** translations.

## [1.6.0] - 2019-11-01

### Added

- Install Promotion Banner at the end of the page.

## [1.5.0] - 2019-09-09

### Added

- Docs builder.

## [1.4.3] - 2019-09-02

### Fixed

- Translation of "you'll" to "you will".

## [1.4.2] - 2019-08-07

### Fixed

- Links to the bank invoice. The user has to be signed in to see it.

## [1.4.1] - 2019-08-06

### Fixed

- Use **bankIssuedInvoiceIdentificationNumber** instead of **bankIssuedInvoiceBarCodeNumber** to be copied to the clipboard.

## [1.4.0] - 2019-07-26

### Added

- Extension point at the top of the Order Placed.

## [1.3.0] - 2019-07-24

### Added

- **connector response** information to `PaymentMethod` component for **Multibanco** payments.

## [1.2.6] - 2019-07-18

### Fixed

- Removed `context.json` from wrong location.

## [1.2.5] - 2019-07-17

### Fixed

- Add a `context.json` as a fallback for a builder-hub bug.

## [1.2.4] - 2019-07-17

### Fixed

- Wrong translation of `unit` and `units` after erroneous rebase.

## [1.2.3] - 2019-07-12

### Changed

- Intl messages to meet the requirements of the new **messages** builder api.

### Fixed

- Check for the existence of a payment before retrieving values on `getPaymentGroupFromOrder`.

## [1.2.2] - 2019-06-27

### Fixed

- Wrong translation of `unit` and `units`.

## [1.2.1] - 2019-06-10

### Fixed

- Order placed page breaking when user is not logged in.

## [1.2.0] - 2019-05-27

### Changed

- Migrate to pixel manager v1.

## [1.1.1] - 2019-03-28

### Fixed

- Typo on Spanish translation

## [1.1.0] - 2019-03-28

### Added

- Spanish messages

### Changed

- Testing is now made with @vtex/test-tools

### Fixed

- Unnecessary keys were removed
- Missing pontuation on a few messages

## [1.0.1] - 2019-03-22

### Changed

- Minor accessibility improvements.

## [1.0.0] - 2019-03-01

### Added

- Analytics support for Google Tag Manager

### Changed

- GraphQL query `orderGroup`

## [0.1.4] - 2019-02-22

### Fix

- Inconsistent product image height

### Fix

- Layout fix on Warnings component

## [0.1.3] - 2019-02-22

### Fix

- Small layout bug on OrderTotals

## [0.1.2] - 2019-02-22

## [0.1.1] - 2019-02-21

## [0.1.0] - 2019-02-21

## Added

- Release first public version

## [0.0.1-beta.0] - 2019-01-25

## [0.0.1-beta] - 2019-01-21

### Added

- Initialize repo, with vtex.order-placed-graphql as a dependency.
