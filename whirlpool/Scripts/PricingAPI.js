const https = require('https');

const options = {
    hostname: 'api.vtex.com',
    port: 443,
    path: '/hotpointuk',
    method: '',
    headers: {
      'Content-Type': 'application/json',
      'X-VTEX-API-AppKey': 'vtexappkey-hotpointuk-OZOGNZ',
      'X-VTEX-API-AppToken': 'IHLCPGDQCCWBNMYFPETQJETXWPARMQWKGEFFJCUDOIBVLWQYGZFIDWXEONGZFMEMGLVIHTWNJQCACXMAYBKNKNGKGAQVWVXCEPPZAHRMCSYNUWBRBFAEBRBTFLCGCBQO',
      "Cache-Control": "no-store"
    }
}

const requestBuffer=[];

var active = false;
var onEndCallback;

var interval;

function start(delay=200){
    active=true;
    interval=setInterval(executeRequest, delay);
}

//additional info represents informations to return to the caller when the request end
function sendRequest(endpoint, method, body, callback, additionalInfo){
    requestBuffer.push({
        path: options.path+endpoint,
        method: method,
        body: body,
        callback: callback?callback:()=>{},
        additionalInfo: additionalInfo
    });
}

function executeRequest(){
    let request=requestBuffer.shift()

    if(!active && request == undefined){
        clearInterval(interval);
        setTimeout(() => {
            onEndCallback();
        }, 2000);
    }

    if(request!=undefined){   
        options.path=request.path;
        options.method=request.method;
        const req = https.request({
                hostname: options.hostname,
                port: options.port,
                path: request.path,
                method: request.method,
                headers: options.headers,
            },
            res => {
                console.log(`statusCode: ${res.statusCode}`);
                let body = '';
                if(res.statusCode>=200 && res.statusCode<300){
                    res.on('data', function(chunk) {
                        body += chunk;
                    });
                }else{
                    if(res.statusCode==429 || res.statusCode==408 || res.statusCode>=500){
                        sendRequest(request.path,request.method,request.body,request.callback,request.additionalInfo);
                    } else {
                        console.log(request.path);
                        console.log(request.body);
                    }
                }        
            res.on('end', function() {
                request.callback(body, request.additionalInfo);
            });
        });
    
        req.on('error', error => {
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

module.exports = {start, sendRequest, stop}