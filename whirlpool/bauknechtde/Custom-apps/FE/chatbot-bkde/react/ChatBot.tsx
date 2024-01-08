//This app refers to the D2C Chatbot
import React, { useState, useEffect } from 'react'
import styles from './style.css'
import {
	closeIcon,
	arrowRight,
	arrowLeft,
	//  chatBotIcon,
	chatBotIconNew,
} from './utils/vectors'
import './style.global.css'
import { useIntl } from 'react-intl'
import { usePixel } from 'vtex.pixel-manager'

interface ChatBotProps {}

const ChatBot: React.FC<ChatBotProps> = ({}) => {
	//Intl
	const intl = useIntl()
	const { push } = usePixel()

	const [isFirstModalOpen, setIsFirstModalOpen] = useState(false)
	const [isLiveChat, setIsLiveChat] = useState(false)
	const [isPdpMobile, setIsPdpMobile] = useState(false)

	//SVGs
	const IconClose = Buffer.from(closeIcon).toString('base64')
	const IconRight = Buffer.from(arrowRight).toString('base64')
	const IconLeft = Buffer.from(arrowLeft).toString('base64')
	const IconBot = Buffer.from(chatBotIconNew).toString('base64')

	//Analytics event
	const handleChatBotClick = (e: any) => {
		const optionChoosed = (e: any) => {
			if (
				e.target.className ==
					'bauknechtde-chatbot-bkde-1-x-firstChatContainer' ||
				e.target.className == 'LPMcontainer LPMoverlay'
			) {
				return 'Question about online purchase or existing order'
			} else {
				return 'Problem with Delivered Device'
			}
		}

		//GA4FUNREQ16
		push({
			event: 'ga4-chatSupport',
			data: {
				chatRequest: optionChoosed(e),
				chatStatus: 'Chat Request (Available)',
			},
		})
	}

	//Handling custom event
	useEffect(() => {
		if (typeof window != undefined) {
			window.addEventListener('chatbot-open-trigger', () => {
				setIsFirstModalOpen(true)
			})
			if (window.location.href.includes('/p') && window.innerWidth <= 1024) {
				setIsPdpMobile(true)
			}
		}
	}, [typeof window])

	return (
		<>
			<div
				className={styles.chatBotContainer}
				style={isPdpMobile ? { bottom: '15%' } : {}}
				onClick={() => setIsFirstModalOpen(!isFirstModalOpen)}
			>
				<img
					className={styles.chatManImage}
					// src="/arquivos/live-chat-man.png" //Person Icon
					src={`data:image/svg+xml;base64,${IconBot}`} //New icon
					alt="chatbot image"
				/>
			</div>
			{/* FIRST MODAL */}
			<div
				className={styles.firstFormContainer}
				style={{ display: isFirstModalOpen ? 'block' : 'none' }}
			>
				<div className={styles.helpContainer}>
					<span className={styles.helpText}>
						{!isLiveChat
							? intl.formatMessage({ id: 'store/chatbot.helpQuestionLabel' })
							: intl.formatMessage({ id: 'store/chatbot.helpTextLabel' })}
					</span>
					<img
						onClick={() => setIsFirstModalOpen(false)}
						className={styles.helpImage}
						src={`data:image/svg+xml;base64,${IconClose}`}
						alt="close-icon"
					/>
				</div>
				{/* Whatsapp */}
				<div style={{ display: isLiveChat ? 'none' : 'block' }}>
					<div
						className={styles.whatsappContainer}
						onClick={() => setIsLiveChat(true)}
					>
						<span className={styles.whatsappText}>
							{intl.formatMessage({ id: 'store/chatbot.liveChatLabel' })}
						</span>
						<img
							className={styles.whatsappImage}
							src={`data:image/svg+xml;base64,${IconRight}`}
							alt="arrow-right"
						/>
					</div>
					<div className={styles.whatsappContainer}>
						<div id="WA_BUTTON" className={styles.whatsappEmbeddedButton}></div>
						<span className={styles.whatsappText}>
							{intl.formatMessage({ id: 'store/chatbot.WhatsappLabel' })}
						</span>
						<img
							className={styles.whatsappImage}
							src={`data:image/svg+xml;base64,${IconRight}`}
							alt="arrow-right"
						/>
					</div>
				</div>
				{/* Live Chats */}
				<div style={{ display: isLiveChat ? 'block' : 'none' }}>
					<div
						className={styles.whatsappContainer}
						onClick={(e) => {
							setIsFirstModalOpen(false),
								setIsLiveChat(false),
								handleChatBotClick(e)
						}}
					>
						<div
							id="LP_DIV_1619009067286"
							className={styles.firstChatContainer}
						></div>
						<span className={styles.whatsappText}>
							{intl.formatMessage({ id: 'store/chatbot.D2CChatLabel' })}
						</span>
						<img
							className={styles.whatsappImage}
							src={`data:image/svg+xml;base64,${IconRight}`}
							alt="arrow-right"
						/>
					</div>
					<div
						className={styles.whatsappContainer}
						onClick={(e) => {
							setIsFirstModalOpen(false),
								setIsLiveChat(false),
								handleChatBotClick(e)
						}}
					>
						<div
							id="LP_DIV_1547828811012"
							className={styles.secondChatContainer}
						></div>
						<span className={styles.whatsappText}>
							{intl.formatMessage({ id: 'store/chatbot.WalterChatLabel' })}
						</span>
						<img
							className={styles.whatsappImage}
							src={`data:image/svg+xml;base64,${IconRight}`}
							alt="arrow-right"
						/>
					</div>
				</div>
				<div className={styles.goBackContainer}>
					<div
						className={styles.goBackWrapper}
						onClick={() => {
							isLiveChat ? setIsLiveChat(false) : setIsFirstModalOpen(false)
						}}
					>
						<img
							className={styles.goBackImage}
							src={`data:image/svg+xml;base64,${IconLeft}`}
							alt="arrow-left"
						/>
						<span className={styles.goBackText}>
							{intl.formatMessage({ id: 'store/chatbot.backLabel' })}
						</span>
					</div>
				</div>
			</div>
		</>
	)
}

export default ChatBot
