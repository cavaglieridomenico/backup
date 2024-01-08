# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.0.12] - 2023-07-03

- Fixed meta title in discontinued products PDP [SEOPOD-961](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-961)



- Fixed DOM/Source Asymmetry (https://whirlpoolgtm.atlassian.net/browse/SEOPOD-810)

## [0.0.10] - 2022-06-23
[D2CA-848: KPI Availability - WHP IT](https://whirlpoolgtm.atlassian.net/browse/D2CA-848)
- Push pixel message for `unsellableProductView` so that `google-tag-manager-ita` can trigger `eec.productDetail` analytics event for `Not Sellable Online`

### Changed
**UnsellableProducts.tsx**

## [0.0.9] - 2022-06-22

### Changed

- **DiscontinuedProducts.tsx** and **UnsellableProducts.tsx** changed the way how *setRender* hook is called in order to prevent *"Rendered more hooks than during the previous render"* issue. [SCTASK0796983](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=3a53d3cf874c95105e0ebae6dabb3568%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)
