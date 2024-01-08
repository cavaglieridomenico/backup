import React, { FC, useState } from 'react'
import style from './ffstyles.css'
import { useIntl } from 'react-intl'
import { Collapsible } from 'vtex.styleguide'
import { useSection } from './providers/context'
import { closeSvg } from './vectors/vectors'
import ModalContainer from './components/ModalContainer'
import Toast from './components/Toast'

export interface Friend {
  email: string
  remainingDays: number
}
interface Expired {
  email: string
}

const FriendsAndExpired: FC = ({ }) => {
  const { activeFriends, expiredFriends, expiredEmail, setExpiredEmail, removeFriend, isSuccessfullyRemoved, reInviteFriend, isSuccessfullyAdded, closeExpiredModal, friendEmail, setFriendEmail, closeFriendModal } = useSection()
  const intl = useIntl()
  const closeIcon = Buffer.from(closeSvg).toString("base64");

  const [isOpen, setIsOpen] = useState({
    friends: false,
    expired: false
  })

  const friendsNumber = activeFriends?.length || 0
  const expiredNumber = expiredFriends?.length || 0

    return (
      <>
      <div className={style.friendsCollapsibleContainer}>
        {/* TOAST */}
        {isSuccessfullyRemoved &&
            <Toast
              message={intl.formatMessage({ id: "store/ff-section.remove-friend-success"})}
            />
        }
        {isSuccessfullyAdded &&
        <Toast
          message={intl.formatMessage({ id: "store/ff-section.invite-email-success"})}
        />
        }
        {/* COLLAPSIBLES */}
        <Collapsible
          header={<span className={style.sectionTitle}>{`${intl.formatMessage({ id: "store/ff-section.friends-label"})} (${friendsNumber})`}</span>}
          onClick={() => setIsOpen({ ...isOpen, friends: !isOpen.friends })}
          isOpen={isOpen.friends}
          caretColor="base"
          align="right"
          >
          <div className={style.friendsContainer}>
            {friendsNumber > 0 ?
             activeFriends.map((friend: Friend, index: number) =>
            <>
              <div key={index} className={style.friendCard}>
                <img src={`data:image/svg+xml;base64,${closeIcon}`} className={style.closeIcon} alt="Close Icon" onClick={() => setFriendEmail(friend.email)}/>
                <span className={style.cardLabelEmail}>
                  {friend.email}
                </span>
                <span className={style.cardLabelExpiration}>
                  {`${friend.remainingDays} ${intl.formatMessage({ id: "store/ff-section.daysLeft"})}`}
                </span>
              </div>
            </>
            )
            :
              <div className={style.noFriendsMessage}>{intl.formatMessage({ id: "store/ff-section.no-friends"})}</div>
            }
          </div>
        </Collapsible>
      </div>
      <div className={style.friendsCollapsibleContainer}>
        <Collapsible
          header={<span className={style.sectionTitle}>{`${intl.formatMessage({ id: "store/ff-section.expired-label"})} (${expiredNumber})`}</span>}
          onClick={() => setIsOpen({ ...isOpen, expired: !isOpen.expired })}
          isOpen={isOpen.expired}
          caretColor="base"
          align="right"
          >
          <div className={style.friendsContainer}>
            {expiredNumber > 0 ?
             expiredFriends.map((expired: Expired, index: number) =>
              <div key={index} className={style.friendCard}>
                <span className={style.cardLabelEmail}>{expired.email}</span>
                <span className={style.reInviteLabel} onClick={() => setExpiredEmail(expired.email)}>
                  {intl.formatMessage({ id: "store/ff-section.invite-again-label"})}
                </span>
              </div>
            )
            :
              <div className={style.noFriendsMessage}>{intl.formatMessage({ id: "store/ff-section.no-expired"})}</div>
            }
          </div>
        </Collapsible>
        {/* MODALS */}
        {friendEmail &&
          <ModalContainer>
            <img src={`data:image/svg+xml;base64,${closeIcon}`} className={style.closeIcon} alt="Close Icon" onClick={() => closeFriendModal()}/>
            <span className={style.modalFriendQuestion}>{intl.formatMessage({ id: "store/ff-section.modal-friend-question-1"})} <span className={style.modalFriendQuestionEmail}>{friendEmail}</span> {intl.formatMessage({ id: "store/ff-section.modal-friend-question-2"})}</span>
            <div className={style.modalButtonsContainer}>
              <button className={style.cancelButton} onClick={() => closeFriendModal()}>
                {intl.formatMessage({ id: "store/ff-section.invite-cancel-button-text"})}
              </button>
              <button className={style.submitButton} onClick={() => {removeFriend(friendEmail)}}>
                {intl.formatMessage({ id: "store/ff-section.invite-confirm-button-text"})}
              </button>
            </div>
          </ModalContainer>}
        {expiredEmail &&
          <ModalContainer>
            <img src={`data:image/svg+xml;base64,${closeIcon}`} className={style.closeIcon} alt="Close Icon" onClick={() => closeExpiredModal()}/>
            <span className={style.modalFriendQuestion}>
              {intl.formatMessage({ id: "store/ff-section.modal-expired-question-1"})} <span className={style.modalFriendQuestionEmail}>{expiredEmail}</span> {intl.formatMessage({ id: "store/ff-section.modal-expired-question-2"})}
            </span>
            <div className={style.modalButtonsContainer}>
              <button className={style.cancelButton} onClick={() => closeExpiredModal()}>{intl.formatMessage({ id: "store/ff-section.invite-cancel-button-text"})}</button>
              <button className={style.submitButton} onClick={() => {reInviteFriend(expiredEmail)}}>{intl.formatMessage({ id: "store/ff-section.invite-confirm-button-text"})}</button>
            </div>
          </ModalContainer>}
      </div>
      </>
    )
}

export default FriendsAndExpired
