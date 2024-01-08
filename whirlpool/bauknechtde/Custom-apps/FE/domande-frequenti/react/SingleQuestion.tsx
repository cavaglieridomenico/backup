import React from "react"
import classnames from "classnames"
import styles from "./styles"
import { useQuery } from "react-apollo"
//import { Link } from "vtex.render-runtime"
import { Button } from "vtex.styleguide"
import { Helmet } from "vtex.render-runtime/react/components/RenderContext"
import getFaqByUrl from "./graphql/getFaqByUrl.graphql"
import FAQCategoriesMenuContainer from "./FAQCategoriesMenuContainer"
import { index as RichText } from "vtex.rich-text"
import { useDevice } from "vtex.device-detector"
// import SubcategoriesNavigationBoxContainer from "./SubcategoriesNavigationBoxContainer"
import { useIntl } from "react-intl"
import { canUseDOM } from "vtex.render-runtime"
import breadcrumbSanitizer from "./utils/breadcrumbSanitizer"

export interface SingleQuestionProps {
	params: any
	SupportBar: any
	topBannerImageUrl: string
	backToMainFAQText: string
	otherCategoriesText: string
}
const SingleQuestion = (props: SingleQuestionProps) => {
	const slug = props.params.slug
	// const metaTitle = props.params.metaTitle
	// const metaDescription = props.params.metaDescription
	// const isTagSetted = props.params.isTagSetted
	// const categoryId = props.params.categoryId
	const categoryName = props.params.categoryName

	const { isMobile } = useDevice()

	const { data: singolaFAQ } = useQuery(getFaqByUrl, {
		variables: {
			url: slug,
		},
	})

	const singleQuestion = singolaFAQ?.getFaqByUrl[0]

	// const handleBackClick = () => {
	//   if (isTagSetted == "true") {
	//     history.go(-2)
	//   } else {
	//     history.go(-1)
	//   }
	// }
	const intl = useIntl()

	// ---- structured data ---- //

	const saniSingleQuestion = breadcrumbSanitizer(singleQuestion?.categoryName)

	const structuredDataFAQ = () => {
		if (singleQuestion) {
			if (singleQuestion.answer && singleQuestion.question) {
				const structuredJSON = {
					"@context": "https://schema.org",
					"@type": "FAQPage",
					mainEntity: [
						{
							"@type": "Question",
							//@ts-ignore
							name: singleQuestion?.question,
							acceptedAnswer: {
								"@type": "Answer",
								//@ts-ignore
								text: singleQuestion?.answer.includes("<")
									? singleQuestion?.answer.replace(/<[^>]*>?/gm, "")
									: singleQuestion?.answer,
							},
						},
					],
				}
				if (canUseDOM) {
					const faqScript = document.getElementById("faq-script")
					if (!faqScript) {
						console.log(
							"🚀 ~ file: SingleQuestion.tsx ~ line 7zz ~ structuredDataFAQ ~ structuredJSON",
							structuredJSON,
						)
						let script = document.createElement("script")
						script.type = "application/ld+json"
						script.id = "faq-script"
						script.innerHTML = JSON.stringify(structuredJSON)
						document.head.appendChild(script)
					}
				}
			} else structuredDataFAQ()
		}
	}
	structuredDataFAQ()

	// ---- end of structured data ---- //
	return (
		<>
			<Helmet>
				<title>{singleQuestion?.metaTitle + " - Bauknecht"}</title>
				<meta
					name="description"
					content={singleQuestion?.metaDescription}
					data-react-helmet="true"
				/>
			</Helmet>{" "}
			{!isMobile ? (
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
					<a href="/kundencenter/haeufige-fragen" className={styles.breadLink}>
						Häufige fragen
					</a>
					<img
						className={styles.breadcrumbArrowImg}
						src="https://hotpointit.vtexassets.com/assets/vtex/assets-builder/hotpointit.whl-theme/0.0.12/arrowIconBread___45dc672a343ffb44bee2881e77a78310.svg"
						alt=""
					/>
					{/* 		<li className={classnames(styles.breadcrumbItem)}>
							 THIS ITEM SHOULD BE ABOUT THE PRODUCT RELATED QUESTIONS 
							{/* <a href={`/faq/${categoryName}/${categoryId}`}>
              <span>{categoryName?.replace(/%20/g, " ")}</span>
            </a> 
						</li> */}
					<a
						href={`/kundencenter/haeufige-fragen/kategorie/${
							singleQuestion && saniSingleQuestion
								? saniSingleQuestion
								: categoryName?.replace(/%20/g, " ")
						}`}
						className={styles.breadLink}
					>
						{singleQuestion ? singleQuestion.categoryName : categoryName}
					</a>
					<img
						className={styles.breadcrumbArrowImg}
						src="https://hotpointit.vtexassets.com/assets/vtex/assets-builder/hotpointit.whl-theme/0.0.12/arrowIconBread___45dc672a343ffb44bee2881e77a78310.svg"
						alt=""
					/>
					<a className={styles.breadcrumbEnd}>{singleQuestion?.question}</a>
					{/* <li className={classnames(styles.breadcrumbItem)}>
            <a href={`/faq/${categoryName}/${categoryId}`}>
              <span>{categoryName?.replace(/%20/g, " ")}</span>
            </a>
          </li> */}
					{/* <li className={classnames(styles.breadcrumbItem)}>
            <a onClick={() => handleBackClick()}>
              <span>{singleQuestion?.groupName}</span>
            </a>
          </li> */}
				</div>
			) : (
				<div className={styles.breadcrumbsMobileCustom}>
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
					<a href="/kundencenter/haeufige-fragen" className={styles.breadLink}>
						Häufige fragen
					</a>
					<img
						className={styles.breadcrumbArrowImg}
						src="https://hotpointit.vtexassets.com/assets/vtex/assets-builder/hotpointit.whl-theme/0.0.12/arrowIconBread___45dc672a343ffb44bee2881e77a78310.svg"
						alt=""
					/>
					{/* 		<li className={classnames(styles.breadcrumbItem)}>
							 THIS ITEM SHOULD BE ABOUT THE PRODUCT RELATED QUESTIONS 
							{/* <a href={`/faq/${categoryName}/${categoryId}`}>
              <span>{categoryName?.replace(/%20/g, " ")}</span>
            </a> 
						</li> */}
					<a
						href={`/kundencenter/haeufige-fragen/kategorie/${
							singleQuestion && saniSingleQuestion
								? saniSingleQuestion
								: categoryName?.replace(/%20/g, " ")
						}`}
						className={styles.breadLink}
					>
						{singleQuestion ? singleQuestion.categoryName : categoryName}
					</a>
					<img
						className={styles.breadcrumbArrowImg}
						src="https://hotpointit.vtexassets.com/assets/vtex/assets-builder/hotpointit.whl-theme/0.0.12/arrowIconBread___45dc672a343ffb44bee2881e77a78310.svg"
						alt=""
					/>
					<a className={styles.breadcrumbEnd}>{singleQuestion?.question}</a>
					{/* <li className={classnames(styles.breadcrumbItem)}>
            <a href={`/faq/${categoryName}/${categoryId}`}>
              <span>{categoryName?.replace(/%20/g, " ")}</span>
            </a>
          </li> */}
					{/* <li className={classnames(styles.breadcrumbItem)}>
            <a onClick={() => handleBackClick()}>
              <span>{singleQuestion?.groupName}</span>
            </a>
          </li> */}
				</div>
			)}
			<props.SupportBar />
			<div className={classnames(styles.topBannerImageContainer)}>
				<img
					className={classnames(styles.topBannerImage)}
					src={props.topBannerImageUrl}
				/>
			</div>
			{singleQuestion ? (
				<>
					<div className={classnames(styles.singleQuestionTitle)}>
						<RichText text={"# " + singleQuestion?.question} />
					</div>
					<div className={classnames(styles.container)}>
						<div className={classnames(styles.faqPage)}>
							{/* <div className={classnames(styles.singleQuestion)}>
                {singleQuestion?.question}
              </div> */}
							{/* <div className={classnames(styles.navigationAndAnswerWrapper)}> */}
							{/* <div className={classnames(styles.navigationWrapper)}>
									<SubcategoriesNavigationBoxContainer
										categoryName={singleQuestion.categoryName}
									/>
								</div> */}
							<div>
								<div className={classnames(styles.singleAnswer)}>
									<div
										className={styles.answerText}
										dangerouslySetInnerHTML={{
											__html: singleQuestion.answer,
										}}
									></div>
								</div>
								{/* <Button
                  className={classnames(styles.buttonContainer)}
                  onClick={() => handleBackClick()}
                  variation="primary"
                  >
                    <p>{props.backToMainFAQText}</p>
                  </Button> */}
								<div className={classnames(styles.backToFaqContainer)}>
									<Button
										variation="primary"
										href="/kundencenter/haeufige-fragen"
										block
									>
										<p>
											{intl.formatMessage({
												id: "store/domande-frequenti.buttonText",
											})}
										</p>
										{/* <p className={styles.backToFaqButtonArrow}>{`>`}</p> */}
									</Button>
									{/* {
											// @ts-ignore
											<Link
												className={classnames(styles.backToFaqLink)}
												to="/kundencenter/haeufige-fragen"
												variation="primary"
											>
												{intl.formatMessage({
													id: "store/domande-frequenti.buttonText",
												})}
												{/* <RichText text={props.backToMainFAQText} /> }
											</Link>
										} */}
								</div>
								<hr className={classnames(styles.hrUnderSearchBar)}></hr>
							</div>
							{/* </div> */}
							<div className={styles.textOverMenuMainContainer}>
								{/* <span className={classnames(styles.textOverMenuContainer)}>
									<RichText text={props.otherCategoriesText} />
								</span> */}
								<p className={styles.textOverMenuContainer}>
									{intl.formatMessage({
										id: "store/domande-frequenti.textOverMenu",
									})}
								</p>
							</div>
							<FAQCategoriesMenuContainer
								categoryName={singleQuestion?.categoryName}
							/>
						</div>
					</div>
				</>
			) : (
				<></>
			)}
		</>
	)
}

SingleQuestion.schema = {
	title: "editor.singleQuestion.title",
	description: "editor.singleQuestion.description",
	type: "object",
	properties: {
		topBannerImageUrl: {
			title: "Top Banner Image URL",
			description: "Here you can change the URL of the top banner image",
			default: "",
			type: "string",
		},
		backToMainFAQText: {
			title: "Back To Main FAQ Text",
			description:
				"Here you can change the text of the button to go back to the main FAQ page",
			default: "Back to FAQ",
			type: "string",
		},
		otherCategoriesText: {
			title: "Other Categories Text",
			description:
				"Here you can change the text above the other categories menu",
			default: "__Jump to other FAQ -__",
			type: "string",
		},
	},
}

export default SingleQuestion
