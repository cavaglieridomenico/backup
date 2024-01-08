import {family, Filter} from "../../typings/Filter";
import { BR, MAIN } from "../../typings/types";

//Function that unifies values according to the type
function typeUnifier(filter: Filter[]){


  let filterType: string
  let filterValue: string

  let filterGroup: family[] = []
  let newGroup: family = {type : "", value : []}

  let response: any

  filter.forEach(f => {

    filterType = f.name
    filterValue = f.value

    let innerIndex = 0
    let isTypeExistant = false

    while(innerIndex < filterGroup.length ){

      if(filterType == filterGroup[innerIndex].type){
        filterGroup[innerIndex].value[filterGroup[innerIndex].value.length] = `"${filterValue}"`
        isTypeExistant = true
      }

      innerIndex++

    }

    //if a type doesn't already exist It creates a new group of filters
    if(isTypeExistant == false){

      //initialization of newGruop
      newGroup = {type : "", value : []}

      newGroup.type = filterType
      newGroup.value[0] = `"${filterValue}"`
      filterGroup = filterGroup.concat(newGroup)

    }



  });



  if(filterGroup.length == 0){

    filterGroup[0].type = "null"
    filterGroup[0].value[0] = "null"

    response = filterGroup[0]
  }else{
    response = filterGroup
  }



  return response
}

//Function that return the where condition string
function getWhereCondition (filter: Filter[]){

  let whereConditionString = ``

  //string used to concatenate with OR logic operator the
  //substring of the same filter type
  let partialCondition: string[] = []

  let innerPartilCondition: string

  //array of filter with different values but with the same
  //type(or name)
  let filterGroup : family[]

  let filterGroupIndex = 0
  let pCIndex = 0


  if(filter.length > 0){


    filterGroup = typeUnifier(filter)

    filterGroup.forEach(fg => {

      //initialization of partialCondition
      partialCondition[filterGroupIndex] = "("

      if(fg.value.length >1){

        let index = 0

        //concatenate all the filter values with the same type(or name)
        //in a single string example (type1 = value1 OR type1 = value2)
        while(index < fg.value.length){

          innerPartilCondition = `${fg.type} = ${fg.value[index]}`

          partialCondition[filterGroupIndex] = partialCondition[filterGroupIndex].concat(innerPartilCondition)

          //concatenate OR logic operator until It considers the penultimate value
          if(index < (fg.value.length - 1)){
            partialCondition[filterGroupIndex] = partialCondition[filterGroupIndex].concat(" OR ")
          }

          index ++

        }

        partialCondition[filterGroupIndex] = partialCondition[filterGroupIndex].concat(")")

      }else{

      let singleValuePCString: string

      singleValuePCString = `(${fg.type}= ${fg.value[0]})`
      partialCondition[filterGroupIndex]= singleValuePCString

      }

      filterGroupIndex ++

    })

    //concat every partial string in a single
    //where condition string
    if(partialCondition.length > 0){

      partialCondition.forEach(pC => {

      whereConditionString = whereConditionString.concat(pC)

      //concat AND logic operator until It considers
      //the penultimate partialCondition string
      if(pCIndex < (partialCondition.length -1)){
        whereConditionString = whereConditionString.concat(" AND ")
      }

      pCIndex ++

      })
    }
  }

  return whereConditionString
}

export const getSpareByIndustrialWithFilterPAG_resolver = async ( _: any, {filter, page,pageSize} : any, ctx: Context) =>{

    //industrialCode = industrialCode.toUpperCase();
    filter = filter;
    page = page ? page : 1;
    pageSize = pageSize ? pageSize : 20;
    let whereCondition: string = ''

    if(filter.length == 0){
       // whereCondition = `industrialCode= ${industrialCode}`;

    }else{
        whereCondition = getWhereCondition(filter);  //`industrialCode= ${industrialCode} AND ${filter.type} = ${filter.value}` ;
    }

    try {

        // check if the sparePartIds exist and take the field associated
        let sparePartId: any = await ctx.clients.masterdata.searchDocuments({
            dataEntity: BR,
            fields: ['sparePartId','familyGroup'],
            schema: MAIN,
            pagination: {
                page: page,
                pageSize: pageSize
            },
            where: whereCondition,

        })

        if(sparePartId.length === 0){
            ctx.body = "Not Found"
            ctx.status = 200;

        }else{
            ctx.body = "OK";
            ctx.status = 200;

        }
        return sparePartId;
    } catch (error) {
        return error;
    }
}
