import React from "react";
import styles from "../styles.css";
import WhatsappGreen from "../Icons/WhatsappGreen";
import WhatsappWhite from "../Icons/WhatsappWhite";

const Whatsapp = (props: any) => {
    let type = props.type;
    const link = type.linkToFollow;
    let topic =props.titleSecondMenu;
    let reason = props.titleThirdMenu;
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
   }

    return (
        <div className={styles.contactUsBlockType}>
            <div className={styles.contactUsBlockTypeTitle}><WhatsappGreen /><span className={styles.contactUsTypeTextIcon}>{type.title}</span></div>
            <p className={styles.contactUsBlockTypeParagraph}>{type.description}</p>
            <a target="_blank" href={link} onClick={() => setDataLayer(topic, reason,type.link)}><b className={styles.contactUsBlockTypeButton}><WhatsappWhite /><span className={styles.contactUsTypeTextIcon}>{type.link}</span></b></a>
            <p className={styles.contactUsBlockTypeParagraph}>{type.schedule.title}</p>
            {type.schedule.items.map((i:any) =>
                <p key={i} className={styles.contactUsBlockTypeParagraphItems}>{i}</p>
            )}

        </div>
    )
}

export default Whatsapp;