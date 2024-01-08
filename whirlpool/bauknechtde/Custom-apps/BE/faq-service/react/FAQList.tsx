import React, { useEffect, FC, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Modal, Input, Checkbox} from 'vtex.styleguide'
import { CSVLink } from "react-csv";
// import { useLazyQuery } from "react-apollo";
// import getGroupsByCategory from "./graphql/getGroupsByCategory.graphql"  
// import Select from "react-select";

import styles from './style.css'

interface FAQListProps{
    stateFAQList: any;
    setStateFAQList: any;
  }

const FAQList: FC<FAQListProps> = ({ stateFAQList, setStateFAQList}) => {

    // const [getGroups,{data : groups,loading }] = useLazyQuery(getGroupsByCategory) 

    const intl = useIntl()
    const [data, setData] = useState<any>([]);
    // const [FAQdata, setFAQData] = useState([]);
    const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState('');
    const [FAQIndex, setFAQIndex] = useState<number>(-1)
    const [arrayCategory, setArrayCategory] = useState([])
    const [arrayQuestionGroup, setArrayQuestionGroup] = useState([])

    function toggleModalUpdate(index: number) {
        setFAQIndex(index)
        setIsOpenModalUpdate(!isOpenModalUpdate);

        if(!isOpenModalUpdate){
            getGroupsFromCategory(index)
        }
    }
    const getGroupsFromCategory = (index:any) => {
        // getGroups({
        //     variables: {category: data[index].category}
        // })

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }

        fetch(`/_v/faq/${data[index].category}/group-detail-and-faqs`, options)
            .then(res => res.json())
            .then(json => {
                setArrayQuestionGroup(json.map((group: any) => ({ value: { name: group.groupName, id: group.groupId }, label: group.groupName })))
            })

    }
    // useEffect(() => {
    //     if(!loading && groups){
    //         setArrayQuestionGroup(groups)
    //     }
    // }, [loading])
    function toggleModalDelete() {
        setIsOpenModalDelete(!isOpenModalDelete);
    }
    const handleChangeInputFAQ = (e: any, index: number, field: string) => {
        (data[index][field] as any) = e.target.value
        setData([...data])
    }
    const handleChangeSelectFAQ = (e: any, index: number, field: string) => {
        const {selectedOptions} = e.target;
        (data[index][field] as any) = selectedOptions[0].id
        setData([ ...data ])
    }
    const handleChangeCheckboxFAQ = (e: any, index: number, field: string) => {
        (data[index][field] as any) = e.target.checked
        setData([ ...data ])
    }


    const deleteFAQ = (id: any) => {

        const obj = {
            "id": id
        }

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        }

        fetch('/_v/faq/delete', options)
            .then(res => res.ok && setStateFAQList(stateFAQList.filter((faq:any)=>faq.id !=id)))
            
    }

    const updateFAQ = () => {

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data[FAQIndex]),
        }

        fetch('/_v/faq/update', options)
            .then(res => res.ok && window.location.reload())
    }

    const createCsv = () => {
        const headers = [
            { label: "Id", key: "id" },
            { label: "Titolo", key: "metaTitle" },
            { label: "Descrizione", key: "metaDescription" },
            { label: "Categoria", key: "category" },
            { label: "Gruppo di domanda", key: "group" },
            { label: "Domanda principale", key: "featuredFrom" },
            { label: "Domanda", key: "group" },
            { label: "Risposta", key: "answer" }
        ];

        const csvReport = {
            data: data,
            headers: headers,
            filename: "faq_management_export_.csv",
            separator: ";",
            enclosingCharacter: `'`,
        };
        return csvReport;
    };

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
                    setData(json)
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
                    setArrayCategory(json.map((cat: any) => ({ value: { name: cat.name, id: cat.id }, label: cat.name })))
                })
        } catch (error) {
        }
      
    }, [])

    return (
        <>
            <table className={styles.tableContainer}>
                <tr className={styles.tableHeader}>
                    <th> <FormattedMessage id="admin-example.navigation.id" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.titolo" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.descrizione" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.category" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.question-group" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.featured-question" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.question" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.answer" /></th>
                    <th> </th>
                </tr>
                {stateFAQList?.map((faq: any, index: number) => (
                    <>
                        <tr>
                            <td>{faq?.id}</td>
                            <td>{faq?.metaTitle}</td>
                            <td>{faq?.metaDescription}</td>
                            <td>{faq?.categoryName}</td>
                            <td>{faq?.groupName}</td>
                            <td>{faq?.featuredFrom ? 'SI': 'NO'}</td>
                            <td>{faq?.question}</td>
                            <td>{faq?.answer}</td>
                            <td>
                                <Button onClick={() => {
                                    toggleModalUpdate(index)
                                }} variation="secondary">
                                    <FormattedMessage id="admin-example.update-category" />
                                </Button>
                                <Button onClick={() => {
                                    setDeleteItemId(faq.id)
                                    toggleModalDelete()
                                }} variation="danger">
                                    <FormattedMessage id="admin-example.delete-category" />
                                </Button>
                            </td>
                        </tr>
                    </>
                ))}
                {data.length > 0 && (
                    <Button variation="secondary">
                        <CSVLink {...createCsv()}>
                            <FormattedMessage id="admin-example.navigation.export-csv" />
                        </CSVLink>
                    </Button>
                )}
            </table>
            <Modal
                isOpen={isOpenModalUpdate}
                onClose={() => toggleModalUpdate(-1)}
                contentLabel="Update"
            >
                <div> <FormattedMessage id="admin-example.update-faq-label" /></div>
                <div className={styles.formWrapper}>
                    <div className="inputWrapper">
                        <Input
                            label={<FormattedMessage id={'admin-example.navigation.titolo'} />}
                            value={data[FAQIndex]?.metaTitle}
                            name="title"
                            onChange={(e: any) => handleChangeInputFAQ(e, FAQIndex, "metaTitle")}
                            required={true}
                        />
                    </div>
                    <div className={styles.formWrapper}>
                        <Input
                            label={<FormattedMessage id={'admin-example.navigation.descrizione'} />}
                            value={data[FAQIndex]?.metaDescription}
                            name="Description"
                            onChange={(e: any) => handleChangeInputFAQ(e, FAQIndex, "metaDescription")}
                            required={true}
                        />
                    </div>
                    <div className={styles.selectWrapper}>
                        <select
                            placeholder={intl.formatMessage({ id: "admin-example.navigation.category" })}
                            onChange={(e: any) => handleChangeSelectFAQ(e, FAQIndex, "category")}
                        >
                              {arrayCategory?.map((cat:any) =>
                                <option id={cat.value.id}
                                    selected={cat.value.id==data[FAQIndex]?.category}
                                >{cat.value.name}</option>
                              )}
                        </select>
                    </div>
                    <div className={styles.formWrapper}>
                         <select
                            placeholder={intl.formatMessage({ id: "admin-example.navigation.question-group" })}
                            onChange={(e: any) => handleChangeSelectFAQ(e, FAQIndex, "group")}
                        >
                              {arrayQuestionGroup?.map((group:any) =>
                                <option id={group.value.id}
                                    selected={group.value.id==data[FAQIndex]?.group}
                                >{group.value.name}</option>
                              )}
                        </select>
                    </div>
                    <div className={styles.formWrapper}>
                        <Checkbox
                            label={<FormattedMessage id={'admin-example.navigation.featured-question'} />}
                            checked={data[FAQIndex]?.featuredFrom}
                            onChange={(e: any) => { handleChangeCheckboxFAQ(e, FAQIndex, "featuredFrom") }}
                        />
                    </div>
                    <div className={styles.formWrapper}>
                        <Input
                            label={<FormattedMessage id={'admin-example.navigation.question'} />}
                            value={data[FAQIndex]?.question}
                            name="Question"
                            onChange={(e: any) => handleChangeInputFAQ(e, FAQIndex, "question")}
                            required={false}
                        />
                    </div>
                    <div className={styles.formWrapper}>
                        <Input
                            label={<FormattedMessage id={'admin-example.navigation.answer'} />}
                            value={data[FAQIndex]?.answer}
                            name="Answer"
                            onChange={(e: any) => handleChangeInputFAQ(e, FAQIndex, "answer")}
                            required={false}
                        />
                    </div>
                </div>
                <Button variation="secondary" onClick={() => toggleModalUpdate(-1)}> <FormattedMessage id="admin-example.close-modal" /></Button>
                <Button variation="secondary" onClick={() => {
                    updateFAQ()
                    toggleModalUpdate(-1)
                }}><FormattedMessage id="admin-example.update-category" /></Button>
            </Modal>
            <Modal
                isOpen={isOpenModalDelete}
                onClose={() => toggleModalDelete()}
                contentLabel="Delete"
            >
                <div> <FormattedMessage id="admin-example.delete-category-label" /></div>
                <Button variation="secondary" onClick={() => toggleModalDelete()}> <FormattedMessage id="admin-example.close-modal" /></Button>
                <Button variation="danger" onClick={() => {
                    deleteFAQ(deleteItemId)
                    toggleModalDelete()
                }}><FormattedMessage id="admin-example.delete-category" /></Button>
            </Modal>
        </>
    )
}

export default FAQList
