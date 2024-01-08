export const handleClickAnal = async (props) =>{
	//GA4FUNREQ37
	const { isVideo, url } = props
		const ga4Data = {
		eventName: 'ga4-productImageClick',
		isVideo: isVideo,
		url: url
	}
	window.postMessage( ga4Data, window.origin )
}
