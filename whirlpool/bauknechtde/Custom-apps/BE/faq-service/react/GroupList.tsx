import React, { useEffect, FC, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Modal, Input } from 'vtex.styleguide'

import styles from './style.css'

interface categoryListProps {
    groupList: any;
    setGroupList: any;
}

const CategoryList: FC<categoryListProps> = ({ groupList, setGroupList }) => {

    // const [data, setData] = useState<any>([]);
    const [isOpenModalUpdate, setIsOpenModalUpdate] = useState(false);
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState('');
    const [arrayCategory, setArrayCategory] = useState([])
    const [groupIndex, setGroupIndex] = useState<number>(-1)

    function toggleModalUpdate(index: number) {
        setGroupIndex(index)
        setIsOpenModalUpdate(!isOpenModalUpdate);
    }

    function toggleModalDelete() {
        setIsOpenModalDelete(!isOpenModalDelete);
    }

    const handleChangeInputFAQ = (e: any, index: number, field: string) => {
        (groupList[index][field] as any) = e.target.value
        setGroupList([...groupList])
    }

    console.log(arrayCategory)

    const deleteGroup = (id: any) => {

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

        fetch('/_v/faq/categories/groups/delete', options)
            .then(res => res.ok && window.location.reload())
    }

    const updateGroup = () => {

        const obj = {
            "url": groupList[groupIndex].url,
            "name": groupList[groupIndex].name,
            "image": groupList[groupIndex].image,
            "id": groupList[groupIndex].id
        }

        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        }

        fetch('/_v/faq/categories/groups/update', options)
            .then(res => res.ok)
    }

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

    console.log(groupList)

    return (
        <>
            <table className={styles.tableContainer}>
                <tr>
                    <th> <FormattedMessage id="admin-example.navigation.id" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.name" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.url" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.immagine" /></th>
                    <th> <FormattedMessage id="admin-example.navigation.category" /></th>
                    <th> </th>
                </tr>
                {groupList.length >= 0 && groupList?.map((group: any, index: number) => (
                    <>
                        <tr>
                            <td>{group?.id}</td>
                            <td>{group?.name}</td>
                            <td>{group?.url}</td>
                            <td>{group?.image}</td>
                            <td>{group?.catName}</td>
                            <td>
                                <Button onClick={() => {
                                    toggleModalUpdate(index)
                                }} variation="secondary">
                                    <FormattedMessage id="admin-example.update-category" />
                                </Button>
                                <Button onClick={() => {
                                    setDeleteItemId(group?.id)
                                    toggleModalDelete()
                                }} variation="danger">
                                    <FormattedMessage id="admin-example.delete-category" />
                                </Button>
                            </td>
                        </tr>
                    </>
                ))}
            </table>
            <Modal
                isOpen={isOpenModalUpdate}
                onClose={() => toggleModalUpdate(-1)}
                contentLabel="Update"
            >
                <div> <FormattedMessage id="admin-example.update-group-label" /></div>
                <div className={styles.formWrapper}>
                    <Input
                        label={<FormattedMessage id={'admin-example.navigation.name'} />}
                        value={groupList[groupIndex]?.name}
                        name="Name"
                        onChange={(e: any) => handleChangeInputFAQ(e, groupIndex, "name")}
                        required={true}
                    />
                </div>
                <div className={styles.formWrapper}>
                    <Input
                        label={<FormattedMessage id={'admin-example.navigation.url'} />}
                        value={groupList[groupIndex]?.url}
                        name="Url"
                        onChange={(e: any) => handleChangeInputFAQ(e, groupIndex, "url")}
                        required={true}
                    />
                </div>
                <div className={styles.formWrapper}>
                    <Input
                        label={<FormattedMessage id={'admin-example.navigation.immagine'} />}
                        value={groupList[groupIndex]?.image}
                        name="Image"
                        onChange={(e: any) => handleChangeInputFAQ(e, groupIndex, "image")}
                        required={false}
                    />
                </div>
                <Button variation="secondary" onClick={() => toggleModalUpdate(-1)}> <FormattedMessage id="admin-example.close-modal" /></Button>
                <Button variation="secondary" onClick={() => {
                    updateGroup()
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
                    deleteGroup(deleteItemId)
                    toggleModalDelete()
                }}><FormattedMessage id="admin-example.delete-category" /></Button>
            </Modal>
        </>
    )
}

export default CategoryList
