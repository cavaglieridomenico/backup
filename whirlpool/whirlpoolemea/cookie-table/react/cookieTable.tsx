import React, { useEffect, useState } from 'react'
import { Tabs } from 'vtex.styleguide'
import { Tab } from 'vtex.styleguide'
import { index as RichText } from "vtex.rich-text";

interface CookieObj {
  GroupName: string
  GroupDescription: string
  Cookies: [Cookie]
}
interface Cookie {
  Name: string
  Host: string
  Length: string
  IsSession: boolean,
  isThirdParty: boolean
}
interface WindowOptanon extends Window {
  Optanon: any
}

interface CookieTableParameters {
  cookieGroups: [string]
  cookieFields: [string]
}

// const CSS_HANDLES = ['container', 'image'] as const



const cookieTable: StorefrontFunctionComponent<CookieTableParameters> = ({
  cookieGroups,
  cookieFields = ['Name', 'Host', 'Length']
}) => {
  useEffect(() => {
    let optanon = (window as unknown as WindowOptanon).Optanon
    if (optanon !== undefined) {
      const cookieObj = optanon.GetDomainData().Groups
      let indexes: any = []
      cookieGroups?.forEach((group) => {
        let index: any = cookieObj.findIndex((cObj: any) => {
          return cObj.CustomGroupId === group
        })

        if (index !== undefined && index >= 0)
          indexes.push(index)
      })
      setCookieTableLoaded(true)
      setCookieObj(cookieObj);
      setCookieObjIndexes(indexes)
    }
    return () => {
      setCookieTableLoaded(false)
      setCookieObj([])
    };
  }, [(window as unknown as WindowOptanon).Optanon])
  const [tab, setTab] = useState({ currentTab: 1 })
  const [tableLoaded, setCookieTableLoaded] = useState(false)
  const [cookieObj, setCookieObj] = useState<CookieObj[]>([])
  const [cookieObjIndexes, setCookieObjIndexes] = useState<[any]>()
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {tableLoaded ?
        <Tabs>
          {
            cookieObjIndexes?.map((index: any, iteration) => (
              <Tab
                label={cookieObj[index].GroupName}
                active={tab.currentTab === iteration + 1}
                onClick={() => setTab({ currentTab: iteration + 1 })}>
                <div>
                  <div>
                    <h3 style={{ textTransform: 'uppercase' }}>{cookieObj[index].GroupName}</h3>
                    <p>
                      <RichText text={cookieObj[index].GroupDescription.replace(/<\/?[^>]+(>|$)/g, "")} />
                    </p>
                  </div>
                  <div style={{ display: 'flex' }}>

                    {
                      cookieFields?.map((cField: any) => (
                        <div style={{ width: 100 / cookieFields.length + '%' }}>
                          <h4>

                            {cField}
                          </h4>
                          <div>
                            <ul style={{ listStyle: 'none', padding: '0' }}>
                              {cookieObj[index].Cookies.map((cookie: any) => {
                                return <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cookie[cField]}</li>
                              })}
                            </ul>
                          </div>
                        </div>
                      ))
                    }


                  </div>
                </div>
              </Tab>
            ))
          }

        </Tabs>
        : null
      }

    </div>
  )
}

export default cookieTable
