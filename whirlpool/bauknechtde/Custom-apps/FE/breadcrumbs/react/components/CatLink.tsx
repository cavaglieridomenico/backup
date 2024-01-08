import React from "react";
import style from "../style.css";

interface catLinkInterface {
  labelLink: string;
  hrefLink: string;
}
const CatLink: StorefrontFunctionComponent<catLinkInterface> = ({
  labelLink,
  hrefLink,
}) => {
  return (
    <>
      <a className={style.catLink} href={hrefLink}>
        {labelLink}
      </a>
      <img
        className={style.arrowImg}
        src={
          "https://hotpointuk.vtexassets.com/assets/vtex/assets-builder/hotpointuk.hotpoint-theme/1.0.32/arrowIconBread___a656b762fc2fb83036cf9d96da6f14a0.svg"
        }
        alt="Breadcrumb arrow icon"
        width="8"
        height="8"
      />
    </>
  );
};
export default CatLink;
