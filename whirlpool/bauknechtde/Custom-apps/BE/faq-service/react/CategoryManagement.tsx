import React, { FC, useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, Button, PageHeader } from 'vtex.styleguide'
import CategoryFilter from './CategoryFilter'
import CategoryList from './CategoryList'
import CreateCategory from './CreateCategory'
// import UsersTable from './UsersTable'

import './styles.global.css'

const CategoryManagement: FC = () => {

  const [arrayCategory, setArrayCategory] = useState([])
  const [selectedCategory, setSelectedCategory] :any= useState()
  const [selectedGroup, setSelectedGroup] :any= useState()
  const [arrayQuestionGroup, setArrayQuestionGroup] = useState([])
  const [categoryList, setCategoryList]: any = useState([])
  const [route, setRoute] = useState('')
  const [newCategory, setNewCategory] = useState({
    name: '',
    title: '',
    image: '',
    metaDescription: '',
    url: '',
    id: ''
  })

  useEffect(() => {
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
    if (route == '' && newCategory.name != '') {
      categoryList.push(newCategory)
      setNewCategory({
        name: '',
        title: '',
        image: '',
        metaDescription: '',
        url: '',
        id: ''
      })
    }
  }, [route])

  useEffect(() => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }

    fetch(`/_v/faq/${selectedCategory?.value}/group-detail-and-faqs`, options)
        .then(res => res.json())
        .then(json => {
            setArrayQuestionGroup(json.map((group: any) => ({ value: { name: group.groupName, id: group.groupId }, label: group.groupName })))
        })

    if (selectedCategory != null) {
      const filteredCategories = arrayCategory.filter((cat: any) => cat.id == selectedCategory.value)
      setCategoryList(filteredCategories)
    }

  }, [selectedCategory])

  const handleResetCategoryFilters = () => {
    setCategoryList([...arrayCategory])
    setSelectedCategory(null)
    setSelectedGroup(null)
  }
  
  const handleChangeCategory = (value: any) => {
    setSelectedCategory(value)
  }

  const handleChangeGroup = (value: any) => {
    setSelectedGroup(value)
  }


  return (
    <>
      {route != 'Create' ?
        <Layout
          pageHeader={
            <PageHeader
              title={<FormattedMessage id="admin-example.category-management" />}
            />
          }
        >
          <PageBlock variation="full">
            <Button onClick={() => setRoute('Create')} variation="secondary">
              <FormattedMessage id="admin-example.create-category" />
            </Button>
          </PageBlock>
          <PageBlock variation="full">
            <CategoryFilter
              arrayCategory={arrayCategory}
              selectedGroup={selectedGroup}
              selectedCategory={selectedCategory}
              arrayQuestionGroup={arrayQuestionGroup}
              setArrayQuestionGroup={setArrayQuestionGroup}
              setSelectedCategory={setSelectedCategory}
              setSelectedGroup={setSelectedGroup}
              handleResetCategoryFilters={handleResetCategoryFilters}
              handleChangeCategory={handleChangeCategory}
              handleChangeGroup={handleChangeGroup}
            ></CategoryFilter>
          </PageBlock>
          <PageBlock variation="full">
            <CategoryList
              categoryList={categoryList}
            ></CategoryList>
          </PageBlock>
        </Layout>
        : <CreateCategory
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          setRoute={setRoute}
        ></CreateCategory>}
    </>
  )
}

export default CategoryManagement
