import { Service, ServiceContext } from '@vtex/api'

// Storia: https://whirlpoolgtm.atlassian.net/browse/IT-1150

const mapRedirects = new Map();
mapRedirects.set("/faq/jak-usunac-nieprzyjemne-zapachy-z-lodowki2", "/faq/jak-usunac-nieprzyjemne-zapachy-z-lodowki");
mapRedirects.set("/faq/jak-duzo-detergentu-potrzebne-jest-na-kazdy-zaladunek-pralki2", "/faq/jak-duzo-detergentu-potrzebne-jest-na-kazdy-zaladunek-pralki");
mapRedirects.set("/faq/jak-czyscic-i-konserwowac-powierzchnie-ze-stali-nierdzewnej2", "/faq/jak-czyscic-i-konserwowac-powierzchnie-ze-stali-nierdzewnej");
mapRedirects.set("/faq/czy-potrzebne-sa-specjalne-filtry-do-okapu-z-cyrkulacja-powietrza2", "/faq/czy-potrzebne-sa-specjalne-filtry-do-okapu-z-cyrkulacja-powietrza");

const doRedirect = async (ctx: ServiceContext) => {
  ctx.status = 301;

  //CUSTOM REDIRECT LOGIC
  let redirectURL = mapRedirects.get(ctx.request.url)
  if (redirectURL != undefined) {
    ctx.redirect(redirectURL);
  }
  else {
    ctx.redirect("/");
  }
}

export default new Service({
  routes: {
    redirect1: doRedirect,
    redirect2: doRedirect,
    redirect3: doRedirect,
    redirect4: doRedirect
  },
})
