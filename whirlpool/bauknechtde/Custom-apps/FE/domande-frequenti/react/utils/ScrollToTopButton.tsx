import React, { useState, useEffect } from "react"
import styles from "../styles.css"

const ScrollToTopButton = () => {
	const [showTopBtn, setShowTopBtn] = useState(false)
	useEffect(() => {
		window.addEventListener("scroll", () => {
			if (window.scrollY > 200) {
				setShowTopBtn(true)
			} else {
				setShowTopBtn(false)
			}
		})
	}, [])
	const goToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		})
	}
	return (
		<>
			{showTopBtn && (
				<div className={styles.scrollToTopContainer} onClick={goToTop}>
					<div>
						<p className={styles.scrollToTopButton}></p>
					</div>
					<p className={styles.scrollToTopText}>Zurück zum Seitenanfang</p>
				</div>
			)}
		</>
	)
}
export default ScrollToTopButton
