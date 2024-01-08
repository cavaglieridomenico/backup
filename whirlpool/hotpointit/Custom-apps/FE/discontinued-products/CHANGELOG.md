# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.5] - 2023-07-04
- Fixed meta title:
[SEOPOD-964](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-964)

## [0.0.4] - 2023-01-27

- Changed the position of useEffect to be before the return related to loading status of the query inside DiscontinuedProducts.tsx and UnsellableProducts.tsx, because its previous position broke the pdp of unsellable products in production.

## [0.0.3] - 2022-06-30
[D2CA-851: KPI Availability - HP IT](https://whirlpoolgtm.atlassian.net/browse/D2CA-851)
- Push pixel message for `unsellableProductView` so that `google-tag-manager-ita` can trigger `eec.productDetail` analytics event for `Not Sellable Online`

### Changed
**UnsellableProducts.tsx**