// const graphQLRoutes = require("./itcc_routes.json");
const fetch = require("node-fetch");
const fs = require("fs");
const { join } = require("path");
const getInternalRoutesGraphQL = require("./getInternalRoutesGraphQL");

const pageSize = 50;

const [, , VtexIdclientAutCookie] = process.argv;

//QUALITYS
const appKey = "vtexappkey-itccwhirlpool-HXTAXT";
const appToken =
  "BPPZRJKUKXIIPOFRBARNUZAVRWOSUZVTBISIYJQIRRCQNZOUTFPQIYFQMUCMKLBUSALZQXHHIXRVLJKDOVKDROFDHJSVSOKCWRNELASBODEUTECGCULZFTNQVHQMMIIX";
const account = "itccwhirlpool";

let options = {
  method: "GET",
  headers: {
    "X-VTEX-API-AppKey": appKey,
    "X-VTEX-API-AppToken": appToken,
    "Content-Type": "application/json",
  },
};

const salesChannelsBindingsAssociations = [
  {
    binding: "epp.whirlpoolgroup.it/",
    salesChannel: 1,
    cluster: "EPP",
    id: "8c0ae00c-9903-4189-92d7-2043fbb70eb9",
  },
  {
    binding: "ff.whirlpoolgroup.it/",
    salesChannel: 2,
    cluster: "FF",
    id: "0a4ac151-c0f1-4d4b-be7d-2a741ba24be8",
  },
  {
    binding: "vip.whirlpoolgroup.it/",
    salesChannel: 3,
    cluster: "VIP",
    id: "33164ac5-6a19-4489-9d5c-4d88fb918f95",
  },
  {
    binding: "itccwhirlpool.myvtex.com/",
    salesChannel: 4,
    cluster: "O2P",
    id: "eb8f723f-d6b9-4db7-b33e-bbcf189fe943",
  },
];

async function main() {
  let internalRoutes = [];
  if (fs.existsSync("./results/itccInternalRewrites.json")) {
    internalRoutes = require("./results/itccInternalRewrites.json");
    console.log("Internal routes read from file!!");
  } else {
    let internalRoutesGraphQL =
      await getInternalRoutesGraphQL.getListInternalRoutesFromGraphQL(
        appKey,
        appToken,
        VtexIdclientAutCookie
      );
    console.log("Internal routes export completed!!");
    writeToFile(JSON.stringify(internalRoutesGraphQL), "itccInternalRewrites");
    internalRoutes = internalRoutesGraphQL;
  }
  console.log("OTTENUTO LE INTERNAL ROUTES");

  let routesPerBinding = getRoutesPerBinding(internalRoutes);
  writeToFile(JSON.stringify(routesPerBinding), "routesPerBindings");

  fetchActiveProducsSlugs().then((skuInfos) => {
    writeToFile(JSON.stringify(skuInfos), "skuInfos");

    let wrongRoutes = {};
    salesChannelsBindingsAssociations.forEach((assoc) => {
      wrongRoutes[assoc.cluster] = [];
    });

    console.log("initial wrongRoutes: ", wrongRoutes);

    skuInfos.forEach((slug) => {
      salesChannelsBindingsAssociations.forEach((assoc) => {
        if (slug.sku == "2") {
          console.log("Slug with sku = 2: ", slug);
          console.log("slug.salesChannels: ", slug.salesChannels);
          console.log("assoc.salesChannel: ", assoc.salesChannel);
          console.log(
            "condition: ",
            slug.salesChannels.includes(assoc.salesChannel)
          );
        }
        if (
          routesPerBinding[assoc.binding].includes(slug.slug) &&
          slug.salesChannels.includes(assoc.salesChannel)
        ) {
          console.log(slug);
          wrongRoutes[assoc.cluster].push(slug.slug);
        }
      });
    });

    Object.keys(wrongRoutes).forEach((cluster) => {
      writeToFile(
        JSON.stringify(wrongRoutes[cluster]),
        "wrongRoutes_" + cluster
      );
    });
  });
}

async function fetchActiveProducsSlugs(pageNumber = 1) {
  let skuIds = await fetch(
    `https://${account}.myvtex.com/api/catalog_system/pvt/sku/stockkeepingunitids?page=${pageNumber}&pageSize=${pageSize}`,
    options
  ).then((res) => res.json());

  let slugs = [];
  let skuDetailsPromises = skuIds.map((skuId) =>
    fetch(
      `https://${account}.myvtex.com/api/catalog_system/pvt/sku/stockkeepingunitbyid/${skuId}`,
      options
    )
  );

  try {
    let skuDetailsGETResponses = await Promise.all(skuDetailsPromises);

    for (skuDetailsGET of skuDetailsGETResponses) {
      let skuDetails = await skuDetailsGET.json();
      if (skuDetails.IsActive && skuDetails.IsProductActive) {
        slugs.push({
          slug: skuDetails.DetailUrl,
          sku: skuDetails.Id,
          salesChannels: skuDetails.SalesChannels,
        });
      }
    }
    console.log(`batch ${pageNumber} completed`);
  } catch (ex) {
    console.log(`batch ${pageNumber} error`);
  }

  if (skuIds.length == pageSize) {
    return [...slugs, ...(await fetchActiveProducsSlugs(pageNumber + 1))];
  } else {
    return slugs;
  }
}

function getRoutesPerBinding(routes) {
  return routes.reduce((result, current) => {
    if (current.type != "notFoundProduct") return result;

    let binding = getBindingFromId(current.binding);
    if (typeof result[binding] === "undefined") {
      result[binding] = [current.from];
    } else {
      result[binding].push(current.from);
    }
    return result;
  }, {});
}

function getBindingFromId(bindingId) {
  return (
    salesChannelsBindingsAssociations.find((assoc) => assoc.id == bindingId)
      ?.binding || "unknown"
  );
}

function writeToFile(usersToString, filename, fileFormat = "json") {
  let appListWriteStream = fs.createWriteStream(
    join(".", "results", filename + "." + fileFormat)
  );
  appListWriteStream.write(usersToString);
  appListWriteStream.on("close", function () {
    console.log("File '%s.%s' created.", filename, fileFormat);
    appListWriteStream.end();
  });
  appListWriteStream.close();
}

main();
