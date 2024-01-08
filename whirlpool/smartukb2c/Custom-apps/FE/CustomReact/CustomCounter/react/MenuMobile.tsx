import React, { useState, useEffect } from 'react'
import CloseIcon from './Icons/CloseIcon'
import HamburgerMenu from './Icons/HamburgerMenu'
import styles from './styles.css'

interface Props {
    actionIconId?: string
    dismissIconId?: string
    isFullWidth?: boolean
    maxWidth?: number | string
    children: React.ReactNode
    customIcon?: React.ReactElement
    header?: React.ReactElement
}

interface MobileStates {
    brand: string;
    bindingAddress: string;
    imageLink: string;
}

function MenuMobile(props: Props) {

    const { children } = props
    const [testSt, setTestSt] = useState(false)
    let pathname = window.location ? window.location.pathname : "";
    const [mobileStates, setMobileStates] = useState<MobileStates>({
        brand: "",
        bindingAddress: "",
        imageLink: "arquivos/whirlpoollogo.png"
    })

    useEffect(() => {
        let search = window.location.search;
        let search2 = window.location.href;
        let isIndesit = (search.includes("indesit") || search2.includes("indesit"));
        let isWhirlpool = (search.includes("whirlpool") || search2.includes("whirlpool"));
        let isBauknecht = (search.includes("bauknecht") || search2.includes("bauknecht"));
        let params = new URLSearchParams(window.location.search);
        setMobileStates((prevState) => ({
            ...prevState,
            brand: (isIndesit ? "indesit" : isBauknecht ? "bauknecht" : isWhirlpool ? "whirlpool" : ""),
            bindingAddress: `${(params.get("__bindingAddress"))}`,
            imageLink: (isIndesit ? "/arquivos/logo_indesit.png" : "/arquivos/logo_hotpoint.png")
        }))
    
    }, [])
    useEffect(() => {
        setTestSt(false)
    }, [pathname])
    return (
        <div className={styles.mobileMenuTest} >
            <div className={styles.logoAndIconDiv}>
                {!testSt ? (<HamburgerMenu className={styles.hamburgerIcon} onClick={() => {
                    setTestSt(!testSt)
                 setTimeout(() => {
                     let menuItems = Array.from(document.querySelectorAll(".vtex-rich-text-0-x-paragraph--menuNavItemLabel"));
                     let submenuItems = Array.from(document.querySelectorAll(".vtex-rich-text-0-x-paragraph--categoryItemTitle"));
                     menuItems.forEach((node:any) => {
                      
                        node.onclick = function (e: any) {
                            menuItems.forEach((node:any) => {
                                if(node.closest(".vtex-flex-layout-0-x-flexRowContent--menuNavItem")){
                                    node.closest(".vtex-flex-layout-0-x-flexRowContent--menuNavItem").querySelectorAll(".vtex-flex-layout-0-x-flexRow--categoriesList")[0].style.display = "none"

                                }
                                node.style.fontWeight = "400";
                                node.style.color = "#000";
                                node.classList.remove("active");

                            });
                            e.currentTarget.classList.add("active");
                            e.currentTarget.style.fontWeight = "600";
                            e.currentTarget.style.color = "#3AB5BE";
                            e.currentTarget.closest(".vtex-flex-layout-0-x-flexRowContent--menuNavItem").querySelectorAll(".vtex-flex-layout-0-x-flexRow--categoriesList")[0].style.display = "flex" 
                        };
                     });
                     submenuItems.forEach((node:any) => {
                        node.onclick = function (e: any) {
                            if(!node.classList.contains(styles.submenuActive)){
                                node.classList.add(styles.submenuActive);
                            } else {
                                node.classList.remove(styles.submenuActive);
                            }
                            let items = e.currentTarget.parentNode.parentNode.parentNode.parentNode.querySelectorAll(".vtex-rich-text-0-x-container--categoryItem")
                            items.forEach((item:any, index:any) => {
                               if(index > 0) {
                                if(item.style.display !== "none" && item.style.display){
                                   
                                    item.style.display = "none";
                                } else {
                                  
                                    item.style.display = "block";
                                }
                               }
                            }) 
                        };
                
                     });
                    }, 1000);
                }} />) :
                    (<CloseIcon className={styles.hamburgerIcon} onClick={() => setTestSt(!testSt)} />)}
                <img className={styles.logoMobile} onClick={() => window.location.href = `/`} src={mobileStates.imageLink} />

            </div>
            {testSt && children}
        </div>
    )
}

export default MenuMobile
