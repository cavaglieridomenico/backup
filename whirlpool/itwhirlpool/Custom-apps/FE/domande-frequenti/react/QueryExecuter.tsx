import React from 'react'
import { useQuery } from 'react-apollo';

interface QueryExecuterProps {
    render: any;
    query: any;
    variables: any;
}

const QueryExecuter: StorefrontFunctionComponent<QueryExecuterProps> = ({query, variables, render}) => {

  const {data, loading, error} = useQuery(query, {variables})

  if (loading) {
    return (
        <div>Loading...</div>
    )
  }

  if (error) {
    console.log("Query error: " + error)
    return null
  }

  return (
    <>
        {render(data)}
    </>
  )
}

export default QueryExecuter