import React, { FC, useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, Button, PageHeader } from 'vtex.styleguide'
import CreateFAQ from './CreateFAQ'
import FAQFilter from './FAQFilter'
import FAQList from './FAQList'
// import UsersTable from './UsersTable'

import './styles.global.css'

const FAQManagement: FC = () => {

  const [routeFAQ, setRouteFAQ] = useState('');
  const [stateFAQList, setStateFAQList]: any = useState([])
  const [categoryList, setCategoryList]: any = useState([])
  const [arrayCategory, setArrayCategory] = useState([])
  const [arrayQuestionGroup, setArrayQuestionGroup] = useState([])
  const [filteredQuestion, setFilteredQuestion]: any = useState([])
  const [filteredAnswer, setFilteredAnswer]: any = useState([])
  const [arrayFAQ, setArrayFAQ] = useState([])
  const [selectedCategory, setSelectedCategory]: any = useState()
  const [selectedGroup, setSelectedGroup]: any = useState()
  const [selectedFAQquestion, setSelectedFAQquestion]: any= useState()
  const [selectedFAQanswer, setSelectedFAQanswer]: any = useState()
  const [newFAQ, setNewFAQ] = useState({
    metaTitle: '',
    metaDescription: '',
    url: '',
    id: '',
    answer: '',
    question: '',
    category: '',
    categoryName: '',
    featuredFrom: '',
    group: '',
    groupName: ''
  })

  const handleResetFAQList = () => {
    setStateFAQList(arrayFAQ)
  }

  const handleChangeCategory = (value: any) => {
    setSelectedCategory(value)
  }

  const handleChangeQuestion = (value: any) => {
    setSelectedFAQquestion(value)
  }

  const handleChangeAnswer = (value: any) => {
    setSelectedFAQanswer(value)
  }

  const handleResetCategoryFilters = () => {
    setCategoryList([...arrayCategory])
    setSelectedCategory(null)
  }

  const handleChangeGroup = (value: any) => {
    setSelectedGroup(value)
  }

  const handleResetGroupFilters = () => {
    setArrayQuestionGroup([])
    setSelectedGroup(null)
  }

  const handleResetFAQquestionFilters = () => {
    setFilteredQuestion(arrayFAQ.map((faq: any) => ({ value: { name: faq.question, id: faq.id }, label: faq.question })))
    setSelectedFAQquestion(null)
  }
  const handleResetFAQanswerFilters = () => {
    setFilteredAnswer(arrayFAQ.map((faq: any) => ({ value: { name: faq.answer, id: faq.id }, label: faq.answer })))
    setSelectedFAQanswer(null)
  }

  console.log(categoryList)

  useEffect(() => {
    if (routeFAQ == '' && newFAQ.metaTitle != '') {
      stateFAQList.push(newFAQ)
      setNewFAQ({
        metaTitle: '',
        metaDescription: '',
        url: '',
        id: '',
        answer: '',
        question: '',
        category: '',
        categoryName: '',
        featuredFrom: '',
        group: '',
        groupName: '',
      })
    }
  }, [routeFAQ])

  useEffect(() => {

    const url = `/_v/faqs?page=1&pageSize=100`
    const options = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    try {
      fetch(url, options)
        .then(res => res.json())
        .then(json => {
          setStateFAQList(json)
          setArrayFAQ(json)
          setFilteredQuestion(json.map((faq: any) => ({ value: { name: faq.question, id: faq.id }, label: faq.question })))
          setFilteredAnswer(json.map((faq: any) => ({ value: { name: faq.answer, id: faq.id }, label: faq.answer })))
        })
    } catch (error) {
    }

    const urlCategory = `/_v/faq/categories?page=1&pageSize=100`
    const optionsCategory = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    try {
      fetch(urlCategory, optionsCategory)
        .then(res => res.json())
        .then(json => {
          setArrayCategory(json)
          setCategoryList(json)
        })
    } catch (error) {
    }

  }, [])

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    if (selectedCategory?.value) {
      fetch(`/_v/faq/${selectedCategory?.value}/group-detail-and-faqs`, options)
        .then(res => res.json())
        .then(json => {
          setArrayQuestionGroup(json.map((group: any) => ({ value: { name: group.groupName, id: group.groupId }, label: group.groupName })))
        })
    } else {
      fetch(`/_v/faq/${selectedCategory}/group-detail-and-faqs`, options)
        .then(res => res.json())
        .then(json => {
          setArrayQuestionGroup(json.map((group: any) => ({ value: { name: group.groupName, id: group.groupId }, label: group.groupName })))
        })
    }

    if (selectedCategory != null) {
      const filteredFAQs = arrayFAQ.filter((faq: any) => faq.category == selectedCategory.value)
      setFilteredQuestion(filteredFAQs.map((faq: any) => ({ value: { name: faq.question, id: faq.id }, label: faq.question })))
      setFilteredAnswer(filteredFAQs.map((faq: any) => ({ value: { name: faq.answer, id: faq.id }, label: faq.answer })))
      setStateFAQList(filteredFAQs)
    }
    // else {
    //   setStateFAQList([...arrayFAQ])
    // }

  }, [selectedCategory])

  useEffect(() => {
    if (selectedGroup != null) {
      const filteredFAQs = stateFAQList.filter((faq: any) => faq.group == selectedGroup.value)
      setFilteredQuestion(filteredFAQs.map((faq: any) => ({ value: { name: faq.question, id: faq.id }, label: faq.question })))
      setFilteredAnswer(filteredFAQs.map((faq: any) => ({ value: { name: faq.answer, id: faq.id }, label: faq.answer })))
      setStateFAQList(filteredFAQs)
    }
    // else {
    //   const filteredFAQs = arrayFAQ.filter((faq: any) => faq.category == selectedCategory)
    //   setFilteredQuestion(filteredFAQs.map((faq: any) => ({ value: { name: faq.question, id: faq.id }, label: faq.question })))
    //   setFilteredAnswer(filteredFAQs.map((faq: any) => ({ value: { name: faq.answer, id: faq.id }, label: faq.answer })))
    //   setStateFAQList(filteredFAQs)
    // }
  }, [selectedGroup])

  useEffect(() => {
    if (selectedFAQquestion != null) {
      const filteredFAQquestion = arrayFAQ.filter((faq: any) => faq.id == selectedFAQquestion.value)
      setStateFAQList(filteredFAQquestion)
      setFilteredAnswer(filteredFAQquestion.map((faq: any) => ({ value: { name: faq.answer, id: faq.id }, label: faq.answer })))
    }
  }, [selectedFAQquestion])

  useEffect(() => {
    if (selectedFAQanswer != null) {
      const filteredFAQanswer = arrayFAQ.filter((faq: any) => faq.id == selectedFAQanswer.value)
      setStateFAQList(filteredFAQanswer)
      setFilteredQuestion(filteredFAQanswer.map((faq: any) => ({ value: { name: faq.question, id: faq.id }, label: faq.question })))
    }
  }, [selectedFAQanswer])

  return (
    <>
      {routeFAQ != "Create" ? <Layout
        pageHeader={
          <PageHeader
            title={<FormattedMessage id="admin-example.faq-management" />}
          />
        }
      >
        <PageBlock variation="full">
          <Button onClick={() => setRouteFAQ('Create')} variation="secondary">
            <FormattedMessage id="admin-example.create-faq" />
          </Button>
        </PageBlock>
        <PageBlock variation="full">
          <FAQFilter
            arrayCategory={arrayCategory}
            selectedCategory={selectedCategory}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            setSelectedCategory={setSelectedCategory}
            handleResetCategoryFilters={handleResetCategoryFilters}
            arrayQuestionGroup={arrayQuestionGroup}
            filteredQuestion={filteredQuestion}
            filteredAnswer={filteredAnswer}
            setArrayQuestionGroup={setArrayQuestionGroup}
            arrayFAQ={arrayFAQ}
            selectedFAQquestion={selectedFAQquestion}
            setSelectedFAQquestion={setSelectedFAQquestion}
            handleResetFAQquestionFilters={handleResetFAQquestionFilters}
            selectedFAQanswer={selectedFAQanswer}
            setSelectedFAQanswer={setSelectedFAQanswer}
            handleResetFAQanswerFilters={handleResetFAQanswerFilters}
            handleResetGroupFilters={handleResetGroupFilters}
            handleResetFAQList={handleResetFAQList}
            handleChangeCategory={handleChangeCategory}
            handleChangeGroup={handleChangeGroup}
            handleChangeQuestion={handleChangeQuestion}
            handleChangeAnswer={handleChangeAnswer}
          ></FAQFilter>
        </PageBlock>
        <PageBlock variation="full">
          <FAQList
            stateFAQList={stateFAQList}
            setStateFAQList={setStateFAQList}
          ></FAQList>
        </PageBlock>
      </Layout> :
        <CreateFAQ
          newFAQ={newFAQ}
          setNewFAQ={setNewFAQ}
          setRouteFAQ={setRouteFAQ}
          selectedCategory={selectedCategory}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          setSelectedCategory={setSelectedCategory}
          arrayQuestionGroup={arrayQuestionGroup}
          handleResetFAQList={handleResetFAQList}
          handleResetGroupFilters={handleResetGroupFilters}
          handleResetCategoryFilters={handleResetCategoryFilters}
        ></CreateFAQ>
      }
    </>
  )
}

export default FAQManagement
