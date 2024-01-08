import {IOResponse, LRUCache} from '@vtex/api';
import {json} from 'co-body';
import { BomElement } from '../typings/bom';
import {ProductSearch, scrollResponse, sparePart} from '../utils/typing';
import {getError} from './errors';
//import {queries} from "../resolvers/product";


// BOM Cache
const bomCache = new LRUCache<string, any>({ max: 10000, maxAge: 1000 * 60 * 60 * 24 });
const BomEntityName: string = 'BR';
const maxSearchPageSize = 100;
const maxProductSearchSize = 50;

// GET /v1/bom/scroll/:productCode
// BOM scroll
export async function scrollBom(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: {route: {params: {productCode}}},
            clients: {search}
        } = ctx;

        let brandCode = parseInt(typeof process.env.brandCode !== 'undefined' ? 
            process.env.brandCode : '0');

        if (bomCache.has(`${ctx.vtex.route.id}-${brandCode}-${productCode}`)) {
            let spareParts = bomCache.get(`${ctx.vtex.route.id}-${brandCode}-${productCode}`);
            ctx.body = {
                spareParts,
                categoryIds: bomCache.get(`${ctx.vtex.route.id}-${brandCode}-${productCode}-categories`)
            };
        } else {
            const scrollResult: Map<string,Array<BomElement>> = await searchBomFromMasterData(ctx);
            // Get spare parts
            // sparePartIds will contain the unique Ids
           const sparePartIds : Array<string> = [...scrollResult.keys()];

            // Init spareParts
            let spareParts: Array<sparePart> = [];
            let substitutedSpareParts: Array<sparePart> = [];

            // Number of GETs to perform
            const contentLength: number = Math.ceil(sparePartIds.length / maxProductSearchSize);
            let n_iterations: number = Math.ceil(sparePartIds.length / maxProductSearchSize);

            // Set of category ids
            const categoryIds: Set<{ [name: string]: number }> = new Set()
            const familyGroupMapping: { [name: string]: number } = {}

            while (n_iterations > 0) {
                // Define start and end indexes
                let start: number = (contentLength - n_iterations) * maxProductSearchSize;
                let end: number = (contentLength - n_iterations + 1) * maxProductSearchSize;

                // Get spare parts and add them to total list of spare parts
                //let items: ProductSearch[] = (await search.searchProductsBySpecification(JSON.parse(`${process.env.SETTINGS}`).SPARE_JCODE_ID, sparePartIds.slice(start, end), 0, 49, brandCode)).data;
                const items: ProductSearch[] = (await search.searchProductsByReference(sparePartIds.slice(start, end), 0, maxProductSearchSize-1, brandCode)).data
                
                // adding to the response items not obsolete or Obsolete and not substituted items
                
                items.forEach( (item:sparePart) => {
                    let itemStatus = item.status !== undefined ? item.status[0] : ""; 
                    if ("obsolete" !== itemStatus.toLocaleLowerCase() || item.substitute == undefined || item.substitute[0] == undefined || item.substitute[0].length == 0) {
                        item.bomRelationships = getBomRelationships(scrollResult, item.productReference);
                        spareParts.push (item);
                    } else {
                        // if the spare is replaced by an already existing spare in the bom list, i just need to update it
                        let substituteId = item.substitute[0];
                        if (scrollResult.has(substituteId)) {
                            mergeBomElements(scrollResult, item.productReference, item.substitute[0]);
                            let replacement = spareParts.find(el => el.productReference == substituteId);
                            if (replacement !== undefined) {
                                replacement.bomRelationships = getBomRelationships(scrollResult, substituteId);
                            }
                        } else {
                            substitutedSpareParts.push(item);
                        }
                    }
                })
                // Update iteration parameters
                n_iterations--;
            }
            spareParts.push ( ... await handleSubstitutesSpareParts(ctx, substitutedSpareParts, brandCode, scrollResult) );

            // Add familyGroupMapping to categoryIds
            spareParts.forEach(item => {
                if (item.familyGroup && item.familyGroup[0] && item.familyGroup[0].toLowerCase() !== 'ohne' && item.familyGroup[0].toLowerCase() !== 'without') {
                    familyGroupMapping[item.familyGroup[0]] = Number(item.categoryId);
                }
            })
            categoryIds.add(familyGroupMapping);


            //Translate spares in the locale
            /*for (const spare of sparePartsFiltered) {
                // Context settings for translation
                ctx.vtex.locale = locale.toString()
                ctx.vtex.tenant = {locale: 'de-CH'}

                const productTranslated = await queries.productTranslation(spare.productId, locale, ctx)
                if (productTranslated.data !== undefined) {
                    spare.productName = productTranslated.data.product.name
                    spare.productTitle = productTranslated.data.product.title
                    spare.description = productTranslated.data.product.description
                    spare.linkText = productTranslated.data.product.linkId
                    spare.metaTagDescription = productTranslated.data.product.metaTagDescription
                }
            }*/

            // save in cache
            
            bomCache.set(`${ctx.vtex.route.id}-${brandCode}-${productCode}`, spareParts);
            bomCache.set(`${ctx.vtex.route.id}-${brandCode}-${productCode}-categories`, [...categoryIds][0]);
            
            // Return response
            ctx.body = {
                spareParts,
                categoryIds: [...categoryIds][0]
            };
        }
    } catch (error) {
        getError(error, ctx);
    }
    await next();
}


async function searchBomFromMasterData ( ctx: Context ) : Promise<Map<string, BomElement[]>> {
    const {
        vtex: {route: {params: {productCode}}},
        clients: {masterdata}
    } = ctx;

    let bomMap : Map<string, Array<BomElement>> = new Map(); 

    let pageNumber = 1;
    let searchInput = {
        dataEntity: BomEntityName,
        fields: ['bomId','finishedgoodId','sparepartId','sparepartInBom','quantity'],
        where: `finishedgoodId=${productCode}`,
        pagination: {
            page: pageNumber,
            pageSize: maxSearchPageSize
        }
    };

    let searchResult = await masterdata.searchDocumentsWithPaginationInfo<BomElement>(searchInput);
    searchResult.data.forEach(el => addBomElementToMap(el, bomMap));
    let totalPages = Math.ceil(searchResult.pagination.total / maxSearchPageSize );
    while (pageNumber < totalPages) {
        pageNumber = pageNumber += 1;
        searchInput.pagination.page = pageNumber;
        (await masterdata.searchDocuments<BomElement>(searchInput)).forEach(el => addBomElementToMap(el, bomMap))
    }
    return bomMap;
}

function addBomElementToMap(element: BomElement, map : Map<string, BomElement[]>) {
    if (map.has(element.sparepartId)) {
        map.get(element.sparepartId)?.push(element);
    } else {
        map.set(element.sparepartId, [element]);
    }
}

function mergeBomElements(map : Map<string, BomElement[]>, obsoleteId:string, replacementId:string) {
    if (map.has(obsoleteId) && map.has(replacementId)) {
        let obsoleteBoms = map.get(obsoleteId);
        if (obsoleteBoms !== undefined) {
            map.get(replacementId)?.push(...obsoleteBoms.map(el => {
                el.sparepartId = replacementId;
                return el;
            }))
        }
    }
}

/**
 * This function manages the obsolete spare parts that specify a substitution
 * @param ctx application context
 * @param subsituted the list of obsolete sparePart to be replaced
 * @param brandCode the brand this request was made for
 * @param bomResult the list of boms retrieved by the masterData
 * @returns an array or sparePart, which are the ones that substitute the obsolete ones
 */
async function handleSubstitutesSpareParts(ctx: Context, subsituted : Array<sparePart>, brandCode:number, bomResult : Map<string,Array<BomElement>>) : Promise<Array<sparePart>> {
    const { clients: {search} } = ctx;
    let spareList:Array<sparePart> = [];

    if (subsituted.length > 0) {

        let searches = Math.ceil(subsituted.length / maxSearchPageSize);
        for (let i = 0; i < searches; i++) {
            let references = subsituted
                    .slice(i*maxProductSearchSize, (i+1)*maxProductSearchSize)
                    .map(item => typeof item.substitute !== 'undefined' ? item.substitute[0] : '')
                    .filter(item => item !== '');
            
            spareList.push(
                ... (await search.searchProductsByReference(references, 0, maxProductSearchSize-1, brandCode)).data
                    .map(( spare : sparePart) => {
                        
                        let originalSpare = subsituted.find(sub => {
                            return typeof sub?.substitute !== 'undefined' &&  sub.substitute[0] === spare.productReference
                        });
                        const substituteJCode = spare.productReference;
                        const substituteQuantity = (originalSpare?.substitute == undefined || originalSpare?.substitute[1] === undefined || originalSpare?.substitute[1].trim().length <= 0) ? "1" : originalSpare?.substitute[1].toString()
                        if (originalSpare?.productReference !== undefined) {
                            spare.bomRelationships = getBomRelationships(bomResult, originalSpare.productReference, substituteJCode, substituteQuantity)
                        }
                        return spare;
                    })
            );
        }
    }
    return spareList;
}

/**
 * Given the list of BOM retrieved from the MasterData and a SparePartID, 
 * returns the list of BOMs for that spare part. 
 * 
 * In case the spare was obsolete and substituted with another one, 
 * it is possible to pass additional parameters to reflect this change
 * 
 * @param bomList the list of BOMs obtained from MasterData
 * @param spareId the sparePart Id for which we want the filtered BOM list
 * @param substituteId the ID of the sparePart which substitutes the obsolete one passed as first parameter
 * @param substituteQuantity the number of pieces needed to replace spareId with substituteId
 * @returns the list of BOMs related to the specified sparePartId
 */
function getBomRelationships ( bomMap : Map<string, Array<BomElement>>, spareId : string, substituteId?: string, substituteQuantity?:string) : Array<BomElement> {
    let bomList = bomMap.get(spareId);
    if (bomList !== undefined) {
        return bomList?.map(bom => {
                bom.sparepartId = typeof substituteId !== 'undefined' ? substituteId : bom.sparepartId;
                bom.quantity = typeof substituteQuantity !== 'undefined' ? substituteQuantity : bom.quantity;
                return bom;
            })
    } else {
        return [];
    }
}

// GET /v1/bom/search/:productCode
// BOM search
export async function searchBom(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: {route: {params: {productCode}}},
            query,
            clients: {document, search}
        } = ctx;

        let brandCode = parseInt(typeof process.env.brandCode !== 'undefined' ? 
            process.env.brandCode : '0');

        // Set name of Data Entity
        const dataEntityName: string = 'BR';

        // Set query
        let queryString: string = '?';

        if (Object.keys(query).length !== 0) {
            for (const [key, value] of Object.entries(query)) {
                if (key !== 'brand') {
                    queryString += `${key}=${value}&`;
                }
            }
        }

        // Field
        queryString += `_fields=bomId,finishedgoodId,sparepartId,sparepartInBom,quantity&`;
        // Search the right product code
        queryString += `_where=finishedgoodId=${productCode}`;


        // Get spare parts
        const data: IOResponse<any> = await document.searchDocuments(dataEntityName, queryString, 0, 1000);
        const scrollResult: Array<scrollResponse> = await data.data;


        const contentTotal: number = Number(data.headers['rest-content-range'].split('/')[1]);

        if (contentTotal > 1000) {
            let n_iterations: number = Math.ceil(contentTotal / 1000) - 1;

            while (n_iterations > 0) {
                const from: number = (Math.ceil(contentTotal / 1000) - n_iterations) * 1000;
                const to: number = (Math.ceil(contentTotal / 1000) - n_iterations + 1) * 1000;
                // Get spare parts
                let res: scrollResponse[] = await (await document.searchDocuments(dataEntityName, queryString, from, to)).data;
                // Update data
                scrollResult.push(...res);

                // Update iteration
                n_iterations--;
            }
        }

        // Get spare parts
        const sparePartIds: Array<string> = scrollResult.map((item: scrollResponse) => item.sparepartId);

        // Init spareParts
        const spareParts: Array<sparePart> = [];

        // Number of GETs to perform
        const contentLength: number = Math.ceil(sparePartIds.length / 50);
        let n_iterations: number = Math.ceil(sparePartIds.length / 50);

        // Set of category ids
        const categoryIds: Set<{ [name: string]: number }> = new Set()
        const familyGroupMapping: { [name: string]: number } = {}

        while (n_iterations > 0) {
            // Define start and end indexes
            let start: number = (contentLength - n_iterations) * 50;
            let end: number = (contentLength - n_iterations + 1) * 50;

            // Get spare parts and add them to total list of spare parts
            let items: ProductSearch[] = (await search.searchProductsBySpecification(JSON.parse(`${process.env.SETTINGS}`).SPARE_JCODE_ID, sparePartIds.slice(start, end), 0, 49, brandCode)).data;
            spareParts.push(...items);

            // Add mapping familyGroup name and category ID to all mappings
            for (let item of items) {
                if (item.familyGroup && item.familyGroup[0]) {
                    familyGroupMapping[item.familyGroup[0]] = Number(item.categoryId);
                }
            }

            // Update iteration parameters
            n_iterations--;
        }

        // Add familyGroupMapping to categoryIds
        categoryIds.add(familyGroupMapping);

        // Map each spare part to its corresponding bom relationships
        spareParts.forEach((sparePart) => {
            sparePart["bomRelationships"] = scrollResult.filter((scrollValue) => {
                return scrollValue.sparepartId === sparePart.productReference
            })
        })

        // Return response
        ctx.body = {
            spareParts,
            categoryIds: [...categoryIds][0]
        };

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}


// GET /v1/bom/spare-parts
// Get n products by JCODE
export async function sparePartsBom(ctx: Context, next: () => Promise<any>) {
    try {
        let {
            req,
            clients: {search}
        } = ctx;

        let brandCode = parseInt(typeof process.env.brandCode !== 'undefined' ? process.env.brandCode : '0');

        // Parse body sent
        const body: { jcode: Array<string> } = await json(req);

        // Init spareParts
        const spareParts: ProductSearch[] = [];

        // Number of GETs to perform
        const contentLength: number = Math.ceil(body['jcode'].length / 50);
        let n_iterations: number = Math.ceil(body['jcode'].length / 50);

        while (n_iterations > 0) {
            // Define start and end indexes
            let start: number = (contentLength - n_iterations) * 50;
            let end: number = (contentLength - n_iterations + 1) * 50;

            // Get spare parts and add them to total list of spare parts
            let items: ProductSearch[] = (await search.searchProductsBySpecification(JSON.parse(`${process.env.SETTINGS}`).SPARE_JCODE_ID, body['jcode'].slice(start, end), 0, 49, brandCode)).data;
            spareParts.push(...items);

            // Update iteration parameters
            n_iterations--;
        }

        // Return response
        ctx.body = spareParts;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}
