export const accountIcon =
  '<svg class="frccwhirlpool-conditional-login-0-x-menuItemIcon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="inf-login"><path d="M1.17157 10.7717C1.92172 10.0215 2.93913 9.6001 4 9.6001H10.4C11.4609 9.6001 12.4783 10.0215 13.2284 10.7717C13.9786 11.5218 14.4 12.5392 14.4 13.6001V15.2001C14.4 15.6419 14.0418 16.0001 13.6 16.0001C13.1582 16.0001 12.8 15.6419 12.8 15.2001V13.6001C12.8 12.9636 12.5471 12.3531 12.0971 11.903C11.647 11.453 11.0365 11.2001 10.4 11.2001H4C3.36348 11.2001 2.75303 11.453 2.30294 11.903C1.85286 12.3531 1.6 12.9636 1.6 13.6001V15.2001C1.6 15.6419 1.24183 16.0001 0.8 16.0001C0.358172 16.0001 0 15.6419 0 15.2001V13.6001C0 12.5392 0.421427 11.5218 1.17157 10.7717Z" fill="#231F20"></path><path d="M7.2002 1.6C5.87471 1.6 4.8002 2.67452 4.8002 4C4.8002 5.32548 5.87471 6.4 7.2002 6.4C8.52568 6.4 9.6002 5.32548 9.6002 4C9.6002 2.67452 8.52568 1.6 7.2002 1.6ZM3.2002 4C3.2002 1.79086 4.99106 0 7.2002 0C9.40933 0 11.2002 1.79086 11.2002 4C11.2002 6.20914 9.40933 8 7.2002 8C4.99106 8 3.2002 6.20914 3.2002 4Z" fill="#231F20"></path></g></svg>';

export const dropdownOpen = 
  '<svg width="5" height="4" viewBox="0 0 5 4" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M0 0.857178L2.5 3.85718L5 0.857178L0 0.857178Z" fill="#134468"/> </svg>'

export const dropdownClose = 
  '<svg width="5" height="4" viewBox="0 0 5 4" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M5 3.85718L2.5 0.857178L0 3.85718L5 3.85718Z" fill="#134468"/> </svg>'

  export const utilsFunctions = {
  printTheCorrectIcon: (imageLinkNotLogged: string, imageLinkLogged: string, iconAccount: any, name: any) => {
    if (imageLinkNotLogged !== undefined && name == "") {
      return imageLinkNotLogged
    } else if (imageLinkLogged !== undefined && name !== "") {
      return imageLinkLogged
    } else {
      return iconAccount
    }
  }
}