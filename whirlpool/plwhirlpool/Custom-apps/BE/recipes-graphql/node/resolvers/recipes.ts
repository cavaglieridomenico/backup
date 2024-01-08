import { LRUCache, MasterData } from "@vtex/api";
import { Facet, RecipeQuery, FacetsId } from "../typings/Recipes";
import {RECIPES_ENTITY,RECIPES_FILTERS_FIELDS,RECIPES_MD_FIELDS,CORRELATED_LIMIT,RECIPES_FILTERS_TYPES} from "../utils/constants";
import { CustomLogger } from "../utils/Logger";

const facetCache = new LRUCache<string, Facet[]>({ max: 1 });
const facetIdCache = new LRUCache<string, FacetsId>({ max: 1 })

interface ScrollInput {
  dataEntity: string;
  fields: string[];
  schema?: string;
  sort?: string;
  size?: number;
  mdToken?: string;
}

export const queryRecipes = async (
  _: any,
  params: RecipeQuery,
  ctx: Context
) => {
  ctx.vtex.logger = new CustomLogger(ctx);
  try {
    initializeQueryParamsIfEmpty(params);
    let whereCondition: string = buildMasterDataQuery(params);
    let recipes: any = await ctx.clients.masterdata.searchDocumentsWithPaginationInfo(
      {
        dataEntity: RECIPES_ENTITY,
        fields: RECIPES_MD_FIELDS,
        where: whereCondition,
        pagination: {
          pageSize: params.query.pageSize,
          page: params.query.pageNumber,
        },
      }
    );


    let responseMessage = {
      facets: await getFacetsFromCache(ctx.clients.masterdata),
      recipes: recipes.data.map((r: any) => convertMdRecipeToGraphQlRecipe(r, ctx.clients.masterdata)
      ),
      facetsId : await getFacetsIdFromCache(ctx.clients.masterdata),
      page: {
        pageSize: recipes.pagination.pageSize,
        pageNumber: recipes.pagination.page,
        totalRowCount: recipes.pagination.total,
      },
    };
    ctx.body = "OK";
    ctx.status = 200;
    ctx.vtex.logger.info(
      `GraphQL query to recipes OK --data: ${JSON.stringify(responseMessage)}`
    );
    return responseMessage;
  } catch (err) {
        ctx.body = "Internal Server Error";
        ctx.status = 500;
        //console.log(err)
        ctx.vtex.logger.error("Internal Server Error: " + JSON.stringify(err));
        return err;
  }
};

function initializeQueryParamsIfEmpty(params: RecipeQuery) {
  if (
    typeof params.query.pageSize === "undefined" || params.query.pageSize <= 0) {
    params.query.pageSize = 15;
  }
  if (typeof params.query.pageNumber === "undefined" ||params.query.pageNumber <= 0
  ) {
    params.query.pageNumber = 1;
  }
}

function buildMasterDataQuery(params: RecipeQuery): string {
  let whereCondition = "";
  let whereParams = new Map<string, string[]>();

  if (typeof params.query.facets !== "undefined" &&params.query.facets.length > 0) {
    params.query.facets.forEach((facet: Facet) => {
      if (whereParams.has(facet.name)) {
        let values: string[] | undefined = whereParams.get(facet.name);
        facet.values.forEach((fv: string) => values?.push(fv));
      } else {
        whereParams.set(facet.name, JSON.parse(JSON.stringify(facet.values)));
      }
    });
  }

  whereParams.forEach((values: string[], key: string) => {
    let appendQuery = whereCondition === "" ? "(" : " AND (";
    values.forEach((v: String) => {
      key === "mainIngredients" ? (v = `*${v}*`) : v;
      appendQuery += `${key} = '${v}' OR `;
    });
    appendQuery = appendQuery.substring(0, appendQuery.length - 3) + ")";
    whereCondition += appendQuery;
  });
  return whereCondition;
}

function convertMdRecipeToGraphQlRecipe(mdRecipe: any, masterdata: MasterData) {
  return {
    id: mdRecipe.id,
    name: mdRecipe.name,
    type: mdRecipe.type,
    idType: mdRecipe.idType,
    category: mdRecipe.category,
    preparationTime: mdRecipe.preparationTime,
    cookTime: mdRecipe.cookTime,
    chefplusTime: mdRecipe.chefplusTime,
    supremeChefTime: mdRecipe.supremeChefTime,
    imageDesktop: decodeURI(mdRecipe.imageDesktop),
    imageMobile: decodeURI(mdRecipe.imageMobile),
    imageCard: decodeURI(mdRecipe.imageCard),
    description: mdRecipe.description,
    mainIngredients: mdRecipe.mainIngredients?.split("|").map((s: String) => s.trim()),
    ingredients: mdRecipe.ingredients.split("|").map((s: String) => s.trim()),
    steps: mdRecipe.steps.split("|").map((s: String) => s.trim()),
    images: mdRecipe.images?.split("|").map((s: String) => decodeURI(s.trim())),
    relatedRecipes: getCorrelated(masterdata, mdRecipe),
  };
}

async function getCorrelated(masterdata: MasterData, mdRecipe: any) {
  let recipes: any = await masterdata.searchDocuments({
    dataEntity: RECIPES_ENTITY,
    fields: ["id", "type"],
    where: `type='${mdRecipe.type}' AND id<>'${mdRecipe.id}'`,
    pagination: {
      pageSize: CORRELATED_LIMIT,
      page: 1,
    },
  });
  return recipes.map((c: any) => {
    return c.id;
  });
}

async function getFacetsFromCache(masterData: MasterData): Promise<void | Facet[]> {
  let facetResponse: void | Facet[];

  if (facetCache.has("facets")) {
    facetResponse = facetCache?.get("facets");
  } else {
    console.log("FACETS are not in cache. Computing them from MD");
    facetResponse = await calculateFacets(masterData);
    if (typeof facetResponse !== "undefined") {
      let facetVal: Facet[] = facetResponse;
      facetCache.set("facets", facetVal);
    }
  }
  return facetResponse;
}

async function calculateFacets(masterData: MasterData): Promise<void | Facet[]> {
  let dataEntity: ScrollInput = {
    dataEntity: RECIPES_ENTITY,
    fields: RECIPES_FILTERS_FIELDS,
    size: 100,
  };
  const facets: Map<string, Set<string>> = new Map();
  let mdResponse: any = await masterData.scrollDocuments(dataEntity);
  let facetValue = null;
  while (mdResponse.data.length > 0) {
    dataEntity.mdToken = mdResponse.mdToken;
    mdResponse.data.forEach((entity: any) => {
      RECIPES_FILTERS_FIELDS.forEach((facetName) => {
        facetValue = entity[facetName];
        if (!facets.has(facetName)) {
          facets.set(facetName, new Set<string>());
        }
        if (facetValue != null) {
          facets.get(facetName)?.add(facetValue);
        }
      });
    });
    mdResponse = await masterData.scrollDocuments(dataEntity);
  }

  let facetResponse: Facet[] = [];
  facets.forEach((value: Set<string>, key: string) => {
    facetResponse.push({
      name: key, //Inserire qui il mapping dei nomi delle facet
      values: [...value],
    });
  });
  return facetResponse;
}

async function calculateFacetsId(masterData: MasterData): Promise<void | FacetsId> {
  let dataEntity: ScrollInput = {
    dataEntity: RECIPES_ENTITY,
    fields: RECIPES_FILTERS_FIELDS,
    size: 100,
  };

  const facets: FacetsId = [];
  let mdResponse: any = await masterData.scrollDocuments(dataEntity);

  while (mdResponse.data.length > 0) {
    dataEntity.mdToken = mdResponse.mdToken;
    mdResponse.data.forEach((entity: any) => {
      if (facets.find((f) => f.id === entity.idType) === undefined){
        facets.push({
          name: entity[RECIPES_FILTERS_TYPES[0]],
          id: entity[RECIPES_FILTERS_TYPES[1]],
        });
        }
    });
    mdResponse = await masterData.scrollDocuments(dataEntity);
  }
  return facets;
}

async function getFacetsIdFromCache(masterData: MasterData): Promise<void | FacetsId> {
  let facetResponse: void | FacetsId;

  if (facetIdCache.has("facetsId")) {
    facetResponse = facetIdCache?.get("facetsId");
  } else {
    console.log("FACETS are not in cache. Computing them from MD");
    facetResponse = await calculateFacetsId(masterData);
    if (typeof facetResponse !== "undefined") {
      let facetVal: FacetsId = facetResponse;
      facetIdCache.set("facetsId", facetVal);
    }
  }
  return facetResponse;
}
