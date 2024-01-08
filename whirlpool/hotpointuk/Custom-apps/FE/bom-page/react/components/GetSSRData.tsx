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
          <title>Spare Parts for Model {modelNumber} - {industrialCode} - Hotpoint </title>
          <meta name="description" content={`Get Hotpoint genuine parts for Model ${modelNumber} - ${industrialCode}. Restore your appliance and keep it running longer. Next day delivery available.`} />
        </Helmet>
      )}


    </>
  );
};
export default GetSSRData;
