# print-specification@1.x
Is useful if:
- You need to wrap the specification with a link
- You need to print a list of specification and aggregate theme
- You need to print specification cleaning the value

For other scopes use [vtex.specification-badges](https://github.com/vtex-apps/product-specification-badges#readme)
### Examples of use

- NORMAL: 
```json
"print-specification#stock": {
    "props": {
      "specificationsToCheck": [
        {
          "name": "sellable",
          "valueToCheck": {
            "true": "Disponibile",
            "false": "Non Disponibile"
          }
        }
      ],
      "isLink": true
    }
  }
```
- AGGREGATE:
```json
  "print-specification#capacità": {
    "props": {
      "specificationsToCheck": [
        {
          "name": "Altezza",
        },
		{
          "name": "Larghezza",
        }
      ],
      "aggregateSymbol": "x",
      "measureUnit": "Cm",
    }
  }
```
### Configuration

| Prop name                     | Type                                                      | Description| Default value |
| ----------------------------- | --------------------------------------------------------- |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `blockClass`                  | `string`       | Allows to pass a custom name to be added to component css nclasses                                      | `''`        |
| `aggregateSymbol`             | `string`       |When there are more than one specification print a symbol to divide the specifications                   | `''`        |
| `measureUnit`                 | `string`       | Print a measure unit between the specification list nvalues.                                            | `''`        |
| `specificationsToCheck`       | `array`       | Define the list of specifications to print                                                               | `{}`        |
| `isLink`                      | `boolean`      | Render the specificationas a link to a search layout page pre filtered on  the specification            | `false`        |
| `aggregateLabel`              | `String`       | Label to print before the aggregate specifications list (eg:dimesions:)                                 | `""`        |

`specificationsToCheck`  Type:
`Option` type:

| Prop name           | Type                                                      | Description| Default value |
| ------------------- | --------------------------------------------------------- |----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| `name`         | `String` | Name of the specification to print. *Mandatory*.  | No Default    |
| `valueToCheck` | `Object` |`value1` or `value2` keys (are the possible values of the specification) will print the related value . Valid for all the specifications with more than one value |     No Default      |
### In which accounts the application is installed

- hotpointit
- itwhirlpool
- plwhirlpool

### CSS Customization [CSS HANDLES]

```--container``` class to change the container of the specification printed

`--specificationValue-{valueToCheck}` Give to the specification the possibility to differentiate the style based on the specification valueToCheck

`--text` class to change the text printed

`--link` class to change the link style when isLink is true

`--blockClass` custom Class applyed


## How to use it

- Uninstall the account.print-specification@x.x in the working account.
- Install the whirlpoolemea.print-specification@x.x in the desired account.
- Insert whirlpoolemea.print-specification@x.x as peer dependency.
- Import the CSS from itwhirlpool theme.
- Adapt the CSS (eg: `.specificationValue--availability-disponibile` class become `specificationValue--availability-do-kupienia-online` for plwhirlpool).