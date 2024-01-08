const https = require("https");
const HeaderComposer = require("./HeaderComposer")

class VTEXapiClient {

  requestBuffer = [];
  active = false;
  onEndCallback;
  interval;
  options;
  isPriceAPI;

  constructor(accountName, isPriceAPI) {
    this.options = HeaderComposer.getDataForAccount(accountName, isPriceAPI);
    this.requestBuffer = new Array();
    this.isPriceAPI = isPriceAPI;
  }
  
  
  start(delay = 200) {
    this.active = true;
    this.interval = setInterval(this.#executeRequest, delay, this);
  }
  
  //additional info represents informations to return to the caller when the request end
  sendRequest(endpoint, method, body, callback, additionalInfo, isHttps = true, headers = {}) {
    this.requestBuffer.push({
      path: endpoint,
      method: method,
      port : isHttps ? 443 : 80,
      body: body,
      callback: callback ? callback : () => {},
      additionalInfo: additionalInfo,
      headers : headers
    });
  }
  
  #executeRequest(_this) {
    let request = _this.requestBuffer.shift();
  
    if (!_this.active && request === undefined) {
      clearInterval(_this.interval);
      setTimeout(() => {
        _this.onEndCallback();
      }, 2000);
    }
  
    if (request !== undefined) {
      _this.options.path = request.path;
      _this.options.method = request.method;

      const req = https.request(
        {
          hostname: _this.options.hostname,
          port: request.port,
          path: request.path,
          method: request.method,
          headers: {
            ..._this.options.headers,
            ...request.headers
          }
        },
        (res) => {
          console.log(`[${request.method}] ${request.path} - statusCode: ${res.statusCode}`);
          let body = "";
          if (res.statusCode >= 200 && res.statusCode < 300) {
            res.on("data", function (chunk) {
              body += chunk;
            });
          } else {
            if (res.statusCode === 429 || res.statusCode === 408 || res.statusCode >= 500) {
              _this.sendRequest(
                request.path,
                request.method,
                request.body,
                request.callback,
                request.additionalInfo
              );
              /*console.log(request.path);
              console.log(request.body);*/
            } else {
              console.log(request.path);
              console.log(request.body);
              console.log(body);
            }
          }
          res.on("end", function () {
            if (res.statusCode >= 200 && res.statusCode < 300)
              request.callback(body, request.additionalInfo);
          });
        }
      );
  
      req.on("error", (error) => {
        if(error.code === "ETIMEDOUT" || error.code === "ECONNRESET"){
          _this.sendRequest(
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
  
   stop(callback = () => {}, timeout = 5000) {
    //console.log(requestBuffer);
    this.onEndCallback = callback;
    setTimeout(() => {
      this.active = false;
    }, timeout);
  }
  
}



function createApiClient(accountName, isPriceAPI = false){
  return new VTEXapiClient(accountName, isPriceAPI);
}


module.exports = { createApiClient };
