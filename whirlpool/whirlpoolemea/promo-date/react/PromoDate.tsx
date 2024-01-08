/* eslint-disable no-console */
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useProduct } from "vtex.product-context";
import { useRuntime } from "vtex.render-runtime";
import style from './style.css'

const PromoDate: StorefrontFunctionComponent = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [onlyEndDate, setOnlyEndDate] = useState('');
  const productContext = useProduct();
  const { culture: { locale }} = useRuntime()

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
          if (json.type == "promo") {
            setStartDate(json.dateRange.beginDate)
            setEndDate(json.dateRange.endDate)
          }
          if(json.type == "cutPrice"){
            setOnlyEndDate(json.dateRange.endDate)
          }
        })
    } catch (err) {
      console.log(err)
    }
  }, []);

  const formatDate = (dateString: any) =>{
    return new Date(dateString).toLocaleDateString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    })
  }

  return (
    <>
       <div className={style.promoDateClass}>
        {startDate !== null && endDate !== null ? (
          <span>
            {' '}
            <FormattedMessage id="store/promo-date.from" />
            {formatDate(startDate)} <FormattedMessage id="store/promo-date.to" /> {formatDate(endDate)}
          </span>
        ) : null}
        {onlyEndDate != "" && <span> <FormattedMessage id="store/promo-date.endPromo" /> {formatDate(onlyEndDate)} </span>}
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
