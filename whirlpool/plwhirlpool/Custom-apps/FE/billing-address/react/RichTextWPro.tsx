import { useOrderGroup } from 'itwhirlpool.order-placed/OrderGroupContext'
// import productCategory from './graphql/productCategory.gql'
// import { useQuery } from 'react-apollo'
import * as React from 'react'


interface RichTextWProProps {}

const RichTextWPro: StorefrontFunctionComponent<RichTextWProProps> = ({}) =>  {
	console.log("VVVVVVVVVV");

	const orderGroup = useOrderGroup()
	console.log("VVVVVVVVVV",orderGroup);

	// const { data, loading, error } = useQuery(productCategory, {
  //   variables: {
  //   },
  // })
	// console.log("VVVVVVVVVV",data,loading, error);

	return (
		<>
			{/* <div className={style.creationDate}>
				<span className={style.smallDate}>Data dell'ordine</span>
				<span>{getCreationDate(order.creationDate)}</span>
			</div> */}
		</>
	)
}
RichTextWPro.schema = {
	title: 'editor.richTextWPro.title',
	description: 'editor.richTextWPro.description',
	type: 'object',
}
export default RichTextWPro
