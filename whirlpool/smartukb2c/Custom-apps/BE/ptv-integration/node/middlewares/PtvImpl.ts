import { ptvResponse } from "../typings/PtvResponse";
import { Address } from "../interfaces/Address";

export async function ptvPostalImpl(ctx: Context, next: () => Promise<any>) {

  const regions = [{"Ctr":"GB","key":"AB","value":"Aberdeenshire"},{"Ctr":"GB","key":"AL","value":"Anglesey"},{"Ctr":"GB","key":"AN","value":"Angus"},{"Ctr":"GB","key":"AR","value":"Ards"},{"Ctr":"GB","key":"AG","value":"Argyll"},{"Ctr":"GB","key":"AV","value":"Avon"},{"Ctr":"GB","key":"AY","value":"Ayrshire"},{"Ctr":"GB","key":"BA","value":"Ballymena"},{"Ctr":"GB","key":"BY","value":"Ballymoney"},{"Ctr":"GB","key":"BN","value":"Banbridge"},{"Ctr":"GB","key":"BF","value":"Banffshire"},{"Ctr":"GB","key":"BS","value":"Bath&NthEstSomerset"},{"Ctr":"GB","key":"BE","value":"Bedfordshire"},{"Ctr":"GB","key":"BL","value":"Belfast"},{"Ctr":"GB","key":"BK","value":"Berkshire"},{"Ctr":"GB","key":"BW","value":"Berwickshire"},{"Ctr":"GB","key":"BB","value":"Blackburn"},{"Ctr":"GB","key":"BP","value":"Blackpool"},{"Ctr":"GB","key":"BO","value":"Borders"},{"Ctr":"GB","key":"BM","value":"Bournemouth"},{"Ctr":"GB","key":"BH","value":"Brighton & Hove"},{"Ctr":"GB","key":"BR","value":"Bristol"},{"Ctr":"GB","key":"BU","value":"Buckinghamshire"},{"Ctr":"GB","key":"BT","value":"Buteshire"},{"Ctr":"GB","key":"CF","value":"Caernarfonshire"},{"Ctr":"GB","key":"CT","value":"Caithness"},{"Ctr":"GB","key":"CA","value":"Cambridgeshire"},{"Ctr":"GB","key":"CD","value":"Cardiganshire"},{"Ctr":"GB","key":"CB","value":"Carmarthenshire"},{"Ctr":"GB","key":"CR","value":"Carrickfergus"},{"Ctr":"GB","key":"CS","value":"Castlereagh"},{"Ctr":"GB","key":"CE","value":"Central"},{"Ctr":"GB","key":"CH","value":"Cheshire"},{"Ctr":"GB","key":"CN","value":"Clackmannanshire"},{"Ctr":"GB","key":"CV","value":"Cleveland"},{"Ctr":"GB","key":"CL","value":"Clwyd"},{"Ctr":"GB","key":"CI","value":"Coleraine"},{"Ctr":"GB","key":"CK","value":"Cookstown"},{"Ctr":"GB","key":"CO","value":"Cornwall"},{"Ctr":"GB","key":"AT","value":"County Antrim"},{"Ctr":"GB","key":"AM","value":"County Armagh"},{"Ctr":"GB","key":"DN","value":"County Down"},{"Ctr":"GB","key":"DU","value":"County Durham"},{"Ctr":"GB","key":"FM","value":"County Fermanagh"},{"Ctr":"GB","key":"LD","value":"County Londonderry"},{"Ctr":"GB","key":"TY","value":"County Tyrone"},{"Ctr":"GB","key":"CG","value":"Craigavon"},{"Ctr":"GB","key":"CM","value":"Cromartyshire"},{"Ctr":"GB","key":"CU","value":"Cumbria"},{"Ctr":"GB","key":"DL","value":"Darlington"},{"Ctr":"GB","key":"DD","value":"Denbighshire"},{"Ctr":"GB","key":"DB","value":"Derbyshire"},{"Ctr":"GB","key":"DV","value":"Devon"},{"Ctr":"GB","key":"DO","value":"Dorset"},{"Ctr":"GB","key":"DF","value":"Dumfriesshire"},{"Ctr":"GB","key":"DT","value":"Dunbartonshire"},{"Ctr":"GB","key":"DG","value":"Dungannon"},{"Ctr":"GB","key":"DY","value":"Dyfed"},{"Ctr":"GB","key":"EL","value":"East Lothian"},{"Ctr":"GB","key":"ER","value":"East Riding"},{"Ctr":"GB","key":"SE","value":"East Sussex"},{"Ctr":"GB","key":"ES","value":"Essex"},{"Ctr":"GB","key":"FI","value":"Fife"},{"Ctr":"GB","key":"FL","value":"Flintshire"},{"Ctr":"GB","key":"GL","value":"Gloucestershire"},{"Ctr":"GB","key":"GR","value":"Grampian"},{"Ctr":"GB","key":"LO","value":"Greater London"},{"Ctr":"GB","key":"GM","value":"Greater Manchester"},{"Ctr":"","key":"GUE","value":"Guernsey"},{"Ctr":"GB","key":"GW","value":"Gwent"},{"Ctr":"GB","key":"GY","value":"Gwynedd"},{"Ctr":"GB","key":"HL","value":"Halton"},{"Ctr":"GB","key":"HA","value":"Hampshire"},{"Ctr":"GB","key":"HR","value":"Hartlepool"},{"Ctr":"GB","key":"HW","value":"Herefordshire"},{"Ctr":"GB","key":"HT","value":"Hertfordshire"},{"Ctr":"GB","key":"HI","value":"Highland"},{"Ctr":"GB","key":"HU","value":"Huntingdonshire"},{"Ctr":"GB","key":"IN","value":"Inverness-shire"},{"Ctr":"GB","key":"IOL","value":"Isle of Lewis"},{"Ctr":"","key":"ISM","value":"Isle of Man"},{"Ctr":"GB","key":"IW","value":"Isle of Wight"},{"Ctr":"","key":"JER","value":"Jersey"},{"Ctr":"GB","key":"KE","value":"Kent"},{"Ctr":"GB","key":"KI","value":"Kincardineshire"},{"Ctr":"GB","key":"KH","value":"Kingston-upon-Hull"},{"Ctr":"GB","key":"KN","value":"Kinross-shire"},{"Ctr":"GB","key":"KK","value":"Kirkcudbrightshire"},{"Ctr":"GB","key":"LN","value":"Lanarkshire"},{"Ctr":"GB","key":"LA","value":"Lancashire"},{"Ctr":"GB","key":"LR","value":"Larne"},{"Ctr":"GB","key":"LC","value":"Leicester City"},{"Ctr":"GB","key":"LE","value":"Leicestershire"},{"Ctr":"GB","key":"LM","value":"Limavady"},{"Ctr":"GB","key":"LI","value":"Lincolnshire"},{"Ctr":"GB","key":"LS","value":"Lisburn"},{"Ctr":"GB","key":"LND","value":"London"},{"Ctr":"GB","key":"LT","value":"Lothian"},{"Ctr":"GB","key":"LU","value":"Luton"},{"Ctr":"GB","key":"MA","value":"Magherafelt"},{"Ctr":"GB","key":"ME","value":"Merioneth"},{"Ctr":"GB","key":"MY","value":"Merseyside"},{"Ctr":"GB","key":"MG","value":"Mid Glamorgan"},{"Ctr":"GB","key":"MI","value":"Middlesbrough"},{"Ctr":"GB","key":"MX","value":"Middlesex"},{"Ctr":"GB","key":"MD","value":"Midlothian"},{"Ctr":"GB","key":"MK","value":"Milton Keynes"},{"Ctr":"GB","key":"MM","value":"Monmouthshire"},{"Ctr":"GB","key":"MT","value":"Montgomeryshire"},{"Ctr":"GB","key":"MR","value":"Morayshire"},{"Ctr":"GB","key":"MO","value":"Moyle"},{"Ctr":"GB","key":"NR","value":"Nairnshire"},{"Ctr":"GB","key":"NB","value":"Newbury"},{"Ctr":"GB","key":"NM","value":"Newry and Mourne"},{"Ctr":"GB","key":"NA","value":"Newtownabbey"},{"Ctr":"GB","key":"NK","value":"Norfolk"},{"Ctr":"GB","key":"ND","value":"North Down"},{"Ctr":"GB","key":"NHS","value":"North Humberside"},{"Ctr":"GB","key":"NL","value":"North Lincolnshire"},{"Ctr":"GB","key":"NS","value":"North Somerset"},{"Ctr":"GB","key":"YN","value":"North Yorkshire"},{"Ctr":"GB","key":"NH","value":"Northamptonshire"},{"Ctr":"GB","key":"NU","value":"Northumberland"},{"Ctr":"GB","key":"NC","value":"Nottingham City"},{"Ctr":"GB","key":"NT","value":"Nottinghamshire"},{"Ctr":"GB","key":"NE","value":"NthEast Lincolnshire"},{"Ctr":"GB","key":"OM","value":"Omagh"},{"Ctr":"GB","key":"OR","value":"Orkney"},{"Ctr":"GB","key":"OX","value":"Oxfordshire"},{"Ctr":"GB","key":"PE","value":"Peeblesshire"},{"Ctr":"GB","key":"PR","value":"Perthshire"},{"Ctr":"GB","key":"PB","value":"Peterborough"},{"Ctr":"GB","key":"PY","value":"Plymouth"},{"Ctr":"GB","key":"PL","value":"Poole"},{"Ctr":"GB","key":"PM","value":"Portsmouth"},{"Ctr":"GB","key":"PO","value":"Powys"},{"Ctr":"GB","key":"RA","value":"Radnorshire"},{"Ctr":"GB","key":"RE","value":"Reading"},{"Ctr":"GB","key":"RD","value":"Redcar and Cle"},{"Ctr":"GB","key":"RFS","value":"Renfrewshire"},{"Ctr":"GB","key":"RM","value":"Rochester up."},{"Ctr":"GB","key":"RO","value":"Ross-shire"},{"Ctr":"GB","key":"RX","value":"Roxburghshire"},{"Ctr":"GB","key":"RU","value":"Rutland"},{"Ctr":"GB","key":"SF","value":"Selkirkshire"},{"Ctr":"GB","key":"SL","value":"Shetland"},{"Ctr":"GB","key":"SH","value":"Shropshire"},{"Ctr":"GB","key":"SO","value":"Somerset"},{"Ctr":"GB","key":"SG","value":"South Glamorgan"},{"Ctr":"GB","key":"YS","value":"South Yorkshire"},{"Ctr":"GB","key":"SP","value":"Southampton"},{"Ctr":"GB","key":"SD","value":"Southend"},{"Ctr":"GB","key":"ST","value":"Staffordshire"},{"Ctr":"GB","key":"GS","value":"Sth. Glouceste"},{"Ctr":"GB","key":"SV","value":"Stirlingshire"},{"Ctr":"GB","key":"SN","value":"Stockton-on-Tees"},{"Ctr":"GB","key":"SR","value":"Strabane"},{"Ctr":"GB","key":"SC","value":"Strathclyde"},{"Ctr":"GB","key":"SK","value":"Suffolk"},{"Ctr":"GB","key":"SY","value":"Surrey"},{"Ctr":"GB","key":"SX","value":"Sussex"},{"Ctr":"GB","key":"SU","value":"Sutherland"},{"Ctr":"GB","key":"TA","value":"Tayside"},{"Ctr":"GB","key":"TD","value":"Thamesdown"},{"Ctr":"GB","key":"TH","value":"Thurrock"},{"Ctr":"GB","key":"TO","value":"Torbay"},{"Ctr":"GB","key":"TW","value":"Tyne and Wear"},{"Ctr":"GB","key":"WT","value":"Warrington"},{"Ctr":"GB","key":"WA","value":"Warwickshire"},{"Ctr":"GB","key":"WG","value":"West Glamorgan"},{"Ctr":"GB","key":"WK","value":"West Lothian"},{"Ctr":"GB","key":"WM","value":"West Midlands"},{"Ctr":"GB","key":"SW","value":"West Sussex"},{"Ctr":"GB","key":"YW","value":"West Yorkshire"},{"Ctr":"GB","key":"WL","value":"Western Isles"},{"Ctr":"GB","key":"WE","value":"Westmorland"},{"Ctr":"GB","key":"WTS","value":"Wigtownshire"},{"Ctr":"GB","key":"WI","value":"Wiltshire"},{"Ctr":"GB","key":"WD","value":"Windsor & Maid"},{"Ctr":"GB","key":"WO","value":"Wokingham"},{"Ctr":"GB","key":"WC","value":"Worcestershire"},{"Ctr":"GB","key":"WR","value":"Wrekin"},{"Ctr":"GB","key":"YK","value":"York"},{"Ctr":"GB","key":"YOR","value":"Yorkshire"}];

  const stateReplace = (state: String) => {
    console.log("state replace");
    
    const region = regions.find(el => el.value.toUpperCase() === state);
    if (region) {
      return region.key
    } else {
      return ''
    }
  }

  const buildAddressObject = (ptv: ptvResponse): Address => {
    console.log("buildAddressObject");
    return {
      addressId: ptv.id,
      postalCode: ptv.zip.trim(),
      city: ptv.city,
      state: stateReplace(ptv.state),
      country: "UK",
      street: ptv.address1,
      number: ptv.housenumber,
      neighborhood: ptv.district.trim().length <= 0 ? null : ptv.district.trim(),
      complement: null,
      reference: null
      
    }
    
  }
  
  const response = async (body: any, statusCode?: number, errorMessage?: string) => {
    console.log("response");
    ctx.body = body;
    if(errorMessage) ctx.body = { "errorMessage": errorMessage };
    ctx.status = statusCode ? statusCode : 400;
    ctx.set("Cache-Control", "no-store");
    await next();
    return;
  }

  const removeDuplication = (body: Address[]): Address[] => {
    const newArray: Address[] = [];

    body.forEach(address => {
      if(!newArray.some(x => x.number == address.number)){
        newArray.push(address);
      }
    });

    return newArray;
  }

  const sortAddress = (body: Address[]): Address[] => {
    body.sort((a, b) => (parseInt(a.number) > parseInt(b.number) ? 1 : ((parseInt(b.number) > parseInt(a.number)) ? -1 : 0)));
    return body;
  }

  const postDataProcessing = (body: Address[]) => {
    return sortAddress(removeDuplication(body));
  }

  const {
    vtex: { route: { params: { postalCode } } },
    clients:{ PTV }
  } = ctx;

  const appSettings = await ctx.clients.apps.getAppSettings('' + process.env.VTEX_APP_ID);
  process.env.VAR = JSON.stringify(appSettings);
  const ptvUsername = appSettings.ptvUsername;
  const ptvPassword = appSettings.ptvPassword;

  if(postalCode === undefined) {
    await response(null, 204, "Missing parameter: PostCode ")
  }

  let body: Address[] = [];
  const replyPtv: any = (await PTV.ptvGetPostal(postalCode.toString(), ptvUsername, ptvPassword))['address'];

  if(replyPtv != undefined) {
    if(Array.isArray(replyPtv)) {
      let responsePtv: ptvResponse[] = replyPtv;
      body = responsePtv.map(buildAddressObject);
      await response(postDataProcessing(body), 200);
    } else {
      body.push(buildAddressObject(replyPtv))
      await response(postDataProcessing(body), 200);
    }
  } else {
    await response(null, 204, "Not found any address on this PostCode");
  }
}
