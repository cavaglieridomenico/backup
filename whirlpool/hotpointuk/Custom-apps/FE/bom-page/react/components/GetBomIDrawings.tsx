import React, { useEffect } from "react";

import getBomDrawings from "../../graphql/getBomDrawings.graphql";
import { useLazyQuery } from "react-apollo";

interface props {
  industrialCode: string,
  onQueryDone: any
}

const GetBomIDrawings: StorefrontFunctionComponent<props> = ({
  industrialCode,
  onQueryDone
}) => {
  const [getFinishedGoodImage, { data }] = useLazyQuery(getBomDrawings, {
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    getFinishedGoodImage({
        variables: {
          industrialCode
          },
    });
  }, [industrialCode]);

  useEffect(() => {
    if(data){
      onQueryDone(data["getBomImage"]);
    }
  }, [data]);

  return <></>;
};
export default GetBomIDrawings;
