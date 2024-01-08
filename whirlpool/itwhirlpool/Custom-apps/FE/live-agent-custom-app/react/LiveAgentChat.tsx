import React, { useEffect } from 'react'
interface LiveAgentProps {
}

const LiveAgentChat: StorefrontFunctionComponent<LiveAgentProps> = ({
}) => {
	let entering = true
	let scriptPointer: any
	useEffect(() => {
		if (entering) {
			console.info('Adding Live agent chat')
			;(function (d, src, c) {
				let t = d?.scripts[d.scripts?.length - 1]
				let s = d?.createElement('script')
				s.id = 'la_x2s6df8d'
				s.async = true
				s.src = src
				s.onload = (s as any).onreadystatechange = function () {
					var rs = this.readyState
					if (rs && rs != 'complete' && rs != 'loaded') {
						return
					}
					c(this)
				}
				scriptPointer = s
				t.parentElement?.insertBefore(s, t.nextSibling)
			})(
				document,
				'https://whirlpool-emea.ladesk.com/scripts/track.js',
				function (e: any) {
					;(window as any).LiveAgent?.createButton('422t2aez', e)
					entering = false
				},
			)
		}
		return () => {
			console.info('Removing Live agent chat')
			// Remove the script
			scriptPointer?.parentNode?.removeChild(scriptPointer) // remove from the DOM tree
			scriptPointer = null // Trigger the garbage collector to free some RAM to avoi memory leak
			// Remove the button
			;(document as Document)
				.querySelectorAll("[id*='422t2aez']")
				.forEach((e: Element | null) => {
					e?.parentNode?.removeChild(e) // remove from the DOM tree
					e = null // Trigger the garbage collector to free some RAM to avoi memory leak
				})
		}
	}, [])
	return <></>
}

LiveAgentChat.schema = {
	title: 'editor.live-agent-chat.title',
	description: 'editor.live-agent-chat.description',
	type: 'object',
	properties: {
	},
}

export default LiveAgentChat
