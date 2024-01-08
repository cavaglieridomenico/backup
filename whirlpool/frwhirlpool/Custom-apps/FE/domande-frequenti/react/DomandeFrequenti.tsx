import React, { useEffect, useState } from 'react'
import { Link } from 'vtex.render-runtime'
import classnames from 'classnames'
import styles from './styles.css'

interface DomandeFrequentiProps {
}
interface Item {
  category: string
  questionGroup: string
  question: string
  answer: string
  pageUrl: string
}

const DomandeFrequenti: StorefrontFunctionComponent<DomandeFrequentiProps> = () => {
  const [question, setQuestion] = useState([])
  const [loading, setLoading] = useState<boolean>()

  const [question2, setQuestion2] = useState([])
  const [selectedFilterFirstLevel, setSelectedFilterFirstLevel] = useState<string>('')
  const [selectedFilter, setSelectedFilter] = useState<string>()

  const [filtersFirstLevel, setFilterCategory] = useState<string[]>([])
  const [filters, setFilter] = useState<string[]>([])
  useEffect(() => {
    setLoading(false)
    fetch(
      `/api/dataentities/QA/search?_fields=category,questionGroup,question,answer,pageUrl,id`,
      {
        headers: {
          method: 'GET',
          scheme: 'https',
          accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
          'content-Type': 'application/json',
          'REST-Range': 'resources=0-1000'
        },
      }
    )
      .then(response => response.json())
      .then(json => {
        if (json.length) {
          let filters = ['Tous'] as string[]
          let filtersCategory = [] as string[]
          json.map((question: Item, index: number) => {
            let filter = question.questionGroup.toLowerCase()
            if(question.category == null){
              json.splice(index,1)
              return
            }
            let filterCategory = question.category.toLowerCase()

            if ( filtersCategory.indexOf(filterCategory) == -1) {
              filtersCategory.push(filterCategory)
            }

            if (filters.indexOf(filter.toLowerCase()) == -1) {
              filters.push(filter)
            }
          })
          setQuestion(json)
          setQuestion2(json)
          setFilterCategory(filtersCategory)
          setFilter(filters)
          setSelectedFilter(filters[0])
          setLoading(true)
        }
      })
  }, [])

  useEffect(() =>{
    if(loading == true && selectedFilterFirstLevel === ''){
      filterQuestionsFirstLevel(filtersFirstLevel[0].toLowerCase())
    }
  },[loading])

  const updateFilters = (filterCategory:string) =>{
    let filters = ['Tous'] as string[]
    question2.map((question: Item) =>{
      if(question.category.toLowerCase() == filterCategory.toLowerCase() && filters.indexOf(question.questionGroup.toLowerCase()) == -1){
        let filt = question.questionGroup.toLowerCase()
        filters.push(filt)
      }
    })
    setFilter(filters)
  }

  const filterQuestionsFirstLevel = (filter: string) => {
    setSelectedFilterFirstLevel(filter)
    updateFilters(filter)
    filterQuestions(filter,'Tous')
  }

  const filterQuestions = (filterFirstLevel:string, filter: string) => {
    setSelectedFilter(filter)
    if (filterFirstLevel == '' && filter === 'Tous') {
      setQuestion(question2)
    } else if(filterFirstLevel == '' && filter !== 'Tous'){ 
      const filtredQuestion = question2.filter(function (obj: Item) {
        return obj.questionGroup.toLowerCase() === filter.toLowerCase()
      })
      setQuestion(filtredQuestion)
    }else if(filterFirstLevel !== '' && filter === 'Tous'){
      const filtredQuestion = question2.filter(function (obj: Item) {
        return obj.category.toLowerCase() === filterFirstLevel.toLowerCase()
      })
      setQuestion(filtredQuestion)
    } else {
      const filtredQuestion = question2.filter(function (obj: Item) {
        return obj.questionGroup.toLowerCase() === filter.toLowerCase() && obj.category.toLowerCase() === filterFirstLevel.toLowerCase()
      })
      setQuestion(filtredQuestion)
    }
    setQuestion2(question2)
  }

  const content = (
    <>
      <span className={classnames(styles.filterPer)}>Filtrer par: </span>
      <div className={classnames(styles.filtersFirstLevel,styles.filters, 'w100')}>
        <div className={classnames(styles.filterWrapper)}>
          <ul>
            {filtersFirstLevel &&
              filtersFirstLevel.map((filter: string) => (
                <li>
                  <span
                    className={
                      selectedFilterFirstLevel === filter
                        ? classnames(styles.selectedFilter)
                        : classnames(styles.filter)
                    }
                    onClick={() => filterQuestionsFirstLevel(filter)}
                  >
                    {filter}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
      <div className={classnames(styles.filters, 'w100')}>
        <div className={classnames(styles.filterWrapper)}>
          <ul>
            {filters &&
              filters.map((filter: string) => (
                <li>
                  <span
                    className={
                      selectedFilter === filter
                        ? classnames(styles.selectedFilter)
                        : classnames(styles.filter)
                    }
                    onClick={() => filterQuestions(selectedFilterFirstLevel,filter)}
                  >
                    {filter}
                  </span>
                </li>
              ))}
          </ul>
        </div>
      </div>
      {question &&
        question.map((item: Item) => (
          <>
            {/* {content} */}

            <div className={classnames(styles.domandaContainer, 'w100')}>
              <Link
                // className={classnames(handles.bannerLink, "w-100")}
                page={'store.custom#single-faq'}
                params={{ slug: item.pageUrl }}
              >
                <div>
                  <div className={classnames(styles.question)}>
                    {item.question}
                  </div>
                  <div className={classnames(styles.shortAnswer)}>
                    {item.answer.substring(0, 122)}...
                  </div>
                </div>

                <a className={classnames(styles.readMore)}>Lire la suite</a>
              </Link>
            </div>
          </>
        ))}
    </>
  )
  return loading ? (
    <div className={classnames(styles.container)}>{content}</div>
  ) : (
    <div className={classnames(styles.loaderForm)}></div>
  )
}

DomandeFrequenti.schema = {
  title: 'editor.domande-frequenti.title',
  description: 'editor.domande-frequenti.description',
  type: 'object',
  properties: {},
}

export default DomandeFrequenti
