export default function DatasForFetch(values: any, binding: string, bindingTheme: any, bindingTheme2: any,bindingTheme3: any, locale: any) {

    const options: any = { year: "numeric", month: '2-digit', day: '2-digit' }

    //props da tema e potrebbe non esserci, non required
    if (bindingTheme || bindingTheme2 || bindingTheme3) {
        if (binding == bindingTheme) { values.BindingAddress = "epp" }
        if (binding == bindingTheme2) { values.BindingAddress = "ff" }
        if (binding == bindingTheme3) { values.BindingAddress = "vip" }
    }
    else {
        values.BindingAddress = "o2p"
    }
    return {
        ...values,
        PurchaseDate: values.PurchaseDate != "" ?
            values.PurchaseDate.toLocaleDateString(locale, options) : "",
        EndWarrantyExtension: values.EndWarrantyExtension != "" ?
            values.EndWarrantyExtension.toLocaleDateString(locale, options) : ""
    }
}
