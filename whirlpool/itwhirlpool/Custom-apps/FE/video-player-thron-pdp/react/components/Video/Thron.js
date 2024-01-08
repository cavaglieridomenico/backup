import React from 'react'
import styles from './video.css'

/* https://whirlpool-cdn.thron.com/delivery/public/video/whirlpool/3cf5a7ed-6013-4d22-a6b8-28bdbe7a9bad/jsind9/WEBHD/vi-3cf5a7ed-6013-4d22-a6b8-28bdbe7a9bad */
export function getThumbUrlThron(url) {
  let idVideo = url.split('vi-')[1].indexOf('/') === -1 ? url.split('vi-')[1] : url.split('vi-')[1].substr(0,url.split('vi-')[1].indexOf('/'))
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
	let split = url.split('vi-')[1]
	let id = split.indexOf('/') == -1 ? split : split.substr(0,url.split('vi-')[1].indexOf('/'))
	return id
}

export function Thron({ url, isModal = false }) {
	//let id = url.split('vi-')[1].substr(0,url.split('vi-')[1].indexOf('/'))
	//style={{"width": "32rem","height": "19rem"}}
	// const isMobile = () =>
  // window.matchMedia && window.matchMedia("(max-width: 680px)").matches;
	return (
		<div id={"sl-gallery-xcid-vi-"+extrapolateId(url)} className={isModal?styles.thronVideoModal:styles.thronVideo}></div>
	)
}
