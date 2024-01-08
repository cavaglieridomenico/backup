import React, { useEffect, useState } from 'react'
import { Link } from 'vtex.render-runtime'
import classnames from 'classnames'
// import { useCssHandles } from 'vtex.css-handles'
// import styles from './styles'
import styles from './styles.css'
// import { objOf } from "ramda";
// import SingleQuestion from './singleQuestion';
// const styles = require('./styles');

interface DomandeFrequentiProps {
}
interface Item {
  questionGroup: string
  question: string
  answer: string
  pageUrl: string
}
// interface Filter: Array<string>{
//   index: string
// }
const DomandeFrequenti: StorefrontFunctionComponent<DomandeFrequentiProps> = () => {
  // const { Link } = useRuntime();
  const [question, setQuestion] = useState([])
  const [loading, setLoading] = useState<boolean>()

  const [question2, setQuestion2] = useState([])
  const [selectedFilter, setSelectedFilter] = useState<string>()

  const [filters, setFilter] = useState<string[]>([])
  useEffect(() => {
    setLoading(false)
    fetch(
      `/api/dataentities/QA/search?_fields=questionGroup,question,answer,pageUrl,id`,
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
          setQuestion(json)
          setQuestion2(json)

          let filters = ['Tutte'] as string[]
          json.map((question: Item) => {
            let filter = question.questionGroup.toLowerCase()

            if (filters.indexOf(filter.toLowerCase()) == -1) {
              filters.push(filter)
            }
          })
          setFilter(filters)
          setSelectedFilter(filters[0])
          setLoading(true)
        }
      })
  }, [])

  const filterQuestions = (filter: string) => {
    setSelectedFilter(filter)
    if (filter === 'Tutte') {
      setQuestion(question2)
    } else {
      const filtredQuestion = question2.filter(function (obj: Item) {
        return obj.questionGroup.toLowerCase() === filter.toLowerCase()
      })
      setQuestion(filtredQuestion)
    }
    setQuestion2(question2)
  }

  // const navigateSingleFaq = (item: Item) => {
  //   navigate({
  //     to: `/${item.pageUrl}`,
  //     params: { item },
  //   });

  // };

  const content = (
    <>
      <span className={classnames(styles.filterPer)}>Filtra per: </span>
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
                    onClick={() => filterQuestions(filter)}
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

                <a className={classnames(styles.readMore)}>Leggi di più</a>
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
