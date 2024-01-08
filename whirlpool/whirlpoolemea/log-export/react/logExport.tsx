//@ts-nocheck

import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl';

function downloadPartialZip(){
  let from = (document.getElementById("from") as HTMLInputElement).valueAsNumber;
  let to = (document.getElementById("to") as HTMLInputElement).valueAsNumber;
  if((from+"")=="NaN" || (to+"")=="NaN" || from>to){
    alert("Error: bad parameters.")
  }else{
    window.open("/apps/log/export?from="+from+"&to="+to);
  }
}

function downloadFullZip(){
  window.open("/apps/log/export");
}

const logExport: FC = () => {
  return (
  <center>
    <div>
      <br/><br/>
      <h1>{<FormattedMessage id="admin/log-export.title" />}</h1>
      <br/><br/>
      <label>{<FormattedMessage id="admin/log-export.date.from" />}:</label><span> </span><input type="date" id="from"/><br/><br/>
      <label>{<FormattedMessage id="admin/log-export.date.to" />}:</label><span> </span><input type="date" id="to"/><br/><br/><br/>
      <button onClick={downloadPartialZip}>{<FormattedMessage id="admin/log-export.button.download" />}</button>
      <span> </span>
      <button onClick={downloadFullZip}>{<FormattedMessage id="admin/log-export.button.download.all" />}</button>
    </div>
  </center>
  )
}

export default logExport
