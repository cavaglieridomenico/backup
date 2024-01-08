import React, { useState, useEffect } from "react"
import styles from "./styles.css"
import { useLazyQuery } from "react-apollo"
import { FAQContextProvider } from "./context/context"
import getGroupsWithItsFaqs from "./graphql/getGroupsWithItsFaqs.graphql"
import { Helmet } from "vtex.render-runtime/react/components/RenderContext"
import { Link, useRuntime } from "vtex.render-runtime"
import { useFAQ } from "./context/context"
import ScrollToTop from "./utils/ScrollToTopButton"
import { Button } from "vtex.styleguide"
import FAQCategoriesMenuContainer from "./FAQCategoriesMenuContainer"
import { useIntl } from "react-intl"
import { useDevice } from "vtex.device-detector"
import xss from "xss"
//import getFaqGroups from "./graphql/getFaqGroups.graphql"
//import { backArrow, forwardArrow } from "./utils/vectors"

interface Group {
	groupName: string
	groupId: string
	faqs: FAQ[]
}
interface FAQ {
	id: string
	url: string
	metaTitle: string
	metaDescription: string
	question: string
	answer: string
	featuredFrom: boolean
	category: string
	group: string
}
export interface SubcategorySectionProps {
	slug: string
	name: string
	metaTitle: string
	metaDescription: string
	children: any
}

const SubcategorySection: StorefrontFunctionComponent<SubcategorySectionProps> = ({
	slug,
	name,
	metaTitle,
	metaDescription,
	children,
}) => {
	const subcategories = new Map<string, string>([
		["geschirrspueler", "geschirrspüler"],
		["kuehlschraenke", "kühlschränke"],
		["backoefen", "backöfen"],
	])

	/* const [selectedGroupFilter, setSelectedGroupFilter] = useState<
		string | undefined
	>("all") */
	//const [groupName, setGroupName] = useState<string>()
	//const [tagSetted, setTagSetted]: any = useState()
	const [idByUrl, setIdByUrl]: any = useState()
	const [totalScrollToRight, setTotalScrollToRight] = useState(false)

	const [
		getFaqs,
		{ data: FAQsByGroups, loading: FAQsByGroupsLoading },
	] = useLazyQuery(getGroupsWithItsFaqs)
	const { route } = useRuntime()
	/* const splittedUrl = window.location.pathname?.split('/')*/
	/* const idByUrl = splittedUrl[splittedUrl.length - 1].replace(/%20/g, ' ')  */
	const context: any = useFAQ()
	//const categories = context.categories

	// console.log("context---------------", context)

	useEffect(() => {
		if (route) {
			const splittedUrl = route.path
				?.split("/")
				.at(-1)
				.replace(/%20/g, " ")
			const normalizedText = decodeURIComponent(splittedUrl)
			setIdByUrl(normalizedText)
			/* splittedUrl
					.at(-1)
					.replace(/%20/g, " ")
					.normalize("NFKD")
					.replace(/[\u0300-\u036f]/g, ""),
				/* .replace(/%C3%BC/g, "ü"), */
		}
	}, [route])
	useEffect(() => {
		if (idByUrl || slug) {
			const alternativeSlug = context?.categories?.find(
				(item: any) => item.url == idByUrl,
			)?.id

			getFaqs({
				variables: {
					categoryId: slug ? slug : alternativeSlug,
					categoryName: name,
				},
			})
			/* getGroups({
				variables: {
					FatherCategory: slug ? slug : alternativeSlug,
				},
			}) */
		}
	}, [idByUrl, slug])

	const FAQs = FAQsByGroups?.getGroupsWithItsFaqs

	const topBanner = (children as any)?.find(
		(child: any) => child.props.id == "slider-layout#faqNoSupportBar",
	)
	const topBannerImage = (children as any)?.find(
		(child: any) => child.props.id == "flex-layout.row#faqTopImage",
	)

	const contextMetaTitle = context?.categories?.find(
		(item: any) => item.name == idByUrl,
	)?.metaTitle

	const intl = useIntl()
	const { isMobile } = useDevice()

	const scrollMenu = () => {
		const myDiv = window.document.querySelector(
			".bauknechtde-domande-frequenti-0-x-anchorButtonContainer",
		)
		if (myDiv) {
			setTotalScrollToRight(
				myDiv.scrollWidth - myDiv.clientWidth == myDiv.scrollLeft,
			)
		}
	}

	const groupData = FAQsByGroups?.getFaqGroups

	return (
		<>
			{/* COMPONENTE PER BAUKNECHTDE  */}
			<div className={styles.faqCategoryMainContainer}>
				<Helmet>
					<title>
						{metaTitle
							? `${metaTitle} | Bauknecht`
							: contextMetaTitle && `${contextMetaTitle} | Bauknecht`}
					</title>
					<meta
						name="description"
						content={metaDescription && metaDescription}
						data-react-helmet="true"
					/>
				</Helmet>
				{!isMobile && (
					<div className={styles.breadcrumbContainer}>
						<a href="/" className={styles.breadLink}>
							Home
						</a>
						<img
							className={styles.breadcrumbArrowImg}
							src="https://hotpointit.vtexassets.com/assets/vtex/assets-builder/hotpointit.whl-theme/0.0.12/arrowIconBread___45dc672a343ffb44bee2881e77a78310.svg"
							alt=""
						/>
						<a href="/kundencenter" className={styles.breadLink}>
							Kundencenter
						</a>
						<img
							className={styles.breadcrumbArrowImg}
							src="https://hotpointit.vtexassets.com/assets/vtex/assets-builder/hotpointit.whl-theme/0.0.12/arrowIconBread___45dc672a343ffb44bee2881e77a78310.svg"
							alt=""
						/>
						<a
							href="/kundencenter/haeufige-fragen"
							className={styles.breadLink}
						>
							Häufige fragen
						</a>
						<img
							className={styles.breadcrumbArrowImg}
							src="https://hotpointit.vtexassets.com/assets/vtex/assets-builder/hotpointit.whl-theme/0.0.12/arrowIconBread___45dc672a343ffb44bee2881e77a78310.svg"
							alt=""
						/>
						<a
							href={xss(
								`/kundencenter/haeufige-fragen/kategorie/${decodeURIComponent(
									name.replace(/%20/g, " "),
								)}`,
							)}
							className={styles.breadLink}
						>
							{/* {decodeURIComponent(name.replace(/%20/g, " "))} */}
							{subcategories.get(name) ?? name}
						</a>
					</div>
				)}
				<div>
					{topBanner}
					{topBannerImage}
				</div>

				<div className={styles.pageTitle}>
					<h1 className={styles.categoryTitle}>
						{/* {decodeURIComponent(name.replace(/%20/g, " "))} */}
						{/* {name ? name : categoryName} */}
						{subcategories.get(name) ?? name}
					</h1>
				</div>

				{FAQsByGroupsLoading ? (
					<div className={styles.loaderForm}></div>
				) : (
					<div /* className={styles.categoryMenu} */>
						<div className={styles.categoryMenu}>
							<div
								className={`${styles.anchorButtonContainer} 
									${totalScrollToRight ? styles.anchorButtonContainerTotalLeft : ""}`}
								onScroll={() => scrollMenu()}
							>
								{groupData?.map((group: any) => (
									<>
										{
											// @ts-ignore
											<Link
												className={styles.anchorButtonLinkContainer}
												href={`#${group.name}`}
											>
												<h3 className={styles.anchorButton}>{group.name}</h3>
												<img
													className={styles.anchorButtonImage}
													src={group.image}
												/>
											</Link>
										}
									</>
								))}
							</div>
						</div>
					</div>
				)}
				{/* Question */}

				<div className={styles.allQuestionsContainer}>
					{FAQs?.map((group: Group) => (
						<div id={group.groupName} className={styles.sectionMainContainer}>
							<h3 className={styles.subCategoryTitle}>{group.groupName}</h3>
							<div
								className={`${
									group.faqs.length == 1
										? styles.sectionSingleQuestionContainer
										: styles.sectionQuestionContainer
								}`}
							>
								{group?.faqs?.map((faq: FAQ) => (
									<>
										{
											// @ts-ignore
											<Link
												className={styles.questionTextContainer}
												page={"store.custom#single-faq"}
												params={{
													slug: faq.url,
													metaTitle: faq.metaTitle,
													metaDescription: faq.metaDescription,
													categoryName: name,
												}}
											>
												<p className={styles.questionText}>{faq.question}</p>
											</Link>
										}
									</>
								))}
							</div>
						</div>
					))}
				</div>

				<div className={styles.backToFaqContainer}>
					<Button variation="primary" href="/kundencenter/haeufige-fragen">
						<p>
							{intl.formatMessage({
								id: "store/domande-frequenti.buttonText",
							})}
						</p>
						<p className={styles.backToFaqButtonArrow}>{`>`}</p>
					</Button>
				</div>
				<div className={styles.textOverMenuMainContainer}>
					<p className={styles.textOverMenuContainer}>
						{intl.formatMessage({
							id: "store/domande-frequenti.textOverMenu",
						})}
					</p>
				</div>

				<FAQCategoriesMenuContainer categoryName={name} />

				<ScrollToTop />
			</div>
		</>
	)
}

const FAQContainer: StorefrontFunctionComponent = (props: any) => {
	return (
		<FAQContextProvider>
			<SubcategorySection
				name={props.params.name}
				slug={props.params.slug}
				metaTitle={props.params.metaTitle}
				metaDescription={props.params.metaDescription}
				children={props.children}
			/>
		</FAQContextProvider>
	)
}

FAQContainer.schema = {
	title: "editor.domande-frequenti.title",
	description: "editor.domande-frequenti.description",
	type: "object",
	properties: {},
}

export default FAQContainer
