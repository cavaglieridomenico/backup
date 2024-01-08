import React, { useState } from 'react'
import styles from '../styles.css'

interface PaginationProps {
  recipePerPage: number
  totalRecipes: number
  currentPage: number
  paginate: any
  brand: string
}

const Pagination: StorefrontFunctionComponent<PaginationProps> = ({
  recipePerPage,
  totalRecipes,
  paginate,
  brand,
  currentPage,
}) => {
  const pageNumbers: any = []
  const [isActive, setIsActive]: any = useState(1)

  for (let i = 1; i <= Math.ceil(totalRecipes / recipePerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <nav className={styles.paginationContainer}>
      <ul className={styles.paginationUl}>
        {isActive != 1 ? (
          <li
            className={`${styles.paginationLi} ${brand === 'whirlpool' &&
              styles.paginationLiCompact}`}
          >
            <button
              className={`${styles.paginationButton} ${brand === 'whirlpool' &&
                styles.paginationButtonCompact}`}
              onClick={() => {
                paginate(isActive - 1), setIsActive(isActive - 1)
              }}
            >
              &lt;
            </button>
          </li>
        ) : null}
        {pageNumbers.map((pageNumber: any) => (
          <li
            key={pageNumber}
            className={`${
              currentPage == pageNumber
                ? styles.paginationLiActive
                : styles.paginationLi
            } ${brand === 'whirlpool' && styles.paginationLiCompact}`}
            onClick={() => setIsActive(pageNumber)}
          >
            <button
              className={`${styles.paginationButton} ${brand === 'whirlpool' &&
                styles.paginationButtonCompact}`}
              onClick={() => paginate(pageNumber)}
            >
              {pageNumber}
            </button>
          </li>
        ))}

        {isActive != pageNumbers.length ? (
          <li
            className={`${styles.paginationLiLast} ${brand === 'whirlpool' &&
              styles.paginationLiLastCompact}`}
          >
            <button
              className={`${styles.paginationButtonLast} ${brand ===
                'whirlpool' && styles.paginationButtonLastCompact}`}
              onClick={() => {
                paginate(isActive + 1), setIsActive(isActive + 1)
              }}
            >
              &gt;
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  )
}

export default Pagination
