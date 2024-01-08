import React, { useState } from 'react'
import styles from '../styles.css'

interface PaginationProps {
  page: number
  recipePerPage: number
  totalRecipes: number
  paginate: any
}

const Pagination: StorefrontFunctionComponent<PaginationProps> = ({
  page,
  recipePerPage,
  totalRecipes,
  paginate,
}) => {
  const pageNumbers: Array<number> = []
  const [isActive, setIsActive] = useState<number>(page)

  for (let i = 1; i <= Math.ceil(totalRecipes / recipePerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <nav className={styles.paginationContainer}>
      <ul className={styles.paginationUl}>
        {isActive != 1 ? (
          <a
            href={isActive - 1 === 1 ? '/rezepte' : `?page=${isActive - 1}`}
            rel={'prev'}
            className={styles.paginationAnchor}
            onClick={e => e.preventDefault()}
          >
            <li className={styles.paginationLi}>
              <button
                className={styles.paginationButton}
                onClick={() => {
                  paginate(isActive - 1), setIsActive(isActive - 1)
                }}
              >
                &lt;
              </button>
            </li>
          </a>
        ) : null}

        {pageNumbers.map((pageNumber: any) => (
          <a
            href={pageNumber === 1 ? '/rezepte' : `?page=${pageNumber}`}
            className={styles.paginationAnchor}
            onClick={e => e.preventDefault()}
          >
            <li
              key={pageNumber}
              className={
                isActive == pageNumber
                  ? styles.paginationLiActive
                  : styles.paginationLi
              }
              onClick={() => setIsActive(pageNumber)}
            >
              <button
                className={styles.paginationButton}
                onClick={() => paginate(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          </a>
        ))}

        {isActive != pageNumbers.length ? (
          <a
            href={`?page=${isActive + 1}`}
            rel={'next'}
            className={styles.paginationAnchor}
            onClick={e => e.preventDefault()}
          >
            <li className={styles.paginationLiLast}>
              <button
                className={styles.paginationButtonLast}
                onClick={() => {
                  paginate(isActive + 1), setIsActive(isActive + 1)
                }}
              >
                &gt;
              </button>
            </li>
          </a>
        ) : null}
      </ul>
    </nav>
  )
}

export default Pagination
