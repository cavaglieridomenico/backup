//Functions for User type ---//
//Function to get session
export async function getSession() {
	let response = await fetch("/api/sessions?items=*", {  
		method: "GET",
		headers: {},
	})
	let session = await response.json()
	return session;
}
//Function to get user info
export async function getUserInfo() {
	let response = await fetch("/_v/wrapper/api/user/userinfo", {
		method: "GET",
	})
	let userInfo = await response.json()
	return userInfo;
}
//Function to get user orders
export async function getUserOrders() {
	let response = await fetch("/_v/wrapper/api/user/orders", {
		method: "GET",
	})
	let userOrders = await response.json();
	return userOrders;
}
//Function to check user type
export function userType(orders: any) {
	// - guest
	// - lead (logged in user that did not give the opt in)
	// - prospect (logged in user that gave the consent to be contacted / OPTIN)
	// - customer (logged in user that purchased at least 1 item in the past)>
	const dateCheck = (orders: any) => {
		const lastYearDate = new Date(Date.now() - (365*24*60*60*1000))
		const orderDate = new Date(orders[0].creationDate)
		return lastYearDate.getTime() < orderDate.getTime()
	}
	let userTypeValue = ""
	if(orders.length <= 0) {
		userTypeValue = "prospect"
	}
	else {
		dateCheck(orders) ? (userTypeValue = "hot customer") : (userTypeValue = "cold customer");
	}
	return userTypeValue;
}
//Functions for product ---//
//Function to get product name
export async function getProdName(prodCode: string) {
	let response = await fetch("/_v/wrapper/api/catalog_system/products/productgetbyrefid/" + prodCode, {
		method: "GET",
		headers: {},
	});
	let product = await response.json()
	return product?.Name
}
//Function to get product code
export function getProdCode(url: string) {
	let temp: string = url.substring(url.lastIndexOf("-") + 1, url.length);
	let productCode: string = temp.substring(0, temp.lastIndexOf("/"))
	return productCode;
}
//Functions for product category---//
//Function to get product category took by url
export async function getCategoryByUrl(url: string) {
	let category = url.split(/[\s/]+/)[3];
	if(category === "professionalnaya-tehnika") {
		switch(url.split(/[\s/]+/)[3]) {
			case "prachechnoe-oborudovanie": return getCategoryStringFromId("100");
			case "holodilnoe-oborudovanie": return getCategoryStringFromId("105");
			case "prigotovlenie-i-termicheskaya-obrabotka-pishchi": return getCategoryStringFromId("117");
			default: return "";
		}
	}
	switch(category){
		case "lavatrici": return getCategoryStringFromId("19")
		case "asciugatrici": return getCategoryStringFromId("20")
		case "lavasciuga": return getCategoryStringFromId("21")
		case "frigoriferi": return getCategoryStringFromId("22")
		case "congelatori": return getCategoryStringFromId("23")
		case "forni": return getCategoryStringFromId("24")
		case "forni-a-microonde": return getCategoryStringFromId("25")
		case "piani-cottura": return getCategoryStringFromId("26")
		case "cappe": return getCategoryStringFromId("27")
		case "cucine": return getCategoryStringFromId("28")
		case "cottura": return getCategoryStringFromId("29")
		case "altri-prodotti": return getCategoryStringFromId("29")
		case "lavastoviglie": return getCategoryStringFromId("30")
		case "condizionatori": return getCategoryStringFromId("31")
		default: return ""
	}
}
//Function to get Category with API call
export async function getCategory(prodCode: string) {
	let response = await fetch("/_v/wrapper/api/catalog_system/products/productgetbyrefid/" + prodCode, {
		method: "GET",
		headers: {},
	})
	let product = await response.json()
	let productCategoryId = product?.CategoryId
	let productCategory = productCategoryId !== undefined ? 
		await getCategoryStringFromId(productCategoryId.toString())
		:
		""
	return productCategory
}
//Functions to get category from category id
export async function getCategoryStringFromId(id: string) {
	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
	};
	let response = await fetch("/_v/wrapper/api/catalog/category/" + id, options)
	let category = await response.json()
	return category?.AdWordsRemarketingCode
};

/**
 * Get path from URL
 * @param {string} url - URL
 * @return {string} URL without path
 * Example input:  https://samplePage--itwhirlpool.myvtex.com/?gclwE&gclsrc=aw.ds
 * Returnns: https://samplePage--itwhirlpool.myvtex.com/
 */
 export function getPathFromUrl(url: string) {
	return url?.split("?")[0];
  }

// Check if you are in error page
export function isErrorPage() {
	const currentRouteId: string = window.history.state.state.navigationRoute.id
	const isError = currentRouteId === "store.not-found#search"
	return isError
}
  
// Check if you are in PDP error page
export function isProductErrorPage() {
	const currentRouteId: string = window.history.state.state.navigationRoute.id
	const isProductPageError = currentRouteId === "store.not-found#product"
	return isProductPageError
}
  