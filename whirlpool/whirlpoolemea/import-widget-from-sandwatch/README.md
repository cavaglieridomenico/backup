# import-widget-from-sandwatch@2.x
Is useful if:
- You need to show:
    old "problemi-e-soluzioni"
    old "Service-Locator"
    old "Garanzia-scaduta-oow"
we merged them into one because they made all the same things but witha  different template.


### Examples of use

- NORMAL: 
```json
{
  "store.custom#garanzia-scaduta-oow": {
    "children": [
      "breadcrumb#garanzia-scaduta-oow",
      "rich-text#garanzia-scaduta-oow",
      "import-widget-from-sandwatch",
      "analytics"
    ]
  }
}
```
### Configuration

| Prop name             | Type     | Description                                                   | Default value |
| --------------------- | -------- | ------------------------------------------------------------- | ------------- |
| `className`           | `string` | Allows to pass a custom name to be added to component css div | `''`          |
| `id`                  | `string` | Specify the id example:"store-locator-app"                    | `''`          |
| `data-brand`          | `string` | Specify if it's WH or HP, respectively whirlpool or hotpoint) | `''`          |
| `data-country`        | `string` | Define country place                                          | `{}`          |
| `data-locale`         | `string` | Define Language Locale                                        | `false`       |
| `data-type`           | `string` | Define type of service                                        | `""`          |
| `data-version`        | `string` | Define last update                                            | `""`          |
| `bookingRefBootstrap` | `string` |                                                               | `""`          |
| `bookingRef`          | `string` |                                                               | `""`          |


### In which accounts the application is installed

- frwhirlpool - service-locator 
- itwhirlpool - all three
- plwhirlpool - garanzia-scaduta / problemi-e-soluzioni 
- bauchnektde - all three


## How to use it

- Uninstall the account.import-widget-from-sandwatch@x.x in the working account.
- Install the whirlpoolemea.pimport-widget-from-sandwatch@x.x in the desired account.
- Insert whirlpoolemea.import-widget-from-sandwatch@x.x as peer dependency.

*******************IMPORTANT*******************
- Remember to rename with import-widget-from-sandwatch interface in theme where are used the interfaces of:
  - service-locator / problemi-e-soluzioni / garanzia-scaduta-oow /garanzia estesa