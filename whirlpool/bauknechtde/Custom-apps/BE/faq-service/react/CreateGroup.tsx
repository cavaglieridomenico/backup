import { FC, useEffect } from 'react'
import React from 'react'
import { Input } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, Button, PageHeader } from 'vtex.styleguide'
import styles from './style.css'

interface createGroupProps {
    newGroup: NewGroup,
    setNewGroup: any,
    setRouteGroup: any,
    arrayCategory: any,
    selectedCategory: any;
    setSelectedCategory: any;
}
interface NewGroup {
    name: string,
    url: string,
    id: string,
    image: string,
    fatherCategory: string,
    category: string
}

const CreateGroup: FC<createGroupProps> = (
    { newGroup, setNewGroup, setRouteGroup, arrayCategory, selectedCategory, setSelectedCategory }
) => {

    const submitValue = () => {
        console.log(newGroup)

        const obj = {
            "url": newGroup.url,
            "name": newGroup.name,
            "image": newGroup.image,
            "fatherCategory": newGroup.category
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        }

        fetch('/_v/faq/categorygroup', options).then((response) =>
            response.ok ? response.json() : Promise.resolve({ error: true })
        ).then((res) => {
            setNewGroup({ ...newGroup, id: res.groupId, url: res.url, catName:res.catName })
            setRouteGroup('')
        }
        )
    }

    useEffect(() => {
        if (newGroup.id != '') {
            setRouteGroup('')
        }
    }, [newGroup])

    return (
        <Layout
            pageHeader={
                <PageHeader
                    title={<FormattedMessage id="admin-example.create-group" />}
                />
            }
        >
            <PageBlock variation="full">
                <div className={styles.formWrapper}>
                    <div className={styles.formWrapper}>
                        <Input
                            label={<FormattedMessage id="admin-example.navigation.name" />}
                            value={newGroup.name}
                            name="Name"
                            onChange={(e: any) => setNewGroup({ ...newGroup, name: e.target.value })}
                            required={false}
                        />
                    </div>
                    {/* <div className={styles.formWrapper}>
                        <Input
                            label={<FormattedMessage id="admin-example.navigation.url" />}
                            value={newGroup.url}
                            name="Immagine"
                            onChange={(e: any) => setNewGroup({ ...newGroup, url: e.target.value })}
                            required={false}
                        />
                    </div> */}
                    <div className={styles.formWrapper}>
                        <Input
                            label={<FormattedMessage id={'admin-example.navigation.immagine'} />}
                            value={newGroup.image}
                            name="Immagine"
                            onChange={(e: any) => setNewGroup({ ...newGroup, image: e.target.value })}
                            required={false}
                        />
                    </div>
                    <div className={styles.formWrapper}>
                        <select
                            placeholder="Categorie"
                            onChange={(e: any) => {
                                setSelectedCategory(e.target.selectedOptions[0].id),
                                    setNewGroup({ ...newGroup, category: e.target.selectedOptions[0].id, categoryName: e.target.selectedOptions[0].value })
                            }}
                        >
                            <option
                                id='default'
                                selected={true}
                            //disabled
                            >Tutte le categorie</option>
                            {arrayCategory?.map((cat: any) =>
                                <option id={cat.id}
                                    value={cat.name}
                                    selected={cat.id == selectedCategory}
                                >{cat.name}</option>
                            )}
                        </select>
                    </div>
                </div>
                <Button onClick={submitValue} variation="secondary">
                    <FormattedMessage id="admin-example.navigation.salva-gruppo" />
                </Button>
                <Button
                    onClick={() => setRouteGroup('')}
                > <FormattedMessage id="admin-example.navigation.back-button" /> </Button>
            </PageBlock>
        </Layout>

    )
}

export default CreateGroup
