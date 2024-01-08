//@ts-nocheck
import React, { useState } from 'react'
import styles from './styles.css'
import { useQuery } from 'react-apollo'
import products from './graphql/products.graphql'
import { useEffect, useContext } from 'react'
import { ProductContext } from 'vtex.product-context'
import fetchRequest from './utils/fetchRequest'
import { CustomProductPage } from "smartukb2c.custom-product-page"
import axios from 'axios'

const CleaningAndCare: StorefrontFunctionComponent = () => {

    const [categoryTreeFromPath, setCategoryTreeFromPath] = useState({})
    const [brand, setBrand] = useState("");

    const [categories, setCategories] = useState([]);

    const setCatTree = () => {
        let pathName = window.location.pathname;
        let pathNameSplitted = window.location.pathname.split("/");

        let tree = {
            lvl1: null,
            lvl2: null,
            lvl3: null
        }

        switch (pathNameSplitted.length) {
            case 2:
                tree.lvl1 = pathNameSplitted[1]
                break;
            case 3:
                tree.lvl1 = pathNameSplitted[1]
                tree.lvl2 = pathNameSplitted[2]
                break;
            case 4:
                tree.lvl1 = pathNameSplitted[1]
                tree.lvl2 = pathNameSplitted[2]
                tree.lvl3 = pathNameSplitted[3]
                break
        }
        setCategoryTreeFromPath(tree)
    }

    useEffect(() => {
        let search = window.location.search;
        let search2 = window.location.href;
        let isIndesit = (search.includes("indesit") || search2.includes("indesit"));
        let isHotpoint = (search.includes("hotpoint") || search2.includes("hotpoint"));
        let isBauknecht = (search.includes("bauknecht") || search2.includes("bauknecht"));
        setBrand(isIndesit ? "indesit" : "hotpoint");

        axios.get(`/api/catalog_system/pub/facets/search/hotpoint?map=b`)
            .then(function (response) {
                setCategories(response.data.CategoriesTrees.filter(cat => cat.Name === "Cleaning and Care")[0]["Children"])
            }).catch((error) => {
                console.error(error)
            })
        setCatTree()

    }, [])

    const getAllCount = () => {

        let count = 0;

        let activeCategory = categoryTreeFromPath.lvl3 || categoryTreeFromPath.lvl2 || categoryTreeFromPath.lvl1;

        if(activeCategory.toLowerCase() === "cleaning-and-care"){
            categories.filter((category) => {
                count+= category.Quantity
            })
        } else if(categoryTreeFromPath.lvl2 && !categoryTreeFromPath.lvl3){
            categories.filter((category) => {
               if(category.Name.split(" ").join("-").toLowerCase() === activeCategory){
                  count = category.Quantity
               }
            })
        } else {
            categories.filter((category) => {
                category.Children.filter((child) => {
                    count = category.Quantity
                })
             })
        }

        return count;
    }


    const getCurrentCategoryName = () => {
        let activeCategory = categoryTreeFromPath.lvl3 || categoryTreeFromPath.lvl2 || categoryTreeFromPath.lvl1;
        return activeCategory.toLowerCase() === "cleaning-and-care" ? "All parts" : activeCategory.split("-").join(" ");
    }
    const getChildCount = (category) => {
        let count = 0;
        category.Children.filter((child) => {
            count+= child.Quantity;
        })
        return count;
    }
    return (
        <>
            {categoryTreeFromPath.lvl1 && categoryTreeFromPath.lvl1.toLowerCase() === "cleaning-and-care" && (
                <div className={styles.cleaningAndCareWrap}>
                    <a className={styles.cleaningAndCareImg} href="/cleaning-and-care"><img src="/arquivos/cleaningAndCare.jpg" /></a>
                    <div className={[styles.cleaningAndCare, categoryTreeFromPath.lvl2 ? styles.cleaningAndCareHasBorder : ""].join(" ")}>
                        {categories && categories.map((category) => {
                            return <a href={`/${categoryTreeFromPath.lvl1}/${category.Name.split(" ").join("-").toLowerCase()}`} className={[styles.cleaningAndCareCategory, categoryTreeFromPath.lvl2 && category.Name.toLowerCase() === categoryTreeFromPath.lvl2.split("-").join(" ").toLowerCase() ? styles.cleaningAndCareCategoryActive : ""].join(" ")}>
                                {category.Name}
                                <br />
                                ({category.Quantity})
                                {categoryTreeFromPath.lvl2 && category.Name.toLowerCase() === categoryTreeFromPath.lvl2.split("-").join(" ").toLowerCase() && (
                                    <>
                                        <div className={styles.cleaningAndCareCategoryArrow}>{">"}</div>
                                        <div className={styles.cleaningAndCareSubCategoryWrapper}>
                                            {category.Children.map((child) => {
                                                return <a href={`/${categoryTreeFromPath.lvl1}/${category.Name.split(" ").join("-").toLowerCase()}/${child.Name.split(" ").join("-").toLowerCase()}`} className={[styles.cleaningAndCareSubCategory, categoryTreeFromPath.lvl3 && child.Name.toLowerCase() === categoryTreeFromPath.lvl3.split("-").join(" ").toLowerCase() ? styles.cleaningAndCareSubCategoryActive : ""].join(" ")}>
                                                    {child.Name}
                                                    <br />
                                                    ({child.Quantity})
                                                </a>
                                            })}
                                        </div>
                                    </>
                                )}
                            </a>
                        })}
                    </div>
              
                </div>
            )}
        </>

    )
}



export default CleaningAndCare