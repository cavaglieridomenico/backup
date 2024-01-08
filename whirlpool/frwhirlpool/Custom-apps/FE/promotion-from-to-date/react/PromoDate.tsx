// /* eslint-disable no-console */
// import React, { useEffect, useState } from 'react'
// import { useProduct } from 'vtex.product-context'

// const PromoDate: StorefrontFunctionComponent = () => {
//   const [startDate, setStartDate] = useState(null)
//   const [endDate, setEndDate] = useState(null)
//   const productContext = useProduct()

//   let skuId = productContext.product.items[0].itemId
//   useEffect(() => {
//     const url =  `/_v/wrapper/api/catalog/promo?skuId=${skuId}`
//     const options = {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' },
//     }
//     try {
//       fetch(url, options)
//         .then(res => res.json())
//         .then(json => {
//           setStartDate(json.beginDate)
//           setEndDate(json.endDate)
//         })
//     } catch (err) {
//       console.log(err)
//     }
//   }, [])

//   return (
//     <>
//       {(startDate !== null && endDate !== null)? (
//         <span>
//          La promotion est valide du {startDate} au {endDate}
//         </span>): null
//       }
//     </>
//   )
// }

// PromoDate.schema = {
//   title: 'editor.promoDate.title',
//   description: 'editor.promoDate.description',
//   type: 'object',
//   properties: {},
// }

// export default PromoDate
