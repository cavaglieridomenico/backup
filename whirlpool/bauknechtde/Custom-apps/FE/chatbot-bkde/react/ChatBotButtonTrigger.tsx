import React from 'react'
import { usePixel } from 'vtex.pixel-manager'

const ChatBotButtonTrigger: React.FC = ({ children }) => {
	const { push } = usePixel()

	const handleClick = (e: any) => {
		window.dispatchEvent(new Event('chatbot-open-trigger'))
		e.stopPropagation()
		push({
			event: 'ga4-supportChat',
			data: { chat_status: 'Chat Request (Available)' },
		})
	}

	return (
		<a id="service_onlinechat_2" onClick={handleClick}>
			{children}
		</a>
	)
}

export default ChatBotButtonTrigger
