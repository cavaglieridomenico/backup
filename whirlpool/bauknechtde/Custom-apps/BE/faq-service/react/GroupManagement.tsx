import React, { FC, useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, Button, PageHeader } from 'vtex.styleguide'
import GroupFilter from './GroupFilter'
import GroupList from './GroupList'
import CreateGroup from './CreateGroup'
// import UsersTable from './UsersTable'

import './styles.global.css'

const GroupManagement: FC = () => {

    const [groupList, setGroupList]: any = useState([])
    const [arrayCategory, setArrayCategory] = useState([])
    const [categoryList, setCategoryList]: any = useState([])
    const [routeGroup, setRouteGroup] = useState('')
    const [selectedCategory, setSelectedCategory]: any = useState()
    const [newGroup, setNewGroup] = useState({
        name: '',
        image: '',
        url: '',
        id: '',
        fatherCategory: '',
        category:''
    })

    useEffect(() => {
        const urlGroup = `/_v/faq/categories?page=1&pageSize=100`
        const optionsGroup = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            fetch(urlGroup, optionsGroup)
                .then(res => res.json())
                .then(json => {
                      setCategoryList(json)
                })
        } catch (error) {
        }

    }, [])

    console.log(categoryList)

    useEffect(() => {
        if (routeGroup == '' && newGroup.name != '') {
            groupList.push(newGroup)
            setNewGroup({
                name: '',
                image: '',
                url: '',
                id: '',
                fatherCategory: '',
                category:''
            })
        }
    }, [routeGroup])

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
                })
        } catch (error) {
        }

    }, [])

    useEffect(() => {

        const url = `/_v/faq/categories/${selectedCategory?.value}/questiongroups`
        const options = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }
        try {
            fetch(url, options)
                .then(res => res.json())
                .then(json => {
                    setGroupList(json)       
                })
        } catch (error) {
        }

    }, [selectedCategory])

    const handleResetCategoryFilters = () => {
        setCategoryList([...arrayCategory])
        setSelectedCategory(null)
        setGroupList([])
      }
      
      const handleChangeCategory = (value: any) => {
        setSelectedCategory(value)
      }


    return (
        <>
            {routeGroup != 'Create' ?
                <Layout
                    pageHeader={
                        <PageHeader
                            title={<FormattedMessage id="admin-example.navigation.group-management" />}
                        />
                    }
                >
                    <PageBlock variation="full">
                        <Button onClick={() => setRouteGroup('Create')} variation="secondary">
                            <FormattedMessage id="admin-example.create-group" />
                        </Button>
                    </PageBlock>
                    <PageBlock variation="full">
                        <GroupFilter
                            arrayCategory={arrayCategory}
                            selectedCategory={selectedCategory}
                            handleResetCategoryFilters={handleResetCategoryFilters}
                            handleChangeCategory={handleChangeCategory}
                        ></GroupFilter>
                    </PageBlock>
                    <PageBlock variation="full">
                        <GroupList
                         groupList={groupList}
                         setGroupList={setGroupList}
                          ></GroupList>
                    </PageBlock>
                </Layout>
                : <CreateGroup
                    newGroup={newGroup}
                    setNewGroup={setNewGroup}
                    setRouteGroup={setRouteGroup}
                    arrayCategory={arrayCategory}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                ></CreateGroup>}
        </>
    )
}

export default GroupManagement
