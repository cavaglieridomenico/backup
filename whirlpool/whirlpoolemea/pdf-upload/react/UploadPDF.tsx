import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, PageHeader } from 'vtex.styleguide'

import FormUpload from './components/Form/Form'
import './styles.global.css'

const AdminExample = () => {
  return (
    <Layout
      pageHeader={<PageHeader title={<FormattedMessage id="admin.title" />} />}
    >
      <PageBlock variation="full">
        <FormUpload />
      </PageBlock>
    </Layout>
  )
}

export default AdminExample
