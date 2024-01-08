import { LINKED } from "@vtex/api";

const germanyNormalizationMap: any[] = [
  { from: "Ü", to: "UE" },
  { from: "Ä", to: "AE" },
  { from: "Ö", to: "OE" },
  { from: "É", to: "E" }
];


/**
 * Get all recipes found in RI masterData and map they in FE format expected
 * @param ctx context (contains limit parameter)
 * @param next
 */
export async function GetRecipesList(ctx: Context, next: () => Promise<any>) {

  let limit = +ctx.query.limit
  limit = isNaN(limit) ? 100 : limit;
  LINKED && ctx.set("Cache-Control", "no-store");

  try {
    let md_ri_1 = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "RI",
      fields: ['id', 'description', 'typeRC', 'categoryRC', 'name', 'levelRC', 'preparationTimeRC', 'imageDesktop', 'imageMobile'],
      pagination: {
        page: 1,
        pageSize: limit
      },
      sort: "createdIn DESC"
    });

    ctx.body = mapRecipesListInfo(md_ri_1);
    ctx.status = 200;
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next()
}

function normalizeNameForGerman(text: string): string {
  let normalizedText: string = text;
  germanyNormalizationMap.forEach(replacement => {
    let regex = new RegExp(replacement.from.trim(), "g");
    normalizedText = normalizedText.replace(regex, replacement.to);
  });
  return normalizedText;
}

async function rdManageRecipeId(ctx: Context) {

  let md_ri_1: any = await ctx.clients.masterdata.searchDocuments({

    dataEntity: "RI",
    fields: [
      'id', 'name', 'description', 'subDescription', 'preparationTime',
      'cookTime', 'level', 'ingredients', 'steps', 'peoples', 'typeRC'
    ],
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `id=${ctx.query.recipeId}`

  });

  return md_ri_1

}

async function rdManageRecipeNameNormalized(ctx: Context) {

  let allRecipes: any = await ctx.clients.masterdata.searchDocuments({

    dataEntity: "RI",
    fields: [
      'id', 'name', 'description', 'subDescription', 'preparationTime',
      'cookTime', 'level', 'ingredients', 'steps', 'peoples', 'typeRC'
    ],
    pagination: {
      page: 1,
      pageSize: 100
    }

  });

  let md_ri_1: any = []

  for (let i = 0; i < allRecipes.length; i++) {

    let recipe = allRecipes[i]

    // normalize the name of the recipe from the MasterData
    let recipeNameNormalized = normalizeNameForGerman(recipe.name).toLowerCase().replace(/\s/g, '-')
    // let receivedNameNormalized = normalize(ctx.query.recipeNameNormalized).toLowerCase().replace(/\s/g, '-')

    // compare the nameNormalized here with the string received in INPUT
    if (recipeNameNormalized == ctx.query.recipeNameNormalized) {

      console.log(recipe)
      // insert the recipe into the array
      md_ri_1.push(recipe)
      break;

    }

  }

  return md_ri_1

}

/**
 * The search will be performed through the recipe Name Normalized or the recipe ID:
 * - by passing the recipeId parameter, the search will be performed over the recipe identifier
 * - by passing the recipeNameNormalized parameter, the search will be performed over the recipe name normalized from the MasterData
 *
 * @param ctx it will contain the recipe name normalized
 * @param next
 *
 */
export async function GetRecipeDetails(ctx: Context, next: () => Promise<any>) {

  LINKED && ctx.set("Cache-Control", "no-store");
  try {

    let md_ri_1: any = []

    // manage recipe Id in input
    if (ctx.query.recipeId && ctx.query.recipeId.length > 0)
      md_ri_1 = await rdManageRecipeId(ctx)

    // manage recipe Normalized Name in input
    else if (ctx.query.recipeNameNormalized && ctx.query.recipeNameNormalized.length > 0)
      md_ri_1 = await rdManageRecipeNameNormalized(ctx)

    else {

      // manage input error
      ctx.status = 500;
      ctx.body = "No right parameter input fields were used. You can request the recipe's details by passing the recipeId or the recipeNameNormalized string";

      await next()
      return

    }

    if (md_ri_1.length == 0) {

      // manage input error
      ctx.status = 404;
      ctx.body = "No recipe was found";

      await next()
      return

    }

    let md_dr_1: any = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "DR",
      fields: ['idRecipes', 'imageDevice', 'imageType', 'imageURL'],
      pagination: {
        page: 1,
        pageSize: 100
      }
      , where: `idRecipes=${md_ri_1[0]["id"]} AND imageType<>'CARD'`
    });

    console.log(`typeRC=${md_ri_1[0]["typeRC"]} AND id<>${md_ri_1[0]["id"]}`)

    let md_ri_related = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "RI",
      fields: ['id', 'description', 'typeRC', 'categoryRC', 'name', 'levelRC', 'preparationTimeRC', 'imageDesktop', 'imageMobile'],
      pagination: {
        page: 1,
        pageSize: 100
      }
      , where: `typeRC='${md_ri_1[0]["typeRC"]}' AND id<>${md_ri_1[0]["id"]}`
    });

    let _body = mapRecipeDetailInfo(md_ri_1[0], md_dr_1, md_ri_related);

    ctx.body = _body
    ctx.status = 200;

  } catch (err) {

    console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";

  }

}


/**
 * Mapping of RI MasterData info into JSON for FE.
 * @param json json to map
 * @returns json mapped
 */
function mapRecipesListInfo(json: any): Object {
  var data: any;
  var list = []
  for (var element of json) {
    data = {
      id: element["id"],
      description: element["description"],
      imageDesktop: element["imageDesktop"],
      imageMobile: element["imageMobile"],
      type: element["typeRC"],
      category: element["categoryRC"],
      name: element["name"],
      nameNormalized: normalizeNameForGerman(element["name"]).toLowerCase().replace(/\s/g, '-'),
      level: element["levelRC"],
      preparationtime: element["preparationTimeRC"],
    }
    list.push(data);
  }
  return list;
}



function mapRecipeDetailInfo(RIjson: any, DRListjson: any, RIListJsonRelated: any): any {

  //Fare ciclo su DRjson per estrarre le due immagini (desktop e mobile) del MAIN e quelli di DETAILS

  //Per ogni id prendere le immagini in DR con stesso idRecipes e con type = main
  //Per ogni id prendere le immagini in DR con stesso idRecipes e con type = details
  //Nel json di 2° livello prendere tutti gli id in RI con id <> id in esame AND type = type in esame
  var data: any;
  var imageList = [];

  for (var json of DRListjson) {
    if (json["imageType"] == 'MAIN' && json["imageDevice"] == 'DESKTOP') {
      var mainImageDesktop = json["imageURL"];
    } else if (json["imageType"] == 'MAIN' && json["imageDevice"] == 'MOBILE') {
      var mainImageMobile = json["imageURL"];
    } else if (json["imageType"] == '') {
      imageList.push(json["imageURL"]);
    }
  }

  data = {
    id: RIjson["id"],
    name: RIjson["name"],
    description: RIjson["description"],
    subdescription: RIjson["subDescription"],
    mainimageDesktop: mainImageDesktop,
    mainimageMobile: mainImageMobile,
    imageList: imageList,
    preparationtime: RIjson["preparationTime"],
    cooktime: RIjson["cookTime"],
    type: RIjson["type"],
    level: RIjson["level"],
    relatedItems: mapRecipesListInfo(RIListJsonRelated),
    ingredients: {
      list: RIjson["ingredients"].split("|").map(function (obj: any) {
        return obj.trimLeft().trimRight();
      })
    },
    steps: {
      list: RIjson["steps"].split("|").map(function (obj: any) {
        return obj.trimLeft().trimRight();
      })
    },
    peoples: RIjson["peoples"],
  }
  return data;
}
