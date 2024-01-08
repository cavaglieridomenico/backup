import { useContext, useEffect, useState } from 'react'
import styles from './styles.css'
import { ProductContext } from 'vtex.product-context'
import Leftarrow from './Icons/Leftarrow'
//import pixel message
import { usePixel } from 'vtex.pixel-manager'
const AlsoFitsInList = ({

}) => {
    const { push } = usePixel()

    const valuesFromContext = useContext(ProductContext);
    const { product } = valuesFromContext;
    const [normalizedCategories, setNormalizedCategories] = useState(null);
    const resetModalGA4 =()=>{
        const ga4Data = {
            event: "popup",
            popupId: "alsoFitsIn_popup",
          };
        push({ ...ga4Data, action: "close" });
    }

    useEffect(() => {
        //GA4FUNREQ60
        const ga4Data = {
            event: "popup",
            popupId: "alsoFitsIn_popup",
          };
        push({ ...ga4Data, action: "view" });
        if(!normalizedCategories){
            fetch(`/v1/spare/${product.productReference}/fits-in`).then((response) => {
                response.json().then((data) => {
                    let categories = [];
                    for (var category in data) {
                        categories.push({
                            name: category,
                            count: data[category].length,
                            items: data[category],
                            active: false
                        })
                    }
                    setNormalizedCategories(categories)
                })
            });
        }
        return () => {
            //push the modal close
            resetModalGA4()
        };
    }, [])
    return (
        <div className={styles.AlsoFitsIn}>
            <div className={styles.AlsoFitsInWrap}>
                {normalizedCategories && normalizedCategories.map((category) => {
                    return <div className={styles.AlsoFitsInWrapper}>
                        <p className={[styles.AlsoFitsInCatTitle, category.active ? styles.AlsoFitsInCatTitleActive : ""].join(" ")} onClick={(e) => {
                            let _categories = [...normalizedCategories];
                            _categories.map((_category) => {
                                if (_category.name === category.name && !_category.active) {
                                    _category.active = true;
                                } else {
                                    _category.active = false;
                                }
                            })
                            setNormalizedCategories(_categories);
                        }}>
                           <p className={styles.AlsoFitsInTitle}> {category.name} ({category.count})</p>
                        </p>
                            <div className={styles.AlsoFitsInContainerLinks}>
                                {category.items.map((item) => {
                                    return <div className={styles.AlsoFitsInLinks}>

                                        <a href={`/${item.link}`}>{item.name}</a>
                                    </div>
                                })}
                            </div>
                    </div>
                })}
            </div>
        </div>
    )
}

export default AlsoFitsInList
