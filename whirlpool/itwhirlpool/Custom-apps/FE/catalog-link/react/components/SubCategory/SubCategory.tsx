/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React, { useState } from 'react'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

const CSS_HANDLES = [
  'seeMoreButton',
  'subcategory',
  'hiddenSubcategory',
] as const

interface CategoryProps {
  subCategory: any
}
const SubCategory: StorefrontFunctionComponent<CategoryProps> = ({
  subCategory,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const [hidden, setHidden] = useState(true)
  return subCategory.map((subcat: any, index: number) => {
    return (
      <div className="mv3 flex-grow-1">
        <div>
          <Link
            className={
              index < 4
                ? handles.subcategory
                : hidden
                ? handles.hiddenSubcategory
                : handles.subcategory
            }
            href={subcat.link}
          >
            {subcat.name}
          </Link>
        </div>
        {index === 3 && index < subCategory.length - 1 && hidden && (
          <div
            className={`mv3 ${handles.seeMoreButton}`}
            onClick={() => setHidden(!hidden)}
          >
            <FormattedMessage id="store/seemore" />
          </div>
        )}
        {index === subCategory.length - 1 && !hidden && (
          <div
            className={`mv3 ${handles.seeMoreButton}`}
            onClick={() => setHidden(!hidden)}
          >
            <FormattedMessage id="store/seeless" />
          </div>
        )}
      </div>
    )
  })
}

SubCategory.schema = {
  title: 'editor.subcategory.title',
  description: 'editor.subcategory.description',
  type: 'object',
}

export default SubCategory
