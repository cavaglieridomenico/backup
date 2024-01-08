import { getError } from './errors';

// -------------- GET THE STATUS (i.e. in stock, out of stock, etc...) SPECIFICATION OF A PRODUCT -------------- /
// GET -> /v1/productStatus/:productId
export async function getProductStatus(ctx: Context, next: () => Promise<any>) {
    try {
        const {
            vtex: { route: { params: { productId } } },
            clients: { productSpecification }
        } = ctx;

        const specifications = await productSpecification.getProductSpecification(Number(productId));

        let status: string | null = null;

        specifications.forEach((spec): string | void => {
            if (spec.Name.toLocaleLowerCase() === 'status') {
                status = spec.Value[0];
            }
        });

        ctx.body = {
            id: productId,
            status
        };

    } catch (error) {
        getError(error, ctx);
    }
    await next();
}

// Utility function to get the product status by id
export async function productStatusUtility(ctx: Context, next: () => Promise<any>, productId: number) {
    try {
        const {
            clients: { productSpecification }
        } = ctx;

        const specifications = await productSpecification.getProductSpecification(Number(productId));

        let status: string | null = null;

        specifications.forEach((spec): string | void => {
            if (spec.Name.toLocaleLowerCase() === 'status') {
                status = spec.Value[0];
            }
        });

        return {
            id: productId,
            status
        };

    } catch (error) {
        getError(error, ctx);
        await next();
        return null;
    }
}
