//@ts-nocheck
import React from 'react'
import style from './style.css'

const Brand: StorefrontFunctionComponent = () => {
    return (
        <reevoo-badge
  type="brand"
  className="reevoo-badge"
></reevoo-badge>
            )
}

Brand.schema = {
    title: 'editor.basicblock.title',
    description: 'editor.basicblock.description',
    type: 'object'
}

export default Brand

