import React from "react"
import FgasContainer from "./containers/FgasContainer"
import { FgasContextProvider } from "./context/FgasContext"
import FgasItemContainer from "./containers/FgasItemContainer"

interface FgasWrapperProps {
	children: any
	alternativeChildren?: string[]
	checkSingleItem?: boolean
}

// It can be used to show any components requiring access to the Fgas context
// The visualization of the children, based on the fgas conditions, is already handled by the containers components
const FgasWrapper: React.FC<FgasWrapperProps> = ({
	children,
	alternativeChildren = [],
	checkSingleItem = false,
}) => {
	return (
		<FgasContextProvider>
			{checkSingleItem ? (
				<FgasItemContainer alternativeChildren={alternativeChildren}>
					{children}
				</FgasItemContainer>
			) : (
				<FgasContainer alternativeChildren={alternativeChildren}>
					{children}
				</FgasContainer>
			)}
		</FgasContextProvider>
	)
}

export default FgasWrapper
