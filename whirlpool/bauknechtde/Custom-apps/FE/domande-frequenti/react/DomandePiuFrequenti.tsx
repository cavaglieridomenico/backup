import classNames from "classnames"
import React, { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import styles from "./styles.css"
import { Link } from "vtex.render-runtime"
import { useDevice } from "vtex.device-detector"
import ArrowDown from "../react/assets/angle-down.png"
import ArrowUp from "../react/assets/angle-up.png"

const DomandePiuFrequenti = () => {
	const [mostFrequentFAQ, setMostFrequentFAQ]: any = useState()

	const { isMobile } = useDevice()
	console.log(isMobile)

	const handleButtonClick = (index: any) => {
		let openFaq = [...mostFrequentFAQ]
		openFaq[index].isOpen = !openFaq[index].isOpen
		setMostFrequentFAQ(openFaq)
	}

	useEffect(() => {
		const url = `/_v/faq/most-asked-questions`
		const options = {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		}
		try {
			fetch(url, options)
				.then((res) => res.json())
				.then((json) => {
					let freqQuestion = [...json]
					freqQuestion.map((sfaq: any) => {
						return (sfaq.isOpen = false)
					})
					setMostFrequentFAQ(freqQuestion)
				})
		} catch (error) {}
	}, [])

	return (
		// @ts-ignore
		<>
			{mostFrequentFAQ && (
				<>
					<h3 className={classNames(styles.FAQMoreFrequentTitle)}>
						<FormattedMessage id="domande-frequenti.domande-piu-frequenti" />
					</h3>
					<div className={classNames(styles.mostFrequentContainer)}>
						<div className={classNames(styles.firstCol)}>
							{mostFrequentFAQ?.map((faq: any, index: number) => (
								<>
									{index < mostFrequentFAQ?.length / 2 ? (
										<div
											className={
												mostFrequentFAQ[index].isOpen
													? classNames(styles.mostFrequentSingleContainerOpen)
													: classNames(styles.mostFrequentSingleContainer)
											}
										>
											<div className={classNames(styles.questionMostFrequent)}>
												<p className={classNames(styles.spanQuestion)}>
													{faq.question}
													<button
														className={classNames(styles.buttonDetailQuestion)}
														onClick={() => {
															handleButtonClick(index)
														}}
													>
														{!isMobile ? (
															mostFrequentFAQ[index].isOpen ? (
																"-"
															) : (
																"+"
															)
														) : mostFrequentFAQ[index].isOpen ? (
															<img src={ArrowUp}></img>
														) : (
															<img src={ArrowDown}></img>
														)}
													</button>
												</p>
											</div>
											{mostFrequentFAQ[index].isOpen ? (
												<div className={classNames(styles.answerMostFrequent)}>
													<p>{faq.answer.substring(0, 122)}...</p>
													{
														// @ts-ignore
														<Link
															page={"store.custom#single-faq"}
															params={{
																slug: faq.url,
																metaTitle: faq.metaTitle,
																metaDescription: faq.metaDescription,
																categoryName: faq.categoryName,
																categoryId: faq.category,
															}}
															className={classNames(styles.readCompleteAnswer)}
														>
															Leggi di più
														</Link>
													}
												</div>
											) : null}
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
											className={
												mostFrequentFAQ[index].isOpen
													? classNames(styles.mostFrequentSingleContainerOpen)
													: classNames(styles.mostFrequentSingleContainer)
											}
										>
											<div className={classNames(styles.questionMostFrequent)}>
												<p className={classNames(styles.spanQuestion)}>
													{faq.question}
													<button
														className={classNames(styles.buttonDetailQuestion)}
														onClick={() => {
															handleButtonClick(index)
														}}
													>
														{!isMobile ? (
															mostFrequentFAQ[index].isOpen ? (
																"-"
															) : (
																"+"
															)
														) : mostFrequentFAQ[index].isOpen ? (
															<img src={ArrowUp}></img>
														) : (
															<img src={ArrowDown}></img>
														)}
													</button>
												</p>
											</div>
											{mostFrequentFAQ[index].isOpen ? (
												<div className={classNames(styles.answerMostFrequent)}>
													<p>{faq.answer.substring(0, 122)}...</p>
													{
														// @ts-ignore
														<Link
															page={"store.custom#single-faq"}
															params={{
																slug: faq.url,
																metaTitle: faq.metaTitle,
																metaDescription: faq.metaDescription,
																categoryName: faq.categoryName,
																categoryId: faq.category,
															}}
															className={classNames(styles.readCompleteAnswer)}
														>
															Leggi di più
														</Link>
													}
												</div>
											) : null}
										</div>
									) : null}
								</>
							))}
						</div>
					</div>
				</>
			)}
		</>
	)
}

DomandePiuFrequenti.schema = {
	title: "editor.DomandePiuFrequenti.title",
	description: "editor.DomandePiuFrequenti.description",
	type: "object",
	properties: {},
}

export default DomandePiuFrequenti
