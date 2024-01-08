import {LRUCache} from '@vtex/api';

// Set name of Data Entity
const dataEntityName: string = 'BR';
const MaxBomElementRequest:number = 100;
const chunkSize:number = 50;

const bomCache = new LRUCache<string, any>({ max: 5000, maxAge: 1000 * 60 * 60 * 24 })
export async function fitsIn(ctx: Context, next: () => Promise<any>) {
    try {
        let cachedData = getFromCache(ctx);

        if (typeof cachedData !== 'undefined' && cachedData !== null ) {
            ctx.body = cachedData;
        } else {
            let bomData = await scrollAllBoms(ctx);
            let spareInformation = await spareFromBOM(ctx, bomData);
            ctx.body = postProcessingFbList(spareInformation);
            saveIntoCache (ctx, ctx.body);
        }
    } catch( error) {
        console.log(error)
    }
    await next();
}


function getFromCache (ctx: Context) : any {
    const { vtex: {route: {params: {sparePartId}}} } = ctx;
    return bomCache.get(sparePartId as string)
}

function saveIntoCache(ctx:Context, value : any) {
    const { vtex: {route: {params: {sparePartId}}} } = ctx;
    return bomCache.set(sparePartId as string, value);
}

async function spareFromBOM(ctx: Context, finishedGoodsIndustrials:Array<string>) {
    const {
        clients: { search }
    } = ctx;
    let chunkNumber:number = Math.ceil(finishedGoodsIndustrials.length / chunkSize);
    let industrialCodeSpecificationId = JSON.parse(`${process.env.SETTINGS}`).INDUSTRIAL_CODE_ID
    let spareDesc = [];

    for (let i = 0; i < chunkNumber; i++) {
        let posStart:number = i * chunkSize;
        let posEnd:number = posStart + chunkSize -1;
        let searchResult = await search.searchProductsBySpecification( industrialCodeSpecificationId, finishedGoodsIndustrials.slice(posStart, posEnd), 0, 49, 1 );

        let spareInformation = searchResult.data.map(finishedGoodData => {
            return {
                link : `${finishedGoodData.linkText}/p`,
                family :  `${finishedGoodData.familyGroup ? finishedGoodData.familyGroup[0] : 'Other' }`,
                name : `${finishedGoodData.commercialCode}`,
            }
         });
        spareDesc.push(... spareInformation );
    }
    return spareDesc;
}

async function scrollAllBoms (ctx: Context) {

    const {
        vtex: {route: {params: {sparePartId}}},
        clients: { masterdata },
    } = ctx;

    let pageNumber = 1;

    let searchOptions = {
        dataEntity: dataEntityName,
        fields: ['finishedgoodId'],
        where: `sparepartId=${sparePartId}`,
        pagination: {
            page: pageNumber,
            pageSize: MaxBomElementRequest
        }
    }

    let mdResponse = await masterdata.searchDocumentsWithPaginationInfo<string>(searchOptions);

    let fgList: Array<string> = [];
    fgList = addToFgList(fgList, mdResponse.data );

    let totalPages = Math.floor(mdResponse.pagination.total / MaxBomElementRequest );
    while (pageNumber <= totalPages) {
        pageNumber = pageNumber += 1;
        searchOptions.pagination.page = pageNumber;
        let pageData = await masterdata.searchDocuments<string>(searchOptions);
        fgList = addToFgList(fgList, pageData );
    }
    return fgList;
}

function addToFgList(bomList: Array<string>, responseData : Array<any> ) {

    responseData.forEach( (element:any) => {
        if(! bomList.includes(element.finishedgoodId )) {
            bomList.push(element.finishedgoodId)
        }
    });
    return bomList;
}

function postProcessingFbList(FgList: any[]): any {

    const array: any = {};
    FgList.forEach(el => {
        if(array[el.family] == undefined) {
            array[el.family] = [];
        }
        array[el.family].push({
            link: el.link,
            name: el.name
        })
    })
    return array;
}
