//@ts-ignore
//@ts-nocheck

import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
// import CategoryList from './CategoryList'
// import UsersTable from './UsersTable'
import styles from './style.css'
import  Select  from 'react-select'

import './styles.global.css'

interface categoryFilterProps {
  arrayCategory: any[];
  selectedCategory: string;
  handleResetCategoryFilters: any;
  handleChangeCategory: any;
}

const GroupFilter: FC<categoryFilterProps> = ({ arrayCategory, handleResetCategoryFilters,
  selectedCategory,
  handleChangeCategory
}) => {


  return (
    <>
      <h3><FormattedMessage id="admin-example.navigation.filter" /></h3>
      <div className={styles.filterContainer}>
        <div className={styles.selectWrapperFilter}>
          <Select value={selectedCategory} options={arrayCategory?.map((p: any) => {
            return {
              label: p.name,
              value: p.id
            }
          })} placeholder="Tutte le categorie" isSearchable={true}
            onChange={handleChangeCategory}
          />
        </div>
      </div>
      <Button
        variation="secondary"
        onClick={() => handleResetCategoryFilters()}
      >RESET
      </Button>
    </>
  )
}

export default GroupFilter
