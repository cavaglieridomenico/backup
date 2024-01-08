import React, { useEffect, useState } from "react"
import classnames from "classnames"
import { Link } from "vtex.render-runtime"
import styles from "./styles.css"
import { FAQContextProvider, useFAQ } from "./context/context"
// import SearchFAQ from './SearchFAQ'
import DomandePiuFrequenti from "./DomandePiuFrequenti"
interface DomandeFrequentiProps {}
interface Category {
	id: string
	image: string
	metaDescription: string
	metaTitle: string
	name: string
	url: string
}

const DomandeFrequenti: StorefrontFunctionComponent<
	DomandeFrequentiProps
> = () => {
	const { categories, categoriesError, categoriesLoading, getFaqsByCategory } =
		useFAQ()
	const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
		string | undefined
	>("all")

	useEffect(() => {
		if (categoriesError) {
			console.error("Categories query went wrong", categoriesError)
		}
	}, [categoriesError])

	//Filter Category management
	const filterByCategory = (categoryId: string) => {
		setSelectedCategoryFilter(categoryId)
		getFaqsByCategory(categoryId)
	}

	return (
		<>
			{/* <SearchFAQ></SearchFAQ> */}
			<hr className={classnames(styles.hrUnderSearchBar)}></hr>
			{categoriesLoading ? (
				<div className={classnames(styles.loaderForm)}></div>
			) : (
				<div className={classnames(styles.generalContainer)}>
					<span className={classnames(styles.filterPer)}>Filtra per: </span>
					{/* CATEGORIES */}
					<div
						className={classnames(
							styles.filtersFirstLevel,
							styles.filters,
							"w100",
						)}
					>
						<div className={classnames(styles.filterWrapper)}>
							<ul>
								{categories &&
									categories.map((cat: Category) => (
										<>
											{
												// @ts-ignore
												<Link
													page={"store.custom#subcategory"}
													params={{
														slug: cat.id,
														name: cat.name,
														metaTitle: cat.metaTitle,
														metaDescription: cat.metaDescription,
													}}
													className={classnames(styles.textDecoration)}
												>
													<li>
														<span
															className={
																selectedCategoryFilter === cat.id
																	? classnames(styles.selectedFilter)
																	: classnames(styles.filter)
															}
															onClick={() => filterByCategory(cat.id)}
														>
															<span>{cat.name}</span>
														</span>
													</li>
												</Link>
											}
										</>
									))}
							</ul>
						</div>
					</div>
				</div>
			)}
			<DomandePiuFrequenti />
		</>
	)
}

const CategoriesContainer: StorefrontFunctionComponent = () => {
	return (
		<FAQContextProvider>
			<DomandeFrequenti />
		</FAQContextProvider>
	)
}

CategoriesContainer.schema = {
	title: "editor.domande-frequenti.title",
	description: "editor.domande-frequenti.description",
	type: "object",
	properties: {},
}

export default CategoriesContainer
