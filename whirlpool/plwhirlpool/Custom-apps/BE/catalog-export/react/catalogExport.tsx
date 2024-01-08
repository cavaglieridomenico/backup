//@ts-nocheck

import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl';

function downloadExport(){
  window.open("/catalog/export");
}


const catalogExport: FC = () => {
  return (
  <center>
  <div>
    <br/><br/>
    <h1>{<FormattedMessage id="catalog-export.title" />}</h1>
    <br/><br/>
    <button onClick={downloadExport}>{<FormattedMessage id="catalog-export.button.download" />}</button>
  </div>
  </center>
  )
}

export default catalogExport
