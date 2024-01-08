//@ts-ignore
import React, { Dispatch, SetStateAction, useState } from "react";
//@ts-ignore
import { index as RichText } from "vtex.rich-text";
//@ts-ignore
import { Collapsible } from "vtex.styleguide";
import "./styles.global.css";
import { plusSvg, minusSvg } from "./vectors/vectors";
import { useCssHandles } from "vtex.css-handles";

interface FaqProps {
  faq: FAQ[];
}

interface FAQ {
  Question: string;
  Answer: string;
}
const CSS_HANDLES = [
  "faqWrapper",
  "faqContainer",
  "QuestionTextOpen",
  "QuestionText",
  "AnswerText",
  "caretIconContainer",
  "caretIcon",
] as const;

const Faq: StorefrontFunctionComponent<FaqProps> = ({ faq = [] }) => {
  const handles = useCssHandles(CSS_HANDLES);
  const [isOpen, setIsOpen]: [
    number | undefined,
    Dispatch<SetStateAction<number | undefined>>
  ] = useState();

  const plus: any = Buffer.from(plusSvg).toString("base64");
  const minus: any = Buffer.from(minusSvg).toString("base64");

  return (
    <div className={handles.faqWrapper}>
      {faq.map((singleFaq: FAQ, index: number) => (
        <div className={handles.faqContainer} key={`faq${index}`}>
          <Collapsible
            header={
              <span
                className={
                  index == isOpen
                    ? handles.QuestionTextOpen
                    : handles.QuestionText
                }
              >
                <RichText text={singleFaq.Question} />
                <div className={handles.caretIconContainer}>
                  <img
                    src={
                      index != isOpen
                        ? `data:image/svg+xml;base64,${plus}`
                        : `data:image/svg+xml;base64,${minus}`
                    }
                    className={handles.caretIcon}
                  />
                </div>
              </span>
            }
            onClick={() => {
              setIsOpen(index == isOpen ? undefined : index);
            }}
            isOpen={index == isOpen}
            caretColor="#292929"
            align="right"
          >
            <span className={handles.AnswerText}>
              <RichText text={singleFaq.Answer} />
            </span>
          </Collapsible>
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
