import React, { FC } from 'react'
import { Link } from 'vtex.my-account-commons/Router'
import style from "./ffstyles.css"
import { arrowBackSvg } from './vectors/vectors'

interface GoToProfileLinkProps {
  label: string
}
const GoToProfileLink: FC<GoToProfileLinkProps> = ({ label }) => {
  const arrowIcon = Buffer.from(arrowBackSvg).toString("base64");

  return (
    <Link
      to="/profile"
      className={style.gobackContainer}
    >
      <img className={style.gobackIcon} src={`data:image/svg+xml;base64,${arrowIcon}`} alt="Arrow Back Icon" />
      <span className={style.goBackLinkInvoice}>{label}</span>
    </Link>
  )
}

export default GoToProfileLink
