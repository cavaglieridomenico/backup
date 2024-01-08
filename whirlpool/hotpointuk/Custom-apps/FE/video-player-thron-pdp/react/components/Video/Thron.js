import React from "react";
/* https://whirlpool-cdn.thron.com/delivery/public/video/whirlpool/3cf5a7ed-6013-4d22-a6b8-28bdbe7a9bad/jsind9/WEBHD/vi-3cf5a7ed-6013-4d22-a6b8-28bdbe7a9bad */
export function getThumbUrlThron(url) {
  let idVideo = url.split('vi-')[1].indexOf('/') !== -1 ? url.split('vi-')[1].substr(0,url.split('vi-')[1].indexOf('/')) : url.split('vi-')[1]
  //const idVideo = final[1];
	const getUrl = `https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/vi-${idVideo}/jsind9/std/300x300/vi-3cf5a7ed-6013-4d22-a6b8-28bdbe7a9bad`
	return fetch(getUrl).then(response => response.url)
}

// export function getUrlThb(url) {
// 	let final = url.split('WEBHD/vi-');
// 	const idVideo = final[1];
// 	return `https://whirlpool-cdn.thron.com/delivery/public/thumbnail/whirlpool/${idVideo}/jsind9/std/0x0/vi-3cf5a7ed-6013-4d22-a6b8-28bdbe7a9bad`
// }

function extrapolateId(url){
	console.log(url)
	if(url.split('vi-')[1].indexOf('/') == -1){
		return url.split('vi-')[1]
	}
	let split = url.split('vi-')[1]
	let id = split.substr(0,url.split('vi-')[1].indexOf('/'))
	return id
}

export function Thron({ url }) {
	//let id = url.split('vi-')[1].substr(0,url.split('vi-')[1].indexOf('/'))
	
	return (
		<div 
			className="videoContainer" 
			id={"sl-gallery-xcid-vi-"+extrapolateId(url)}
		>
			
		</div>
	)
}
