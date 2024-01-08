import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { Input } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, Button, PageHeader, Checkbox } from 'vtex.styleguide'
import styles from './style.css'

interface createFAQProps {
    newFAQ: NewFAQ,
    setNewFAQ: any,
    setRouteFAQ: any,
    selectedCategory: any,
    selectedGroup: any,
    setSelectedGroup: any,
    setSelectedCategory: any,
    arrayQuestionGroup: any,
    handleResetGroupFilters: any,
    handleResetFAQList: any,
    handleResetCategoryFilters: any
}

interface NewFAQ {
    metaTitle: string,
    metaDescription: string,
    url: string,
    id: string,
    answer: string,
    question: string,
    category: string,
    categoryName: string,
    featuredFrom: string,
    group: string,
    groupName: string,
}

const CreateFAQ: FC<createFAQProps> = ({ newFAQ, setNewFAQ, setRouteFAQ, selectedCategory, setSelectedCategory,
    selectedGroup, setSelectedGroup, arrayQuestionGroup, handleResetGroupFilters, handleResetFAQList, handleResetCategoryFilters }) => {

    const [arrayCategory, setArrayCategory] = useState([])
    const [featuredQuestion, setFeaturedQuestion] = useState<Boolean>(false);

    const handleChangeChk = (e: any) => {
        setFeaturedQuestion(e.target.checked);
        setNewFAQ({ ...newFAQ, featuredFrom: e.target.checked })
    }

    const submitValue = () => {

        const obj = {
            "url": newFAQ.url,
            "metaTitle": newFAQ.metaTitle,
            "metaDescription": newFAQ.metaDescription,
            "question": newFAQ.question,
            "answer": newFAQ.answer,
            "featuredFrom": newFAQ.featuredFrom,
            "category": newFAQ.category,
            "group": newFAQ.group
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        }

        fetch('/_v/faq/newfaq', options).then((response): any =>
            response.ok ? response.json() : Promise.resolve({ error: true })
        ).then((res) => {
            handleResetFAQList()
            handleResetGroupFilters()
            handleResetCategoryFilters()
            setNewFAQ({ ...newFAQ, id: res.faqId, metaTitle: res.metaTitle, metaDescription: res.metaDescription })
            setRouteFAQ('')
        })
    }

    useEffect(() => {
        if (newFAQ.id != '') {
            setRouteFAQ('')
        }
    }, [newFAQ])

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
                    setArrayCategory(json.map((cat: any) => ({ value: { name: cat.name, id: cat.id }, label: cat.name })))
                })
        } catch (error) {
        }

    }, [])

    useEffect(() => {
        if (newFAQ.id != '') {
            setRouteFAQ('')
        }
    }, [newFAQ])

    return (
        <Layout
            pageHeader={
                <PageHeader
                    title={<FormattedMessage id="admin-example.create-faq" />}
                />
            }
        >
            <PageBlock variation="full">
                <div className={styles.formWrapper}>
                    {/* <div className="inputWrapper">
                        <Input
                            label={<FormattedMessage id={'admin-example.navigation.titolo'} />}
                            value={newFAQ.metaTitle}
                            name="title"
                            onChange={(e: any) => setNewFAQ({ ...newFAQ, metaTitle: e.target.value })}
                            required={true}
                        />
                    </div>
                    <div className={styles.formWrapper}>
                        <Input
                            label={<FormattedMessage id={'admin-example.navigation.descrizione'} />}
                            value={newFAQ.metaDescription}
                            name="Description"
                            onChange={(e: any) => setNewFAQ({ ...newFAQ, metaDescription: e.target.value })}
                            required={true}
                        />
                    </div> */}
                    <div className={styles.formWrapper}>
                        <select
                            placeholder="Categorie"
                            onChange={(e: any) => {
                                setSelectedCategory(e.target.selectedOptions[0].id),
                                    setNewFAQ({ ...newFAQ, category: e.target.selectedOptions[0].id, categoryName: e.target.selectedOptions[0].value })
                            }}
                        >
                            <option
                                id='default'
                                selected={true}
                            //disabled
                            >Tutte le categorie</option>
                            {arrayCategory?.map((cat: any) =>
                                <option id={cat.value.id}
                                    value={cat.value.name}
                                    selected={cat.value.id == selectedCategory}
                                >{cat.value.name}</option>
                            )}
                        </select>
                        {/* <Select options={arrayCategory?.map((p: any) => {
                            return {
                                label: p.value.name,
                                value: p.value.id
                            }
                        })} placeholder="Tutte le categorie" isSearchable={true} 
                        onChange={(e: any) => {
                            setSelectedCategory(e.value),
                            setNewFAQ({ ...newFAQ, category: e.value, categoryName: e.label })
                        }} 
                        /> */}
                    </div>
                    <div className={styles.formWrapper}>
                        <select
                            placeholder="Gruppo di domanda"
                            onChange={(e: any) => {
                                setSelectedGroup(e.target.selectedOptions[0].id)
                                setNewFAQ({ ...newFAQ, group: e.target.selectedOptions[0].id, groupName: e.target.selectedOptions[0].value })
                            }}
                        >
                            <option
                                id='default'
                                selected={true}
                                disabled
                            >Tutti i gruppi di domanda </option>
                            {arrayQuestionGroup?.map((group: any) =>
                                <option id={group.value.id}
                                    value={group.value.name}
                                    selected={group.value.id == selectedGroup}
                                >{group.value.name}</option>
                            )}
                        </select>
                    </div>
                    <div className={styles.formWrapper}>
                        <Checkbox
                            label={<FormattedMessage id={'admin-example.navigation.featured-question'} />}
                            checked={featuredQuestion}
                            onChange={(e: any) => { handleChangeChk(e) }}
                            value={featuredQuestion}
                        />
                    </div>
                    <div className={styles.formWrapper}>
                        <Input
                            label={<FormattedMessage id={'admin-example.navigation.question'} />}
                            value={newFAQ.question}
                            name="Question"
                            onChange={(e: any) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                            required={false}
                        />
                    </div>
                    <div className={styles.formWrapper}>
                        <Input
                            label={<FormattedMessage id={'admin-example.navigation.answer'} />}
                            value={newFAQ.answer}
                            name="Answer"
                            onChange={(e: any) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                            required={false}
                        />
                    </div>
                </div>
                <Button onClick={submitValue} variation="secondary">
                    <FormattedMessage id="admin-example.navigation.salva-faq" />
                </Button>
                <Button
                    onClick={() => setRouteFAQ('')}
                > <FormattedMessage id="admin-example.navigation.back-button" /> </Button>
            </PageBlock>
        </Layout>

    )
}

export default CreateFAQ
