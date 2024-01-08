import React, { useState, useEffect } from 'react';
/* style */
import style from './style.css';

import { useCssHandles } from 'vtex.css-handles'

import { useRuntime } from "vtex.render-runtime";
/* typings */
import { StateComponent } from "./typings/global"
/* graphql */
import { useQuery } from 'react-apollo'
import getVipLogo from './graphql/getVipLogo.graphql'

interface PrintVipLogosProps {
  children: any
}

const CSS_HANDLES = ['containerImage', 'vipImage'] as const

const PrintVipLogos: StorefrontFunctionComponent<PrintVipLogosProps> = ({ children }) => {

  const { handles } = useCssHandles(CSS_HANDLES)

  /* component State */
  const [state, setState] = useState<StateComponent>({
    isVip: false,
    accessCode: ""
  })

  /* call graphql */
  const { data } = useQuery(getVipLogo, {
    variables: {
      accessCode: state.accessCode
    },
    onCompleted: () => {
      checkIfVip()
    }
  })


  const {
    /*  production,
     culture, */
    binding/* ,
    route: runtimeRoute,
    query, */
  } = useRuntime();


  /* component did mount */
  useEffect(() => {
    getAccessCode()
  }, [])

  const checkIfVip = () => {
    if (binding.canonicalBaseAddress.includes("vip")) {
      setState({
        ...state,
        isVip: true
      })
    }
  }
  const getAccessCode = () => {
    if (typeof window !== "undefined") {
      let code = window?.sessionStorage?.getItem("sid")
      if (code) {
        setState({
          ...state,
          accessCode: code
        })
      }
    }
  }

  return (
    <>
      {state.isVip && data ?
        <div className={style.containerImage}>
          {
            data &&
            <img className={style.vipImage} src={data.GetVipLogo} />
          }
        </div>
        :
        <>
          {children}
        </>
      }
    </>
  )

}

PrintVipLogos.schema = {
  title: 'editor.PrintVipLogos.title',
  description: 'editor.PrintVipLogos.description',
  type: 'object',
  properties: {
  },
}

export default PrintVipLogos
