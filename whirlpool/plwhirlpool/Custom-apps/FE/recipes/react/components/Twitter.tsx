import React from 'react'
import styles from '../styles.css'

interface TwitterProps {
    link?: string;
    size?: number;
}

const Twitter: StorefrontFunctionComponent<TwitterProps> = ({
    link,
    size,
}) => {
    return (
        <a href={!link ? "#" : link} className={styles.socialIcon}>
                <svg
                    className={styles.twitterIconsvg}
                    xmlns="http://www.w3.org/2000/svg"
                    height={!size ? "45px" : `${size}px`}
                    width={!size ? "45px" : `${size}px`}
                    fill="#197c83"
                    viewBox="0 0 38 38"
                >
                   <g fill="none"><path stroke="#AEAEAE" d="M1 18.715c0 9.99 8.06 18.09 18 18.09 9.942 0 18-8.1 18-18.09C37 8.724 28.942.625 19 .625c-9.94 0-18 8.099-18 18.09z"></path><path fill="#AEAEAE" d="M25.323 15.746v.371c0 3.99-3.075 8.628-8.665 8.628-1.77 0-3.354-.464-4.658-1.392h.745c1.398 0 2.795-.463 3.82-1.298-1.304 0-2.422-.928-2.888-2.134.186 0 .372.093.559.093.279 0 .559 0 .839-.093a2.999 2.999 0 0 1-2.424-2.969c.374.186.84.371 1.398.371-.838-.556-1.398-1.484-1.398-2.504 0-.557.188-1.114.374-1.577 1.49 1.855 3.727 3.061 6.335 3.154-.093-.186-.093-.464-.093-.65 0-1.67 1.398-3.061 3.075-3.061.837 0 1.677.371 2.235.928a5.042 5.042 0 0 0 1.957-.742c-.186.742-.745 1.298-1.305 1.67.653-.093 1.211-.279 1.771-.464-.56.742-1.118 1.298-1.677 1.67"></path></g>
                </svg>
        </a>
    )
}

export default Twitter


