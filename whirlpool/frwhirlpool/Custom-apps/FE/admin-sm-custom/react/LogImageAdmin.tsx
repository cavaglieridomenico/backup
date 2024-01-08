/* import React from 'react'
import { FormattedMessage } from 'react-intl'


function AdminSitemap()
{
    enum IStatus{
        Idle = "admin-sitemap.app.idle",
        Started = "admin-sitemap.app.status.started",
        Running = "admin-sitemap.app.status.running",
        Broken = "Broken",
        Completed = "Completed"
    }

    const [status,setStatus] = React.useState(IStatus.Idle)
    console.log(status)

    return (
    <div>
       <FormattedMessage id="admin-sitemap.app.title"/>
        <div>
            <p><FormattedMessage id="admin-sitemap.app.status"/>: <FormattedMessage id={status}/> </p>
            <button onClick={()=>{
                setStatus(IStatus.Started);
                setTimeout(()=>setStatus(IStatus.Running),500)
                setTimeout(()=>setStatus(IStatus.Broken), 1500)

            }}>Generate</button>
        </div>
    </div>)
}
export default AdminSitemap */

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
  console.log(data);
  return (
    <Layout fullWidth pageHeader={<PageHeader title= "Log of Image" />}>
      <PageBlock>
        <div className="content" style={inputStyle}>
          <label htmlFor="image">History of images used in Site-Editor</label>

          {loading ? <span>...loading</span> :
          data.contents.edges.map((value: { cursor: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; node: { name: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; updatedAt: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; status: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }; })=> {
            return (
              <div className="content-detail" style={inputStyle2}>
                <span>
                  {value.cursor}
                </span>
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
