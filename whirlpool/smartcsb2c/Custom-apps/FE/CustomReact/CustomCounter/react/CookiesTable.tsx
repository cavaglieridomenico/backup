//@ts-nocheck
import React, { useEffect, useState } from 'react'
import { Tabs } from 'vtex.styleguide'
import { Tab } from 'vtex.styleguide'
import useInterval from './utils/useInterval';

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

// const CSS_HANDLES = ['container', 'image'] as const

const cookieTable: StorefrontFunctionComponent<CookieObj> = ({ }) => {
const [optanon, setOptanon] = useState(undefined);
  useEffect(() => {
    if (optanon !== undefined) {
      const cookieObj = optanon.GetDomainData().Groups
      setCookieTableLoaded(true)
      setCookieObj(cookieObj);
    }
    return () => {
      setCookieTableLoaded(false)
      setCookieObj([])
    };
  }, [optanon])
  useInterval(() => {
    setOptanon((window as unknown as WindowOptanon).Optanon);
  }, 100)
  const [tab, setTab] = useState({ currentTab: 1 })
  const [tableLoaded, setCookieTableLoaded] = useState(false)
  const [cookieObj, setCookieObj] = useState<CookieObj[]>([])
  console.log(cookieObj)
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {tableLoaded ?
        <Tabs>
          <Tab
            label={cookieObj[0].GroupName}
            active={tab.currentTab === 1}
            onClick={() => setTab({ currentTab: 1 })}>
            <div>
              <div>
                <h3 style={{ textTransform: 'uppercase' }}>{cookieObj[0].GroupName}</h3>
                <p>{cookieObj[0].GroupDescription}</p>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '33%' }}>
                  <h4>

                    Cookie Subgroup
                  </h4>
                  <div>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                      {cookieObj[0].Cookies.map((cookie) => {
                        return <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cookie.Host}</li>
                      })}
                    </ul>
                  </div>
                </div>
                <div style={{ width: '33%' }}>
                  <h4>
                    Cookies
                  </h4>
                  <div>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                      {cookieObj[0].Cookies.map((cookie) => {
                        return <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cookie.Name}</li>
                      })}
                    </ul>
                  </div>
                </div>
                <div style={{ width: '33%' }}>
                  <h4>
                    Cookies used
                  </h4>
                  <div>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                      {cookieObj[0].Cookies.map((cookie) => {
                        return <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cookie.isThirdParty ? "3rd Party" : "1st Party"}</li>
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab
            label={cookieObj[1].GroupName}
            active={tab.currentTab === 2}
            onClick={() => setTab({ currentTab: 2 })}>
            <div>
              <div>
                <h3 style={{ textTransform: 'uppercase' }}>{cookieObj[1].GroupName}</h3>
                <p>{cookieObj[1].GroupDescription}</p>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '33%' }}>
                  <h4>
                    Cookie Subgroup
                  </h4>
                  <div>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                      {cookieObj[1].Cookies.map((cookie) => {
                        return <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cookie.Host}</li>
                      })}
                    </ul>
                  </div>
                </div>
                <div style={{ width: '33%' }}>
                  <h4>
                  Cookies
                  </h4>
                  <div>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                      {cookieObj[1].Cookies.map((cookie) => {
                        return <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cookie.Name}</li>
                      })}
                    </ul>
                  </div>
                </div>
                <div style={{ width: '33%' }}>
                  <h4>
                    Cookies used
                  </h4>
                  <div>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                      {cookieObj[1].Cookies.map((cookie) => {
                        return <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cookie.isThirdParty ? "3rd Party" : "1st Party"}</li>
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab
            label={cookieObj[2].GroupName}
            active={tab.currentTab === 3}
            onClick={() => setTab({ currentTab: 3 })}>
            <div>
              <div>
                <h3 style={{ textTransform: 'uppercase' }}>{cookieObj[2].GroupName}</h3>
                <p>{cookieObj[2].GroupDescription}</p>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '33%' }}>
                  <h4>
                    Cookie Subgroup
                  </h4>
                  <div>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                      {cookieObj[2].Cookies.map((cookie) => {
                        return <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cookie.Host}</li>
                      })}
                    </ul>
                  </div>
                </div>
                <div style={{ width: '33%' }}>
                  <h4>
                  Cookies
                  </h4>
                  <div>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                      {cookieObj[2].Cookies.map((cookie) => {
                        return <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cookie.Name}</li>
                      })}
                    </ul>
                  </div>
                </div>
                <div style={{ width: '33%' }}>
                  <h4>
                    Cookies used
                  </h4>
                  <div>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                      {cookieObj[2].Cookies.map((cookie) => {
                        return <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cookie.isThirdParty ? "3rd Party" : "1st Party"}</li>
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab
            label={cookieObj[4].GroupName}
            active={tab.currentTab === 4}
            onClick={() => setTab({ currentTab: 4 })}>
            <div>
              <div>
                <h3 style={{ textTransform: 'uppercase' }}>{cookieObj[4].GroupName}</h3>
                <p>{cookieObj[4].GroupDescription}</p>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '33%' }}>
                  <h4>
                    Cookie Subgroup
                  </h4>
                  <div>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                      {cookieObj[4].Cookies.map((cookie) => {
                        return <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cookie.Host}</li>
                      })}
                    </ul>
                  </div>
                </div>
                <div style={{ width: '33%' }}>
                  <h4>
                  Cookies
                  </h4>
                  <div>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                      {cookieObj[4].Cookies.map((cookie) => {
                        return <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cookie.Name}</li>
                      })}
                    </ul>
                  </div>
                </div>
                <div style={{ width: '33%' }}>
                  <h4>
                    Cookies used
                  </h4>
                  <div>
                    <ul style={{ listStyle: 'none', padding: '0' }}>
                      {cookieObj[4].Cookies.map((cookie) => {
                        return <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cookie.isThirdParty ? "3rd Party" : "1st Party"}</li>
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
        : null
      }

    </div>
  )
}

cookieTable.schema = {
  title: 'editor.cookie-table.title',
  description: 'editor.cookie-table.description',
  type: 'object',
  properties: {
  },
}

export default cookieTable
