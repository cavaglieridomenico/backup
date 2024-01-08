const customPlps = [
    "/froid/refrigerateurs-multi-portes",
    "/pack-cuisine-equipee/ligne-wcollection-w11",
    "/pack-cuisine-equipee/ligne-wcollection-black-fiber",
    "/pack-cuisine-equipee/ligne-wcollection-w7",
    "/pack-cuisine-equipee/ligne-absolute",
    "/pack-cuisine-equipee/ligne-evolution",
    "/pack-cuisine-equipee/personnalisez-votre-pack",
    "/promotion-plp-lavage",
    "/promotion-plp-cuisson",
    "/promotion-plp-froid",
    "/promotion-plp-lave-vasselle",
  ];
  //Check for custom plps
export  const checkCustomPlp:any = () => {
    for (let i = 0; i < customPlps.length; i++) {
      if (window.location.href.includes(customPlps[i])) {
        return true;
      }
    }
    return false;
  };

 export const mapCategoryCustomPlps = () => {
    if (window.location.href.includes("/froid/refrigerateurs-multi-portes")) {
      return "SC_WP_FG_CO_Cooling";
    } else if (window.location.href.includes("/promotion-plp-lave-vasselle")) {
      return "SC_WP_FG_DW_Dishwashers";
    }
    return "";
  };