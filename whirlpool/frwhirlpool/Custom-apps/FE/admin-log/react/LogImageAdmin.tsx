import React from  "react";
import { Layout, PageBlock, PageHeader } from "vtex.styleguide";
import { useQuery } from "react-apollo";

import FOTOS_SCHEMA from "./graphql/fotos.graphql";

const inputStyle = {
  "display" : "flex",
  "flex-direction" : "column"
}

const inputStyle2 = {
  "display": "flex",
  "flex-direction": "column",
  "border": "1px solid #e3e4e6",
  "border-radius": "6px",
  "padding": "15px 10px",
  "margin": "15px 0px"
}

const LogImageAdmin = () => {
  const { loading, data } = useQuery(FOTOS_SCHEMA)
  return (
    <Layout fullWidth pageHeader={<PageHeader title= "Image list" />}>
      <PageBlock>
        <div className="content" style={inputStyle}>
          <label htmlFor="image">Here you can find every image in this market and undestand when was uploaded last</label>

          {loading ? <span>...loading</span> :
          data.contents.edges.map((value: { cursor: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; node: { name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; updatedAt: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; status: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }; })=> {
            return (
              <div className="content-detail" style={inputStyle2}>
              
                <span>
                  {value.node.name}
                </span>
                <span>
                  {value.node.updatedAt}
                </span>
                <span>
                  {value.node.status}
                </span>
              </div>
            )
          })
          }
        </div>
      </PageBlock>
    </Layout>
  )
}

export default LogImageAdmin;
