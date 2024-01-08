import push from '../../src/utils/push'
import { PixelMessage } from '../../typings/events'
import { getData } from '../utils/product-utils'
import { pushWithoutDuplicates } from '../utils/product-utils'
import { getUrlToPush } from '../utils/page-utils'

export function sendUserEvents(e: PixelMessage) {
  switch (e.data.eventName) {
    //GA4FUNREQ58
    case 'vtex:ga4-custom_error': {
      const { type, description } = e.data
      push({
        event: 'custom_error',
        type: type,
        description: description,
      })
      break
    }

    //GA4FUNREQ-CC-05
    case 'vtex:forgot_password': {
      push({
        event: 'forgot_password',
      })
      break
    }

    //GA4FUNREQ61
    case 'vtex:ga4-optin': {
      push({
        event: 'optin',
      })
      break
    }

    //GA4FUNREQ24B
    case 'vtex:ga4-logout': {
      const logoutEvent = {
        event: 'logout',
        type: 'logout',
      }
      pushWithoutDuplicates(logoutEvent)
      break
    }

    //GA4FUNREQ24
    case 'vtex:ga4-personalArea-login': {
      const section = 'Personal Area'
      push({
        event: 'personalArea',
        eventCategory: 'Personal Area',
        eventAction: 'Login',
        eventLabel: `Login from ${section}`,
        type: 'login',
      })
      break
    }

    //GA4FUNREQ54
    case 'vtex:menu_footer_click': {
      const { event, linkUrl, linkText, clickArea, type }: { event: string, linkUrl: string, linkText: string, clickArea: string, type: string } = e.data

      let upperCasedArea = clickArea?.[0]?.toUpperCase() + clickArea?.slice(1);

      push({
        event: event,
        link_url:
          getData(linkUrl) === 'Data not available'
            ? getData(linkUrl)
            : getUrlToPush(linkUrl),
        link_text: getData(linkText),
        click_area: getData(clickArea),
      })
      if (type == 'spare-parts') {
        push({
          event: 'menuFooter',
          eventCategory: 'Menu and Footer Clicks',
          eventAction: `${upperCasedArea} - ${linkText?.toLowerCase()}`,
          eventLabel: getData(window.location.origin + linkUrl),
        })
      }

      break
    }

    case 'vtex:userData': {
      const { data } = e
      if (!data.isAuthenticated) {
        return
      }
      fetch("/api/sessions?items=*",{ method: "GET", })
          .then(response => response.json())
          .then(_ => {
            fetch("/_v/wrapper/api/user/userinfo",{
              method: 'GET',
            }).then(response => response.json())
            .then(_ => {
              if(window.location.pathname == "/login"){
                push({
                event: 'personalArea',
                eventCategory: 'Personal Area', // Fixed value
                eventAction: 'Login',
                eventLabel: `Login from Personal Area`
              });}
            }).catch(err => {
              console.error(err);
            });
          });
      break;
    }

    //FUNREQ30A E FUNREQ30B
    //GA4FUNREQ23
    case 'vtex:ga4-personalArea': {
      const { section, type } = e.data
      push({
        event: 'personalArea',
        eventCategory: 'Personal Area',
        eventAction: 'Start Registration',
        eventLabel: `Start Registration from ${section}`,
        type: type,
      })
      break
    }

    //GA4FUNREQ53
    case 'vtex:ga4-form_submission': {
      const { type } = e.data
      push({
        event: 'form_submission',
        type: type,
      })
      break
    }

    //GA4FUNREQ17
    case 'vtex:contacts_click': {
      const { event, type } = e.data
      const contactsClickEvent = {
        event: event,
        type: type,
      }
      pushWithoutDuplicates(contactsClickEvent)
      break
    }

    //GA4FUNREQ19
    case 'vtex:ga4-serviceContactFormSubmit': {
      const { serviceReason, type } = e.data.ga4Data
      push({
        event: 'serviceContactFormSubmit',
        serviceReason: serviceReason,
        type: type,
      })
      break
    }

    case "vtex:personalArea": {
      const {type, section} = e.data; 

      push({
				event: 'personalArea',
        eventCategory: 'Personal Area',
        eventAction: type === "registration" ? "Start Registration" : "Login",
        eventLabel: (type === "registration" ? "Start Registration" : "Login") + " from " + section,
        type: type 
			})
    }
  }
}
