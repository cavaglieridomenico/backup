import React, {useState} from 'react';
import styles from "../styles.css"

interface PaginationProps {
    recipePerPage: number
    totalRecipes: number
    paginate: any
}

const Pagination: StorefrontFunctionComponent<PaginationProps> = ({recipePerPage, totalRecipes, paginate}) => {
    const pageNumbers: any = [];
    const [isActive, setIsActive]: any = useState(1);

    for(let i = 1; i <= Math.ceil(totalRecipes / recipePerPage); i++){
        pageNumbers.push(i);
    }

    return (
        <nav className={styles.paginationContainer}>
            <ul className={styles.paginationUl}>
            {   isActive != 1 ? 
                    <li className={styles.paginationLi}>
                    <button className={styles.paginationButton} onClick={() => {paginate(isActive - 1), setIsActive(isActive - 1)}}>&lt;</button>
                </li>
                : null}
                {pageNumbers.map((pageNumber:any) => 
                    <li key={pageNumber} className={isActive == pageNumber ? styles.paginationLiActive : styles.paginationLi} onClick={() => setIsActive(pageNumber)}>
                        <button className={styles.paginationButton} onClick={() => paginate(pageNumber)}>{pageNumber}</button>
                    </li>
                )}

                {   isActive != pageNumbers.length ? 
                    <li className={styles.paginationLiLast}>
                    <button className={styles.paginationButtonLast} onClick={() => {paginate(isActive + 1), setIsActive(isActive + 1)}}>&gt;</button>
                </li>
                : null}

            </ul>
        </nav>
    )
}

export default Pagination
