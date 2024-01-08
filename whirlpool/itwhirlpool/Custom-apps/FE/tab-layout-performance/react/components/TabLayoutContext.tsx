import React, { FunctionComponent, useContext, useReducer } from 'react'

interface TabLayoutContextProps {
  activeTab: string
}

interface ChangeActiveTabAction {
  type: 'changeActiveTab'
  payload: {
    newActiveTab: string
  }
}

type Dispatch = (action: ChangeActiveTabAction) => void

const initialState = {
  activeTab: ""
}

const TabLayoutStateContext = React.createContext<TabLayoutContextProps>(initialState)
const TabLayoutDispatchContext = React.createContext<Dispatch | undefined>(undefined)

function reducer(state: TabLayoutContextProps, action: ChangeActiveTabAction): TabLayoutContextProps {
  switch (action.type) {
    case 'changeActiveTab':
      if (action.payload.newActiveTab === state.activeTab) {
        return state
      }
      return {
        ...state,
        activeTab: action.payload.newActiveTab
      }
    default:
      return state
  }
}

const TabLayoutContextProvider: FunctionComponent<
  TabLayoutContextProps
> = ({ children, activeTab }) => {
  const [state, dispatch] = useReducer(reducer, {
    activeTab,
  })
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