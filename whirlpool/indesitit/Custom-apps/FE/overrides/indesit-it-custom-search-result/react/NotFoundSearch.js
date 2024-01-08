import PropTypes from 'prop-types'
import React, { Fragment } from 'react' 
import { ExtensionPoint } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles' 

const CSS_HANDLES = [
  'searchNotFound',
  'searchNotFoundOops',
  'searchNotFoundInfo',
  'searchNotFoundWhatDoIDo',
  'searchNotFoundWhatToDoDots',
  'searchNotFoundWhatToDoDotsContainer',
  'searchNotFoundTerm',
  'searchNotFoundTextListLine',
]

/** 
 * Not found page component, rendered when the search doesn't return any
 * products from the API.
 */
const NotFoundSearch = ({ term }) => {
  const handles = useCssHandles(CSS_HANDLES)
  return (<Fragment >
    <div className={`${handles.searchNotFound} flex flex-column-s flex-row-ns justify-center-ns items-center h-auto-s h5-ns`} >
      <div className={`${handles.searchNotFoundOops} flex justify-end-ns justify-center-s ttu f1 ph4 pv4-s pv0-ns c-muted-3 ph9 b`} >
        oops!
      </div> <div className={`${handles.searchNotFoundInfo} flex flex-column ph9`} >
      C'è un errore <br></br>
      Spiacenti, non siamo riusciti a trovare alcuna corrispondenza. <br></br> Prova una nuova combinazione di filtri.
        </div> </div> <ExtensionPoint id="shelf" />
  </Fragment>
  )
}

NotFoundSearch.propTypes = {
  /** Search term */
  term: PropTypes.string,
}

export default NotFoundSearch