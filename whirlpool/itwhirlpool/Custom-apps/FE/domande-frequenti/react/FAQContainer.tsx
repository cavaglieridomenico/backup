//@ts-nocheck
import classnames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useLazyQuery, useQuery } from "react-apollo";
import { Link } from 'vtex.render-runtime';
import { Helmet } from "vtex.render-runtime/react/components/RenderContext";
import { Button } from "vtex.styleguide";
import { FAQContextProvider, useFAQ } from "./context/context";
import getGroupsWithItsFaqs from "./graphql/getGroupsWithItsFaqs.graphql";
import styles from './styles.css';

interface Group {
  groupName: string
  groupId: string
  groupImageAlt: string
  image: string
  faqs: FAQ[]
}
interface FAQ {
  id: string
  url: string
  metaTitle: string
  metaDescription: string
  question: string
  answer: string
  featuredFrom: boolean
  category: string
  group: string
}
export interface SubcategorySectionProps {
  slug: string;
  metaTitle: string, 
  metaDescription: string;
}

const SubcategorySection: StorefrontFunctionComponent<SubcategorySectionProps> = ({ slug, metaDescription, metaTitle }) => {
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string | undefined>("all")
  const [groupName, setGroupName] = useState<string>()
  const [currentCategory, setCurrentCategory] = useState<any>()
  const [openGroup, setOpenGroup] = useState<number[]>([])
  const [windowScroll, setWindowScroll] = useState<number>(0)
  const groupRef = useRef<any>({});
  // const [tagSetted, setTagSetted]: any = useState()

  const {categories} = useFAQ(); 

  // const {
  //   data: FAQsByGroups,
  //   loading: FAQsByGroupsLoading,
  // } = useQuery(getGroupsWithItsFaqs, {
  //   variables: {
  //     categoryId: slug,
  //     categoryName: name
  //   }
  // })
  
  const findItem = (url: string) => {
    return categories?.find((category: any) => category.url == slug)
  } 

  const handleOpenGroup = (index: number, action?: string) => {
    setOpenGroup(prev => {
      const newState = [...prev];
      newState[index] = action === "open" ? (true) : (!newState[index])
      return newState;
    })
  }

  const [getGroupsWithItsFaqsLazyFunction, {data: FAQsByGroups, loading: FAQsByGroupsLoading}] = useLazyQuery(getGroupsWithItsFaqs)

  useEffect(() => {
    if (categories) {
      const category = findItem(slug);
      setCurrentCategory(category)
      if (category) {
        getGroupsWithItsFaqsLazyFunction({
          variables: {
            categoryId: category.id
          }
        })
      }
    }
  }, [categories])
 
  const FAQs = FAQsByGroups?.getGroupsWithItsFaqs

  useEffect(() => {
    if (window) {
      const groupId = window?.location?.hash?.split("#")[1]
      if (groupId) {
        setSelectedGroupFilter(groupId)
        const groupSelected = FAQs?.find((question: any) => question?.groupId === groupId);
        if (groupSelected) {
          setGroupName(groupSelected?.groupName)
        }
      }
    }
  }, [typeof window])

  useEffect(() => {
    // Automatically scroll to group selected and open related FAQs when coming from another page or refreshing category page
      const isGroupSelected = window?.location?.hash?.split("#")[1];
      if (isGroupSelected) {
        groupRef?.current[isGroupSelected]?.scrollIntoView()
        const index = FAQs?.findIndex((item: any) => item.groupId === isGroupSelected)
        handleOpenGroup(index)
      }
  }, [FAQs])

  useEffect(() => {
    const scrollListener = window.addEventListener("scroll", () => {
      const scrolledAmount = window?.scrollY;
      setWindowScroll(scrolledAmount)
    })
    return () => {
      window.removeEventListener("scroll", scrollListener)
    }
  }, [])

  const handleGroupSelected = (groupId: string, groupName: string, index: number) => {
    setGroupName(groupName)
    setSelectedGroupFilter(groupId)
    location.hash = "#" + groupId
    handleOpenGroup(index, "open")
    // setTagSetted(true)
  }
 
  return <>
    <Helmet>
        <title>{metaTitle ? metaTitle : categories && currentCategory?.metaTitle}</title>
        <meta name="description" content={metaDescription ? metaDescription : categories && currentCategory?.metaDescription} data-react-helmet="true" />
    </Helmet>
    {!FAQs || FAQsByGroupsLoading ?
      <div className={classnames(styles.loaderForm)}></div>
      : FAQs &&
      <>
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
              <a href={`/faq/categoria/${currentCategory?.url}`}>
                <span>{currentCategory?.name}</span>
              </a>
            </li>
            <li className={classnames(styles.breadcrumbItem)}>
                <span>{groupName}</span>
            </li>
          </ul>
        </div>
        <div className={classnames(styles.domandeFrequentiTitleContainer)}>
          <span className={classnames(styles.domandeFrequentiTitle)}>Domande Frequenti</span>
        </div>
        <div className={classnames(styles.generalContainer)}>
        <h1 className={classnames(styles.titleSection)}>Domande nella categoria "{currentCategory?.name}"</h1>
          {/* GROUPS */}
          <div className={classnames(styles.filters, 'w100')}>
            <div className={classnames(styles.filtersContainer, "flex", "justify-between", "items-end")}>
              <span className={classnames(styles.filterPer)}>Filtra per:</span>
              <Button variant="primary" href="/faq">Torna alle FAQ</Button>
            </div>
            <div className={classnames(styles.filterWrapper, styles.borderWrapper)}>
              <ul>
                {FAQs?.map((group: Group, index: number) => (
                  <li key={index}>
                    <span
                      className={
                        selectedGroupFilter === group.groupId
                          ? classnames(styles.selectedFilter)
                          : classnames(styles.filter, styles.noBackground)
                      }
                      onClick={() => handleGroupSelected(group.groupId, group.groupName, index)}
                    >
                      <img alt={`${group.groupName} image`} className={classnames(styles.imageGroups)} src={group?.image}></img>
                      {group?.groupName}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* FAQS */}
          <div className='mt8'>
            {FAQs?.map((group: Group, index: number) =>
              <div key={index}>
                <p onClick={() => handleOpenGroup(index)} ref={el => groupRef.current[group.groupId] = el} className={
                  selectedGroupFilter === group.groupId
                    ? classnames(styles.tagSelected)
                    : classnames(styles.tag)
                } id={group.groupId}>
                  <span>{group.groupName}</span>
                  <span className={classnames(styles.buttonOpenGroup)}>
                    {openGroup[index] ? "-" : "+"}
                  </span>
                </p>
                {openGroup[index] && (
                  <div className={classnames(styles.faqsContainer, 'w100')}>
                    {group.faqs.map((faq: FAQ, index: number) =>
                      <div key={index} className={
                        group.faqs.length > 2
                          ? classnames(styles.domandaContainer, 'w100')
                          : classnames(styles.domandaContainerLessThan3, 'w100')
                      }>
                        <Link
                          page={'store.custom#single-faq'}
                          params={{
                            slug: faq.url,
                            metaTitle: faq.metaTitle,
                            metaDescription: faq.metaDescription
                            // categoryName: name,
                            // categoryId: slug,
                            // groupName: group.groupName,
                            // isTagSetted: tagSetted
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
                    )}
                  </div>
                )}
              </div>
            )}
            {windowScroll > 200 && (
              <div onClick={() => window?.scrollTo({top: 0, behavior: "smooth"})} className={classnames(styles.backToTopButton, 'flex items-center justify-center c-on-action-primary b fixed')}>&uarr;</div>
            )}
          </div>
        </div>
      </>
    }
  </>
}

const FAQContainer: StorefrontFunctionComponent = (props: any) => {
  return <FAQContextProvider>
    <SubcategorySection
      name={props.params.name}
      slug={props.params.slug}
      metaTitle={props.params.metaTitle}
      metaDescription={props.params.metaDescription} 
    />
  </FAQContextProvider>
}

FAQContainer.schema = {
  title: 'editor.domande-frequenti.title',
  description: 'editor.domande-frequenti.description',
  type: 'object'
}

export default FAQContainer

