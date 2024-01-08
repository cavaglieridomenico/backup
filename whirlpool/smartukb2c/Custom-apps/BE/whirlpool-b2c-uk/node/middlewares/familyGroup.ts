import { getError } from './errors';
import { CategoryTreeResponse } from "@vtex/clients/build";
import { ProductSearch } from '../utils/typing';
//import { queries } from '../resolvers/category';

// Utils
interface FamilyGroups {
    Id: number;
    Name: string;
    Counter: number;
    Url: string;
    Image: string;
}

async function filterProducts(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            query: { categoryIds },
            clients: { search },
        } = ctx
        let brandCode = parseInt(typeof process.env.brandCode !== 'undefined' ? process.env.brandCode : '0');
        const data: ProductSearch[] = await (await search.searchFilteredProducts(categoryIds.toString(), brandCode)).data;

        return data;

    } catch (error) {
        getError(error, ctx);
        await next();
        return null;
    }
}

// -------------- GET ALL FAMILY GROUPS -------------- //
// GET -> /v1/family-group?categoryIds={id1}/{id2}/{id3}
export async function getFamilyGroups(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            query: { categoryIds, /*language,*/ },
            clients: { category, search }, // Get needed client from context
        } = ctx
        
        let brandCode = parseInt(typeof process.env.brandCode !== 'undefined' ? process.env.brandCode : '0');

        if (categoryIds !== 'undefined') {

            // Get category tree
            const categoryTreeResponse: CategoryTreeResponse[] = await category.getCategoryTree('3');
            // Map category IDs
            const categoriesIds = categoryIds.toString().split('/').map(item => Number(item));

            // Get third level category
            let currentLevel: CategoryTreeResponse[] = [...categoryTreeResponse];
            let i = 0;
            while (i < categoriesIds.length) {
                for (let level of currentLevel) {
                    if (level.id === categoriesIds[i]) {
                        currentLevel = level.children;
                        i++;
                        break;
                    }
                }
            }

            // Context settings for translation
            /*const locale: string = language.toString().trim().toLowerCase().includes('-ch') ? language.toString().trim() : language.toString().trim() + '-CH';
            ctx.vtex.locale = locale.toString();
            ctx.vtex.tenant = {locale: 'de-CH'};*/

            // Logic for finished goods and spare parts categories
            if (categoriesIds.length === 3) {
                // Get translation of parent categories
                /*let department_translated = await queries.categoryTranslation(String(categoriesIds[0]), locale.toString(), ctx);
                let firstParentCategory_translated = await queries.categoryTranslation(String(categoriesIds[1]), locale.toString(), ctx);
                let secondParentCategory_translated = await queries.categoryTranslation(String(categoriesIds[2]), locale.toString(), ctx);
                */
                // Init response
                const res: Array<FamilyGroups> = [];

                for (let familyGroup of currentLevel) {
                    // Get category path for familyGroup category
                    let familyGroupCategories = [...categoryIds.toString().split('/'), familyGroup.id];
                    let familyGroupIdsPath: string = familyGroupCategories.join('/');

                    // Remove useless bit from url
                    familyGroup.url = familyGroup.url.split('/').slice(3, 6).join('/');

                    // Get number of spare parts in family group
                    const data: any = await search.searchFilteredProducts(familyGroupIdsPath.toString(), brandCode);

                    if (data.headers.resources.split('/')[1] > 0) {
                        // Translate family group
                        /*if (language) {
                            // Get translation
                            const translationFamilyGroup = await queries.categoryTranslation(String(familyGroup.id), locale.toString(), ctx);

                            if (translationFamilyGroup.data) {
                                // Translated name
                                familyGroup.name = translationFamilyGroup.data?.category.name;
                                // Translated URL
                                let translatedUrl: Array<string> = familyGroup.url.split('/');
                                if (department_translated.data) {
                                    translatedUrl[0] = department_translated.data?.category.linkId.toLowerCase().replace(/ /g, '-')
                                }
                                if (firstParentCategory_translated.data) {
                                    translatedUrl[1] = firstParentCategory_translated.data?.category.linkId.toLowerCase().replace(/ /g, '-')
                                }
                                if (secondParentCategory_translated.data) {
                                    translatedUrl[2] = secondParentCategory_translated.data?.category.linkId.toLowerCase().replace(/ /g, '-')
                                }
                                translatedUrl[3] = translationFamilyGroup.data?.category.linkId.toLowerCase().replace(/-+/g, '-').replace(/ /g, '-');
                                familyGroup.url = translatedUrl.join('/');
                            }
                        }*/
                        // Update response
                        res.push({
                            Id: familyGroup.id,
                            Name: familyGroup.name,
                            Counter: data.headers.resources.split('/')[1],
                            Url: /*'/' + locale.split('-')[0] + '/' +*/ familyGroup.url.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                            Image: ''
                        })
                    }
                }
                ctx.body = res;
            }
            // Logic for accessories
            else {
                // Get translation of parent categories
                /*let department_translated = await queries.categoryTranslation(String(categoriesIds[0]), locale.toString(), ctx);
                let firstParentCategory_translated = await queries.categoryTranslation(String(categoriesIds[1]), locale.toString(), ctx);
                */
                // Init response
                const res: Array<FamilyGroups> = [];

                for (let familyGroup of currentLevel) {
                    // Get category path for familyGroup category
                    let familyGroupCategories = [...categoryIds.toString().split('/'), familyGroup.id];
                    let familyGroupIdsPath: string = familyGroupCategories.join('/');

                    // Remove useless bit from url
                    familyGroup.url = familyGroup.url.split('/').slice(3, 7).join('/');

                    // Get number of spare parts in family group
                    const data: any = await search.searchFilteredProducts(familyGroupIdsPath.toString(), brandCode);

                    if (data.headers.resources.split('/')[1] > 0) {
                        // Translate family group
                        /*if (language) {
                            // Get translation
                            const translationFamilyGroup = await queries.categoryTranslation(String(familyGroup.id), locale.toString(), ctx);

                            if (translationFamilyGroup.data) {
                                // Translated name
                                familyGroup.name = translationFamilyGroup.data?.category.name;
                                // Translated URL
                                let translatedUrl: Array<string> = familyGroup.url.split('/');
                                if (department_translated.data) {
                                    translatedUrl[0] = department_translated.data?.category.linkId.toLowerCase().replace(/ /g, '-')
                                }
                                if (firstParentCategory_translated.data) {
                                    translatedUrl[1] = firstParentCategory_translated.data?.category.linkId.toLowerCase().replace(/ /g, '-')
                                }
                                translatedUrl[2] = translationFamilyGroup.data?.category.linkId.toLowerCase().replace(/-+/g, '-').replace(/ /g, '-');
                                familyGroup.url = translatedUrl.join('/');
                            }
                        }*/
                        // Update response
                        res.push({
                            Id: familyGroup.id,
                            Name: familyGroup.name,
                            Counter: data.headers.resources.split('/')[1],
                            Url: /*'/' + locale.split('-')[0] + '/' +*/ familyGroup.url.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                            Image: ''
                        })
                    }
                }
                ctx.body = res;
            }
        } else {
            ctx.status = 404
            ctx.body = "Impossible to find requested categories '" + categoryIds + "'"
            return ctx.body
        }
    } catch (error) {
        getError(error, ctx);
    }
    await next();
}


// -------------- GET PRODUCT BY CATEGORY ID AND FAMILY GROUP FILTERING -------------- //
// GET -> /v1/product/:familyGroup?categoryIds={id1}/{id2}/{id3}
export async function productByfamilyGroupAndCategory(ctx: Context, next: () => Promise<any>) {
    let {
        vtex: { route: { params: { familyGroup: filter } } },
    } = ctx;

    const products: ProductSearch[] | null = await filterProducts(ctx, next);

    // Init products array
    const productsArr: Array<any> | null = []

    if (products !== null) {
        for (let product of products) {
            // Check if FamilyGroup exists on product
            if (product['familyGroup']) {
                if (product['familyGroup'][0] === filter) {
                    productsArr.push(product);
                }
            } else {
                return;
            }
        }
    }

    ctx.body = productsArr;

    await next();
}
