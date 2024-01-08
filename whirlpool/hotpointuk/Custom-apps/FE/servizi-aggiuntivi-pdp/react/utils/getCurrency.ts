// // @ts-ignore
// export default function getCurrency({ productId,setcurrency }) {
// 	fetch(`/api/catalog_system/pub/products/variations/${productId}`, {
// 		headers: {
// 			// 'X-VTEX-API-AppKey': apiKey,
// 			// 'X-VTEX-API-AppToken': apiToken,
// 		},
// 		method: 'GET',
// 	})
// 		.then(response => response.json())
// 		.then(json => {
// 			fetch(`/api/catalog_system/pub/saleschannel/${json.salesChannel}`, {
// 				headers: {
// 					// 'X-VTEX-API-AppKey': apiKey,
// 					// 'X-VTEX-API-AppToken': apiToken,
// 				},
// 				method: 'GET',
// 			})
// 			.then(response => response.json())
// 			.then(json=>{
// 				setcurrency(json.CurrencySymbol)
// 			})

// 		})
// }
