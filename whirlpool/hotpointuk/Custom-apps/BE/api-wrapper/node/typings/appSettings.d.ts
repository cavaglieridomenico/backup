type AppSettings = {
  authcookie: string
  appKeyQA: string
  appTokenQA: string
  appKeyPROD: string
  appTokenPROD: string
  productionMode: boolean
  createConsumerUrl: string
  pfxPassword: string
  ptvUrlTest: string
  ptvUrlProd: string
  ptvUsername: string
  ptvPassword: string
  tpUrlTest: string
  tpUrlProd: string
  tpUsername: string
  tpPassword: string
  additional_services_contents_categpries: string
  logosMapping: LogosMapping
}

type LogosMapping = {
  specificationName: string
  mapping: Logo[]
}

type Logo = {
  id: string
  url: string
}
