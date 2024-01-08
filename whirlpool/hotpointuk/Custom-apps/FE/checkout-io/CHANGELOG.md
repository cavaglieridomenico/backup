# Changelog


All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.19] - 2023-09-11

- [RUN-1903](https://whirlpoolgtm.atlassian.net/browse/RUN-1903) Wrong format invoices file

## [0.2.18] - 2023-09-05

- [RUN-1892](https://whirlpoolgtm.atlassian.net/browse/RUN-1892) [Checkout] Update totals inside checkout [HPUK]

## [0.2.17] - 2023-09-04

- [RUN-2156](https://whirlpoolgtm.atlassian.net/browse/RUN-2156) [Checkout] Delivery not selected in case of multiple products [HPUK]


### Resolved bug

* On the checkout the items with the delivery didn't split, therefore a mutation to update the order item and put in the bundleItems the delivery service if the product has it available in the offering array --> [bug]([https://whirlpoolgtm.atlassian.net/browse/RUN-2156](https://whirlpoolgtm.atlassian.net/browse/RUN-2156 "https://whirlpoolgtm.atlassian.net/browse/run-2156"))

## [0.2.14] - 2023-09-04

### Fixed

- **cart.tsx** fixed _productsDeliveryValues_ calculation [INC2426073](https://whirlpool.service-now.com/nav_to.do?uri=incident.do%3Fsys_id=8cc1d1074754b5d08f9e7e35f16d43f9%26sysparm_stack=incident_list.do%3Fsysparm_query=active=true)

## [0.2.13] - 2023-06-28

Update requestes to orderForm, adding a new vtex cookie for security reasons [Jira Story RUN-1811](https://whirlpoolgtm.atlassian.net/browse/RUN-1811)

## [0.2.12] - 2023-06-20

### Changed

- **validateFields.ts** changed _EMAIL\_REGEX_ to solve the latest edge cases received in orders 1340210651629-01 and 1339700650396-01 [SCTASK0922015](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do%3Fsys_id=09ae3c19972fa9105b0eb9bfe153af58%26sysparm_stack=sc_task_list.do%3Fsysparm_query=active=true)

## [0.2.11] - 2023-05-31

Subsituted all useCartOrder with useOrder hook

## [0.2.10] - 2023-05-30

### Fixed

- Checkout Shipping summary

>>>>>>> 0a403fa87679514d0e6c1fb0ac8086028c1e2028
>>>>>>>
>>>>>>
>>>>>
>>>>
>>>
>>

Update requestes to orderForm, adding a new vtex cookie for security reasons [Jira Story RUN-1811](https://whirlpoolgtm.atlassian.net/browse/RUN-1811)

## [0.2.11] - 2023-05-31

Subsituted all useCartOrder with useOrder hook

## [0.2.10] - 2023-05-30

### Fixed

- Checkout Shipping summary

## [0.2.9] - 2023-05-30

### Fixed

- Delivery at cost fix

## [0.2.8] - 2023-05-30

### Added

- Delivery at cost

## [0.2.7] - 2023-05-15

### Added

- Added WP iframe logs implementation [SCTASK0908224](https://whirlpool.service-now.com/nav_to.do?sys_id=0b60131097fead5026c6362e6253af3e%26sysparm_view=RPTb6af9f9587008954e4bc7447cebb35c7)

### Fixed

- Fixed _email regex_ in profile step

## [0.2.6] - 2023-05-10

### Added

- Checkbox for the profiling optin in the _Profile_ step. Even if we added it we will hide it as for business requirment, anyway the logic behind will stay as it stands. For this reason by default the profiling checkbox is hidden, if you wanto to show it you have to change it from CMS SiteEditor.
  Jira tickets:
  - [DC-1299](https://whirlpoolgtm.atlassian.net/browse/DC-1299)
  - [DC-1616](https://whirlpoolgtm.atlassian.net/browse/DC-1616)

## [0.2.5] - 2023-04-11

### Changed

- routes object refactored to also include the info about the order position of each step
- Refactoring to use StepHeader in PaymentSummary, instead of a custom header
- Checks to show the edit buttons refactored, to allow each component to define its custom check
- Checks to show the edit buttons improved, to disable the edit button for all the steps following the one currently active
- Show _place order_ button only in the payment step

[SCTASK0883532](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=e783f49987916510d2b72f45dabb3505)

## [0.2.3] - 2023-02-01

- [RUN-273](https://whirlpoolgtm.atlassian.net/browse/RUN-273) Added product data sheet and energy logo in cart and checkout

## [0.2.2] - 2023-01-19

- fixed Analytics: event eec.checkout / added items properties to orderForm

## [0.2.0] - 2022-12-21

- released stable version

## [0.2.0-beta.0] - 2022-12-19

### Added

- added Analytics GA4 enhancement

## [0.0.14] - 2022-11-23

### Changed

- changed step 3 of checkout Event to include the products and other little changes.

## [0.0.9] - 2022-11-04

### Changed

- added cta_click for BF

### Added

- Initial release.
