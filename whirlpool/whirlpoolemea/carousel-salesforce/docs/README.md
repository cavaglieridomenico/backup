# carousel-salesforce@1.x

Is useful if:

- to show correlated items to continue shopping

## props

| Prop name             | Type     | Description                                              | Default value |
| --------------------- | -------- | -------------------------------------------------------- | ------------- |
| `labelPdp`            | `string` | Is used to set page type in carousel PDP                 | `''`          |
| `linkPageType`        | `string` | Is used to set the fetch link page                       | `''`          |
| `labelListOfProducts` | `string` | Is used to set name of list of product                   | `''`          |
| `labelClickEvent`     | `string` | Is used to set name of list click event on product click | `''`          |
| `pageParam`     | `string` | Is used to set the page param for the API call (can be passed both from CMS and Theme) | `''`          |

## In which accounts the application is installed

- ~~hotpointit~~
- ~~BKDE~~
- ~~plwhirlpool~~
- ukccwhirlpool
- itccwhirlpool

## CSS Customization [CSS HANDLES]

`--container` class to change the container of the specification printed

`--specificationValue-{valueToCheck}` Give to the specification the possibility to differentiate the style based on the specification valueToCheck

`--text` class to change the text printed

`--link` class to change the link style when isLink is true

`--blockClass` custom Class applyed

## How to use it

- Uninstall the account.carousel-salesforce@0.x in the working account.
- Install the whirlpoolemea.carousel-salesforce@1.x in the desired account.
- Insert whirlpoolemea.carousel-salesforce@1.x as peer dependency.

ps: in theme there are titles like: "Raccomandati" that must be replaced in differents lang.
