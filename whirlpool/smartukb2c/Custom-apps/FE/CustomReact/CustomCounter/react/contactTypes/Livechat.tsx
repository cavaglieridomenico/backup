import React from "react";
import styles from "../styles.css";
import LiveChat from "../Icons/LiveChat";
 //@ts-ignore
const Livechat = (props: any) => {
   
    let type = props.type;
    let topic =props.titleSecondMenu;
    let reason = props.titleThirdMenu
    const setDataLayer = (topic:any, reason:any, type:any) => {
         //@ts-ignore
        window.dataLayer = window.dataLayer || [];
         //@ts-ignore
        window.dataLayer.push({
          'event': 'talkToUs',
          'eventCategory': 'Talk To Us',
          'eventAction': `${topic} - ${reason}`,
          'eventLabel': type
         });
         console.log(topic)
         console.log(reason)
         console.log(type)  
            //@ts-ignore
         window.selectchat()
    }
    return(
        <div className={styles.contactUsBlockType}>
            <div className={styles.contactUsBlockTypeTitle}><LiveChat /> {type.title}</div>
            <p className={styles.contactUsBlockTypeParagraph}>{type.description}</p>
            <p className={styles.contactUsBlockTypeParagraph}>{type.time}</p>
    
            <b className={styles.contactUsBlockTypeButton} onClick={() => 
                setDataLayer(topic, reason,type.link)
                }>{type.link}</b>
        </div>
    )
}

export default Livechat;