//@ts-ignore
//@ts-nocheck

import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'
import styles from './style.css'
import  Select  from 'react-select'

import './styles.global.css'

interface categoryFilterProps {
  arrayCategory: any[];
  selectedCategory: string;
  setSelectedCategory: any;
  handleResetCategoryFilters: any;
  arrayFAQ: any;
  arrayQuestionGroup: any;
  setArrayQuestionGroup: any;
  selectedFAQquestion: any;
  setSelectedFAQquestion: any;
  handleResetFAQquestionFilters: any;
  selectedFAQanswer: any;
  setSelectedFAQanswer: any;
  handleResetFAQanswerFilters: any;
  setSelectedGroup: any;
  selectedGroup: any;
  filteredQuestion: any;
  filteredAnswer: any;
  handleResetGroupFilters: any;
  handleResetFAQList: any;
  handleChangeCategory: any;
  handleChangeGroup: any;
  handleChangeQuestion: any,
  handleChangeAnswer: any,
}

const FAQFilter: FC<categoryFilterProps> = ({
  arrayCategory,
  handleResetCategoryFilters,
  setSelectedCategory,
  selectedCategory,
  // arrayFAQ,
  selectedFAQquestion,
  setSelectedFAQquestion,
  handleResetFAQquestionFilters,
  selectedFAQanswer,
  setSelectedFAQanswer,
  handleResetFAQanswerFilters,
  arrayQuestionGroup,
  // setArrayQuestionGroup,
  setSelectedGroup,
  selectedGroup,
  filteredQuestion,
  filteredAnswer,
  handleResetGroupFilters,
  handleResetFAQList,
  handleChangeCategory,
  handleChangeGroup,
  handleChangeQuestion,
  handleChangeAnswer,
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
              selected={selectedCategory == 'default'}
              value='default'
              disabled
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
              selected={selectedGroup == 'default'}
              value='default'
              disabled
            >Tutti i gruppi di domanda </option>
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
        <div className={styles.selectWrapperFilter}>
          {/* <select
            placeholder="Domanda"
            onChange={(e: any) => setSelectedFAQquestion(e.target.selectedOptions[0].id)}
          >
            <option
              id='default'
              selected={selectedFAQquestion == 'default'}
              value='default'
              disabled
            >Tutte le domande</option>
            {filteredQuestion?.map((faq: any) =>
              <option id={faq.value.id}
                selected={faq.value.id == selectedFAQquestion}
              >{faq.value.name}</option>
            )}
          </select> */}
          <Select value={selectedFAQquestion} options={filteredQuestion?.map((p: any) => {
            return {
              label: p.value.name,
              value: p.value.id
            }
          })} placeholder="Tutte le domande" isSearchable={true}
              onChange={handleChangeQuestion}
          />
        </div>
        <div className={styles.selectWrapperFilter}>
          {/* <select
            placeholder="Risposta"
            onChange={(e: any) => setSelectedFAQanswer(e.target.selectedOptions[0].id)}
          >
            <option
              id='default'
              selected={selectedFAQanswer == 'default'}
              value='default'
              disabled
            >Tutte le risposte</option>
            {filteredAnswer?.map((faq: any) =>
              <option id={faq.value.id}
                selected={faq.value.id == selectedFAQanswer}
              >{faq.value.name}</option>
            )}
          </select> */}
           <Select value={selectedFAQanswer} options={filteredAnswer?.map((p: any) => {
            return {
              label: p.value.name,
              value: p.value.id
            }
          })} placeholder="Tutte le risposte" isSearchable={true}
              onChange={handleChangeAnswer}
          />
        </div>
      </div>
      <Button
        variation="secondary"
        onClick={() => {
          handleResetFAQList()
          handleResetCategoryFilters()
          handleResetGroupFilters()
          handleResetFAQquestionFilters()
          handleResetFAQanswerFilters()
        }
        }
      >RESET
      </Button>
      {/* <div className={styles.selectWrapperFilter}>
        <select
          placeholder="Gruppo di domanda"
          onChange={(e: any) => setSelectedGroup(e.target.selectedOptions[0].id)}
        >
          {arrayQuestionGroup?.map((cat: any) =>
            <option id={cat.value.id}
              selected={cat.value.id == selectedCategory}
            >{cat.value.name}</option>
          )}
        </select>
      </div> */}
    </>
  )
}

export default FAQFilter
