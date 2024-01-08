import React, { useState } from "react"
import { useIntl, defineMessages } from "react-intl"
import style from "./CartModal.css"
import { IconClose } from "vtex.store-icons"

interface CartModalProps {
	onCloseModal: () => void
	onSave: () => void
	modalData: any
}
const messages = defineMessages({
	modalDescription: {
		defaultMessage:
			"Integrated appliance installation is for replacement appliances, where     a new product of identical size can utilise existing connections and     door panels. Before we arrive please ensure the following,",
		id: "checkout-io.cartModal.modalDescription",
	},
	modalCheckboxesTitle: {
		defaultMessage:
			"To ensure your installation goes smoothly please watch the video to the end and respond to the questions below.",
		id: "checkout-io.cartModal.modalCheckboxesTitle",
	},
	modalErrorMessage: {
		defaultMessage:
			"You haven't answered one of the questions, so unfortunately we won't be able to progress with your order. You'll need to remove this service from your basket to continue without connection.",
		id: "checkout-io.cartModal.modalErrorMessage",
	},
	modalSaveButtonText: {
		defaultMessage: "SAVE",
		id: "checkout-io.cartModal.modalSaveButtonText",
	},
})

const CartModal: StorefrontFunctionComponent<CartModalProps> = ({
	onCloseModal,
	onSave,
	modalData,
}) => {
	const intl = useIntl()

	const [errorMessage, setErrorMessage] = useState<boolean>(false)
	const [checkedState, setCheckedState] = useState<any>([])

	const checkboxIsPresent = modalData.filter(
		(item: any) => item.isCheckbox === true,
	)

	const checkboxHandler = (checkboxObject: any) => {
		setCheckedState([...checkedState, checkboxObject])
	}

	const modalSaveHandler = () => {
		const filterFor0 = checkedState.filter((item: any) => item.id === 0)
		const filterFor1 = checkedState.filter((item: any) => item.id === 1)
		if (checkboxIsPresent.length === 1) {
			if (filterFor0.length === 0) {
				setErrorMessage(true)
			} else if (filterFor0[filterFor0.length - 1].checked === false) {
				setErrorMessage(true)
			} else {
				onSave()
			}
		} else {
			if (filterFor0.length === 0 || filterFor1.length === 0) {
				setErrorMessage(true)
			} else if (
				filterFor0[filterFor0.length - 1].checked === false ||
				filterFor1[filterFor1.length - 1].checked === false
			) {
				setErrorMessage(true)
			} else {
				onSave()
			}
		}
	}
	const closeModalHandler = () => {
		onCloseModal()
	}

	return (
		<>
			<div className={`${style.cartModalContainer}`}>
				<button
					className={`ma0 bg-transparent pointer bw0 pa3`}
					onClick={closeModalHandler}
				>
					<IconClose type="line" />
				</button>
				<div className={style.cartModalVideoContainer}>
					<iframe
						width="304"
						height="154"
						src={`https://www.youtube.com/embed/${modalData[0].video}`}
					></iframe>
				</div>
				<p className={style.modalDescription}>
					{intl.formatMessage(messages.modalDescription)}
				</p>

				{modalData
					.filter((item: any) => item.isCheckbox === false)
					.map((item: any) => (
						<ul className={style.cartModalUnorderedList}>
							<li className={style.cartModalListItem}>{item.content}</li>
						</ul>
					))}
				<p className={style.textOverCheckbox}>
					{intl.formatMessage(messages.modalCheckboxesTitle)}
				</p>
				{checkboxIsPresent.map((item: any, idx: number) => (
					<div className={style.modalCheckboxContainer}>
						<input
							className="mr3"
							type="checkbox"
							onChange={(e) =>
								checkboxHandler({ id: idx, checked: e.target.checked })
							}
						/>

						<p className={style.textNearCheckbox}>{item.content}</p>
					</div>
				))}
				{errorMessage && (
					<p className={`${style.errorMessage} c-danger b-danger`}>
						{intl.formatMessage(messages.modalErrorMessage)}
					</p>
				)}
				<div className={style.saveButtonContainer}>
					<button
						className={`${style.saveButton} bg-action-primary`}
						onClick={modalSaveHandler}
					>
						{intl.formatMessage(messages.modalSaveButtonText)}
					</button>
				</div>
			</div>
		</>
	)
}

export default CartModal
