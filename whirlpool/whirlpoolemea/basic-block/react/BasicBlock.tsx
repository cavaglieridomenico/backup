import React from 'react'
import style from './style.css'

const BasicBlock: StorefrontFunctionComponent = () => {
    return (
        <div className={style.title}>
          Hello World
        </div>
            )
}

BasicBlock.schema = {
    title: 'editor.basicblock.title',
    description: 'editor.basicblock.description',
    type: 'object'
}

export default BasicBlock

