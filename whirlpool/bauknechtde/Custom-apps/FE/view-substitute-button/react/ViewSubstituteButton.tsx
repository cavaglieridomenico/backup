import React from "react";
import { useProduct } from "vtex.product-context";
import styles from "./style.css";
import { usePixel } from "vtex.pixel-manager";

interface ViewSubstituteButtonProps {
  SubstituteText: string;
  isPdp: boolean;
  isInBomPage: boolean;
}

const ViewSubstituteButton: StorefrontFunctionComponent<ViewSubstituteButtonProps> = ({
  SubstituteText = "ALTERNATIVEN",
  isPdp,
  isInBomPage,
}) => {
  const productContext = useProduct();
  const { push } = usePixel();

  const handlePushEvent = () => {
    //FUNREQUK12
    push({
      event: "seeSubstituteUkSpare",
      eventCategory: "seeSubstituteUkSpareSee Substitute",
      eventAction:
        productContext?.product?.productReference +
        " - " +
        productContext?.product?.productName,
    });
  };

  return (
    <a
      href={`/${
        productContext?.product?.properties?.filter(
          (e: any) => e.name == "linkTextSubstitute"
        )[0]?.values[0]
      }/p?jcode=${productContext?.product?.productReference}`}
      className={
        isPdp
          ? styles.viewSubstituteButtonPdp
          : !isInBomPage
          ? styles.viewSubstituteButton
          : styles.viewSubstituteButtonBomPage
      }
      onClick={(e) => {
        e.stopPropagation();
        handlePushEvent();
      }}
    >
      {SubstituteText}
    </a>
  );
};
ViewSubstituteButton.schema = {
  title: "ViewSubstituteButton",
  description: "View Substitute Button",
  type: "object",
  properties: {
    SubstituteText: {
      title: "Substitute Text",
      description: "Substitute Text",
      type: "string",
    },
  },
};
export default ViewSubstituteButton;
