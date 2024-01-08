//@ts-nocheck
import classNames from "classnames";
import React, { Fragment, useState } from "react";
import { useQuery } from "react-apollo";
import { FormattedMessage } from "react-intl";
import { useDevice } from 'vtex.device-detector';
import { Link } from 'vtex.render-runtime';
import getMostAskedFaqs from "./graphql/getMostAskedFaqs.graphql";
import styles from './styles.css';

const DomandePiuFrequenti = () => {

    const [mostFrequentFAQ, setMostFrequentFAQ]: any = useState()

    const { isMobile } = useDevice()

    const handleButtonClick = (index: any) => {
        let openFaq = [...mostFrequentFAQ];
        openFaq[index].isOpen = !openFaq[index].isOpen;
        setMostFrequentFAQ(openFaq);
    }

    const {data: mostAskedFaqs, loading: mostAskedFaqsLoading} = useQuery(getMostAskedFaqs, {
        onCompleted: () => {
            const result = mostAskedFaqs?.getMostAskedFaqs;
            result.map((faq: any) => faq.isOpen = false);
            setMostFrequentFAQ(result);
        }
    })

    // useEffect(() => {
    //     const url = `/_v/faq/most-asked-questions`
    //     const options = {
    //         method: 'GET',
    //         headers: { 'Content-Type': 'application/json' },
    //     }
    //     try {
    //         fetch(url, options)
    //             .then(res => res.json())
    //             .then(json => {
    //                 let freqQuestion = [...json];
    //                 freqQuestion.map(( sfaq :any)=>{
    //                     return sfaq.isOpen= false;
    //                 })
    //                 setMostFrequentFAQ(freqQuestion)
    //             })
    //     } catch (error) {
    //     }
    // }, [])

    if (!mostFrequentFAQ || mostAskedFaqsLoading) {
        return (
            <div className={classNames(styles.loaderForm)}></div>
        )
    }

    return (
        <>
            {mostFrequentFAQ && mostFrequentFAQ.length > 0 &&
                <>
                    <h3 className={classNames(styles.FAQMoreFrequentTitle)}><FormattedMessage id="domande-frequenti.domande-piu-frequenti" /></h3>
                    <div className={classNames(styles.mostFrequentContainer)}>
                        <div className={classNames(styles.firstCol)}>
                            {mostFrequentFAQ?.map((faq: any, index: number) =>
                                <Fragment key={index}>
                                    {index < mostFrequentFAQ?.length / 2 ?
                                        <div className={mostFrequentFAQ[index].isOpen ? classNames(styles.mostFrequentSingleContainerOpen) : classNames(styles.mostFrequentSingleContainer)}>
                                            <div className={classNames(styles.questionMostFrequent)}>
                                                <p className={classNames(styles.spanQuestion)}>
                                                    <span className={classNames(styles.span)}>{faq.question}</span>
                                                    <button
                                                        className={classNames(styles.buttonDetailQuestion)}
                                                        onClick={() => { handleButtonClick(index) }}>
                                                        {!isMobile ? mostFrequentFAQ[index].isOpen ? '-' : '+' :
                                                             mostFrequentFAQ[index].isOpen ? '-' : '+' }
                                                    </button>
                                                </p>
                                            </div>
                                            {mostFrequentFAQ[index].isOpen  ?
                                                <div className={classNames(styles.answerMostFrequent)}>
                                                    <p>{faq.answer.substring(0, 122)}...</p>
                                                    <Link
                                                        page={'store.custom#single-faq'}
                                                        params={{
                                                            slug: faq.url,
                                                            metaTitle: faq.metaTitle,
                                                            metaDescription: faq.metaDescription,
                                                            // categoryName: faq.categoryName,
                                                            // categoryId: faq.category,
                                                        }}
                                                        className={classNames(styles.readCompleteAnswer)}
                                                    >
                                                        Leggi di più
                                                    </Link>
                                                </div> : null}
                                        </div> : null}
                                </Fragment>
                            )}
                        </div>
                        <div className={classNames(styles.secondCol)}>
                            {mostFrequentFAQ?.map((faq: any, index: number) =>
                                <Fragment key={index}>
                                    {index >= mostFrequentFAQ?.length / 2 ?
                                        <div className={mostFrequentFAQ[index].isOpen  ? classNames(styles.mostFrequentSingleContainerOpen) : classNames(styles.mostFrequentSingleContainer)}>
                                            <div className={classNames(styles.questionMostFrequent)}>
                                                <p className={classNames(styles.spanQuestion)}>
                                                    <span className={classNames(styles.span)}>{faq.question}</span>
                                                    <button
                                                        className={classNames(styles.buttonDetailQuestion)}
                                                        onClick={() => { handleButtonClick(index) }}>
                                                        {!isMobile ? mostFrequentFAQ[index].isOpen ? '-' : '+' :
                                                             mostFrequentFAQ[index].isOpen ? '-' : '+' }
                                                    </button>
                                                </p>
                                            </div>
                                            {mostFrequentFAQ[index].isOpen  ?
                                                <div className={classNames(styles.answerMostFrequent)}>
                                                    <p>{faq.answer.substring(0, 122)}...</p>
                                                    <Link
                                                        page={'store.custom#single-faq'}
                                                        params={{
                                                            slug: faq.url,
                                                            metaTitle: faq.metaTitle,
                                                            metaDescription: faq.metaDescription,
                                                            categoryName: faq.categoryName,
                                                            categoryId: faq.category,
                                                        }}
                                                        className={classNames(styles.readCompleteAnswer)}
                                                    >
                                                        Leggi di più
                                                    </Link>
                                                </div> : null}
                                        </div> : null}
                                </Fragment>
                            )}
                        </div>
                    </div>
                </>
            }
        </>
    );
};

DomandePiuFrequenti.schema = {
    title: "editor.DomandePiuFrequenti.title",
    description: "editor.DomandePiuFrequenti.description",
    type: "object",
    properties: {
    },
};

export default DomandePiuFrequenti;
