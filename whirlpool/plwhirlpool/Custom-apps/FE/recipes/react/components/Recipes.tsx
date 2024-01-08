import React from 'react'
import styles from '../styles.css'
import Recipe from './Recipe';
interface RecipeListProps {
  recipes: any
  brand: string
}

const RecipeList: StorefrontFunctionComponent<RecipeListProps> = ({ recipes, brand }) => {

  return (
    <div className={brand === 'whirlpool' ? styles.containerGrid : styles.containerGridBig}>
      <div className={brand === 'whirlpool' ? styles.containerGridInner : styles.containerGridInnerBig}>
        {recipes.map((recipe: any) => (
          <Recipe recipe={recipe} brand={brand}/>
        ))}
      </div>
    </div>
  )
}

export default RecipeList
