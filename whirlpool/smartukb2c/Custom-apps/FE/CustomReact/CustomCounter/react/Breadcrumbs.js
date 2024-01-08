import { useState, useEffect } from 'react'
import styles from './styles.css'


const Breadcrumbs = ({

}) => {

	let pathname = window.location ? window.location.pathname : "";
	const [appliacePathName, setAppliancePathName] = useState(null);
	const [appliacePath, setAppliancePath] = useState(null);
	const [currentPath, setCurrentPath] = useState(null);
	const [hidden, setHidden] = useState(false);

	useEffect(() => {
		setAppliancePathName(null)
		setCurrentPath(null)
		setHidden(false)
		setAppliancePath(null)
		if (pathname) {
			let pathSplit = pathname.split("/");
			if (pathSplit.length === 5) {
				//Remove possible pagination in appliance path 3d level (i.e: '..?page=..')
				let thirdLevel = pathSplit[3].split('?')[0]
				setAppliancePath(`/${pathSplit[1]}/${pathSplit[2]}/${thirdLevel}`);
				setAppliancePathName(pathSplit[3].split("-").join(" "))
				setCurrentPath(pathSplit[4].split("-").join(" "))
			} else if (pathSplit.length === 4) {
				setCurrentPath(pathSplit[3].split("-").join(" "))
			}
			if (pathSplit[1] === "cleaning-and-care") {
				setHidden(true)
			}
		}

	}, [pathname]);

	return (
		<>
			{!hidden && (
				<div className={styles.Breadcrumbs}>
					<p className={styles.Breadcrumbs_links}>
						<a className={styles.Breadcrumbs_link} href="/">Home</a>
						{appliacePath && (
							<>
								<b className={styles.Breadcrumbs_separator}>{'>'}</b>
								<a className={styles.Breadcrumbs_link} href={appliacePath}>{appliacePathName}</a>
							</>
						)}
						<b className={styles.Breadcrumbs_separator}>{'>'}</b>
						<p className={styles.Breadcrumbs_current}>{currentPath}</p>
					</p>
				</div>
			)}
		</>
	)
}

export default Breadcrumbs