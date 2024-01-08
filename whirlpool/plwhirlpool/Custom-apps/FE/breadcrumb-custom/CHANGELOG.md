## [0.2.82] - 2022-07-12

### Changed

- Add CSS HANDLES

## [0.2.80] - 2022-05-30

### Changed

- **Breadcrumb.tsx** managed unsellable products breadcrumb. [INC2196641](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=b34bb03787e781505e0ebae6dabb3510%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)

## [0.2.79] - 2022-05-17

### Changed

- **Breadcrumb.tsx** changed the way in which categories from discontinued product are mapped in breadcrumb custom.

## [0.2.78] - 2022-04-12

### Changed 

- applied style directly from tag "*<img>*" as giving className cause a strange behaviour (only on production environment) making the breadcrumb arrow to opacity 1%.

## [0.2.77] - 2022-04-12

### Changed 

- changed the href link for breadcrumb replacing " " with "-" because this was causing 404 errors. This also fixed ">" breadcrumb icons that were not shown correctly. 
  MOB tickets: 
  - [INC2172094](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=7dce34a587f64910531fbaa5dabb3524%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)
  - [INC2172372](https://whirlpool.service-now.com/nav_to.do?uri=incident.do?sys_id=0a7c0aa5477a8910a6c91978f36d430c%26sysparm_view=RPTa6ccc9921bff3818cdf96397624bcba8)