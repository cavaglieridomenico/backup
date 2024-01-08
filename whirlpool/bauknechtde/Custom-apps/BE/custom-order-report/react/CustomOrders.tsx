import React, { FC, FormEventHandler, useReducer, useState } from 'react'

import {
  Layout,
  PageBlock,
  DatePicker,
  Checkbox,
  Button,
} from 'vtex.styleguide'
import style from './style.css'
import moment from 'moment'

const initialForm = {
  startDate: new Date(),
  endDate: new Date(),
  complete: false,
}
const reducer = (
  state: typeof initialForm,
  target: { name: string; value: boolean | Date }
) => ({
  ...state,
  [target?.name]: target?.value,
})

const baseUrl = `/_v/orders/orders-by-time-range`

const CustomOrders: FC = () => {
  const [form, dispatch] = useReducer(reducer, initialForm)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    setSuccess(false)
    setError(false)
    e.preventDefault()
    const startDateFormat = moment(form.startDate).format('YYYY-MM-DD')
    const endDateFormat = moment(form.endDate).format('YYYY-MM-DD')
    const res = await fetch(
      `${baseUrl}?from=${startDateFormat}&to=${endDateFormat}&isIncomplete=${form.complete}`
    )
    setSuccess(res.ok)
    setError(!res.ok)
  }
  return (
    <Layout>
      <PageBlock
        variation="full"
        title="Download orders report"
        subtitle="Download excel file for reports"
      >
        <form onSubmit={onSubmit} className={style.form}>
          <h3>Filter by date:</h3>

          <label htmlFor="startDate">Start Date</label>
          <DatePicker
            locale="en-US"
            name="startDate"
            value={form.startDate}
            onChange={(value: Date) => dispatch({ name: 'startDate', value })}
          />

          <label htmlFor="endDate">End date</label>
          <DatePicker
            locale="en-US"
            name="endDate"
            value={form.endDate}
            onChange={(value: Date) => dispatch({ name: 'endDate', value })}
          />
          <h3>Filter by status:</h3>
          <label htmlFor="complete">Incomplete</label>
          <Checkbox
            checked={form.complete}
            onChange={(e: { target: { name: string; checked: boolean } }) =>
              dispatch({ name: 'complete', value: e.target.checked })
            }
            value={Boolean(form.complete)}
            name="complete"
          />
          <Button type="submit">Download</Button>
        </form>
        {success && (
          <span>We are generating the report, you will receive it shortly on your email</span>
        )}
        {error && <span>Something went wrong, try again</span>}
      </PageBlock>
    </Layout>
  )
}

export default CustomOrders
