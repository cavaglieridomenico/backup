import React, { useEffect, useState } from "react";
// import { FormattedMessage } from 'react-intl'
import { useProduct } from "vtex.product-context";
import { ExtensionPoint } from "vtex.render-runtime";
import style from "./style.css";
import { useIntl } from "react-intl";

interface CouponProps {
  children?: React.Component;
}

const Coupon: StorefrontFunctionComponent<CouponProps> = ({
  children,
}: CouponProps) => {
  //const [startDate, setStartDate] = useState(null)
  //const [endDate, setEndDate] = useState(null)
  const [coupon, setCoupon] = useState(null);
  const productContext = useProduct();

  let skuId = productContext.selectedItem.itemId;

  useEffect(() => {
    const url = `/_v/wrapper/api/catalog/coupon?skuId=${skuId}`;
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    try {
      fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
          setCoupon(json.code);
          console.log(json.code);
        });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const intl = useIntl();

  return (
    <>
      {coupon != null ? (
        <div className={style.couponContainer}>
          <div className={style.couponClass}>
            <span className={style.spanTitle}>
              Coupon:{" "}
              {intl.formatMessage({
                id: "store/promo-date.coupon",
              })}
            </span>
            <span className={style.spanCode}>{coupon}</span>
          </div>
          <div className={style.hide}>
            <ExtensionPoint id="rich-text" />
          </div>
          {children && <div>{children}</div>}
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
};

Coupon.schema = {
  title: "editor.coupon.title",
  description: "editor.coupon.description",
  type: "object",
  properties: {},
};

export default Coupon;
