import React, {useState} from 'react'
import styles from './ProductSpecificationsWithImages.css'
interface ReadMoreProps{
	text:string,
	minLen?:number
}

const ReadMore: StorefrontFunctionComponent<ReadMoreProps> = ({ text, minLen=5 }) =>{
	const minText = text.split(/\s+/).slice(0,minLen).join(" ")+'...'
	const [readMore,setReadMore] = useState(true)
	const [textToShow,setText] = useState(minText)

	const readMoreClick = (isNotExpand:boolean) =>{
			setText(isNotExpand?minText:text)
			setReadMore(isNotExpand)
	}

	return (
	<span>
		{textToShow}
		<br></br>
		<a onClick={() => {readMoreClick(!readMore)}} className={styles.readMore}>{readMore?'View more':'View less'}</a>
	</span>
	)
}
export default ReadMore
