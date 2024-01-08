//@ts-nocheck

const fs = require('fs');
const AdmZip  = require('adm-zip');

export async function exportLogs(ctx: Context, next: () => Promise<any>) {
  ctx.set('Cache-Control', 'no-cache');
  try{
    let logs = await getAllLogs(ctx,[],undefined);
    //console.log("size full: "+logs.length);
    let apps = [];
    let idList = [];
    logs.forEach(l => {
      if(!apps.includes(l.app)){
        apps.push(l.app);
      }
      idList.push(l.id);
    })
    let appLogs = {};
    let from = undefined;
    let to = undefined;
    if(ctx.query.from!=undefined){
      from = new Date(parseInt(ctx.query.from)).toISOString();
    }
    if(ctx.query.to!=undefined){
      to = new Date(parseInt(ctx.query.to)).toISOString();
      to = to.split("T")[0]+"T23:59:59:999Z";
    }
    apps.forEach(a => {
      if(from!=undefined && to!=undefined){
        appLogs[a] = logs.filter(f => f.app==a && f.timestamp>=from && f.timestamp <=to);
      }else{
        appLogs[a] = logs.filter(f => f.app==a);
      }
      appLogs[a] = sortByTimestampDESC(appLogs[a]);
      //console.log("size "+a+": "+appLogs[a].length);
    })
    let files = [];
    for(let a of Object.keys(appLogs)){
      let appLog = appLogs[a];
      let string = "";
      for(let i=0;i<appLog.length;i++){
        string += appLog[i].timestamp + " - " + appLog[i].severity + " - " + appLog[i].message;
        if(i<logs.length-1){
          string += " \n\n";
        }
      }
      fs.writeFileSync("./"+a+".log", string);
      files.push("/usr/local/data/"+a+".log");
    }
    if(from==undefined && to==undefined){
      fs.writeFileSync("./idList.json", JSON.stringify(idList,null,2));
      files.push("/usr/local/data/idList.json");
    }
    var zip = new AdmZip();
    files.forEach(f => {
      zip.addLocalFile(f);
    })
    var zipToServe = zip.toBuffer();
    ctx.status = 200;
    ctx.res.setHeader("Content-Type","application/zip");
    let filename = "logs-"+(new Date().toISOString().replace(/:/g,"").replace(/-/g,"").split(".")[0])+".zip";
    ctx.res.setHeader("Content-Disposition","attachment;filename="+filename);
    ctx.body = zipToServe;
  }catch(err){
    //console.log(err);
    ctx.status = 500;
    ctx.body = "Internal error"
  }
  await next();
}

async function getAllLogs(ctx: Context, logs: [], token: string): Promise<any> {
  return new Promise<any>((resolve,reject) => {
    //console.log(token)
    ctx.clients.masterdata.scrollDocuments({dataEntity: "LC", fields: ["id","app","severity","message","timestamp"], sort: "timestamp DESC", size: 1000, mdToken: token})
    .then(res => {
      logs = logs.concat(res.data);
      if(res.data.length<1000){
        resolve(logs);
      }else{
        return getAllLogs(ctx,logs,res.mdToken).then(res0 => resolve(res0)).catch(err => reject(err));
      }
    })
    .catch(err => {
      reject(err);
    });
  });
}

function sortByTimestampDESC(logs: []): []{
  let timestamps = [];
  logs.forEach(l => {
    if(!timestamps.includes(l.timestamp)){
      timestamps.push(l.timestamp);
    }
  })
  timestamps = timestamps.sort();
  let orderedTimestamps = [];
  for(let i = timestamps.length-1; i>=0;i--){
    orderedTimestamps.push(timestamps[i]);
  }
  let newLogs = [];
  orderedTimestamps.forEach(t => {
    newLogs = newLogs.concat(logs.filter(f => f.timestamp==t));
  })
  return newLogs;
}
