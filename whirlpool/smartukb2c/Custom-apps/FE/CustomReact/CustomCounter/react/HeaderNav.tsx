import React, { useEffect, useState } from "react";
import styles from "./styles.css";

const HeaderNav = () => {
    const [brand, setBrand] = useState("");


    useEffect(() => {
        let url = window && window.location ? window.location.href : "";
        if (url) {
            setBrand(url.includes("indesit") ? "indesit" : "hotpoint");
        }
    }, [])


    return (
        <div>
            {(brand === "hotpoint" ?
                <div className={styles.headerNavContainer}>
                    <a className={styles.headerNavLink} href="https://www.hotpoint.co.uk/" target="_blank">
                        <div className={styles.headerNavItem}>
                            Brand
                        </div>
                    </a>
                    <a className={styles.headerNavLink} href="https://www.hotpointservice.co.uk/" target="_blank">
                        <div className={styles.headerNavItem}>
                            Service
                        </div>
                    </a>
                </div> :
                <div className={styles.headerNavContainer}>
                    <a className={styles.headerNavLink} href="https://www.indesit.co.uk/" target="_blank">
                        <div className={styles.headerNavItem}>
                            Brand
                        </div>
                    </a>
                    <a className={styles.headerNavLink} href="https://www.indesitservice.co.uk/" target="_blank">
                        <div className={styles.headerNavItem}>
                            Service
                        </div>
                    </a>
                </div>)}

        </div>
    )
}

export default HeaderNav;