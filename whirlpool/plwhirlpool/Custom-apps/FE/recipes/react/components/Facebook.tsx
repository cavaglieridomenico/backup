import React from 'react'
import styles from '../styles.css'

interface FacebookProps {
    link?: string;
    size?: number;
}

const Facebook: StorefrontFunctionComponent<FacebookProps> = ({
    link,
    size,
}) => {
    return (
        <a href={!link ? "#" : link} className={styles.socialIcon}>
                <svg
                    className={styles.facebookIconsvg}
                    xmlns="http://www.w3.org/2000/svg"
                    height={!size ? "45px" : `${size}px`}
                    width={!size ? "45px" : `${size}px`}
                    fill="#197c83"
                    viewBox="0 0 38 38"
                >
                   <g fill="none"><path stroke="#AEAEAE" d="M1 18.715c0 9.99 8.06 18.09 18 18.09 9.942 0 18-8.1 18-18.09C37 8.724 28.942.625 19 .625c-9.94 0-18 8.099-18 18.09z"></path><path fill="#AEAEAE" d="M22 14.687h-1.087c-.853 0-1.019.424-1.019 1.044V17.1h2.035l-.266 2.144h-1.769v5.501h-2.12v-5.5H16V17.1h1.773v-1.58c0-1.836 1.074-2.835 2.642-2.835.751 0 1.397.058 1.585.084v1.918z"></path></g>
                </svg>
        </a>
    )
}

export default Facebook


