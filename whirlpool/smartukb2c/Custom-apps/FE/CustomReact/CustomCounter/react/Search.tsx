import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Icon } from 'vtex.store-icons'

interface Search {}

const Search: StorefrontFunctionComponent<Search> = ({}) => {
  const CSS_HANDLES = ['searchMainDiv','iconSearch']
  const handles = useCssHandles(CSS_HANDLES)

  return <div className={`${handles.searchMainDiv}`}>
          <Icon id="hpa-search" className={`${handles.iconSearch}`}/>
        </div>
} 

export default Search
