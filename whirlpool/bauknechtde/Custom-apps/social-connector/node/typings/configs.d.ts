export interface configs {
  SiteUrl: string
  VtexClientID: string,
  VtexClientSecret: string,
  CustomLoginPageUrl: string,
  Socials: Social[]
}

interface Social {
  socialName: string,
  socialClientId: string,
  socialClientSecret: string,
  socialLoginUrl: string,
  socialAccessTokenEndpoint: string,
  socialAccessTokenMethod: "GET" | "POST",
  socialScope: string,
  socialUserInfoUrl: string,
  socialUserFirstNameField: string,
  socialUserLastNameField: string,
  socialUserEmailField: string,
  socialUserIdField: string
  socialUserInfoAuthType: "Header" | "Query"
}
