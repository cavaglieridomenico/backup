## [1.0.7] - 2023-09-01
 fixed issue in case of errors of this graphql call
~
    const { loading, error, data } = useQuery(products, {
      variables: {
        field: "id",
        values: ids,
      },
    });
~