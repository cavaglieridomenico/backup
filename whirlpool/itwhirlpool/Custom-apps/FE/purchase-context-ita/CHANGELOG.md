## [0.0.4] - 2022-02-15

### Changed

- **PurchaseContext.tsx** changed check on localStorage in order to prevent *servicesPurchase* firing at page reload (to have only one eec.purchase event). [INC2134686](https://whirlpool.service-now.com/incident.do?sys_id=632f2a261be505d06147a688b04bcb99&sysparm_record_target=incident&sysparm_record_row=1&sysparm_record_rows=1&sysparm_record_list=assignment_group%3Dfb66e9141b373090ee1f0d85604bcbe0%5EstateIN1%2C3%2C2%5EORDERBYDESCnumber)