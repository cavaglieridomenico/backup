/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useProduct } from "vtex.product-context";
import style from './style.css'

const PromoDate: StorefrontFunctionComponent = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [onlyEndDate, setOnlyEndDate] = useState('');
  const productContext = useProduct();

  let skuId = productContext.selectedItem.itemId;

  useEffect(() => {
    const url = `/v2/wrapper/api/catalog/promo?skuId=${skuId}`;
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
   try {
      fetch(url, options)
        .then(res => res.json())
        .then(json => {
          console.log(json)
          if (json.type == "promo") {
            console.log("Promo")
            setStartDate(json.dateRange.beginDate)
            setEndDate(json.dateRange.endDate)
          }
          if(json.type == "cutPrice"){
            console.log("CutPrice")
            setOnlyEndDate(json.dateRange.endDate)
          }
        })
    } catch (err) {
      console.log(err)
    }
  }, []);

  return (
    <>
       <div className={style.promoDateClass}>
        {startDate !== null && endDate !== null ? (
          <span>
            {' '}
            <FormattedMessage id="store/promo-date.form" />
            {startDate} <FormattedMessage id="store/promo-date.to" /> {endDate}
          </span>
        ) : null}
        {onlyEndDate != "" && <span> <FormattedMessage id="store/promo-date.endPromo" /> {onlyEndDate} </span>}
      </div>
    </>
  );
};

PromoDate.schema = {
  title: "editor.promoDate.title",
  description: "editor.promoDate.description",
  type: "object",
  properties: {},
};

export default PromoDate;
