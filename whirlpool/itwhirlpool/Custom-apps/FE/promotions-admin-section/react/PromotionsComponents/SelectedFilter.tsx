import React from 'react'
import { FormattedMessage } from 'react-intl';
import styles from './style.css'
import { getDataType, isNotUndefinedValueData } from './utils/UtilsFunction';

const SelectedFilter = ({filterSelected, setSelectedOption, setDataOption} : any) =>{
  return <React.Fragment>{Object.keys(filterSelected).filter((key: string) => {
    if (["beginDate", "endDate"].includes(key)) {
      return isNotUndefinedValueData(filterSelected[key][0]);
    }
    return filterSelected[key] !== "undefined";
  }).length > 0 && (
    <div className={styles.resetButton}>
      <h4>
        {" "}
        <FormattedMessage id="admin-example.filterSelected" />{" "}
      </h4>
      <div className={styles.containerFiltersSelected}>
        {Object.keys(filterSelected).map((key: any) => {
          if (["beginDate", "endDate"].includes(key)) {
            if(!isNotUndefinedValueData(filterSelected[key][0]) && !isNotUndefinedValueData(filterSelected[key][1])){
              return
            }
            return (
              <div className={styles.filterSelectedContainer} key={key}>
                <div className={styles.keyFilterSelected}>{key + ":"}</div>{" "}
                {filterSelected[key].map((filter: any, index: number) => {
                  if(!isNotUndefinedValueData(filter)){
                    return
                  }
                  let splitted = filter.split('-')
                  let type = index == 0 ? 'from' : 'to' as any
                  return (
                    <div
                      className={styles.buttonFilterSelected}
                      role={"button"}
                      id={key}
                      onClick={() => {
                        let def = new Date().toISOString().split("T")[0];
                        setDataOption(key, def, type);
                      }}
                    >
                      <div>
                        {type+':'+splitted[2]+'-'+splitted[1]+'-'+splitted[0]}
                      </div>
                      <span className={styles.iconRemoveFilterSelected}>
                        x
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          }

          return (
            filterSelected[key] !== "undefined" && (
              <div className={styles.filterSelectedContainer} key={key}>
                <div className={styles.keyFilterSelected}>{key + ":"}</div>
                <div
                  className={styles.buttonFilterSelected}
                  role={"button"}
                  id={key}
                  onClick={() => {
                    setSelectedOption(key, "undefined");
                  }}
                >
                  <div>
                    {filterSelected[key] == "" ? (
                      <FormattedMessage id="admin-example.empty-value" />
                    ) : (
                      getDataType(key, filterSelected[key])
                    )}
                  </div>
                  <span className={styles.iconRemoveFilterSelected}>x</span>
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  )}</React.Fragment>
}

export default SelectedFilter
