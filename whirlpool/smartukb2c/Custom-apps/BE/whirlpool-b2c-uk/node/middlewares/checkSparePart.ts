import { ProductSearch, scrollResponse } from "../utils/typing";
import { getError } from "./errors";
import { utilitySearchSpecification } from './search'

// GET -> /v1/check/spare/:jCode/product/:productCode
export async function checkSparePart(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { jCode, productCode } } },
            clients: { document }
        } = ctx;

        // Init outcome
        let outcome: string = "false";

        // Set name of Data Entity
        const dataEntityName: string = 'BR';

        // Get finished good Industrial Code
        const product: ProductSearch = (await utilitySearchSpecification(ctx, false, productCode.toString()))[0];
        const productIndustrialCode: string = (product && product['industrialCode']) ? product['industrialCode'][0] : '';

        // Field
        const queryString = `?_fields=bomId,finishedgoodId,sparepartId,sparepartInBom,quantity&finishedgoodId=${productIndustrialCode}&sparepartId=${jCode}`;

        // Get spare parts
        const data: Array<scrollResponse> = await (await document.searchDocuments(dataEntityName, queryString, 0, 100)).data;

        // Check if any product was found
        if (data.length > 0) {
            outcome = 'true';
        } else {
            outcome = 'not found';
        }

        // Return response
        ctx.body = { outcome }

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}
