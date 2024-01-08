import React from 'react'
import {AnaliticsWrapper} from "frwhirlpool.analytics-wrapper-component";
import { Link } from "vtex.render-runtime";
import {index as RichText} from "vtex.rich-text";
import style from "../style.css";

interface FilterProps {
  categories?: Category[];
  routeCategory?: string;
 }
interface Category {
  categoryName: string;
  categoryLink: string;
  imageLink: string;
  imageAltName?: string;
}

const PlpFilters: StorefrontFunctionComponent<FilterProps> = ({categories, routeCategory}) => {
  return (
    <>
          <div className={`${style.genericWrapper} ${style.filterWrapper}`}>
            {categories?.map((category: any) => (
              <AnaliticsWrapper isLeazy={true} propsAnalytics={{"analyticsProperties": "provide", "nameEvent": "FR-filtertest", "name": "Click", "data": [{"title": "category", "value": routeCategory}, {"title": "subcategory", "value": category.categoryName}]}}>
                <Link to={category.categoryLink}>
                  <div className={`${style.categoryContainer} ${style.filterCategoryContainer}`}>
                    <div className={`${style.categoryImageContainer} ${style.filterCategoryImageContainer}`}>
                      <img className={`${style.categoryImage} ${style.filterCategoryImage}`} src={category.imageLink} alt={category.imageAltName || "category image"} />
                    </div>
                    <div className={`c-action-primary ${style.categoryTextContainer} ${style.filterCategoryTextContainer}`}>
                      <RichText text={category.categoryName}
                      className={`${style.categoryTitle} ${style.filterCategoryTitle}`}
                      />
                    </div>
                  </div>
                </Link>
              </AnaliticsWrapper>
            ))}
          </div>
      </>
  )
}

export default PlpFilters