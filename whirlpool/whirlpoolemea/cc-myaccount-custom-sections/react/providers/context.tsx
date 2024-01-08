import React, { createContext, useContext, useMemo, useState, Dispatch, SetStateAction, useEffect } from 'react'
import { Friend } from '../FriendsAndExpired'
import { useRuntime } from "vtex.render-runtime";

interface Context {
  handleSubmit: any
  formError: boolean
  setFormError: Dispatch<SetStateAction<boolean>>
  ExpirationDate: string
  putUserResponse:any
  emailValue: string
  setEmailValue: Dispatch<SetStateAction<string>>
  expiredEmail: string | undefined
  setExpiredEmail: Dispatch<SetStateAction<string>>
  friendEmail: string | undefined
  setFriendEmail: Dispatch<SetStateAction<string>>
  setPutUserResponse: any
  activeFriends: any
  expiredFriends: any
  removeFriend: (email: string) => void
  isSuccessfullyRemoved: boolean
  reInviteFriend: (email: string) => void
  isSuccessfullyAdded: boolean
  closeExpiredModal: any
  closeFriendModal: any
}

const Context = createContext<Context>({} as Context)

export const ContextProvider: React.FC = ({ children }) => {
  const {
    production,
    binding
  } = useRuntime();

  const HOST = !production
  ? `?host=${binding?.canonicalBaseAddress?.split("/")?.[0]}`
  : "";

  const fetchUrl = `/_v/wrapper/api/friends${HOST}`

  /*--- STATES ---*/
  const [formError, setFormError] = useState(false)
  const [putUserResponse, setPutUserResponse] = useState()
  const [emailValue, setEmailValue] = useState("")
  const [expiredEmail, setExpiredEmail]: any = useState(undefined)
  const [friendEmail, setFriendEmail]: any = useState(undefined)
  const [activeFriends, setActiveFriends]:any = useState()
  const [expiredFriends, setExpiredFriends]:any = useState()
  const [isSuccessfullyRemoved, setIsSuccessfullyRemoved] = useState(false)
  const [isSuccessfullyAdded, setIsSuccessfullyAdded] = useState(false)

  /*--- FUNCTIONS ---*/
  useEffect(() => {
    document.body.style.overflow = expiredEmail || friendEmail ? "hidden" : 'auto'

  }, [expiredEmail, friendEmail]);
  const successRemove = () => {
    setIsSuccessfullyRemoved(true)
    setTimeout(() => {
      setIsSuccessfullyRemoved(false)
    }, 3000);
  }
  const successAdd = () => {
    setIsSuccessfullyAdded(true)
    setTimeout(() => {
      setIsSuccessfullyAdded(false)
    }, 3000);
  }
  const closeExpiredModal = () => {
    document.body.style.overflow = 'auto',
    setExpiredEmail(undefined)
  }
  const closeFriendModal = () => {
    document.body.style.overflow = 'auto',
    setFriendEmail(undefined)
  }

  const inviteFriendFetch: any = (data: any, expiresPush: number, fromExpired = false ) => {
    fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      }).then(response => response.ok ? Promise.resolve("OK") : response.text()).then((res :any) => {
      if(res == "OK") {
        if(!fromExpired){
          setActiveFriends([...activeFriends, {"email": data.email, "remainingDays": expiresPush }])
        }
        else {
          setExpiredFriends(expiredFriends.filter((expired: Friend) => expired.email != data.email));
          setActiveFriends([...activeFriends, {"email": data.email, "remainingDays": expiresPush}]);
          successAdd();
        }
        closeExpiredModal()
      }
      setPutUserResponse(res)

    }).then(() => setEmailValue(""))
  }

  // set putUserResponse to undefined to make the message Toast appears
  useEffect(()=> {
    if(putUserResponse == "OK") {setTimeout(()=> {
      setPutUserResponse(undefined)
      // set the same timing present on animation "toastAnimation" present pm ffstyles.css
    }, 3000)}
  }, [putUserResponse])

  /*--- DATE HANDLING ---*/
  const date = new Date()
  date.setFullYear(date.getFullYear() + 1)
  const ExpirationDate = date.toLocaleDateString('it-IT', {year: "numeric", month: '2-digit', day: '2-digit' })
  const today = new Date().getTime()
  const expiresPush = Math.round(((date.getTime() - today)/(60*60*24*1000)))

  /*--- SET NEW USER FETCH ---*/
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      "expirationDate": date,
      "email": e.target[0].value
      }
    //Error handling
    if(e.target[0].value != "") {
      //POST Request
      inviteFriendFetch(data, expiresPush)
    }
    else{
      setFormError(true)
    }
  }

  /*--- GET INVITED USERS FETCH ---*/
  useEffect(() => {
    fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      }).then(response => response.json()).then((res :any) => {setActiveFriends(res.active), setExpiredFriends(res.expired)})
  }, []);

  /*--- REMOVE USERS FETCH ---*/
  const removeFriend = (email: string) => {
    fetch(fetchUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"email": email}),
    }).then(response => {
      if (response.ok) {
        setExpiredFriends([...expiredFriends, {email}])
        setActiveFriends(activeFriends.filter((friend: Friend) => friend.email != email));
        successRemove()
      }
      closeFriendModal()
    })
  }

  /*--- RE-INVITE USERS FETCH ---*/
  const reInviteFriend = (email: string) => {
    const data = {
      "expirationDate": date,
      "email": email
      }
    inviteFriendFetch(data, expiresPush, true)
  }

  const context = useMemo(
    () => ({
      handleSubmit,
      formError,
      setFormError,
      ExpirationDate,
      putUserResponse,
      emailValue,
      setEmailValue,
      expiredEmail,
      setExpiredEmail,
      setPutUserResponse,
      activeFriends,
      expiredFriends,
      removeFriend,
      isSuccessfullyRemoved,
      reInviteFriend,
      isSuccessfullyAdded,
      closeExpiredModal,
      closeFriendModal,
      friendEmail,
      setFriendEmail
    }),
    [formError, putUserResponse, emailValue, expiredEmail, activeFriends, expiredFriends, isSuccessfullyRemoved, isSuccessfullyAdded, friendEmail]
  )

  return (
    <Context.Provider value={context}>{children}</Context.Provider>
  )
}

/**
 * Use this hook to access the orderform.
 * If you update it, don't forget to call refreshOrder()
 * This will trigger a re-render with the last updated data.
 * @example const { orderForm } = useOrder()
 * @returns orderForm, orderError, orderLoading, refreshOrder
 */
export const useSection = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('Error, context is not defined')
  }

  return context
}

export default { ContextProvider, useSection }
