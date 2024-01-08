import React from "react"
import style from "./components/summary/Summary.css"

const SummaryContainer: React.FC = ({ children }) => {
	return <div className={`${style.summaryContainer} bg-white`}>{children}</div>
}

export default SummaryContainer
