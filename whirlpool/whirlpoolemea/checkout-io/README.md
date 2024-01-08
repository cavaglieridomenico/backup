# CUSTOM CHECKOUT IO

## 🚨 Warning - Read first

This app contains **experimental** code

PLEASE DON'T CONTINUE IF YOU DON'T KNOW HOW THE [CHECKOUT API](https://developers.vtex.com/vtex-rest-api/reference/checkout-api-overview) WORKS

We reverse engineered [vtex.checkout@2.x](https://github.com/vtex-apps/checkout) and made our own basic implementation of a Checkout flow leveraging the IO platform (Node Service/Graphql/Store-framework)

The mayority of the `complexity` and `business rules` (XSTATE, Multi-repos, Modified Orderform, Country settings) that are found in the original approach are scrapped. But we mantained the architecture, the idea of using steps, mimicked the style and simulated the idea of "vtex.checkout-resources" but instead directly via the IO Checkout client

This project simply showcases how to make use of our `service-framework` and our `store-framework` to structure your 100% CUSTOM implementation geared towards our API

---

![Example screenshot](./docs/screenshot.png)

## Limitations / Known issues

- `No PICKUP POINTS flow`
- No REGEX on any input, anything goes (because of no country-settings/data)
- Having more than 1 'Schedule' type of SLA for a single item will cause the opening and closing of just the 1st one
- Service routes respond with full orderform (`that's how the api works`), a good enhancement would be to add custom `validations` or `expected sections`
- Validations before placing an order are primitive
- No 'coupons' input
- No 'additional information for deliveries' input
- No `Auth-app` for payments (Legacy extension)

## Migration

Understand that by using this you'll be migrating your whole Checkout flow to IO; this means that your CART and CHECKOUT will be both inside your `store`. If you have any custom implementation done via JS apps/scripts, you'll need to redo them to work with this app.

Also, for this to work you'll need a custom `vtex.checkout` other than the production enabled `0.x`, contact us if you want to know more about it

## Architecture

You can see the whole architecture of the `CHECKOUT` phase in this [DIAGRAM](./docs/diagram.png) the `CART` phase is [still the original approach](https://github.com/vtex-apps/checkout-cart)

## Implementation

By installing the new Checkout, you'll find new routes inside your store that point to specific interfaces, such as `store.checkout.order-form`; any block declared inside it will be rendered in the `/checkout` store page.

This app declares `custom templates` leveraging the power of the store-framework.
In our example, we use our `custom-container`, and within it the layout:

**You'll need to access your admin -> pages and select your template for each page if you want to use other theme**

```json
"store.checkout.order-form": {
    "blocks": [
      "checkout-container"
    ]
  },
  "checkout-container": {
    "children": [
      "responsive-layout.desktop#checkout",
      "responsive-layout.tablet#checkout"
    ]
  },
```

With all of this in mind, now your Checkout structure would look like this:

```
checkout (controlled bu vtex.checkout@x.x)
└── checkout-cart (controlled by vtex.checkout-cart@0.x)
|   ├── product-list
|   ├── checkout-summary
|   |   └── checkout-coupon
|   └── shipping-calculator
|       └── checkout-shipping
|
└── checkout-container (controlled by this app)
    ├── identification
    ├── custom-summary
    ├── place-order
    └── step-group
        ├── profile-step
        ├── address-step
        ├── delivery-step
        └── payment-step

```

If you also want to totally customize the CART, you should copy the idea of what we are doing here, but replacing the `checkout-cart` dependency with your own implementation.

## Blocks included

- Identification phase (This is not a login)
- Items and totals Summary
- Custom Place order button
- And 4 basic steps:

1. A `Profile` step
2. An `Address` step
3. A `Delivery` step
4. A `Payment` step

## Steps

Think of the `STEPS` as an abstraction for any type of information cluster you want to control.
For example the minimum data required to complete an order would be the `client profile`, the `client address`, the `delivery SLA` and the `type of payment`. And that's why we ship 4 basic steps that do exactly that via the CHECKOUT API.

Also you'll notice, that for each step, we provide a `Summary` for UX purposes; this is due to how we manage the routing. You could create your own `step-group` without it!

## About the Custom Service

`USING THIS SERVICE IS NOT MANDATORY`

We reuse everything the [CHECKOUT IO CLIENT](https://github.com/vtex/io-clients/blob/master/src/clients/checkout.ts) provides via our custom Routes.
The implemented middlewares don't modify the data, we are only handling errors in a friendly manner.

If you go to the [service.json](./node/service.json) file, you'll find all the routes our service expose. And [here](./node/index.ts) how they are resolved.
All the PATHS are just like any endpoint to fetch to.

So for i.e, if you want to hit the `updateOrderFormPayment` [middleware](./node/middlewares/updateOrderFormPayment.ts) you can do it by fetching
`/checkout-io/update-payment`. Analog to the [CHECKOUT ATTACHMENT API ENDPOINT](https://developers.vtex.com/vtex-rest-api/reference/cart-attachments#addpaymentdata).

So you will need the same data. The `orderFormId` and the `payments` object.
You'll see that we request those in the middleware:

```ts
const { orderFormId, payments } = await json(ctx.req)
```

With this, you could create your own routes and middlewares to any API, `internal or external` and manage what the server does for you. The intention is to use it to compute data you don't want the frontend to do.

For example, instead of the API returning the orderform to the frontend, you could do validations on the server, and just return 'OK' when updating the orderform. This would make your Checkout blazing fast!

### Graphql

We also created a single Graphql query to provide the OrderForm. Understand that [the orderform returned](./graphql/types/OrderForm.graphql) is altered to suit the minimum needs; you can remove/add the information you want to have at hand inside the Checkout!

We did this as the OrderForm is a central part of the Checkout flow. So it made sense to have it resolved in a performant way. (Remember to not cache it!)

## What can you do with all of this?

- Declare your own Checkout Store Theme!
- You can add your own steps without interrumpting the flow! (Via store framework)
- You can copy, modify and reuse the current steps
- Add your own validations before fulfilling an Order (Custom business rules)
- Integrate your own services (for i.e resolve your own SLAs for Delivery)

## Development Utilities

### Order context + useOrder hook {#orderContextUseOrderHook}

Provides the `ORDERFORM`!

This is `CRITICAL` and `CENTRAL` to the operation of the Checkout.
We feed this context via our own custom GRAPHQL service talking directly to the API.

```ts
interface Context {
	orderForm: OrderForm
	orderError: ApolloError | undefined
	orderLoading: boolean
	refreshOrder: (variables?: any) => Promise<any>
}
```

And the hook connects with the context

```ts
const { orderForm, orderError, orderLoading, refreshOrder } = useOrder()
```

### Checkout context + useCheckout hook

This is a custom context for shared data, useful to communicate things between other components outside the steps.

For example, we use it to know if there're no deliveries available for ALL ITEMS:

```ts
const getCheckoutDelivieries = () => {
	const exhaustedDeliveries =
		orderForm?.shippingData?.logisticsInfo.every(
			(item: LogisticsInfo) => item.slas.length === 0,
		) ?? false

	return { exhaustedDeliveries }
}
```

### useForm hook

You can use this hook to read form's values or reset them

```ts
const [clientPreferences, handlePreferencesChange, reset] = useForm(
	clientPreferencesData,
)
```

### useFetch hook {#useFetchHook}

A hook wrapping the fetch() api. You can use it to communicate with the VTEX api or your own, and receive status updates!

```ts
const [response, isFetching, setRequest] = useFetch({} as IRequestInfo);

const apiRequest = Build you request based on "IRequestInfo" type.

setRequest(apiRequest);
```

### Router

The way we change steps is via React Router, you can see the following example:

```ts
history.push(routes.INDEX)
```

When the url route changes the switch will show a component or the other.

```ts
const DeliveryStep: React.FC = () => {
	return (
		<Step>
			<Switch>
				<Route path={routes.SHIPPING}>
					<DeliveryForm />
				</Route>
				<Route path="*">
					<DeliverySummary />
				</Route>
			</Switch>
		</Step>
	)
}
```

---

## Possible Enhancements

Creating a Checkout from scratch requires a lot of work and planning. Here're some possible additions to this project:

- Make the custom Service return a validation check instead of whole orderform body
- Add a system to track which step is active, this could help create a better UX
- We stripped countries-data, so a REGEX for postal codes with a country selector would be nice
- Add the date and price of SLAs to the delivery summary
- 'NEW STEP' - Postal code address resolver using our Logistics module + Google cloud services
- Debug toolbar (Manual Orderform refresher / Cartman / etc )
- Disclosure for the RadioGroups in the Delivery Step (Bad UX when having multiple items with multiple SLAs)
- A slot interface to put custom messages below each item in the summary (Info purposes like "no SLA")

## Headless

- Replace custom service calls with vtex API request using [useFetch](#useFetchHook)

  - remove or modify [routes file](react\utils\routes.ts) and use [vtex API Reference](https://developers.vtex.com/vtex-rest-api/reference/get-to-know-vtex-apis), you can see current request to vtex API checking current [middlewares](node\middlewares) documentation
  - use example

  ```ts
  import useFetch, { RequestInfo } from "../hooks/useFetch"

  // Declare
  const [
  	updateAddressResponse,
  	isFetchingUpdateAddress,
  	setRequestUpdateAddress,
  ] = useFetch({} as RequestInfo)

  // Set request
  const handleSubmit = () => {
  	setRequestUpdateAddress({
  		Method: "POST",
  		EndPoint: `https://apiexamples.vtexcommercestable.com.br/api/checkout/pub/orderForm/...`,
  		RequestBody: {
  			orderFormId,
  			shipping,
  		},
  	})
  }

  // Process response
  useEffect(() => {
  	if (!isFetchingUpdateAddress && updateAddressResponse?.Data?.orderForm) {
  		console.log(updateAddressResponse?.Data?.orderForm)
  	} else if (!isFetchingUpdateAddress && updateAddressResponse?.hasError) {
  		console.log(updateAddressResponse?.Data)
  	}
  }, [isFetchingUpdateAddress, updateAddressResponse])
  ```

- [Order context + useOrder hook](#orderContextUseOrderHook)

  - using [useFetch](#useFetchHook) instead of current [GraphQL configuration](react\providers\orderform.tsx)

    ```ts
    import React, {
    	createContext,
    	useCallback,
    	useContext,
    	useMemo,
    } from "react"

    import useFetch, { RequestInfo } from "../hooks/useFetch"
    import endpoints from "../utils/endpoints"

    interface Context {
    	orderForm?: any
    	orderError?: any
    	orderLoading?: boolean
    	refreshOrder?: any
    }

    const OrderContext = createContext<Context>({})

    const GET_ORDERFORM = {
    	Method: "POST",
    	EndPoint: endpoints.ORDERFORM,
    	RequestBody: {},
    } as RequestInfo

    export const OrderContextProvider: React.FC = ({ children }) => {
    	const [response, orderLoading, setRequest] = useFetch(
    		GET_ORDERFORM as RequestInfo,
    	)

    	const orderForm = response?.Data?.orderForm
    	const orderError = response?.hasError

    	console.log(
    		"OrderForm Provider ",
    		response,
    		orderLoading,
    		orderError,
    		Boolean(setRequest),
    	)

    	const refreshOrder = useCallback(() => {
    		console.log("%c CALLBACK ", "background: green; color: white")
    		setRequest({ ...GET_ORDERFORM })
    	}, [])

    	const context = useMemo(
    		() => ({
    			orderForm,
    			orderError,
    			orderLoading,
    			refreshOrder,
    		}),
    		[orderForm, orderError, orderLoading, refreshOrder],
    	)

    	return (
    		<OrderContext.Provider value={context}>
    			{children}
    		</OrderContext.Provider>
    	)
    }

    export const useOrder = () => {
    	const context = useContext(OrderContext)

    	if (context === undefined) {
    		throw new Error("useOrder must be used within an OrderContextProvider")
    	}

    	return context
    }

    export default { OrderContextProvider, useOrder }
    ```

    // TODO: complete this description

    - refreshOrder use refecth de GraphQL

    ````ts
      useEffect(() => {
        if (!isFetchingClient && clientData && clientData.Data && refreshOrder) {
          refreshOrder().then(() => {
            navigate({
              page: 'store.checkout.order-form',
            })
          })
        }
      }, [clientData, isFetchingClient, navigate, refreshOrder]) ```
    ````

## USEFUL PROPS FROM THEME

INTERFACE custom-summary:
- "showEnergyAndSheet" Boolean prop for showing Energy label and Product Sheet in Checkout
- "showLeadTime" Boolean prop for showing Lead Time in Checkout
- "showInStockAndLeadtime" Boolean prop for showing in stock label or leadtime label inside the checkout, based on sellable and stockavailability specifications. If showLeadTime prop is already true, this prop will be ignored.
- "energyImageProp" array prop containing a list of specifications that will be used to render the energy label image according to the spec. The array can contain 1 or multiple specification names, and in this case you should put it in order from the first one you want to the unwanted one. So if there will be the first specification inside the array you will have it, in case there's none it will search for the second one and so on.
- "energyLabelProp" array prop containing a list of specifications that will be used to render the energy label anchor according to the spec. Array behaviour same as above.
"productDataSheetProp" array prop containing a list of specifications that will be used to render the data sheet anchor according to the spec. Array behaviour same as above.
"leadTimeProp" array prop containing a list of specifications that will be used to render the leadtime according to the spec. Array behaviour same as above.
"salesChannelData" Array of data used for extract tradePolicy (for CC websites)
"includedOfferings" Array containing offerings if it's needed to show non selectable services.

INTERFACE product-list-custom.offerings:
- "installationModal" Boolean prop for showing modal for the installation in cart

INTERFACE product-list-custom.title:
- "showLeadTime" Boolean prop for showing Lead Time in cart

INTERFACE product-list-title-with-stock:
- "showLeadTime" Boolean prop for showing Lead Time in cart
- "showInStockAndLeadtime" Boolean prop for showing in stock label or leadtime label inside the cart, based on sellable and stockavailability specifications. If showLeadTime prop is already true, this prop will be ignored.
- "salesChannelData" Array of data used for extract tradePolicy (for CC websites)

INTERFACE product-list-custom.energyAndSheet:
- "energyImageProp" array prop containing a list of specifications that will be used to render the energy label image according to the spec. The array can contain 1 or multiple specification names, and in this case you should put it in order from the first one you want to the unwanted one. So if there will be the first specification inside the array you will have it, in case there's none it will search for the second one and so on.
- "energyLabelProp" array prop containing a list of specifications that will be used to render the energy label anchor according to the spec. Array behaviour same as above.
- "productDataSheetProp" array prop containing a list of specifications that will be used to render the data sheet anchor according to the spec. Array behaviour same as above.

INTERFACE shipping-summary:
- "addDateRecap" boolean prop used for showing date recap inside shipping, ad hoc requirement for hotpointukcc. If not provided or false, it will display the standard recap informations box.

INTERFACE payment-summary:
- "checkOnDataSlots" boolean prop to check also delivery slots if presents for all scheduled products. If not the user won't be able to edit the payment. Required in itccwhirlpool. If not provided or set as false, this check won't be performed.


### Additional services cc

Section used for displaying additional services inside /cart, on UKCC and ITCC. 

Props:
- installationModal: to show / hide modal for GAS products (UKCC),
- tradepolicyWorkspace: to force additional services for a specific tradepolicy (1 for EPP, 2 for FF, 3 for VIP)
- fixedServiceTypeIds: used for multilaguage, adds service type id inside the api(_v/wrapper/api/product/${productId}/customAdditionalServices?sc=${orderForm?.orderForm?.salesChannel}&locale=${locale}) to show fixed additional services (ITCC),
- additionalServicesInfos: used from site-editor to add tooltips and services messages.

### App settings

You can find this list also in the manifest, these settings are used for a better customization between countries. 

Settings:
- appKey: key responsible for the communication with the vtex apis;
- appToken: token responsible for the communication with the vtex apis;
- googleMapsApiKey: key used for autocomplete inside shipping section (other infos about GMaps [HERE](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete);
- country: 2-digit country code used for specific checks and filters (e.g. "IT");
- defaultCurrencyCode: currency used to take a default in case no currency is defined/found; 
- defaultLocale: default locale;
- isMultilanguage: boolean to set multilanguage;
- enableLogs: boolean to enable logs;
- paypalClientId: client id for configuring paypal script;
- paypalConnectorId: connector id for paypal payment settings;
- worldpayConnectorId: connector id for worlpay payment settings;
- isCC: boolean to define if the site is a closed community;
- ccProperties -> loginReturnUrl: Url to redirect the user after a checkout login;

### Best Practices and useful infos
This app is used in more than a country, just like all the other whirlpoolemea apps.
The main advice here is to keep the app as more generic as possible. When this is not feasible, use appSettings, props to avoid fixed values inside this code. 
When you want to add a country specific feature mind the fact that you can do it inside here, respecting the the previous statements and the folders order. Let's say you want to add a popup for a country (e.g WHL pl) triggered in the checkout shipping section. The steps to respect are:
 1) use the right folder, so react\components\custom-checkout-components since it's a custom and country specific component;
 2) avoid fixed code when developing;
 3) try not to change the common code, and if not test it in every country involved before releasing it.
 4) avoid inline / styles inside the app and prefer handles for css.
 5) use the common pattern to declare interfaces: 
	- create a file inside the react folder with the same name as the file you want to use as interface;
	- use the just created file to export the react component;

 You can find other advices and useful informations [here](https://docs.google.com/document/d/16MR5UqByzNyC3RZl7J40In83-iAoxD5juV99MOlByD0/edit#heading=h.c9x4hafz2ahk) 