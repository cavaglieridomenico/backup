//@ts-nocheck
import React, { useState, useEffect } from 'react'
import Koelen from './Icons/Koelen'
import Koken from './Icons/Koken'
import Vaatwassen from './Icons/Vaatwassen'
import Wassen from './Icons/Wassen'
import { useCssHandles } from 'vtex.css-handles'
import styles from "./styles.css";
import Wasdroog from './Icons/Wasdroog'
import Fornuzien from './Icons/Fornuzien'
import Kookplaten from './Icons/Kookplaten'
import Leftarrow from './Icons/Leftarrow'
import Afzuigkappen from './Icons/Afzuigkappen'
import Magnetrons from './Icons/Magnetrons'
import Koelkasten from './Icons/Koelkasten'
import Tilt from 'react-parallax-tilt';
import {
        FormattedMessage,
        MessageDescriptor,
        useIntl,
        defineMessages
} from 'react-intl'
import { StringifyOptions } from 'node:querystring'

interface Categories { }
interface clickedCategory {
        clickedWassen: boolean;
        clickedVaatwassen: boolean;
        clickedKoelen: boolean;
        clickedKoken: boolean;
        washingmachines: string;
        washdryer: string;
        dryer: string;
        dishwashers: string;
        refrigerators: string;
        refrigeratorswithfreezer: string;
        freezers: string;
        cookers: string;
        hob: string;
        hoods: string;
        microwaves: string;
        brand: string;
        bindingAddress: string;
        locale: string;
}

const messages = defineMessages({
        languageDetect: { id: 'store/countdown.detectLanguage' }
})
const Categories: StorefrontFunctionComponent<Categories> = ({ }) => {


        const [clicked, setClicked] = useState<clickedCategory>(
                {
                        clickedWassen: false, clickedVaatwassen: false,
                        clickedKoelen: false, clickedKoken: false,
                        washingmachines: "/spare-parts/laundry/washing-machine",
                        washdryer: "/Ersatzteile/Waschen/Waschtrockner",
                        dryer: "/Ersatzteile/Waschen/Trockner",
                        dishwashers: "/Ersatzteile/Geschirrspuler/Geschirrspulmaschinen",
                        refrigerators: "/Ersatzteile/Kalt/Kuhlschranke",
                        refrigeratorswithfreezer: "/Ersatzteile/Kalt/Gefrierschranke",
                        freezers: "/Ersatzteile/Kalt/Kombinierte-Gerate",
                        cookers: "/Ersatzteile/Kochen/Herde",
                        hob: "/Ersatzteile/Kochen/Kochfelder",
                        hoods: "/Ersatzteile/Kochen/Hauben",
                        microwaves: "/Ersatzteile/Kochen/Mikrowellen",
                        brand: "",
                        bindingAddress: ""
                })

        const [locale, setLocale] = useState("de-CH");
        const CSS_HANDLES = ["categoriesMainDiv", "categorienDiv", "iconsMainDiv", "iconsDivBefore", "iconsDiv", "iconsInnerDiv",
                "categoriesLabel", "categoriesIcons", "categoriesArrow", "leftArrowDiv", "leftArrowDivMobile",
                "categoriesArrowMobile", "iconsMainDivLast", "iconsInnerDivBauk"]
        const handles = useCssHandles(CSS_HANDLES)
        const intl = useIntl()
        const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message)


        useEffect(() => {

                let search = window.location.search;
                let search2 = window.location.href;
                let isIndesit = (search.includes("indesit") || search2.includes("indesit"));
                let isWhirlpool = (search.includes("whirlpool") || search2.includes("whirlpool"));
                let isBauknecht = (search.includes("bauknecht") || search2.includes("bauknecht"));
                let params = new URLSearchParams(window.location.search);
                setClicked((prevState) => ({
                        ...prevState,
                        brand: (isIndesit ? "indesit" : isBauknecht ? "bauknecht" : isWhirlpool ? "whirlpool" : ""),
                        bindingAddress: `${(params.get("__bindingAddress"))}`
                }))
                if (translateMessage(messages.languageDetect) == "de") {
                        setClicked((prevState) => ({
                                ...prevState,
                                washingmachines: "/ersatzteile/waschen-und-trocknen/waschmaschinen",
                                washdryer: "/ersatzteile/waschen-und-trocknen/waschtrockner",
                                dryer: "/ersatzteile/waschen-und-trocknen/trockner",
                                dishwashers: "/Ersatzteile/Geschirrspuler/Geschirrspulmaschinen",
                                refrigerators: "/ersatzteile/kuhlen-und-gefrieren/kuhlschranke",
                                refrigeratorswithfreezer: "/Ersatzteile/Kalt/Gefrierschranke",
                                freezers: "/Ersatzteile/Kalt/Kombinierte-Gerate",
                                cookers: "/Ersatzteile/Kochen/Herde",
                                hob: "/Ersatzteile/Kochen/Kochfelder",
                                hoods: "/Ersatzteile/Kochen/Hauben",
                                microwaves: "/ersatzteile/kochen-und-backen/mikrowellen"
                        }))
                }
                else if (translateMessage(messages.languageDetect) == "it") {
                        setClicked((prevState) => ({
                                ...prevState,
                                washingmachines: "/ricambi/lavaggio-e-asciugatura/lavatrici",
                                washdryer: "/ricambi/lavaggio-e-asciugatura/lavasciuga",
                                dryer: "/ricambi/lavaggio-e-asciugatura/asciugatrici",
                                dishwashers: "/ricambi/lavastoviglie/lavastoviglie",
                                refrigerators: "/ricambi/refrigerazione-e-congelamento/frigoriferi",
                                refrigeratorswithfreezer: "/ricambi/refrigerazione-e-congelamento/congelatori",
                                freezers: "/ricambi/refrigerazione-e-congelamento/combinati",
                                cookers: "/ricambi/cottura/cucine",
                                hob: "/ricambi/cottura/piani-cottura",               //Update hobs after backend url translation changes, now it does not exist
                                hoods: "/ricambi/cottura/cappe",                 //Update hoods after backend url translation changes, now it does not exist
                                microwaves: "/ricambi/cottura/microonde"        //Update microwaves after backend url translation changes, now it does not exist
                        }))
                }
                else {
                        setClicked((prevState) => ({
                                ...prevState,
                                washingmachines: "/spare-parts/laundry/washing-machine",
                                washdryer: "/spare-parts/laundry/washer-dryer",
                                dryer: "/spare-parts/laundry/tumble-dryer",
                                dishwashers: "/spare-parts/dishwashing/dishwasher",
                                refrigerators: "/spare-parts/refrigeration/fridge",
                                refrigeratorswithfreezer: "/spare-parts/refrigeration/fridge-freezer",
                                freezers: "/spare-parts/refrigeration/freezer",
                                cookers: "/spare-parts/cooking/cooker",
                                hob: "/spare-parts/cooking/hob",                     //Update hobs after backend url translation changes, now it does not exist
                                hoods: "/spare-parts/cooking/hood",                   //Update hoods after backend url translation changes, now it does not exist
                                microwaves: "/spare-parts/cooking/microwave"          //Update microwaves after backend url translation changes, now it does not exist
                        }))
                }
                setLocale(__RUNTIME__.culture.locale)


        }, [])


        return <div className={` ${handles.categoriesMainDiv}`} >
                <div className={`${handles.categorienDiv}`} >
                        <FormattedMessage id="store/countdown.categories">
                                {message => <p className={styles.categoriesMainTitle}>or view parts by category</p> }
                        </FormattedMessage>
                </div>

                {!clicked.clickedWassen && !clicked.clickedVaatwassen && !clicked.clickedKoelen && !clicked.clickedKoken &&
                        (<div id="article" className={`${handles.iconsMainDiv}`} >
                                <div className={`${handles.iconsDivBefore}`} onClick={() => { setClicked((prevState) => ({ ...prevState, clickedWassen: true })) }} >
                                        <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                <div className={`${handles.iconsInnerDiv}`} >
                                                        <Wassen className={`${handles.categoriesIcons}`} />
                                                </div>
                                        </Tilt>
                                        <FormattedMessage id="store/countdown.wash">
                                                {message => <p className={`${handles.categoriesLabel}`}>Laundry</p>}
                                        </FormattedMessage>
                                </div>



                                <div className={`${handles.iconsDivBefore}`} onClick={() => { setClicked((prevState) => ({ ...prevState, clickedVaatwassen: true })) }}>
                                        <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                <div className={`${handles.iconsInnerDiv}`}>
                                                        <Vaatwassen className={`${handles.categoriesIcons}`} />
                                                </div>
                                        </Tilt>
                                        <FormattedMessage id="store/countdown.dishwashing">
                                                {message => <p className={`${handles.categoriesLabel}`}>Dishwashing</p>}
                                        </FormattedMessage>
                                </div>


                                <div className={`${handles.iconsDivBefore}`} onClick={() => { setClicked((prevState) => ({ ...prevState, clickedKoelen: true })) }}>
                                        <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                <div className={`${handles.iconsInnerDiv}`}>
                                                        <Koelen className={`${handles.categoriesIcons}`} />
                                                </div>
                                        </Tilt>
                                        <FormattedMessage id="store/countdown.refrigerate">
                                                {message => <p className={`${handles.categoriesLabel}`}>Refrigeration</p>}
                                        </FormattedMessage>
                                </div>


                                <div className={`${handles.iconsDivBefore}`} onClick={() => { setClicked((prevState) => ({ ...prevState, clickedKoken: true })) }}>
                                        <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                <div className={`${handles.iconsInnerDiv}`}>
                                                        <Koken className={`${handles.categoriesIcons}`} />
                                                </div>
                                        </Tilt>
                                        <FormattedMessage id="store/countdown.cook">
                                                {message => <p className={`${handles.categoriesLabel}`}>Cooking</p>}
                                        </FormattedMessage>
                                </div>



                        </div>)}

                {/* Wassen clicked */}

                {
                        clicked.clickedWassen && (

                                <div className={`${handles.iconsMainDiv}`} >

                                        <div className={`${handles.leftArrowDiv}`}>
                                                <Leftarrow className={`${handles.categoriesArrow}`} onClick={() => { setClicked((prevState) => ({ ...prevState, clickedWassen: false })) }} />
                                        </div>

                                        <div className={`${handles.iconsDiv}`} >
                                                <a style={{ display: "flex", flexFlow: "column", alignItems: "center", textDecoration: "none", color: "black" }} href={`${clicked.washingmachines}`}>
                                                        <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                                <div className={`${handles.iconsInnerDiv}`} >
                                                                        <Wassen className={`${handles.categoriesIcons}`} />
                                                                </div>
                                                        </Tilt>
                                                        <FormattedMessage id="store/countdown.washingmachines">
                                                                {message => <p className={`${handles.categoriesLabel}`}>Washing machines</p>}
                                                        </FormattedMessage>
                                                </a>
                                        </div>

                                        <div className={`${handles.iconsDiv}`}>
                                                <a style={{ display: "flex", flexFlow: "column", alignItems: "center", textDecoration: "none", color: "black" }} href={`${clicked.washdryer}`}>
                                                        <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                                <div className={`${handles.iconsInnerDiv}`}>
                                                                        <Wasdroog className={`${handles.categoriesIcons}`} />
                                                                </div>
                                                        </Tilt>
                                                        <FormattedMessage id="store/countdown.washdryer">
                                                                {message => <p className={`${handles.categoriesLabel}`}>Washer dryers</p>}
                                                        </FormattedMessage>
                                                </a>
                                        </div>

                                        <div className={`${handles.iconsDiv}`}>
                                                <a style={{ display: "flex", flexFlow: "column", alignItems: "center", textDecoration: "none", color: "black" }} href={`${clicked.dryer}`}>
                                                        <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                                <div className={`${handles.iconsInnerDiv}`}>
                                                                        <Wassen className={`${handles.categoriesIcons}`} />
                                                                </div>
                                                        </Tilt>
                                                        <FormattedMessage id="store/countdown.dryer">
                                                                {message => <p className={`${handles.categoriesLabel}`}>Tumble dryers</p>}
                                                        </FormattedMessage>
                                                </a>
                                        </div>
                                  


                                </div>

                        )
                }

                {/* Vaatwassen clicked */}

                {clicked.clickedVaatwassen && (

                        <div className={`${handles.iconsMainDiv}`} >
                                <div className={`${handles.leftArrowDiv}`}>
                                        <Leftarrow className={`${handles.categoriesArrow}`} onClick={() => { setClicked((prevState) => ({ ...prevState, clickedVaatwassen: false })) }} />
                                </div>

                                <div className={`${handles.iconsDiv}`}>
                                        <a style={{ display: "flex", flexFlow: "column", alignItems: "center", textDecoration: "none", color: "black" }} href={`${clicked.dishwashers}`}>
                                                <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                        <div className={`${handles.iconsInnerDiv}`} >
                                                                <Vaatwassen className={`${handles.categoriesIcons}`} />
                                                        </div>
                                                </Tilt>
                                                <FormattedMessage id="store/countdown.dishwashers">
                                                        {message => <p className={`${handles.categoriesLabel}`}>Dishwasher</p>}
                                                </FormattedMessage>
                                        </a>
                                </div>

                        </div>

                )

                }

                {/* Koelen clicked */}

                {clicked.clickedKoelen && (
                        <div className={`${handles.iconsMainDiv}`} >
                                <div className={`${handles.leftArrowDiv}`}>
                                        <Leftarrow className={`${handles.categoriesArrow}`} onClick={() => { setClicked((prevState) => ({ ...prevState, clickedKoelen: false })) }} />
                                </div>

                                <div className={`${handles.iconsDiv}`} >
                                        <a style={{ display: "flex", flexFlow: "column", alignItems: "center", textDecoration: "none", color: "black" }} href={`${clicked.refrigerators}`}>
                                                <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                        <div className={`${handles.iconsInnerDiv}`} >
                                                                <Koelkasten className={`${handles.categoriesIcons}`} />
                                                        </div>
                                                </Tilt>
                                                <FormattedMessage id="store/countdown.refrigerators">
                                                        {message => <p className={`${handles.categoriesLabel}`}>Fridge</p>}
                                                </FormattedMessage>
                                        </a>
                                </div>

                                <div className={`${handles.iconsDiv}`}>
                                        <a style={{ display: "flex", flexFlow: "column", alignItems: "center", textDecoration: "none", color: "black" }} href={`${clicked.refrigeratorswithfreezer}`}>
                                                <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                        <div className={`${handles.iconsInnerDiv}`}>
                                                                <Koelen className={`${handles.categoriesIcons}`} />
                                                        </div>
                                                </Tilt>
                                                <FormattedMessage id="store/countdown.refrigeratorswithfreezer">
                                                        {message => <p className={`${handles.categoriesLabel}`}>Fridge Freezers</p>}
                                                </FormattedMessage>
                                        </a>
                                </div>

                                <div className={`${handles.iconsDiv}`}>
                                        <a style={{ display: "flex", flexFlow: "column", alignItems: "center", textDecoration: "none", color: "black" }} href={`${clicked.freezers}`}>
                                                <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                        <div className={`${handles.iconsInnerDiv}`}>
                                                                <Koelen className={`${handles.categoriesIcons}`} />
                                                        </div>
                                                </Tilt>
                                                <FormattedMessage id="store/countdown.freezers">
                                                        {message => <p className={`${handles.categoriesLabel}`}>Freezer</p>}
                                                </FormattedMessage>
                                        </a>
                                </div>



                        </div>
                )

                }

                {/* Koken clicked */}

                {
                        clicked.clickedKoken && (
                                <div className={`${handles.iconsMainDivLast}`} >
                                        <div className={`${handles.leftArrowDiv}`}>
                                                <Leftarrow className={`${handles.categoriesArrow}`} onClick={() => { setClicked((prevState) => ({ ...prevState, clickedKoken: false })) }} />
                                        </div>

                                        <div className={`${handles.iconsDiv}`} >
                                                <a style={{ display: "flex", flexFlow: "column", alignItems: "center", textDecoration: "none", color: "black" }} href={`${clicked.cookers}`}>
                                                        <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                                <div className={`${handles.iconsInnerDiv}`} >
                                                                        <Fornuzien className={`${handles.categoriesIcons}`} />
                                                                </div>
                                                        </Tilt>
                                                        <FormattedMessage id="store/countdown.cookers">
                                                                {message => <p className={`${handles.categoriesLabel}`}>{message}</p>}
                                                        </FormattedMessage>
                                                </a>
                                        </div>{/* 
                                
                                        <div className={`${handles.iconsDiv}`}>
                                        <a style={{display: "flex", flexFlow: "column", alignItems: "center", textDecoration: "none", color: "black"}} href={clicked.accessories}>
                                        <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                <div className={`${handles.iconsInnerDiv}`}>
                                                <Wasdroog className={`${handles.categoriesIcons}`} />
                                                </div>
                                        </Tilt>
                                        <FormattedMessage id="store/countdown.accessories">
                                         {message => <p className={`${handles.categoriesLabel}`}>{message}</p>  }       
                                        </FormattedMessage>
                                        </a>
                                        </div> */}

                                        <div className={`${handles.iconsDiv}`}>
                                                <a style={{ display: "flex", flexFlow: "column", alignItems: "center", textDecoration: "none", color: "black" }} href={`${clicked.hob}`}>
                                                        <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                                <div className={`${handles.iconsInnerDiv}`}>
                                                                        <Kookplaten className={`${handles.categoriesIcons}`} />
                                                                </div>
                                                        </Tilt>
                                                        <FormattedMessage id="store/countdown.hob">
                                                                {message => <p className={`${handles.categoriesLabel}`}>{message}</p>}
                                                        </FormattedMessage>
                                                </a>
                                        </div>

                                        <div className={`${handles.iconsDiv}`}>
                                                <a style={{ display: "flex", flexFlow: "column", alignItems: "center", textDecoration: "none", color: "black" }} href={`${clicked.hoods}`}>
                                                        <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                                <div className={`${handles.iconsInnerDiv}`}>
                                                                        <Afzuigkappen className={`${handles.categoriesIcons}`} />
                                                                </div>
                                                        </Tilt>
                                                        <FormattedMessage id="store/countdown.hoods">
                                                                {message => <p className={`${handles.categoriesLabel}`}>Cooker Hoods</p>}
                                                        </FormattedMessage>
                                                </a>
                                        </div>

                                        <div className={`${handles.iconsDiv}`}>
                                                <a style={{ display: "flex", flexFlow: "column", alignItems: "center", textDecoration: "none", color: "black" }} href={`${clicked.microwaves}`}>
                                                        <Tilt tiltMaxAngleX={16} tiltMaxAngleY={18} transitionSpeed={1500} tiltReverse>
                                                                <div className={`${handles.iconsInnerDiv}`}>
                                                                        <Magnetrons className={`${handles.categoriesIcons}`} />
                                                                </div>
                                                        </Tilt>
                                                        <FormattedMessage id="store/countdown.microwaves">
                                                                {message => <p className={`${handles.categoriesLabel}`}>{message}</p>}
                                                        </FormattedMessage>
                                                </a>
                                        </div>


                                </div>
                        )
                }

                {(clicked.clickedWassen || clicked.clickedVaatwassen || clicked.clickedKoken || clicked.clickedKoelen) &&
                        <div className={`${handles.leftArrowDivMobile}`} onClick={() => {
                                setClicked((prevState) => ({
                                        ...prevState, clickedWassen: false,
                                        clickedVaatwassen: false, clickedKoken: false, clickedKoelen: false
                                }))
                        }} >
                                <Leftarrow className={`${handles.categoriesArrowMobile}`} />
                                <FormattedMessage id="store/countdown.GoBack">
                                        {message => <p>{message}</p>}
                                </FormattedMessage>
                        </div>

                }

        </div>
}

export default Categories
