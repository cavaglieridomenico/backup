import { faqE } from './globalConst'
import { checkCategory, checkGroup, avoidSpecial, featuredFrom, searchForId, rieuhue, searchingFaqCondition } from './functions';
import { getGroupsByParentId } from './groups'

export const createFaq = async (ctx: Context, payload: any): Promise<boolean> => {
  if (payload.question || payload.question.trim() != "") {
    if (!payload.url || payload.url.trim() == "") {
      let urlName = payload.question.replace(/[\s']/g, "-").replace(/[?.,:;]/g, "");
      urlName = urlName.replace(/[ä]/g, "ae").replace(/[ö]/g, "oe").replace(/[ü]/g, "ue").replace(/[ß]/g, "ss");
      let finalURL = avoidSpecial(urlName);
      payload.url = finalURL.toLowerCase();
    }
    featuredFrom(payload)
    const categoryName = await checkCategory(ctx, payload)
    if (categoryName) {
      const groupName = await checkGroup(ctx, payload)
      if (groupName) {
        payload.categoryName = categoryName
        payload.groupName = groupName
        payload.metaTitle = payload.url
        payload.metaDescription = `${categoryName}-${groupName}`
        return await ctx.clients.masterdata.createOrUpdateEntireDocument({
          dataEntity: faqE,
          fields: payload,
          schema: faqE
        }).then((data: any) => {
          ctx.status = 200;
          ctx.body = {
            faqId: data.DocumentId,
            metaTitle: payload.metaTitle,
            metaDescription: payload.metaDescription
          }
          return true
        }).catch(() => false)
      } else {
        ctx.status = 400;
        ctx.body = "Wrong group or group doesn't belong to declared Category"
        return false
      }
    } else {
      ctx.status = 400;
      ctx.body = "Wrong category"
      return false
    }
  } else {
    ctx.status = 400;
    ctx.body = "Question is missing"
    return false
  }

}


export const updateFaq = async (ctx: Context, payload: any) => {
  if (!payload.url) {
    ctx.status = 400;
    ctx.body = "URL is missing"
    return false
  } else {
    let urlName = payload.question.replace(/[\s']/g, "-").replace(/[?.,:;]/g, "");
    urlName = urlName.replace(/[ä]/g, "ae").replace(/[ö]/g, "oe").replace(/[ü]/g, "ue").replace(/[ß]/g, "ss");
    let finalURL = avoidSpecial(urlName);
    payload.url = finalURL.toLowerCase();
    featuredFrom(payload)
    const categoryName = await checkCategory(ctx, payload)
    if (categoryName) {
      const groupName = await checkGroup(ctx, payload)
      if (groupName) {
        payload.categoryName = categoryName
        payload.groupName = groupName
        if (await searchForId(ctx, payload, faqE)) {
          return await ctx.clients.masterdata.updatePartialDocument({
            id: payload.id,
            dataEntity: faqE,
            fields: payload,
          }).then(() => {
            ctx.status = 200;
            ctx.body = "ok"
            return true
          }).catch(() => {
            ctx.status = 400;
            ctx.body = "Error while updating"
            return false
          })
        } else {
          ctx.status = 400;
          ctx.body = "Wrong id"
          return false
        }
      } else {
        ctx.status = 400;
        ctx.body = "Wrong group"
        return false
      }
    } else {
      ctx.status = 400;
      ctx.body = "Wrong category"
      return false
    }
  }
}


export const getFaq = async (ctx: Context, page: number, pageSize: number, group: string, category: string) => {
  let result: any = await ctx.clients.masterdata.searchDocuments({
    dataEntity: faqE,
    fields: ["id", "url", "metaTitle", "metaDescription", "question", "answer", "featuredFrom", "category", "group", "categoryName", "groupName"],
    pagination: {
      page: page || 1,
      pageSize: pageSize || 8
    },
    schema: "faq",
    where: rieuhue(group, category),
    sort: `featuredFrom DESC`
  })


  return result.map((el: any) => {
    if (!el.featuredFrom || el.featuredFrom == "" || el.featuredFrom == null || el.featuredFrom == undefined) {
      return {
        ...el,
        featuredFrom: false
      }
    } else {
      return {
        ...el,
        featuredFrom: true
      }
    }
  })
}



export const searchFaq = async (ctx: Context, page: number, pageSize: number, searchField: string) => {
  ctx.set("Cache-Control", "no-store")
  let arrWorlds = searchingFaqCondition(searchField)
  let result = await ctx.clients.masterdata.searchDocuments<any>({
    dataEntity: faqE,
    fields: ["id", "url", "metaTitle", "metaDescription", "question", "answer", "featuredFrom", "category", "group", "categoryName", "groupName", "searchField"],
    pagination: {
      page: page || 1,
      pageSize: pageSize || 8
    },
    schema: faqE,
    where: arrWorlds.map(word => `answer=*${word}* OR question=*${word}*`).join(' OR ')
  })
  return result.map((el: any) => {
    if (!el.featuredFrom || el.featuredFrom == "" || el.featuredFrom == null || el.featuredFrom == undefined || el.featuredFrom == false) {
      return {
        ...el,
        featuredFrom: false
      }
    } else {
      return {
        ...el,
        featuredFrom: true
      }
    }
  })
}


export const getAllFaqs = async (ctx: Context, page: number, pageSize: number) => {
  let result = await ctx.clients.masterdata.searchDocuments({
    dataEntity: faqE,
    fields: ["id", "url", "metaTitle", "metaDescription", "question", "answer", "featuredFrom", "category", "group"],
    pagination: {
      page: page || 1,
      pageSize: pageSize || 8
    },
    schema: "faq",
    sort: `featuredFrom DESC`
  })
  result.forEach((el: any) => {
    if (!el.featuredFrom || el.featuredFrom == "" || el.featuredFrom == null || el.featuredFrom == undefined) {
      el.featuredFrom = false
    } else {
      el.featuredFrom = true
    }
  })
  return result;
}


export const getGroupsAndItsFaqs = async (ctx: Context, id: string) => {
  let data: any = await getGroupsByParentId(ctx, id)
  let faq: any = await getAllFaqs(ctx, 1, 1000)

  let result = data?.map((el: any) => {
    return {
      groupName: el.name,
      groupId: el.id,
      faqs: faq.filter((obj: any) => obj.group == el.id)
    }
  })
  return result
}


export const deleteFaq = async (ctx: Context, id: string) => {
  return await ctx.clients.masterdata.deleteDocument({
    dataEntity: faqE,
    id: id,
  }).then(() => {
    ctx.status = 200;
    return true
  }).catch(() => {
    ctx.status = 400;
    return false
  })
}


export const getFaqByUrl = async (ctx: Context, url: string) => {
  let result: any = await ctx.clients.masterdata.searchDocuments({
    dataEntity: faqE,
    fields: ["id", "url", "metaTitle", "metaDescription", "question", "answer", "featuredFrom", "category", "group", "categoryName", "groupName"],
    pagination: {
      page: 1,
      pageSize: 1
    },
    schema: "faq",
    where: `url=${url}`,
  })
  if (result[0]) {
    return result.map((el: any) => {
      if (!el.featuredFrom || el.featuredFrom == "" || el.featuredFrom == null || el.featuredFrom == undefined || el.featuredFrom == false) {
        return {
          ...el,
          featuredFrom: false
        }
      } else {
        return {
          ...el,
          featuredFrom: true
        }
      }
    })
  }
  else {
    ctx.body = "No content"
    ctx.status = 402
  }
}
