import React, {useState} from 'react'
import styles from './ProductSpecificationsWithImages.css'
import { FormattedMessage } from 'react-intl'
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
		<a onClick={() => {readMoreClick(!readMore)}}
		className={styles.readMore}>{
			readMore?
		<FormattedMessage id="store/p-s-w-i.readMore"/>
		:
		<FormattedMessage id="store/p-s-w-i.readLess"/>
		}
		</a>
	</span>
	)
}
export default ReadMore
