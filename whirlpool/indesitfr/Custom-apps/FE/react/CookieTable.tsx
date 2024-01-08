import React, { useEffect, useState } from "react";
// @ts-ignore
import { Tabs, Tab } from "vtex.styleguide";
// @ts-ignore
import { useCssHandles } from "vtex.css-handles";

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

const CSS_HANDLES = [
  "CookieTable__container",
  "CookieTable__groupName",
  "CookieTable__groupNameContainer",
  "CookieTable__groupContainer",
  "CookieTable__tableDescription",
  "CookieTable__tableContainer",
  "CookieTable__columnName",
  "CookieTable__columnContainer",
  "CookieTable__columnElement",
];

const cookieTable: StorefrontFunctionComponent<CookieObj> = ({
  nameLabel,
  hostLabel,
  durationLabel,
}) => {
  //Ids of cookie groups to print
  const cookiesToShow = ["C0001", "C0002", "C0003", "C0007"];

  const { handles } = useCssHandles(CSS_HANDLES);

  useEffect(() => {
    let optanon = (window as unknown as WindowOptanon).Optanon;
    if (optanon !== undefined) {
      const cookieObj = optanon.GetDomainData().Groups;
      setCookieTableLoaded(true);
      setCookieObj(cookieObj);
    }
    return () => {
      setCookieTableLoaded(false);
      setCookieObj([]);
    };
  }, [(window as unknown as WindowOptanon).Optanon]);
  const [tab, setTab] = useState({ currentTab: 0 });
  const [tableLoaded, setCookieTableLoaded] = useState(false);
  const [cookieObj, setCookieObj] = useState<CookieObj[]>([]);

  const stampDesc = (html: string) => {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent;
  };

  return (
    <>
      <style>
        {
          "\
        .indesitfr-custom-apps-0-x-CookieTable__container .b--emphasis {\
            border-color: #0090d0;\
        }\
        .indesitfr-custom-apps-0-x-CookieTable__container .vtex-tab__button {\
            height: auto;\
            padding: 0;\
            width: 25%;\
        }\
        .hover-c-action-primary:hover {\
            color: #0090d0;\
        }\
        \
    "
        }
      </style>
      <div className={handles.CookieTable__container}>
        {tableLoaded ? (
          <Tabs>
            {/* Filter for the only groups that I want to print */}
            {cookieObj
              .filter((group: any) =>
                cookiesToShow.includes(group.OptanonGroupId)
              )
              .map((group: CookieObj, index: number) => (
                <Tab
                  label={group.GroupName}
                  active={tab.currentTab === index}
                  onClick={() => setTab({ currentTab: index })}
                >
                  <div className={handles.CookieTable__groupContainer}>
                    <div className={handles.CookieTable__groupNameContainer}>
                      <h3 className={handles.CookieTable__groupName}>
                        {group.GroupName}
                      </h3>
                      <p className={handles.CookieTable__tableDescription}>
                        {stampDesc(group.GroupDescription)}
                      </p>
                    </div>
                    <div
                      className={handles.CookieTable__tableContainer}
                      style={{ display: "flex" }}
                    >
                      <div style={{ width: "33%" }}>
                        <h4 className={handles.CookieTable__columnName}>
                          {nameLabel}
                        </h4>
                        <div className={handles.CookieTable__columnContainer}>
                          <ul style={{ listStyle: "none", padding: "0" }}>
                            {/* Find the associated cookies for the selected group */}
                            {cookieObj
                              .find(
                                (obj) =>
                                  obj.OptanonGroupId == group.OptanonGroupId
                              )
                              ?.Cookies.map((cookie) => {
                                return (
                                  <li
                                    className={
                                      handles.CookieTable__columnElement
                                    }
                                  >
                                    {cookie.Name}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                      <div style={{ width: "33%" }}>
                        <h4 className={handles.CookieTable__columnName}>
                          {hostLabel}
                        </h4>
                        <div className={handles.CookieTable__columnContainer}>
                          <ul style={{ listStyle: "none", padding: "0" }}>
                            {/* Find the associated cookies for the selected group */}
                            {cookieObj
                              .find(
                                (obj) =>
                                  obj.OptanonGroupId == group.OptanonGroupId
                              )
                              ?.Cookies.map((cookie) => {
                                return (
                                  <li
                                    className={
                                      handles.CookieTable__columnElement
                                    }
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {cookie.Host}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </div>
                      <div style={{ width: "33%" }}>
                        <h4 className={handles.CookieTable__columnName}>
                          {durationLabel}
                        </h4>
                        <div className={handles.CookieTable__columnContainer}>
                          <ul style={{ listStyle: "none", padding: "0" }}>
                            {/* Find the associated cookies for the selected group */}
                            {cookieObj
                              .find(
                                (obj) =>
                                  obj.OptanonGroupId == group.OptanonGroupId
                              )
                              ?.Cookies.map((cookie) => {
                                return (
                                  <li
                                    className={
                                      handles.CookieTable__columnElement
                                    }
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
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
    </>
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
  },
};

export default cookieTable;
