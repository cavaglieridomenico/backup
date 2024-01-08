import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useCssHandles } from "vtex.css-handles";
import useCountdown from "./utils/useCountdown";
import { useQuery } from "react-apollo";
import { useProduct } from "vtex.product-context";
import promoInfoBySkuId from "../graphql/promoInfoBySkuId.graphql";
import { convertSummerTimeshift } from "./utils/useCountdown";
import "./styles.css";

interface PromoCountdownProps {}

const CSS_HANDLES = ["countdownContainer", "countdownText", "countdownBar", "countdownBarTimeLeft"] as const;

const PromoCountdown: StorefrontFunctionComponent<PromoCountdownProps> = ({}) => {
  const handles = useCssHandles(CSS_HANDLES);
  const intl = useIntl();
  const { product } = useProduct();

  useEffect(() => {
    if (!product) return;
  }, [product]);

  const checkIsDiscontinued = (product: any) => {
    const isDiscontinued = product?.specificationGroups
      ?.find((el: any) => el.name === "allSpecifications")
      ?.specifications?.find((el: any) => el.name === "isDiscontinued")?.values?.[0];

    return isDiscontinued;
  };
  const isDiscontinued = checkIsDiscontinued(product);

  const skuId = product?.items?.[0]?.itemId;
  const { data, error } = useQuery(promoInfoBySkuId, {
    variables: {
      skuId,
    },
  });

  const dates = data?.promoInfoBySkuId;

  const startDate = new Date(dates?.dateRange?.beginDate).getTime();
  const endDate = new Date(dates?.dateRange?.endDate).getTime();
  const now = convertSummerTimeshift(new Date());
  const totalTime = endDate - startDate;
  const pastTime = now - startDate;
  const timeLeft = totalTime - pastTime;
  const percentage = Math.round((timeLeft * 100) / totalTime);

  const { daysLeft, hoursLeft, minutesLeft, secondsLeft } = useCountdown(dates?.dateRange?.endDate);

  if (error) {
    console.log(error);
    return null;
  }

  return (
    <>
      {product && isDiscontinued === "false" && startDate - now <= 0 && endDate - now > 0 && (
        <div className={`${handles.countdownContainer} w-100`}>
          <p className={`${handles.countdownText} c-action-primary t-body b`}>
            {intl.formatMessage({ id: "store/promo-countdown.expires" }, { promoName: dates?.dateRange?.name ?? "" })}
            {daysLeft}
            {intl.formatMessage({ id: "store/promo-countdown.days" })}
            {hoursLeft}
            {intl.formatMessage({ id: "store/promo-countdown.hours" })}
            {minutesLeft}
            {intl.formatMessage({ id: "store/promo-countdown.minutes" })}
            {secondsLeft}
            {intl.formatMessage({ id: "store/promo-countdown.seconds" })}
          </p>
          <div className={`${handles.countdownBar} br1 overflow-hidden bg-muted-3`}>
            <div style={{ width: `${percentage}%` }} className={`${handles.countdownBarTimeLeft} h-100 bg-action-primary`}></div>
          </div>
        </div>
      )}
    </>
  );
};

PromoCountdown.schema = {
  title: "Promo Countdown",
  description: "Countdown for promos with start and end dates",
  type: "object",
  properties: {},
};

export default PromoCountdown;
