import React, { CSSProperties, useState } from 'react'
import style from './style.css'
import PromotionsSubmenu from './PromotionsSubmenu';

interface PromotionsMenuProps {
    triggerText: string,
    triggerLink: string,
    items: ItemProps[]
}
interface ItemProps {
    itemTitle: string;
    itemSubtitle: string;
    itemLink: string;
    itemIcon: string;
}

const PromotionMenu: StorefrontFunctionComponent<PromotionsMenuProps> = ({ triggerText, triggerLink, items }) => {

    const [isOpen, setOpen] = useState(false)

    const handleClick = () => {
        setOpen(!isOpen)
    }
    const styleOpen = (numEl: number, isItems = false) => {
        return {
            height: isItems ? numEl * 75 + 'px' : "calc(" + numEl * 75 + 'px + 66px)'
        }
    }
    return (
        <div className={style.containerMenu} style={isOpen ? (styleOpen(items.length) as CSSProperties) : {}}>
            {items.length > 0 ? (
                <div role='button' onClick={handleClick} style={{ width: "100%", display: 'flex', height: "66px" }}>
                    <div className={style.linkMenu}>
                        <span className={style.testoMenu}>{triggerText}</span>
                    </div>
                    <span className={style.iconaMenu}>{isOpen ? "-" : "+"}</span>
                </div>

            ) : (
                <div style={{ width: "100%", display: 'flex', height: "66px" }}>
                    <a href={triggerLink} className={style.linkMenu}>
                        <span className={style.testoMenu}>{triggerText}</span>
                    </a>
                </div>

            )}


            {items.length > 0 && <div className={style.containerChild} style={isOpen ? (styleOpen(items.length, true) as CSSProperties) : {}}>
                <PromotionsSubmenu items={items} />
            </div>}
        </div>
    )
}

PromotionMenu.schema = {
    title: "PromotionMenu",
    type: "object",
    properties: {
        triggerText: {
            type: "string",
            default: "",
            title: "Testo trigger"
        },
        triggerLink: {
            type: "string",
            default: "",
            title: "Link associato al trigger",
            description: "Link associato al trigger quando non vi sono submenu attivi",
        },
        items: {
            type: "array",
            title: 'Items',
            items: {
                title: "Item menu",
                properties: {
                    itemLink: {
                        title: "ItemLink",
                        type: "string"
                    },
                    itemTitle: {
                        title: "ItemTitle",
                        type: "string"
                    },
                    itemSubtitle: {
                        title: "itemSubtitle",
                        type: "string"
                    },
                    itemIcon: {
                        title: "ItemIcon",
                        type: "string"
                    },
                }
            }
        }
    }

}

export default PromotionMenu

