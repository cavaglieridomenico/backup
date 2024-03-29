import React, { useEffect } from "react"
import { Button } from "vtex.styleguide"
import { useIntl, defineMessages } from "react-intl"
import StepHeader from "../../../../checkout/step-group/StepHeader"
import { useOrder } from "../../../../../providers/orderform"
import style from "../profile.css"
import { useProfile } from "../context/ProfileContext"
import { useCheckout } from "../../../../../providers/checkout"
import { useQuery } from "react-apollo"
import getProductsProperties from "../../../../../graphql/productsProperties.graphql"

interface ProfileEditableFormProps {
	children: any
}

const ProfileEditableForm: React.FC<ProfileEditableFormProps> = ({
	children,
	validation = {
		isEmailRequired: true,
		isFirstNameRequired: true,
		isLastNameRequired: true,
		isDocumentRequired: false,
		isDocumentTypeRequired: false,
		isPhoneRequired: true,
	},
}: // clientProfile,
// handleProfile,
any) => {
	const { push } = useCheckout()
	const intl = useIntl()
	// const { deviceInfo } = useRuntime()
	const { orderForm } = useOrder()
	const {
		handleSubmit,
		setRequiredFields,
		isProfileMutationLoading,
		values,
		realEmail,
	} = useProfile()
	const { canEditData } = orderForm

	const items = orderForm?.items
	/** da capire se refactor */
	let itemIds = items?.map(item => item.id)
	//pulisco da doppioni
	itemIds = [...new Set(itemIds)]
	//tiro giù le properties dei prodotti
	const { data } = useQuery(getProductsProperties, {
		variables: {
			field: "sku",
			values: itemIds,
		},
	})

	const propertiesList = data?.productsByIdentifier
	items?.map(item => {
		propertiesList?.map((itemWithProps: any) => {
			if (itemWithProps.productId == item.productId) {
				let sellable = itemWithProps.properties.filter(
					(e: any) => e.name == "sellable",
				)
				let field5 = itemWithProps.properties.filter(
					(e: any) => e.name == "field5",
				)
				let colour = itemWithProps.properties.filter(
					(e: any) => e.name == "Colour",
				)
				item.sellable = sellable[0]?.values[0]
				item.field5 = field5[0]?.values[0]
				item.colour = colour[0]?.values[0]
			}
		})

		return item
	})

	const sendEccCheckoutEvent = () => {
		//push checkoutStep analytics step 2
		/*push({
			event: "eec.checkout",
			step: "step 2",
			orderForm: orderForm,
		})*/
	}
	const sendEmailForSalesforceEvent = () => {
		push({
			event: "emailForSalesforce",
			email: values.email,
		})
	}
	const sendCTAShipping = () => {
		push({
			event: "ctaShipping",
			text: intl.formatMessage(messages.save),
		})
	}

	useEffect(() => {
		setRequiredFields(validation)
		if (data != undefined) {
			//push checkoutStep analytics step 1
			push({
				event: "eec.checkout",
				step: 1,
				orderForm: orderForm,
				items,
			})
		}
		sendEmailForSalesforceEvent()
	}, [data])

	return (
		<>
			<div className={style.StepHeader}>
				<StepHeader
					title={intl.formatMessage(messages.profile)}
					canEditData={canEditData}
				/>
			</div>
			<form
				onSubmit={(e: any) => (
					handleSubmit(e, validation), sendEccCheckoutEvent(), sendCTAShipping()
				)}
				className={style.profileSumbitButton}
				data-testid="profile-continue-wrapper"
			>
				<div className="mt4">
					{/*  InfoData.tsx */}
					{children}
					<div className="mt4 flex center w-50">
						<Button
							size="medium"
							variation="primary"
							type="submit"
							isLoading={isProfileMutationLoading}
							disabled={realEmail?.disabledButton}
							block
						>
							<span className="f5">{intl.formatMessage(messages.save)}</span>
						</Button>
					</div>
				</div>
			</form>
		</>
	)
}

const messages = defineMessages({
	profile: {
		defaultMessage: "Contact information",
		id: "checkout-io.profile",
	},
	// optinNewsLetter: {
	//   defaultMessage: 'Subscribe to our newsletter',
	//   id: 'checkout-io.subscribe-to-our-newsletter',
	// },
	save: {
		defaultMessage: "Procede to shipping",
		id: "checkout-io.save",
	},
})

export default ProfileEditableForm

{
	/* <div className="mv7">
          <div className="mt6">
            <Toggle
              name="optinNewsLetter"
              label={optinNewsLetterLabel}
              size={deviceInfo.isMobile ? 'large' : 'regular'}
              checked={clientPreferences?.optinNewsLetter}
              onChange={handlePreference}
            />
          </div>
        </div> */
}
