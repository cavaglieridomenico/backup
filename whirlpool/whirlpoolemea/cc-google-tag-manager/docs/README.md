# google-tag-manager@2.x

## Naming Convention
For naming variables being pushed with `usePixel` or `window.postMessage` use `ga4-{nameOfEvent}`
For example - `ga4-personalArea`

<br>

---

<br>

## How to use
### 1. Sending data to GTM **with** `usePixel()` hook
1. Import `vtex.pixel-manager` to `manifest.json` of custom app 
2. Import `usePixel` hook
```js
// app.tsx

import { usePixel } from 'vtex.pixel-manager'
```
3. Descructure `push` function from usePixel hook in the body of the function

```js
// app.tsx
const FunctionName: React.FC = () => {
  
  const { push } = usePixel();

  return (
    <>
    ...
    </>
  )
}
```

4. Push analytics event

```js
const FunctionName: React.FC = () => {
  
  const { push } = usePixel();

  const handlePush = () => {
    /*--- This is only a push example ---*/
    push({
      event: "ga4-custom_error",
	  type: "error message",
	  description: error,
	}),
    /*---------------------------*/
  }

  return (
    <>
    ...
    </>
  )
}

```

<br>

### 2. Sending data to GTM **without** `usePixel()` hook
For cases where you are using a non-functional based `React` component or a `pixel` app

<br>


```js
const eventData = {
  currency: "EUR",
  eventName: "vtex:testPixelEvent",
  data: { title: "TEST" },
  event: "testPixelEvent",
}

window.postMessage(eventData, window.origin)
```

<br>

---

<br>

## Folder Structure

`src` includes files to trigger analytics events for specific modules with details in the table


| File Name      | Description |
| ----------- | ----------- |
| `checkouts.ts`      | Analytics events related to checkout process       |
| `error.ts`   | Events related to error pages        |
| `page.ts`   | Events related to page impressions --> example `pageView` or `feReady`        |
| `product.ts`   | Events related to product impressions, detail and click --> example `eec.impressionView` or `eec.productClick`     |
| `search.ts`   | Events related to when user searches in the search bar   |
| `user.ts`   | Events related to status of user on the site       |
 

`graphql` folder includes API calls related to specific modules

`utils` folder includes utils related to specific modules

`generic.ts` can be used when a utils function is used for more than one module (ex. useful for `user` and `page`)


```
📦react
 ┣ 📂graphql
 ┃ ┣ 📄checkout.graphql
 ┃ ┣ 📄error.graphql
 ┃ ┣ 📄page.graphql
 ┃ ┣ 📄product.graphql
 ┃ ┣ 📄search.graphql
 ┃ ┗ 📄user.graphql
 ┣ 📂src 
 ┃ ┣ 📂checkout
 ┃ ┃ ┣ 📄checkout.ts
 ┃ ┃ ┗ 📄interfaces.ts
 ┃ ┣ 📂error
 ┃ ┃ ┗ 📄error.ts
 ┃ ┣ 📂page
 ┃ ┃ ┣ 📄interfaces.ts
 ┃ ┃ ┗ 📄page.ts
 ┃ ┣ 📂product
 ┃ ┃ ┣ 📄interfaces.ts
 ┃ ┃ ┗ 📄product.ts
 ┃ ┣ 📂search
 ┃ ┃ ┣ 📄interfaces.ts
 ┃ ┃ ┗ 📄search.ts
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📄interfaces.ts
 ┃ ┃ ┗ 📄user.ts
 ┃ ┗ 📂utils
 ┃ ┃ ┣ 📄checkout-utils.ts
 ┃ ┃ ┣ 📄error-utils.ts
 ┃ ┃ ┣ 📄generic-utils.ts
 ┃ ┃ ┣ 📄page-utils.ts
 ┃ ┃ ┣ 📄product-utils.ts
 ┃ ┃ ┣ 📄search-utils.ts
 ┃ ┃ ┗ 📄user-utils.ts
```

<br>

---

<br>

## settingSchema Props `(manifest.json)`

<br>

### GTM Settings Props
---
| Prop | Description | Type | Values | Default | 
| ----------- | ----------- | ----------- | ----------- | ----------- |
| `Google Tag Manager ID` | ID (GTM-XXXX) from Google Tag Manager | `string` |  |  |
| `Allow Custom HTML tags` | Beware that using Custom HTML tags can drastically impact the store's performance | `boolean` |  |  |
| `Blacklist` | DO NOT INSERT unsless you know what you're doing! | `string` |  |  |
| `Accessories Category ID` | Accessories Category ID | `number` |  | 2 |
<br>

### OneTrust Settings Props
---
| Prop | Description | Type | Values | Default | 
| ----------- | ----------- | ----------- | ----------- | ----------- |
| `Enable cookie consent mode` | Enable cookie consent mode | `boolean` |  | false |
| `ad_storage` | ad_storage param (Analytics team must provided the value) | `string` | granted, denied | denied |
| `analytics_storage param` | analytics_storage param (Analytics team must provided the value) | `string` | granted, denied | denied |
| `functionality_storage param` | functionality_storage param (Analytics team must provided the value) | `string` | granted, denied | denied |
| `personalization_storage param` | personalization_storage param (Analytics team must provided the value) | `string` | granted, denied | denied |
| `security_storage param` | security_storage param (Analytics team must provided the value) | `string` | granted, denied | denied |
| `Wait time for update` | wait_for_update along with a millisecond value to control how long to wait before data is sent | `number` |  | 2000 |
| `CDN ID` | cdn ID from your One Trust console | `string` |  | otSDKStub.js |
| `Service` | Service URL for One Trust | `string` |  | cdn.cookielaw.org |
| `Url` | URL for One Trust | `string` |  | scripttemplates |
| `Data Domain O2P/EPP` | Data Domain for O2P or EPP binding | `string` |  |  |
| `Data Domain FF` | Data Domain for FF binding | `string` |  |  |
| `Data Domain VIP` | Data Domain for VIP binding | `string` |  |  |
| `One Trust custom script` | If true add custom script for the accept button | `boolean` |  | false |
| `One Trust custom script for UK countries` | One Trust custom script for UK countries and if true add custom script for the accept button | `boolean` |  | false |
| `One Trust Custom label` | Label for the accept button | `string` |  |  |
<br>

### GA4 Settings Props
---
| Prop | Description | Type | Values | Default | 
| ----------- | ----------- | ----------- | ----------- | ----------- |
| `Reviews source` | Third party integration used for Reviews | `string` | No reviews, bazaarvoice | bazaarvoice |
| `Page types mapping` | Here you can insert a regex to map a specific url and associate to it `pageType` and `contentGrouping` | `array` |  | **(see table below)* |
<br>

***Page types mapping**

<br>

<details style="background: #303030; border-radius: .3rem; padding: .7rem; cursor: pointer">
  <summary><b>Item#0 (Homepage)</b></summary>
  <div style="padding: 0 1rem">
  <div style="padding: .5rem 0"><div><p>Regex to match the path</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">^\/$</div></div></div>
  <div style="padding: .5rem 0"><div><p>Page type value</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">home</div></div></div>
  <div style="padding: .5rem 0"><div><p>Content Grouping</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">Homepage</div></div></div>
  </div>
</details>
<br>
<details style="background: #303030; border-radius: .3rem; padding: .7rem; cursor: pointer">
  <summary><b>Item#1 (PDP)</b></summary>
  <div style="padding: 0 1rem">
  <div style="padding: .5rem 0"><div><p>Regex to match the path</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">^\/[^\/]+\/p$</div></div></div>
  <div style="padding: .5rem 0"><div><p>Page type value</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">detail</div></div></div>
  <div style="padding: .5rem 0"><div><p>Content Grouping</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">Catalog</div></div></div>
  </div>
</details>
<br>

---
<details style="background: #303030; border-radius: .3rem; padding: .7rem; cursor: pointer">
  <summary><b>Item#2 (PLP)</b></summary>
  <div style="padding: 0 1rem">
  <div style="padding: .5rem 0"><div><p>Regex to match the path</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">&searchState|<b>{Insert the name of the product category (ex. appliances)}</b></div></div></div>
  <div style="padding: .5rem 0"><div><p>Page type value</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">category</div></div></div>
  <div style="padding: .5rem 0"><div><p>Content Grouping</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">Catalog</div></div></div>
  </div>
</details>
<br>

> ⚠️ Pay attention to the regex field: you have to replace the `{Insert the name of the product category (ex. appliances)}` text with the name of the product category of your country
---

<br>
<details style="background: #303030; border-radius: .3rem; padding: .7rem; cursor: pointer">
  <summary><b>Item#3 (Cart - only for IO)</b></summary>
  <div style="padding: 0 1rem">
  <div style="padding: .5rem 0"><div><p>Regex to match the path</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">\/cart$</div></div></div>
  <div style="padding: .5rem 0"><div><p>Page type value</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">cart</div></div></div>
  <div style="padding: .5rem 0"><div><p>Content Grouping</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">(Other)</div></div></div>
  </div>
</details>
<br>
<details style="background: #303030; border-radius: .3rem; padding: .7rem; cursor: pointer">
  <summary><b>Item#4 (ThankYou Page)</b></summary>
  <div style="padding: 0 1rem">
  <div style="padding: .5rem 0"><div><p>Regex to match the path</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">checkout\/orderPlaced</div></div></div>
  <div style="padding: .5rem 0"><div><p>Page type value</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">purchase</div></div></div>
  <div style="padding: .5rem 0"><div><p>Content Grouping</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">(Other)</div></div></div>
  </div>
</details>
<br>
<details style="background: #303030; border-radius: .3rem; padding: .7rem; cursor: pointer">
  <summary><b>Item#5 (Checkout - only for IO)</b></summary>
  <div style="padding: 0 1rem">
  <div style="padding: .5rem 0"><div><p>Regex to match the path</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">checkout</div></div></div>
  <div style="padding: .5rem 0"><div><p>Page type value</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">checkout</div></div></div>
  <div style="padding: .5rem 0"><div><p>Content Grouping</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">(Other)</div></div></div>
  </div>
</details>
<br>
<details style="background: #303030; border-radius: .3rem; padding: .7rem; cursor: pointer">
  <summary><b>Item#6 (myAccount/Login)</b></summary>
  <div style="padding: 0 1rem">
  <div style="padding: .5rem 0"><div><p>Regex to match the path</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">account|login</div></div></div>
  <div style="padding: .5rem 0"><div><p>Page type value</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">other</div></div></div>
  <div style="padding: .5rem 0"><div><p>Content Grouping</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">Personal</div></div></div>
  </div>
</details>
<br>
<details style="background: #303030; border-radius: .3rem; padding: .7rem; cursor: pointer">
  <summary><b>Item#7 (Comparison Page)</b></summary>
  <div style="padding: 0 1rem">
  <div style="padding: .5rem 0"><div><p>Regex to match the path</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">product-comparison</div></div></div>
  <div style="padding: .5rem 0"><div><p>Page type value</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">other</div></div></div>
  <div style="padding: .5rem 0"><div><p>Content Grouping</p><div style="border: 2px solid grey; border-radius: 5px; padding: 5px 10px">Catalog</div></div></div>
  </div>
</details>

<br>
<br>

> <br>⚠️ Note that this are only the ones `valid for every country` and website. Others can be found in each individual country app settings. <br><br> 


<br>
<br>

---

## `TODO` ⚒️


1. Improve checkout events