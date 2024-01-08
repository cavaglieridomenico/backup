import React, {useState} from 'react'
import styles from './ProductSpecificationsWithImages.css'
interface ReadMoreProps{
	text:string,
	minLen?:number,
	data:any,
	context:any
}
declare global {
    interface Window {
        dataLayer:any;
    }
}

let dataLayer = window.dataLayer;

function getStringCategoryFromId(idCategory: string) {
	const options = {
	  method: "GET",
	  headers: {
		"Content-Type": "application/json",
		Accept: "application/json"
	  },
	};
  
	return fetch("/_v/wrapper/api/catalog/category/" + idCategory, options).then(
	  (response) => {
		return response.json();
	  }
	);
  }

const ReadMore: StorefrontFunctionComponent<ReadMoreProps> = ({ text, minLen=5, data, context }) =>{
	const minText = text.split(/\s+/).slice(0,minLen).join(" ")+'...'
	const [readMore,setReadMore] = useState(true)
	const [textToShow,setText] = useState(minText)

	const readMoreClick = (isNotExpand:boolean) =>{
			let categoryId = ""
			getStringCategoryFromId(context.categoryId).then((values)=>{
				categoryId = values.AdWordsRemarketingCode
				let action = !isNotExpand ? 'open': 'close'
				let tecnologyId = data.name
				let thronId = data.src
				let productCode = context.productReference.replace("-WER", "")
				dataLayer.push({
					event: 'matchingTechnology',
					eventCategory: 'Matching Technology Tracking',
					eventAction: `${action} - ${tecnologyId} - ${thronId}`,
					eventLabel: `${productCode} - ${categoryId}` 
				})
			})
			setText(isNotExpand?minText:text)
			setReadMore(isNotExpand)
	}

	return (
	<span>
		{textToShow}
		<br></br>
		<a onClick={() => {readMoreClick(!readMore)}} className={styles.readMore}>{readMore?'Lire la suite':'Lire moin'}</a>
	</span>
	)
}
export default ReadMore
