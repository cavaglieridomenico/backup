//@ts-nocheck
import classnames from "classnames";
import React, { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from 'vtex.render-runtime';
import styles from './styles.css';

interface SearchFAQProps {
    arrayFAQ: any[];
}

const ResultList: FC<SearchFAQProps> = ({ arrayFAQ }) => {

    return (
        <>
            {arrayFAQ?.length == 0 &&  <h4 className={classnames(styles.noResult)}><FormattedMessage id={'admin-example.navigation.no-result'} /></h4>}
            {arrayFAQ?.map((faq: any, index: number) => (
                <div key={index} className={classnames(styles.domandaContainer, 'w100')}>
                     <Link
                        page={'store.custom#single-faq'}
                        params={{
                          slug: faq.url,
                          metaTitle: faq.metaTitle,
                          metaDescription: faq.metaDescription,
                          // categoryName: faq.categoryName,
                          // categoryId: faq.category,
                        }}
                        className={classnames(styles.textDecoration)}
                      >
                        <div>
                          <div className={classnames(styles.question)}>
                            {faq.question}
                          </div>
                          <div className={classnames(styles.shortAnswer)}>
                            {faq.answer.substring(0, 122)}...
                          </div>
                        </div>
                        <a className={classnames(styles.readMore)}>Leggi di più</a>
                      </Link>
                </div>
            ))}
        </>
    );
};

export default ResultList;
