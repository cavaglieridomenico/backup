//@ts-nocheck
import React, { useState, useEffect  }  from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { Icon } from 'vtex.store-icons'
import IconMail from './Icons/IconMail'
import { 
    MessageDescriptor,
    useIntl,
    defineMessages, FormattedMessage } from 'react-intl'

interface Footeer {}

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

const messages = defineMessages({
    language: { id: 'store/countdown.detectLanguage' } 
})


const Footeer: StorefrontFunctionComponent<Footeer> = ({}) => {
  const CSS_HANDLES = ["footerMainDiv","footerRow","footerHr","footerInnerRow1","footerInnerRow2","footerColumn1","footerColumns","footerColumnHeaders",
                       "footerLabels","footerEndLabels","footerCreditCards","footerWhirlpool","footerEndDiv","footerDivWithIcon","footerDivIconLabel","footerMailIcon",
                       "footerA","phoneCallFooter"]
  const handles = useCssHandles(CSS_HANDLES)

  const intl = useIntl()

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

    useEffect(()=> {

        let search = window.location.href; 

        let search2 = window.location.search; 

        if((search.includes("whirlpool.ch") && translateMessage(messages.language)=="de" )|| search2.includes("whirlpool.ch/de")){
            setFooterState((prevState)=> ({
                ...prevState, 
                markLink: "https://whirlpool.ch/de/", 
                contactLink: "https://www.bauknecht.ch/de_CH/Kundencenter/Kontakt",
                privacyLink: "https://whirlpool.ch/de/datenschutzerklaerung.html",
                datenLink: "https://www.bauknecht.ch/de_CH/Kundencenter/Ersatzteile",
                cookies: "/de/nutzung-von-cookies",
                miniIcon: "/arquivos/whirlpool-logo-smallNew.png",
                brandName: "Whirlpool",
                FAQ: "https://www.bauknecht.ch/de_CH/Kundencenter/Haeufige-Fragen"
            }))
        }

        else if (((search.includes("whirlpool.ch") && translateMessage(messages.language)=="it") || search2.includes("whirlpool.ch/it"))){
            setFooterState((prevState)=> ({
                ...prevState, 
                markLink: "https://whirlpool.ch/it/", 
                contactLink: "https://whirlpool.ch/it/contatto.html",
                privacyLink: "https://whirlpool.ch/it/informativa-sulla-privacy.html",
                datenLink: "https://www.bauknecht.ch/it_CH/Centri-Clienti/Ricambi#retour_it",
                cookies: "/it/informativa-sui-cookies",
                miniIcon: "/arquivos/whirlpool-logo-smallNew.png",
                brandName: "Whirlpool",
                FAQ: "https://www.bauknecht.ch/it_CH/Centri-Clienti/Domande-frequenti"
            }))
        }

        else if ((search.includes("whirlpool.ch") && translateMessage(messages.language)=="fr") || search2.includes("whirlpool.ch/fr")){
            setFooterState((prevState)=> ({
                ...prevState, 
                markLink: "https://whirlpool.ch/fr/", 
                contactLink: "https://whirlpool.ch/fr/contact.html",
                privacyLink: "https://whirlpool.ch/fr/protection-des-donn%C3%A9es.html",
                datenLink: "https://www.bauknecht.ch/fr_CH/Centre-de-clients/Pieces-de-rechange",
                cookies: "/fr/cookies",
                miniIcon: "/arquivos/whirlpool-logo-smallNew.png",
                brandName: "Whirlpool",
                FAQ: "https://www.bauknecht.ch/fr_CH/Centre-de-clients/Foire-aux-questions"
            }))
        }

        else if ((search.includes("indesit.ch") && translateMessage(messages.language)=="de") || search2.includes("indesit.ch/de")){
            setFooterState((prevState)=> ({
                ...prevState, 
                markLink: "https://www.indesit.ch/de_CH", 
                contactLink: "https://www.indesit.ch/de_CH/Indesit-Support/Kontaktformular",
                privacyLink: "https://www.indesit.ch/de_CH/Pages/Datenschutzerklaerung",
                datenLink: "https://www.bauknecht.ch/de_CH/Kundencenter/Ersatzteile",
                cookies: "/de/haftungsausschluss-fur-cookies",
                miniIcon: "/arquivos/indesitMini.png",
                brandName: "Indesit",
                FAQ: "https://www.bauknecht.ch/de_CH/Kundencenter/Haeufige-Fragen"
            }))
        }

        else if ((search.includes("indesit.ch") && translateMessage(messages.language)=="it") || search2.includes("indesit.ch/it")){
            setFooterState((prevState)=> ({
                ...prevState, 
                markLink: "https://www.indesit.ch/it_CH", 
                contactLink: "https://www.indesit.ch/it_CH/Assistenza/Contattaci",
                privacyLink: "https://www.indesit.ch/it_CH/Pages/Informativa-sulla-Privacy",
                datenLink: "https://www.bauknecht.ch/it_CH/Centri-Clienti/Ricambi#retour_it",
                cookies: "/it/informativa-sui-cookie",
                miniIcon: "/arquivos/indesitMini.png",
                brandName: "Indesit",
                FAQ: "https://www.bauknecht.ch/it_CH/Centri-Clienti/Domande-frequenti"
            }))
        }

        else if ((search.includes("indesit.ch") && translateMessage(messages.language)=="fr") || search2.includes("indesit.ch/fr")){
            setFooterState((prevState)=> ({
                ...prevState, 
                markLink: "https://www.indesit.ch/fr_CH", 
                contactLink: "https://www.indesit.ch/fr_CH/Assistance/Formulaire-de-contact",
                privacyLink: "https://www.indesit.ch/fr_CH/Pages/Declaration-de-Confidentialite",
                datenLink: "https://www.bauknecht.ch/fr_CH/Centre-de-clients/Pieces-de-rechange",
                cookies: "/fr/donnees-personnelles-et-cookies",
                miniIcon: "/arquivos/indesitMini.png",
                brandName: "Indesit",
                FAQ: "https://www.bauknecht.ch/fr_CH/Centre-de-clients/Foire-aux-questions"
            }))
        }

        else if ((search.includes("bauknecht.ch") && translateMessage(messages.language)=="de") || search2.includes("bauknecht.ch/de")){
            setFooterState((prevState)=> ({
                ...prevState, 
                markLink: "https://www.bauknecht.ch/de_CH", 
                contactLink: "https://www.bauknecht.ch/de_CH/Kundencenter/Kontakt",
                privacyLink: "https://www.bauknecht.ch/de_CH/Pages/Datenschutzerklaerung",
                datenLink: "https://www.bauknecht.ch/de_CH/Kundencenter/Ersatzteile",
                cookies: "/de/nutzung-von-cookies",
                miniIcon: "/arquivos/baukMini.png",
                brandName: "Bauknecht",
                FAQ: "https://www.bauknecht.ch/de_CH/Kundencenter/Haeufige-Fragen"
            }))
        }

        else if ((search.includes("bauknecht.ch") && translateMessage(messages.language)=="it") || search2.includes("bauknecht.ch/it")){
            setFooterState((prevState)=> ({
                ...prevState, 
                markLink: "https://www.bauknecht.ch/it_CH", 
                contactLink: "https://www.bauknecht.ch/it_CH/Centri-Clienti/Contattaci",
                privacyLink: "https://www.bauknecht.ch/it_CH/Pages/Informativa-sulla-privacy",
                datenLink: "https://www.bauknecht.ch/it_CH/Centri-Clienti/Ricambi#retour_it",
                cookies: "/it/informativa-sui-cookies",
                miniIcon: "/arquivos/baukMini.png",
                brandName: "Bauknecht",
                FAQ: "https://www.bauknecht.ch/it_CH/Centri-Clienti/Domande-frequenti"
            }))
        }

        else if ((search.includes("bauknecht.ch") && translateMessage(messages.language)=="fr") || search2.includes("bauknecht.ch/fr")){
            setFooterState((prevState)=> ({
                ...prevState, 
                markLink: "https://www.bauknecht.ch/fr_CH", 
                contactLink: "https://www.bauknecht.ch/fr_CH/Centre-de-clients/Contactez-nous",
                privacyLink: "https://www.bauknecht.ch/fr_CH/Pages/Politique-de-protection-des-donnees-a-caractere-personnel",
                datenLink: "https://www.bauknecht.ch/fr_CH/Centre-de-clients/Pieces-de-rechange",
                cookies: "/fr/cookies",
                miniIcon: "/arquivos/baukMini.png",
                brandName: "Bauknecht",
                FAQ: "https://www.bauknecht.ch/fr_CH/Centre-de-clients/Foire-aux-questions"
            }))
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
               window.dataLayer.push({
                   'event': 'menu_footer_click',
                   'click_area': area,
                   'link_text':this.textContent,
                   'link_url':this.href
                 });
            };
        }
    }, [])

  return <div>
  
            <div className={`${handles.footerMainDiv}`}>

                <div className={`${handles.footerHr}`}>

                </div>

                <div className={`${handles.footerRow}`}> 

                    <div className={`${handles.footerInnerRow1}`}>

                        <div className={`${handles.footerColumn1}`}>
                            <img className={`${handles.footerWhirlpool}`} src={footerState.miniIcon}/>                          
                        </div>

                        <div className={`${handles.footerColumns}`}>
                            <FormattedMessage id="store/countdown.contacts">
                                {message => <p className={`${handles.footerColumnHeaders}`}>{message}</p> }
                            </FormattedMessage> 
                            <div>
                                
                                <IconMail className={`${handles.footerMailIcon}`}/>
                                <p className={`${handles.footerLabels}`}>ersatzteilverkauf@bauknecht.ch</p>

                                <div className={`${handles.footerDivWithIcon}`}>
                                    <Icon id="hpa-telemarketing"/>
                                    <a className={`${handles.phoneCallFooter}`} href="tel:+0848801005">+0848 801 005 </a>
                                </div>
                                
                                <div className={`${handles.footerDivWithIcon}`}>
                                    <Icon id="mpa-globe"/>
                                    <a className={`${handles.footerA}`} href={footerState.contactLink} target="_blank">
                                    <FormattedMessage id="store/countdown.contactUs">
                                        {message => <p className={`${handles.footerDivIconLabel}`}>{message}</p> }
                                    </FormattedMessage>
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>


                    <div className={`${handles.footerInnerRow2}`}>

                        <div className={`${handles.footerColumns}`}>
                            <FormattedMessage id="store/countdown.puchaseAndDelivery">
                                {message => <p className={`${handles.footerColumnHeaders}`}>{message}</p> }
                            </FormattedMessage> 
                            <div>
                                <a className={`${handles.footerA}`} href={locale === "it-CH" ?  `/${locale.split("-")[0]}/Termini-e-Condizioni` : locale === "de-CH" ? `/${locale.split("-")[0]}/Geschaftsbedingungen `: `/${locale.split("-")[0]}/Termes-et-conditions`}  target="_blank">
                                <FormattedMessage id="store/countdown.deliveryInformation">
                                    {message => <p className={`${handles.footerLabels}`}>{message}</p>}
                                </FormattedMessage>
                                </a>
                                <a className={`${handles.footerA}`} href={locale === "it-CH" ?  `/${locale.split("-")[0]}/Termini-e-Condizioni` : locale === "de-CH" ? `/${locale.split("-")[0]}/Geschaftsbedingungen `: `/${locale.split("-")[0]}/Termes-et-conditions`}  target="_blank">
                                <FormattedMessage id="store/countdown.purchaseAndReturn">
                                    {message => <p className={`${handles.footerLabels}`}>{message}</p>}
                                </FormattedMessage>
                                </a>
                                <a className={`${handles.footerA}`} href={footerState.FAQ} target="_blank">
                                    <p className={`${handles.footerLabels}`}>FAQ</p>
                                </a>
                            </div>
                        
                        </div>

                        <div className={`${handles.footerColumns}`}>
                            <FormattedMessage id="store/countdown.payment">
                                {message => <p className={`${handles.footerColumnHeaders}`}>{message}</p> }
                            </FormattedMessage>
                            <div>
                                <a className={`${handles.footerA}`} href={locale === "it-CH" ?  `/${locale.split("-")[0]}/Termini-e-Condizioni` : locale === "de-CH" ? `/${locale.split("-")[0]}/Geschaftsbedingungen `: `/${locale.split("-")[0]}/Termes-et-conditions`}  target="_blank">
                                <FormattedMessage id="store/countdown.paymentInformation">
                                    {message => <p className={`${handles.footerLabels}`}>{message}</p>}
                                </FormattedMessage>
                                </a>
                                {/* <FormattedMessage id="store/countdown.creditCardAccepted">
                                    {message => <p className={`${handles.footerLabels}`}>{message}</p>}
                                </FormattedMessage> */}
                                <img className={`${handles.footerCreditCards}`} src={"/arquivos/newCreditCards.png"}/>
                            </div>
                    </div>

                    </div>


                </div>
            </div>

         <div className={`${handles.footerEndDiv}`}>
            <p className={`${handles.footerEndLabels}`}>©2021 {footerState.brandName}</p>
            <p className={`${handles.footerEndLabels}`}>|</p>
            <a className={`${handles.footerA}`} href={footerState.privacyLink} target="_blank">
                <FormattedMessage id="store/countdown.privacyPolicy">
                    {message => <p className={`${handles.footerEndLabels}`}>{message}</p> }
                </FormattedMessage>
            </a>
            <p className={`${handles.footerEndLabels}`}>|</p>
            <a className={`${handles.footerA}`} href={footerState.datenLink} target="_blank">
                <FormattedMessage id="store/countdown.return">
                    {message => <p className={`${handles.footerEndLabels}`}>{message}</p> }
                </FormattedMessage>
            </a>
            <p className={`${handles.footerEndLabels}`}>|</p>
            <a className={`${handles.footerA}`} href={locale === "it-CH" ?  `/${locale.split("-")[0]}/Termini-e-Condizioni` : locale === "de-CH" ? `/${locale.split("-")[0]}/Geschaftsbedingungen `: `/${locale.split("-")[0]}/Termes-et-conditions`} target="_blank">
                <FormattedMessage id="store/countdown.termsAndConditions">
                    {message => <p className={`${handles.footerEndLabels}`}>{message}</p> }
                </FormattedMessage>
            </a>

            <p className={`${handles.footerEndLabels}`}>|</p>
            <a className={`${handles.footerA}`} href={footerState.cookies} target="_blank">
                <FormattedMessage id="store/countdown.cookies">
                    {message => <p className={`${handles.footerEndLabels}`}>{message}</p>}
                </FormattedMessage>
            </a> 
         </div>

        </div>
} 

export default Footeer
