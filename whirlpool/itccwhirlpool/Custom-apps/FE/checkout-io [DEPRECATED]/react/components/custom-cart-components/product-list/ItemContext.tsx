import type { FC } from "react"
import React, { createContext, useContext } from "react"
import type { Item } from "vtex.checkout-graphql"

interface Context {
	item: Item
	itemIndex: number
	loading: boolean
	offerings: any
	leadtime: string
}

interface ItemContextProviderProps {
	value: Context
}

const ItemContext = createContext<Context | undefined>(undefined)

export const ItemContextProvider: FC<ItemContextProviderProps> = ({
	value,
	children,
}) => <ItemContext.Provider value={value}>{children}</ItemContext.Provider>

export const useItemContext = () => {
	const context = useContext(ItemContext)

	if (context === undefined) {
		throw new Error("useItemContext must be used within a ItemContextProvider")
	}

	return context
}

export default { useItemContext }
