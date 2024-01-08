//@ts-nocheck

import React, { FC } from 'react'

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

const AdminExample: FC = () => {
  return (
  <center>
    <div>
      <br/><br/>
      <h1>App log export</h1>
      <br/><br/>
      <label>From:</label><span> </span><input type="date" id="from"/><br/><br/>
      <label>To:</label><span> </span><input type="date" id="to"/><br/><br/><br/>
      <button onClick={downloadPartialZip}>Download</button><span> </span><button onClick={downloadFullZip}>Download all</button>
    </div>
  </center>
  )
}

export default AdminExample
