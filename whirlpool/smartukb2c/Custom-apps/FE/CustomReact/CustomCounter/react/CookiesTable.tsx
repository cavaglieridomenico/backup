//@ts-nocheck
import React, { useEffect, useState } from "react";
import { Tabs } from "vtex.styleguide";
import { Tab } from "vtex.styleguide";
import useInterval from './utils/useInterval';
// import { useCssHandles } from 'vtex.css-handles';

interface CookieObj {
  GroupName: string;
  GroupDescription: string;
  Cookies: [Cookie];
  //Labels
  nameLabel: string;
  hostLabel: string;
  durationLabel: string;
  OptanonGroupId: string;
  Parent: string;
  cookiesToShow: string[];
}
interface Cookie {
  Name: string;
  Host: string;
  Length: string;
  IsSession: boolean;
}
interface WindowOptanon extends Window {
  Optanon: any;
}

// const CSS_HANDLES = [
//   "cookieTableContainer",
//   "cookieTableDescr",
//   "cookieTableLabel",
//   "tableColumn",
//   "tableColumnContainer",
//   "tableList",
//   "tableListItem"
// ]
const cookieTable: StorefrontFunctionComponent<CookieObj> = ({
  nameLabel,
  hostLabel,
  durationLabel,
  cookiesToShow,
}) => {
  //Ids of cookie groups to print
  const cookiesList = cookiesToShow?.map((cookie: any) => cookie.cookieId);
  // const { handles } = useCssHandles(CSS_HANDLES);
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
  const [tab, setTab] = useState({ currentTab: 0 });
  const [tableLoaded, setCookieTableLoaded] = useState(false);
  const [cookieObj, setCookieObj] = useState<CookieObj[]>([]);
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {tableLoaded ? (
        <Tabs>
          {/* Filter for the only groups that I want to print */}
          {cookieObj
            .filter((group: any) => cookiesList?.includes(group.OptanonGroupId))
            .map((group: CookieObj, index: number) => (
              <Tab
                label={group.GroupName}
                active={tab.currentTab === index}
                onClick={() => setTab({ currentTab: index })}
              >
                <div>
                  <div>
                    <h3 style={{ textTransform: 'uppercase' }}>
                      {group.GroupName}
                    </h3>
                    <p style={{ textAlign: "justify" }}>{group.GroupDescription}</p>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <div style={{ width: '33%' }}>
                      <h4>{nameLabel}</h4>
                      <div>
                        <ul style={{ listStyle: "none", padding: "0" }}>
                          {/* Find the associated cookies for the selected group */}
                          {cookieObj
                            .find((obj) => obj.Parent == group.OptanonGroupId)
                            ?.Cookies.map((cookie) => {
                              return (
                                <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {cookie.Name}
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                    <div style={{ width: '33%' }}>
                      <h4>{hostLabel}</h4>
                      <div>
                        <ul style={{ listStyle: "none", padding: "0" }}>
                          {/* Find the associated cookies for the selected group */}
                          {cookieObj
                            .find((obj) => obj.Parent == group.OptanonGroupId)
                            ?.Cookies.map((cookie) => {
                              return (
                                <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {cookie.Host}
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                    <div style={{ width: '33%' }}>
                      <h4>{durationLabel}</h4>
                      <div>
                        <ul style={{ listStyle: "none", padding: "0" }}>
                          {/* Find the associated cookies for the selected group */}
                          {cookieObj
                            .find((obj) => obj.Parent == group.OptanonGroupId)
                            ?.Cookies.map((cookie) => {
                              return (
                                <li style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {cookie.Length}
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
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
  properties: {
    nameLabel: {
      title: "nameLabel",
      description: "Label of the first column (Name)",
      default: "Name",
      type: "string",
    },
    hostLabel: {
      title: "hostLabel",
      description: "Label of the second column (Host)",
      default: "Host",
      type: "string",
    },
    durationLabel: {
      title: "durationLabel",
      description: "Label of the third column (Duration)",
      default: "Duration",
      type: "string",
    },
    cookiesToShow: {
      title: "cookiesToShow",
      description: "List of cookies id to show",
      type: "array",
      items: {
        properties: {
          cookieId: {
            title: "cookieId",
            description: "Id of the cookie to show",
            default: "",
            type: "string",
          },
        },
      },
    },
  },
};

export default cookieTable;

