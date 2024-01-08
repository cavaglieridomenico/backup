import { NavigationItem } from "./types";

export const homeLabel = "Home";
export const productLabel = "PRODUITS";
export let breadcrumbObject: NavigationItem = {
  name: "",
  href: "",
  __typename: "SearchBreadcrumb",
};
export const translatedNamePLP = (href: any) => {
  let labelTranslated = "";
  switch (href) {
    case "/accessori":
      labelTranslated = "accessories";
      break;
    case "/accessori/lavaggio-e-asciugatura":
      labelTranslated = "Laundry";
      break;
    case "/accessori/cottura":
      labelTranslated = "Cooking";
      break;
    case "/accessori/aria-condizionata":
      labelTranslated = "Air Conditioning";
      break;
    case "/accessori/refrigerazione":
      labelTranslated = "Cooling";
      break;
    case "/accessori/lavastoviglie":
      labelTranslated = "Dishwashing";
      break;
    case "/prodotti":
      labelTranslated = "products";
      break;
    case "/prodotti/lavaggio-e-asciugatura":
      labelTranslated = "Laundry";
      break;
    case "/prodotti/cottura":
      labelTranslated = "Cooking";
      break;
    case "/prodotti/aria-condizionata":
      labelTranslated = "Air Conditioning";
      break;
    case "/prodotti/refrigerazione":
      labelTranslated = "Cooling";
      break;
    case "/prodotti/lavastoviglie":
      labelTranslated = "Dishwashing";
      break;
  }
  return labelTranslated;
};

export const translatedNotClickableNamePLP = (href: any) => {
  let labelTranslated = "";
  switch (href) {
    case "lavatrici":
      labelTranslated = "Washing Machines";
      break;
    case "asciugatrici":
      labelTranslated = "Dryers";
      break;
    case "lavasciuga":
      labelTranslated = "Washer Dryers";
      break;
    case "frigoriferi-combinati-e-doppia-porta":
      labelTranslated = "Fridge Freezer Combination";
      break;
    case "congelatori":
      labelTranslated = "Freezer";
      break;
    case "frigorifero-monoporta":
      labelTranslated = "Fridge";
      break;
    case "cantinette-vino":
      labelTranslated = "Winestorage";
      break;
    case "forni":
      labelTranslated = "Ovens";
      break;
    case "cappe":
      labelTranslated = "Hoods";
      break;
    case "piani-cottura":
      labelTranslated = "Hobs";
      break;
    case "cucine":
      labelTranslated = "Coockers";
      break;
    case "forni-a-microonde":
      labelTranslated = "Microowaves";
      break;
    case "lavastoviglie-ad-incasso":
      labelTranslated = "Built-in Dishwasher";
      break;
    case "lavastoviglie-a-libera-installazione":
      labelTranslated = "Free Standing Dishwasher";
      break;
    case "condizionatori-portatili":
      labelTranslated = "Air Conditioners";
      break;
    case "condizionatori-fissi":
      labelTranslated = "Fixed Air Conditioner";
      break;
    case "deumidificatore":
      labelTranslated = "Dehumidifier";
      break;
    case "altri-prodotti":
      labelTranslated = "Special Products";
      break;
    case "lavaggio-e-asciugatura":
      labelTranslated = "Laundry";
      break;
    case "lavaggio-e-asciugatura":
      labelTranslated = "Laundry";
      break;
    case "cottura":
      labelTranslated = "Cooking";
      break;
    case "aria-condizionata":
      labelTranslated = "Air Conditioning";
      break;
    case "refrigerazione":
      labelTranslated = "Cooling";
      break;
    case "lavastoviglie":
      labelTranslated = "Dishwashing";
      break;
    case "supporto":
      labelTranslated = "Support";
      break;
    case "support":
      labelTranslated = "Support";
      break;
  }
  return labelTranslated;
};

//Style
export const CSS_HANDLES = [
  "container",
  "link",
  "homeLink",
  "arrow",
  "term",
  "termArrow",
] as const;

export const linkBaseClasses = "dib pv1 link  c-muted-2 hover-c-link v-mid";
export const spanBaseClasses = "dib pv1 link ph2 c-muted-2 v-mid";
