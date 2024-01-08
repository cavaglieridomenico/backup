import { ptvResponse } from "../typings/PtvResponse";

export async function ptvPostalImpl(ctx: Context, next: () => Promise<any>) {
    const {
        vtex: { route: { params: { postalCode } } },
        clients:{PTV}
    } = ctx;

    const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);
    process.env.VAR = JSON.stringify(appSettings)
    let ptvUsername = appSettings.ptvUsername;
    let ptvPassword = appSettings.ptvPassword;

    if(postalCode === undefined){
        ctx.status = 400;

    }else{
        let replyPtv: any = (await PTV.ptvGetPostal(postalCode.toString(), ptvUsername, ptvPassword))['address'];
        console.log("replyptv = " + replyPtv);
        
        if(replyPtv !== undefined){


            let body: any[] = [];
            
            if(Array.isArray(replyPtv)){
                let responsePtv: ptvResponse[] = replyPtv;
                console.log("multiple addresses associated to a postalcode");
                responsePtv.forEach((ptv) => {
                    let houseNameNbr:string = '';

                    if (typeof ptv.housenumber == 'number') {
                        houseNameNbr +=  `${ptv.housenumber} `
                    } else if (typeof ptv.subBuilding == 'number') {
                        houseNameNbr +=  `${ptv.subBuilding} `
                    }

                    if (ptv.housename.length > 0) {
                        houseNameNbr +=  `${ptv.housename}`
                    }

                    const address = {
                        addressId: ptv.id,
                        postalCode: ptv.zip.trim(),
                        city: ptv.city,
                        state: ptv.state,
                        country: "UK",
                        street: ptv.address1,
                        number: houseNameNbr.trim(),
                        neighborhood: ptv.district.trim().length <= 0 ? null : ptv.district.trim(),
                        complement: null,
                        reference: null
                    }
                //remove duplicates
                if (address.number !== '' && !body.some(x => x.number === address.number)) {
                    body.push(address);
                }   
                //sort for number
                body.sort((a,b) => (parseInt(a.number) > parseInt(b.number)) ? 1 : ((parseInt(b.number) > parseInt(a.number)) ? -1 : 0));
                })
                ctx.body = body;
                ctx.status = 200;
            }else{
                //when there's only one address associated to a postalcode
                console.log("only one address associated to a postalcode: ");

                let houseNameNbr:string = '';

                if (typeof replyPtv.housenumber == 'number') {
                    houseNameNbr +=  `${replyPtv.housenumber} `
                } else if (typeof replyPtv.subBuilding == 'number') {
                    houseNameNbr +=  `${replyPtv.subBuilding} `
                }

                if (replyPtv.housename.length > 0) {
                    houseNameNbr +=  `${replyPtv.housename}`
                }
                body.push({
                    addressId: replyPtv.id,
                    postalCode: replyPtv.zip.trim(),
                    city: replyPtv.city,
                    state: replyPtv.state,
                    country: "UK",
                    street: replyPtv.address1,
                    number: houseNameNbr,
                    neighborhood: replyPtv.district.trim().length <= 0 ? null : replyPtv.district.trim(),
                    complement: null,
                    reference: null
                })
                
                ctx.body = body;
                ctx.status = 200;
            }
        }else{
            //INVALID POSTALCODE
            ctx.body = [];
            ctx.status = 200;
        }

    }
    ctx.set("Cache-Control", "no-store");

    await next();
}
