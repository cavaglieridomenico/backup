var env = pm.request.url.host[0];
if(env == "api"){
    env = pm.request.url.path[0];
}
switch (env) {
    case "itwhirlpool": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-itwhirlpool-YKHNOZ' })
        pm.request.headers.add({ key: 'X-VTEX-API-AppToken', value: 'SSUBFODAEAHOAJGTKHQCDKSPEGFFIOESKDESZSVSATMETJPLFSNZQFDHAEXYIYSQVPEWFNUSLXCKYOVUQUZPAFCEAWSUUXJBBVIEESFSYVOSDSJMICIOYCQQNAWIVAXO' })
        break;
    }
    case "itwhirlpoolqa": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-itwhirlpoolqa-SETTVR' })
        pm.request.headers.add({ key: 'X-VTEX-API-AppToken', value: 'IZQLNOEVVJGXTAQPMNBMQWOGJYLYVWHEEHMCHEBQAJYMMTBSCPLWNBILLJBPCFAYCBSLOOIHMKMGYBUPWTWGLKQDZARXCMNUJZJKAPENGDKCOBMJPLSJITNRKPMNXLFZ' })
        break
    }
    case "ruwhirlpoolqa": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-ruwhirlpoolqa-AIHWUB' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'TIRFJIUDXGCJUZPCGOIOUUZOKQGEAOXOIVGWLRFORGCDBDTVPDRGMXDYJDVSBQCJINAYTTQOIUWORVMHXKOWXRCKRHMIWMMBDTVOCUBVMCXSBPHOQNVQBGMQLPHMHISW'
        })
        break
    }
    case "ruwhirlpool": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-ruwhirlpool-ZRRZBV' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'MJSOJAPHHFPCSZQMAAVACENUEAXRMMSQUKLOZMGFDXQAJMQINYVRLWEIVYKICYVUMZIHOCNOTQXENNKRKPDORAEYGCSBBYCECWNKEJUKKGXVYAVIOSXNUGDLUJBLJMNU'
        })
        break
    }
    case "frwhirlpoolqa": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-frwhirlpoolqa-GESKRY' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'QTGIQJQBQVBBZIABCRYNRSPSWJDCFLWSTUXVJXTSDSHTZTKBXXKACKRYDOLGGOWEYJHFLEREXFJZKVSDZBEIAWPJCYRVLNMOWCVQLEQSFFCXASNIVIHEKOECTYCMNWSK'
        })
        break
    }
    case "frwhirlpool": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-frwhirlpool-GZCPNL' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'XLDJZIGVYFNRPXKIHRNGNSTFCNRNRWPFUPGNCSZTOUSTEJBYHBTCHQPFRYHMRSDBPHXZRXGORUSTAZBSLTGQDMXDZBVDLNBVRQEWLBGJUELNYWESXOAYMMYCKTAQCCDD'
        })
        break
    }
    case "indesitukqa": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-indesitukqa-YDMRFY' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'LNFGSFSXSKBNUWOXBOSMZDJRCSHTKBSYMKMKBWRPDBJKGMLZGOCUANCIDODZXZMRSCBJJDWFWCJXTYKPGINWYYYYHDHNSSRDOSSDKCPCRXYXEFOEDNTPMQSTEDBFVJME'
        })
        break
    }
    case "indesituk": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-indesituk-NWOYCS' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'HQAARXCUXEFWAULDXWDYXETZNIPAPJTGXWDGPKUGLKWBKUHDOQVHZJNDXBNJIBENKYYEREONCXNMHRPSALMYNLHOIZJNWLXJGJQLVDMJCIFCWBVFMVIXPFZZRKVRUAQR'
        })
        break
    }
    case "hotpointit": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-hotpointit-INZJFJ' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'QCABLVHTDVRXALJPDTOJRDILYSJXEGFCTAQFQTJNPKGGWKLBVNUPGYOMUPCSMKPWQODAVEYKJATGXCONGHBRLPVVMDLBQQBFVJQHHLGROKFFEHPSAOLEIYLATHNRTXTT'
        })
        break
    }
    case "hotpointitqa": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-hotpointitqa-EPFPPN' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'DILJGPARWWWUXBGKRDYODOYFSWTHJOFUUMKJWZJMIRYGTPWZKCLBDJFPKFRKWTHIQBALRWNRTMGMQRLCATXHDDRKGUZQIZQPJQPSPKINOTIQDTZSUOJCWAFNJPEWXWJT'
        })
        break
    }
    case "hotpointukqa": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-hotpointukqa-VZOBMM' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'RQDLMPKEFKDAFPOXVFFTEFGCKIVJWYTKSSWGDXLHJUONQTHUWFEMDVCMKBBDTAHHQTINSIUXTXJKQSLQBBNQUHGXQKWBWINJMHXWLTBNLGSGLRVRPKCSNRNJNKWHLSBL'
        })
        break
    }
    case "hotpointuk": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-hotpointuk-PFCSOM' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'ZFCPHJKYEKXKHTJZCHENPUNIJMXIYFFGYWYAADJDUSTJIJFSGROWIBGERUFUMBZYERMLUIYYYBSXBEZZHEBHRIXWQTJGYOQTSUERXUYYSPYHIIDNVFNIASGWUQVAYSAJ'
        })
        break
    }
    case "smartcsb2cqa": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-smartcsb2cqa-MDDNZA' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'PMZHEGPKXAVTJSCQEGMPWNMMLNTWRQETSNRUDEVRKVLOPYBJEONPMEVCAMWQMTTHVBAWBIMAKVEBBYXMLJRCCPHORPTRHEERBETNYFIWBNERAUACOKEDBREFTMEMOVTG'
        })
        break
    }
    case "smartcsb2c": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-smartcsb2c-ROLPZO' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'ILHJNGTLBAOBAJZRAJFBQLSYIXEQNBDRSZTQPEUYOPPURMQVXUBDIRVXTIAPBCYZWWJAPJBWOGNBVYGWHISTAZIAEWWHDEWMQQXVDPGOSFPBEUBVBEISJFZWNIWTMUSK'
        })
        break
    }
    case "frccwhirlpool": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-frccwhirlpool-TLEGNP' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'PLCALEQQTDIREVQHZGGEHSFUCRXMCXZRERHFWAYBZQLDDOVNIUNXQHWWFIYUGDOWERNMOLLYHEEQGCQNWJEHKBBWVKZNCEUWCPZMBIZWJOPLDFQCSKYWYGMCPQQDLXVD'
        })
        break
    }
    case "frccwhirlpoolqa": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-frccwhirlpoolqa-XVPFIN' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'PXFKJDNHAVUTNTJPGYQDRUWXDFCWNJQDNFJDZFPOUNICQLJCTVUAHGPVAIGDBQTQFQGIKFQAIBJELUGRVADSPQVGPNCRYMNETRWAFBRNFTSGXLKGBPIBNBBPUZSWDZBW'
        })
        break
    }
    case "frccwhirlpool": {
        pm.request.headers.add({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-frccwhirlpool-TLEGNP' })
        pm.request.headers.add({
            key: 'X-VTEX-API-AppToken', value: 'PLCALEQQTDIREVQHZGGEHSFUCRXMCXZRERHFWAYBZQLDDOVNIUNXQHWWFIYUGDOWERNMOLLYHEEQGCQNWJEHKBBWVKZNCEUWCPZMBIZWJOPLDFQCSKYWYGMCPQQDLXVD'
        })
        break
    }
    default:
        console.log(env);
}