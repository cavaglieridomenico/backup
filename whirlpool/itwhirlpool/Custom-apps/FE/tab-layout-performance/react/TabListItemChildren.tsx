import React from 'react'
import { defineMessages } from 'react-intl'

import { useCssHandles } from 'vtex.css-handles'

import { useTabState, useTabDispatch } from './components/TabLayoutContext'
import { useDeprecatedDefaultActiveTab } from './modules/useDeprecatedDefaultActiveTab'

const CSS_HANDLES = ['listItemChildren', 'listItemChildrenActive'] as const

interface Props {
  tabId: string
  defaultActiveTab: boolean //deprecated
  position: number
}

const TabListItemChildren: StorefrontFunctionComponent<Props> = props => {
  const { tabId, defaultActiveTab, position, children } = props
  const handles = useCssHandles(CSS_HANDLES)
  const { activeTab } = useTabState()
  const dispatch = useTabDispatch()

  useDeprecatedDefaultActiveTab(defaultActiveTab, tabId)

  const isActive = activeTab === tabId || (!activeTab && position === 0)

  const handleClick = () =>
    dispatch({
      type: 'changeActiveTab',
      payload: { newActiveTab: tabId },
    })

  return (
    <div
      role="button"
      onClick={handleClick}
      className={`${handles.listItemChildren} ${
        isActive ? handles.listItemChildrenActive : ''
      } ph2 pv2 ma2`}
    >
      {children}
    </div>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.tabListItem.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.tabListItem.description',
  },
})

TabListItemChildren.schema = {
  title: messages.title.id,
  description: messages.description.id,
}

export default TabListItemChildren
