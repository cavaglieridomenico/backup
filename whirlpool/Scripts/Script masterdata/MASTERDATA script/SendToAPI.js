const https = require("https");

const options = {
  hostname: "frwhirlpoolqa.myvtex.com",
  port: 443,
  path: "",
  method: "",
  headers: {
    "Content-Type": "application/json",
    "REST-Range": "resources=0-1000",
    "X-VTEX-API-AppKey": "vtexappkey-frwhirlpoolqa-GESKRY",
    "X-VTEX-API-AppToken": "QTGIQJQBQVBBZIABCRYNRSPSWJDCFLWSTUXVJXTSDSHTZTKBXXKACKRYDOLGGOWEYJHFLEREXFJZKVSDZBEIAWPJCYRVLNMOWCVQLEQSFFCXASNIVIHEKOECTYCMNWSK",
    "app-key": "bb3daa9963ef9944308848aa8f0acdbfd9eda75b171fd758dbf7ad9e1d4bfbce1f748cb3f689ca451821d6f4b8434c2df276626bb32bdb8c3e0664902d52090a",
    "Cache-Control": "no-cache"
  }
}

const requestBuffer = [];

var active = false;
var onEndCallback;

var interval;

function getAccount(){
  return options.hostname;//.includes("frwhirlpool")?"qa":"prod";
}

function start(delay = 200) {
  active = true;
  interval = setInterval(executeRequest, delay);
}

//additional info represents informations to return to the caller when the request end
function sendRequest(endpoint, method, body, callback, additionalInfo) {
  requestBuffer.push({
    path: endpoint,
    method: method,
    body: body,
    callback: callback ? callback : () => {},
    additionalInfo: additionalInfo,
  });
}

function executeRequest() {
  let request = requestBuffer.shift();

  if (!active && request == undefined) {
    clearInterval(interval);
    setTimeout(() => {
      onEndCallback();
    }, 2000);
  }

  if (request != undefined) {
    options.path = request.path;
    options.method = request.method;
    const req = https.request(
      {
        hostname: options.hostname,
        port: options.port,
        path: request.path,
        method: request.method,
        headers: options.headers,
      },
      (res) => {
        console.log(`statusCode: ${res.statusCode}`);
        let body = "";
        if (res.statusCode >= 200 && res.statusCode < 300) {
          res.on("data", function (chunk) {
            body += chunk;
          });
        } else {
          if (res.statusCode == 429 || res.statusCode==408 || res.statusCode >= 500) {
            sendRequest(
              request.path,
              request.method,
              request.body,
              request.callback,
              request.additionalInfo
            );
            console.log(request.path);
            console.log(request.body);
            console.log(res.statusMessage);
            /*console.log(request.path);
            console.log(request.body);*/
          } else {
            console.log(request.path);
            console.log(request.body);
            //console.log(res)
          }
        }
        res.on("end", function () {
          if (res.statusCode >= 200 && res.statusCode < 300)
            request.callback(body, request.additionalInfo);
        });
      }
    );

    req.on("error", (error) => {
      if(error.code=="ETIMEDOUT" || error.code=="ECONNRESET"){
        sendRequest(
          request.path,
          request.method,
          request.body,
          request.callback,
          request.additionalInfo
        );
      }else{
        console.error(error);
      }
    });

    req.write(JSON.stringify(request.body));

    req.end();
  }
}

function stop(callback = () => {}, timeout = 5000) {
  //console.log(requestBuffer);
  onEndCallback = callback;
  setTimeout(() => {
    active = false;
  }, timeout);
}

module.exports = { start, sendRequest, stop, getAccount};
