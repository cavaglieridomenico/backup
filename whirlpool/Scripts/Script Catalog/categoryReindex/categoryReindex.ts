// IMPORTANT TO RUN THIS SCRIPT USE THIS COMMAND: node --loader ts-node/esm ./categoryReindex.ts

//@ts-ignore
import fetch from 'node-fetch'

const ACCOUNT = "hotpointuk"
const SPECIFICATION_NAME = 'fewPiecesThreshold'
const [APP_KEY, APP_TOKEN] = returnCredential(ACCOUNT)

const OPTIONS = {
  method: "GET",
  headers: {
    "Accept": "application/json",
    "content-type": "application/json",
    'X-VTEX-API-AppKey': APP_KEY.value,
    'X-VTEX-API-AppToken': APP_TOKEN.value
  }
}

let optionsPost = {
  method: "POST",
  body: "",
  headers: { ...OPTIONS.headers }
}

main()

async function main() {
  try {
    const masterdataFullContent: any = await getCategoryProducts("1")

    // console.log(JSON.stringify(masterdataFullContent))

    const promiseResponses: Promise<String>[] = masterdataFullContent.map((skuId: any) => getSpecification(skuId))
    const responses = await Promise.all(promiseResponses)
    console.log(JSON.stringify(responses))

    // const promiseUpdateSpecificationResponses: Promise<boolean>[] = masterdataFullContent.map((skuId: any, index: number) => updateSpecification(skuId, responses[index]))
    // const updateSpecificationResponses = await Promise.all(promiseUpdateSpecificationResponses)
    // console.log(JSON.stringify(updateSpecificationResponses))
  } catch (err) {
    console.log(err)
  }

}

async function getCategoryProducts(categoryId: string) {
  let getCategoryProducts = []
  let from: number = 1, to: number = 50, totalProduct: number = 3000;
  try {

    do {
      const { dataResponse, range } = await performAPIcall(categoryId, from, to)
      from += 50
      to += 50
      totalProduct = range.total
      console.log(range)
      getCategoryProducts = getCategoryProducts.concat(dataResponse)

    } while (totalProduct >= from)
  } catch (err) {
    console.error(err)
  }

  return getCategoryProducts
}

function performAPIcall(categoryId: string, from: number, to: number): Promise<{ dataResponse: any[], range: any }> {
  return new Promise(async (resolve, reject) => {
    fetch(`https://${ACCOUNT}.vtexcommercestable.com.br/api/catalog_system/pvt/products/GetProductAndSkuIds?categoryId=${categoryId}&_from=${from}&_to=${to}`, OPTIONS)
      .then((mdResponse) => {
        if (mdResponse.ok) {
          mdResponse.json().then((response: any) => {
            // console.log(response)
            resolve({
              dataResponse: Object.keys(response?.data).map((field: any) => field),
              range: response.range
            })
          })
        } else {
          reject(mdResponse)
        }
      })
      .catch(err => {
        reject(err)
      })

  })
}

function getSpecification(productId: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    fetch(`https://${ACCOUNT}.vtexcommercestable.com.br/api/catalog_system/pvt/products/${productId}/specification`, OPTIONS)
      .then((mdResponse) => {
        if (mdResponse.ok) {
          mdResponse.json().then((response: any) => {
            if (response?.find(specification => specification?.Name == SPECIFICATION_NAME)) {
              // console.log(skuId)
              // console.log(response?.ProductSpecifications?.find(specification => specification?.FieldName == 'RECENSIONI'))
              resolve(response?.find(specification => specification?.Name == SPECIFICATION_NAME)?.Value[0])
            } else {
              resolve("")
            }
          })
        } else {
          reject(mdResponse)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

function updateSpecification(productId: string, specificationValue: String): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    optionsPost.body = JSON.stringify([{
      Name: SPECIFICATION_NAME,
      Value: [specificationValue]
    }])
    fetch(`https://${ACCOUNT}.vtexcommercestable.com.br/api/catalog_system/pvt/products/${productId}/specification`, optionsPost)
      .then((mdResponse) => {
        if (mdResponse.ok) {
          console.log("SUCCESSED CALL:", productId);
          resolve(true)
        } else {
          console.log(mdResponse)
          console.log("FAILED RECORD: ", productId)
          reject(false)
        }
      }).catch((err) => {
        reject(err)
      })
  })
}


export function returnCredential(project) {
  const credential = []
  switch (project) {
    case "reply": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-reply-OLDATX' })
      credential.push({ key: 'X-VTEX-API-AppToken', value: 'MDFSXVUAUKOJPNZOVVDJOZPAIGPIOOTPFNGGVCCLTMSDXPNYANNEJZVLNIRVXRIHQNBVHKKMHZRQATCSJLQJLSBHXNNDBGIWFAMYNNYZMSQLQEHCGUMDRGXZOMOFJJMV' })
      break;
    }
    case "itwhirlpool": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-itwhirlpool-YKHNOZ' })
      credential.push({ key: 'X-VTEX-API-AppToken', value: 'SSUBFODAEAHOAJGTKHQCDKSPEGFFIOESKDESZSVSATMETJPLFSNZQFDHAEXYIYSQVPEWFNUSLXCKYOVUQUZPAFCEAWSUUXJBBVIEESFSYVOSDSJMICIOYCQQNAWIVAXO' })
      break;
    }
    case "itwhirlpoolqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-itwhirlpoolqa-SETTVR' })
      credential.push({ key: 'X-VTEX-API-AppToken', value: 'IZQLNOEVVJGXTAQPMNBMQWOGJYLYVWHEEHMCHEBQAJYMMTBSCPLWNBILLJBPCFAYCBSLOOIHMKMGYBUPWTWGLKQDZARXCMNUJZJKAPENGDKCOBMJPLSJITNRKPMNXLFZ' })
      break
    }
    case "ruwhirlpoolqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-ruwhirlpoolqa-AIHWUB' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'TIRFJIUDXGCJUZPCGOIOUUZOKQGEAOXOIVGWLRFORGCDBDTVPDRGMXDYJDVSBQCJINAYTTQOIUWORVMHXKOWXRCKRHMIWMMBDTVOCUBVMCXSBPHOQNVQBGMQLPHMHISW'
      })
      break
    }
    case "ruwhirlpool": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-ruwhirlpool-ZRRZBV' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'MJSOJAPHHFPCSZQMAAVACENUEAXRMMSQUKLOZMGFDXQAJMQINYVRLWEIVYKICYVUMZIHOCNOTQXENNKRKPDORAEYGCSBBYCECWNKEJUKKGXVYAVIOSXNUGDLUJBLJMNU'
      })
      break
    }
    case "frwhirlpoolqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-frwhirlpoolqa-GESKRY' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'QTGIQJQBQVBBZIABCRYNRSPSWJDCFLWSTUXVJXTSDSHTZTKBXXKACKRYDOLGGOWEYJHFLEREXFJZKVSDZBEIAWPJCYRVLNMOWCVQLEQSFFCXASNIVIHEKOECTYCMNWSK'
      })
      break
    }
    case "frwhirlpool": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-frwhirlpool-GZCPNL' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'XLDJZIGVYFNRPXKIHRNGNSTFCNRNRWPFUPGNCSZTOUSTEJBYHBTCHQPFRYHMRSDBPHXZRXGORUSTAZBSLTGQDMXDZBVDLNBVRQEWLBGJUELNYWESXOAYMMYCKTAQCCDD'
      })
      break
    }
    /* case "frwhirlpool": {
        credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-frwhirlpool-QCRZJB' })
        credential.push({
            key: 'X-VTEX-API-AppToken', value: 'YMXZGZSQCTQJHOXHPHLTPUGZAFLXSRJVONLVTECVDGEQRMMIARKNJEREGYYAOVXLJVUUCCOLEPQIPPHOTCWBGVLKWHOUFBHHITHWRSFYCZJUNIORQKHLZWENJKYVNTFD'
        })
        break
    } */
    case "indesitukqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-indesitukqa-YDMRFY' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'LNFGSFSXSKBNUWOXBOSMZDJRCSHTKBSYMKMKBWRPDBJKGMLZGOCUANCIDODZXZMRSCBJJDWFWCJXTYKPGINWYYYYHDHNSSRDOSSDKCPCRXYXEFOEDNTPMQSTEDBFVJME'
      })
      break
    }
    case "indesituk": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-indesituk-NWOYCS' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'HQAARXCUXEFWAULDXWDYXETZNIPAPJTGXWDGPKUGLKWBKUHDOQVHZJNDXBNJIBENKYYEREONCXNMHRPSALMYNLHOIZJNWLXJGJQLVDMJCIFCWBVFMVIXPFZZRKVRUAQR'
      })
      break
    }
    case "hotpointit": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-hotpointit-INZJFJ' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'QCABLVHTDVRXALJPDTOJRDILYSJXEGFCTAQFQTJNPKGGWKLBVNUPGYOMUPCSMKPWQODAVEYKJATGXCONGHBRLPVVMDLBQQBFVJQHHLGROKFFEHPSAOLEIYLATHNRTXTT'
      })
      break
    }
    case "hotpointitqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-hotpointitqa-EPFPPN' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'DILJGPARWWWUXBGKRDYODOYFSWTHJOFUUMKJWZJMIRYGTPWZKCLBDJFPKFRKWTHIQBALRWNRTMGMQRLCATXHDDRKGUZQIZQPJQPSPKINOTIQDTZSUOJCWAFNJPEWXWJT'
      })
      break
    }
    case "hotpointukqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-hotpointukqa-VZOBMM' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'RQDLMPKEFKDAFPOXVFFTEFGCKIVJWYTKSSWGDXLHJUONQTHUWFEMDVCMKBBDTAHHQTINSIUXTXJKQSLQBBNQUHGXQKWBWINJMHXWLTBNLGSGLRVRPKCSNRNJNKWHLSBL'
      })
      break
    }
    case "hotpointuk": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-hotpointuk-PFCSOM' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'ZFCPHJKYEKXKHTJZCHENPUNIJMXIYFFGYWYAADJDUSTJIJFSGROWIBGERUFUMBZYERMLUIYYYBSXBEZZHEBHRIXWQTJGYOQTSUERXUYYSPYHIIDNVFNIASGWUQVAYSAJ'
      })
      break
    }
    case "smartcsb2cqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-smartcsb2cqa-MDDNZA' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'PMZHEGPKXAVTJSCQEGMPWNMMLNTWRQETSNRUDEVRKVLOPYBJEONPMEVCAMWQMTTHVBAWBIMAKVEBBYXMLJRCCPHORPTRHEERBETNYFIWBNERAUACOKEDBREFTMEMOVTG'
      })
      break
    }
    case "smartcsb2c": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-smartcsb2c-ROLPZO' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'ILHJNGTLBAOBAJZRAJFBQLSYIXEQNBDRSZTQPEUYOPPURMQVXUBDIRVXTIAPBCYZWWJAPJBWOGNBVYGWHISTAZIAEWWHDEWMQQXVDPGOSFPBEUBVBEISJFZWNIWTMUSK'
      })
      break
    }
    case "frccwhirlpool": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-frccwhirlpool-TLEGNP' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'PLCALEQQTDIREVQHZGGEHSFUCRXMCXZRERHFWAYBZQLDDOVNIUNXQHWWFIYUGDOWERNMOLLYHEEQGCQNWJEHKBBWVKZNCEUWCPZMBIZWJOPLDFQCSKYWYGMCPQQDLXVD'
      })
      break
    }
    case "frccwhirlpoolqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-frccwhirlpoolqa-XVPFIN' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'PXFKJDNHAVUTNTJPGYQDRUWXDFCWNJQDNFJDZFPOUNICQLJCTVUAHGPVAIGDBQTQFQGIKFQAIBJELUGRVADSPQVGPNCRYMNETRWAFBRNFTSGXLKGBPIBNBBPUZSWDZBW'
      })
      break
    }
    case "indesitit": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-indesitit-SHHMNH' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'YLOSAPCVYUNKHWMJYBTHLPTWBWUKNOMRSLGOSRJOSENBUENPCLCAHEVJSSREVSHKHWSVQXQHREOGBSBXIEICLMJNQWWAAFTAWCTYMRYEUVICQOHZQTWQJFZVMEFUBQHM'
      })
      break
    }
    case "indesititqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-indesititqa-HKPJTQ' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'WPNAZCVAZJVQNKHEMUWVVAIQHVHJPNCYLCMNSKMOBCAQPFZXTOWZBVEVHXSEULLMHWEKYUMBHITTASBCWKPAQCWQYRGURHTQROISAOZZBVRTBLUPWPIKWKVFAOMHNSJZ'
      })
      break
    }
    case "indesitfrqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-indesitfrqa-QPIOQL' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'EOMJSSCHLUFCZNGGBXNVXTJDVEHCZUBZDVQOGQVELCDVCVJSNAUAEUHLFJOOLAHRTGZDWSALBIJUQNBZUOOZZAVJOFIXBHTLULCWWGWVAJYWKNURHPUWLIRSKQOQJDJU'
      })
      break
    }
    case "indesitfr": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-indesitfr-EZXIHK' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'AOYSUDGICTMZZFWOBVFLQRHNESHOHRVDBCLVFDGTOAAJLWBQCHVIEHCJHLOBVSALXIXWTAJXPLXPRXBIRRLAVMZUZCOTPEXVZOLDYEWBYXTSKNRKJGKEGAQLIDXRMPIK'
      })
      break
    }
    case "indesitplqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-indesitplqa-JGHRFW' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'AYKRYRFBYNUXTHLGSJRUNAZPJETFMNDSCRCUKPKOTYLQFGMIKJZSAUHZYVHTXAOLJBUCEQVCZDAPPJKDSLUDNLRIJDWPIRQTJZGDLJEUNWSXTSKPLEAMFLXXJMTBUGUI'
      })
      break
    }
    case "indesitpl": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-indesitpl-XCGSJN' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'TPUJDQSTWFNDHGALOQHVIWTOVTQOWSYCKRROAYTRLATVMEXLQQBBYCGWVFNJAEXDGKTQPMKPWPJICXCRWEYGQXEHKUTULJRHDPPBKGWDFLEISYTXDWNVGQNIGLFUTPEN'
      })
      break
    }
    case "smartukb2cqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-smartukb2cqa-YKKZAW' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'HLHYGOHXWXDIJSKEMSGLSFIBVQJNWVJUILLGYECQHBXSIXKTDVPMHVZBCFCPEUBBOJAYGDGHQPERIQTYGPKAFWMNLJDSCMLMAVDYXMNAPIWRQITMLEJOKAWSWMMXZNFD'
      })
      break
    }
    case "smartukb2c": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-smartukb2c-PKFYOF' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'ETOPZEPPSZYYMIXLFIQWGDJNAVKLRACQDEZMJSAOGPCWPGHQSNDLJVFBJAPEUDYRWHUIJLBNHBQRANYTOTSDWRGIYXDIDWUCRLAHLYHHMQDHEOAVCVPBLVVEBMJLISJK'
      })
      break
    }
    case "plwhirlpoolqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-plwhirlpoolqa-YTJRWF' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'TLEHDDRPMIEFUYYDGTBCSOLEVNHYHJUKPWPXKWQKCCUVGKUBLVZKAMPFZALQWSHCNUQYIBTJCQZQTQXLSFMMKJJCGJYJKZNJUSHMUWSKBPHJNZMIDAYQFVRDKORYDJZC'
      })
      break
    }
    case "plwhirlpool": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-plwhirlpool-EROZAI' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'MMQXKOWAYMJKYZKTJCSAJJWSNGLLVFGERMBHQFESXOAYFPRJYPZQBDACQYJEDLESFETLXCDDYADVJYMYOBMGFPDOMZRRWZPLJHSBWFMVLWSBZESRMLQBZXMPAFZXLMGZ'
      })
      break
    }
    /* case "plwhirlpool": {
        credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-plwhirlpool-TAKLTH' })
        credential.push({
            key: 'X-VTEX-API-AppToken', value: 'YYNCVDAJLRHMJVXOJVNBPZGEVBPELLFFJYYAJFKQYVLKYRBNIJZXTBKYSJHUNVXZLBCKXXFELXCTOVGDACWCMIMIOZIZXQCCXMYWOQQLDVLVYQKWDETLZVNDPUVXPFGU'
        })
        break
     }*/
    case "bauknechtde": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-bauknechtde-SEGOPN' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'BVKFZBSTXIKBBXTRMUOMEVLXIGRNKDPBHOSUBORESXKXEPQPPPOPQMSQIGGYYGMPBTGULDMSUUESYRVJFFUXMQKIWIVWMCLWZXVQLMBXTWUWMNUKTJYNUIQMOMMHDYXX'
      })
      break
    }
    case "bauknechtdeqa": {
      credential.push({ key: 'X-VTEX-API-AppKey', value: 'vtexappkey-bauknechtdeqa-KLZIXK' })
      credential.push({
        key: 'X-VTEX-API-AppToken', value: 'QJAREHAZSAEJOFDREPCUPZSSYINVKMJQYSMJIHJWGUIJGGYUFSJRWMJFTURZFXWEXNUPPNCCAWMWCTYAZYILMYYAPPODXBVEJYIAQRYOFJXTXEZOCMLBSXUTEALHFZXJ'
      })
      break
    }
    default:
      console.log(project);
  }

  return credential
}