//@ts-nocheck

import React from 'react'
import { Link } from "vtex.render-runtime";
import style from "../style.css";
import {IconArrowBack} from 'vtex.store-icons'

interface CategoryProps {
    categories?: Category[];
    handleAnalytics: (url: string) => void;
}

interface Category {
  categoryName: string;
  categoryLink: string;
  imageLink: string;
  imageAltName?: string;
}

const Category:StorefrontFunctionComponent<CategoryProps> = ({categories, handleAnalytics}) => {
  return (
      <div className={style.wrapper}>
        {categories?.map((category: any, index: any) => (
          <Link key={index} to={category.categoryLink}>
            <div onClick={() => handleAnalytics(category.categoryLink)} className={style.categoryContainer}>
              <div className={style.categoryImageContainer}>
                <img className={style.categoryImage} src={category.imageLink} alt={category.imageAltName || "category image"} />
                <div className={`bb b--action-primary ${style.gradient}`}></div>
              </div>
              <div className={`c-action-primary ${style.categoryTextContainer}`}>
                <p className={style.categoryTitle}>{category.categoryName}</p>
                <IconArrowBack />
              </div>
            </div>
          </Link>
        ))}
      </div>
  )
}

export default Category