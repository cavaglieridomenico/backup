//@ts-nocheck

export const maxRetry = 5;
export const maxWaitTime = 1000;
export const mdPageSize = 1000;
export const ASfields = ["id","createdAt","email","name","notificationSend","productImageUrl","productUrl","sendAt","skuId","skuRefId"];
export const maxDays = 30;

export async function wait(time: number): Promise<any> {
  return new Promise<any>((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time);
  })
}

export function isValid(param: any): any{
  return param!=undefined && param!=null && param!="undefined" && param!="null" && param!="" && param!=" " && param!="_" && param!="-";
}

export const enabledCredentials = {
  "frwhirlpool":[
    {
      key: "vtexappkey-frwhirlpool-GZCPNL",
      token: "XLDJZIGVYFNRPXKIHRNGNSTFCNRNRWPFUPGNCSZTOUSTEJBYHBTCHQPFRYHMRSDBPHXZRXGORUSTAZBSLTGQDMXDZBVDLNBVRQEWLBGJUELNYWESXOAYMMYCKTAQCCDD"
    },
    {
      key: "vtexappkey-frwhirlpool-QCRZJB",
      token: "YMXZGZSQCTQJHOXHPHLTPUGZAFLXSRJVONLVTECVDGEQRMMIARKNJEREGYYAOVXLJVUUCCOLEPQIPPHOTCWBGVLKWHOUFBHHITHWRSFYCZJUNIORQKHLZWENJKYVNTFD"
    }
  ],
  "frwhirlpoolqa":[
    {
      key: "vtexappkey-frwhirlpoolqa-GESKRY",
      token: "QTGIQJQBQVBBZIABCRYNRSPSWJDCFLWSTUXVJXTSDSHTZTKBXXKACKRYDOLGGOWEYJHFLEREXFJZKVSDZBEIAWPJCYRVLNMOWCVQLEQSFFCXASNIVIHEKOECTYCMNWSK"
    },
    {
      key: "vtexappkey-frwhirlpoolqa-CXFDXU",
      token: "REUXJQOILDOJFAMXOWMWYYZBOLVDXKELBOUZRCXDNKASPPAJYHJLXFHTFSIYVKLAZCHRGNGLZIJNXHLZLLFQATOWGAUYUZICZZSNHJDLAYMPVTWXHJMKFUZGOKKFSIRA"
    }
  ],
  "itwhirlpool":[
    {
      key: "vtexappkey-itwhirlpool-YKHNOZ",
      token: "SSUBFODAEAHOAJGTKHQCDKSPEGFFIOESKDESZSVSATMETJPLFSNZQFDHAEXYIYSQVPEWFNUSLXCKYOVUQUZPAFCEAWSUUXJBBVIEESFSYVOSDSJMICIOYCQQNAWIVAXO"
    },
    {
      key: "vtexappkey-itwhirlpool-ZSZUJR",
      token: "CATOMXIZQULFRBSZEXZUTUDBHRAMDJSWGZCDGVMWHACAIKTSZYTIFTCHXSGVXVWGBOZRZPSJLDMTRCSXXHNEQKRNWUGOOQZLDWZTKCSKFJWCGJPUZIXQIRPRXMUFJEUV"
    }
  ],
  "itwhirlpoolqa":[
    {
      key: "vtexappkey-itwhirlpoolqa-SETTVR",
      token: "IZQLNOEVVJGXTAQPMNBMQWOGJYLYVWHEEHMCHEBQAJYMMTBSCPLWNBILLJBPCFAYCBSLOOIHMKMGYBUPWTWGLKQDZARXCMNUJZJKAPENGDKCOBMJPLSJITNRKPMNXLFZ"
    },
    {
      key: "vtexappkey-itwhirlpoolqa-SEMTZI",
      token: "ZNCUJYIRZXDJQHIWFGFASRICBYFOEVWHFFSQZNLWJYQQUCGPUHXXBZMHFASKTUMEAWDKORWSVIRTASHZSPTXXZFFTKLZUADOMMPYYVADKFCTISGMSSRDBPHBQXRDFWXU"
    }
  ],
  "frccwhirlpool":[
    {
      key: "vtexappkey-frccwhirlpool-TLEGNP",
      token: "PLCALEQQTDIREVQHZGGEHSFUCRXMCXZRERHFWAYBZQLDDOVNIUNXQHWWFIYUGDOWERNMOLLYHEEQGCQNWJEHKBBWVKZNCEUWCPZMBIZWJOPLDFQCSKYWYGMCPQQDLXVD"
    },
    {
      key: "vtexappkey-frccwhirlpool-TUHOST",
      token: "PMYQSDORZTHSFAVKOIXYCFYVRDERGSRCXMFJKZUPWYJKYCAYTHGEUBEJNCYOYXLHCEUTUMZPOHBDWOXPDGXYMMIWIVVIAFRZNBITHHDHHQQNZANZEJLRZMVPWYKYQROJ"
    }
  ],
  "frccwhirlpoolqa":[
    {
      key: "vtexappkey-frccwhirlpoolqa-XVPFIN",
      token: "PXFKJDNHAVUTNTJPGYQDRUWXDFCWNJQDNFJDZFPOUNICQLJCTVUAHGPVAIGDBQTQFQGIKFQAIBJELUGRVADSPQVGPNCRYMNETRWAFBRNFTSGXLKGBPIBNBBPUZSWDZBW"
    },
    {
      key: "vtexappkey-frccwhirlpoolqa-OMDEIP",
      token: "GVPTKFVHIVYFHFSVDNASFERHDMTIJMWTBHPSBFVYGJUUVCLSAAPXRRSBDHPYLMXWYEEZPZTYSBLWKXLBABHJWZCKOOOTPWMUMXVQXLCBGQFPGWRGWOXJFNAZCULBKZJV"
    }
  ],
  "plwhirlpool":[
    {
      key: "vtexappkey-plwhirlpool-EROZAI",
      token: "MMQXKOWAYMJKYZKTJCSAJJWSNGLLVFGERMBHQFESXOAYFPRJYPZQBDACQYJEDLESFETLXCDDYADVJYMYOBMGFPDOMZRRWZPLJHSBWFMVLWSBZESRMLQBZXMPAFZXLMGZ"
    },
    {
      key: "vtexappkey-plwhirlpool-TAKLTH",
      token: "YYNCVDAJLRHMJVXOJVNBPZGEVBPELLFFJYYAJFKQYVLKYRBNIJZXTBKYSJHUNVXZLBCKXXFELXCTOVGDACWCMIMIOZIZXQCCXMYWOQQLDVLVYQKWDETLZVNDPUVXPFGU"
    }
  ],
  "plwhirlpoolqa":[
    {
      key: "vtexappkey-plwhirlpoolqa-YTJRWF",
      token: "TLEHDDRPMIEFUYYDGTBCSOLEVNHYHJUKPWPXKWQKCCUVGKUBLVZKAMPFZALQWSHCNUQYIBTJCQZQTQXLSFMMKJJCGJYJKZNJUSHMUWSKBPHJNZMIDAYQFVRDKORYDJZC"
    },
    {
      key: "vtexappkey-plwhirlpoolqa-QZAEEZ",
      token: "XMZKOYGPKCOFYKGWBNVUBVVPTYXMFZXILTIVSEWEQACGBIIXMDLNVGNCQJQQBTKLFFTFCLEWQREBTPOLPZACOKNEFFEIOFCWQRBVODUBYOWECMJBUFBBTHWUSOZWHVIK"
    }
  ]
}

export const baseUrl = {
  frwhirlpool: "https://www.whirlpool.fr",
  frwhirlpoolqa: "https://frwhirlpoolqa.myvtex.com",
  frccwhirlpool: "https://frccwhirlpool.myvtex.com",
  frccwhirlpoolqa: "https://frccwhirlpoolqa.myvtex.com",
  itwhirlpool: "https://www.whirlpool.it",
  itwhirlpoolqa: "https://itwhirlpoolqa.myvtex.com",
  plwhirlpool: "https://whirlpool.pl",
  plwhirlpoolqa: "https://plwhirlpoolqa.myvtex.com"
}
