//@ts-nocheck

export async function wait(time: number): Promise<boolean> {
  return new Promise<boolean>(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time);
  })
}

export async function getRequestPayload(ctx: Context): Promise<string[]> {
  return new Promise<string[]>((resolve,reject) => {
    let payload = "";
    ctx.req.on("data", (chunk) => payload += Buffer.from(chunk, "binary").toString("utf8"));
    ctx.req.on("end", () => resolve(JSON.parse(payload)));
    ctx.req.on("error", (err) => reject({message: "error while retrieving the request payload --details: "+JSON.stringify(err)}))
  })
}

export async function getAllLogs(ctx: Context, logs: [], token: string): Promise<any> {
  return new Promise<any>((resolve,reject) => {

    // Build the from statement for the MD query
    let from = undefined
    let from_vtex = undefined
    if(ctx.query.from != undefined) {
      from = new Date(parseInt(ctx.query.from)).toISOString()
      from_vtex = from.split("T")[0]
    }

    // Build the to statement for the MD query
    let to = undefined
    let to_vtex = undefined
    if(ctx.query.to != undefined) {
      to = new Date(parseInt(ctx.query.to)).toISOString()
      to_vtex = to.split("T")[0]
    }

    // WHERE statement for the MD query
    let where = undefined

    // timestamp range for WHERE statement
    if(from_vtex !=undefined && to_vtex != undefined){
      where = "timestamp between " + from_vtex + " AND " + to_vtex
    }

    ctx.clients.masterdata.searchDocuments({
      dataEntity: ctx.state.config.dataEntity,
      fields: ctx.state.config.dataEntityFields,
      sort: ctx.state.config.sortField + " " + ctx.state.config.sortValue,
      size: ctx.state.config.dataEntitySize,
      where: where ? where : "",
      pagination: {"page":1, "pageSize": ctx.state.config.dataEntitySize}
    })
    .then(async(res) => {
      //logs = logs.concat(res);
      resolve(res);
      /*if(res.length<=ctx.dataEntitySize){
        resolve(logs);
      }else{
        await wait(200)
        return getAllLogs(ctx, logs, res.mdToken).then(res0 => resolve(res0)).catch(err => reject(err));
      }*/
    })
    .catch(err => {
      reject(err);
    });
  });
}
