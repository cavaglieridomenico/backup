import { AnaliticsWrapper } from "whirlpoolemea.analytics-wrapper-component";
import React from 'react';
import { useCssHandles } from 'vtex.css-handles';
import { Link } from "vtex.render-runtime";
import { index as RichText } from "vtex.rich-text";

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

const PlpFilters: StorefrontFunctionComponent<FilterProps> = ({ categories, routeCategory }) => {

  const CSS_HANDLES = [
    'genericWrapper',
    'filterWrapper',
    'categoryContainer',
    'filterCategoryContainer',
    'categoryImageContainer',
    'filterCategoryImageContainer',
    'categoryImage',
    'filterCategoryImage',
    'categoryTextContainer',
    'filterCategoryTextContainer',
    'categoryTitle',
    'filterCategoryTitle'
  ] as const

  const handles = useCssHandles(CSS_HANDLES);

  return (
    <>
        <div className={`${handles.genericWrapper} ${handles.filterWrapper}`}>
          {categories?.map((category: any) => (
            <AnaliticsWrapper isLeazy={true} propsAnalytics={{ "analyticsProperties": "provide", "nameEvent": "FR-filtertest", "name": "Click", "data": [{ "title": "category", "value": routeCategory }, { "title": "subcategory", "value": category.categoryName }] }}>
              <Link style={{"textDecoration": "none"}} to={category.categoryLink}>
                <div className={`${handles.categoryContainer} ${handles.filterCategoryContainer}`}>
                  <div className={`${handles.categoryImageContainer} ${handles.filterCategoryImageContainer}`}>
                    <img className={`${handles.categoryImage} ${handles.filterCategoryImage}`} src={category.imageLink} alt={category.imageAltName || "category image"} />
                  </div>
                  <div className={`c-action-primary ${handles.categoryTextContainer} ${handles.filterCategoryTextContainer}`}>
                    <RichText text={category.categoryName}
                      className={`${handles.categoryTitle} ${handles.filterCategoryTitle}`}
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