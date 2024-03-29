import classnames from "classnames"
import React, { useState } from "react"
import { useLazyQuery } from "react-apollo"
// import React, { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl"
// import { Input, Button } from "vtex.styleguide";
import { Input } from "vtex.styleguide"
import { FAQContextProvider } from "./context/context"
import ResultList from "./ResultList"
import styles from "./styles.css"
import getSearchResults from "./graphql/getSearchResults.graphql"
import { useIntl } from "react-intl"

const SearchFAQ = () => {
	const [string, setString] = useState("")
	const [arrayFAQ, setArrayFAQ] = useState([])
	const [clicked, setClicked] = useState(false)

	const [getSearchResultsList, { data, loading }] = useLazyQuery(
		getSearchResults,
		{
			onCompleted: () => {
				console.log("DATA----------", data)
				const newArray = data?.searchFaq ? data.searchFaq : []
				setArrayFAQ(newArray)
			},
		},
	)

	const getSearchResultsByString = (searchString: string) => {
		getSearchResultsList({
			variables: {
				keyword: searchString,
			},
		})
	}

	const searchFAQByString = (string: any) => {
		setClicked(true)
		getSearchResultsByString(string)
	}

	const SearchButton = () => {
		return	<div
					className={classnames(styles.searchButtonContainer)}
					onClick={() => searchFAQByString(string)}
				>
					<svg
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						className={classnames(styles.searchButton)}
						x="0px"
						y="0px"
						viewBox="0 0 122.879 119.799"
						enableBackground="new 0 0 122.879 119.799"
					>
						<g>
							<path
								fill="#fff"
								d="M49.988,0h0.016v0.007C63.803,0.011,76.298,5.608,85.34,14.652c9.027,9.031,14.619,21.515,14.628,35.303h0.007v0.033v0.04 h-0.007c-0.005,5.557-0.917,10.905-2.594,15.892c-0.281,0.837-0.575,1.641-0.877,2.409v0.007c-1.446,3.66-3.315,7.12-5.547,10.307 l29.082,26.139l0.018,0.016l0.157,0.146l0.011,0.011c1.642,1.563,2.536,3.656,2.649,5.78c0.11,2.1-0.543,4.248-1.979,5.971 l-0.011,0.016l-0.175,0.203l-0.035,0.035l-0.146,0.16l-0.016,0.021c-1.565,1.642-3.654,2.534-5.78,2.646 c-2.097,0.111-4.247-0.54-5.971-1.978l-0.015-0.011l-0.204-0.175l-0.029-0.024L78.761,90.865c-0.88,0.62-1.778,1.209-2.687,1.765 c-1.233,0.755-2.51,1.466-3.813,2.115c-6.699,3.342-14.269,5.222-22.272,5.222v0.007h-0.016v-0.007 c-13.799-0.004-26.296-5.601-35.338-14.645C5.605,76.291,0.016,63.805,0.007,50.021H0v-0.033v-0.016h0.007 c0.004-13.799,5.601-26.296,14.645-35.338C23.683,5.608,36.167,0.016,49.955,0.007V0H49.988L49.988,0z M50.004,11.21v0.007h-0.016 h-0.033V11.21c-10.686,0.007-20.372,4.35-27.384,11.359C15.56,29.578,11.213,39.274,11.21,49.973h0.007v0.016v0.033H11.21 c0.007,10.686,4.347,20.367,11.359,27.381c7.009,7.012,16.705,11.359,27.403,11.361v-0.007h0.016h0.033v0.007 c10.686-0.007,20.368-4.348,27.382-11.359c7.011-7.009,11.358-16.702,11.36-27.4h-0.006v-0.016v-0.033h0.006 c-0.006-10.686-4.35-20.372-11.358-27.384C70.396,15.56,60.703,11.213,50.004,11.21L50.004,11.21z"
							></path>
						</g>
					</svg>
				</div>
	}

	// const searchFAQReset = () => {
	//     setClicked(false)
	//     setArrayFAQ([])
	// }

	// const ResetIcon = () => {
	//     return  <Fragment>
	//                 <span
	//                     className={classnames(styles.searchResetIcon)}
	//                     onClick={() => searchFAQReset}
	//                 >
	//                     X
	//                 </span>
	//             </Fragment>
	// }
	const intl = useIntl()

	return (
		<>
			<div className={classnames(styles.containerSearchFAQ)}>
				{/* <h4 className={classnames(styles.searchFAQTitle)}><FormattedMessage id={'admin-example.navigation.title-search'} /></h4> */}
				<h4 className={classnames(styles.searchFAQTitle)}>
					<FormattedMessage id={"admin-example.navigation.title-search"} />
				</h4>
				<h4 className={classnames(styles.searchFAQTitle2)}>
					<FormattedMessage id={"admin-example.navigation.title-search2"} />
				</h4>
				<div className={classnames(styles.containerSearchBareButton)}>
					<div className={classnames(styles.searchBar)}>
						{
							// @ts-ignore
							<Input
								className={styles.searchFAQInput}
								value={string}
								placeholder={intl.formatMessage({
									id: "store/domande-frequenti.searchPlaceHolder",
								})}
								maxLength={100}
								onChange={(e: any) => setString(e.target.value)}
								onKeyPress={(e: any) => e.key === "Enter" ? searchFAQByString(string) : null}
								// suffix={<ResetIcon/>}
								suffix={<SearchButton/>}
							/>
						}
						{/* <div
							className={classnames(styles.searchButtonContainer)}
							onClick={() => searchFAQByString(string)}
						>
							<svg
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								className={classnames(styles.searchButton)}
								x="0px"
								y="0px"
								viewBox="0 0 122.879 119.799"
								enableBackground="new 0 0 122.879 119.799"
							>
								<g>
									<path
										fill="#fff"
										d="M49.988,0h0.016v0.007C63.803,0.011,76.298,5.608,85.34,14.652c9.027,9.031,14.619,21.515,14.628,35.303h0.007v0.033v0.04 h-0.007c-0.005,5.557-0.917,10.905-2.594,15.892c-0.281,0.837-0.575,1.641-0.877,2.409v0.007c-1.446,3.66-3.315,7.12-5.547,10.307 l29.082,26.139l0.018,0.016l0.157,0.146l0.011,0.011c1.642,1.563,2.536,3.656,2.649,5.78c0.11,2.1-0.543,4.248-1.979,5.971 l-0.011,0.016l-0.175,0.203l-0.035,0.035l-0.146,0.16l-0.016,0.021c-1.565,1.642-3.654,2.534-5.78,2.646 c-2.097,0.111-4.247-0.54-5.971-1.978l-0.015-0.011l-0.204-0.175l-0.029-0.024L78.761,90.865c-0.88,0.62-1.778,1.209-2.687,1.765 c-1.233,0.755-2.51,1.466-3.813,2.115c-6.699,3.342-14.269,5.222-22.272,5.222v0.007h-0.016v-0.007 c-13.799-0.004-26.296-5.601-35.338-14.645C5.605,76.291,0.016,63.805,0.007,50.021H0v-0.033v-0.016h0.007 c0.004-13.799,5.601-26.296,14.645-35.338C23.683,5.608,36.167,0.016,49.955,0.007V0H49.988L49.988,0z M50.004,11.21v0.007h-0.016 h-0.033V11.21c-10.686,0.007-20.372,4.35-27.384,11.359C15.56,29.578,11.213,39.274,11.21,49.973h0.007v0.016v0.033H11.21 c0.007,10.686,4.347,20.367,11.359,27.381c7.009,7.012,16.705,11.359,27.403,11.361v-0.007h0.016h0.033v0.007 c10.686-0.007,20.368-4.348,27.382-11.359c7.011-7.009,11.358-16.702,11.36-27.4h-0.006v-0.016v-0.033h0.006 c-0.006-10.686-4.35-20.372-11.358-27.384C70.396,15.56,60.703,11.213,50.004,11.21L50.004,11.21z"
									></path>
								</g>
							</svg>
						</div> */}
						{/* <Button
                            variation="primary"
                            onClick={() => searchFAQByString(string)}
                        >
                            <FormattedMessage id={'admin-example.navigation.search'} />
                        </Button> */}
					</div>
					{/* <div className={classnames(styles.resetButton)}>
                        <Button
                            variation="danger"
                            onClick={() => searchFAQReset()}
                            className={classnames(styles.searchResetButton)}
                        >
                            <FormattedMessage id={'admin-example.navigation.reset'} />
                        </Button>
                    </div> */}
				</div>
			</div>
			<div className={classnames(styles.container)}>
				{clicked === true ? (
					loading ? (
						<div className={classnames(styles.loaderForm)}></div>
					) : (
						<ResultList arrayFAQ={arrayFAQ}></ResultList>
					)
				) : (
					<></>
				)}
			</div>
		</>
	)
}

const SearchFAQContainer: StorefrontFunctionComponent = () => {
	return (
		<FAQContextProvider>
			<SearchFAQ />
		</FAQContextProvider>
	)
}

SearchFAQContainer.schema = {
	title: "editor.SearchFAQ.title",
	description: "editor.SearchFAQ.description",
	type: "object",
	properties: {},
}

export default SearchFAQContainer
