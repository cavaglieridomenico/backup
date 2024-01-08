import React, { useState } from 'react'
import styles from './styles.css'

interface DropdownProps {
  label: string,
  children: any,
  blockClass?: string
}

const Dropdown: StorefrontFunctionComponent<DropdownProps> = ({
  children,
  label = "SHOP APPLIANCES",
  blockClass
}) => {


  const [show, setShow] = useState(false)

  return (
    <div className={blockClass ? `${styles.dropdown}--${blockClass}` : styles.dropdown}>
      <div className={blockClass ? `${styles.trigger}--${blockClass}${show ? '--open' : ''}` : styles.trigger} onClick={() => {
        setShow(!show)
      }}>
      {label}
      </div>

        <div className={blockClass ? `${styles.content}--${blockClass}` : styles.content} style={{display: show ? "block" : "none"}}>
           {children}
        </div>
  
    </div>
  )
}
Dropdown.schema = {
  title: "Dropdown",
  description: "A custom drop down",
  type: "object",
  properties: {
    label: {
      title: "Dropdown label",
      description: "Dropdown label",
      default: undefined,
      type: "string",
    }

  },
};
export default Dropdown
