

export async function setBrand(ctx: Context, next: () => Promise<any>) {

    const { query } = ctx;


    // Map brand
    const mapBrand: any = {
        'hotpoint': 1,
        'indesit': 2
    }
    // Get brand
    let brandName: string | null = null;

    if (ctx.header['x-forwarded-host']) {
        brandName = ctx.header['x-forwarded-host'].toString().split('.')[1].toLowerCase()
    }

    let brandCode: number = 0;

    console.log(`brandname is ${brandName}`)

    if (brandName === 'hotpoint' || brandName === 'indesit') {
        brandCode = mapBrand[brandName];
    } else {
        brandCode = mapBrand[query.brand.toString().toLocaleLowerCase()];
    }

    console.log(`brandCode is ${brandCode}`)
    console.log(`brandCode is ${brandCode.toString()}`)

    process.env.brandCode = brandCode.toString();

    await next()
}