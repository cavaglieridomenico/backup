import classNames from "classnames"
import React, { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import styles from "./styles.css"
import { Link } from "vtex.render-runtime"
import { useDevice } from "vtex.device-detector"
import ArrowDown from "./assets/angle-down.png"
import ArrowUp from "./assets/angle-up.png"
import Minus from "./assets/minus.png"
import Plus from "./assets/plus.png"
import { FAQContextProvider } from "./context/context"
import { useQuery } from "react-apollo"
import getFaq from "./graphql/getFaq.graphql"

interface SearchFAQProps {
	children: any
}

const DomandePiuFrequenti: StorefrontFunctionComponent<SearchFAQProps> = ({
	children,
}) => {
	const [mostFrequentFAQ, setMostFrequentFAQ]: any = useState()

	const { isMobile } = useDevice()
	console.log(isMobile)

	/* Calling this query is effective because the results of the query are already sorted by "featuredFrom" */
	/* Otherwise, a dedicated query shall be exposed from the backend */ 
	const { data, loading } = useQuery(getFaq, {
		variables: {
			pageSize: 12,
		},
	})

	const handleButtonClick = (index: any) => {
		let openFaq = [...mostFrequentFAQ]
		openFaq[index].isOpen = !openFaq[index].isOpen
		setMostFrequentFAQ(openFaq)
	}

	useEffect(() => {
		// getMostAskedFaqs()
		// const mockedFaqs = [{
		//     url: "test8",
		//     question: "test8",
		//     answer: "test8",
		//     metaTitle: "test8",
		//     metaDescription: "Q&A online Kauf-Allgemein",
		//     categoryName: "Q&A online Kauf",
		// },
		// {
		//     url: "was-ist-mit-lieferung-zum-verwendungsort-gemeint-liefert-die-spedition-auch-die-treppe-hinauf-bis-ins-gewunschte-stockwerk",
		//     question: "Was ist mit Lieferung zum Verwendungsort gemeint? Liefert die Spedition auch die Treppe hinauf bis ins gewünschte Stockwerk?",
		//     answer: "Die Lieferung erfolgt sofern möglich bis zu dem Ort, an dem das Gerät aufgestellt werden soll. Bevor Sie Ihre Bestellung aufgeben sollten Sie überprüfen, ob die Abmessungen der von Ihnen bestellten Produkte der Größe Ihrer Haustür(en) entsprechen und die Breite Ihres Flurs oder Korridors nicht überschreiten. Die entsprechenden Informationen finden Sie auf der Detailseite des jeweiligen Produkts. Bitte beachten Sie, dass unser Dienstleister folgende Leistung ausschließt: Sendungen, bei denen die vom Auftraggeber bezeichnete Abholadresse oder die Zustelladresse ungeeignet oder nur unter unverhältnismäßigen Schwierigkeiten erreichbar ist (insbesondere die Tragestrecke zum Anliefer-/ Abholort mehr als 150 m beträgt oder ein geeigneter Fahrstuhl ab der 5. Etage nicht vorhanden ist) oder für deren Einlieferung oder Zustellung besondere Aufwendungen (Hebearbeiten, Anschluss nicht zugänglich etc.) oder Sicherheitsmaßnahmen erforderlich sind.",
		//     metaTitle: "was-ist-mit-lieferung-zum-verwendungsort-gemeint-liefert-die-spedition-auch-die-treppe-hinauf-bis-ins-gewunschte-stockwerk",
		//     metaDescription: "Q&A online Kauf-Lieferung",
		//     categoryName: "Q&A online Kauf",
		// }]
		let mockedFaqs = [...data?.getFaq].filter(
			(faq: any) => faq.featuredFrom === true,
		)
		let freqQuestion = [...mockedFaqs]
		freqQuestion.map((sfaq: any) => {
			console.log("FAQ:----------------------- ", JSON.stringify(sfaq))
			return (sfaq.isOpen = false)
		})
		setMostFrequentFAQ(freqQuestion)
	}, [data])

	return (
		<>
			{mostFrequentFAQ && (
				<>
					<div className={styles.textOverMenuMainContainer}>
						<h4 className={classNames(styles.mostFaqMainPageText)}>
							<FormattedMessage id="domande-frequenti.domande-piu-frequenti" />
						</h4>
					</div>

					{loading ? (
						<div className={classNames(styles.loaderForm)}></div>
					) : (
						<div className={classNames(styles.mostFrequentContainer)}>
							<div className={classNames(styles.firstCol)}>
								{mostFrequentFAQ?.map((faq: any, index: number) => (
									<>
										{index < mostFrequentFAQ?.length / 2 ? (
											<div
												className={classNames(
													styles.mostFrequentSingleContainerWrapper,
												)}
											>
												<div
													className={
														mostFrequentFAQ[index].isOpen
															? classNames(
																	styles.mostFrequentSingleContainerOpen,
															  )
															: classNames(styles.mostFrequentSingleContainer)
													}
												>
													<div
														className={classNames(styles.questionMostFrequent)}
													>
														<p className={classNames(styles.spanQuestion)}>
															{faq.question}
														</p>
													</div>
													{mostFrequentFAQ[index].isOpen ? (
														<div
															className={classNames(styles.answerMostFrequent)}
														>
															<p>
																{faq.answer.length < 125
																	? faq.answer
																	: faq.answer.substring(0, 122) + "..."}
															</p>
															{
																// @ts-ignore
																<Link
																	page={"store.custom#single-faq"}
																	params={{
																		slug: faq.url,
																		metaTitle: faq.metaTitle,
																		metaDescription: faq.metaDescription,
																		categoryName: faq.categoryName,
																		// categoryId: faq.category,
																	}}
																	className={classNames(
																		styles.readCompleteAnswer,
																	)}
																>
																	{/* <FormattedMessage
																		id={"domande-frequenti.read-more"}
																	/> */}
																	{children ? children : <></>}
																</Link>
															}
														</div>
													) : null}
												</div>
												<button
													className={classNames(styles.buttonDetailQuestion)}
													onClick={() => {
														handleButtonClick(index)
													}}
												>
													{!isMobile ? (
														mostFrequentFAQ[index].isOpen ? (
															<img
																src={Minus}
																className={styles.minusAndPlusImg}
															/>
														) : (
															<img
																src={Plus}
																className={styles.minusAndPlusImg}
															/>
														)
													) : mostFrequentFAQ[index].isOpen ? (
														<img
															src={ArrowUp}
															className={styles.minusAndPlusImg}
														></img>
													) : (
														<img
															src={ArrowDown}
															className={styles.minusAndPlusImg}
														></img>
													)}
												</button>
											</div>
										) : null}
									</>
								))}
							</div>
							<div className={classNames(styles.secondCol)}>
								{mostFrequentFAQ?.map((faq: any, index: number) => (
									<>
										{index >= mostFrequentFAQ?.length / 2 ? (
											<div
												className={classNames(
													styles.mostFrequentSingleContainerWrapper,
												)}
											>
												<div
													className={
														mostFrequentFAQ[index].isOpen
															? classNames(
																	styles.mostFrequentSingleContainerOpen,
															  )
															: classNames(styles.mostFrequentSingleContainer)
													}
												>
													<div
														className={classNames(styles.questionMostFrequent)}
													>
														<p className={classNames(styles.spanQuestion)}>
															{faq.question}
														</p>
													</div>
													{mostFrequentFAQ[index].isOpen ? (
														<div
															className={classNames(styles.answerMostFrequent)}
														>
															<p>
																{faq.answer.length < 125
																	? faq.answer
																	: faq.answer.substring(0, 122) + "..."}
															</p>
															{
																// @ts-ignore
																<Link
																	page={"store.custom#single-faq"}
																	params={{
																		slug: faq.url,
																		metaTitle: faq.metaTitle,
																		metaDescription: faq.metaDescription,
																		categoryName: faq.categoryName,
																		// categoryId: faq.category,
																	}}
																	className={classNames(
																		styles.readCompleteAnswer,
																	)}
																>
																	{/* <FormattedMessage
																		id={"domande-frequenti.read-more"}
																	/> */}
																	{children ? children : <></>}
																</Link>
															}
														</div>
													) : null}
												</div>
												<button
													className={classNames(styles.buttonDetailQuestion)}
													onClick={() => {
														handleButtonClick(index)
													}}
												>
													{!isMobile ? (
														mostFrequentFAQ[index].isOpen ? (
															<img
																src={Minus}
																className={styles.minusAndPlusImg}
															/>
														) : (
															<img
																src={Plus}
																className={styles.minusAndPlusImg}
															/>
														)
													) : mostFrequentFAQ[index].isOpen ? (
														<img
															src={ArrowUp}
															className={styles.minusAndPlusImg}
														></img>
													) : (
														<img
															src={ArrowDown}
															className={styles.minusAndPlusImg}
														></img>
													)}
												</button>
											</div>
										) : null}
									</>
								))}
							</div>
						</div>
					)}
				</>
			)}
		</>
	)
}

const DomandePiuFrequentiContainer: StorefrontFunctionComponent = (
	props: any,
) => {
	return (
		<FAQContextProvider>
			<DomandePiuFrequenti children={props.children} />
		</FAQContextProvider>
	)
}

DomandePiuFrequentiContainer.schema = {
	title: "editor.DomandePiuFrequenti.title",
	description: "editor.DomandePiuFrequenti.description",
	type: "object",
	properties: {},
}

export default DomandePiuFrequentiContainer
