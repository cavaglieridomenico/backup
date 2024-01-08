import classnames from "classnames";
import React, { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "react-apollo";
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";
import { Button } from "vtex.styleguide";
import getFaqById from "./graphql/getFaqById.graphql";
import getFaqByUrl from "./graphql/getFaqByUrl.graphql";
import getFaqGroups from "./graphql/getFaqGroups.graphql";
import styles from "./styles";

export interface SingleQuestionProps {
  params: any;
}
const SingleQuestion = (
  props: SingleQuestionProps
) => {
  const slug = props.params.slug;
  const metaTitle = props.params.metaTitle
  const metaDescription = props.params.metaDescription
  // const isTagSetted = props.params.isTagSetted
  // const categoryId = props.params.categoryId
  // const categoryName = props.params.categoryName

  const {
    data: singolaFAQ,
    loading: singolaFAQLoading
  } = useQuery(getFaqByUrl, {
    variables: {
      url: slug
    },
    onCompleted: () => {
      getGroups({variables: {
        FatherCategory: singleQuestion?.category
      }});
      if (singleQuestion?.associatedFaqs?.length > 0) {
        getFirstAssociated({variables: {
          id: singleQuestion?.associatedFaqs?.length > 0 && singleQuestion?.associatedFaqs[0]
        }})
        getSecondAssociated({variables: {
          id: singleQuestion?.associatedFaqs?.length > 1 && singleQuestion?.associatedFaqs[1]
        }})
      }
    }
  })

  const [getGroups, {data: groupsFAQ}] = useLazyQuery(getFaqGroups);
  const [getFirstAssociated, {data: firstAssociatedFAQ}] = useLazyQuery(getFaqById);
  const [getSecondAssociated, {data: secondAssociatedFAQ}] = useLazyQuery(getFaqById);
  
  const [associatedFaqs, setAssociatedFaqs] = useState<any>([]);

  const singleQuestion = singolaFAQ?.getFaqByUrl[0]

  // useEffect(() => {
  //   if (singleQuestion) {
  //     getGroups({variables: {
  //       FatherCategory: singleQuestion?.category
  //     }})
  //     if (singleQuestion?.associatedFaqs?.length > 0) {
  //       getFirstAssociated({variables: {
  //         id: singleQuestion?.associatedFaqs?.length > 0 && singleQuestion?.associatedFaqs[0]
  //       }})
  //       getSecondAssociated({variables: {
  //         id: singleQuestion?.associatedFaqs?.length > 1 && singleQuestion?.associatedFaqs[1]
  //       }})
  //     }
  //   }
  // }, [singleQuestion])

  const groupsQuestion = groupsFAQ?.getFaqGroups
  const firstAssociated = firstAssociatedFAQ?.getFaqById
  const secondAssociated = secondAssociatedFAQ?.getFaqById

  useEffect(() => {
    if (firstAssociated) {
      const [firstDestructured] = firstAssociated;
      setAssociatedFaqs((prev: any) => [...prev, firstDestructured])
    }
  }, [firstAssociated])

  useEffect(() => {
    if (secondAssociated) {
      const [secondDestructured] = secondAssociated;
      setAssociatedFaqs((prev: any) => [...prev, secondDestructured]);
    }
  }, [secondAssociated])

  let breadcrumbName;
  let categoryName: string | undefined;

  if (singleQuestion?.categoryName.toLowerCase().includes("utilizzo")) {
    breadcrumbName = "Utilizzo Del Sito"
    categoryName = "supporto"
  } else if (singleQuestion?.categoryName.toLowerCase().includes("prodotti")) {
    breadcrumbName = singleQuestion?.categoryName
    categoryName = "prodotto"
  } else if (singleQuestion?.categoryName.toLowerCase().includes("spedizioni")) {
    breadcrumbName = singleQuestion?.categoryName
    categoryName = "spedizione"
  }


  // const handleBackClick = () => {
  //   if (isTagSetted == "true") {
  //     history.go(-2)
  //   } else {
  //     history.go(-1)
  //   }
  // }

  if (singolaFAQLoading) {
    return (
      <div className={classnames(styles.loaderForm)}></div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{`${metaTitle ? metaTitle : singleQuestion?.metaTitle} - Whirlpool`}</title>
        <meta name="description" content={`${metaDescription ? metaDescription : singleQuestion?.metaDescription} - Fai clic qui per scoprire tutte le domande relative a ${singleQuestion?.categoryName} Whirlpool`} data-react-helmet="true" />
      </Helmet>
      {" "}
      <div className={classnames(styles.breadcrumb)}>
        <ul className={classnames(styles.breadcrumbText)}>
          <li className={classnames(styles.breadcrumbItem)}>
            <a href="/">
              <span>Home</span>
            </a>
          </li>
          <li className={classnames(styles.breadcrumbItem)}>
            <a href="/faq">
              <span>Domande Frequenti</span>
            </a>
          </li>
          <li className={classnames(styles.breadcrumbItem)}>
            <a href={`/faq/categoria/${categoryName}`}>
              <span>{breadcrumbName.replace(/%20/g, " ")}</span>
            </a>
          </li>
          <li className={classnames(styles.breadcrumbItem)}>
            <a href={`/faq/categoria/${categoryName}#${singleQuestion?.group}`}>
              <span>{singleQuestion?.groupName}</span>
            </a>
          </li>
          <li className={classnames(styles.breadcrumbItem)}>
            <span>{singleQuestion?.question}</span>
          </li>
        </ul>
      </div>
      {singleQuestion && groupsQuestion ? (
        <div className={classnames(styles.groupContainer)}>
          <div className={classnames(styles.otherGroups)}></div>
          <div className={classnames(styles.faqPage)}>
            <h1 className={classnames(styles.singleQuestion)}>
              {singleQuestion?.question}
            </h1>
            <div className={classnames(styles.singleAnswer)}>
              <div
                dangerouslySetInnerHTML={{ __html: singleQuestion?.answer }} >
              </div>
            </div>
            <div className={classnames(styles.buttonContainer)}>
              <Button
                href={`/faq/categoria/${categoryName}#${singleQuestion?.group}`}
                // onClick={() => handleBackClick()}
                variation="primary"
              >
                Torna a {singleQuestion?.groupName}
              </Button>
              <Button
                href={"/faq"}
                // onClick={() => handleBackClick()}
                variation="primary"
              >
                Torna alla pagina principale
              </Button>
            </div>
            {groupsQuestion?.length > 0 && (
              <div className={classnames(styles.filterWrapper, styles.borderWrapper)}>
                <ul>
                  {groupsQuestion?.map((group: any) => (
                    <li key={group?.id}>
                      <a className={classnames(styles.otherFaqsLink)} href={`/faq/categoria/${categoryName}#${group?.id}`}>
                        <span className={classnames(styles.filter, styles.noBackground)}>
                          <img alt={`${group?.groupName} image`} className={classnames(styles.imageGroups)} src={group?.image}></img>
                          {group?.name}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className={classnames(styles.otherFaqs)}>
            {singleQuestion?.associatedFaqs?.length > 0 && (
            <>
              <h2 className={classnames(styles.otherFaqsTitle)}>Altre FAQ</h2>
              <ul className={classnames(styles.otherFaqsList)}>
                {associatedFaqs?.map((question: any) => (
                  <li className={classnames(styles.otherFaqsListItem)} key={question?.id}>
                    <a className={classnames(styles.otherFaqsLink)} href={`/faq/${question?.url}`}>{question?.question}</a>
                  </li>
                ))}
              </ul>
            </>
            )}
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
