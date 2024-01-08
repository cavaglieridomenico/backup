# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [2.0.56] - 2023-09-13
- [RUN-1903](https://whirlpoolgtm.atlassian.net/browse/RUN-1903) Wrong format invoices file

## [2.0.55] - 2023-09-12 
- [ADYEN] - [Payment]
- Add new payment method using Vtex Iframe to allow payment flow through adyen connector, all the necessary info about this major change can be found here:    https://docs.google.com/presentation/d/18P4UkxR4gHRi5B8Qgy6fKagle776qu--WBKNYRjdBhU/edit?usp=sharing
## [2.0.54] - 2023-09-11

### Changed

- **CheckoutShippingSummary.tsx** changed shipping summary label in case the selectedSla is _Schedule_ and no slots were retrieved from hdx [INC2446378](https://whirlpool.service-now.com/nav_to.do?uri=incident.do%3Fsys_id=b0abce1b478931548f9e7e35f16d43e8%26sysparm_stack=incident_list.do%3Fsysparm_query=active=true)

## [2.0.53] - 2023-08-21
### Changed
- Add validation for name field if it has more than 50 characters
## [2.0.52] - 2023-08-17
### Changed
- updated regex for validating email address in profile step

## [2.0.51] - 2023-08-07
### Changed
- updated range filter on fareye slots from 14 days to 30 days

## [2.0.50] - 2023-08-07
[RUN-2075] Update label inside shipping section
## [2.0.49] - 2023-07-24
[INC2412895] Replaced the 'navigate' method of useRuntime with 'window.location' in Cart component --

## [2.0.48] - 2023-07-18

### Added

- **PlaceOrder.tsx** added check in order to redirect the user to the shipping section if the orderform has no reservation and if there are slots available

### Changed

- **DeliveryEditableForm.tsx** shows a warning message in case the returned slots are all filtered (weekend slots or slots after 14 days)

## [2.0.47] - 2023-07-11

### Added

- Added new mutation _saveLogsFromFEcalls_ to store error responses from the fareye endpoints, this is useful to troubleshoot the issue related to some cases where on BE side there are no logs of reservation/retrieval.

## [2.0.46] - 2023-07-10
-[RUN-1876](https://whirlpoolgtm.atlassian.net/browse/RUN-1876) [Thank you page] Last item ordered 

## [2.0.45] - 2023-07-07
- [INC2408947] Updated body of `/checkout-io/update-shipping` API call, I have added the key receiverName inside the selectedAddresses object, 
you can find it in DeliveryEditabeForm.tsx file inside updatedLogisticsInfo method.
## [2.0.44] - 2023-06-28
- [RUN-1745](https://whirlpoolgtm.atlassian.net/browse/RUN-1745) - Update VIP login

## [2.0.43] - 2023-06-28

Update requestes to orderForm, adding a new vtex cookie for security reasons [Jira Story RUN-1811](https://whirlpoolgtm.atlassian.net/browse/RUN-1811)

## [2.0.42] - 2023-06-26

### Added

- **ShippingContext.tsx** added check on _address.state_ when initializing _isAddressSetted_ to prevent orders without it in case of addresses imported from the CRM [INC2403592](https://whirlpool.service-now.com/nav_to.do?uri=incident.do%3Fsys_id=df2eccab97abe1900341b4efe153af20%26sysparm_stack=incident_list.do%3Fsysparm_query=active=true)

## [2.0.41] - 2023-06-21

-[RUN-1875](https://whirlpoolgtm.atlassian.net/browse/RUN-1875) Add civic number in summary address BEFORE go to payment [IT CC]
-[RUN-1755](https://whirlpoolgtm.atlassian.net/browse/RUN-1755) Add civic number in summary address [UK CC]

## [2.0.40] - 2023-06-21

-[RUN-1791](https://whirlpoolgtm.atlassian.net/browse/RUN-1791) Add Fareye integration

>>>>>>> 0a403fa87679514d0e6c1fb0ac8086028c1e2028
>>>>>>>
>>>>>>
>>>>>
>>>>
>>>
>>

## [2.0.39] - 2023-05-15

updated type input on ConsumerProfileEmailFieldCC component

## [2.0.38] - 2023-04-26

### Removed

- **Worldpay.tsx** removed _failure_ and _error_ switch cases [INC2366037](https://whirlpool.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D27b20ef347de655063277645d36d43ec%26sysparm_record_target%3Dincident%26sysparm_record_row%3D1%26sysparm_record_rows%3D1%26sysparm_record_list%3DstateIN1%252C3%252C2%252C9%255Eassignment_group%253Ddf84d2c9db8d8b404cf55f30cf96191e%255EORDERBYDESCu_cube_location)

## [2.0.37] - 2023-04-26

### Added

- added new custom logger to store worldpay iframe responses [SCTASK0901242](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=375493b5475ae9503bb30272e36d43da%26sysparm_view=RPTb6af9f9587008954e4bc7447cebb35c7)

## [2.0.35] - 2023-04-14

### Changed

- **ProfileContext.tsx** switched _session storage_ and _session cookie_ checks to retrieve the _accessCode_ [SCTASK0899189](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=df644473c382a9d0d19bafdc7a0131a8%26sysparm_view=RPTb6af9f9587008954e4bc7447cebb35c7)

## [2.0.34] - 2023-04-03

### Added

- **ProfileContext.tsx** added check over session cookie, if sid in session storage is not found, when setting accessCode value in custom data [INC2356286](https://whirlpool.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3D03047f54c30ead90d19bafdc7a0131bf%26sysparm_stack%3Dincident_list.do%3Fsysparm_query%3Dactive%3Dtrue)

## [2.0.33] - 2023-03-29

### Added

- Cron Job implementation to call every 5th minutes the ping endpoint [SCTASK0871456](https://whirlpool.service-now.com/nav_to.do?uri=%2Fsc_task.do%3Fsys_id%3D3ca06eba876c61d0cd9ccae7cebb35f9)

### Changed

- added */_v/private* prefix to **ping** path to bypass cloudfront cache [SCTASK0871456](https://whirlpool.service-now.com/nav_to.do?uri=%2Fsc_task.do%3Fsys_id%3D3ca06eba876c61d0cd9ccae7cebb35f9)

## [2.0.32] - 2023-03-20

- Add account to cache identifier  ([Jira Story](https://whirlpoolgtm.atlassian.net/browse/RUN-931))

## [2.0.31] - 2023-03-09

### Changed

- routes object refactored to also include the info about the order position of each step
- Refactoring to use StepHeader in PaymentSummary, instead of a custom header
- Checks to show the edit buttons refactored, to allow each component to define its custom check
- Checks to show the edit buttons improved, to disable the edit button for all the steps following the one currently active

### Removed

- console logs

### Added

- BE logs for monitoring the cookies and the correct storage of the customData re-added

[INC2344375](https://whirlpool.service-now.com/nav_to.do?uri=%2Fincident.do%3Fsys_id%3Dba3aab5447e16110b079908f746d4314)

## [2.0.30] - 2023-03-06

- [RUN-1018](https://whirlpoolgtm.atlassian.net/browse/RUN-1018) Update dependency and query

## [2.0.27] - 2023-03-01

## [2.0.25] - 2023-03-01

## [2.0.22] - 2023-02-27

## [2.0.21] - 2023-02-22

### Released

- Released stable version

## [2.0.21-beta.21] - 2023-02-20

- added Analytics events custom_error in profile step

## [2.0.21-beta.0] - 2023-02-06

- fixed Analytics events: 'eec.checkout' / 'extra_info_interaction'

## [2.0.20] - 2023-02-02

## [2.0.19] - 2023-02-02

## [2.0.18] - 2023-01-27

- removed console logs

## [2.0.17] - 2023-01-27

- fixed Analytics event eec.checkout

## [2.0.12] - 2023-01-17

- [CCITA-1328](https://whirlpoolgtm.atlassian.net/browse/CCITA-1328), [CCITA-1311](https://whirlpoolgtm.atlassian.net/browse/CCITA-1311)

## [2.0.11] - 2023-01-17

## [2.0.10] - 2023-01-17

## [0.0.9] - 2022-11-04

first release inside production workspace

- added cta_click for BF

### Added

- Initial release.
