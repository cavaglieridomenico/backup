import React, { useEffect } from "react";
import { Link } from "vtex.render-runtime";
import classnames from "classnames";
import styles from "./styles";

interface SingleFaqQuestionProps {
  title: string;
  subtitle: string;
  pageToReferr: string;
  isTruncated: boolean;
}

interface WrapperType {
  children: React.ReactElement;
  title: string;
  pageToReferr: string;
  isTruncated: boolean;
}

const SingleFaqQuestionWrapper = ({
  isTruncated,
  pageToReferr,
  title,
  children,
}: WrapperType) => {
  return !isTruncated ? (
    <React.Fragment>{children}</React.Fragment>
  ) : (
    <Link
      page={pageToReferr}
      params={{
        question: title
          .split(" ")
          .join("-")
          .replace("?", ""),
      }}
    >
      {" "}
      {children}{" "}
    </Link>
  );
};

const SingleFaqQuestion: StorefrontFunctionComponent<
  SingleFaqQuestionProps
> = ({
  title,
  subtitle,
  pageToReferr = "store.custom#customfaq",
  isTruncated = false,
}) => {
  useEffect(() => {
    if (window) {
      let local = window.localStorage;
      let items = local.getItem("singlefaq");
      let list: any[] = items !== null ? JSON.parse(items) : [];
      if (
        (list.length > 0 &&
          list.filter((faq: any) => faq.question == title).length == 0) ||
        list.length == 0
      ) {
        list.push({ question: title, answer: subtitle });
      }
      local.setItem("singlefaq", JSON.stringify(list));
    }
  }, [window]);

  return (
    <div className={classnames(styles.domandaContainer, "w100", !isTruncated && styles.isNotTruncated)}>
      <SingleFaqQuestionWrapper
        isTruncated={isTruncated}
        pageToReferr={pageToReferr}
        title={title}
      >
        <React.Fragment>
          <div>
            <div className={classnames(styles.question)}>{title}</div>
            <div className={classnames(styles.shortAnswer)}>
              <div
                dangerouslySetInnerHTML={{
                  __html: isTruncated
                    ? subtitle.substring(0, 100) + "..."
                    : subtitle,
                }}
              ></div>
            </div>
          </div>
          {isTruncated && (
            <a className={classnames(styles.readMore)}>Leggi di più</a>
          )}
        </React.Fragment>
      </SingleFaqQuestionWrapper>
    </div>
  );
};

SingleFaqQuestion.schema = {
  title: "SingleFaqQuestion",
  description:
    "SingleFaqQuestion permette di stampare una specifica faq in modalità tabellare",
  type: "object",
  properties: {
    title: {
      title: "Domanda",
      type: "string",
    },
    subtitle: {
      title: "Risposta",
      type: "string",
    },
    isTruncated: {
      title: "Mostrare leggi di più",
      type: "boolean"
    }
  },
};

export default SingleFaqQuestion;
