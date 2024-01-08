import classnames from "classnames"
import React, { FC } from "react"
import { FormattedMessage } from "react-intl"
import { Link } from "vtex.render-runtime"
import styles from "./styles.css"
import { useIntl } from "react-intl"

interface SearchFAQProps {
	arrayFAQ: any[]
}

const ResultList: FC<SearchFAQProps> = ({ arrayFAQ }) => {
	const intl = useIntl()

	const formatAnswer = (text: string) => {
		if (text.length < 125) {
			return `${text.replace(/<[^>]*>/g, "")}`
		} else {
			return `${text.substring(0, 122).replace(/<[^>]*>/g, "")}${
				text.length > 125 ? " ..." : ""
			}`
		}
	}

	return (
		<>
			{arrayFAQ?.length == 0 && (
				<h4 className={classnames(styles.noResult)}>
					<FormattedMessage id={"admin-example.navigation.no-result"} />
				</h4>
			)}
			{arrayFAQ?.map((faq: any, index: number) => (
				<div
					className={classnames(styles.domandaContainer, "w100")}
					key={index}
				>
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
							className={classnames(
								`${styles.textDecoration} ${styles.noPaddingLink}`,
							)}
						>
							<div>
								<div className={classnames(styles.question)}>
									{faq.question}
								</div>
								<div className={classnames(styles.shortAnswer)}>
									{formatAnswer(faq.answer)}
								</div>
							</div>
							<a className={classnames(styles.readMore)}>
								{intl.formatMessage({
									id: "store/domande-frequenti.readMore",
								})}
							</a>
						</Link>
					}
				</div>
			))}
		</>
	)
}

export default ResultList
