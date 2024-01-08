import React, { useEffect } from "react";

import getFamilyGroup from "./graphql/getFamilyGroup.graphql";
import { useLazyQuery } from "react-apollo";

interface props {
  industrialCode: string,
  onQueryDone: any
}

const GetCategories: StorefrontFunctionComponent<props> = ({
  industrialCode,
  onQueryDone
}) => {
  const [getFinishedGood, { data }] = useLazyQuery(getFamilyGroup, {
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    getFinishedGood({
        variables: {
          industrialCode
          },
    });
  }, [industrialCode]);

  useEffect(() => {
    if(data){
      onQueryDone(data["getFamilyGroup"]["familyGroup"]);
    }
  }, [data]);

  return <></>;
};
export default GetCategories;
