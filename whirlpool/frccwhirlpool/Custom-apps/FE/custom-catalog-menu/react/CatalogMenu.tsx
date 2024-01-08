import React from "react";
import { useRuntime } from 'vtex.render-runtime'
import DesktopCatalog from './components/DesktopCatalog'
import MobileCatalog from './components/MobileCatalog'
import { useQuery } from "react-apollo";
import takeCategories from './graphql/categories.graphql'

  // TO REMOVE
  // const mockItems = require("./utils/example.json")
interface CatalogMenuProps {
  catalogLabel: string
  items: ItemProps[]
  images: ImageProps[]
 }

 interface ItemProps {
  categorySelection: | "" | "Products" | "Accessories"
  itemTitle: string;
  itemLink: string;
  subItems: SubItemProps[]
  hasBrandImages: boolean
}
 interface ImageProps {
  imageUrl: string
  imageLink: string
}
 interface SubItemProps {
  itemTitle: string;
  itemLink: string;
}

const CatalogMenu: StorefrontFunctionComponent<CatalogMenuProps> = ({
  catalogLabel,
  items,
  images
 }) => {
  const {deviceInfo} = useRuntime()
  const isMobile = deviceInfo.isMobile

  const { data } = useQuery(takeCategories);

  const productCategories = data?.categories.find((cat: any) => cat.name == "produits")
  const accessoryCategories = data?.categories.find((cat: any) => cat.name == "accessoires")
 
  return(
    <>
    
    {!isMobile ?
    /* ---------- Desktop Catalog Menu -----------*/
    <DesktopCatalog 
      catalogLabel={catalogLabel} 
      items={items}
      images={images} 
      productCategories={productCategories} 
      accessoryCategories={accessoryCategories}>
    </DesktopCatalog>
    :
    /* ---------- Mobile Catalog Menu -----------*/
    <MobileCatalog 
      catalogLabel={catalogLabel} 
      items={items} 
      images={images}
      productCategories={productCategories} 
      accessoryCategories={accessoryCategories}>
    </MobileCatalog>
  }
      
</>
  )
};

CatalogMenu.schema = {
  title: "Catalog Menu  Custom",
  description: "All catalog menu settings",
  type: "object",
  properties: {
    catalogLabel: {
      title: "Catalog Label",
      description: "This is the catalog label",
      default: "Catalogue",
      type: "string",
    },
    images: {
      type: "array",
      title: 'Images',
      items : {
        properties : {
          imageUrl: {
            title: "imageUrl",
              type: "string"
          },
          imageLink: {
            title: "imageLink",
              type: "string"
          }
        }
      }
    },
    items: {
      type: "array",
      title: 'Items',
      items: {
        title:"Item menu",
        properties: {
          itemTitle: {
            title: "ItemTitle",
            type: "string"
          },
          itemLink: {
            title: "ItemLink",
            type: "string",
          },
          categorySelection: {
            title: "categorySelection",
            type: "string",
            description: "If checked DO NOT select SubItems, they will be automatically generated",
            enum: [
              "",
              "Products",
              "Accessories"
            ],
            enumNames: [
                "",
                "Products",
                "Accessories"
            ],
            default: ""
          },
          hasBrandImages:{
            type: "boolean",
            title: 'hasBrandImages',
          },
          itemGroups: {
            type: "array",
            title: 'groups',
            items: {
              title:"titleGroup",
              properties: {
                itemTitle: {
                  title: "ItemTitle",
                  type: "string"
                },
                itemLink: {
                  title: "ItemLink",
                  type: "string"
                },
                subItems: {
                  title: "SubItems",
                  type: "array",
                  items: {
                    title:"subItems",
                    properties: {
                      itemTitle: {
                        title: "ItemTitle",
                        type: "string"
                      },
                      itemLink: {
                        title: "ItemLink",
                        type: "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
};

export default CatalogMenu;
