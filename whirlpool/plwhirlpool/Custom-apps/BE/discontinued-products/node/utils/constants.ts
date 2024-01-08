export const DECLARER = "vtex.store@2.x"
export const TYPE = "userRoute"

export enum RedirectType {
  discontinued = "/discontinued",
  unsellable = "/unsellable"
}

export const discontinuedSpecification = "isDiscontinued"
export const sellableSpecification = "sellable"

export const regexSlug = /^\/([\w-]*)\/p$/m


export const credentials: { [index: string]: { "X-VTEX-API-AppKey": string, "X-VTEX-API-AppToken": string } } = {
  "itwhirlpoolqa": {
    "X-VTEX-API-AppKey": 'vtexappkey-itwhirlpoolqa-SEMTZI',
    "X-VTEX-API-AppToken": 'ZNCUJYIRZXDJQHIWFGFASRICBYFOEVWHFFSQZNLWJYQQUCGPUHXXBZMHFASKTUMEAWDKORWSVIRTASHZSPTXXZFFTKLZUADOMMPYYVADKFCTISGMSSRDBPHBQXRDFWXU'
  },
  "itwhirlpool": {
    "X-VTEX-API-AppKey": 'vtexappkey-itwhirlpool-ZSZUJR',
    "X-VTEX-API-AppToken": 'CATOMXIZQULFRBSZEXZUTUDBHRAMDJSWGZCDGVMWHACAIKTSZYTIFTCHXSGVXVWGBOZRZPSJLDMTRCSXXHNEQKRNWUGOOQZLDWZTKCSKFJWCGJPUZIXQIRPRXMUFJEUV'
  },
  "frwhirlpoolqa": {
    "X-VTEX-API-AppKey": 'vtexappkey-frwhirlpoolqa-CXFDXU',
    "X-VTEX-API-AppToken": 'REUXJQOILDOJFAMXOWMWYYZBOLVDXKELBOUZRCXDNKASPPAJYHJLXFHTFSIYVKLAZCHRGNGLZIJNXHLZLLFQATOWGAUYUZICZZSNHJDLAYMPVTWXHJMKFUZGOKKFSIRA'
  },
  "frwhirlpool": {
    "X-VTEX-API-AppKey": 'vtexappkey-frwhirlpool-QCRZJB',
    "X-VTEX-API-AppToken": 'YMXZGZSQCTQJHOXHPHLTPUGZAFLXSRJVONLVTECVDGEQRMMIARKNJEREGYYAOVXLJVUUCCOLEPQIPPHOTCWBGVLKWHOUFBHHITHWRSFYCZJUNIORQKHLZWENJKYVNTFD'
  },
  "plwhirlpool": {
    "X-VTEX-API-AppKey": 'vtexappkey-plwhirlpool-TAKLTH',
    "X-VTEX-API-AppToken": 'YYNCVDAJLRHMJVXOJVNBPZGEVBPELLFFJYYAJFKQYVLKYRBNIJZXTBKYSJHUNVXZLBCKXXFELXCTOVGDACWCMIMIOZIZXQCCXMYWOQQLDVLVYQKWDETLZVNDPUVXPFGU'
  },
  "plwhirlpoolqa": {
    "X-VTEX-API-AppKey": 'vtexappkey-plwhirlpoolqa-YTJRWF',
    "X-VTEX-API-AppToken": 'TLEHDDRPMIEFUYYDGTBCSOLEVNHYHJUKPWPXKWQKCCUVGKUBLVZKAMPFZALQWSHCNUQYIBTJCQZQTQXLSFMMKJJCGJYJKZNJUSHMUWSKBPHJNZMIDAYQFVRDKORYDJZC'
  }
}