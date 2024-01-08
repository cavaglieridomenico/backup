import { FC, useEffect } from 'react'
import React from 'react'
import { Input } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { Layout, PageBlock, Button, PageHeader } from 'vtex.styleguide'
import styles from './style.css'

interface createCategoryProps {
    newCategory: NewCategory,
    setNewCategory: any,
    setRoute: any
}
interface NewCategory {
    name: string,
    metaDescription: string,
    url: string,
    id: string,
    title: string,
    image: string
}

const CreateCategory: FC<createCategoryProps> = (
    { newCategory, setNewCategory, setRoute }
) => {

    const submitValue = () => {

        const obj = {
            // "url": newCategory.url,
            "name": newCategory.name,
            // "metaTitle": newCategory.title,
            // "metaDescription": newCategory.metaDescription,
            "image": newCategory.image
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        }

        console.log(obj)
        debugger

        fetch('/_v/faq/new-category', options).then((response) =>
            response.ok ? response.json() : Promise.resolve({ error: true })
        ).then((res) => {
            setNewCategory({ ...newCategory, id: res.idCategory, title: res.metaTitle, metaDescription: res.metaDescription, url: res.url })
        }
        )
    }

    useEffect(() => {
        if (newCategory.id != '') {
            setRoute('')
        }
    }, [newCategory])

    return (
        <Layout
            pageHeader={
                <PageHeader
                    title={<FormattedMessage id="admin-example.create-category" />}
                />
            }
        >
            <PageBlock variation="full">
                <div className={styles.formWrapper}>
                    <h1>Categoria</h1>
                    <div className={styles.formWrapper}>
                        <Input
                            label="Name"
                            value={newCategory.name}
                            name="Immagine"
                            onChange={(e: any) => setNewCategory({ ...newCategory, name: e.target.value })}
                            required={false}
                        />
                    </div>
                    {/* <div className="inputWrapper">
                        <Input
                            label={<FormattedMessage id={'admin-example.navigation.titolo'} />}
                            value={newCategory.title}
                            name="title"
                            onChange={(e: any) => setNewCategory({ ...newCategory, title: e.target.value })}
                            required={true}
                        />
                    </div>
                    <div className={styles.formWrapper}>
                        <Input
                            label={<FormattedMessage id={'admin-example.navigation.descrizione'} />}
                            value={newCategory.metaDescription}
                            name="Description"
                            onChange={(e: any) => setNewCategory({ ...newCategory, metaDescription: e.target.value })}
                            required={true}
                        />
                    </div>
                    <div className={styles.formWrapper}>
                        <Input
                            label="Url"
                            value={newCategory.url}
                            name="Immagine"
                            onChange={(e: any) => setNewCategory({ ...newCategory, url: e.target.value })}
                            required={false}
                        />
                    </div> */}
                    <div className={styles.formWrapper}>
                        <Input
                            label={<FormattedMessage id={'admin-example.navigation.immagine'} />}
                            value={newCategory.image}
                            name="Immagine"
                            onChange={(e: any) => setNewCategory({ ...newCategory, image: e.target.value })}
                            required={false}
                        />
                    </div>
                </div>
                <Button onClick={submitValue} variation="secondary">
                    <FormattedMessage id="admin-example.navigation.salva-categoria" />
                </Button>
                <Button
                    onClick={() => setRoute('')}
                > <FormattedMessage id="admin-example.navigation.back-button" /> </Button>
            </PageBlock>
        </Layout>

    )
}

export default CreateCategory
