import React, {useState} from 'react'
import styles from './ProductSpecificationsWithImages.css'
import { usePixel } from 'vtex.pixel-manager'

interface ReadMoreProps{
	text:string,
	minLen?:number,
	data:any,
	context:any
	matchId: string
}


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
	const { push } = usePixel()

	
	const readMoreClick = (isNotExpand:boolean) =>{

		const splittedUrl = data.src.split(".jpg")[0].split("/")
		const thronIdLogo = splittedUrl[splittedUrl.length-1]

		let productCode = context?.productReference.replace("-WER", "")
		let productName = context?.productName
		
		push({
			event: 'readMore',
			productCode: productCode,
			productName: productName,
			isNotExpand: isNotExpand,
			matchId: matchId,
			thronIdLogo: thronIdLogo
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
