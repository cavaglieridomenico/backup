import React from "react";
import { PriceContextProvider } from "./context/PriceContext";
import PriceWrapper from "./PriceWrapper";

interface PriceContainerProps {
  showStar: boolean;
  isPdp: boolean;
}

const PriceContainer: React.FC<PriceContainerProps> = ({
  showStar = true,
  isPdp = false,
}) => {
  return (
    <PriceContextProvider>
      <PriceWrapper showStar={showStar} isPdp={isPdp} />
    </PriceContextProvider>
  );
};

export default PriceContainer;
