import { ACCOUNT, ExternalClient, InstanceOptions } from "@vtex/api"
import { IOContext } from "@vtex/api/lib/service/worker/runtime/typings";
import { paginationArgsToHeaders } from "../utils/usefulFunctions";

const fetch = require("node-fetch")

export default class MD extends ExternalClient {
    constructor(context: IOContext, options?: InstanceOptions) {
        super(`https://${ACCOUNT}.vtexcommercestable.com.br`, context, {...options
        })
    }

    public async getSparePartId(whereCondition: any, page: number, pageSize: number,ctx:any) {
        let sortingValue = "sparePartId";
        let entity = "Bom_relationship";
        let schema = "main";
        let pagination = paginationArgsToHeaders(page,pageSize);

        const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID)
        try {
            let response = await fetch(`https://${ACCOUNT}.vtexcommercestable.com.br/api/dataentities/${entity}/search?_schema=${schema}&_where=${whereCondition}&_fields=sparePartId,familyGroup&_sort=${sortingValue}`, {
            headers: {
            "X-VTEX-API-AppKey": appSettings.VtexAppKey,
            "X-VTEX-API-AppToken": appSettings.VtexAppToken,
            "REST-Range": pagination
            }
        });
        response = await response.json()
        return response;

        } catch (err) {
        return err;
        } 
    }
}