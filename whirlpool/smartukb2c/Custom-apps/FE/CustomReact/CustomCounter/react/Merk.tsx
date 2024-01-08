
import React, {useState, useEffect} from 'react'   
import styles from './styles.css' 
import { 
    MessageDescriptor,
    useIntl,
    defineMessages } from 'react-intl' 

interface MerkStates {
    markLink: string;  
}

const messages = defineMessages({
    merk: { id: 'store/countdown.merk' }
    })

const Merk: StorefrontFunctionComponent = () => { 

    const intl = useIntl()
    const translateMessage = (message: MessageDescriptor) => intl.formatMessage(message)  
    
    const [merk, setMerk] = useState<MerkStates>({
        markLink : "https://whirlpool.ch/de/" 
    })

    useEffect(()=> {
        let search = window.location.search; 
        let search2 = window.location.href;
        if(search.includes("whirlpool.ch/de") || search2.includes("whirlpool.ch/de")){
            setMerk((prevState)=> ({
                ...prevState, 
                markLink: "https://whirlpool.ch/de/" 
            }))
        }

        else if (search.includes("whirlpool.ch/it") || search2.includes("whirlpool.ch/it")){
            setMerk((prevState)=> ({
                ...prevState, 
                markLink: "https://whirlpool.ch/it/" 
            }))
        }

        else if (search.includes("whirlpool.ch/fr") || search2.includes("whirlpool.ch/fr")){
            setMerk((prevState)=> ({
                ...prevState, 
                markLink: "https://whirlpool.ch/fr/" 
            }))
        }

        else if (search.includes("indesit.ch/de") || search2.includes("indesit.ch/de")){
            setMerk((prevState)=> ({
                ...prevState, 
                markLink: "https://www.indesit.ch/de_CH" 
            }))
        }

        else if (search.includes("indesit.ch/it") || search2.includes("indesit.ch/it")){
            setMerk((prevState)=> ({
                ...prevState, 
                markLink: "https://www.indesit.ch/it_CH" 
            }))
        }

        else if (search.includes("indesit.ch/fr") || search2.includes("indesit.ch/fr")){
            setMerk((prevState)=> ({
                ...prevState, 
                markLink: "https://www.indesit.ch/fr_CH" 
            }))
        }

        else if (search.includes("bauknecht.ch/de") || search2.includes("bauknecht.ch/de")){
            setMerk((prevState)=> ({
                ...prevState, 
                markLink: "https://www.bauknecht.ch/de_CH" 
            }))
        }

        else if (search.includes("bauknecht.ch/it") || search2.includes("bauknecht.ch/it")){
            setMerk((prevState)=> ({
                ...prevState, 
                markLink: "https://www.bauknecht.ch/it_CH" 
            }))
        }

        else if (search.includes("bauknecht.ch/fr") || search2.includes("bauknecht.ch/fr")){
            setMerk((prevState)=> ({
                ...prevState, 
                markLink: "https://www.bauknecht.ch/fr_CH" 
            }))
        }
    },[])

    return (  <div id="merk"  > 
                    <a className={styles.merk} href={merk.markLink} target="_blank">{translateMessage(messages.merk)}</a>
                </div>  
            )
}

export default Merk