import { faqEntity, faqGroupEntity } from './globalConst'
import { URLcheck, searchForId } from './functions'
export const getGroupsData = async (ctx: Context, page: number, pageSize: number) => {
  try {
    let res: any = await ctx.clients.masterdata.searchDocuments<any>({
      dataEntity: faqGroupEntity,
      fields: ["name", 'id'],
      pagination: {
        page: page || 1,
        pageSize: pageSize || 10
      },
      schema: 'question_groups',
    })
    ctx.body = "ok"
    ctx.status = 200;
    ctx.body = res;
    return res
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
    return null
  }
}

export const getGroupsByParentId = async (ctx: Context, id: string) => {
  try {
    let res: any = await ctx.clients.masterdata.searchDocuments<any>({
      dataEntity: faqGroupEntity,
      fields: ["name", 'id', "url", "image", "fatherCategory"],
      pagination: {
        page: 1,
        pageSize: 1000
      },
      schema: 'question_groups',
      where: `fatherCategory=${id}`
    })
    if (res[0]) {
      let categoryName = await findCategoryName(ctx, id)
      for (let el of res) {
        el.catName = categoryName
      }
      ctx.status = 200;
      ctx.body = res
      return res
    }
  } catch (e) {
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
    return null
  }
}

const findCategoryName = async (ctx: Context, id: string) => {
  let catName: any = await ctx.clients.masterdata.searchDocuments<any>({
    dataEntity: faqEntity,
    fields: ["name"],
    pagination: {
      page: 1,
      pageSize: 1
    },
    schema: 'categories',
    where: `id=${id}`
  })
  return catName[0]?.name
}


//IT JUST CREATES A FAQ GROUP
export const createFaqsGroup = async (ctx: Context, payload: any) => {
  try {
    URLcheck(payload);
    let parentCategoryName: any = await checkParentFaqID(ctx, payload)
    if (parentCategoryName) {
      let res = await ctx.clients.masterdata.createOrUpdateEntireDocument({
        dataEntity: faqGroupEntity,
        fields: {
          ...payload,
          fatherCategory: parentCategoryName.id
        },
        schema: 'question_groups'
      })
      if (res) {
        ctx.status = 200;
        ctx.body = {
          groupId: res.DocumentId,
          url: payload.url,
          catName: parentCategoryName.name
        }
        return true
      } else {
        ctx.status = 400;
        ctx.body = "Failed while trying to create the group"
        return false
      }
    } else {
      ctx.status = 400;
      ctx.body = "Wrong fatherCategory"
      return false;
    }
  } catch (e) {
    console.log(e);
    ctx.status = 500;
    ctx.body = "Internal Server Error"
    return false;
  }
}


//Check if id of group is actually an existing category ID
const checkParentFaqID = async (ctx: Context, payload: any): Promise<string> => {
  let result = await ctx.clients.masterdata.searchDocuments<any>({
    dataEntity: faqEntity,
    fields: ["name", "id"],
    pagination: {
      page: 1,
      pageSize: 1
    },
    schema: "categories",
    where: `id=${payload.fatherCategory}`
  })
  return result[0];
}


export const updateFaqGroup = async (ctx: Context, payload: any): Promise<boolean> => {
  if (!payload.fatherCategory) {
    if (payload.id) {
      if (!await searchForId(ctx, payload, faqGroupEntity)) {
        ctx.status = 400;
        ctx.body = "Wrong id, hasn't been able to update"
        return false
      } else {
        URLcheck(payload);
        return await ctx.clients.masterdata.updatePartialDocument({
          dataEntity: faqGroupEntity,
          id: payload.id,
          fields: payload
        }).then(() => {
          ctx.status = 200;
          ctx.body = "ok"
          return true
        }).catch(() => {
          ctx.status = 400;
          ctx.body = "Error while updating"
          return true
        })
      }
    } else {
      ctx.status = 400;
      ctx.body = "Id is missing, what should I update?"
      return false
    }
  } else {
    ctx.status = 400;
    ctx.body = "Cannot change the Group's Category"
    return false
  }
}


export const searchGroupsOfCategory = async (ctx: Context, id: any) => {
  let result = await ctx.clients.masterdata.searchDocuments<any>({
    dataEntity: faqGroupEntity,
    fields: ["id"],
    pagination: {
      page: 1,
      pageSize: 1000
    },
    where: `fatherCategory=${id}`,
    schema: 'question_groups'
  })
  return result //è un oggetto contenente gli id dei gruppi che hannno fatherCat = payload.id...tutti questi id vanno eliminati dai group
}


export const deleteFaqGroup = async (ctx: Context, id: string) => {
  return await ctx.clients.masterdata.deleteDocument({
    dataEntity: faqGroupEntity,
    id: id,
  }).then(() => {
    ctx.status = 200
    ctx.body = "ok"
    return true;
  }).catch(() => {
    ctx.status = 400;
    ctx.body = "Error while deleting"
    return false
  })
}
