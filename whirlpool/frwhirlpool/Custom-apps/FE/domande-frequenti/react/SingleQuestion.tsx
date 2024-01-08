import React, { useEffect, useState } from "react";
import classnames from "classnames";
import styles from "./styles";
import { Button } from "vtex.styleguide";
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";


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
const SingleQuestion = (
  props: SingleQuestionProps
) => {
  const [singleQuestion, setsingleQuestion] = useState<Item>();
  const slug = props.params.slug;

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
        <title>{ singleQuestion ? `${singleQuestion.question} | Whirlpool France` : null }</title>
      </Helmet>
      {" "}
      <div className={classnames(styles.breadcrumb)}>
        <ul className={classnames(styles.breadcrumbText)}>
          <li className={classnames(styles.breadcrumbItem)}>
            <a href="/">
              <span>Accueil</span>
            </a>
          </li>
          <li className={classnames(styles.breadcrumbItem)}>
            <a href="/faq">
              <span>faq</span>
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
            <Button
              className={classnames(styles.buttonContainer)}
              href="/faq"
              variation="primary"
            >
              Retour a la liste
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
