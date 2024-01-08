export async function getUserIsLogged() {
    let logType: string = ''
    await fetch('/_v/wrapper/api/user/userinfo', {
      method: 'GET',
      headers: {},
    }).then(async (response) => {
      let userInfo = await response.json()
      logType = userInfo[0]?.email != undefined ? 'authenticated' : 'anonymous'
    })
    return logType
  }
  
//Function to get user type
export async function getUserType() {
let type: string = ''
await fetch('/_v/wrapper/api/HotCold', {
    method: 'GET',
    headers: {},
})
    .then(async (response) => await response.json())
    .then((data) => {
    type = data.UserType
    })
    .catch(() => {})
return type
}
