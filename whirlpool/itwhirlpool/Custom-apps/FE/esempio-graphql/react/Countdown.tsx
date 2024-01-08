import React from 'react'

import { useQuery } from "react-apollo";
import productQuery from "./graphql/product.graphql";

interface CountdownProps { }

const Countdown: StorefrontFunctionComponent<CountdownProps> = ({ }) => {
  const { data, loading, error } = useQuery(productQuery, {
    ssr: false,
    variables: {
      refId: '859991597010',
    },
  });
  if(loading) return <p>Caricamento</p>
  if(error) return <p>{error.message}</p>
  
  return <div>{data.getProduct.Name}</div>
}

Countdown.schema = {
  title: 'editor.countdown.title',
  description: 'editor.countdown.description',
  type: 'object',
  properties: {},
}

export default Countdown
