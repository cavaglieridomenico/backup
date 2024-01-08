
import React, { useEffect } from "react";

import getSpareInBom from "../../graphql/getSpareInBom.graphql";
import { useLazyQuery } from "react-apollo";

interface props {
  referenceNumber: string,
  bomId: string,
  industrialCode: string,
  onQueryDone: any
}

const GetSparePartsInBom: StorefrontFunctionComponent<props> = ({
    referenceNumber,
    bomId,
  onQueryDone,
  industrialCode
}) => {
  const [getSpares, { data }] = useLazyQuery(getSpareInBom, {
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
   if(referenceNumber && bomId){
    getSpares({
        variables: {
            referenceNumber,
            bomId,
            industrialCode
          },
    });
   }
  }, [referenceNumber, bomId]);

  useEffect(() => {
    if(data){
      onQueryDone(data["getJcodeForBom"].map(
        (spare: any) => {return {id: spare.sparePartId , reference: spare.referenceNumber}}      
      ));
    }
  }, [data]);

  return <></>;
};
export default GetSparePartsInBom;
