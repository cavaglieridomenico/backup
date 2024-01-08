import React, { FC } from 'react'
import { Link } from 'vtex.my-account-commons/Router'
import style from "./ffstyles.css"
import { arrowBackSvg } from './vectors/vectors'
import { MyAccountContextProvider, useMyAccount } from './providers/myAccountContext'

interface GoToProfileLinkProps {
  label: string
  customBackLink: string
}

const GoToProfileLinkButton: FC<GoToProfileLinkProps> = ({ label, customBackLink }) => {
  const {profileSectionUrl} = useMyAccount()
  const arrowIcon = Buffer.from(arrowBackSvg).toString("base64");
  
  return (
    <Link
      to={customBackLink ? customBackLink : profileSectionUrl}
      className={`${style.gobackContainer} c-action-primary`}
    >
      <img className={style.gobackIcon} src={`data:image/svg+xml;base64,${arrowIcon}`} alt="Arrow Back Icon" />
      <span className={`${style.goBackLinkInvoice} c-action-primary`}>{label}</span>
    </Link>
  )
}


const GoToProfileLink: React.FC<GoToProfileLinkProps> = ({ label, customBackLink }) => {
  return(
    <MyAccountContextProvider>
        <GoToProfileLinkButton label={label} customBackLink={customBackLink}/>
    </MyAccountContextProvider>
  )
}

export default GoToProfileLink
