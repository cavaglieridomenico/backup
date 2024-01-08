//@ts-nocheck
import React, { useEffect, useState } from 'react'
import styles from './styles.css'
import { usePixel } from "vtex.pixel-manager";



const Models: StorefrontFunctionComponent<DropdownProps> = ({

}) => {
  const { push } = usePixel();
  var items = {
    "Laundry": {
      "Washing Machine": {
        "wmfug942guk": "/spare-parts/bom/wmfug942guk-30862540102",
        "NSWM743UWUK": "/spare-parts/bom/nswm743uwukn-769991637831",
        "WMFUG742GUK": "/spare-parts/bom/wmfug742guk-769990862498",
        "WMXTF942PUKR": "/spare-parts/bom/wmxtf942pukr-61021300097",
        "WMFUG942PUK": "/spare-parts/bom/wmfug942puk-30862530102",
        "WMXTF742KUK": "/spare-parts/bom/wmxtf742kuk-30855100098",
        "WMFUG842GUK": "/spare-parts/bom/wmfug842guk-769990899593",
        "WMFUG1063PUK": "/spare-parts/bom/wmfug1063puk-769990862554",
        "AQ113F497EUK": "/spare-parts/bom/aq113f497euk-80749130397"
      },
      "Washer Dryer": {
        "WDAL8640guk": "/spare-parts/bom/wdal8640guk-769991016144",
        "BHWD129UK": "/spare-parts/bom/bhwd129uk1-80717780100",
        "BIWDHG75148UKN": "/spare-parts/bom/biwdhg75148ukn-769991609850",
        "RD966JUK": "/spare-parts/bom/rd966juk-769991002546",
        "WDPG8640XUK": "/spare-parts/bom/wdpg8640xuk-80785840000",
        "RD964JDUKN": "/spare-parts/bom/rd964jdukn-769991609982",
        "AQD1170F697E": "/spare-parts/bom/aqd1170f697e-80785560000",
        "RDGR9662GKUKN": "/spare-parts/bom/rdgr9662gkukn-769991613691",
        "WDL520GUK": "/spare-parts/bom/wdl520gukc-80646470000"
      },
      "Tumble Dryer": {
        "TDWSF83BEPUK": "/spare-parts/bom/tdwsf83bepuk-859991002020",
        "TVFM70BGPUK": "/spare-parts/bom/tvfm70bgpuk-95860070100",
        "TDWSF83EPZUK": "/spare-parts/bom/tdwsf83epzuk-859991008660",
        "TCFS93BGP": "/spare-parts/bom/tcfs93bgpuk-95859699700",
        "TDL31P": "/spare-parts/bom/tdl31p-aq323780000",
        "TVHM80CPUK": "/spare-parts/bom/tvhm80cpuk-95860499700",
        "SUTCD97B6GMU": "/spare-parts/bom/sutcd97b6gmuk-95868105500",
        "TVM570P": "/spare-parts/bom/tvm570p-95686960000",
        "TCF97B6H1L": "/spare-parts/bom/tcf97b6h1il-95876740100"
      }
    },
    "Dishwashing": {
      "Dishwasher": {
        "LTB4B019UK": "/spare-parts/bom/ltb4b019uk-36829101700",
        "LFT116AEX": "/spare-parts/bom/lft116aex-37490360100",
        "LST216AUK": "/spare-parts/bom/lst216auk-36631581000",
        "LFD11S123OXAUS": "/spare-parts/bom/lfd11s123oxaus-36873371300",
        "FF7190EP": "/spare-parts/bom/ff7190ep-81542720300",
        "LTF8B019UK": "/spare-parts/bom/ltf8b019uk-769990829145",
        "SDL510P": "/spare-parts/bom/sdl510p-36685961000",
        "LFT228AAG": "/spare-parts/bom/lft228aag-37490470000",
        "SDL510g": "/spare-parts/bom/sdl510g-36685981000"
      }
    },
    "Refrigeration": {
      "Fridge Freezer": {
        "RFA52S": "/spare-parts/bom/rfa52s-81427860101",
        "RFAA52S": "/spare-parts/bom/rfaa52s-81779970101",
        "RFAA52P": "/spare-parts/bom/rfaa52p-81779960100",
        "RFA52P": "/spare-parts/bom/rfa52p-81402100001",
        "HM315NI": "/spare-parts/bom/hm315ni-81402080100",
        "FFA52P": "/spare-parts/bom/ffa52p-81537390000",
        "HMB312AAI": "/spare-parts/bom/hmb312aai-47396640102",
        "FFU4DK": "/spare-parts/bom/ffu4dk-81780120201",
        "FFU4DX": "/spare-parts/bom/ffu4dx1-769991621871"
      },
      "Fridge": {
        "RLAV21P": "/spare-parts/bom/rlav21p-81348620200",
        "HUL162I": "/spare-parts/bom/hul162i-47431340101",
        "HS3022VL": "/spare-parts/bom/hs3022vl2-859991017000",
        "RLFM171G": "/spare-parts/bom/rlfm171g-81778010101",
        "NCD191I": "/spare-parts/bom/ncd191i-aq543470000",
        "RLA36P": "/spare-parts/bom/rla36p1-769991621901",
        "HS1801AA": "/spare-parts/bom/hs1801aauk-759991009200",
        "RSAV21W": "/spare-parts/bom/rsav21w-81348630200",
        "RLA56P": "/spare-parts/bom/rla50p-76315100000"
      },
      "Freezer": {
        "RZAV21P": "/spare-parts/bom/rzav21p-81362040101",
        "RZA36P1": "/spare-parts/bom/rza36p1-81837509087",
        "RZAAV22K": "/spare-parts/bom/rzaav22k1-aq864510000",
        "RZAAV21P": "/spare-parts/bom/rzaav21p-81783000100",
        "H55ZM1110KUK": "/spare-parts/bom/h55zm1110kuk-f157589",
        "RZAV21T": "/spare-parts/bom/rzav21t-81362030000",
        "H55VM1110WUK": "/spare-parts/bom/h55vm1110wuk-f158025",
        "HS1677CNE": "/spare-parts/bom/hs1677cne-769991579773",
        "U12A1DUKH": "/spare-parts/bom/u12a1dukh1-f155390"
      }
    },
    "Cooking": {
      "Cooker": {
        "HAE60KS": "/spare-parts/bom/hae60ks-769991557531",
        "HUG61X": "/spare-parts/bom/hug61x-25624160210",
        "HUG61K": "/spare-parts/bom/hug61k-25624130210",
        "HDM67G0CMBL": "/spare-parts/bom/hdm67g0cmblpg-769991651731",
        "HUG61P": "/spare-parts/bom/hug61p-25624120110",
        "DSG60K": "/spare-parts/bom/dsg60k-25931870000",
        "HUG52x": "/spare-parts/bom/hug52x-25630401310",
        "HUG52P": "/spare-parts/bom/hug52p-25630411210",
        "HUG61G": "/spare-parts/bom/hug61g-25624140410"
      },
      "Oven": {
        "SA2540HIX": "/spare-parts/bom/sa2540hix-859991001490",
        "SI4854PIX": "/spare-parts/bom/si4854pix-759990968000",
        "SA2544CIX": "/spare-parts/bom/sa2544cix-859991001520",
        "SA2844HIX": "/spare-parts/bom/sa2844hix-759991001460",
        "DD2540IX": "/spare-parts/bom/dd2540ix-769991022952",
        "SHS33XS": "/spare-parts/bom/shs33xs-03808040000",
        "SA2540HBL": "/spare-parts/bom/sa2540hbl-759991001500",
        "UHS53XS": "/spare-parts/bom/uhs53xs-25805380000",
        "DHS53X": "/spare-parts/bom/dhs53x-25686020000"
      },
      "Hood": {
        "HS70X": "/spare-parts/bom/hs70x-aq325810000",
        "PHPN95FLMX": "/spare-parts/bom/phpn95flmx1-869991652190",
        "HS110": "/spare-parts/bom/hs110-aq528710000",
        "PHVP64FALK": "/spare-parts/bom/phvp64falk-61002110000",
        "PHVP66FLMK": "/spare-parts/bom/phvp66flmk-61002100000",
        "PHVP87FLTK": "/spare-parts/bom/phvp87fltk-61002050000",
        "HL60X": "/spare-parts/bom/hl60x-aq325910000",
        "HGS72SBK": "/spare-parts/bom/hgs72sbk-769991634351",
        "PHFG65FABX": "/spare-parts/bom/phfg65fabx-aq949830000",
        "HL70X": "/spare-parts/bom/hl70x-aq325840000"
      },
      "Hob": {
        "ACP778CBA": "/spare-parts/bom/acp778cba-769991558102",
        "HGS72SBK": "/spare-parts/bom/hgs72sbk-769991634351",
        "TB7960CBF": "/spare-parts/bom/tb7960cbf-769991574853",
        "HGS61SBK": "/spare-parts/bom/hgs61sbk-769991634341",
        "TQ1460SNE": "/spare-parts/bom/tq1460sne-769991589532",
        "TB3977BBF": "/spare-parts/bom/tb3977bbf-769991592152",
        "TS5760FNE": "/spare-parts/bom/ts5760fne-769991580622",
        "ACO654NE": "/spare-parts/bom/aco654ne-769991558081",
        "HR612CH": "/spare-parts/bom/hr612ch-769991043022"
      },
      "Microwave": {
        "HCM60X": "/spare-parts/bom/hcm60-aq296420000",
        "MN314IXH": "/spare-parts/bom/mn314ixh-aq966890000",
        "MD554IXH": "/spare-parts/bom/md554ixh-759990966850",
        "MCH103Q": "/spare-parts/bom/mch103q-aq843610000",
        "MCX103X": "/spare-parts/bom/mcx103xs-aq802970000",
        "MCH10": "/spare-parts/bom/mch10-aq349040000",
        "MCX103XS": "/spare-parts/bom/mcx103xs-aq802970000",
        "MP676IXH": "/spare-parts/bom/mp676ixh-759990966840",
        "MF20GIXH": "/spare-parts/bom/mf20gixh-869991591620"
      }

    },
    "Small Appliances": {
      "Coffee machine": {
        "CMHPCGB0UK": "/spare-parts/bom/cmhpcgb0uk-aq822110000",
        "HCM15": "/spare-parts/bom/hcm15-45398050000"
      }
    }
  }

  const handleClickAnalytics = (e: any, path: any, fg: any) => {
    e.preventDefault();
    push({
      'event': 'modelClickUkSpare',
      'eventCategory': 'Model Click',
      'eventAction': fg
    });
    setTimeout(() => { location.href = /* "/spare-parts" + */ path.toLowerCase().replace(" ", "-") }, 500)
  }


  const handelShowAllLink = (e: any, path: any) => {
    e.preventDefault();
    push({
      'event': 'modelClickUkSpare',
      'eventCategory': 'Model Click',
      'eventAction': `Show all ${path} Spare Parts`
    });
    setTimeout(() => { location.href = "/spare-parts/" + path.toLowerCase().replace(" ", "-") }, 500)
  }


  return (
    <div className={styles.models}>
      {Object.keys(items).map((firstLvlCat) => {
        return <div className={styles.models_first_cat_wrap}>
          <a className={styles.showMore} onClick={() => { handelShowAllLink(event, firstLvlCat) }} href={"/spare-parts/" + firstLvlCat.toLowerCase().replace(" ", "-")} >Show all {firstLvlCat} Spare Parts</a>
          <h2 className={styles.firstLvlCatTitle}>{firstLvlCat}</h2>
          <div className={styles.models_first_cat_wrap_items}>
            {Object.keys(items[firstLvlCat]).map((secondLvlCat) => {
              return <div className={styles.models_second_cat_wrap}>
                <h3>{secondLvlCat}</h3>
                <div className={styles.models_second_cat_wrap_items}>
                  {Object.keys(items[firstLvlCat][secondLvlCat]).map((fg) => {
                    return <a onClick={() => handleClickAnalytics(event, items[firstLvlCat][secondLvlCat][fg], fg)} href={items[firstLvlCat][secondLvlCat][fg]} className={styles.models_fg_link}>{fg}</a>
                  })}
                  <a className={styles.seeAll} onClick={() => { window.location = "/spare-parts/" + firstLvlCat.toLowerCase().replace(" ", "-") + "/" + secondLvlCat.toLowerCase().replace(" ", "-") }}>See all</a>
                </div>

              </div>
            })}
          </div>

        </div>

      })}
    </div>
  )
}
Models.schema = {

};
export default Models
