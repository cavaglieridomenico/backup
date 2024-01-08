import React from 'react'
import { useCssHandles } from 'vtex.css-handles'
import PhoneIcon from "./Icons/PhoneIcon"

interface Phone {}

const Phone: StorefrontFunctionComponent<Phone> = ({}) => {

    const CSS_HANDLES = ["phoneMainDiv","phoneCall", "phoneCallA","telemarketingIcon"]
    const handles = useCssHandles(CSS_HANDLES)

  return (<div className={`${handles.phoneMainDiv}`} style={{display:"flex"}}>
            <PhoneIcon className={`${handles.telemarketingIcon}`}/>
            <a className={`${handles.phoneCallA}`} href="tel:+0848801005">+0848 801 005 |</a>
        </div> )

    
}

export default Phone