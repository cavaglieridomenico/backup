import { faqEntity, faqGroupEntity } from './globalConst'

//CREATES URL FROM NAME
export const URLcheck = (payload: any) => {
  let url = payload.name?.toLowerCase()?.replace(/[\s']/g, "-")?.replace(/[?.,:;]/g, "");
  url = avoidSpecial(url);
  payload.url = url;
}

//AVOID SPECIAL CHARACTERS
export function avoidSpecial(name: string) {
  name = name.replace(/ä/g, "ae");
  name = name.replace(/ö/g, "oe");
  name = name.replace(/ü/g, "ue");
  name = name.replace(/ß/g, "ss");
  name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return name;
}

//Vtex update id check didn't work so I'ce created it
export const searchForId = async (ctx: Context, payload: any, entity: string): Promise<boolean> => {
  let result = await ctx.clients.masterdata.searchDocuments<any>({
    dataEntity: entity,
    fields: ["id"],
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `id=${payload.id}`
  })
  if (!result[0]) {
    return false
  } else {
    return true
  }
}

// Check if there is an existing category id
export const checkCategory = async (ctx: Context, payload: any): Promise<boolean> => {
  return ctx.clients.masterdata.searchDocuments<any>({
    dataEntity: faqEntity,
    fields: ["id", "name"],
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `id=${payload.category}`, //the field payload.category = id of a category (if true)
  }).then((res) => res.length > 0 ? res[0].name : null).catch(() => null)
}

// Check if there is an existing groups id
export const checkGroup = async (ctx: Context, payload: any): Promise<boolean> => {
  return ctx.clients.masterdata.searchDocuments<any>({
    dataEntity: faqGroupEntity,
    fields: ["id", "fatherCategory", "name"],
    pagination: {
      page: 1,
      pageSize: 1
    },
    where: `id=${payload.group} AND fatherCategory=${payload.category}`,
    schema: "question_groups"
  }).then((res) => res.length > 0 ? res[0].name : null).catch(() => null)
}

export const featuredFrom = (payload: any) => {
  if (payload.featuredFrom === true) {
    const today = new Date();
    return payload.featuredFrom = today.toISOString();
  } else {
    return payload.featuredFrom = undefined;
  }//    DEVO CERCARE IL GRUPPO ASSOCIATO ALLA CATEGORY E PROVARE A MANDARLA IN PAYLOAD
}

export const rieuhue = (group: string, category: string) => {
  if (group && !category)
    return `group=${group}`
  else if (category && !group)
    return `category=${category}`
  else if (group && category)
    return `group=${group} AND category=${category}`
  else return ""
}

export const searchingFaqCondition = (searchField: string) => {
  let arr = searchField.split(" ");
  return arr
}

