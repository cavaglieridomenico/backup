//Functions for User type ---//
//Function to get session
export async function getSession() {
	return await fetch("/api/sessions?items=*", {
		method: "GET",
		headers: {},
	}).then((response) => {
		return response.json();
	});
}
//Function to get user info
export async function getUserInfo() {
	return await fetch("/_v/wrapper/api/user/userinfo", {
		method: "GET",
	}).then((response) => {
		return response.json();
	})
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

	return await fetch("/_v/wrapper/api/catalog_system/products/productgetbyrefid/" + prodCode, {
		method: "GET",
		headers: {},
	}).then(async (response) => {
		let product = await response.json()
		return product.Name;
	});
}
//Function to get product code
export function getProdCode(url: string) {
	let temp: string = url.substring(url.lastIndexOf("-") + 1, url.length);
	let productCode: string = temp.substring(0, temp.lastIndexOf("/"))
	return productCode;
}

//Function to get Categpry with API call
export async function getCategory(prodCode: string) {

	let productCategoryId: string = await fetch("/_v/wrapper/api/catalog_system/products/productgetbyrefid/" + prodCode, {
		method: "GET",
		headers: {},
	}).then(async (response) => {
		let product = await response.json()
		return product.CategoryId;
	});
	return await getCategoryStringFromId(productCategoryId.toString())
}

//Functions to get category from category id new
export async function getCategoryStringFromId(id: string) {

	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
	};

	return await fetch("/_v/wrapper/api/catalog/category/" + id, options).then(async (response) => {
		let category = await response.json()
		return category.AdWordsRemarketingCode;
	});
};

//Functions to get category from category id
export async function getStringCategoryFromId(idCategory: string) {

	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
	};

	return await fetch("/_v/wrapper/api/catalog/category/" + idCategory, options).then(async (response) => {
		let category = await response.json()
		if(category.Name == "inne produkty") {
			return "SC_WP_FG_CK_CompactBuiltin"
		} else {
			return category.AdWordsRemarketingCode;
		}
	});
};
//Functions to get all category
async function getAllCategory(deepLevel = 10){
	const url = '/api/catalog_system/pub/category/tree/'+deepLevel;
	const options = {
		method: 'GET',
		headers: {'Content-Type': 'application/json', Accept: 'application/json'}
	};
		return await fetch(url, options)
		.then(async res => await res.json())
}
// Function that is able to search a son among sibilings
function choiseBranchCategory(categories:[any], dep:string){
  let newDep = dep.replace(/-/g, " ")
  let i = 0
  let indexFinded = -1
  while(indexFinded == -1 || i < categories.length){
    if(newDep == categories[i]?.name){
      indexFinded = i
    }
    i += 1
  }
  let branch = indexFinded == -1 ? null : categories[indexFinded]
  return branch
}
// Function that retrive the correct level inside a category tree (sibilings)
function searchLevel(categories:any, categoryPath:[string], level:number){

  if(level == 0){ // se si sta cercando l'id del dip
    return categories
  } else{
    let temp : any = {}
    for(let i=0;i<level;i++){
      if(i == 0){
        temp = categories.children
      }else{
        temp = choiseBranchCategory(temp,categoryPath[i])?.children
      }
    }
    return temp
  }
}
// Function that is able to retrive a category id from an ordered list of category
// For example
// [dep]
// [dep, cat]
// [dep, cat, subcat]
export async function getIdCategory(categoryPath:[string]){
  let categories = await getAllCategory()
  let deepLevel = categoryPath.length
  let branch = choiseBranchCategory(categories,categoryPath[0])
  if(branch.name == "akcesoria") {
	  return 2
  }
  if(branch == null){ //se non viene trovato il branch del dipartimento
    return ''
}
let categoryLevel = searchLevel(branch, categoryPath, deepLevel-1)
  return choiseBranchCategory(categoryLevel,categoryPath[deepLevel-1]).id
}
