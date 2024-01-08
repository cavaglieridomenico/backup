
# Breadcrumb

Breadcrumbs are a user interface element designed to make navigation easy and intuitive . It display the directory path of the current folder or page and provide one-click access to each of the parent directories .

## Installation

Use Vtex to install the Breadcrumb component in the theme project .

```bash
vtex install ruwhirlpool.breadcrumb-custom-ru@ [version]
```

## Usage

For use the Breadcrumb component in the theme project you need to declare "breadcrumb-custom-ru" inside a block : 

```
"search-result-layout.desktop": {
    "children": [
      "analytics#plp",
  ==> "breadcrumb-custom-ru",
      "flex-layout.row#plpTitle",
      "flex-layout.row#plpResult"
    ],
```

The component was structured in 3 levels with the possibility to customize them via Site Editor with properties like those :

```
const Breadcrumb: StorefrontFunctionComponent<Props> = ({
  firstLevelName,
  showFirstLevel = true,
  secondLevelName,
  secondLevelHref,
  showSecondLevel = true,
  thirdLevelName,
  thirdLevelHref,
  showThirdLevel = true,
}) =>
```

The First level is compose from the Homepage , the Second level from a macro category (eg. catalog , professional appliances , contact ... ) , the Third level from a specific category (eg. refrigerators , washing machines , hobs ... ) .


Inside the Breadcrumb Custom App the Third level is represent by a local state called " categoryObject " that change his props based on a list of specific cases that we have defined in the code .

After that , the component have his style and logic , we need to define a StructuredData array composed by NavigationItem .

eg. NavigationItem type :

```
export interface NavigationItem {
  name: string
  href: string
  __typename: string
};
```
eg. StructuredData array :

```
[
  0: {name: "Домашняя страница", href: "/", __typename: "SearchBreadcrumb"}
  1: {name: "товары", href: "/catalog", __typename: "SearchBreadcrumb"}
  lastIndex: (...)
  lastItem: (...)
  length: 3
]
```

Structured data is a standardized format for providing information about a page and classifying the page content , Google uses structured data that it finds on the web to understand the content of the page .

## License
[MIT](https://choosealicense.com/licenses/mit/)