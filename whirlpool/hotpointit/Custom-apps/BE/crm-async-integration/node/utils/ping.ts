import { env } from 'process'

import axios from 'axios'

export async function getPing() {
  const workspace = env.VTEX_WORKSPACE ? `${env.VTEX_WORKSPACE}--` : ''

  await axios.get(
    `http://${workspace}${env.VTEX_ACCOUNT}.${env.VTEX_PUBLIC_ENDPOINT}/app/crm-async-integration/vtex/ping`
  )
}
