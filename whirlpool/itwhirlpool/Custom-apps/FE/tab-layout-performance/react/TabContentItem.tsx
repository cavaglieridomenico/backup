import React from 'react'
import { defineMessages } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import {
  useTabState
} from './components/TabLayoutContext'

const CSS_HANDLES = ['contentItem'] as const

interface Props {
  tabId: string
  position: number
}

const TabContentItem: StorefrontFunctionComponent<Props> = props => {
  const { tabId, children, position } = props
  const handles = useCssHandles(CSS_HANDLES)
  const { activeTab } = useTabState()

  const shouldShow = activeTab === tabId || (!activeTab && position === 0)

  if (!shouldShow) return null

  return (
    <div className={`${handles.contentItem} w-100`}>
      {children}
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.tabContentItem.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.tabContentItem.description',
  },
})

TabContentItem.schema = {
  title: messages.title.id,
  description: messages.description.id,
}

export default TabContentItem