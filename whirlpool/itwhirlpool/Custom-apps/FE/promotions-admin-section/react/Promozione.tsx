import React, { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Layout, PageBlock, PageHeader } from "vtex.styleguide";
import { useRuntime } from "vtex.render-runtime";

import "./styles.global.css";

const printPromoSpecification = (
  key: string,
  value: string,
  tag: any = "h3"
) => {
  return (
    <React.Fragment>
      <div style={{ display: "flex" }}>
        {tag == "h3" ? <h3>{key}</h3> : <h5>{key}</h5>}
        <div
          style={{ display: "flex", alignItems: "center", paddingLeft: "1rem" }}
        >
          {Array.isArray(value) ? (
            printArrayPromoSpecification(value)
          ) : (
            <span>{value.toString()}</span>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
const printArrayPromoSpecification = (values: any[]) => {
  return (
    <div style={{ marginLeft: "1.5rem" }}>
      {values.map((value: any) => {
        return Object.keys(value).map((key: string) =>
          printPromoSpecification(key, value[key], "h5")
        );
      })}
    </div>
  );
};

const Promozione: FC<Props> = ({ params }) => {
  const [promo, setPromo] = useState({} as any);
  const { navigate } = useRuntime();

  useEffect(() => {
    const retrivePromo = async () => {
      let response = await fetch(
        "/api/rnb/pvt/calculatorconfiguration/" + params.id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/vnd.vtex.pricing.v3+json",
          },
        }
      ).then((res) => res.json());
      setPromo(response);
    };
    retrivePromo();
  }, []);

  const backToList = () => {
    navigate({
      to: "/admin/app/promotions-list",
    });
  };

  return (
    <Layout
      pageHeader={
        <PageHeader title={<FormattedMessage id="admin-example.details" />} />
      }
    >
      <div className={"bread"}>
        <FormattedMessage id="admin-example.hello-world">
          {(message) => {
            return (
              <a onClick={backToList} className={"link"}>
                {" "}
                {message}{" "}
              </a>
            );
          }}
        </FormattedMessage>
        <div className={"sep"}>/</div>
        <span>{promo && promo.name}</span>
      </div>
      <PageBlock variation="full">
        <div>
          {promo &&
            Object.keys(promo).map((key: string) => {
              let isArray = Array.isArray(promo[key]);
              let isNotEmpty = isArray && promo[key].length > 0;
              let row: any;
              if (isArray) {
                if (isNotEmpty) {
                  row = (
                    <React.Fragment>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <h3>{key}</h3>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {printArrayPromoSpecification(promo[key])}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                } else {
                  return;
                }
              } else {
                if (typeof promo[key] !== "object") {
                  row = printPromoSpecification(key, promo[key]);
                } else {
                  row = (
                    <React.Fragment>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <h3>{key}</h3>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginLeft: "1rem",
                          }}
                        >
                          {Object.keys(promo[key]).map((temp_key: string) => {
                            let temp_value = promo[key];
                            let isArray = Array.isArray(temp_value);
                            let isNotEmpty = isArray && temp_value.length > 0;
                            if (isArray) {
                              if (isNotEmpty) {
                                return (
                                  <div style={{ display: "flex" }}>
                                    <h3>{temp_key}</h3>
                                    {printArrayPromoSpecification(temp_value)}
                                  </div>
                                );
                              }
                            } else {
                              return printPromoSpecification(
                                temp_key,
                                temp_value[temp_key]
                              );
                            }
                            return;
                          })}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                }
              }
              return (
                <React.Fragment>
                  <div className={"row"}>{row}</div>
                  <hr />
                </React.Fragment>
              );
            })}
        </div>
      </PageBlock>
    </Layout>
  );
};

interface Props {
  params: any;
}

export default Promozione;
