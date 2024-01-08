import React, { useMemo } from 'react'
import type { ComponentType } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import ConditionLayout from './ConditionLayout'
import type { NoUndefinedField, MatchType, Condition, Handlers } from './types'

interface Props {
  conditions: Array<Condition<ContextValues, HandlerArguments>>
  matchType?: MatchType
  Else?: ComponentType
  Then?: ComponentType
}

interface ContextValues {
  [key: string]: string
  id: string
  type: 'category' | 'department' | 'subcategory'
}

interface HandlerArguments {
  category: { ids: string[] }
  department: { ids: string[] }
  subcategory: { ids: string[] }
}

const skippedRoutes = [
  "vtex.store@2.x:store.custom#spare-parts-laundry",
  "vtex.store@2.x:store.custom#spare-parts-cooking",
  "vtex.store@2.x:store.custom#spare-parts-dishwashing",
  "vtex.store@2.x:store.custom#spare-parts-refrigeration",
  "vtex.store@2.x:store.custom#spare-parts-small-appliances",
  "vtex.store@2.x:store.custom#laundry",
  "vtex.store@2.x:store.custom#cooking",
  "vtex.store@2.x:store.custom#dishwashing",
  "vtex.store@2.x:store.custom#small-appliances",
  "vtex.store@2.x:store.custom#refrigeration"
]



const handlersMap: Handlers<ContextValues, HandlerArguments> = {
  category({ values, args }) {
    if (values.type !== 'category' && !skippedRoutes.includes(values.id)) {
      return false
    }

    return args.ids.includes(values.id) || skippedRoutes.includes(values.id)
  },
  department({ values, args }) {
    if (values.type !== 'department'  && !skippedRoutes.includes(values.id)) {
      return false
    }

    return args.ids.includes(values.id) || skippedRoutes.includes(values.id)
  },
  subcategory({ values, args }) {
    if (values.type !== 'subcategory' && !skippedRoutes.includes(values.id)) {
      return false
    }

    return args.ids.includes(values.id) || skippedRoutes.includes(values.id)
  }
}

const ConditionLayoutCategory: StorefrontFunctionComponent<Props> = ({
  Else,
  Then,
  matchType,
  conditions,
  children,
}) => {
  const {
    route: {
      pageContext: { id, type },
    },
  } = useRuntime()

  const values = useMemo<ContextValues>(() => {
    const bag = {
      id,
      type,
    }

    // We use `NoUndefinedField` to remove optionality + undefined values from the type
    return bag as NoUndefinedField<typeof bag>
  }, [id, type])

  return (
    <ConditionLayout
      Else={Else}
      Then={Then}
      matchType={matchType}
      conditions={conditions}
      values={values}
      handlers={handlersMap}
    >
      {children}
    </ConditionLayout>
  )
}

export default ConditionLayoutCategory
