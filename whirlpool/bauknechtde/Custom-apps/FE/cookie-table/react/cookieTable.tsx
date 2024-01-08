import React, { useEffect, useState } from "react";
import style from "./style.css";
import { useIntl } from "react-intl";

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
  CustomGroupId: string;
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

const cookieTable: StorefrontFunctionComponent<CookieObj> = ({}) => {
  //Ids of cookie groups to print
  const cookiesToShow = ["C0001", "C0002", "C0003", "C0007"];

  useEffect(() => {
    let optanon = (window as unknown as WindowOptanon).Optanon;

    if (typeof (window as unknown as WindowOptanon).Optanon != undefined) {
      const cookieObj = optanon.GetDomainData().Groups;
      setCookieTableLoaded(true);
      setCookieObj(cookieObj);
    }
    return () => {
      setCookieTableLoaded(false);
      setCookieObj([]);
    };
  }, [typeof (window as unknown as WindowOptanon).Optanon]);
  const [tableLoaded, setCookieTableLoaded] = useState(false);
  const [cookieObj, setCookieObj] = useState<CookieObj[]>([]);

  const filteredCookies = cookieObj?.filter((group: any) =>
    cookiesToShow.includes(group.OptanonGroupId)
  );
  /* console.log("COOKIE-OBJECT--------", cookieObj);
  console.log("FILTERED-COOKIES------", filteredCookies); */
  const intl = useIntl();

  return (
    <div className={style.cookieInfoMainContainer}>
      {tableLoaded
        ? filteredCookies?.map((group: any) => (
            <div className={style.cookieInfoContainer}>
              <h4 className={style.groupName}>{group.GroupName}</h4>
              <p className={style.groupDescription}>{group.GroupDescription}</p>
              {console.log(group.Cookies)}

              <table className={style.tableContainer}>
                <tr className={style.tableHeadContainer}>
                  <th className={style.tableTitle}>
                    {intl.formatMessage({
                      id: "store/cookie-table.tableTitle1",
                    })}
                  </th>
                  <th className={style.tableTitle}>
                    {intl.formatMessage({
                      id: "store/cookie-table.tableTitle2",
                    })}
                  </th>
                  <th className={style.tableTitle}>
                    {intl.formatMessage({
                      id: "store/cookie-table.tableTitle3",
                    })}
                  </th>
                  <th className={style.tableTitle}>
                    {intl.formatMessage({
                      id: "store/cookie-table.tableTitle4",
                    })}
                  </th>
                </tr>
                {group.Cookies?.map((cookie: any) => (
                  <tr>
                    <td className={style.tableText}>{cookie.Name}</td>
                    <td className={style.tableText}>{cookie.Host}</td>
                    <td className={style.tableText}>
                      {cookie.Length == "0"
                        ? intl.formatMessage({
                            id: "store/cookie-table.session",
                          })
                        : cookie.Length + " tage"}
                    </td>
                    <td className={style.tableText}>
                      {group?.FirstPartyCookies?.some(
                        (FPcookie: any) => FPcookie.id == cookie.id
                      )
                        ? intl.formatMessage({
                            id: "store/cookie-table.firstParty",
                          })
                        : intl.formatMessage({
                            id: "store/cookie-table.thirdParty",
                          })}
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          ))
        : ""}
    </div>
  );
};

/* cookieTable.schema = {
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
}; */

export default cookieTable;
