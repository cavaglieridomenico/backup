import React from 'react'
import { defineMessages } from 'react-intl'

// import { Button } from 'vtex.styleguide'
import { IOMessage } from 'vtex.native-types'
import { useCssHandles } from 'vtex.css-handles'

import { useTabState } from './components/TabLayoutContext'
import { useDeprecatedDefaultActiveTab } from './modules/useDeprecatedDefaultActiveTab'
import { Link } from 'vtex.render-runtime'

const CSS_HANDLES = ['listItem', 'listItemActive', 'listItemLink'] as const

interface Props {
  tabId: string
  label: string
  /**
   * @deprecated This prop should not be used
   */
  defaultActiveTab: boolean
  position: number
}

function TabListItem(props: Props) {
  const { tabId, label, defaultActiveTab, position } = props
  const handles = useCssHandles(CSS_HANDLES)
  const { activeTab } = useTabState()

  useDeprecatedDefaultActiveTab(defaultActiveTab, tabId)

  const isActive = activeTab.startsWith(tabId) || (!activeTab && position === 0)

  // const handleClick = () => {
  //   dispatch({
  //     type: 'changeActiveTab',
  //     payload: { newActiveTab: tabId },
  //   })
  // }

  if (!label || label === '') {
    return null
  }

  return (
    <div
      className={`${handles.listItem} ${
        isActive ? handles.listItemActive : ''
      } ph2 pv2 ma2`}
    >
      <Link
        className={handles.listItemLink}
        variation={isActive ? 'primary' : 'tertiary'}
        to={`#${tabId}`}
      >
        <IOMessage id={label} />
      </Link>
    </div>
  )
}

const messages = defineMessages({
  title: {
    id: 'admin/editor.tabListItem.title',
  },
  description: {
    id: 'admin/editor.tabListItem.description',
  },
})

TabListItem.schema = {
  title: messages.title.id,
  description: messages.description.id,
}

export default TabListItem
