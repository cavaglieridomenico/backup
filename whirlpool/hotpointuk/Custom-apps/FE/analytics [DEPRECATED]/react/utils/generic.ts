// Check if you are in error page
export function isErrorPage() {
	const currentRouteId: string = window?.history?.state?.state.navigationRoute.id
	const isError = currentRouteId === "store.not-found#search"
	return isError
}
  
// Check if you are in PDP error page
export function isProductErrorPage() {
	const currentRouteId: string = window?.history?.state?.state.navigationRoute.id
	const isProductPageError = currentRouteId === "store.not-found#product"
	return isProductPageError
}