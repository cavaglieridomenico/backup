import React from "react";
import Helmet from "react-helmet";

interface props {
  industrialCode: string;
  modelNumber: string;
  ssrFor: string
}

const GetSSRData: StorefrontFunctionComponent<props> = ({
  industrialCode,
  modelNumber,
  ssrFor = "meta"
}) => {


  return (
    <>


      {ssrFor && ssrFor === "meta" && (
        <Helmet>
          <meta charSet="utf-8" />
          <title>Ersatzteile für Modell {modelNumber} - {industrialCode} - Bauknecht </title>
          <meta name="description" content={`Kaufen Sie hier Original Ersatzteile für Modell ${modelNumber} - ${industrialCode}. Setzen Sie Ihr Gerät instand und verlängern Sie seine Lebendauer.`} />
        </Helmet>
      )}


    </>
  );
};
export default GetSSRData;
