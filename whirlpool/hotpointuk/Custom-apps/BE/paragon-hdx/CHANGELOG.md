# Paragon HDX

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.14] - 2023-06-28

Update requestes to orderForm, adding a new vtex cookie for security reasons [Jira Story RUN-1811](https://whirlpoolgtm.atlassian.net/browse/RUN-1811)

## [1.0.13] - 2023-05-03

### Changed

- Changed _bucketOrderForm_ key calculation to avoid having, in case of errors, duplicate keys for orders placed by the same customer [SCTASK0896300s](https://whirlpool.service-now.com/nav_to.do?uri=%2Fsc_task.do%3Fsys_id%3D71a9a219874ae51042138409dabb353d%26sysparm_record_target%3Dsc_task%26sysparm_record_row%3D5%26sysparm_record_rows%3D6%26sysparm_record_list%3Dassignment_group%253Dfb66e9141b373090ee1f0d85604bcbe0%255EstateIN1%252C-5%252C2%255EORDERBYDESCopened_at)

## [1.0.12] - 2023-02-08

### Added

- **manifest.json** added new settings _productsWithoutSlots_ to handle the products that shouldn't have slots [SCTASK0874498](https://whirlpool.service-now.com/sc_task.do?sys_id=2b10cff887f4e1940ae5311d0ebb35ca)

### Changed

- **bizRules.ts** changed logic in order to ignore all the items if there is at least one _product without slots_ [SCTASK0874498](https://whirlpool.service-now.com/sc_task.do?sys_id=2b10cff887f4e1940ae5311d0ebb35ca)
