import React from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { TabLayoutContextProvider } from './components/TabLayoutContext'

const CSS_HANDLES = ['container'] as const

interface Props {
  defaultActiveTabId?: string
}

const TabLayout: StorefrontFunctionComponent<Props> = (props) => {
  const { children, defaultActiveTabId = '' } = props
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <TabLayoutContextProvider activeTab={defaultActiveTabId}>
      <div className={handles.container}>{children}</div>
    </TabLayoutContextProvider>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.tabLayout.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.tabLayout.description',
  },
})

TabLayout.schema = {
  title: messages.title.id,
  description: messages.description.id,
}

export default TabLayout
