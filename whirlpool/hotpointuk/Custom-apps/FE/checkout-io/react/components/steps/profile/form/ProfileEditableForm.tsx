import React, { useEffect } from "react"
import {
	Button,
	// Toggle
} from "vtex.styleguide"
// import { useRuntime } from 'vtex.render-runtime'
import { useIntl, defineMessages } from "react-intl"
import StepHeader from "../../../step-group/StepHeader"
import { useOrder } from "../../../../providers/orderform"
import style from "../profile.css"
import { useProfile } from "../context/ProfileContext"
import { useCheckout } from "../../../../providers/checkout"

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
	const { orderForm, isSpecsInserted } = useOrder()
	const {
		handleSubmit,
		setRequiredFields,
		isProfileMutationLoading,
		values,
		realEmail,
		optinNewsLetter,
		acceptTerms,
		customDataValues,
		
	} = useProfile()
	const { canEditData } = orderForm

	const items = orderForm?.items

	const sendOptinEvent = () => {
		if (optinNewsLetter) {
			push({
				event: "ga4-optin",
			})
		}
	}
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
		if (isSpecsInserted) {
			//push checkoutStep analytics step 1
			push({
				event: "eec.checkout",
				step: 1,
				orderForm: orderForm,
				items,
			})
		}
		sendEmailForSalesforceEvent()
	}, [isSpecsInserted])

	const handleCheckboxPush = () => {
		if (!acceptTerms || !customDataValues.acceptTerms) {
			push({
				event: "ga4-custom_error",
				type: "error message",
				description: "Please check this box if you want to proceed.",
			})
		}
	}

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
					handleSubmit(e, validation),
					sendEccCheckoutEvent(),
					sendOptinEvent(),
					sendCTAShipping()
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
							onClick={handleCheckboxPush}
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
