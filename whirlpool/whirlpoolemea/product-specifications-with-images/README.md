# product-specification-with-images@2.x

Is useful if:
- You need to create a table with specification about any pdp with images inside.
is used in sticky support image and in main pdp as a main image of products

### Configuration

| Prop name               | Type      | Description                                                                                  | Default value |
| ----------------------- | --------- | -------------------------------------------------------------------------------------------- | ------------- |
| `blockClass`            | `string`  | Allows to pass a custom name to be added to component css nclasses                           | `''`          |
| `aggregateSymbol`       | `string`  | When there are more than one specification print a symbol to divide the specifications       | `''`          |
| `measureUnit`           | `string`  | Print a measure unit between the specification list nvalues.                                 | `''`          |
| `specificationsToCheck` | `array`   | Define the list of specifications to print                                                   | `{}`          |
| `isLink`                | `boolean` | Render the specificationas a link to a search layout page pre filtered on  the specification | `false`       |
| `aggregateLabel`        | `String`  | Label to print before the aggregate specifications list (eg:dimesions:)                      | `""`          |


### In which accounts the application is installed

- hotpointit
- hotpointuk
- itwhirlpool
- plwhirlpool
- itwhirlpool
- plwhirlpool
- frwhirlpool
- bkde

### CSS Customization [CSS HANDLES]

`prodSpecContainer` : container's table'

`prodSpecItem` : table's row container


## How to use it

- Uninstall the account.product-specification-with-images@x.x in the working account.
- Install the whirlpoolemea.product-specification-with-images@x.x in the desired account.
- Insert whirlpoolemea.product-specification-with-images@x.x as peer dependency.
