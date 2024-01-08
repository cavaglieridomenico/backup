import { useEffect } from 'react'
import { useTabState, useTabDispatch } from '../components/TabLayoutContext'

export const useDeprecatedDefaultActiveTab = (defaultActiveTab: boolean, tabId: string) => {
  const { activeTab } = useTabState()
  const dispatch = useTabDispatch()

  useEffect(() => {
    // defaultActiveTab has been deprecated, keep this for compatibility
    if (defaultActiveTab && activeTab === '') {
      dispatch({
        type: 'changeActiveTab',
        payload: { newActiveTab: tabId },
      })
    }
  }, [])
}