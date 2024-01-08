import getSearchProductInfos from '../../graphql/search.graphql'

export const getSearchProduct = async (slug: string) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: getSearchProductInfos,
      variables: {
        slug: slug,
      },
    }),
  }

  const product = await fetch('/_v/private/graphql/v1', options).then((res) =>
    res.json()
  )

  return product?.data?.productData
}
