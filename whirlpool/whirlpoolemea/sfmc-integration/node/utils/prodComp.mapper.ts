import { CustomLogger } from './Logger'
import { FormatPrice } from "../utils/functions";
import { PdfMapperBody, SpecificationGroup, SpecificationGroupItem } from "../typings/types";
var Handlebars = require("handlebars");

// object mapper for each skuId compared
//@return a products object array ready for rows
export async function productsMapperObject(ctx: Context, skuIds: any, specToAvoid: any): Promise<PdfMapperBody | undefined> {

  let prodNumbers = skuIds.length
  let bodyObject: PdfMapperBody = {
    urlImgs: [],
    energyLogoImgs: [],
    productsName: [],
    prices: [],
    refIds: [],
    specifications: []
  }


  for (let i = 0; i < prodNumbers; i++) {
    bodyObject.urlImgs[i] = "-";
    bodyObject.energyLogoImgs[i] = "-";
    bodyObject.productsName[i] = "-";
    bodyObject.prices[i] = "-";
    bodyObject.refIds[i] = "-";
  }

  await Promise.all(skuIds.map(async (skuId: any, index: any) => {

    let sku: any = (await ctx.clients.VtexMP.getSkuContext(skuId)).data
    let marketPrice: any = (await ctx.clients.VtexMP.getMarketPrice(skuId, ctx.state.appSettings.o2p?.tradePolicyId)).data;
    let product: any = (await ctx.clients.VtexMP.getProduct(sku.ProductId)).data
    let categorySpecGroup: any = (await ctx.clients.VtexMP.getSpecGroupByCategory(product.CategoryId)).data

    //we filter only the visible specification group for a specific category
    let visibleSpecGroups = categorySpecGroup.filter((item: any) => item.CategoryId == product.CategoryId && !specToAvoid.includes(item.Name))


    //headers field**************
    bodyObject.urlImgs.splice(index, 1, sku.Images[0]?.ImageUrl)
    bodyObject.energyLogoImgs.splice(index, 1, sku.ProductSpecifications.filter((item: any) => item.FieldName == "EnergyLogo_image")[0].FieldValues[0])
    bodyObject.productsName.splice(index, 1, sku.ProductName)
    let price = FormatPrice(marketPrice[0]?.items[0]?.sellers[0]?.commertialOffer.Price);
    bodyObject.prices.splice(index, 1, price)
    bodyObject.refIds.splice(index, 1, sku.SkuName)



    visibleSpecGroups.forEach((element: any) => {
      bodyObject = filterData(bodyObject, index, prodNumbers, sku.ProductSpecifications.filter((item: any) => item.FieldGroupName == element.Name))
    });

    //console.log("index " + index + " " +JSON.stringify(bodyObject))

  })).catch(err => {
    console.log(err)
    return undefined
  })

  return bodyObject

}


//util function for the previews one

function filterData(bodyObject: any, index: any, prodNumbers: any, data: any) {

  let newBodyObj = bodyObject

  if (data != undefined && data.length > 0) {

    data.map((item: any) => {

      let fieldGroup = item.FieldGroupName
      let fieldName = item.FieldName
      let fieldValues = item.FieldValues

      let specGroupIndex = newBodyObj.specifications.findIndex((sgItem: any) => sgItem.specificationGroupName == fieldGroup)


      if (specGroupIndex == -1) { // if the group not exist i will create it at first
        let specGroup: SpecificationGroup = {
          specificationGroupName: fieldGroup,
          specificationGroupItems: []
        }
        newBodyObj.specifications.push(specGroup)
        specGroupIndex = newBodyObj.specifications.length - 1
      }


      let specItemIndex = newBodyObj.specifications[specGroupIndex].specificationGroupItems.findIndex((sitem: any) => sitem.fieldLabel == fieldName)
      let value = fieldValues != undefined && fieldValues.length > 0 && fieldValues != "" ? fieldValues[0] : " - "

      if (specItemIndex != -1) {
        //if already exist add the values on single item
        newBodyObj.specifications[specGroupIndex].specificationGroupItems[specItemIndex].values.splice(index, 1, value)

      } else {

        //if not exist, create a new item on the specificationGroupItems
        let specItem: SpecificationGroupItem = {
          fieldLabel: fieldName,
          values: []
        }

        for (let i = 0; i < prodNumbers; i++) {
          if (i == index) {
            specItem.values.splice(index, 0, value)
          } else {
            specItem.values.splice(i, 0, "-")
          }
        }

        newBodyObj.specifications[specGroupIndex].specificationGroupItems.push(specItem);

      }

    })
  }

  return newBodyObj
}



//Function that recive a json object of product specifications to be filled in a HTML template dinamically and return an HTML conveted in base64

export function htmlGenerator(ctx: Context, comparedProducts: any): string {
  ctx.vtex.logger = new CustomLogger(ctx)
  let context = comparedProducts;


  let source = '<!doctype html>' +
    '<html lang="' + ctx.state.appSettings.o2p?.productsComparisonTemplate?.langHtml?.find(e => e.key?.toLowerCase() == ctx.state.appSettings.vtex.defaultLocale5C.toLowerCase())?.value + '">' +
    '<head>' +
    '<title>html comparisons template</title>' +
    '<link rel="stylesheet" href="https://site-assets.fontawesome.com/releases/v5.15.4/css/all.css">' +
    '<style type="text/css">' +
    'body {font-family: Arial, Helvetica, sans-serif; font-size: 80%;}' +
    //'#container {width: 60%}' +
    '#products {border-collapse: collapse; clear: both;}' +
    '#products td img {width: 50%; display: block; margin-left: auto; margin-right: auto;}' +
    '#products td, #products th {border: 1px solid #ddd;padding: 8px;}' +
    '#products tr:nth-child(even){background-color: #f2f2f2;}' +
    '#products tr.specificationGroupName td {background-color: ' + ctx.state.appSettings.o2p?.productsComparisonTemplate?.specGroupRowColor + '; color: ' + ctx.state.appSettings.o2p?.productsComparisonTemplate?.specGroupFontColor + ';}' +
    '.bold {font-weight: bold;}' +
    '.center {text-align: center;}' +
    '.no-bgcolor td {background-color: #FFF;}' +
    '#products tr.no-border td {border-style: none;}' +
    '#header img {float: left; margin: 5px 10px; width:' + ctx.state.appSettings.o2p?.productsComparisonTemplate?.imgLogoWidth + '}' +
    '#header h1 { margin-left: 180px; padding: 15px 20px; background-color: #000; color: #FFF; font-size: 15px;}' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div id="container">' +
    '<div id="header">' +
    '<img src="' + ctx.state.appSettings.o2p?.productsComparisonTemplate?.imgSource?.find(e => e.key?.toLowerCase() == ctx.state.appSettings.vtex.defaultLocale5C.toLowerCase())?.value + '">' + /*https://itwhirlpool.vtexassets.com/assets/vtex.file-manager-graphql/images/3ff5a944-94ce-4f50-b122-8289fc2b7c5c___733fd95312aac1564a0445c1e01ba670.svg*/
    '<h1>' + ctx.state.appSettings.o2p?.productsComparisonTemplate?.h1?.find(e => e.key?.toLowerCase() == ctx.state.appSettings.vtex.defaultLocale5C.toLowerCase())?.value + '</h1>' + /*ex for FR: Comparaison de produits*/
    '</div>' +
    '<table id="products">' +
    '<tr class="no-border">' +
    '<td></td>' +
    '{{#each urlImgs}}' +
    '<td><img src="{{this}}" alt="frontal view of goods"></td>' +
    '{{/each}}' +
    '</tr>' +    
    '<tr class="no-border center no-bgcolor">' +
    '<td></td>' +
    '{{#each productsName}}' +
    '<td>{{this}}</td>' +
    '{{/each}}' +
    '</tr>' +
    `${ctx.state.appSettings.o2p?.productsComparisonTemplate?.showEnergyLogoInProductComparison ?? true ?
      '<tr class="no-border no-bgcolor">' +
      '<td></td>' +
      '{{#each energyLogoImgs}}' +
      '<td><img src="{{this}}" alt="energy logo"></td>' +
      '{{/each}}' +
      '</tr>'
      : ''}` +
    `${ctx.state.appSettings.o2p?.productsComparisonTemplate?.showPricesInProductComparison ?? true ?
      '<tr class="no-border bold center no-bgcolor">' +
      '<td></td>' +
      '{{#each prices}}' +
      //'<td>&#x20BD {{this}}</td>' +
      '<td><span class="' + ctx.state.appSettings.o2p?.productsComparisonTemplate?.currencySimbol + '"> {{this}}</td>' +  /*ex euro: fa fa-euro-sign*/
      '{{/each}}' +
      '</tr>'
      : ''}` +
    '{{#each specifications}}' +
    '<tr class="specificationGroupName">' +
    '<td colspan="5">{{this.specificationGroupName}}</td>' +
    '</tr>' +
    '<tr>' +
    '{{#each specificationGroupItems}}' +
    '<td class="bold">{{this.fieldLabel}}</td>' +
    '{{#each values}}' +
    '<td class="center">{{this}}</td>' +
    '{{/each}}' +
    '</tr>' +
    '{{/each}}' +
    '{{/each}}' +
    '</table>' +
    '</div>' +
    '</body>' +
    '</html>'


  let template = Handlebars.compile(source);
  var html = template(context);

  let data = html;
  //console.log( "questa è l'html prodotta :" + data)
  let buff = Buffer.from(data);
  let base64data = buff.toString('base64');

  //console.log('"' + data + '" converted to Base64 is "' + base64data + '"');

  //let data2 = base64data;
  //let buff2 = Buffer.from(data2, 'base64');
  //let text = buff2.toString('utf8');
  //console.log('"' + data2 + '" converted from Base64 to ASCII is "' + text + '"');

  return base64data
}
