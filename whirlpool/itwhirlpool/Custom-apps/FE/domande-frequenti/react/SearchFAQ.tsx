//@ts-nocheck
import classnames from "classnames";
import React, { useState } from "react";
import { useLazyQuery } from "react-apollo";
import { FormattedMessage } from "react-intl";
import { Button, Input } from "vtex.styleguide";
import searchFaq from "./graphql/searchFaq.graphql";
import ResultList from "./ResultList";
import styles from './styles.css';

const SearchFAQ = () => {

    const [string, setString] = useState('')
    const [arrayFAQ, setArrayFAQ] = useState([])
    const [clicked, setClicked] = useState(false)

    const [searchFaqLazyFunction, {data: searchFaqResult}] = useLazyQuery(searchFaq, {
        onCompleted: () => {
            setArrayFAQ(searchFaqResult?.searchFaq);
        }
    })

    const searchFAQByString = (string: any) => {
        setClicked(true)

        searchFaqLazyFunction({
            variables: {
                searchField: string
            }
        })

        // const options = {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // }

        // fetch(`_v/faq/search?searchField=${string}`, options)
        //     .then(res => res.json())
        //     .then(json => {
        //         setArrayFAQ(json)
        //     })

    }

    const searchFAQReset = () => {
        setClicked(false)
        setArrayFAQ([])
        setString("")
    }

    const handlePressEnter = (key: string) => {
        if (key === "Enter") searchFAQByString(string);
    }

    return (
        <>
            <div className={classnames(styles.containerSearchFAQ)}>
                <h4 className={classnames(styles.searchFAQTitle)}><FormattedMessage id={'admin-example.navigation.title-search'} /></h4>
                <div className={classnames(styles.containerSearchBareButton)}>
                    <div className={classnames(styles.searchBar)}>
                        <Input
                            className={classnames(styles.titleSearchFAQ)}
                            value={string}
                            placeholder={"Scrivi qui la tua richiesta - Max 100 caratteri"}
                            maxLength={100}
                            onChange={(e: any) => setString(e.target.value)}
                            onKeyPress={(e: React.KeyboardEvent) => handlePressEnter(e.key)}
                        />
                        <Button
                            variation="primary"
                            onClick={() => searchFAQByString(string)}
                        >
                            <FormattedMessage id={'admin-example.navigation.search'} />
                        </Button>
                    </div>
                    <div className={classnames(styles.resetButton)}>
                        <Button
                            variation="danger"
                            onClick={() => searchFAQReset()}
                        >
                            <FormattedMessage id={'admin-example.navigation.reset'} />
                        </Button>
                    </div>
                </div>
            </div>
            <div className={classnames(styles.container)}>
                {clicked == true &&
                    <ResultList
                        arrayFAQ={arrayFAQ}
                    ></ResultList>
                }
            </div>
        </>
    );
};

SearchFAQ.schema = {
    title: "editor.SearchFAQ.title",
    description: "editor.SearchFAQ.description",
    type: "object",
    properties: {
    },
};

export default SearchFAQ;
