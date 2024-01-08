//@ts-nocheck

import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl';

function downloadExport() {
  let from: any = (document.getElementById("from") as HTMLInputElement).valueAsNumber;
  let to: any = (document.getElementById("to") as HTMLInputElement).valueAsNumber;
  if ((from + "") == "NaN" || (to + "") == "NaN" || from > to) {
    alert("Error: bad parameters")
  } else {
    from = ((new Date(from)).toISOString().split("T")[0]) + "T00:00:00.000Z";
    to = ((new Date(to)).toISOString().split("T")[0]) + "T23:59:59.999Z";
    window.open(`/oms/export?from=${from}&to=${to}`);
  }
}


const omsExport: FC = () => {
  return (
    <center>
      <div>
        <br /><br />
        <h1>{<FormattedMessage id="oms-export.title" />}</h1>
        <br /><br />
        <label>{<FormattedMessage id="oms-export.date.from" />}:</label><span> </span><input type="date" id="from" /><br /><br />
        <label>{<FormattedMessage id="oms-export.date.to" />}:</label><span> </span><input type="date" id="to" /><br /><br /><br />
        <button onClick={downloadExport}>{<FormattedMessage id="oms-export.button.download" />}</button>
      </div>
    </center>
  )
}

export default omsExport
