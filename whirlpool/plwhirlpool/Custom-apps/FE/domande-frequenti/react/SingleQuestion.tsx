import React, { useEffect, useState } from "react";
import classnames from "classnames";
import {useIntl,defineMessages} from 'react-intl'

// import { useRuntime } from 'vtex.render-runtime'
// import { useCssHandles } from 'vtex.css-handles'
import styles from "./styles";
import { Button } from "vtex.styleguide";
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";
// import styles from './styles.css'
// const styles = require('./styles')

interface Item {
  questionGroup: string;
  question: string;
  answer: string;
  pageUrl: string;
  id: string;
  __html:HTMLElement
}
export interface SingleQuestionProps {
  params: any;
}
const messages = defineMessages({
  home: { id: 'store/faq.home' },
  faq: { id: 'store/faq.title' },
  backToList: { id: 'store/faq.backToList' },
})

const SingleQuestion = (
  props: SingleQuestionProps
) => {
  const [singleQuestion, setsingleQuestion] = useState<Item>();
  const slug = props.params.slug;
  const intl = useIntl()

  useEffect(() => {
    fetch(
      `/api/dataentities/QA/search?_fields=questionGroup,question,answer,pageUrl,id&_where=pageUrl=${slug}`,
      {
        headers: {
          'method': 'GET',
          'scheme': 'https',
          'accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'content-Type': 'application/json',
          'REST-Range': 'resources=0-1000'
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.length) {
          setsingleQuestion(json[0]);
        }
      });
  }, []);
  return (
    <>
     <Helmet>
        <title>{ singleQuestion ? `${singleQuestion.question} | Whirlpool Italia` : null }</title>
      </Helmet>
      {" "}
      <div className={classnames(styles.breadcrumb)}>
        <ul className={classnames(styles.breadcrumbText)}>
          <li className={classnames(styles.breadcrumbItem)}>
            <a href="/">
              <span>{intl.formatMessage(messages.home)}</span>
            </a>
          </li>
          <li className={classnames(styles.breadcrumbItem)}>
            <a href="/faq">
              <span>{intl.formatMessage(messages.faq)}</span>
            </a>
          </li>
          <li className={classnames(styles.breadcrumbItem)}>
            <span>{singleQuestion ? singleQuestion.question : null}</span>
          </li>
        </ul>
      </div>
      {singleQuestion ? (
        <div className={classnames(styles.container)}>
          <div className={classnames(styles.faqPage)}>
            <div className={classnames(styles.singleQuestion)}>
              {singleQuestion.question}
            </div>
            <div className={classnames(styles.singleAnswer)}>
              <div
              dangerouslySetInnerHTML={{__html: singleQuestion.answer}} >
                </div>
            </div>

            {/* <div className={classnames(styles.buttonContainer)}>
              <div className={classnames(styles.buttonText)}>
                <a
                  className={classnames(styles.singleAnswer)}
                  target="_self"
                  href="/faq"
                >
                  <div className={classnames(styles.singleAnswer)}>
                    <span>Torna alla lista</span>
                  </div>
                </a>
              </div>
            </div> */}
            <Button
              className={classnames(styles.buttonContainer)}
              href="/faq"
              variation="primary"
            >
              {intl.formatMessage(messages.backToList)}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
};

SingleQuestion.schema = {
  title: "editor.singleQuestion.title",
  description: "editor.singleQuestion.description",
  type: "object",
  properties: {
  },
};

export default SingleQuestion;
