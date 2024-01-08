import { faqEntity, faqGroupEntity } from './globalConst'
import { URLcheck, searchForId } from './functions'
import { searchGroupsOfCategory } from './groups'
import { v1 } from 'uuid'


// GET CATEGORIES

export const getAllFaqCategories = async (ctx: Context, page: number, pageSize: number) => {
  try { //fammi tutti i question groups legati alla cat 1 , se c'è il paramentro question-gruops (il paramentro è tipo category id)
    let res: any = await ctx.clients.masterdata.searchDocuments<any>({
      dataEntity: faqEntity,
      fields: ["name", 'id', "url", "metaTitle", "metaDescription", "image"],
      pagination: {
        page: page || 1,
        pageSize: pageSize || 8
      },
      schema: 'categories'
    })
    if (res) {
      ctx.body = "ok"
      ctx.status = 200;
      return res
    } else {
      ctx.status = 400;
      ctx.body = "Empty"
      return null
    }
  } catch (e) {
    console.log(e)
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
}


// CREATE BOTH, CATEGORY AN GROUP ASSOCIATE TO IT

export const createFirstAndSecondLevelFaq = async (ctx: Context, payload: any) => {
  try {
    let parentFaqId: string = v1();
    URLcheck(payload.category);
    await ctx.clients.masterdata.createOrUpdateEntireDocument({
      dataEntity: faqEntity,
      fields: {
        url: payload.category.url,
        name: payload.category.name,
        metaTitle: payload.category.metaTitle,
        metaDescription: payload.category.metaDescription,
        image: payload.category.image,
      },
      id: parentFaqId,
      schema: 'categories'
    })
    ctx.body = { idCategory: parentFaqId }
    await createSecondLevelFaq(ctx, payload, parentFaqId)
    ctx.status = 200;
    return true
  } catch (error) {
    console.log(error);
    return false
  }

}
const createSecondLevelFaq = async (ctx: Context, payload: any, parentFaqId: string) => {
  URLcheck(payload.group);
  await ctx.clients.masterdata.createOrUpdateEntireDocument({
    dataEntity: faqGroupEntity,
    fields: {
      url: payload.group.url,
      name: payload.group.name,
      metaTitle: payload.group.metaTitle,
      metaDescription: payload.group.metaDescription,
      image: payload.group.image,
      fatherCategory: parentFaqId
    },
    schema: 'question_groups'
  }).then((res) => {
    ctx.status = 200;
    ctx.body = {groupId: res.DocumentId}
  }).catch((e) => console.log(e)
  )
}


// CREATE JUST A CATEGORY

export const createCategory = async (ctx: Context, payload: any) => {
  try {
    URLcheck(payload);
    let res = await ctx.clients.masterdata.createOrUpdateEntireDocument({
      dataEntity: faqEntity,
      fields: {
        url: payload.url,
        name: payload.name,
        //metaTitle: payload.metaTitle,
        metaTitle: payload.url,
        //metaDescription: payload.metaDescription,
        metaDescription: payload.name,
        image: payload.image,
      },
      schema: 'categories'
    })
    ctx.body = {
      idCategory: res.DocumentId,
      metaTitle: payload.url,
      metaDescription: payload.name,
      url: payload.url
    }
    ctx.status = 200
    return true
  } catch (error) {
    ctx.status = 500
    ctx.body = "Internal Server Error"
    //console.log(error.response.data.errors[0].errors);
    return false
  }

}





// UPDATE CATEGORY

export const updateFaqCategory = async (ctx: Context, payload: any): Promise<boolean> => {
  if (!payload.fatherCategory) {
    if (payload.id) {
      if (!await searchForId(ctx, payload, faqEntity)) {
        ctx.status = 400;
        ctx.body = "Wrong id, hasn't been able to update"
        return false
      } else {
        URLcheck(payload);
        return await ctx.clients.masterdata.updatePartialDocument({
          dataEntity: faqEntity,
          id: payload.id,
          fields: payload,
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
    ctx.body = "FatherCatergory isn't a properly field"
    return false
  }
}


// DELETE CATEGORY

export const deleteFaqCategory = async (ctx: Context, id: any): Promise<boolean> => {
  return await searchGroupsOfCategory(ctx, id).then((data) => {
    for (let el of data) { //è inutile perché i grup possono essere collegati adf una sola category ...devo eliminare tutti group con fatherCat = fatherCat
      ctx.clients.masterdata.deleteDocument({
        dataEntity: faqGroupEntity,
        id: el.id
      })
    }
    ctx.clients.masterdata.deleteDocument({
      dataEntity: faqEntity,
      id: id
    })
  }).then(() => {
    ctx.status = 200
    ctx.body = "ok"
    return true
  }).catch(() => {
    ctx.status = 400;
    ctx.body = "Error while deleting"
    return false
  })
}
