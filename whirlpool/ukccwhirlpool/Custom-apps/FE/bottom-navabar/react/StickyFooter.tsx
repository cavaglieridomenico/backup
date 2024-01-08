import React from "react";
import StickyFooterStyle from "./StickyFooter.module.css";
import {
  homeIcon,
  // favouritesIcon,
  // catalogIcon,
  profileIcon,
  supportIcon,
  // serviceIcon,
  serviceIcon2,
} from "./vectors/vectors";

interface StickyFooterProps {
  Minicart: any;
}

const StickyFooter: StorefrontFunctionComponent<StickyFooterProps> = ({
  Minicart,
}) => {
  //set to 850 instead of 600 for landscape
  const mobileMediaQuery = window.innerWidth < 850;
  const homeIconSvg = Buffer.from(homeIcon).toString("base64");
  // const favouritesIconSvg = Buffer.from(favouritesIcon).toString("base64");
  // const catalogIconSvg = Buffer.from(catalogIcon).toString("base64");
  const profileIconSvg = Buffer.from(profileIcon).toString("base64");
  const serviceIconSvg = Buffer.from(serviceIcon2).toString("base64");
  const supportIconSvg = Buffer.from(supportIcon).toString("base64");
  // const handleDispatch = (dispatchOpenModal: boolean) => {
  //   const event = new CustomEvent("openModal", { detail: dispatchOpenModal });
  //   const catalogFooter = document.querySelector("#catalogFooter");
  //   catalogFooter!.dispatchEvent(event);
  // };
  return (
    <>
      {mobileMediaQuery ? (
        <div className={StickyFooterStyle.mobileStickyFooter}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              height: "100%",
            }}
          >
            <a
              href="/"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                style={{ width: "25px", height: "25px" }}
                src={`data:image/svg+xml;base64,${homeIconSvg}`}
              />
            </a>
            <a
              href="/account"
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                style={{ width: "25px", height: "25px" }}
                src={`data:image/svg+xml;base64,${profileIconSvg}`}
              />
              {/* <ConditionalLogin /> */}
            </a>
            {/* <div
              onClick={() => handleDispatch(true)}
              id="catalogFooter"
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                style={{ width: "25px", height: "25px" }}
                src={`data:image/svg+xml;base64,${supportIconSvg}`}
              />
            </div> */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "3px"
              }}
            >
              <a
                href="/support"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  style={{ width: "30px", height: "30px" }}
                  src={`data:image/svg+xml;base64,${supportIconSvg}`}
                />
              </a>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "3px"
              }}
            >
              <a
                href="/services"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <img
                  style={{ width: "30px", height: "30px" }}
                  src={`data:image/svg+xml;base64,${serviceIconSvg}`}
                />
              </a>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 25,
                  height: 25,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Minicart />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

StickyFooter.schema = {
  title: "editor.changechannel.title",
  description: "editor.changechannel.description",
  type: "object",
};

export default StickyFooter;
