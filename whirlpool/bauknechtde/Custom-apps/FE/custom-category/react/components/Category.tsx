import React from 'react'
import { Link } from "vtex.render-runtime";
import {IconArrowBack} from 'vtex.store-icons';
import { useCssHandles } from 'vtex.css-handles'

interface CategoryProps {
    categories: Category[];
    handleAnalytics: (url: string) => void;
}

interface Category {
  categoryName: string;
  categoryLink: string;
  imageLink: string;
  imageAltName?: string;
}

const Category: StorefrontFunctionComponent<CategoryProps> = ({categories, handleAnalytics}) => {

  const CSS_HANDLES = [
    'genericWrapper',
    'categoryContainer',
    'categoryImageContainer',
    'categoryImage',
    'gradient',
    'categoryTextContainer',
    'categoryTitle'
  ] as const
  
  const handles = useCssHandles(CSS_HANDLES);

  return (
    <div className={`${handles.genericWrapper}`}>
        {categories?.map((category: any, index: any) => (
          <Link key={index} to={category.categoryLink}>
            <div onClick={() => handleAnalytics(category.categoryLink)} className={`${handles.categoryContainer}`}>
              <div className={`${handles.categoryImageContainer}`}>
                <img className={`${handles.categoryImage}`} src={category.imageLink} alt={category.imageAltName || "category image"} />
                  <div className={`bb b--action-primary ${handles.gradient}`}></div>
              </div>
              <div className={`c-action-primary ${handles.categoryTextContainer}`}>
                <p className={`${handles.categoryTitle}`}>{category.categoryName}</p>
                  <IconArrowBack />
              </div>
            </div>
          </Link>
        ))}
      </div>
  )
}

export default Category;