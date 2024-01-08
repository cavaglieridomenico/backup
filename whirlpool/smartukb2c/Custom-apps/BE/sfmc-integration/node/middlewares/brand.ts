// Analyzes the body of the order or use anothe API to get the brand of the product that was ordered -> TO DO
export function getBrand(order: any) {
    let brandName: string = '';    
    if (Number(order.salesChannel) === 1) {
        brandName = 'hotpoint';
    } else if (Number(order.salesChannel) === 2) {
        brandName = 'indesit';
    }
    return brandName;
}
