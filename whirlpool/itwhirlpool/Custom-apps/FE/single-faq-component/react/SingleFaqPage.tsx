import React, { useEffect, useState } from "react";
import classnames from "classnames";
import styles from "./styles";
import { Button } from "vtex.styleguide";
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";

interface SingleFaqPage {
  props: any;
  linkBread: any;
  textBread: any;
  linkPreviousPage: any;
  textButton: any;
}

const SingleFaqPage: StorefrontFunctionComponent<SingleFaqPage> = ({
  linkBread,
  textBread,
  linkPreviousPage,
  textButton = "Torna indietro",
}) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    if (window) {
      let local = window.localStorage;
      let items = local.getItem("singlefaq");

      let list: any[] = items !== null ? JSON.parse(items) : [];
      if (list.length > 0) {
        let question = decodeURI(window.location.href
          .split("/")
          [window.location.href.split("/").length - 1].split("-")
          .join(" "));
        let elementIndex = list.findIndex((el: any) => {let q = el.question; return q.replace('?','') == question});
        if (elementIndex !== -1) {
          setQuestion(list[elementIndex].question);
          setAnswer(list[elementIndex].answer);
        }
      }
      //let params = window.location.href.split('/')[window.location.href.split('/').length - 1].split('&')
      //let quest = decodeURI(params[0].split('%2520').join(' ').split('%20').join(' '))
      //let ans = decodeURI(params[1].split('%2520').join(' ').split('%20').join(' '))

      //setQuestion(decodeURI(quest));
      //setAnswer(decodeURI(ans));
    }
  }, [window]);
  return (
    <>
      <Helmet>
        <title>{question ? `${question} | Whirlpool Italia` : null}</title>
      </Helmet>{" "}
      <div className={classnames(styles.breadcrumb)}>
        <ul className={classnames(styles.breadcrumbText)}>
          <li className={classnames(styles.breadcrumbItem)}>
            <a href="/">
              <span>Home</span>
            </a>
          </li>
          <li className={classnames(styles.breadcrumbItem)}>
            <a href={linkBread}>
              <span>{textBread}</span>
            </a>
          </li>
          <li className={classnames(styles.breadcrumbItem)}>
            <span>{question ? question : null}</span>
          </li>
        </ul>
      </div>
      {question ? (
        <div className={classnames(styles.container)}>
          <div className={classnames(styles.faqPage)}>
            <div className={classnames(styles.singleQuestion)}>{question}</div>
            <div className={classnames(styles.singleAnswer)}>
              <div dangerouslySetInnerHTML={{ __html: answer }}></div>
            </div>
            <Button
              className={classnames(styles.buttonContainer)}
              href={linkPreviousPage}
              variation="primary"
            >
              {textButton}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};

SingleFaqPage.schema = {
  title: "SingleFaqPage",
  description: "SingleFaqPage permette di stampare una specifica faq",
  type: "object",
  properties: {
    linkBread: {
      title: "Link secondo livello bread",
      type: "string",
    },
    textBread: {
      title: "Testo secondo livello bread",
      type: "string",
    },
    linkPreviousPage: {
      title: "Link pagina precedente",
      type: "string",
    },
    textButton: {
      title: "Testo per il bottone (torna indietro)",
      type: "string",
      default: "Torna indietro",
    },
  },
};

export default SingleFaqPage;
