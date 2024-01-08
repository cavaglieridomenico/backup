export default function DatasForFetch(values: any, binding: string) {   
    const options: any = {year: "numeric", month: '2-digit', day: '2-digit' }

    binding == "1bbaf935-b5b4-48ae-80c0-346623d9c0c9" ? values.BindingAddress = "epp" : binding == "b9f7bf3a-c865-4169-8950-4fbb8b55ec09" ?  values.BindingAddress = "ff" : values.BindingAddress = "vip"
    
    return {
        ...values,
        PurchaseDate: values.PurchaseDate != "" ? values.PurchaseDate.toLocaleDateString('fr-FR', options): "",
        EndWarrantyExtension:  values.EndWarrantyExtension != "" ? values.EndWarrantyExtension.toLocaleDateString('fr-FR', options) : ""
    }
}
