import React, { createContext, useContext, useMemo, useState } from 'react'
import { useQuery, useLazyQuery } from 'react-apollo'
import { useRuntime } from 'vtex.render-runtime'
import getFaqsCategory from "../graphql/getFaqsCategory.graphql"
import getGroupsWithItsFaqs from "../graphql/getGroupsWithItsFaqs.graphql"

interface Context {
    categories: any
    categoriesError: boolean
    categoriesLoading: boolean
    getFaqsByCategory: any
    FAQs: any,
    FAQsByGroupsLoading: boolean
}

const FAQContext = createContext<Context>({} as Context)

export const FAQContextProvider: React.FC = ({ children }) => {
    const { production } = useRuntime()

    const [FAQs, setFAQs] :any = useState()

    const {
        data: categoriesData,
        error: categoriesError,
        loading: categoriesLoading,
    } = useQuery(getFaqsCategory)

    const categories = categoriesData?.getFaqsCategory as any

    const [getFaqsGroups, { data: FAQsByGroups, loading: FAQsByGroupsLoading }] = useLazyQuery(getGroupsWithItsFaqs, {
        onCompleted: () => {
         setFAQs(FAQsByGroups?.getGroupsWithItsFaqs)
      }});

    const getFaqsByCategory = (categoryId: string) =>{
        getFaqsGroups({
            variables: {
                categoryId: categoryId
             },
          })
    }

    if (!production) {
        console.log('%c CATEGORIES ', 'background: green; color: white', categories)
    }

    const context = useMemo(
        () => ({
            categories,
            categoriesError,
            categoriesLoading,
            getFaqsByCategory,
            FAQs,
            FAQsByGroupsLoading
        }),
        [
            categories,
            categoriesError,
            categoriesLoading,
            FAQs,
            FAQsByGroupsLoading
        ]
    )

    return (
        <FAQContext.Provider value={context}>{children}</FAQContext.Provider>
    )
}

export const useFAQ = () => {
    const context = useContext(FAQContext)

    if (context === undefined) {
        throw new Error('useOrder must be used within an OrderContextProvider')
    }

    return context
}

export default { FAQContextProvider, useFAQ }
