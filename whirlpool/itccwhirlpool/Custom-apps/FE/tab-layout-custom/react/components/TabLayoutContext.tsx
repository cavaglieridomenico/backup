import React, {
  FunctionComponent,
  useContext,
  useReducer,
  useEffect,
} from 'react'
import { useRuntime } from 'vtex.render-runtime'

interface TabLayoutContextProps {
  activeTab: string
  navigate?: any
}

interface ChangeActiveTabAction {
  type: 'changeActiveTab'
  payload: {
    newActiveTab: string
  }
}

type Dispatch = (action: ChangeActiveTabAction) => void

const initialState = {
  activeTab: '',
}

const TabLayoutStateContext =
  React.createContext<TabLayoutContextProps>(initialState)
const TabLayoutDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
)

function reducer(
  state: TabLayoutContextProps,
  action: ChangeActiveTabAction
): TabLayoutContextProps {
  switch (action.type) {
    case 'changeActiveTab':
      if (action.payload.newActiveTab === state.activeTab) {
        return state
      }
      // window.location.hash = '#' + action.payload.newActiveTab
      return {
        ...state,
        activeTab: action.payload.newActiveTab,
      }
    default:
      return state
  }
}

const TabLayoutContextProvider: FunctionComponent<TabLayoutContextProps> = ({
  children,
  activeTab,
}) => {
  const { navigate } = useRuntime()
  const [state, dispatch] = useReducer(reducer, {
    activeTab,
    navigate,
  })

  useEffect(() => {
    if (window) {
      window.location.hash != '' &&
        dispatch({
          type: 'changeActiveTab',
          payload: { newActiveTab: window.location?.hash.replace('#', '') },
        })
      window.addEventListener('hashchange', () => {
        window.location.hash != '' &&
          dispatch({
            type: 'changeActiveTab',
            payload: { newActiveTab: window.location?.hash.replace('#', '') },
          })
      })
    }
  }, [typeof window])

  return (
    <TabLayoutStateContext.Provider value={state}>
      <TabLayoutDispatchContext.Provider value={dispatch}>
        {children}
      </TabLayoutDispatchContext.Provider>
    </TabLayoutStateContext.Provider>
  )
}

function useTabState() {
  const context = useContext(TabLayoutStateContext)
  if (context === undefined) {
    throw new Error(
      'useTabState must be used within a TabLayoutStateContextProvider'
    )
  }
  return context
}

function useTabDispatch() {
  const context = useContext(TabLayoutDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useTabDispatch must be used within a TabLayoutDispatchContextProvider'
    )
  }
  return context
}

export { TabLayoutContextProvider, useTabDispatch, useTabState }
