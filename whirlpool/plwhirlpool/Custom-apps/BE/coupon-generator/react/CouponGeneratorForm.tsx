import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader } from 'vtex.styleguide'
import CouponForm from './Form'

import './styles.global.css'

const CouponGeneratorForm: FC = () => {
  return (
    <Layout
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="coupon-generator.title" />}
        />
      }
    >
      <PageBlock variation="full">
       <CouponForm/>
      </PageBlock>
    </Layout>
  )
}

export default CouponGeneratorForm
