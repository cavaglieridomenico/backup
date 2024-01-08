import React from "react"
import { useRuntime } from "vtex.render-runtime"
import style from "./Group.css"

const Step: React.FC = ({ children }) => {
	const { deviceInfo } = useRuntime()

	return (
		<li className={`${style.step} flex b--action-primary bg-checkout mb3`}>
			<div className={`mb9 ${deviceInfo?.isMobile ? "w-90" : "w-100"}`}>
				{children}
			</div>
		</li>
	)
}

export default Step
