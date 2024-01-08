// import { array } from 'prop-types';
import React, { useEffect, useState } from "react";
import { useProduct } from "vtex.product-context";

import "./main.css";
import Service from "./Service";

const sessionAPI = "/api/sessions";

interface FreeServicesProps {
  Tooltip1: any;
  Tooltip2: any;
  Tooltip3: any;
}

const FreeServices: StorefrontFunctionComponent<FreeServicesProps> = ({
  Tooltip1,
  Tooltip2,
  Tooltip3,
}) => {
  const [services, setServices] = useState([]);
  const [salesC, setSalesC] = useState<string>();

  const product = useProduct();
  const outerDivStyle = {
    backgroundColor: "#f4f4f4",
    border: "1px solid #f4f4f4",
    borderRadius: "2px",
    width: "100%",
    paddingLeft: "1rem",
  };
  const spanStyle = {
    marginLeft: "1rem",
    display: "block",
    fontSize: "0.83em",
    marginBlockStart: "1.67em",
    marginBlockEnd: "1.67em",
    fontWeight: 600
  };
  const innerDivStyle = {
    display: "flex",
    margin: "1rem",
  };

  const ulStyle = {
    listStyle: "none",
    display: "flex",
    justifyContent: "space-between",
    padding: "0",
    width: "100%",
  };

  useEffect(() => {
    fetch(`${sessionAPI}?items=*`, {
      method: "GET",
      credentials: "same-origin",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((res) => {
        setSalesC(res.namespaces.public.sc.value);
      });
  }, []);

  useEffect(() => {
    fetch(
      `/_v/wrapper/api/catalog_system/sku/stockkeepingunitbyid/${product?.product?.items[0].itemId}`,
      {
        method: "GET",
      }
    )
      .then((response: any) => response.json())
      .then((json: any) => {
        if (json.Services.length) {
          json.Services.sort(
            (f: any, s: any) => s.ServiceTypeId - f.ServiceTypeId
          );
          setServices(
            json.Services.filter((el: any) => el.Options[0].Price === 0)
          );
          // setServiceCheck(true);
          // // @ts-ignore
          // document.querySelector(
          // '.vtex-flex-layout-0-x-flexColChild--quickviewContent',
          // // @ts-ignore
          // ).style.display = 'block'
        }
      });
    // return () => {}
  }, [salesC]);

  return salesC !== "4" ? (
    <div style={outerDivStyle}>
      <span style={spanStyle}>получите дополнительно</span>
      <div style={innerDivStyle}>
        <ul style={ulStyle}>
          <Service name="Доставка" key={123123} Tooltip1={Tooltip1} />
          {services.map((service: any) => (
            <Service
              name={service.Name}
              key={service.Id}
              Tooltip2={Tooltip2}
              Tooltip3={Tooltip3}
            />
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

FreeServices.schema = {
  title: "editor.countdown.title",
  description: "editor.countdown.description",
  type: "object",
  properties: {},
};

export default FreeServices;
