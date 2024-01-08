import React, {
	createContext,
	useContext,
	// useEffect,
	useMemo,
	useState,
} from "react"

import { useQuery } from "react-apollo"
import { useOrder } from "../../../../providers/orderform"
import getSpecificationsMultipleItems from "../../../../graphql/getSpecificationsMultipleItems.graphql"
import { Specification } from "../../../../typings/productSpecification"

interface Context {
	itemsFgasSpecs: ItemSpec[]
	itemsFgasLoading: any
	itemsFgasError: any
	refreshItemsFgas: any
	checkIsCartWithFgas: any
	checkIsItemFgas: any
	fgasModalAlreadyShown: boolean
	setFgasModalAlreadyShown: any
	showFgasModal: boolean
	setShowFgasModal: any
}

interface ItemSpec {
	productId: string
	specifications: Specification
}

interface FgasContextProps {
	fgasSpecificationName?: string
	fgasSpecificationValue?: string
}

const FgasContext = createContext<Context>({} as Context)

export const FgasContextProvider: React.FC<FgasContextProps> = ({
	children,
	fgasSpecificationName = "fgas",
	fgasSpecificationValue = "false",
}) => {

	const {
		orderForm: { items },
	} = useOrder()

	const {
		data,
		error,
		loading: itemsFgasLoading,
		refetch: refreshItemsFgas,
	} = useQuery(getSpecificationsMultipleItems, {
		variables: {
			productIds: items?.map(item => item.productId) || [],
			specificationNames: [fgasSpecificationName],
		},
	})

	const itemsFgasSpecs = data?.specificationsMultipleItems || []
	const itemsFgasError = Boolean(error)

	const checkIsCartWithFgas = (): boolean => {
		return (
			itemsFgasSpecs?.some(
				(itemSpec: { specifications: { Value: string[] }[] }) =>
					itemSpec?.specifications[0]?.Value[0] == fgasSpecificationValue,
			) || false
		)
	}

	const checkIsItemFgas = (productId: string): boolean => {
		const itemFgasSpec = itemsFgasSpecs?.find(
			(itemSpec: { productId: string }) => itemSpec.productId == productId,
		)
		return itemFgasSpec
			? itemFgasSpec.specifications[0]?.Value[0] == fgasSpecificationValue
			: false
	}

	const [fgasModalAlreadyShown, setFgasModalAlreadyShown] = useState(false)
	const [showFgasModal, setShowFgasModal] = useState(false)


	const context = useMemo(
		() => ({
			itemsFgasSpecs,
			itemsFgasLoading,
			itemsFgasError,
			refreshItemsFgas,
			checkIsCartWithFgas,
			checkIsItemFgas,
			fgasModalAlreadyShown,
			setFgasModalAlreadyShown,
			showFgasModal,
			setShowFgasModal,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[itemsFgasSpecs, fgasModalAlreadyShown, showFgasModal],
	)

	return <FgasContext.Provider value={context}>{children}</FgasContext.Provider>
}

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
export const useFgas = () => {
	const context = useContext(FgasContext)

	if (context === undefined) {
		throw new Error("useFgas must be used within a FgasContextProvider")
	}

	return context
}

export default { FgasContextProvider, useFgas }
