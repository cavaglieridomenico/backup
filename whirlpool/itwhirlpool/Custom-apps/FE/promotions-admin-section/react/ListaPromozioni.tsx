import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader } from 'vtex.styleguide'

import './styles.global.css'
import PromotionsTable from './PromotionsComponents/PromotionsTable'
import PromotionWrapper from './PromotionsComponents/PromotionContext'
import PromotionFIlter from './PromotionsComponents/PromotionFilter'

const ListaPromozioni: FC = () => {
  return (
    <Layout
      pageHeader={
        <PageHeader
          title={<FormattedMessage id="admin-example.hello-world" />}
        />
      }
    >
      <PageBlock variation="full">
        <PromotionWrapper>
          <PromotionFIlter />
          <PromotionsTable/>
        </PromotionWrapper>
      </PageBlock>
    </Layout>
  )
}

export default ListaPromozioni
