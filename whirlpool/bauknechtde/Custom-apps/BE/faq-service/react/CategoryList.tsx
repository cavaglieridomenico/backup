import React, { useEffect, FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Modal, Input } from 'vtex.styleguide'
import { CSVLink } from "react-csv";

import styles from './style.css'

interface categoryListProps{
    categoryList: any;
  }

const CategoryList: FC<categoryListProps> = ({categoryList}) => {

    const [data, setData] = useState<any>([]);
    const [categoryIndex, setCategoryIndex] = useState<number>(-1)
    const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState('');

    function toggleModalUpdate(index: number) {
        setCategoryIndex(index)
        setIsOpenModalUpdate(!isOpenModalUpdate);
    }
    function toggleModalDelete() {
        setIsOpenModalDelete(!isOpenModalDelete);
    }
    const handleChangeInputFAQ = (e: any, index: number, field: string) => {
        (data[index][field] as any) = e.target.value
        setData([...data])
    }

    const deleteCategory = (id: any) => {

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

        fetch('/_v/faq/categories/delete', options)
            // .then(res => res.json())
            .then(res => res.ok)
            .then(result => {
                console.log('Delete result: ', result)
                setData(data.filter((category: any) => {
                    return category.id !== id
                }))
            })
        // window.location.reload();
    }

    const updateCategory = () => {

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data[categoryIndex]),
        }

        fetch('/_v/faq/categories/update', options)
            // .then(res => res.json())
            .then(res => res.ok)
            .then(result => {
                console.log('Update result: ', result)
            })
        // window.location.reload();
    }

    const createCsv = () => {
        const headers = [
            { label: "Id", key: "id" },
            { label: "Name", key: "name" },
            { label: "Titolo", key: "metaTitle" },
            { label: "Descrizione", key: "metaDescription" },
            { label: "Immagine", key: "url" }
        ];

        const csvReport = {
            data: data,
            headers: headers,
            filename: "category_management_export_.csv",
            separator: ";",
            enclosingCharacter: `'`,
        };
        return csvReport;
    };

    useEffect(() => {

        const url = `/_v/faq/categories?page=1&pageSize=100`
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

    }, [])

    return (
        <>
            <table className={styles.tableContainer}>
                <tr>
                    <th> <FormattedMessage id="admin-example.navigation.id" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.name" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.titolo" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.descrizione" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.immagine" /></th>
                    <th> </th>
                </tr>
                {console.log("CATEGORY-LIST----------", categoryList)}
                {console.log("DATA-------", data)}
                {/* {categoryList.length>=0 && categoryList?.map((categories: any,  index: number) => ( */}
                {data && data.length >= 0 && data.map((categories: any, index: number) => (
                    <>
                        <tr>
                            <td>{categories.id}</td>
                            <td>{categories.name}</td>
                            <td>{categories.metaTitle}</td>
                            <td>{categories.metaDescription}</td>
                            <td>.../{categories.image.split('/').pop()}</td>
                            <td>
                                <Button onClick={() => {
                                    toggleModalUpdate(index)
                                }} variation="secondary">
                                    <FormattedMessage id="admin-example.update-category" />
                                </Button>
                                <Button onClick={() => {
                                    setDeleteItemId(categories.id)
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
                <div> <FormattedMessage id="admin-example.update-category-label" /></div>
                <div className={styles.formWrapper}>
                    <Input
                        label={<FormattedMessage id={'admin-example.navigation.name'} />}
                        value={data[categoryIndex]?.name}
                        name="Name"
                        onChange={(e: any) => handleChangeInputFAQ(e, categoryIndex, "name")}
                        required={true}
                    />
                </div>
                <div className={styles.formWrapper}>
                    <Input
                        label={<FormattedMessage id={'admin-example.navigation.titolo'} />}
                        value={data[categoryIndex]?.metaTitle}
                        name="Titolo"
                        onChange={(e: any) => handleChangeInputFAQ(e, categoryIndex, "metaTitle")}
                        required={true}
                    />
                </div>
                <div className={styles.formWrapper}>
                    <Input
                        label={<FormattedMessage id={'admin-example.navigation.descrizione'} />}
                        value={data[categoryIndex]?.metaDescription}
                        name="Description"
                        onChange={(e: any) => handleChangeInputFAQ(e, categoryIndex, "metaDescription")}
                        required={true}
                    />
                </div>
                <div className={styles.formWrapper}>
                    <Input
                        label={<FormattedMessage id={'admin-example.navigation.immagine'} />}
                        value={data[categoryIndex]?.image}
                        name="Image"
                        onChange={(e: any) => handleChangeInputFAQ(e, categoryIndex, "image")}
                        required={false}
                    />
                </div>
                <Button variation="secondary" onClick={() => toggleModalUpdate(-1)}> <FormattedMessage id="admin-example.close-modal" /></Button>
                <Button variation="secondary" onClick={() => {
                    updateCategory()
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
                    deleteCategory(deleteItemId)
                    toggleModalDelete()
                }}><FormattedMessage id="admin-example.delete-category" /></Button>
            </Modal>
        </>
    )
}

export default CategoryList
