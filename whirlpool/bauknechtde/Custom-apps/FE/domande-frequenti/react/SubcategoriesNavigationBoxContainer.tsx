import classNames from "classnames"
import { Link } from "vtex.render-runtime"
import styles from "./styles.css"
import { FAQContextProvider, useFAQ } from "./context/context"
import { useLazyQuery } from "react-apollo"
import getFaqGroups from "./graphql/getFaqGroups.graphql"
import React, { useEffect, useState } from "react"

interface Category {
	id: string
	image: string
	metaDescription: string
	metaTitle: string
	name: string
	url: string
}
interface Group {
	url: string
	name: string
	image: string
	id: string
}
interface SubcategoriesNavigationBoxProps {
	categoryName: string
}

const SubcategoriesNavigationBox: StorefrontFunctionComponent<
	SubcategoriesNavigationBoxProps
> = ({ categoryName = "" }) => {
	const [faqCategory, setFaqCategory] = useState<Category>()
	const [categoryGroups, setCategoryGroups]: any = useState([])
	const { categories, categoriesError } = useFAQ()

	useEffect(() => {
		if (categoriesError) {
			console.error("Categories query went wrong", categoriesError)
		}
	}, [categoriesError])

	const [getCategoryGroups, { data, loading }] = useLazyQuery(getFaqGroups, {
		onCompleted: () => {
			console.log("DATA----------", data)
			const newArray = data?.getFaqGroups ? data.getFaqGroups : []
			setCategoryGroups(newArray)
		},
	})

	useEffect(() => {
		console.log(categories, "categories")
		const category = categories?.find(
			(category: Category) => category.name === categoryName,
		)
		setFaqCategory(category)
		getCategoryGroups({
			variables: {
				FatherCategory: category.id,
			},
		})
	}, [categories])

	// const categoryGroups = groupsOfCategory?.getFaqGroups

	console.log("CATEGORY-NAME: " + categoryName)

	console.log(categoryGroups, "categoryGroups")

	return (
		<>
			{loading ? (
				<div className={classNames(styles.loaderForm)}></div>
			) : (
				<div className={classNames(styles.navigationBoxContainer)}>
					{
						// @ts-ignore
						<Link 
							page={"store.custom#subcategory"}
							params={{
								slug: faqCategory?.id,
								name: faqCategory?.name,
								metaTitle: faqCategory?.metaTitle,
								metaDescription: faqCategory?.metaDescription,
							}}
						>
							<h1 className={classNames(styles.navigationBoxCategoryTitle)}>
								{categoryName}
							</h1>
						</Link>
					}
					{/* CATEGORY GROUPS */}
					{categoryGroups &&
						categoryGroups.map((group: Group) => (
							<div className={classNames(styles.categoryGroupContainer)}>
								{/* <Link to={`/faq/kategorie/${categoryName}#${group.name}`}> */}
								{
									// @ts-ignore
									<Link
										page={"store.custom#subcategory"}
										params={{
											slug: faqCategory?.id,
											name: faqCategory?.url,
											metaTitle: faqCategory?.metaTitle,
											metaDescription: faqCategory?.metaDescription,
										}}
									>
										<p className={classNames(styles.categoryGroupName)}>
											{group.name}
										</p>
									</Link>
								}
							</div>
						))}
				</div>
			)}
		</>
	)
}

const SubcategoriesNavigationBoxContainer: StorefrontFunctionComponent<
	SubcategoriesNavigationBoxProps
> = ({ categoryName = "" }) => {
	return (
		<FAQContextProvider>
			<SubcategoriesNavigationBox categoryName={categoryName} />
		</FAQContextProvider>
	)
}

SubcategoriesNavigationBoxContainer.schema = {
	title: "editor.domande-frequenti.title",
	description: "editor.domande-frequenti.description",
	type: "object",
	properties: {},
}

export default SubcategoriesNavigationBoxContainer
