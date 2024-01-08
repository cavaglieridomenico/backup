import {IOResponse} from '@vtex/api';
import {json} from 'co-body';
import {ProductSearch, scrollResponse, sparePart} from '../utils/typing';
import {getError} from './errors';
import {queries} from "../resolvers/product";


// GET /v1/bom/scroll/:productCode
// BOM scroll
export async function scrollBom(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: {route: {params: {productCode}}},
            query,
            clients: {document, search}
        } = ctx;

        // Map brand
        const mapBrand: any = {
            'whirlpool': 1,
            'bauknecht': 2,
            'indesit': 3,
        }
        // Get brand
        let brandName: string | null = null;

        if (ctx.header['x-forwarded-host']) {
            brandName = ctx.header['x-forwarded-host'].toString().split('.')[1].toLowerCase()
        }

        let brandCode: number = 0;

        if (brandName === 'whirlpool' || brandName === 'bauknecht' || brandName === 'indesit') {
            brandCode = mapBrand[brandName];
        } else {
            brandCode = mapBrand[query.brand.toString().toLocaleLowerCase()];
        }

        //Get locale
        const locale = query.locale.toString().includes('-CH') ? query.locale.toString() : query.locale.toString().toLowerCase() + "-CH"

        // Set name of Data Entity
        const dataEntityName: string = 'BR';

        // Set query
        let queryString: string = '?';

        // Increment size of response
        queryString += `_size=1000&`;

        if (Object.keys(query).length !== 0) {
            for (const [key, value] of Object.entries(query)) {
                if (key !== 'brand' && key !== 'locale') {
                    queryString += `${key}=${value}&`;
                }
            }
        }

        // Field
        queryString += `_fields=bomId,finishedgoodId,sparepartId,sparepartInBom,quantity&`;
        // Search the right product code
        queryString += `finishedgoodId=${productCode}`;

        // Get spare parts
        const data: IOResponse<any> = await document.scrollDocuments(dataEntityName, queryString);

        // Check if total content is more than 1000 records
        const contentTotal: number = Number(data.headers['rest-content-total']);

        // Add token to query string
        const token: string = data.headers['x-vtex-md-token'];
        queryString += `&_token=${token}`;

        if (contentTotal > 1000) {
            let n_iterations: number = Math.ceil(contentTotal / 1000) - 1;

            while (n_iterations > 0) {
                // Get spare parts
                let res: IOResponse<any> = await document.scrollDocuments(dataEntityName, queryString);

                // Update data
                data.data.push(...await res.data);

                // Update iteration
                n_iterations--;
            }
        }

        // Exhaust token
        await document.scrollDocuments(dataEntityName, queryString);

        const scrollResult: Array<scrollResponse> = await data.data;

        // Get spare parts
        const sparePartIds: Array<string> = scrollResult.map((item: scrollResponse) => item.sparepartId);

        // Init spareParts
        let spareParts: Array<sparePart> = [];

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
            //let items: ProductSearch[] = (await search.searchProductsBySpecification(JSON.parse(`${process.env.SETTINGS}`).SPARE_JCODE_ID, sparePartIds.slice(start, end), 0, 49, brandCode)).data;
            const items: ProductSearch[] = (await search.searchProductsByReference(sparePartIds.slice(start, end), 0, 49, brandCode)).data
            spareParts.push(...items);

            // Add mapping familyGroup name and category ID to all mappings
            for (let item of items) {
                // Eventually replace the spare with its substitute
                if (item.substitute !== undefined && item.substitute[0] !== undefined && item.substitute[0].length > 0) {
                    const substituteJCode = item.substitute[0].toString()
                    const substituteQuantity = (item.substitute[1] === undefined || item.substitute[1].trim().length <= 0) ? "1" : item.substitute[1].toString()
                    const substitute = (await search.searchProductsByReference([substituteJCode], 0, 49, brandCode)).data
                    if (substitute.length > 0) {
                        spareParts.splice(spareParts.indexOf(item), 1)
                        let sub: sparePart = JSON.parse(JSON.stringify(substitute[0]))
                        sub.bomRelationships = []
                        scrollResult.filter((scrollValue) => {
                            return scrollValue.sparepartId === item.productReference
                        }).forEach(bomRel => {
                            if (sub.bomRelationships?.find(bom => (bom.finishedgoodId === bomRel.finishedgoodId && bom.sparepartId === bomRel.sparepartId && bom.sparepartInBom === bomRel.sparepartInBom && bom.bomId === bomRel.bomId)) === undefined) {
                                sub.bomRelationships?.push(bomRel)
                            }
                        })
                        sub.bomRelationships?.forEach((bom) => {
                            bom.sparepartId = substituteJCode
                            bom.quantity = substituteQuantity
                        })
                        spareParts.push(sub)

                        if (substitute[0].familyGroup && substitute[0].familyGroup[0] && substitute[0].familyGroup[0].toLowerCase() !== 'ohne' && substitute[0].familyGroup[0].toLowerCase() !== 'without') {
                            familyGroupMapping[substitute[0].familyGroup[0]] = Number(substitute[0].categoryId);
                        }
                    }
                } else {
                    if (item.familyGroup && item.familyGroup[0] && item.familyGroup[0].toLowerCase() !== 'ohne' && item.familyGroup[0].toLowerCase() !== 'without') {
                        familyGroupMapping[item.familyGroup[0]] = Number(item.categoryId);
                    }
                }
            }

            // Update iteration parameters
            n_iterations--;
        }

        // Add familyGroupMapping to categoryIds
        categoryIds.add(familyGroupMapping);
        // Map each spare part to its corresponding bom relationships
        spareParts.forEach((sparePart) => {
            if (sparePart.bomRelationships === undefined) {
                sparePart.bomRelationships = []
                scrollResult.filter((scrollValue) => {
                    return scrollValue.sparepartId === sparePart.productReference
                }).forEach(bomRel => {
                    if (sparePart.bomRelationships?.find(bom => (bom.finishedgoodId === bomRel.finishedgoodId && bom.sparepartId === bomRel.sparepartId && bom.sparepartInBom === bomRel.sparepartInBom && bom.bomId === bomRel.bomId)) === undefined) {
                        sparePart.bomRelationships?.push(bomRel)
                    }
                })
            }
        })

        // Filter duplicated spare parts
        const sparePartsFiltered: Array<sparePart> = [];
        spareParts.forEach((sparePart: sparePart) => {
            if (!sparePartsFiltered.map(item => item.productId).includes(sparePart.productId)) {
                sparePartsFiltered.push(sparePart)
            } else {
                const sp = sparePartsFiltered.filter((spare) => {
                    return spare.productId === sparePart.productId
                })

                sparePart.bomRelationships?.forEach((bomRel) => {
                    if (sparePartsFiltered[sparePartsFiltered.indexOf(sp[0])].bomRelationships?.find(bom => (bom.finishedgoodId === bomRel.finishedgoodId && bom.sparepartId === bomRel.sparepartId && bom.sparepartInBom === bomRel.sparepartInBom && bom.bomId === bomRel.bomId)) === undefined) {
                        sparePartsFiltered[sparePartsFiltered.indexOf(sp[0])].bomRelationships?.push(bomRel)
                    }
                })
            }
        })
        spareParts = sparePartsFiltered

        //Translate spares in the locale
        for (const spare of sparePartsFiltered) {
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
        }

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


// GET /v1/bom/search/:productCode
// BOM search
export async function searchBom(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: {route: {params: {productCode}}},
            query,
            clients: {document, search}
        } = ctx;

        // Map brand
        const mapBrand: any = {
            'whirlpool': 1,
            'bauknecht': 2,
            'indesit': 3,
        }
        // Get brand
        let brandName: string | null = null;

        if (ctx.header['x-forwarded-host']) {
            brandName = ctx.header['x-forwarded-host'].toString().split('.')[1].toLowerCase()
        }

        let brandCode: number = 0;

        if (brandName === 'whirlpool' || brandName === 'bauknecht' || brandName === 'indesit') {
            brandCode = mapBrand[brandName];
        } else {
            brandCode = mapBrand[query.brand.toString().toLocaleLowerCase()];
        }

        // Set name of Data Entity
        const dataEntityName: string = 'BM';

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
        queryString += `finishedgoodId=${productCode}`;

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
            query: {brand},
            clients: {search}
        } = ctx;

        // Map brand
        const mapBrand: any = {
            'whirlpool': 1,
            'bauknecht': 2,
            'indesit': 3,
        }
        // Get brand
        let brandName: string | null = null;

        if (ctx.header['x-forwarded-host']) {
            brandName = ctx.header['x-forwarded-host'].toString().split('.')[1].toLowerCase()
        }

        let brandCode: number = 0;

        if (brandName === 'whirlpool' || brandName === 'bauknecht' || brandName === 'indesit') {
            brandCode = mapBrand[brandName];
        } else {
            brandCode = mapBrand[brand.toString().toLocaleLowerCase()];
        }

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
