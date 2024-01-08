import React, {useState, useEffect} from 'react' 
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
    const [testSt,setTestSt] = useState(false)

    const [mobileStates, setMobileStates] = useState<MobileStates> ({
        brand: "",
        bindingAddress: "",
        imageLink: "arquivos/whirlpoollogo.png" 
    })

    useEffect(()=> {
        let search = window.location.search;
        let search2 = window.location.href;
        let isIndesit = (search.includes("indesit") || search2.includes("indesit"));
        let isWhirlpool = (search.includes("whirlpool") || search2.includes("whirlpool"));
        let isBauknecht = (search.includes("bauknecht") || search2.includes("bauknecht"));
        let params = new URLSearchParams(window.location.search);
        setMobileStates((prevState)=> ({...prevState, 
                brand: (isIndesit ? "indesit" : isBauknecht ? "bauknecht" : isWhirlpool ? "whirlpool" : ""),
                bindingAddress: `${(params.get("__bindingAddress"))}` ,
                imageLink : (isIndesit ? "/arquivos/indesit.png" : isBauknecht ? "/arquivos/bauk.png" : isWhirlpool ? "/arquivos/whirlpoollogo.png" : "")
            }))
    },[])
    return ( 
                <div className={ styles.mobileMenuTest } >  
                    <div className={ styles.logoAndIconDiv }>
                        <img className={ styles.logoMobile } onClick={()=>window.location.href =`${window.location.origin}?__bindingAddress=${mobileStates.bindingAddress}`} src={mobileStates.imageLink}/> 
                        { !testSt ?( <HamburgerMenu className={styles.hamburgerIcon} onClick={()=>setTestSt(!testSt)} />) :
                        (<CloseIcon className={styles.hamburgerIcon} onClick={()=>setTestSt(!testSt)}/>)}
                    </div>
                    { testSt && children}
                </div> 
    )
    }
 
export default MenuMobile
