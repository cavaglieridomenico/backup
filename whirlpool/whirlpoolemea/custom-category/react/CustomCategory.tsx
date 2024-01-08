//@ts-nocheck
import React from "react";
import style from "./style.css";
import { usePixel } from "vtex.pixel-manager";
import loadable from "@loadable/component";

interface CategoryProps {
  articles?: Article[];
  categories?: Category[];
  isArticles?: boolean;
  isFilter?: boolean;
 }

 interface Category {
  categoryName: string;
  categoryNameEN: string;
  categoryLink: string;
  imageLink: string;
  imageAltName?: string;
}

interface Article {
  articleCategory: string;
  articleTitle: string;
  articleLink: string;
  articleTime: string;
  articleTimeIcon: string;
  imageLink: string;
  isHero?: boolean;
  buttonLabel?: string;
  articleSubtitle?: string;
}

const PlpFilters = loadable(() => import("./components/PlpFilters"), {ssr: false});
const Category = loadable(() => import("./components/Category"), {ssr: false});
const Article = loadable(() => import("./components/Article"), {ssr: false});
const HeroArticle = loadable(() => import("./components/HeroArticle"), {ssr: false});

const routeCategory = __RUNTIME__.route.canonicalPath.split("/")[2];

const CustomCategory: StorefrontFunctionComponent<CategoryProps> = ({
  articles, categories, isArticles = false, isFilter = false
 }) => {

  const {push} = usePixel();

  const handleAnalytics = (url: string) => {
    push({event: "wellBeing_discoverMore", url, type: "customCategory" })
  }

  if (!isArticles && isFilter) {
    return (
      <PlpFilters categories={categories} routeCategory={routeCategory} />
    )
  }
 
  return(
    <>
    {!isArticles ? (
      <Category categories={categories} handleAnalytics={handleAnalytics} />
    ) : (
      <div className={style.articleWrapper}>
        {articles?.map((article: any, index: any) => (
          !article.isHero ? ( 
            <Article key={index} article={article} handleAnalytics={handleAnalytics} />
        ) :
            (
              <HeroArticle key={index} article={article} handleAnalytics={handleAnalytics} />
            )
        ))}
      </div>
    )}
    </>
  )
};

CustomCategory.schema = {
  title: "Category Custom",
  description: "All categories and articles settings",
  type: "object",
  properties: {
   categories: {
      type: "array",
      title: 'Categories',
      items: {
        type: "object",
        title: "Category",
        properties: {
          categoryName: {
            title: "IT: Category Name",
              type: "string"
          },
          categoryNameEN: {
            title: "EN: Category Name",
              type: "string"
          },
          categoryLink: {
            title: "Category Link",
            description: "url of the category page",
              type: "string"
          },
          imageLink: {
            title: "Image Link",
            description: "url of the image",
            type: "string"
          },
          imageAltName: {
            title: "Image Alernative Name",
            description: "alt attribute of the image element for SEO purpose (optional)",
            type: "string"
          }
        }
      }
    },
    articles: {
      type: "array",
      title: "Articles",
      items: {
        type: "object",
        title: "Article",
        properties: {
          isHero: {
            title: "Hero Adv Banner",
            description: "Toggle this if the article you're inserting is a Hero Adv Banner (width 2 columns)",
            type: "boolean",
          },
          articleCategory: {
            title: "Article Category",
            type: "string",
          },
          articleTitle: {
            title: "Article Title",
            type: "string"
          },
          articleLink: {
            title: "Article URL",
            description: "url to the article's page",
            type: "string"
          },
          articleTime: {
            title: "Article Reading Time",
            description: "Change this if it's not a hero adv",
            type: "string"
          },
          articleTimeIcon: {
            title: "Article Reading Time Icon",
            description: "Insert the URL of the time reading icon",
            type: "string"
          },
          imageLink: {
            title: "Image Link",
            description: "url of the image",
            type: "string"
          },
          buttonLabel: {
            title: "Button Label",
            description: "Change this only if there is a button",
            type: "string"
          },
          articleSubtitle: {
            title: "Static banner paragraph",
            description: "Change this only if there is a static banner",
            type: "string"
          }
        }
      }
    }
    // items: {
    //   type: "array",
    //   title: 'Items',
    //   items: {
    //     title:"Item menu",
    //     properties: {
    //       itemTitle: {
    //         title: "ItemTitle",
    //         type: "string"
    //       },
    //       itemLink: {
    //         title: "ItemLink",
    //         type: "string",
    //       },
    //       categorySelection: {
    //         title: "categorySelection",
    //         type: "string",
    //         description: "If checked DO NOT select SubItems, they will be automatically generated",
    //         enum: [
    //           "",
    //           "Products",
    //           "Accessories"
    //         ],
    //         enumNames: [
    //             "",
    //             "Products",
    //             "Accessories"
    //         ],
    //         default: ""
    //       },
    //       hasBrandImages:{
    //         type: "boolean",
    //         title: 'hasBrandImages',
    //       },
    //       itemGroups: {
    //         type: "array",
    //         title: 'groups',
    //         items: {
    //           title:"titleGroup",
    //           properties: {
    //             itemTitle: {
    //               title: "ItemTitle",
    //               type: "string"
    //             },
    //             itemLink: {
    //               title: "ItemLink",
    //               type: "string"
    //             },
    //             subItems: {
    //               title: "SubItems",
    //               type: "array",
    //               items: {
    //                 title:"subItems",
    //                 properties: {
    //                   itemTitle: {
    //                     title: "ItemTitle",
    //                     type: "string"
    //                   },
    //                   itemLink: {
    //                     title: "ItemLink",
    //                     type: "string"
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  },
};

export default CustomCategory;
