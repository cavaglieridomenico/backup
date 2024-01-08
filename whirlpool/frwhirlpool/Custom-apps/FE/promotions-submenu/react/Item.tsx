import React from 'react'
import style from './style.css'
import { useDevice } from 'vtex.device-detector';

interface ItemProps {
    itemTitle: string;
    itemSubtitle?: string;
    itemLink: string;
    itemIcon: string;
    width:number;
}

const Item: StorefrontFunctionComponent<ItemProps> = ({
    itemTitle,
    itemSubtitle,
    itemLink,
    itemIcon,
    width
}) => {
    const { isMobile } = useDevice();
    return (

        <a href={itemLink} className={style.item} style={{width:width+"%"}}>
            <div className={style.itemImageColumn}><img src={itemIcon}/></div>
            <div className={style.itemTextColumn}>
                <h3 className={style.titolo}>{itemTitle}</h3>
                {itemSubtitle && !isMobile &&<span>{itemSubtitle}</span>}
            </div>
        </a>

    )
}

export default Item