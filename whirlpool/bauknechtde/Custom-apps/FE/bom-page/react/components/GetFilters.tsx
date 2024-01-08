import React, { useEffect } from "react";

import getFilters from "../../graphql/getFilters.graphql";
import { useLazyQuery } from "react-apollo";

interface props {
  industrialCode: string,
  onQueryDone: any
}

const GetFilters: StorefrontFunctionComponent<props> = ({
  industrialCode,
  onQueryDone
}) => {
  const [getFinishedGood, { data }] = useLazyQuery(getFilters, {
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
      onQueryDone(data["getFamilyGroup"]);
    }
  }, [data]);

  return <></>;
};
export default GetFilters;
