import React, {useState} from 'react'
import styles from './ProductSpecificationsWithImages.css'
interface ReadMoreProps{
	text:string,
	minLen?:number,
	data:any,
	context:any
	matchId: string
}
declare global {
    interface Window {
        dataLayer:any;
    }
}

let dataLayer = window.dataLayer;

// function getStringCategoryFromId(idCategory: string) {
// 	const options = {
// 	  method: "GET",
// 	  headers: {
// 		"Content-Type": "application/json",
// 		Accept: "application/json"
// 	  },
// 	};
  
// 	return fetch("/_v/wrapper/api/catalog/category/" + idCategory, options).then(
// 	  (response) => {
// 		return response.json();
// 	  }
// 	);
//   }

const ReadMore: StorefrontFunctionComponent<ReadMoreProps> = ({ text, minLen=5, data, context, matchId }) =>{
	const minText = text.replace(".", ". ").split(/\s+/).slice(0,minLen).join(" ")+'...'
	const [readMore,setReadMore] = useState(true)
	const [textToShow,setText] = useState(minText)
	const textWhitSpace = text.replace(".", ". ")

	
	const readMoreClick = (isNotExpand:boolean) =>{

		const splittedUrl = data.src.split(".jpg")[0].split("/")
		const thronIdLogo = splittedUrl[splittedUrl.length-1]

		let tecnologyName = data?.name
		let productCode = context?.productReference.replace("-WER", "")
		let productName = context?.productName
		if(!isNotExpand){
			dataLayer.push({
			event: 'extendedDescription',
			eventCategory: 'Product Experience',
			eventAction: `Read an Extended Description – ${tecnologyName}`,
			eventLabel: `${productCode} - ${productName}` 
		})
		}
		dataLayer.push({
			event: 'matchingTechnology',
			eventCategory: 'Matching Technology Tracking',
			eventAction: !isNotExpand ? "open" : 'close',
			eventLabel: `${productCode} - ${productName}`,
			matchingTechId: matchId,
			matchingTechLogo: thronIdLogo,
		})
			// getStringCategoryFromId(context.categoryId).then((values)=>{
			// 	categoryId = values.AdWordsRemarketingCode
				
			// })
			setText(isNotExpand?minText:textWhitSpace)
			setReadMore(isNotExpand)
	}

	return (
	<span>
		{textToShow}
		<br></br>
		<a onClick={() => {readMoreClick(!readMore)}} className={styles.readMore}>{readMore?'Lire la suite':'Lire moins'}</a>
	</span>
	)
}
export default ReadMore
