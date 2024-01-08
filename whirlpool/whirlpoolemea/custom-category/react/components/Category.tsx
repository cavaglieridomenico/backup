import React from 'react'
import { Link, useRuntime } from "vtex.render-runtime";
import style from "../style.css";

interface CategoryProps {
    categories: Category[];
    handleAnalytics: (url: string) => void;
}

interface Category {
  categoryName: string;
  categoryNameEN: string;
  categoryLink: string;
  imageLink: string;
  imageAltName?: string;
}

const Category: StorefrontFunctionComponent<CategoryProps> = ({categories, handleAnalytics}) => {

  const {
    culture: { locale },
  } = useRuntime();
  const lang = locale == "it-IT" ? "_it" : "_en";


  return (
    <div className={`${style.genericWrapper}`}>
        {categories?.map((category: any, index: any) => (
          <Link key={index} to={category.categoryLink}>
            <div onClick={() => handleAnalytics(category.categoryLink)} className={`${style.categoryContainer}`}>
              <div className={`${style.categoryImageContainer}`}>
                <img className={`${style.categoryImage}`} src={category.imageLink} alt={category.imageAltName || "category image"} />
              </div>
              <div className={`c-action-primary ${style.categoryTextContainer}`}>
                <p className={`${style.categoryTitle}`}>{lang == "_it" ? category.categoryName : category.categoryNameEN}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
  )
}

export default Category;