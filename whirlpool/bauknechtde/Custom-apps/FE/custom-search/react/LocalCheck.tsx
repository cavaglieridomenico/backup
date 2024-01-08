import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import localCheck from './graphql/localCheck.graphql'
import { useProduct } from "vtex.product-context";


import styles from './styles.css'



interface checkResult {
    valid: boolean
}

interface LocalCheck {
    localCheckSuccessMessage: string,
    localCheckNotFoundMessage: string,
    localCheckSuccessIcon: string,
    localCheckNotFoundIcon: string,
    localCheckRedirectLabel: string,
    localCheckPropValue: string,
    localCheckTerm: string
    redirectUrl: string
}
const LocalCheck: StorefrontFunctionComponent<LocalCheck> = ({
    localCheckSuccessMessage,
    localCheckNotFoundMessage,
    localCheckSuccessIcon,
    localCheckNotFoundIcon,
    localCheckRedirectLabel,
    localCheckPropValue,
    localCheckTerm,
    redirectUrl
}) => {

    const [localCheckResult, setlocalCheckResult] = useState<checkResult | undefined>(undefined)
    const product = useProduct().product;
    let variables:any = {
        industrialCode: localCheckTerm.toString(),
        sparePartId: product[localCheckPropValue].toString()
    }


    const  { data } = useQuery(localCheck, {
        variables,
        fetchPolicy: "no-cache"
    });

    useEffect(() => {
        if(data){
            setlocalCheckResult({valid:data["doesItFit"].outcome === "found"})
        }
    }, [data])
    return (
        <>
            {localCheckResult && (
                <div className={styles.custom_search_local_check}>
                    <div className={styles.custom_search_local_check_wrap}>
                        <img className={styles.custom_search_local_check_icon} src={localCheckResult.valid ? localCheckSuccessIcon : localCheckNotFoundIcon} />
                        {localCheckResult.valid ? localCheckSuccessMessage : localCheckNotFoundMessage}
                    </div>
                    {localCheckRedirectLabel && (
                        <div className={styles.custom_search_local_check_label}><p>{localCheckRedirectLabel} </p><a href={redirectUrl}>{localCheckTerm}</a></div>

                    )}

                </div>
            )}
        </>

    )
}

export default LocalCheck
