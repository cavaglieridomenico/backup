import React from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['listContainer'] as const

const TabList: StorefrontFunctionComponent = props => {
  const { children } = props
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.listContainer} flex w-100 flex-wrap justify-center`}>
      {React.Children.map(children, (child, index) => React.cloneElement(child as any, { position: index }))}
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.tabList.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.tabList.description',
  },
})

TabList.schema = {
  title: messages.title.id,
  description: messages.description.id,
}

export default TabList