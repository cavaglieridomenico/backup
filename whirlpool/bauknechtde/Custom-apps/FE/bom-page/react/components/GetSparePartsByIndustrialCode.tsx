import React, { useEffect } from "react";

import spareParts from "../../graphql/sparePartsByIndustrialCode.graphql";
import { useLazyQuery } from "react-apollo";

interface props {
  industrialCode: string;
  pageSize: number;
  page: number;
  familyGroup: String;
  onSpareCodesQueryDone: any;
  filter: any
}

const GetSparePartsByIndustrialCode: StorefrontFunctionComponent<props> = ({

  pageSize = 9,
  page = 1,
  onSpareCodesQueryDone,
  filter
}) => {
  const [getSpareParts, { data }] = useLazyQuery(spareParts, {
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    getSpareParts({
      variables: {
        page,
        pageSize,
        filter
      },
    });
  }, [page, filter]);

  useEffect(() => {
    onSpareCodesQueryDone(data);
  }, [data]);

  return <></>;
};
export default GetSparePartsByIndustrialCode;
