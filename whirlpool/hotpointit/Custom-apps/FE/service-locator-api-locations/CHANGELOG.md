## [0.0.22] - 2022-05-31
- Add new guidelines HP IT:
[RB-775](https://whirlpoolgtm.atlassian.net/browse/RB-775)
[RB-776](https://whirlpoolgtm.atlassian.net/browse/RB-776)
[RB-777](https://whirlpoolgtm.atlassian.net/browse/RB-777)

## [0.0.21] - 2022-03-04

### Changed

- **ServiceLocatorCities.tsx**, retrieve necessary info from pathname if those are not present in props. (Taking info only from props cause content not loaded on reload o direct access to specific service locator page)
- **ServiceLocatorProvincies.tsx**, check if *props.params.slug* has necessary info otherwise take them from pathname.
- **ServiceLocatorServices.tsx**, same as *ServiceLocatorCities.tsx*
  MOB ticket: [SCTASK0731108](https://whirlpool.service-now.com/nav_to.do?uri=sc_task.do?sys_id=055711a61be40150cd6c9938b04bcba1%26sysparm_view=RPTfdcf17dd1b00c198f845a687b04bcbff)

  