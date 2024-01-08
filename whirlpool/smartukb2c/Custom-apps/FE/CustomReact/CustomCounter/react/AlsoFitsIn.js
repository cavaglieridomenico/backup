import { useContext, useEffect, useState } from 'react'
import styles from './styles.css'
import { ProductContext } from 'vtex.product-context'
import Leftarrow from './Icons/Leftarrow'

const AlsoFitsIn = ({

}) => {
    const valuesFromContext = useContext(ProductContext);
    const { product } = valuesFromContext;
    const [normalizedCategories, setNormalizedCategories] = useState(null);
    useEffect(() => {
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
     
    }, [])
    return (
        <div className={styles.AlsoFitsIn}>
            {normalizedCategories && normalizedCategories.length > 0 && (
                <div className={styles.AlsoFitsInTitle}>This item also fits other model numbers</div>
            )}
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
                            {category.name} ({category.count}) {/*<Leftarrow className={styles.FitAlsoInArrow} /> */}
                        </p>
                        {/* {category.active && (
                            <div>
                                {category.items.map((item) => {
                                    return <div>

                                        <a href={`/${item.link}`}>{item.name}</a>
                                    </div>
                                })}
                            </div>
                            )} */}
                    </div>
                })}
            </div>
        </div>
    )
}

export default AlsoFitsIn
