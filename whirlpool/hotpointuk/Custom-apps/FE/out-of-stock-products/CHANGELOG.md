# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.8] - 2022-12-06

# Changed

- Deleted one context wrapper in order to enable the minicart autoupdate in discontinued products' pdp.

## [0.0.7] - 2022-07-21
[D2CA-802: HP UK: KPI Availability (dimension8), variant, broken pageView and feReady in PDP due to change in product reference ID](https://whirlpoolgtm.atlassian.net/browse/D2CA-802)

- Send `unsellableProductView` to trigger `eec.productDetail` from `analytics` custom app

### Changed
**DiscontinuedProducts.tsx**

## [0.0.6] - 2022-06-22

### Changed

- **DiscontinuedProducts.tsx** changed the way how *setRender* hook is called in order to prevent *"Rendered more hooks than during the previous render"* issue. [INC2208595](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=8f5f085e47045590a6c91978f36d436a%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)
