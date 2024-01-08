import React from 'react'
import style from '../styles.css'
import { reasons } from '../utils/reasons'


interface ReasonSectionProps {
  handleChangeSelect: any
  errors: any,
  resetInput: any
}

const ReasonSection: StorefrontFunctionComponent<ReasonSectionProps> = ({
  handleChangeSelect,
  errors,
  resetInput
}) => {

  return (
        <div className={style.selectDiv}>
            <select
            name="Reason"
            className={style.select}
            onChange={handleChangeSelect}
            onFocus={() => resetInput("Reason")}
            >
            {reasons.map((reason: any) => (
                <option
                key={reason.id}
                id={reason.id}
                value={reason.value}
                className={style.option}
                disabled={reason.label == "Choisissez un sujet"}
                selected={reason.label == "Choisissez un sujet"}
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
