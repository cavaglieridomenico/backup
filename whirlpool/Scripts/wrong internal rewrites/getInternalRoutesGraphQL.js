const fetch = require("node-fetch");

const graphQLRewriterEndpoint =
  "https://itccwhirlpool.myvtex.com/_v/private/admin-graphql-ide/v0/vtex.rewriter@1.56.5";

const getGraphQLQueryOptions = (appKey, appToken, VtexIdclientAutCookie) => ({
  method: "POST",
  headers: {
    "X-VTEX-API-AppKey": appKey,
    "X-VTEX-API-AppToken": appToken,
    "Content-Type": "application/json",
    Cookie: `VtexIdclientAutCookie=${VtexIdclientAutCookie}`,
  },
});

const getGraphQLBody = (next = null) =>
  JSON.stringify({
    query: `query ${next ? "($next:String)" : ""}{ 
              internal { 
                listInternals ${next ? "(next:$next)" : ""}{ 
                  routes { 
                    from
                    type
                    resolveAs
                    binding
                  } 
                  next 
                }
              }
            }`,
    variables: next ? { next: next } : null,
  });

const getListInternalRoutesFromGraphQL = async (
  appKey,
  appToken,
  VtexIdclientAutCookie,
  next = null,
  iteration = 1
) => {
  let returnedRoutes = [];
  const res = await fetch(graphQLRewriterEndpoint, {
    ...getGraphQLQueryOptions(appKey, appToken, VtexIdclientAutCookie),
    body: getGraphQLBody(next),
  })
    .then((res) => res.json())
    .then((jsonRes) => jsonRes?.data?.internal?.listInternals || []);

  returnedRoutes.push(...(res.routes || []));
  console.log(`Iteration ${iteration} completed`);

  if (!res.next) {
    return [...returnedRoutes];
  } else {
    return [
      ...returnedRoutes,
      ...(await getListInternalRoutesFromGraphQL(
        appKey,
        appToken,
        VtexIdclientAutCookie,
        res.next,
        iteration + 1
      )),
    ];
  }
};

module.exports = { getListInternalRoutesFromGraphQL };
