
import { getProdName } from './generateUrl'

// const buildDataSrc = (url) =>{
// 	let id = retriveID(url)
// 	return "https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/"+id+"/jsind9/std/1000x1000/"+id+"?fill=zoom&fillcolor=rgba:255,255,255&scalemode=product"
// }

// const retriveID = (url) =>{
// 	let splitSlash = url.split('/')
// 	return splitSlash[splitSlash.length - 1].split('.')[0]
// }

export const handleClickAnal = async (props) =>{
	const { isVideo, url } = props
	let dataLayer = window?.dataLayer
	let splittedNameFromUrl = window.location.pathname.split('/')[1].split('-')
	let prodCode = splittedNameFromUrl[splittedNameFromUrl.length - 1]
	// let prodName = await getProdName(prodCode)

	//GA4FUNREQ37
	const ga4Data = {
		eventName: 'ga4-productImageClick',
		isVideo: isVideo,
		url: url
	}
	window.postMessage( ga4Data, window.origin )
}
