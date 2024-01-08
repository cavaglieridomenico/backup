import React from 'react'
import style from '../styles.css'
// import { reasons } from '../utils/reasons'
import { FormattedMessage } from 'react-intl'

interface ReasonSectionProps {
  handleChangeSelect: any
  errors: any,
  resetInput: any
  reasons:[]
}

const ReasonSection: StorefrontFunctionComponent<ReasonSectionProps> = ({
  handleChangeSelect,
  errors,
  resetInput,
  reasons
}) => {

  return (
    <div className={style.selectDiv}>
      <select
        name="Reason"
        className={style.select}
        onChange={handleChangeSelect}
        onFocus={() => resetInput("Reason")}
      >
        <FormattedMessage id="store/contact-us-form.enableOption" >
          {(message) => <option disabled selected> {message}</option>}
        </FormattedMessage>
      
        {reasons.map((reason: any) => (
            <option
              key={reason.id}
              id={reason.id}
              value={reason.label}
              className={style.option}
            >
              {reason.label}
            </option>
        ))}
      </select>
      {errors.Reason && (
        <p className={style.errorLabel}>{errors.Reason}</p>
      )}
    </div>
  )
}

ReasonSection.schema = {
  title: 'editor.customForm.title',
  description: 'editor.customForm.description',
  type: 'object',
  properties: {},
}

export default ReasonSection
