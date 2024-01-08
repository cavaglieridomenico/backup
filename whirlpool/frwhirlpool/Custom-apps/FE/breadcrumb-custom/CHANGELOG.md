# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.35] - 2023-05-16
[SEOPOD-944](https://whirlpoolgtm.atlassian.net/browse/SEOPOD-944) Set fixed width and height for breadcrumb arrows to improve CLS and performance.

## [0.1.33] - 2022-11-21

### removed

console logs

## [0.1.31] - 2022-11-21

### Changed

- **BreadcrumbFourLevels.tsx** PLP 3 levels for black fridays PLP. [SCTASK0851378](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=03eef47b878f51d4531fbaa5dabb35a2%26sysparm_view=RPTa5d3abe347d0d5d4c6415701e36d43c3)
## [0.1.31] - 2022-XX-XX
- Added a condition where the user can manually add a breadcrumb step before the last one in the pdps , all modifications were done inside BreadcrumbPDPCat.tsx and involve subPlpName and subPlpHref
## [0.1.30] - 2022-08-02

### Changed

- BreadCrumbPlpCat.tsx
- const prePlpUrl = "/" + searchQuery?.variables?.selectedFacets[0]?.value + "/" + searchQuery?.variables?.selectedFacets[1]?.value

* const prePlpUrl = searchQuery?.variables?.selectedFacets[1]?.value ? "/" + searchQuery?.variables?.selectedFacets[0]?.value + "/" + searchQuery?.variables?.selectedFacets[1]?.value : "/" + searchQuery?.variables?.selectedFacets[0]?.value

## [0.1.29] - 2022-06-27

### Changed

- **BreadcrumbPlpCat.tsx** and **BreadcrumbPdpCat.tsx** handled _Climatiseurs_ category. [SCTASK0778436](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=48ff6be0479345dc073e68aaf36d433b%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

## [0.1.27] - 2022-06-09

### Changed

- Changed style for Wellbeing

## [0.1.26] - 2022-05-24

### Changed

- Changed style in Breadcrumbs-four-levels

## [0.1.25] - 2022-05-16

### Changed

- Added Breadcrumbs-four-levels

## [0.1.24] - 2022-04-29

### Changed

- **BreadcrumbPdpCat.tsx** normalized _plpCategoryLink_ in order to remove accents. [INC2180977](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=a66c68b6470f0998073e68aaf36d434c%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.1.23] - 2022-03-29

[RB-463] Fix twice "lave-vaisselle" on PDP

## [0.1.22] - 2022-03-24

[RB-463] Release breadcrumb-custom on PLP-PDP
