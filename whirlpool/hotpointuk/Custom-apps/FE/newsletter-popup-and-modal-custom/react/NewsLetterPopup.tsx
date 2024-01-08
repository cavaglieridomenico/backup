import React, { useState } from 'react'
import { useEffect } from 'react'
import ModalNewsletter from './Modal'
import FetchFunction from './UtilityFunction'
import style from './style.css'
import NewsletterContext from './NewsLetterContext'

interface NewsLetterPopupProps {
	textDescription?: string
	button?: boolean
	textButton?: string
	time?: number
	children: React.Component
}

const NewsLetterPopup: StorefrontFunctionComponent<NewsLetterPopupProps> = ({
	textDescription,
	button,
	textButton,
	time,
	children,
}: NewsLetterPopupProps) => {
	const [user, setUser] = useState(true)
	const [pathName, setPathName] = useState('')

	useEffect(() => {
		FetchFunction.getUser().then((response: any) => {
			if (
				response.namespaces.profile !== undefined &&
				!(response.namespaces.profile.isAuthenticated.value == 'false')
			) {
				FetchFunction.getIsAlreadyOptin(
					response.namespaces.profile.email.value,
				).then((response: any) => {
					const isOptin = response[0].isNewsletterOptIn
					setUser(isOptin)
				})
			} else {
				setUser(false)
			}
		})
	}, [])

	useEffect(() => {
		setPathName(window.location.pathname)
	}, [pathName])

	const getOptin = () => {
		if (user == false) {
			if (button && !pathName.includes('orderPlaced')) {
				return (
					<NewsletterContext.Provider value={{ automatic: false }}>
						<div
							id="discount"
							className={'vtex-container__newsletter ' + style.container}
						>
							<div
								className={'vtex-description__newsletter ' + style.description}
							>
								{textDescription}
							</div>
							<ModalNewsletter
								children={children}
								textButton={textButton}
							></ModalNewsletter>
						</div>
					</NewsletterContext.Provider>
				)
			} else {
				return (
					<NewsletterContext.Provider value={{ automatic: true }}>
						<ModalNewsletter children={children} time={time}></ModalNewsletter>
					</NewsletterContext.Provider>
				)
			}
		} else {
			return <></>
		}
	}
	return getOptin()
}

NewsLetterPopup.schema = {
	title: 'NewsLetterPopup',
	description: 'Pop up for newsletter app',
	type: 'object',
	properties: {
		textDescription: {
			title: 'Description on the container',
			description: 'Description on the container',
			default: undefined,
			type: 'string',
		},
		button: {
			title: 'Container flag',
			description: 'If the container should be visible or not',
			default: undefined,
			type: 'boolean',
		},
		textButton: {
			title: 'Button label',
			description: 'Label assigend to the button able to open the modal',
			default: undefined,
			type: 'string',
		},
		time: {
			title: 'Time for open automatically the modal',
			description:
				'Time expressed in minute, default 60 sec -> if you want 15 sec, then time = 0.25',
			default: undefined,
			type: 'number',
		},
	},
}

export default NewsLetterPopup
