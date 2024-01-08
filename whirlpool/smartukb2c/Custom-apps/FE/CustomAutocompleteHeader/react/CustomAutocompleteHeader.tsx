// @ts-nocheck
import React, { useState, useEffect } from 'react'
import styles from './styles.css'
import axios from 'axios'
import SpinnerIcon from './Icons/SpinnerIcon'
import SearchIcon from './Icons/SearchIcon'
import {
  FormattedMessage,
  MessageDescriptor,
  useIntl,
  defineMessages,
} from 'react-intl'

const messages = defineMessages({
  Search: { id: 'store/custom-autocomplete-header.Search' },
})
const CustomAutocompleteHeader = ({}) => {
  const [resultsOpen, setResultsOpen] = useState(false)
  const [resultsLoading, setResultsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [searchTerm, setSearchTerm] = useState(null)
  const [searchClicked, setSearchClicked] = useState(false)
  const [brand, setBrand] = useState('')
  const [bindingAddress, setBindingAddress] = useState('')
  const [locale, setLocale] = useState('')
  const intl = useIntl()
  const spareAndAccessoriesCodes = ['jCode', 'winnerCode', 'looserCode']
  const finishedGoodsCodes = [
    'indesitMaterialCode',
    'whirlpoolCode',
    'industrialCode',
    'commercialCode',
  ]
  const [listCounter, setListCounter] = useState(-1)
  const [jCode, setJCode] = useState('')
  const [arrowSearch, setArrowSearch] = useState(false)
  const [showCode, setShowCode] = useState(false)

  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)
  useEffect(() => {
    if (searchTerm !== null && searchTerm.length >= 3) {
      setResultsOpen(false)
      setResultsLoading(true)
      const delayDebounceFn = setTimeout(() => {
        axios
          .get(`/v1/search/autocomplete?term=${searchTerm}&brand=${brand}`)
          .then(function(response) {
            if (
              response.data &&
              !response.data.error &&
              typeof response.data !== 'string'
            ) {
              response.data.filter(product => {
                product.ids = []

                // spare parts codes
                spareAndAccessoriesCodes
                  .filter(
                    code =>
                      product[code] &&
                      product[code]
                        .toLowerCase()
                        .indexOf(searchTerm.toLowerCase()) >= 0
                  )
                  .forEach(code => product.ids.push(product[code]))
                // prodcut codes. Differently from the spare, all the codes of a FG need to be displaid
                finishedGoodsCodes
                  .filter(code => product[code])
                  .forEach(code => product.ids.push(product[code]))
              })
              setResults(response.data)
              setResultsOpen(true)
            } else {
              setResults([])
            }
            setResultsLoading(false)
          })
          .catch(error => {
            setResults([])
            console.error(error)
          })
      }, 700)

      return () => clearTimeout(delayDebounceFn)
    }
  }, [searchTerm])
  useEffect(() => {
    let search = window.location.href
    let isIndesit = search.includes('indesit')
    let isHotpoint = search.includes('hotpoint')
    let params = new URLSearchParams(window.location.search)
    setBindingAddress(params.get('__bindingAddress'))
    setBrand(isIndesit ? 'indesit' : isHotpoint ? 'hotpoint' : 'hotpoint')
    setLocale(__RUNTIME__.culture.locale)
  }, [])

  const getPath = linktext => {
    return '/' + linktext + '/p'
  }

  const pressArrow = (arrow, r) => {
    if (resultsOpen === true) {
      if (arrow === 40) {
        if (listCounter < r.length - 1) {
          let index = listCounter + 1
          setJCode(r[index].jCode)
          setArrowSearch(true)
          setListCounter(index)
          /*setScrollList(index * 40);
          if(index*40 > 160) {
            const scroller = document.querySelector("#resultsWrapper");
            scroller.addEventListener("scroll", event => {
              //output.textContent = `scrollTop: ${scroller.scrollTop}`;
              scroller.window.scrollTo({ top: 100,
                behavior: 'smooth'})
            });
            console.log("ciao3")
            //window.scrollBy(0, 40);
          }*/
        }
      } else if (arrow === 38) {
        if (listCounter > 0) {
          let index = listCounter - 1
          setJCode(r[index].jCode)
          setArrowSearch(true)
          setListCounter(index)
        } else if (listCounter === 0) {
          let index = listCounter - 1
          setListCounter(index)
        }
      } else if (arrow === 13) {
        if (arrowSearch === true && listCounter > -1) {
          //console.log(encodeURI(getPath(r[listCounter]["Link Text"])))
          window.location.href = `${encodeURI(
            getPath(r[listCounter]['Link Text'] + '/p?showCode=' + showCode)
          )}`
        } else {
          //console.log(encodeURI(getPath(`${searchTerm}?_q=${searchTerm}&map=ft&showCode=` + showCode)))
          window.location.href = encodeURI(
            `/${searchTerm}?_q=${searchTerm}&map=ft&showCode=` +
              showCode +
              '&from=menu'
          )
        }
      } else {
        setListCounter(-1)
      }
    }
  }
  return (
    <div className={styles.customAutocompleteHeader}>
      <SearchIcon
        role="button"
        onClick={e => {
          setSearchClicked(true)
          setTimeout(() => {
            document.getElementById('custom-search-header-trigger').focus()
          }, 500)
        }}
        className={styles.customAutocompleteHeader__search_icon}
      />

      {searchClicked && (
        <div className={styles.customAutocompleteHeader__wrapper}>
          <input
            id="custom-search-header-trigger"
            className={styles.customAutocompleteHeader__input}
            placeholder={locale === 'de-CH' ? 'Suche' : 'Search'}
            onBlur={e => {
              setTimeout(() => {
                setResultsOpen(false)
                setSearchClicked(false)
                setSearchTerm(null)
              }, 500)
            }}
            onFocus={e => {
              setSearchTerm('')
            }}
            onKeyUp={e => {
              var event = window.event ? window.event : e
              //console.log(event.keyCode);
              setSearchTerm(e.currentTarget.value)
              if (e.currentTarget.value.includes('j00') === true) {
                setShowCode(false)
              } else {
                setShowCode(true)
              }
              pressArrow(event.keyCode, results)
            }}
            onChange={e => {
              setSearchTerm(e.currentTarget.value)
            }}
            value={searchTerm}
          />
          <SearchIcon
            className={[styles.customAutocompleteHeader__search_icon_label]}
          />
          {resultsOpen && (
            <div className={styles.customAutocompleteHeader__results}>
              {results.map((product, index) => {
                return (
                  <a
                    className={styles.customAutocompleteHeader__results_link}
                    href={encodeURI(
                      `${getPath(
                        product['Link Text'] + '/p?showCode=' + showCode
                      )}`
                    )}>
                    <div
                      className={
                        index === listCounter
                          ? styles.customAutocompleteHeader__results_row__active
                          : styles.customAutocompleteHeader__results_row
                      }>
                      <img
                        className={
                          styles.customAutocompleteHeader__results_row_image
                        }
                        src="https://complianz.io/wp-content/uploads/2019/03/placeholder-300x202.jpg"></img>
                      <p
                        className={
                          styles.customAutocompleteHeader__results_row_product_name
                        }>
                        {product.ids == product.jCode
                          ? product.ids.join(' / ')
                          : product.ids.join(' / ') +
                            `${
                              product.jCode ? ' [' + product.jCode + ']' : ''
                            }`}
                      </p>{' '}
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CustomAutocompleteHeader
