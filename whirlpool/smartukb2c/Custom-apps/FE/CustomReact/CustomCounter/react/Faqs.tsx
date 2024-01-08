
import React, { useState, useEffect } from 'react';
import styles from "./styles.css";

interface Faqs { }

const Faqs: StorefrontFunctionComponent<Faqs> = ({ }) => {

  const [faqs, setFaqs] = useState([
    {
      "title": "Who can I contact for assistance?",
      "content": "We can be contacted by phone, Live Chat or email to assist you with any queries you may have. Our contact details and opening times can be found in the ‘Contact’ tab at the bottom of this page.",
      "visible": false
    },
    {
      "title": "What if I need to return a part?",
      "content": "If you need to return a part you can find all of the details on how to do so in our returns policy located at the bottom of this page.",
      "visible": false
    },
    {
      "title": "How can I obtain a new instruction manual?",
      "content": "You can download a new instruction manual directly from our website, simply enter your model number on the home page and a link to download your manual will appear in the blue bar near the top of the page.",
      "visible": false
    },
    {
      "title": "What happens if I order a product that is out of stock?",
      "content": "You can only order parts that are currently in stock, if a part is out of stock simply follow the steps to request for contact to be made once the part becomes available.",
      "visible": false
    },
    {
      "title": "Can I amend or cancel my order?",
      "content": "You can find details about cancelling and amending orders in our returns policy which can be found at the bottom of this page.",
      "visible": false
    },
    {
      "title": "I have seen a part that I want, can I collect it from anywhere?",
      "content": "We do not currently offer a collection service, details will be updated once this option becomes available.",
      "visible": false
    },
    {
      "title": "Do I have a postcode with a longer delivery time?",
      "content": "The following postcodes take one day longer for delivery. This means, next day delivery takes 2 working days and standard delivery takes 4-6 working days.",
      "visible": false
    }
  ])

  const [postalCodes, setPostalCodes] = useState([
    {
      "title": "Postalcodes A-J",
      "content": ["BT", "GY", "IM"],
      "visible": false
    },
    {
      "title": "Postalcodes K-Z",
      "content": ["JE", "KA4, KA6, KA16-19, KA27-28", "KW1-17", "ML8-12", "PA20-49, PA60-78", "PH1-13, PH15-26, PH30-44, PH49-50", "SY15-25", "TD2-14", "TR21-25", "ZE1,2,3"],
      "visible": false
    }
  ])

  const [brand, setBrand] = useState("");


  useEffect(() => {
    let url = window && window.location ? window.location.href : "";
    if (url) {
      setBrand(url.includes("indesit") ? "indesit" : "hotpoint");
    }
  }, [])


  const setVisibility = (pos: any) => {
    let new_list: any = [...faqs];
    new_list.filter((faq: any, index: any) => {
      if (index != pos) {
        faq.visible = false;
      } else {
        faq.visible = !faq.visible;
      }
    });
    setFaqs(new_list);

    new_list = [...postalCodes];
    new_list.filter((faq: any, index: any) => {
      if (index != pos) {
        faq.visible = false;
      } else {
        faq.visible = !faq.visible;
      }
    });
    setPostalCodes(new_list);
  }

  const setVisibilityPostalCodes = (pos: any) => {
    let new_list = [...postalCodes];
    new_list.filter((faq, index) => {
      if (index != pos) {
        faq.visible = false;
      } else {
        faq.visible = !faq.visible;
      }
    });

    setPostalCodes(new_list);
  }

  //@ts-ignore
  return (<div className={[styles.Faqs, styles[`Faqs_${brand}`]].join(" ")}>

  <h1 className={styles.titleFaq}>Frequently Asked Question</h1>
    {faqs.map((faq, index) => {
      return <div className={(index === faqs.length -1 ? styles.accordionSectionLast : styles.accordionSection)}>
        <b className={(faq.visible === true ? styles.accordionTriggerVisible : styles.accordionTrigger)} onClick={() => { setVisibility(index) }}>{faq.title}</b>
        {faq.visible && (
          <p className={styles.accordionText}>
            {faq.content}
            {index === faqs.length - 1 && (
              <div className={styles.seventhFaq}>
                <div className={styles.columnSeventhFaq}>
                  {postalCodes.map((faq, index) => {
                    return <div className={styles.secondAccordionSection}>
                      <b className={(faq.visible=== true ? styles.secondAccordionTriggerVisible : styles.secondAccordionTrigger)} onClick={() => { setVisibilityPostalCodes(index) }}>{faq.title}</b>
                      {faq.visible && (
                        <div className={styles.accordionTextPostalcodes}>
                          {faq.content.map((p) => {
                            return <div>
                              <p>{p}</p>
                            </div>
                          })}
                        </div>
                      )}
                    </div>
                  })}
                </div>
                <div className={styles.columnSeventhFaq}>
                  <div>
                    {(brand === "hotpoint") ? <img className={styles.imageAccordionFaq} src="arquivos/uk-map-hotpoint.png" alt="" /> : <img className={styles.imageAccordionFaq} src="arquivos/uk-map-indesit.png" alt="" />}                  
                  </div>
                </div>
              </div>
            )}
          </p>
        )}

      </div>
    })}

  </div>


  )


}

export default Faqs