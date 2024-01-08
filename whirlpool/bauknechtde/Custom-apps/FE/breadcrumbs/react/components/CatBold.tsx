import React from "react";
import style from "../style.css";

interface catBoldInterface {
    labelLink: string
}
const CatBold: StorefrontFunctionComponent<catBoldInterface> = ({
    labelLink
}) => {
    return (
        <a className={style.catBold}>
            {labelLink}
        </a>
    )
}
export default CatBold
