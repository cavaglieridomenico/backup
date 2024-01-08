import React, { useEffect } from "react";
import style from "./style.css";
import { useProduct } from "vtex.product-context";
import { inStockIcon } from "./vectors/vectors";
import { useIntl } from "react-intl";
import { useRuntime } from "vtex.render-runtime";

interface ScMapping {
  [index: string]: string;
}
interface LeadTimeProp {
  accessoryName: string;
}

const LeadTime: StorefrontFunctionComponent<LeadTimeProp> = ({
  accessoryName = "accessories",
}) => {
  /*--- RUNTIME ---*/
  const { production } = useRuntime();

  /*--- INTL ---*/
  const intl = useIntl();

  /*--- UTILS ---*/
  const { product } = useProduct();

  const scMapping: ScMapping = {
    "1": "EPP",
    "2": "FF",
    "3": "VIP",
    "4": "O2P",
  };

  /*--- CONTS ---*/
  const salesChannel: string = window
    ? JSON.parse(
        Buffer.from(
          (window as any).__RUNTIME__.segmentToken,
          "base64"
        ).toString()
      ).channel
    : "4";

  const tradePolicy = scMapping[salesChannel];

  /*--- ICONS ---*/
  const iconInStock = `data:image/svg+xml;base64,${Buffer.from(
    inStockIcon
  ).toString("base64")}`;

  /*--- CONDITIONS ---*/
  const isAccessory = product?.categories?.some((cat: any) =>
    cat?.includes(accessoryName)
  );

  const isOutOfStock =
    product?.properties
      ?.filter((e: any) => e.name == `stockavailability${tradePolicy}`)[0]
      ?.values[0].toLowerCase() == "out of stock";

  const isSellable =
    product?.properties?.find(
      (spec: any) => spec.name == `sellable${tradePolicy}`
    )?.values[0] == "true";

  const leadTime = product?.properties?.find(
    (spec: any) => spec.name == `leadtime`
  )?.values[0];

  //Conditions to choose what label print
  const labelToPrint =
    isOutOfStock && isAccessory
      ? intl.formatMessage({ id: "store/lead-time.outOfStock" })
      : isOutOfStock
      ? leadTime
      : intl.formatMessage({ id: "store/lead-time.inStock" });

  useEffect(() => {
    console.log(product, "product");
  }, [product]);

  return (
    <>
      {(isSellable || !production) && (
        <div className={style.leadTimeContainer}>
          <div className={style.leadTimeWrapper}>
            {labelToPrint ==
              intl.formatMessage({ id: "store/lead-time.inStock" }) && (
              <img src={iconInStock} alt="icon" className={style.leadTimeImg} />
            )}
            <span className={style.leadTimeText}>{labelToPrint}</span>
          </div>
        </div>
      )}
    </>
  );
};

LeadTime.schema = {
  // title: 'editor.basicblock.title',
  // description: 'editor.basicblock.description',
  // type: 'object'
};

export default LeadTime;
