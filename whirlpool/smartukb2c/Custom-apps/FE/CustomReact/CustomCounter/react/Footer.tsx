//@ts-nocheck
import React, { useState, useEffect } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Icon } from 'vtex.store-icons'
import IconMail from './Icons/IconMail'
import styles from "./styles.css"

import {
    MessageDescriptor,
    useIntl,
    defineMessages, FormattedMessage
} from 'react-intl'
import Facebook from './Icons/Facebook'
import Twitter from './Icons/Twitter'
import YoutubeSocial from './Icons/YoutubeSocial'
import WhatsappSocial from './Icons/WhatsappSocial'
import HeaderNav from './HeaderNav'
//import pixel message
import { usePixel } from 'vtex.pixel-manager'

interface Footeer { }

interface FooterStates {
    markLink: string;
    contactLink: string;
    privacyLink: string;
    datenLink: string;
    cookies: string;
    miniIcon: string;
    brandName: string;
    FAQ: string;
}

interface WindowOptanon extends Window {
  Optanon: any
}

const messages = defineMessages({
    language: { id: 'store/countdown.detectLanguage' }
})


const Footeer: StorefrontFunctionComponent<Footeer> = ({ }) => {
    const CSS_HANDLES = ["footerMainDiv", "footerRow", "footerHr", "footerInnerRow1", "footerInnerRow2", "footerColumn1", "footerColumns", "footerColumnHeaders",
        "footerLabels", "footerEndLabels", "footerCreditCards", "footerWhirlpool", "footerEndDiv", "footerDivWithIcon", "footerDivIconLabel", "footerMailIcon",
        "footerA", "phoneCallFooter", "cookieLink",]
    const handles = useCssHandles(CSS_HANDLES)
    const { push } = usePixel()
    const intl = useIntl()
    let optanon = (window as unknown as WindowOptanon).Optanon;

    const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message)
    const [locale, setLocale] = useState("");
    const [footerState, setFooterState] = useState<FooterStates>(
        {
            markLink: "https://whirlpool.ch/de/",
            contactLink: "https://www.bauknecht.ch/de_CH/Kundencenter/Kontakt",
            privacyLink: "https://whirlpool.ch/de/datenschutzerklaerung.html",
            datenLink: "https://www.bauknecht.ch/de_CH/Kundencenter/Ersatzteile",
            cookies: "https://www.bauknecht.ch/de_CH/Pages/Nutzung-von-Cookies",
            miniIcon: "/arquivos/whirlpool-logo-smallNew.png",
            brandName: "Whirlpool",
            FAQ: "https://www.bauknecht.ch/de_CH/Kundencenter/Haeufige-Fragen"
        })
    const [brand, setBrand] = useState("");

    useEffect(() => {
        let url = window && window.location ? window.location.href : "";

        let search = window.location.href;

        let search2 = window.location.search;

        if (search.includes("hotpoint")) {
            setFooterState((prevState) => ({
                miniIcon: "/arquivos/logo_hotpoint.png",
            }))
        } else {
            setFooterState((prevState) => ({
                miniIcon: "/arquivos/logo_indesit.png",
            }))
        }
        if (url) {
            setBrand(url.includes("indesit") ? "indesit" : "hotpoint");
        }


        setLocale(__RUNTIME__.culture.locale)


        var links = document.querySelectorAll(".vtex-store-footer-2-x-footerLayout a");
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            link.onclick = function () {
               window.dataLayer.push({
                'event': 'menuFooter',
                'eventCategory': 'Menu and Footer Clicks',
                'eventAction': 'Footer - ' + this.textContent,
                'eventLabel': this.href
               })
            
               let area = 'footer'
               //GA4FUNREQ54
               push({
                   'event': 'menu_footer_click',
                   'clickArea': area,
                   'linkText':this.textContent,
                   'linkUrl':this.href
                 });
            };
        }
    }, [])



    return <div>

        <div>
            <div className={styles.firstFooter}>

                <div className={styles.footerColumn}>
                    <img className={styles.imgFirstColumnItem} src={footerState.miniIcon} />
                    {(brand === "hotpoint" ?
                        <div>
                            <a className={styles.firstColumnItem} href="https://www.hotpoint.co.uk/" target="_blank">
                                <p className={styles.firstColumText}>Hotpoint brand</p>
                            </a>
                            <a className={styles.firstColumnItem} href="https://www.hotpointservice.co.uk/" target="_blank">
                                <p className={styles.firstColumText}>Hotpoint service</p>
                            </a>
                            <a className={styles.firstColumnItem} href="https://www.whirlpoolfactoryoutlet.co.uk/" target="_blank">
                                <p className={styles.firstColumText}>Whirlpool Factory Outlet</p>
                            </a>
                            <a className={styles.firstColumnItem} href="/models">
                                <p className={styles.firstColumText}>Models</p>
                            </a>

                        </div> :
                        <div>
                            <a className={styles.firstColumnItem} href="https://www.indesit.co.uk/" target="_blank" >
                                <p className={styles.firstColumText}>Indesit brand</p>
                            </a>
                            <a className={styles.firstColumnItem} href="https://www.indesitservice.co.uk/" target="_blank" >
                                <p className={styles.firstColumText}>Indesit service</p>
                            </a>
                            <a className={styles.firstColumnItem} href="https://www.whirlpoolfactoryoutlet.co.uk/" target="_blank" >
                                <p className={styles.firstColumText}>Whirlpool Factory Outlet</p>
                            </a>
                            <a className={styles.firstColumnItem} href="/models" >
                                <p className={styles.firstColumText}>Models</p>
                            </a>
                        </div>
                    )}
                </div>

                <div className={styles.footerColumn}>
                    <div className={styles.secondColumnItem}>
                        <FormattedMessage id="store/countdown.contacts">
                            {message => <p className={styles.secondColumnTitle}>{message}</p>}
                        </FormattedMessage>
                    </div>
                    <div className={styles.secondColumnItem}>
                        <div className={styles.secondColumnPhone} id="phone">
                            <div className={styles.secondColumnPhoneIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="20" height="20" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024"><path d="M896 832h-96q-13 0-22.5-9.5T768 800V480q0-13 9.5-22.5T800 448h32q0-148-82.5-234T512 128t-237.5 86T192 448h32q13 0 22.5 9.5T256 480v320q0 13-9.5 22.5T224 832h-32q0 53 37.5 90.5T320 960h64q0-27 18.5-45.5T448 896h64q27 0 45.5 18.5t18.5 45t-18.5 45.5t-45.5 19H320q-80 0-136-56t-56-136q-53 0-90.5-56T0 640q0-52 17.5-96T64 475v-27q0-91 35.5-174T195 131t143-95.5T512 0t174 35.5T829 131t95.5 143T960 448v27q29 25 46.5 69t17.5 96q0 80-37.5 136T896 832z" fill="#3AB5BE"></path></svg>
                            </div>
                            <div className={styles.secondColumnPhoneText}>
                                <a href="tel:03448225225" onClick={(e) => {
                                    window.dataLayer.push({
                                        'event': 'contactUsTracking',
                                        'eventCategory': 'Contact us',
                                        'eventAction': 'Telephone',
                                        'eventLabel': 'tel:03448225225'
                                    })
                                    //GA4FUNREQ17
                                    push({
                                        'event': 'contacts_click',
                                        'type': 'telephone'
                                    })
                                }}>
                                    03448 225 225
                                </a>
                            </div>
                        </div>

                    </div>
                    <div className={styles.secondColumnItem}>
                        <div className={styles.secondColumnPhone}>
                            <div className={styles.secondColumnPhoneIcon}>
                                <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="20" height="20" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g class="icon-tabler" fill="none" stroke="#3AB5BE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3.6 9h16.8"></path><path d="M3.6 15h16.8"></path><path d="M11.5 3a17 17 0 0 0 0 18"></path><path d="M12.5 3a17 17 0 0 1 0 18"></path></g></svg>
                            </div>
                            <div className={styles.secondColumnPhoneText}>
                                <a href="/contact-us" onClick={(e) => {
                                    window.dataLayer.push({
                                        'event': 'contactUsTracking',
                                        'eventCategory': 'Contact us',
                                        'eventAction': 'Contact Form',
                                        'eventLabel': e.currentTarget.href
                                    })
                                    //GA4FUNREQ17
                                    push({
                                        'event': 'contacts_click',
                                        'type': 'email'
                                    })
                                }}>
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </div>
                    {(brand === "hotpoint" ?
                        <div className={styles.footerSocialContainer}>
                            <div className={styles.footerSocialItem}>
                                <a href="https://www.youtube.com/user/HotpointServiceUK" target="_blank">
                                    <YoutubeSocial />
                                </a>
                            </div>
                            <div className={styles.footerSocialItem}>
                                <a href="https://www.facebook.com/hotpointuk/" target="_blank">
                                    <Facebook />
                                </a>
                            </div>
                            <div className={styles.footerSocialItem}>
                                <a href="https://twitter.com/hotpointsupport" target="_blank">
                                    <Twitter />
                                </a>
                            </div>
                            <div className={styles.footerSocialItem}>
                                <a href="https://api.whatsapp.com/send/?phone=447584475915&text&app_absent=0" target="_blank">
                                    <WhatsappSocial />
                                </a>
                            </div>
                        </div> :
                        <div className={styles.footerSocialContainer}>
                            <div className={styles.footerSocialItem}>
                                <a href="https://www.youtube.com/user/IndesitServiceUK" target="_blank">
                                    <YoutubeSocial />
                                </a>
                            </div>
                            <div className={styles.footerSocialItem}>
                                <a href="https://www.facebook.com/indesituk/" target="_blank">
                                    <Facebook />
                                </a>
                            </div>
                            <div className={styles.footerSocialItem}>
                                <a href="https://twitter.com/indesitsupport" target="_blank">
                                    <Twitter />
                                </a>
                            </div>
                            <div className={styles.footerSocialItem}>
                                <a href="https://api.whatsapp.com/send/?phone=447584475915&text&app_absent=0" target="_blank">
                                    <WhatsappSocial />
                                </a>
                            </div>
                        </div>
                    )}


                </div>

                <div className={styles.footerColumn}>

                    <div className={styles.thirdColumnItem}>
                        <FormattedMessage id="store/countdown.puchaseAndDelivery">
                            {message => <p className={styles.thirdColumnTitle}>{message}</p>}
                        </FormattedMessage>
                    </div>
                    <div className={styles.thirdColumnItem}>
                        <a href="/terms-of-sales#delivery" target="_blank">
                            <FormattedMessage id="store/countdown.deliveryInformation">
                                {message => <p className={styles.thirdColumnItemText}>{message}</p>}
                            </FormattedMessage>
                        </a>
                    </div>
                    <div className={styles.thirdColumnItem}>
                        <a href="/returns-policy" target="_blank">
                            <FormattedMessage id="store/countdown.purchaseAndReturn">
                                {message => <p className={styles.thirdColumnItemText}>{message}</p>}
                            </FormattedMessage>
                        </a>
                    </div>
                    <div className={styles.thirdColumnItem}>
                        <a href="/faq" target="_blank">
                            <p className={styles.thirdColumnItemText}>FAQ</p>
                        </a>
                    </div>
                </div>

                <div className={styles.footerColumn}>

                    <div className={styles.fourthColumnItem}>
                        <FormattedMessage id="store/countdown.payment">
                            {message => <p className={styles.fourthColumnTitle}>{message}</p>}
                        </FormattedMessage>
                    </div>
                    <div className={styles.fourthColumnItem}>
                        <a className={`${handles.footerA}`} href="/terms-of-sales#payment" target="_blank">
                            <FormattedMessage id="store/countdown.paymentInformation">
                                {message => <p className={styles.fourthColumnItemText}>{message}</p>}
                            </FormattedMessage>
                        </a>
                    </div>
                    <div className={styles.fourthColumnItem}>
                        {/* <FormattedMessage id="store/countdown.creditCardAccepted">
                                    {message => <p className={`${handles.footerLabels}`}>{message}</p>}
                                </FormattedMessage> */}
                        <img className={styles.imagePayment} src={"/arquivos/payments-methods.png"} />
                    </div>
                </div>
            </div>

        </div>



        <div className={styles.secondFooter}>
            <div className={styles.secondFooterWrapper}>
                <div className={styles.secondFooterItem}>© 2021 Whirlpool Appliances LTD. All rights reserved.</div>
                <div className={styles.secondFooterItem}>
                    <a href="/terms-of-sales" target="_blank">
                        Terms of sale
                    </a>
                </div>
                <div className={styles.secondFooterItem}>
                    <a href="/terms-of-use" target="_blank">
                        Terms of use
                    </a>
                </div>
                <div className={styles.secondFooterItem}>
                    <a href="/returns-policy" target="_blank">
                        Returns policy
                    </a>
                </div>
                <div className={styles.secondFooterItem}>
                    <a href="/cookies" target="_blank">
                        Cookie notice
                    </a>
                </div>
                <div className={styles.secondFooterItem}>
                    {(brand === "hotpoint" ?
                        <a href="https://www.hotpoint.co.uk/privacy-policy" target="_blank">
                            Privacy notice
                        </a> :
                        <a href="https://www.indesit.co.uk/Pages/Privacy-Notice" target="_blank">
                            Privacy notice
                        </a>
                    )}
                </div>
                <div className={styles.secondFooterItem}>
                    <a className={`${handles.cookieLink} optanon-toggle-display`}  onClick = {()=> optanon.ToggleInfoDisplay()}>
                        Manage my preferences
                    </a>
                </div>
                <div className={styles.secondFooterItem}>
                    <a href="http://cnet.whirlpool.co.uk/ModernSlavery.html" target="_blank">
                        The slavery act
                    </a>
                </div>
            </div>




        </div>











    </div>




}

export default Footeer
