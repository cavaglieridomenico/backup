import { PaymentStatusVtex, WorldpayStatusToVtexMapping } from "./constants";

export function GetCreatePaymentStatus(status: string){
    let vtexStatus = PaymentStatusVtex.undefined
    if(WorldpayStatusToVtexMapping.approved.includes(status))
        vtexStatus = PaymentStatusVtex.approved;
    else if(WorldpayStatusToVtexMapping.denied.includes(status))
        vtexStatus = PaymentStatusVtex.denied;

    return vtexStatus;
}