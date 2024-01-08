import React, { Dispatch, SetStateAction, useState } from "react";
import style from "./style.css";
import { index as RichText } from "vtex.rich-text";
import { Collapsible } from "vtex.styleguide";
import "./styles.global.css";
import { plusSvg, minusSvg } from "./vectors/vectors";

interface FaqProps {
  faq: FAQ[];
}

interface FAQ {
  Question: string;
  Answer: string;
}

const Faq: StorefrontFunctionComponent<FaqProps> = ({ faq = [] }) => {
  console.log(faq, "faq");
  const [isOpen, setIsOpen]: [
    number | undefined,
    Dispatch<SetStateAction<number | undefined>>
  ] = useState();

  const plus: any = Buffer.from(plusSvg).toString("base64");
  const minus: any = Buffer.from(minusSvg).toString("base64");

  return (
    <div className={style.faqWrapper}>
      {faq.map((singleFaq: FAQ, index: number) => (
        <div className={style.faqContainer}>
          <Collapsible
            header={
              <span className={style.QuestionText}>
                <RichText text={singleFaq.Question} />
              </span>
            }
            onClick={() => {
              setIsOpen(index == isOpen ? undefined : index);
            }}
            isOpen={index == isOpen}
            caretColor="#fdc100"
            align="right"
          >
            <span className={style.AnswerText}>
              <RichText text={singleFaq.Answer} />
            </span>
          </Collapsible>
          <div
            className={style.caretIconContainer}
            onClick={() => {
              setIsOpen(index == isOpen ? undefined : index);
            }}
          >
            <img
              src={
                index != isOpen
                  ? `data:image/svg+xml;base64,${plus}`
                  : `data:image/svg+xml;base64,${minus}`
              }
              className={style.caretIcon}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

Faq.schema = {
  title: "Faq Items",
  description: "Here you can set the faq questions and answers",
  type: "object",
  properties: {
    faq: {
      type: "array",
      title: "Faq",
      items: {
        properties: {
          Question: {
            title: "Question",
            type: "string",
          },
          Answer: {
            title: "Answer",
            type: "string",
          },
        },
      },
    },
  },
};

export default Faq;
