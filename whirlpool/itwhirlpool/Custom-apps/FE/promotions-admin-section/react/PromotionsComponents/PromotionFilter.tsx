import React, { FC, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { PromotionContext } from "./PromotionContext";
import styles from "./style.css";
import Select from "react-select";
import { DatePicker } from "vtex.styleguide";
import { useIntl } from "react-intl";
import {
  checkDataWithData,
  filterInitialState,
  intervalIsChanged,
  isNotUndefinedValueData,
  onlyUnique,
  suggInitialState,
  toISOString,
  updateValues,
  valueInitialState,
} from "./utils/UtilsFunction";
import SelectedFilter from "./SelectedFilter";

const PromotionFIlter: FC = () => {

  const intl = useIntl();

  const { data, setData, setRefresh } = useContext(PromotionContext);
  const [initialData, setInitialData] = useState([] as any[]);
  const [sugg, setSugg] = useState(suggInitialState(Object.keys(data[0])));
  const [filterSelected, setFilterSelected] = useState(
    filterInitialState(Object.keys(data[0]))
  );
  const [values, setValues] = useState(valueInitialState(Object.keys(data[0]),intl.formatMessage({ id: "admin-example.select-value" })));


  const updateSugg = (
    dataPassed: any,
    newFilterSelected: any = filterSelected
  ) => {
    if (dataPassed.length == 0) {
      return;
    }
    let temp: any = suggInitialState(Object.keys(dataPassed[0]));
    dataPassed.map((datum: any) => {
      Object.keys(datum).map((key: any) => {
        if (["products", "categories", "brands"].includes(key)) {
          let splittetValue = datum[key].split(";");
          splittetValue.map((temp_value: string) =>
            temp[key].push(temp_value.slice(0, temp_value.indexOf("(")))
          );
        } else {
          temp[key].push(datum[key]);
        }
      });
    });
    Object.keys(dataPassed[0]).map(
      (key: any) => (temp[key] = (temp[key] as string[]).filter(onlyUnique))
    );
    Object.keys(newFilterSelected).map((key: any) => {
      if (newFilterSelected[key] == "undefined") {
        return;
      } else {
        temp[key] = [newFilterSelected[key]];
      }
    });
    setSugg(temp);
  };

  useEffect(() => {
    setInitialData(data);
    updateSugg(data);
  }, []);

  const setSelectedOption = (key: string, value: string) => {
    let dataPassed;
    let tempFilterSelected = { ...filterSelected };
    tempFilterSelected[key] = value;
    if (value == "undefined") {
      dataPassed = initialData.filter((datum: any) => {
        let truthValue = true;
        Object.keys(tempFilterSelected).map((key) => {
          if (tempFilterSelected[key] !== "undefined") {
            truthValue =
              truthValue &&
              checkDataWithData(key, datum[key], tempFilterSelected[key]);
          }
          return truthValue;
        });
        return truthValue;
      });
    } else {
      dataPassed = data.filter((datum: any) =>
        checkDataWithData(key, datum[key], value)
      );
    }
    setValues(updateValues(values, key, value,intl.formatMessage({ id: "admin-example.select-value" })));
    setFilterSelected(tempFilterSelected);
    updateSugg(dataPassed, tempFilterSelected);
    setData(dataPassed);
    setRefresh(true)
  };

  const setDataOption = (key: string, value: string, type: "from" | "to") => {
    console.log(value);
    let dataPassed;
    let tempFilterSelected = JSON.parse(JSON.stringify(filterSelected)); // COPY BY VALUE
    let number = type == "from" ? 0 : 1;
    tempFilterSelected[key][number] = value;
    if (
      !isNotUndefinedValueData(value) ||
      intervalIsChanged(filterSelected[key][number], value, type)
    ) {
      dataPassed = initialData.filter((datum: any) => {
        let truthValue = true;
        Object.keys(tempFilterSelected).map((key) => {
          if (tempFilterSelected[key] !== "undefined") {
            truthValue =
              truthValue &&
              checkDataWithData(key, datum[key], tempFilterSelected[key]);
          }
          return truthValue;
        });
        return truthValue;
      });
    } else {
      dataPassed = data.filter((datum: any) =>
        checkDataWithData(key, datum[key], tempFilterSelected[key])
      );
    }
    if (dataPassed.length == 0) {
      dataPassed = data;
      tempFilterSelected[key][number] = filterSelected[key][number];
      alert(intl.formatMessage({ id: "admin-example.no-result" }));
    }
    setValues(updateValues(values, key, tempFilterSelected[key],intl.formatMessage({ id: "admin-example.select-value" })));
    setFilterSelected(tempFilterSelected);
    updateSugg(dataPassed, tempFilterSelected);
    setData(dataPassed);
    setRefresh(true)
  };

  const reset = () => {
    setData(initialData);
    setFilterSelected(filterInitialState(Object.keys(initialData[0])));
    setValues(valueInitialState(Object.keys(initialData[0]),intl.formatMessage({ id: "admin-example.select-value" })));
    updateSugg(initialData, filterInitialState(Object.keys(initialData[0])));
    setRefresh(true)
  };

  return (
    <div>
      <h2>
        {" "}
        <FormattedMessage id="admin-example.filter" />{" "}
      </h2>
      <div className={styles.filterContainer}>
        {sugg &&
          Object.keys(sugg).map((key: any) => {
            if (
              sugg[key].length == 0 ||
              ["utmSource", "utmCampaign", "id"].includes(key)
            ) {
              return;
            }
            if (["beginDate", "endDate"].includes(key)) {
              return (
                sugg && (
                  <div className={styles.filter}>
                    <label>{key}</label>
                    <div style={{ width: "50%" }}>
                      <div
                        className={
                          key == "endDate" &&
                          toISOString(values[key][1]).split("T")[0] ==
                            toISOString().split("T")[0] &&
                          styles.hide
                        }
                      >
                        <span
                          className={
                            key == "beginDate" &&
                            toISOString(values[key][0]).split("T")[0] ==
                              toISOString().split("T")[0] &&
                            styles.hide
                          }
                        >
                          {intl.formatMessage({ id: "admin-example.from" })}
                        </span>

                        <DatePicker
                          placeholder={intl.formatMessage({ id: "admin-example.select-date" })}
                          excludeDates={[new Date(toISOString())]}
                          selected={
                            toISOString(values[key][0]).split("T")[0] !==
                            toISOString().split("T")[0]
                          }
                          value={
                            toISOString(values[key][0]).split("T")[0] !==
                              toISOString().split("T")[0] && values[key][0]
                          }
                          onChange={(date: any) => {
                            setDataOption(
                              key,
                              toISOString(date).split("T")[0],
                              "from"
                            );
                          }}
                          locale="en-GB"
                        />
                      </div>
                      <div
                        className={
                          key == "beginDate" &&
                          toISOString(values[key][0]).split("T")[0] ==
                            toISOString().split("T")[0] &&
                          styles.hide
                        }
                      >
                        <span
                          className={
                            key == "endDate" &&
                            toISOString(values[key][1]).split("T")[0] ==
                              toISOString().split("T")[0] &&
                            styles.hide
                          }
                        >
                          {intl.formatMessage({ id: "admin-example.to" })}
                        </span>

                        <DatePicker
                          placeholder={intl.formatMessage({ id: "admin-example.select-date" })}
                          excludeDates={[new Date(toISOString())]}
                          selected={
                            toISOString(values[key][1]).split("T")[0] !==
                            toISOString().split("T")[0]
                          }
                          value={
                            toISOString(values[key][1]).split("T")[0] !==
                              toISOString().split("T")[0] && values[key][1]
                          }
                          onChange={(date: any) => {
                            setDataOption(
                              key,
                              toISOString(date).split("T")[0],
                              "to"
                            );
                          }}
                          locale="en-GB"
                        />
                      </div>
                    </div>
                  </div>
                )
              );
            }
            return (
              sugg && (
                <div className={styles.filter}>
                  <label>{key}</label>
                  <FormattedMessage id="admin-example.default-value">
                    {(message) => {
                      let first = { label: message, value: "undefined" };
                      let options = [
                        first,
                        ...sugg[key].sort().map((temp: any) => {
                          return { value: temp, label: temp };
                        }),
                      ];
                      return (
                        <Select
                          placeholder={message}
                          options={options}
                          value={values[key]}
                          onChange={(e: any) => {
                            setSelectedOption(key, e?.value);
                          }}
                          className={styles.selectReact}
                        />
                      );
                    }}
                  </FormattedMessage>
                </div>
              )
            );
          })}
      </div>
      <div className={styles.resetButton}>
        <div role={"button"} onClick={reset} className={styles.button}>
          <FormattedMessage id="admin-example.reset-value" />
        </div>
      </div>
      <SelectedFilter
        {...{ filterSelected, setSelectedOption, setDataOption }}
      />
    </div>
  );
};

export default PromotionFIlter;
