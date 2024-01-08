import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "vtex.styleguide";

interface CookieObj {
  GroupName: string;
  GroupDescription: string;
  Cookies: [Cookie];
  CustomGroupId: string;
}
interface Cookie {
  Name: string;
  Host: string;
  Length: string;
  IsSession: boolean;
  isThirdParty: boolean;
}
interface WindowOptanon extends Window {
  Optanon: any;
}

interface CookieTableParameters {
  cookieGroups: [string];
  cookieFields: [string];
  mappedCookies: any;
}

// const CSS_HANDLES = ['container', 'image'] as const

const cookieTable: StorefrontFunctionComponent<CookieTableParameters> = ({
  cookieGroups = ["C0001", "C0002", "C0003", "C0007"],
  cookieFields = ["Name", "Host", "Length"],
  mappedCookies,
}) => {
  useEffect(() => {
    let optanon = (window as unknown as WindowOptanon).Optanon;
    if (optanon !== undefined) {
      const cookieObj = optanon.GetDomainData().Groups;
      const filteredCookieObj: CookieObj[] = [];
      cookieGroups?.forEach((group) => {
        let cookie: CookieObj = cookieObj.find((cObj: CookieObj) => {
          return cObj.CustomGroupId === group;
        });

        if (cookie) {
          if (mappedCookies?.[cookie.CustomGroupId]) {
            const mappedCookie: CookieObj = cookieObj?.find(
              (obj: CookieObj) =>
                obj.CustomGroupId == mappedCookies[cookie.CustomGroupId]
            );
            cookie.GroupDescription =
              mappedCookie?.GroupDescription || cookie.GroupDescription;
            cookie.GroupName = mappedCookie?.GroupName || cookie.GroupName;
          }
          filteredCookieObj.push(cookie);
        }
      });
      setCookieTableLoaded(true);
      setCookieObj(filteredCookieObj);
    }
    return () => {
      setCookieTableLoaded(false);
      setCookieObj([]);
    };
  }, [(window as unknown as WindowOptanon).Optanon]);

  const [tab, setTab] = useState({ currentTab: 1 });
  const [tableLoaded, setCookieTableLoaded] = useState(false);
  const [cookieObj, setCookieObj] = useState<CookieObj[]>([]);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {tableLoaded ? (
        <Tabs>
          {cookieObj?.map((cookieObj: any, index: number) => (
            <Tab
              label={cookieObj.GroupName}
              active={tab.currentTab === index + 1}
              onClick={() => setTab({ currentTab: index + 1 })}
            >
              <div>
                <div>
                  <h3 style={{ textTransform: "uppercase" }}>
                    {cookieObj.GroupName}
                  </h3>
                  <p>
                    {cookieObj.GroupDescription.replace(/<\/?[^>]+(>|$)/g, "")}
                  </p>
                </div>
                <div style={{ display: "flex" }}>
                  {cookieFields?.map((cField: any) => (
                    <div style={{ width: 100 / cookieFields.length + "%" }}>
                      <h4>{cField}</h4>
                      <div>
                        <ul style={{ listStyle: "none", padding: "0" }}>
                          {cookieObj.Cookies.map((cookie: any) => {
                            return (
                              <li
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {cookie[cField]}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tab>
          ))}
        </Tabs>
      ) : null}
    </div>
  );
};

cookieTable.schema = {
  title: "editor.cookie-table.title",
  description: "editor.cookie-table.description",
  type: "object",
  properties: {},
};

export default cookieTable;
