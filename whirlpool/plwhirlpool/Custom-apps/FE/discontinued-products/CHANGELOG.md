# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.2] - 2022-07-11
[D2CA-787: KPI Availability - WHP PL](https://whirlpoolgtm.atlassian.net/browse/D2CA-787)
- Push pixel message for `unsellableProductView` so that `google-tag-manager` can trigger `eec.productDetail` analytics event for `Not Sellable Online`

### Changed
**UnsellableProducts.tsx**

## [0.2.1] - 2022-06-22

### Changed

- **DiscontinuedProducts.tsx** and **UnsellableProducts.tsx** changed the way how *setRender* hook is called in order to prevent *"Rendered more hooks than during the previous render"* issue. [SCTASK0796983](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=3a53d3cf874c95105e0ebae6dabb3568%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [0.2.0] - 2022-05-30

### Added

- Added back end discontinued app in order to have both of them published in prod. [INC2196641](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=b34bb03787e781505e0ebae6dabb3510%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.1.55] - 2022-05-17

### Changed

- changed formatted messages and schemas title and description in **DiscontinuedProducts.tsx** and **UnsellableProducts.tsx**.