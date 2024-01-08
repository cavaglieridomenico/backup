import React from "react";
import styles from "../styles.css";
import Computer from "../Icons/Computer";
import Manual from "../Icons/Manual";
import Youtube from "../Icons/Youtube";

const ContactLink = (props: any) => {
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
   }

    const selectIcon = (icon: any) => {
        switch (icon) {
            default: return "";
            break;
            case "Computer" : return <Computer />
            break;
            case "Manual" : return <Manual />
            break;
            case "Youtube" : return <Youtube />
            break;
            case "Placeholder" : return ""
            break;
        }
    }


    return (

        <div className={styles.contactUsBlockType}>
            <div className={styles.contactUsBlockTypeTitle}>{selectIcon(type.icon)}<span className={styles.contactUsTypeTextIcon}>{type.title}</span></div>
            <p className={styles.contactUsBlockTypeParagraph}>{type.description}</p>
            <a onClick={() => {setDataLayer(topic, reason,type.link)}} href={link} target="_blank" ><b className={styles.contactUsBlockTypeButton}>{type.link}</b></a>
        </div>
    )
}

export default ContactLink;