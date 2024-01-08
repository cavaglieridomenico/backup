import React from 'react'
import { Helmet, useRuntime } from 'vtex.render-runtime'
import { whirlpoolPlp as itwhirlpool } from './data/itwhirlpool.json'
import { whirlpoolPlp as frwhilpool } from './data/frwhirlpool.json'
import { whirlpoolPlp as plwhirlpool } from './data/plwhirlpool.json'
import { whirlpoolPlp as bauknechtde } from './data/bauknechtde.json'
import { whirlpoolPlp as indesitit } from './data/indesitit.json'
import { whirlpoolPlp as indesituk } from './data/indesituk.json'
import { whirlpoolPlp as indesitpl } from './data/indesitpl.json'
import { whirlpoolPlp as indesitfr } from './data/indesitfr.json'
import { whirlpoolPlp as hotpointit } from './data/hotpointit.json'
import { whirlpoolPlp as hotpointuk } from './data/hotpointuk.json'

const hrefLangPlp = () => {
    const rt = useRuntime();
    const marketName = rt.account;
    const currentRoute = rt.route?.canonicalPath;
    const isItPLP = rt.page?.includes('store.search');
    const language = rt.culture.locale;

    let hrefLangPlp = null;
    
    switch (marketName) {
        case 'itwhirlpool':
            hrefLangPlp = itwhirlpool;
            break;
        case 'frwhirlpool':
            hrefLangPlp = frwhilpool;
            break;
        case 'plwhirlpool':
            hrefLangPlp = plwhirlpool;
            break;
        case 'bauknechtde':
            hrefLangPlp = bauknechtde;
            break;
        case 'hotpointit':
            hrefLangPlp = hotpointit;
            break;
        case 'hotpointuk':
            hrefLangPlp = hotpointuk;
            break;
        case 'indesitfr':
            hrefLangPlp = indesitfr;
            break;
        case 'indesitit':
            hrefLangPlp = indesitit;
            break;
        case 'indesitpl':
            hrefLangPlp = indesitpl;
            break;
        case 'indesituk':
            hrefLangPlp = indesituk;
            break;
        default:
            break;
    }

    const getCurrentPathKey = (plpArray, noDomainPath, lang) => {
        let filteredArray = plpArray?.filter((y) => y?.code === lang)
        if (filteredArray?.length === 1) {
            let innerPlpObject = filteredArray[0]?.plpList
            let objectKeys = Object.keys(innerPlpObject)?.map((x) => { if (x !== undefined && innerPlpObject[x] && innerPlpObject[x] === noDomainPath) { return x } })
            let cleanCurrentCategory = objectKeys?.filter((y) => y !== undefined)?.toString()
            if (cleanCurrentCategory) return cleanCurrentCategory
        }
        
        return null
    }

    if (isItPLP && hrefLangPlp) {
        const cKey = getCurrentPathKey(hrefLangPlp, currentRoute, language);

        if (cKey) {
            return (
                <Helmet>
                {
                    Object.entries(hrefLangPlp).map(([key, value]) => {
                        if (value?.domain && value?.code && value?.plpList[cKey]) {
                            let builtUrl = value?.domain + value?.plpList[cKey]
                            return <link rel='alternate' id={key} hrefLang={value.code} href={builtUrl} key={key} />
                        }
                    })
                }
                </Helmet>
            )
        }
    }

    return null
}

export default hrefLangPlp;
