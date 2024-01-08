// import { json } from "co-body";
import { IOResponse } from "@vtex/api";
import { ProductSearch } from "../utils/typing";
import { getError } from "./errors";

// GET -> /v1/search?categoryIds={id1}/{id2}/{id3}/...
// Get products by category tree ids
export async function searchFilteredProducts(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            query: { categoryIds, salesChannel },
            clients: { search },
        } = ctx

        const data: ProductSearch[] = await (await search.searchFilteredProducts(categoryIds.toString(), Number(salesChannel))).data;
        ctx.body = data

    } catch (error) {
        getError(error, ctx);
    }

    await next();
}

// GET -> /v1/product?productId={productId}
// Get products by product id
export async function searchProductById(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            query: { productId },
            clients: { search },
        } = ctx

        const data: ProductSearch[] = await search.searchProductById(productId.toString());

        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }

    await next();
}

// GET -> /v1/search/bySpecification?specificationValue={specificationValue}&brand={brand}
// Get products by specification value
export async function searchProductBySpecification(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            query: { specificationValue }
        } = ctx;

        const res = await utilitySearchSpecification(ctx, false, specificationValue.toString());

        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}


// GET -> /v1/search/autocomplete?term={term}?brand={brand}
// Autocomplete
export async function autocomplete(ctx: Context, next: () => Promise<any>) {
    try {
        let {
            query: { term }
        } = ctx;

        const res = await utilitySearchSpecification(ctx, true, term.toString());

        ctx.body = res;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// GET -> /v1/search/collection?productClusterId={productClusterId}
// Get products by specification value
export async function searchProductByCollection(ctx: Context, next: () => Promise<any>) {
    try {
        let {
            query: { productClusterId, from, to },
            clients: { search },
        } = ctx;

        let data: IOResponse<ProductSearch[]> | ProductSearch[] = await search.searchProductByCollection(Number(productClusterId), Number(from), Number(to));
        data = data.data;
        ctx.body = data;

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}


// UTILITIES

// Function used in autocomplete to check if a code exists
const checkCode = (val: Array<string>): string => {
    if (val) {
        return val[0];
    } else {
        return '';
    }
}

// Utility for search by specification
export async function utilitySearchSpecification(ctx: Context, isAutocomplete: boolean, specificationValue: string) {
    try {

        // MAP THE PASSED VALUE TO SPECIFICATION ID AND NAME
        const mapSpecification = {
            // Products
            'commercialCode': JSON.parse(`${process.env.SETTINGS}`).COMMERCIAL_CODE_ID,
            'trimmedCode': JSON.parse(`${process.env.SETTINGS}`).TRIMMED_CODE_ID,
            'HANACode': JSON.parse(`${process.env.SETTINGS}`).HANA_CODE_ID,
            'indesitMaterialCode': JSON.parse(`${process.env.SETTINGS}`).INDESIT_MATERIAL_CODE_ID,
            'industrialCode': JSON.parse(`${process.env.SETTINGS}`).INDUSTRIAL_CODE_ID,
            'whirlpoolCode': JSON.parse(`${process.env.SETTINGS}`).WHIRLPOOL_CODE_ID,
            // Spare Parts
            'jCode': JSON.parse(`${process.env.SETTINGS}`).SPARE_JCODE_ID,
            'winner': JSON.parse(`${process.env.SETTINGS}`).SPARE_WINNER_ID,
            'looser': JSON.parse(`${process.env.SETTINGS}`).SPARE_LOOSER_ID,
            // Accessories
            'jCodeAccessories': JSON.parse(`${process.env.SETTINGS}`).ACCESSORIES_JCODE_ID,
            'winnerAccessories': JSON.parse(`${process.env.SETTINGS}`).ACCESSORIES_WINNER_ID,
            'looserAccessories': JSON.parse(`${process.env.SETTINGS}`).ACCESSORIES_LOOSER_ID
        }

        const sparePartsCodes = [
            JSON.parse(`${process.env.SETTINGS}`).SPARE_JCODE_ID,
            JSON.parse(`${process.env.SETTINGS}`).SPARE_WINNER_ID,
            JSON.parse(`${process.env.SETTINGS}`).SPARE_LOOSER_ID
        ];

        const finishedGoodsCodes = [
            JSON.parse(`${process.env.SETTINGS}`).COMMERCIAL_CODE_ID,
            JSON.parse(`${process.env.SETTINGS}`).TRIMMED_CODE_ID,
            JSON.parse(`${process.env.SETTINGS}`).HANA_CODE_ID,
            JSON.parse(`${process.env.SETTINGS}`).INDESIT_MATERIAL_CODE_ID,
            JSON.parse(`${process.env.SETTINGS}`).INDUSTRIAL_CODE_ID,
            JSON.parse(`${process.env.SETTINGS}`).WHIRLPOOL_CODE_ID
        ];

        specificationValue = specificationValue.toString().trim().toUpperCase();
        let specificationId: number = -1;
        const specialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]+/;

        // Removing special characters from the value
        while (specificationValue.match(specialCharacter)) {
            specificationValue = specificationValue.replace(specialCharacter, "");
        }

        // Products
        if (specificationValue.slice(0, 2) === '85') {
            specificationId = mapSpecification["HANACode"]; // ID 19
        } else if (specificationValue.slice(0, 2) === '86') {
            specificationId = mapSpecification["whirlpoolCode"]; // ID 22
        } else if (specificationValue.slice(0, 2) === 'FF') {
            specificationId = mapSpecification["commercialCode"] //ID 36;
        } else if (specificationValue.slice(0, 1) === 'F') {
            specificationId = mapSpecification["indesitMaterialCode"]; // ID 20
        } else if (specificationValue.slice(0, 1) === 'Q' || specificationValue.slice(0, 2) === '75' || specificationValue.slice(0, 2) === '76') {
            specificationId = mapSpecification["industrialCode"]; // 21
        }


        // Spare Parts
        else if (specificationValue.slice(0, 1) === 'J') {
            specificationId = mapSpecification["jCode"]; // ID 25
        } else if (specificationValue.slice(0, 2) === '48') {
            specificationId = mapSpecification["looser"]; // ID 27
        } else if (specificationValue.slice(0, 1) === 'C') {
            specificationId = mapSpecification["winner"]; // ID 26
        }
        // Products
        else {
            specificationId = mapSpecification["trimmedCode"]; // ID 33
        }


        specificationValue = specificationValue + '*';

        let brandCode = parseInt(typeof process.env.brandCode !== 'undefined' ? process.env.brandCode : '0');

        // Products
        if (finishedGoodsCodes.includes(specificationId)) {
            const resProducts: any = finishedGoodSpecificationSearch(ctx, isAutocomplete, specificationId, specificationValue, brandCode);
            return resProducts;
        }
        // Spare Parts
        else if (sparePartsCodes.includes(specificationId)) {
            const resSpare: any = sparePartsSpecification(ctx, isAutocomplete, specificationId, specificationValue, brandCode);
            return resSpare;
        }

    } catch (error) {
        getError(error, ctx);
    }
}

// Utility search finished good by specification value
const finishedGoodSpecificationSearch = async (ctx: Context, isAutocomplete: boolean, specificationId: number, specificationValue: string, brandCode: number) => {
    try {
        const { clients: { search } } = ctx;

        // Init final response
        const resFinal: ProductSearch[] = [];
        // Init preliminary result
        const resProducts: ProductSearch[] = [];

        // Handle Industrial Code - Commercial Code duality
        if (specificationId === JSON.parse(`${process.env.SETTINGS}`).INDUSTRIAL_CODE_ID || specificationId === JSON.parse(`${process.env.SETTINGS}`).TRIMMED_CODE_ID) {
            // Get products by Industrial and Commercial code
            const resIndustrial: ProductSearch[] = await search.searchProductBySpecification(JSON.parse(`${process.env.SETTINGS}`).INDUSTRIAL_CODE_ID, specificationValue, brandCode);
            const resTrimmed: ProductSearch[] = await search.searchProductBySpecification(JSON.parse(`${process.env.SETTINGS}`).TRIMMED_CODE_ID, specificationValue, brandCode);
            resProducts.push(...resIndustrial, ...resTrimmed);

        // Handle Whirlpool Code - HANA Code - Industrial Code
        } else if (specificationId === JSON.parse(`${process.env.SETTINGS}`).WHIRLPOOL_CODE_ID || specificationId === JSON.parse(`${process.env.SETTINGS}`).HANA_CODE_ID) {
            const resWhirlpool: ProductSearch[] = await search.searchProductBySpecification(JSON.parse(`${process.env.SETTINGS}`).WHIRLPOOL_CODE_ID, specificationValue, brandCode);
            const resHANA: ProductSearch[] = await search.searchProductBySpecification(JSON.parse(`${process.env.SETTINGS}`).HANA_CODE_ID, specificationValue, brandCode);
            const resIndustrial: ProductSearch[] = await search.searchProductBySpecification(JSON.parse(`${process.env.SETTINGS}`).INDUSTRIAL_CODE_ID, specificationValue, brandCode);
            resProducts.push(...resWhirlpool, ...resHANA, ...resIndustrial);

        } else {
            // Get products by code
            const products: ProductSearch[] = await search.searchProductBySpecification(specificationId, specificationValue, brandCode);
            resProducts.push(...products);

        }

        resProducts.forEach((product) => {
            if (!resFinal.map(product => {return product.productId}).includes(product.productId)) {
                resFinal.push(product);
            }
        })

        if (isAutocomplete) {
            return resFinal.map((product: any) => ({
                Type: 'product',
                Name: product.productName,
                Description: product.description,
                'Link Text': product.linkText,
                'commercialCode': checkCode(product['commercialCode']),
                'trimmedCode': checkCode(product['trimmedCode']),
                'HANACode': checkCode(product['HANACode']),
                'indesitMaterialCode': checkCode(product['indesitMaterialCode']),
                'industrialCode': checkCode(product['industrialCode']),
                'whirlpoolCode': checkCode(product['whirlpoolCode'])
            }))
        } else {
            return resFinal;
        }

    } catch (error) {
        getError(error, ctx);
        return null;
    }
}

// Utility search spare part by specification value
const sparePartsSpecification = async (ctx: Context, isAutocomplete: boolean, specificationId: number, specificationValue: string, brandCode: number) => {
    try {
        const { clients: { search } } = ctx;

        const resSpareParts: ProductSearch[] = [];

        // Handle WinnerCode - LooserCode Duality
        if (specificationId === JSON.parse(`${process.env.SETTINGS}`).SPARE_WINNER_ID || specificationId === JSON.parse(`${process.env.SETTINGS}`).SPARE_LOOSER_ID) {
            // Get products by Winner and Looser code
            const resWinner: ProductSearch[] = await search.searchProductBySpecification(JSON.parse(`${process.env.SETTINGS}`).SPARE_WINNER_ID, specificationValue, brandCode);
            const resLooser: ProductSearch[] = await search.searchProductBySpecification(JSON.parse(`${process.env.SETTINGS}`).SPARE_LOOSER_ID, specificationValue, brandCode);

            resSpareParts.push(...resWinner, ...resLooser);

        } else {
            // Get products by code
            const products: ProductSearch[] = await search.searchProductBySpecification(specificationId, specificationValue, brandCode);
            resSpareParts.push(...products);
        }

        let resAccessories: any = await accessoriesSpecification(ctx, isAutocomplete, specificationId, specificationValue, brandCode);

        // Check if accessory was already in spare
        const jcodesSpare: Array<string> = resSpareParts.map((item: any) => checkCode(item['jCode']));
        if (isAutocomplete) {
            resAccessories = resAccessories.filter((item: any) => !jcodesSpare.includes(item['jCode']));
        } else {
            resAccessories = resAccessories.filter((item: any) => !jcodesSpare.includes(checkCode(item['jCode'])));
        }

        if (isAutocomplete) {
            return [...resSpareParts.map((product: any) => ({
                Type: 'spare part',
                Name: product.productName,
                Description: product.description,
                'Link Text': product.linkText,
                'jCode': checkCode(product['jCode']),
                'winnerCode': checkCode(product['winnerCode']),
                'looserCode': checkCode(product['looserCode'])
            })), ...resAccessories]
        } else {
            return [...resSpareParts, ...resAccessories];
        }
    } catch (error) {
        getError(error, ctx);
        return null;
    }
}

// Utility search accessory by specification value
const accessoriesSpecification = async (ctx: Context, isAutocomplete: boolean, specificationId: number, specificationValue: string, brandCode: number) => {
    try {
        const { clients: { search } } = ctx;

        // Map accessories specification
        if (specificationValue.slice(0, 1) === 'J') {
            specificationId = JSON.parse(`${process.env.SETTINGS}`).ACCESSORIES_JCODE_ID;
        } else if (specificationValue.slice(0, 2) === '48') {
            specificationId = JSON.parse(`${process.env.SETTINGS}`).ACCESSORIES_LOOSER_ID;
        } else if (specificationValue.slice(0, 1) === 'C') {
            specificationId = JSON.parse(`${process.env.SETTINGS}`).ACCESSORIES_WINNER_ID;
        }

        const resAccesories: ProductSearch[] = [];

        // Handle WinnerCode - LooserCode Duality
        if (specificationId === JSON.parse(`${process.env.SETTINGS}`).ACCESSORIES_WINNER_ID || specificationId === JSON.parse(`${process.env.SETTINGS}`).ACCESSORIES_LOOSER_ID) {
            // Get products by Winner and Looser code
            const resWinner: ProductSearch[] = await search.searchProductBySpecification(JSON.parse(`${process.env.SETTINGS}`).ACCESSORIES_WINNER_ID, specificationValue, brandCode);
            const resLooser: ProductSearch[] = await search.searchProductBySpecification(JSON.parse(`${process.env.SETTINGS}`).ACCESSORIES_LOOSER_ID, specificationValue, brandCode);

            resAccesories.push(...resWinner, ...resLooser);

        } else {
            // Get products by code
            const products: ProductSearch[] = await search.searchProductBySpecification(specificationId, specificationValue, brandCode);
            resAccesories.push(...products);
        }

        if (isAutocomplete) {
            return resAccesories.map((product: any) => ({
                Type: 'accessory',
                Name: product.productName,
                Description: product.description,
                'Link Text': product.linkText,
                'jCode': checkCode(product['jCode']),
                'winnerCode': checkCode(product['winnerCode']),
                'looserCode': checkCode(product['looserCode'])
            }))
        } else {
            return resAccesories;
        }
    } catch (error) {
        getError(error, ctx);
        return null;
    }
}
