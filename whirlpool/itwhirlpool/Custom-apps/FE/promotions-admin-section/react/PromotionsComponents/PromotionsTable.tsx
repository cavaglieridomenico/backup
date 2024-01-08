import React, { FC, useContext, useEffect, useState } from "react";
import styles from "./style.css";
import { useRuntime } from "vtex.render-runtime";
import { PromotionContext } from "./PromotionContext";
import { FormattedMessage } from "react-intl";
import { CSVLink } from "react-csv";

interface Props {
  datum: any;
}

const getElement = (key: string, data: any) => {
  if (["beginDate", "endDate"].includes(key)) {
    let splitted = data[key].split("T")[0].split('-')
    return splitted[2]+'-'+splitted[1]+'-'+splitted[0];
  } else {
    return data[key].length > 155
      ? data[key].substring(0, 155) + "..."
      : data[key];
  }
};

const PromotionRow: FC<Props> = ({ datum }) => {
  const { navigate } = useRuntime();

  const handleClick = (datum: any) => {
    navigate({
      to: "/admin/app/promotions-list/" + datum.id,
    });
  };

  return (
    <tr
    >
      {Object.keys(datum).map((key: any) => {
        if (key == "id") {
          return;
        }
        if (key == 'name'){
          return <td onClick={() =>{handleClick(datum)}} className={styles.promoName} >{getElement(key, datum)}</td>;
        }
        return <td>{getElement(key, datum)}</td>;
      })}
    </tr>
  );
};

const headerIcon = (value: any) => {
  if (value == undefined) {
    return null;
  }
  return value ? (
    <span className={styles.icon}>v</span>
  ) : (
    <span className={styles.IconRotate}>v</span>
  );
};

const PromotionsTable: FC = () => {
  const initialState: any[] = [];
  const { data, setData, refresh, setRefresh } = useContext(PromotionContext);
  const [header, setHeader] = useState(initialState);
  const [orderHeader, setOrderHeader] = useState({} as any);

  useEffect(() => {
    if (data.length > 0) {
      let keys = Object.keys(data[0]).filter((key: string) => key !== "id");
      setHeader(keys);
      let headerOrder: any = {};
      keys.map((key: any) => {
        headerOrder[key] = undefined;
      });
      setOrderHeader(headerOrder);
    }
  }, []);

  useEffect(()=>{
    if(refresh){
      let keys = Object.keys(data[0]).filter((key: string) => key !== "id");
      let headerOrder: any = {};
      keys.map((key: any) => {
        headerOrder[key] = undefined;
      });
      setOrderHeader(headerOrder);
      setRefresh(false)
    }
  },[refresh])

  const handleHeader = (el: any) => {
    let newOrdered = { ...orderHeader };
    newOrdered[el] = orderHeader[el] == undefined ? true : !orderHeader[el];
    Object.keys(newOrdered).map((key: any) => {
      //Se si vuole attivare un sort alla volta
      if (key !== el && newOrdered[key] !== undefined) {
        newOrdered[key] = undefined;
      }
    });
    setOrderHeader(newOrdered);

    setData(
      data.sort(function (a: any, b: any) {
        //per dati puliti e solo un sort alla volta sostituire con dummtdata i data dinamici
        let compare;
        if (["categoria", "brand", "product"].includes(el)) {
          if (parseInt(b[el]) > parseInt(a[el])) {
            compare = -1;
          } else if (parseInt(b[el]) < parseInt(a[el])) {
            compare = 1;
          } else {
            compare = 0;
          }
        } else {
          compare = (a[el] as string).localeCompare(b[el] as string);
        }

        return newOrdered[el] ? compare : -1 * compare;
      })
    );
  };

  const createCsv = () => {
    const csvReport = {
      data: data,
      headers: Object.keys(data[0]).map((key: string) => {
        return { label: key, key: key };
      }),
      filename:
        "promotion_export_" + new Date().toISOString().split("T")[0] + ".csv",
      separator: ";",
      enclosingCharacter: `'`,
    };
    return csvReport;
  };

  return (
    <div className={styles.tableContainer}>
      <div style={{display:'flex', alignItems:'center'}}>
        <h2>
          {" "}
          <FormattedMessage id="admin-example.Content" />
          {""}
        </h2>
        <span className={styles.dataLength}>{"(" + data.length + ")"}</span>
      </div>
      <div className={styles.containerOverflow}>
        <table className={styles.promotions}>
          {data.length > 0 && (<tr>
            {header.map((el: any) => (
              <th
                onClick={() => {
                  handleHeader(el);
                }}
              >
                {el} {headerIcon(orderHeader[el])}
              </th>
            ))}
          </tr>)}
          {data.map((datum: any) => (
            <PromotionRow datum={datum} />
          ))}
          </table>
      </div>
      <div className={styles.export}>
        {data.length > 0 && (
        <CSVLink {...createCsv()}>
          <FormattedMessage id="admin-example.export-csv" />
        </CSVLink>
        )}
      </div>
    </div>
  );
};

export default PromotionsTable;
