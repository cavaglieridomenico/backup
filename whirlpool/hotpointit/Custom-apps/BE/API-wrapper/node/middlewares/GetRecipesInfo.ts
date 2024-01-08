import { } from "../utils/constants";

/**
 * Get all recipes found in RI masterData and map they in FE format expected
 * @param ctx context (contains limit parameter)
 * @param next
 */
export async function GetRecipesList(ctx: Context, next: () => Promise<any>) {

  let limit = +ctx.query.limit
  limit = isNaN(limit) ? 100 : limit;

  try {
    let md_ri_1 = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "RI",
      fields: ['id', 'description', 'typeRC', 'categoryRC', 'name', 'levelRC', 'preparationTimeRC', 'imageDesktop', 'imageMobile'],
      pagination: {
        page: 1,
        pageSize: limit
      }
    });

    ctx.body = mapRecipesListInfo(md_ri_1);
    ctx.set("Cache-Control", "no-store");
    ctx.status = 200;
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next()
}



export async function GetRecipeDetails(ctx: Context, next: () => Promise<any>) {

  try {
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


    let md_dr_1: any = await ctx.clients.masterdata.searchDocuments({
      dataEntity: "DR",
      fields: ['idRecipes', 'imageDevice', 'imageType', 'imageURL'],
      pagination: {
        page: 1,
        pageSize: 100
      }
      , where: `idRecipes=${ctx.query.recipeId} AND imageType<>'CARD'`
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


    ctx.set("Cache-Control", "no-store");
    ctx.body = _body
    ctx.status = 200;
  } catch (err) {
    console.log(err);
    ctx.status = 500;
    ctx.body = "Internal Server Error";
  }
  await next()
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

  console.log()

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
