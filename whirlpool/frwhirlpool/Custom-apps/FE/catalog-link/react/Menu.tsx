/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React from 'react'
import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import SubCategory from './components/SubCategory/SubCategory'
import { catalogLinks } from '../utils/index'

const CSS_HANDLES = ['title'] as const

const Menu: StorefrontFunctionComponent = () => {
  const handles = useCssHandles(CSS_HANDLES)
  return (
    <div className="flex flex-wrap flex-auto items-baseline">
      {catalogLinks.map((element: any) => {
        return (
          <div className="mv3 flex-grow-1 w-100 w-25-l w-40-ns">
            <Link className={handles.title} href={element.link}>
              {element.title}
            </Link>
            <SubCategory subCategory={element.subcategory} />
          </div>
        )
      })}
    </div>
  )
}

Menu.schema = {
  title: 'editor.menu.title',
  description: 'editor.menu.description',
  type: 'object',
}

export default Menu
