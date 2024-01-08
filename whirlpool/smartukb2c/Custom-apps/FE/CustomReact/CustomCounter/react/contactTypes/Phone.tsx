import React from "react";
import styles from "../styles.css";
import PhoneContactUs from "../Icons/PhoneContactUs";

const Phone = (props: any) => {
    let type: any = props.type;
    const telephoneNumber = type.numberToCall;
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
    return(
        <div className={styles.contactUsBlockType}>
            <div className={styles.contactUsBlockTypeTitle}><PhoneContactUs /><span className={styles.contactUsTypeTextIcon}>{type.title}</span></div>
            <p className={styles.contactUsBlockTypeParagraphPhoneNumber}><a className="contactUsLink" onClick={() => setDataLayer(topic, reason,type.title)} href={"tel:" + telephoneNumber}>{type.telephoneNumber}</a></p>
            <p className={styles.contactUsBlockTypeParagraphBold}>{type.time}</p>
            <p className={styles.contactUsBlockTypeParagraph}>{type.description}</p>
            {type.schedule.map((i:any) =>
                <p key={i} className={styles.contactUsBlockTypeParagraphItems}>{i}</p>
            )}
        </div>
    )
}

export default Phone;