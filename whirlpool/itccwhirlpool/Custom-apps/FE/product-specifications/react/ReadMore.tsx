import React, { useState } from 'react'
import styles from './ProductSpecificationsWithImages.css'
import { FormattedMessage } from 'react-intl'
import { usePixel } from 'vtex.pixel-manager'

interface ReadMoreProps {
	text: string
	minLen?: number
	data: any
	context: any
	matchId: string
}


const ReadMore: StorefrontFunctionComponent<ReadMoreProps> = ({
	text,
	minLen = 5,
	data,
	context,
	matchId,
}) => {
	const minText =
		text.replace('.', '. ').split(/\s+/).slice(0, minLen).join(' ') + '...'
	const [readMore, setReadMore] = useState(true)
	const [textToShow, setText] = useState(minText)
	const textWhitSpace = text.replace('.', '. ')
	const { push } = usePixel()

	const readMoreClick = (isNotExpand: boolean) => {
		const splittedUrl = data.src.split('.jpg')[0].split('/')
		const thronIdLogo = splittedUrl[splittedUrl.length - 1]

		let productCode = context?.productReference.replace('-WER', '')
		let productName = context?.productName
		push({
			event: 'readMore',
			productCode: productCode,
			productName: productName,
			isNotExpand: isNotExpand,
			matchId: matchId,
			thronIdLogo: thronIdLogo
		})
		setText(isNotExpand ? minText : textWhitSpace)
		setReadMore(isNotExpand)
	}

	return (
		<span>
			{textToShow}
			<br></br>
			<a
				onClick={() => {
					readMoreClick(!readMore)
				}}
				className={styles.readMore}
			>
				{readMore ? (
					<FormattedMessage id="editor.product-specifications-with-images-read-more" />
				) : (
					<FormattedMessage id="editor.product-specifications-with-images-read-less" />
				)}
			</a>
		</span>
	)
}
export default ReadMore
