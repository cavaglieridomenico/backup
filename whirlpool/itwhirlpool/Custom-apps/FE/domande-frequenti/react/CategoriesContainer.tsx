//@ts-nocheck
import classnames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Link } from 'vtex.render-runtime';
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";
import { Button } from "vtex.styleguide";
import { FAQContextProvider, useFAQ } from "./context/context";
import DomandePiuFrequenti from './DomandePiuFrequenti';
import getGroupsWithItsFaqs from "./graphql/getGroupsWithItsFaqs.graphql";
import QueryExecuter from './QueryExecuter';
import SearchFAQ from './SearchFAQ';
import styles from './styles.css';

interface DomandeFrequentiProps {
}
interface Category {
  id: string
  image: string
  metaDescription: string
  metaTitle: string
  name: string
  url: string
  groups: Group[]
}

type Group = {
  groupId: string,
  groupImageAlt: string | null,
  groupName: string,
  image: string
}

const DomandeFrequenti: StorefrontFunctionComponent<DomandeFrequentiProps> = () => {

  const { categories, categoriesError, categoriesLoading } = useFAQ()

  useEffect(() => {
    if (categoriesError) {
      console.error("Categories query went wrong", categoriesError)
    }
  }, [categoriesError])

  //Filter Category management
  // const filterByCategory = (categoryId: string) => {
  //   setSelectedCategoryFilter(categoryId)
  //   getFaqsByCategory(categoryId)
  // }

  const categoriesSortFunction = (a, b) => {
    if (a.url === "prodotto") return -1;
    if (a.url === "supporto") {
      if (b.url === "spedizione") return -1;
      return 1;
    }
    return 1;
  }

  return <>
    <Helmet>
        <title>DOMANDE FREQUENTI - Whirlpool</title>
        <meta name="description" content="Hai delle domande sugli elettrodomestici Whirlpool? Nella nostra sezione FAQ troverai le risposte a tutte le tue domande." data-react-helmet="true" />
    </Helmet>
    <SearchFAQ></SearchFAQ>
    <hr className={classnames(styles.hrUnderSearchBar)}></hr>
    {categoriesLoading ?
      <div className={classnames(styles.loaderForm)}></div>
      :
      <div className={classnames(styles.generalContainer)}>
        <span className={classnames(styles.filterPer)}>Filtra per: </span>
        {/* CATEGORIES */}
        <div className={classnames(styles.filtersFirstLevel, styles.filters, 'w100')}>
          <div className={classnames(styles.filterWrapper)}>
            <ul className={classnames(styles.categoryList)}>
              {categories &&
                categories.sort(categoriesSortFunction).map((cat: Category, index: number) => (
                  <li key={index} className={classnames(styles.categoryFilter)}>
                    <Link
                      page={"store.custom#subcategory"}
                      params={{slug: cat.url, metaTitle: cat.metaTitle, metaDescription: cat.metaDescription}}
                      className={classnames(styles.textDecoration)}>
                        <div className={classnames(styles.categoryContainer)}>
                          <img className={classnames(styles.categoryImage)} src={cat.image} alt={cat.imageAlt} />
                          <p className={classnames(styles.categoryImageAlt)}>{cat.imageAlt}</p>
                          <div className={classnames(styles.categoryButtonContainer)}>
                            <Button variation="primary">{cat.name.includes("Utilizzo") ? "Utilizzo Del Sito" : cat.name}</Button>
                          </div>
                        </div>
                      </Link>
                      <ul className={classnames(styles.groupList)}>
                        <QueryExecuter variables={{categoryId: cat.id, categoryName: cat.name}} query={getGroupsWithItsFaqs} render={(data) => {
                          return (
                            data.getGroupsWithItsFaqs.map((group: any, index: any) => (
                              <li key={index} className={classnames(styles.groupListItem)}>
                                <Link className={classnames(styles.otherFaqsLink)} to={`/faq/categoria/${cat.url}#${group.groupId}`}>
                                  {group.groupName}
                                </Link>
                              </li>
                            ))
                          )
                        }} />
                      </ul>
                    </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    }
    <DomandePiuFrequenti />
  </>
}

const CategoriesContainer: StorefrontFunctionComponent = () => {
  return <FAQContextProvider>
    <DomandeFrequenti />
  </FAQContextProvider>
}

CategoriesContainer.schema = {
  title: 'editor.domande-frequenti.title',
  description: 'editor.domande-frequenti.description',
  type: 'object',
  properties: {},
}

export default CategoriesContainer
