import React, { useEffect, useState, useRef } from "react"
import classnames from "classnames"
import { Link, useRuntime } from "vtex.render-runtime"
import styles from "./styles.css"
import { FAQContextProvider, useFAQ } from "./context/context"
import { backArrow, forwardArrow } from "./utils/vectors"
// import SearchFAQ from './SearchFAQ'

interface Category {
	id: string
	image: string
	metaDescription: string
	metaTitle: string
	name: string
	url: string
}

interface FAQCategoriesMenuProps {
	categoryName: string
}

const FAQCategoriesMenu: StorefrontFunctionComponent<
	FAQCategoriesMenuProps
> = ({ categoryName }) => {
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

	const ref = useRef<any>(0)
	const scroll = (scrollOffset: any) => {
		;(ref.current as any).scrollLeft += scrollOffset
	}
	const { deviceInfo } = useRuntime()
	const arrowBack = Buffer.from(backArrow).toString("base64")
	const arrowForward = Buffer.from(forwardArrow).toString("base64")

	return (
		<>
			{categoriesLoading ? (
				<div className={classnames(styles.loaderForm)}></div>
			) : (
				categories && (
					<div className={styles.categoryButtonMainContainer}>
						{deviceInfo.isMobile && (
							<img
								className={`${styles.arrows} ${styles.leftArrow}`}
								src={`data:image/svg+xml;base64,${arrowBack}`}
								onClick={() => scroll(-198)}
							/>
						)}
						<div className={styles.categoryButtonContainer} ref={ref}>
							{categories &&
								categories
									.filter((cat: Category) => cat.url !== categoryName)
									.map((cat: Category, index: any) => (
										<>
											{
												// @ts-ignore
												<Link
													page={"store.custom#subcategory"}
													params={{
														slug: cat.id,
														name: cat.url,
														metaTitle: cat.metaTitle,
														metaDescription: cat.metaDescription,
													}}
													className={classnames(styles.textDecoration)}
												>
													<div
														className={
															styles.categorysMenuButtonImgTextContainer
														}
														id={index}
													>
														<span
															className={
																selectedCategoryFilter === cat.id
																	? classnames(styles.selectedFilter)
																	: classnames(styles.filter)
															}
															onClick={() => {
																filterByCategory(cat.id)
																scroll(-9999)
															}}
														>
															<div
																className={classnames(
																	styles.categoryInnerContainer,
																)}
															>
																{cat.image && cat.image.length > 0 ? (
																	<div
																		className={classnames(
																			styles.categoryImageContainer,
																		)}
																	>
																		<img
																			src={cat.image}
																			className={classnames(
																				styles.categoryImage,
																			)}
																		/>
																	</div>
																) : (
																	<span
																		className={classnames(
																			styles.categoryImageUnavailable,
																		)}
																	>
																		Image not available
																	</span>
																)}
															</div>
															<div
																className={classnames(
																	styles.categoryInnerContainer,
																)}
															>
																<span
																	className={classnames(styles.categoryName)}
																>
																	{cat.name}
																</span>
															</div>
														</span>
													</div>
												</Link>
											}
										</>
									))}
						</div>
						{deviceInfo.isMobile && (
							<img
								className={styles.arrows}
								src={`data:image/svg+xml;base64,${arrowForward}`}
								onClick={() => scroll(+198)}
							/>
						)}
					</div>
				)
			)}

			{/* <SearchFAQ></SearchFAQ> */}
			{/* <hr className={classnames(styles.hrUnderSearchBar)}></hr> */}
			{/* {categoriesLoading ? (
				<div className={classnames(styles.loaderForm)}></div>
			) : (
				<div className={classnames(styles.generalContainer)}>
					{/* CATEGORIES }
					<div
						className={classnames(
							styles.filtersFirstLevel,
							styles.filters,
							"w100",
						)}
					>
						<div className={classnames(styles.filterWrapper)}>
							<ul className={styles.categoryListContainer} ref={ref}>
								<button onClick={() => scroll(+20)}>LEFT</button>
								{categories &&
									categories
										.filter(
											(cat: Category) =>
												cat.name !== decodeURIComponent(categoryName),
										)
										.map((cat: Category) => (
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
																<div
																	className={classnames(
																		styles.categoryInnerContainer,
																	)}
																>
																	{cat.image && cat.image.length > 0 ? (
																		<div
																			className={classnames(
																				styles.categoryImageContainer,
																			)}
																		>
																			<img
																				src={cat.image}
																				className={classnames(
																					styles.categoryImage,
																				)}
																			/>
																		</div>
																	) : (
																		<span
																			className={classnames(
																				styles.categoryImageUnavailable,
																			)}
																		>
																			Image not available
																		</span>
																	)}
																</div>
																<div
																	className={classnames(
																		styles.categoryInnerContainer,
																	)}
																>
																	<span
																		className={classnames(styles.categoryName)}
																	>
																		{cat.name}
																	</span>
																</div>
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
			)} */}
		</>
	)
}

const FAQCategoriesMenuContainer: StorefrontFunctionComponent<
	FAQCategoriesMenuProps
> = ({ categoryName = "" }) => {
	return (
		<FAQContextProvider>
			<FAQCategoriesMenu categoryName={categoryName} />
		</FAQContextProvider>
	)
}

FAQCategoriesMenuContainer.schema = {
	title: "editor.domande-frequenti.title",
	description: "editor.domande-frequenti.description",
	type: "object",
	properties: {},
}

export default FAQCategoriesMenuContainer
