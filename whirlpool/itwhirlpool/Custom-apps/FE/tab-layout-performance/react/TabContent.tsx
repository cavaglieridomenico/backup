import React from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['contentContainer'] as const

const TabContent: StorefrontFunctionComponent = props => {
  const { children } = props
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.contentContainer} w-100`}>
      {React.Children.map(children, (child, index) => React.cloneElement(child as any, { position: index }))}
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.tabContent.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.tabContent.description',
  },
})

TabContent.schema = {
  title: messages.title.id,
  description: messages.description.id,
}

export default TabContent