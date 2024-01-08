import React, { useEffect, useState } from "react"
// import { IconCheck } from 'vtex.styleguide'
import { useIntl, defineMessages } from "react-intl"
import StepHeader from "../../step-group/StepHeader"
import { useOrder } from "../../../providers/orderform"
import style from "./profile.css"
import { useHistory } from "react-router"
import { useMutation } from "react-apollo"
import anonimize from "../../../graphql/anonimize.graphql"
import routes from "../../../utils/routes"
import { IconInfo } from "vtex.styleguide"


const messages = defineMessages({
  profile: {
    defaultMessage: "Profile",
    id: "checkout-io.profile",
  },
  please: {
    defaultMessage: "Please",
    id: "checkout-io.please",
  },
  clickHere: {
    defaultMessage: "click here",
    id: "checkout-io.click-here",
  },
  signIn: {
    defaultMessage: "Sign in",
    id: "checkout-io.sign-in",
  },
  dirtyProfileTitle: {
    defaultMessage: "We’ve found an existing account, but ‘Phone number’ is missing",
    id: "checkout-io.dirty-profile-title",
  },
  dirtyProfileInfo1: {
    defaultMessage: "to add your telephone number.",
    id: "checkout-io.dirty-profile-info-1",
  },
  dirtyProfileInfo2: {
    defaultMessage: "We need your contact number to keep you informed of your delivery progress on the day.",
    id: "checkout-io.dirty-profile-info-2",
  },
  dirtyProfileInfo3: {
    defaultMessage: "Alternatively,  ",
    id: "checkout-io.dirty-profile-info-3",
  },
  dirtyProfileInfo4: {
    defaultMessage: "  to change the email address.",
    id: "checkout-io.dirty-profile-info-4",
  },
  subscribed: {
    defaultMessage: "Subscribed",
    id: "checkout-io.subscribed",
  },
  or: {
    defaultMessage: "or",
    id: "checkout-io.profile-summary.or",
  },
  changeEmail: {
    defaultMessage: "Change Email",
    id: "checkout-io.profile-summary.change-email",
  },
  change: {
    defaultMessage: "Change",
    id: "checkout-io.profile-summary.change",
  },
  name: {
    defaultMessage: "Name",
    id: "checkout-io.profile-summary.name",
  },
  email: {
    defaultMessage: "Email",
    id: "checkout-io.profile-summary.email",
  },
  document: {
    defaultMessage: "Document",
    id: "checkout-io.profile-summary.document",
  },
  phone: {
    defaultMessage: "Phone",
    id: "checkout-io.profile-summary.phone",
  }
})

const ProfileSummary: React.FC = ({ children }) => {
  const history = useHistory()
  const intl = useIntl()
  const { orderForm, refreshOrder } = useOrder()
  const {
    clientProfileData,
    // clientPreferencesData,
    customData,
    canEditData,
  } = orderForm

  const [profileHasDirtyData, setProfileHasDirtyData] = useState(false);
  const firstName = clientProfileData ? clientProfileData.firstName : null
  const lastName = clientProfileData ? clientProfileData.lastName : null
  const document = clientProfileData ? clientProfileData.document : null
  const documentType = clientProfileData ? clientProfileData.documentType : null
  const phone = clientProfileData ? clientProfileData.phone : null
  const email = clientProfileData?.email?.includes("fake")
    ? customData?.customApps?.find((item: any) => item.id == "profile")?.fields
      .email
    : clientProfileData?.email

  const SummaryLogin = (children as any)?.find(
    (child: any) => child.props.id == "login#checkout",
  )

  /*--- ANONIMIZE MUTATION ---*/
  const changeToAnon = () => {
    changeToAnonymous({
      variables: { orderFormId: orderForm.orderFormId },
    })
  }

  const [changeToAnonymous]: any = useMutation(anonimize, {
    onCompleted() {
      refreshOrder()
    },
  })

  const handleChangeEmail = () => {
    changeToAnon()
    history.push(routes.PROFILE)
  }
  useEffect(() => {
    if (orderForm && orderForm.clientProfileData) {
      const { firstName, lastName, phone } = orderForm?.clientProfileData;
      if (orderForm?.userProfileId && !firstName || !lastName || !phone) {
        setProfileHasDirtyData(true);
      }
    }
  }, [orderForm])
  return (
    <>
      <div className={style.StepHeader}>
        <StepHeader
          title={intl.formatMessage(messages.profile)}
          canEditData={canEditData}
          isSummary={true}
          step={"profile"}
        />
      </div>
      <div className={`${style.profileSummaryContainer} bg-checkout`}>
        <div className={`${style.profileSummaryEmail} flex mb4`}>
          <span
            className={`${style.profileSummaryLabel} ${style.profileSummaryLabelNoMargin}`}
          >
            {`${intl.formatMessage(messages.email)}: ${email}`}
          </span>
          {!canEditData && (
            <div className={style.signInContainerSummary}>
              <div className={style.emailModalButtonSingIn}>
                {SummaryLogin}
              </div>
              <span className={style.signInORSummary}>
                {intl.formatMessage(messages.or)}
              </span>
              <span
                className={style.signInChangeEmailSummary}
                onClick={handleChangeEmail}
              >
                {intl.formatMessage(messages.changeEmail)}
              </span>
            </div>
          )}
        </div>
        {(firstName || lastName) && (
          <div className={style.profileSummaryLabel}>
            {`${intl.formatMessage(messages.name)}: ${firstName || ""} ${lastName || ""
              }`}
          </div>
        )}
        {(document || documentType) && (
          <div className={style.profileSummaryLabel}>
            {`${intl.formatMessage(messages.document)}: ${documentType ?? ""} ${document ?? ""
              }`}
          </div>
        )}
        {phone && (
          <div className={style.profileSummaryLabel}>{`${intl.formatMessage(
            messages.phone,
          )}: ${phone}`}</div>
        )}
        {!phone && profileHasDirtyData && (
          <div className={style.profileSummaryLabel + " c-red-warning"}>{`${intl.formatMessage(
            messages.phone,
          )}: `}</div>
        )}
        {(!firstName || !lastName) && profileHasDirtyData && (
          <div className={style.profileSummaryLabel}>
            {`${intl.formatMessage(messages.name)}: 
              }`}
          </div>
        )}
        {/* {clientPreferencesData.optinNewsLetter && (
          <div className="flex flex-column flex-row-ns mt4">
            <span className="inlineBlock">
              <IconCheck /> {intl.formatMessage(messages.subscribed)}
            </span>
          </div>
        )} */}
      </div>
      {profileHasDirtyData && (
        <div className={style.dirtyProfileContainer}>
          <div className={style.dirtyProfileMessageTitleWrap}>
            <IconInfo />
            <div className={style.dirtyProfileMessageTitle + " c-red-warning t-mini c-action-primary"}> {intl.formatMessage(messages.dirtyProfileTitle)}</div>
          </div>
          <div className={style.dirtyProfileMessageInfo}>

            <div className={style.dirtyProfileMessageInfoContainer}>
              <div className={style.dirtyProfileMessageInfoWrap}>
                <span className={style.dirtyProfileMessageInfoItem + " t-mini"}> {intl.formatMessage(messages.dirtyProfileInfo2) + " "}</span>
                <br />
                <span className={style.dirtyProfileMessageInfoItem + " t-mini"}> {intl.formatMessage(messages.please) + " "}</span>
                {SummaryLogin}
                <span className={style.dirtyProfileMessageInfoItem + " t-mini"}>{" " + intl.formatMessage(messages.dirtyProfileInfo1)}</span>

              </div>
              <div className={style.dirtyProfileMessageInfoSignIn + " bg-action-primary"}>
                {SummaryLogin}
              </div>
            </div>

            <div className={[style.dirtyProfileMessageInfoWrap, style.dirtyProfileMessageInfoWrapBottom].join(" ")}>
              <span className={style.dirtyProfileMessageInfoItem + " t-mini"}>{intl.formatMessage(messages.dirtyProfileInfo3)}</span>
              <span
                className={[style.signInChangeEmailSummary, style.signInChangeEmailSummaryDirty].join(" ")}
                onClick={handleChangeEmail}
              >
                {intl.formatMessage(messages.clickHere)}
              </span>
              <span className={style.dirtyProfileMessageInfoItem + " t-mini"}>{intl.formatMessage(messages.dirtyProfileInfo4)}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileSummary
