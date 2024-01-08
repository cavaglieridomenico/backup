import {getError} from "./errors";
import {ProductSearch} from "../utils/typing";

// GET -> /v1/substitute/:productJCode?brand={brand}
// Get linkText of obsolete product's substitute
export async function substitute(ctx: Context, next: () => Promise<any>) {
    try {
        let {
            query: {brand},
            vtex: {route: {params: {productJCode}}},
            clients: {search},
        } = ctx;

        // MAP BRAND
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

        // Get product and substitute
        //const product: any = await search.searchProductBySpecification(JSON.parse(`${process.env.SETTINGS}`).SPARE_JCODE_ID, productJCode.toString(), brandCode);
        const product: any = (await search.searchProductsByReference([productJCode.toString()], 0, 49, brandCode)).data;

        if (product.length > 0 && product[0]['substitute'][0] !== undefined) {
            //const substitute: ProductSearch[] = await search.searchProductBySpecification(JSON.parse(`${process.env.SETTINGS}`).SPARE_JCODE_ID, product[0]['substitute'][0], brandCode);
            const substitute: ProductSearch[] = (await search.searchProductsByReference([product[0]['substitute'][0].toString()], 0, 49, brandCode)).data;
            const quantity: string = product[0]['substitute'][1] !== undefined ? product[0]['substitute'][1] : "1"

            ctx.body = {
                'linkTextSubstitute': `${substitute[0]['linkText']}?${product[0]['jCode']}`,
                'quantity': quantity
            };
        } else {
            ctx.status = 404
        }

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}
