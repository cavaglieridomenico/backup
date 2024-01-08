export const PromoResourceKey = "GerenciarPromocoesETarifas"
export const vbaseBucket = "generated_coupons"
export const defaultLocale = "it-IT"
export const maxRetries = 3
export const maxTime = 250

export const localeMap = {
    plwhirlpool: "pl-PL",
    plwhirlpoolqa: "pl-PL"
}

export const wait = (time: number) => {
    return new Promise<Boolean>((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, time);
    });
}

export const getCircularReplacer = () => {
    const seen = new WeakSet();
    return ({ }, value: any) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
}

export function stringify(data: any): string {
    return typeof data == "object" ? JSON.stringify(data, getCircularReplacer()) : data + "";
}
