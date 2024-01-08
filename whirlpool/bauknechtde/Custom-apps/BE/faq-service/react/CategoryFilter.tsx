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
  selectedGroup: any;
  selectedCategory: string;
  arrayQuestionGroup: any;
  setSelectedCategory: any;
  setSelectedGroup: any;
  handleResetCategoryFilters: any;
  setArrayQuestionGroup: any;
  handleChangeCategory: any;
  handleChangeGroup: any;
}

const CategoryFilter: FC<categoryFilterProps> = ({ arrayCategory, handleResetCategoryFilters,
  // setArrayQuestionGroup,
  selectedGroup,
  selectedCategory,
  arrayQuestionGroup,
  handleChangeCategory,
  handleChangeGroup
}) => {


  return (
    <>
      <h3><FormattedMessage id="admin-example.navigation.filter" /></h3>
      <div className={styles.filterContainer}>
        <div className={styles.selectWrapperFilter}>
          {/* <select
            placeholder="Categorie"
            onChange={(e: any) => setSelectedCategory(e.target.selectedOptions[0].id)}
          >
            <option
              id='default'
              selected={true}
            //disabled
            >Tutte le categorie</option>
            {arrayCategory?.map((cat: any) =>
              <option id={cat.id}
                selected={cat.id == selectedCategory}
              >{cat.name}</option>
            )}
          </select> */}
          <Select value={selectedCategory} options={arrayCategory?.map((p: any) => {
            return {
              label: p.name,
              value: p.id
            }
          })} placeholder="Tutte le categorie" isSearchable={true}
            onChange={handleChangeCategory}
          />
        </div>
        <div className={styles.selectWrapperFilter}>
          {/* <select
            placeholder="Gruppo di domanda"
            onChange={(e: any) => setSelectedGroup(e.target.selectedOptions[0].id)}
          >
            <option
              id='default'
              selected={true}
            //disabled
            >Tutti i gruppi di domanda</option>
            {arrayQuestionGroup?.map((group: any) =>
              <option id={group.value.id}
                selected={group.value.id == selectedGroup}
              >{group.value.name}</option>
            )}
          </select> */}
            <Select value={selectedGroup} options={arrayQuestionGroup?.map((p: any) => {
            return {
              label: p.value.name,
              value: p.value.id
            }
          })} placeholder="Tutti i gruppi di domanda" isSearchable={true}
              onChange={handleChangeGroup}
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

export default CategoryFilter
