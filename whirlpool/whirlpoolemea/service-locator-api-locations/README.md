# service-locator-api-locations@1.x

Is useful if:

- You need to print all service locators divided by region, province and city

The API calls can't be converted in graphql one because they're from sandwatch

### Interfaces and how to use them in theme

- REGIONS:

```json
Interface:"service-locator-regions"

Theme:

"service-locator-regions": {
    "props": {
        "brand": "WP",
        "country": "IT",
        "locale": "it_IT",
        "country_id": "Italia",
    }
}
```

- PROVINCES:

```json
"service-locator-provinces": {
    "props": {
        "brand": "WP",
        "country": "IT",
        "locale": "it_IT",
        "country_id": "Italia",
    }
}
```

- CITIES:

```json
"service-locator-cities": {
    "props": {
        "brand": "WP",
        "country": "IT",
        "locale": "it_IT",
        "country_id": "Italia",
    }
}
```

- SERVICES:

```json
"service-locator-services": {
    "props": {
        "brand": "WP",
        "country": "IT",
        "locale": "it_IT",
        "country_id": "Italia",
    }
}
```

### Configuration

| Prop name    | Type     | Description                                                              | Default value |
| ------------ | -------- | ------------------------------------------------------------------------ | ------------- |
| `brand`      | `string` | Project brand (can be WP, HP or BK) **_Mandatory_**                      |               |
| `country`    | `string` | Project country (can be for ex. IT, FR, DE ecc..) **_Mandatory_**        |               |
| `locale`     | `string` | Project locale (can be for ex. it*IT, fr_FR, de_DE) \*\*\_Mandatory*\*\* |               |
| `country_id` | `array`  | Project country Id (can be for ex. Italia, France ecc..) **_Mandatory_** |               |

### App Settings

| Setting name | Type     | Description                                                              |
| ------------ | -------- | ------------------------------------------------------------------------ |
| `citiesWithCustomHelmet` | `array of object with the below structure` | List of the cities for which you want to add custom meta helmet tag |
| `cityName` | `string` | Name of the city         |
| `metaTags` | `array of object` | Every object has two properties, *metaTagName* and *metaTagContent* to define how the meta tag has to be created |

### In which accounts the application is installed

- itwhirlpool
- frwhirlpool
- hotpointit

## How to use it

- Uninstall the account.service-locator-api-locations@x.x in the working account.
- Install the whirlpoolemea.service-locator-api-locations@x.x in the desired account.
- Insert whirlpoolemea.service-locator-api-locations@x.x as peer dependency.
- Change the name of the file account.service-locator-api-locations.css in whirlpoolemea.service-locator-api-locations.css
- Adapt the CSS

## Handle WPIT and HPIT markets

At the moment the API results have some issues on the last step (services) relative to parent_label value. To fix this issue on WPIT and HPIT we're temporarily using the parameter from URL.
