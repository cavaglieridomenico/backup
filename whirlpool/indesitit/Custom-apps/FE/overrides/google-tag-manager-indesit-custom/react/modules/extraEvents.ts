import push from './push'
import {
  PixelMessage,
} from '../typings/events'

export function sendExtraEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    // case 'vtex:pageView': {
    //   push({
    //     event: 'pageView',
    //     location: e.data.pageUrl,
    //     page: e.data.pageUrl.replace(e.origin, ''),
    //     referrer: e.data.referrer,
    //     ...(e.data.pageTitle && {
    //       title: e.data.pageTitle,
    //     }),
    //   })

    //   return
    // }

    case 'vtex:userData': {
      const { data } = e
      if (!data.isAuthenticated) {
        return
      }
      fetch("/crm-sync/vtex/updateuser/"+data.id, {method: "POST"})
      .then(response => {
        console.log(response)
      })
      fetch("/api/sessions?items=*",{
            "method": "GET",
            "headers": {}
          })
          .then(response => response.json())
          .then(json => {
            fetch("/_v/wrapper/api/user/userinfo",{
              method: 'GET',
            }).then(response => response.json())
            .then(user => {
              push({
                event: 'userData',
                userId: data.id,
                "genere": user.gender? user.gender : '',
                email: json.namespaces.profile.email.value
              })
            }).catch(err => {
              console.error(err);
            });
          });

      return
    }
  }
}
