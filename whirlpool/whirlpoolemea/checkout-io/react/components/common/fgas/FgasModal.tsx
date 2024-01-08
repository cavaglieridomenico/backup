import React from "react"
import { Modal } from "vtex.styleguide"
import { useFgas } from "./context/FgasContext"

interface FgasModalProps {
	children: any
	TriggerButton: any
}

const FgasModal: StorefrontFunctionComponent<FgasModalProps> = ({
	children,
	// It must be a React Component accepting the prop "action" to be used as an alternative onClick handler
	// E.g. GoToCheckout, PlaceOrder
	TriggerButton = <></>,
}) => {
	// const intl = useIntl()

	const {
		fgasModalAlreadyShown,
		setFgasModalAlreadyShown,
		showFgasModal,
		setShowFgasModal,
	} = useFgas()

	const closeModalHandler = () => {
		setShowFgasModal(false)
		setFgasModalAlreadyShown(true)
	}

	const handleFgasModal = () => {
		setShowFgasModal(true)
	}

	return (
		<>
			{fgasModalAlreadyShown ? (
				<TriggerButton></TriggerButton>
			) : (
				<>
					<TriggerButton action={handleFgasModal}></TriggerButton>
					<Modal
						isOpen={showFgasModal && !fgasModalAlreadyShown}
						onClose={closeModalHandler}
						onBlur={closeModalHandler}
						// showCloseIcon={false}
					>
						{children}
					</Modal>
				</>
			)}
		</>
	)
}

export default FgasModal
