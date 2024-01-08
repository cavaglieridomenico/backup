import React, { useState, useEffect } from 'react';
import Livechat from './contactTypes/Livechat';
import Whatsapp from './contactTypes/Whatsapp';
import Phone from './contactTypes/Phone';
import ContactLink from './contactTypes/ContactLink';
import Data from './json/contacts.json';
import styles from "./styles.css";
import Placeholder from './Icons/Placeholder';
import Question from './Icons/Question';
import Bulb from './Icons/Bulb';
import Delivery from './Icons/Delivery';
import Page from './Icons/Page';
import Spanner from './Icons/Spanner';

interface ContactUs { };



const ContactUs: StorefrontFunctionComponent<ContactUs> = ({ }) => {

    const titleMenu: String = Data.menu.title;
    const data: any = Data.menu.options;
    const [visibleFirstMenu, setVisibleFirstMenu] = useState(true);
    const [titleSecondMenu, setTitleSecondMenu] = useState("");
    const [secondMenu, setSecondMenu] = useState([]);
    const [visibleSecondMenu, setVisibleSecondMenu] = useState(false);
    const [titleThirdMenu, setTitleThirdMenu] = useState("");
    const [thirdMenu, setThirdMenu] = useState([]);
    const [thirdMenuLinks, setThirdMenuLinks] = useState([]);
    const [positionLinks, setPositionLinks] = useState("");
    const [visibileThirdMenu, setVisibileThirdMenu] = useState(false);
    const [activeFirstMenu, setActiveFirstMenu] = useState();
    const [activeSecondMenu, setActiveSecondMenu] = useState();
    const [translateSecondMenu, setTranslateSecondMenu] = useState(false);
    const [brand, setBrand] = useState("");

    const showSecondMenu = (opt: any, i: any) => {
        setVisibleFirstMenu(false);
        let optionSecondMenu = opt.options;
        setTitleSecondMenu(opt.title);
        setSecondMenu(optionSecondMenu);
        setVisibleSecondMenu(true);
        setVisibileThirdMenu(false);
        setActiveFirstMenu(i);
        setActiveSecondMenu(undefined);
    }



    const showThirdMenu = (opt: any, links: any, title: any, i: any, pos: any) => {
        setTitleThirdMenu(title);
        setThirdMenu(opt);
        setThirdMenuLinks(links);
        setPositionLinks(pos);
        setVisibileThirdMenu(true);
        setActiveSecondMenu(i);
    }

    const returnFirstMenu = () => {
        setVisibleFirstMenu(true);
        setActiveFirstMenu(undefined);
        setVisibleSecondMenu(false);
        setVisibileThirdMenu(false);
        setTitleSecondMenu("");
        setTitleThirdMenu("");
        setSecondMenu([]);
    }

    const translateRightSecondMenu = () => {
        setTranslateSecondMenu(true);
    }
    const translateLeftSecondMenu = () => {
        setTranslateSecondMenu(false);
    }

    const selectIcon = (icon: any) => {
        switch (icon) {
            default: return "";
                break;
                break;
            case "spanner": return <Placeholder />
                break;
            case "Question": return <Question />
                break;
            case "Bulb": return <Bulb />
                break;
            case "Delivery": return <Delivery />
                break;
            case "Page": return <Page />
                break;
            case "Spanner": return <Spanner />
                break;
        }
    }

    useEffect(() => {
        let url = window && window.location ? window.location.href : "";
        if (url) {
            setBrand(url.includes("indesit") ? "indesit" : "hotpoint");
        }
    }, [])

    

    return (
        <div className={[styles.contactUsMB100px, styles[`contactUs_${brand}`]].join(" ")}>
            <h1 className={styles.contactUsTitle}>Talk to us</h1>
            <div className={styles.contactUsContainer}>
                <p className={styles.contactUsBreadcrumbTitle}>Please select the topic you need</p>
                {(!visibleFirstMenu &&
                    <div className={styles.contactUsBreadcrumb}>
                        <div className={styles.contactUsBreadcrumbContent}
                            onClick={() => { returnFirstMenu() }}>Topic  {' > ' + titleSecondMenu + ' > '} {titleThirdMenu}</div>
                    </div>
                )}
                <div className={(visibleFirstMenu === true ? styles.contactUsContainerMenu : styles.contactUsContainerMenuHide)}
                    onMouseOver={() => { translateRightSecondMenu() }}
                    onMouseLeave={() => { translateLeftSecondMenu() }}>
                    <div className={styles.contactUsTitleMenu}>{titleMenu}</div>
                    {data.map((opt: any, index: any) => {
                        return (
                            <div className={styles.contactUsContainerItem}>
                                <div className={(visibleFirstMenu === true) ? styles.contactUsMenu : styles.contactUsMenuHide}>
                                    <div className={[(visibleFirstMenu === true) ?
                                        (activeFirstMenu === index ? styles.contactUsOptionMenuActive : styles.contactUsOptionMenu) :
                                        (activeFirstMenu === index ? styles.contactUsOptionMenuActive : styles.contactUsOptionMenuHide), styles.contactUsMenuOptionWrapper].join(" ")}

                                        onClick={() => { showSecondMenu(opt.options, index) }}>
                                        {selectIcon(opt.icon)} <div className={styles.contactUsOptionTtile}>{opt.title}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className={(secondMenu.length == 0 ? styles.contactUsImageContainer : styles.contactUsImageContainerHide)}>
                    <img src="arquivos/contact-block-img.png" />
                </div>
                
                {(secondMenu.length > 0 &&
                    <div className={(translateSecondMenu === true ?
                        (visibileThirdMenu === false ? styles.contactUsContainerSecondMenuTranslate : styles.contactUsContainerSecondMenuHideTranslate) :
                        (visibileThirdMenu === false ? styles.contactUsContainerSecondMenu : styles.contactUsContainerSecondMenuHide))}>
                        <div className={styles.contactUsTitleMenu}>{'Your topic: ' + titleSecondMenu}</div>
                        {secondMenu.map((opt: any, index: any) => {
                            return (
                                <div className={styles.contactUsContainerItem}>
                                    <div className={styles.contactUsMenu}>
                                        <div className={(visibleSecondMenu === true) ?
                                            (activeSecondMenu === index ? styles.contactUsOptionMenuActive : styles.contactUsOptionMenu) :
                                            (activeSecondMenu === index ? styles.contactUsOptionMenuActive : styles.contactUsOptionMenuHide)}

                                            onClick={() => { showThirdMenu(opt.content, opt.links, opt.title, index, opt.positionLinks) }}>{opt.title}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>)}

                {(titleThirdMenu &&
                    <div className={(visibileThirdMenu === true ? styles.contactUsBlock : styles.contactUsBlockContainerHide)}>
                        <div className={styles.contactUsBlockTitle}>{titleThirdMenu}</div>
                        <div className={styles.contactUsContainerMenuBlock}>
                            {(thirdMenuLinks &&
                                thirdMenuLinks.map((block: any) => {
                                    return (
                                        <div className={(positionLinks == "top" ? [styles.contactUsBlockContainerLinks, styles.contactUsBlockLinksPositionTop].join(" ") :
                                            (positionLinks == "bottom" ? [styles.contactUsBlockContainerLinks, styles.contactUsBlockLinksPositionBottom].join(" ") : " "))
                                        }>
                                            <ContactLink
                                                type={block}
                                                titleSecondMenu={titleSecondMenu}
                                                titleThirdMenu={titleThirdMenu} />
                                        </div>
                                    )
                                }))}
                                
                            {(thirdMenu &&
                                thirdMenu.map((block: any) => {
                                    return (
                                        <div className={styles.contactUsBlockContainer}>
                                            {(block.title == "Live Chat" ?
                                                <Livechat
                                                    type={block}
                                                    titleSecondMenu={titleSecondMenu}
                                                    titleThirdMenu={titleThirdMenu} />
                                                :
                                                (block.title == "WhatsApp" ?
                                                    <Whatsapp
                                                        type={block}
                                                        titleSecondMenu={titleSecondMenu}
                                                        titleThirdMenu={titleThirdMenu} />
                                                    :
                                                    (block.title == "Phone" ?
                                                        <Phone
                                                            type={block}
                                                            titleSecondMenu={titleSecondMenu}
                                                            titleThirdMenu={titleThirdMenu} />
                                                        :
                                                        <div></div>
                                                    )
                                                )
                                            )}
                                        </div>
                                    )
                                }))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ContactUs;