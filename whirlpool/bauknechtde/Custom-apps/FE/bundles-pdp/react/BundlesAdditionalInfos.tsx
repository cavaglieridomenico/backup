import React from 'react'
import BundlesProductCards from "./components/BundlesProductCards"
import { BundlesContextProvider } from "./hooks/context"

const BundlesAdditionalInfos: StorefrontFunctionComponent = ({children}) => {

  return (
    <div>
        <BundlesContextProvider>
          <BundlesProductCards />
          {children}
        </BundlesContextProvider>
    </div>
  )
}

export default BundlesAdditionalInfos

BundlesAdditionalInfos.schema = {
  title: "[BUNDLES] - Additional Infos Wrapper",
  description: "Change the texts in the additional infos container"
}