import React, { useEffect, useState } from 'react'
import styles from '../styles.css'
import { searchLogo, backArrow, closeIcon } from '../utils/vectors'
import { Modal, Pagination } from 'vtex.styleguide'
import Review from './Review'
import { useIntl } from 'react-intl'

interface SearchReviewsProps {
  appSettings: any
  productIdentifier: any
  pageSize: number
}

const SearchReviews: React.FC<SearchReviewsProps> = ({
  appSettings,
  productIdentifier,
  pageSize,
}) => {
  const intl = useIntl()

  const [inputValue, setInputValue]: any = useState('')
  const [filteredReviews, setFilteredReviews]: any = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [offset, setOffset] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [singleReviewSelected, setSingleReviewSelected]: any = useState()
  const [isSingleReviewOpen, setIsSingleReviewOpen] = useState(false)

  /*----------- SEARCH LOGIC -------------*/
  const handleFetch = () => {
    const BV_API =
      'https://api.bazaarvoice.com/data/reviews.json?apiversion=5.4'
    const fetchUrl = `${BV_API}&passkey=${appSettings.appKey}&locale=it_IT&Filter=ProductId:${productIdentifier}&Search=${inputValue}&limit=${pageSize}&offset=${offset}`

    fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((res: any) => res.json())
      .then((response: any) => {
        setTotalResults(response.TotalResults)
        const boldRegex = new RegExp(inputValue, 'g')
        const boldedResults = response.Results?.map((res: any) => ({
          ...res,

          ClientResponses: res.ClientResponses.map((item: any) => ({
            ...item,
            Response: item.Response.replace(boldRegex, `**${inputValue}**`),
          })),

          ReviewText: res.ReviewText.replace(boldRegex, `**${inputValue}**`),
        }))
        setFilteredReviews(boldedResults)
      })
  }

  const handleSearchReviews = (e: any) => {
    e.preventDefault()
    if (inputValue?.trim() == '') return
    handleFetch()
  }

  const handleSlide = (type: string) => {
    type == 'next' ? setOffset(offset + pageSize) : setOffset(offset - pageSize)
  }

  useEffect(() => {
    handleFetch()
  }, [offset])

  const handleClickReview = (index: number) => {
    setSingleReviewSelected(filteredReviews[index])
    setIsSingleReviewOpen(true)
  }

  const logoSearch = Buffer.from(searchLogo).toString('base64')
  const arrowBack = Buffer.from(backArrow).toString('base64')
  const iconClose = Buffer.from(closeIcon).toString('base64')
  /*------------------------*/

  /*-----------SEARCH BAR COMPONENT-------------*/
  const SearchBar = () => {
    return (
      <form
        onSubmit={(e: any) => handleSearchReviews(e)}
        className={`${styles.reviewsSearchContainer} ${
          isModalOpen ? styles.reviewsSearchContainerMargin : ''
        }`}
      >
        <input
          className={styles.reviewsSearchInput}
          type="text"
          placeholder="Themen und Bewertungen suchen"
          value={inputValue}
          onChange={(e: any) => setInputValue(e.target.value)}
        />
        {inputValue?.trim() != '' && (
          <div
            onClick={() => setInputValue('')}
            className={styles.searchCloseIconContainer}
          >
            <img
              className={styles.searchCloseIcon}
              src={`data:image/svg+xml;base64,${iconClose}`}
              alt="search-icon"
            />
          </div>
        )}
        <button
          className={styles.reviewsSearchButton}
          type="submit"
          onClick={() => setIsModalOpen(true)}
        >
          <img
            className={styles.reviewsSearchButtonIcon}
            src={`data:image/svg+xml;base64,${logoSearch}`}
            alt="search-icon"
          />
        </button>
      </form>
    )
  }
  /*------------------------*/

  return (
    <>
      {SearchBar()}
      <Modal
        centered
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(!isModalOpen), setIsSingleReviewOpen(false)
        }}
      >
        {!isSingleReviewOpen && SearchBar()}
        {isSingleReviewOpen && (
          <div
            onClick={() => setIsSingleReviewOpen(false)}
            className={styles.singleReviewBackButtonContainer}
          >
            <img
              className={styles.singleReviewBackButton}
              src={`data:image/svg+xml;base64,${arrowBack}`}
              alt="search-icon"
            />
          </div>
        )}
        {!isSingleReviewOpen && (
          <>
            <h2 className={styles.modalTitle}>
              {intl.formatMessage({
                id: 'store/bazaar-voice.search-reviews.modalTitle',
              })}
            </h2>
            <div className={styles.modalReviewNumberContainer}>
              <span className={styles.modalReviewNumber}>
                {1 + offset}–{offset + pageSize}
                {intl.formatMessage({
                  id: 'store/bazaar-voice.search-reviews.modalPageSizeText',
                })}
              </span>
            </div>
          </>
        )}
        {filteredReviews?.length > 0 ? (
          <>
            {!isSingleReviewOpen ? (
              <>
                <div>
                  {filteredReviews?.map((review: any, i: number) => (
                    <div
                      className={styles.searchModalReviewContainer}
                      onClick={() => handleClickReview(i)}
                    >
                      <Review
                        review={review}
                        key={i}
                        appSettings={appSettings}
                        isHistogramVisible={false}
                        isModalReview={true}
                      />
                    </div>
                  ))}
                </div>
                <div className={styles.searchModalPaginationContainer}>
                  <Pagination
                    currentItemFrom={1 + offset}
                    currentItemTo={offset + pageSize}
                    textOf={intl.formatMessage({
                      id: 'store/bazaar-voice.reviews-tooltip.preposition2',
                    })}
                    totalItems={totalResults}
                    onNextClick={() => handleSlide('next')}
                    onPrevClick={() => handleSlide('prev')}
                  />
                </div>
              </>
            ) : (
              <Review
                review={singleReviewSelected}
                key={0}
                appSettings={appSettings}
                isHistogramVisible={false}
              />
            )}
          </>
        ) : (
          <div>
            <p>
              {intl.formatMessage({
                id: 'store/bazaar-voice.search-reviews.modalNoResult',
              })}
            </p>
          </div>
        )}
      </Modal>
    </>
  )
}

export default SearchReviews
