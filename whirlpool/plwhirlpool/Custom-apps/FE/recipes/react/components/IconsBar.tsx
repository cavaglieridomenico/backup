import React from 'react'
import styles from '../styles.css'
import Clock from './Clock'
import Machinary from './Machinary'
import Twitter from './Twitter'
import Facebook from './Facebook'

interface IconBarProps {
    singleRecipe: any,
    brand: string,
}

const IconBar: StorefrontFunctionComponent<IconBarProps> = ({
    singleRecipe,
    brand
}) => {
    return (
    <div className={styles.topIconsBanner}>
             <div className={styles.topIconsDiv}>
                    <Machinary singleRecipe={singleRecipe} brand={brand} />
                    <Clock singleRecipe={singleRecipe} brand={brand} />
                    <div className={styles.socialIcons}>
                        <Twitter />
                        <Facebook />
                    </div>
                </div>
        </div>
    )
}

export default IconBar


