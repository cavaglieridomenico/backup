import React, { FunctionComponent } from 'react'
import {
  Link,
  withRouter,
  RouteComponentProps,
} from 'vtex.my-account-commons/Router'

const MenuLink: FunctionComponent<Props> = ({ path, name, location }) => {
  const cssUniqueName = path.replace('/','')
  return (
    <Link
      to={path}
      className={`
        vtex-account_menu-link vtex-account_menu-link--${cssUniqueName} f6 no-underline db hover-near-black pv5 mv3 pl5 bl bw2 nowrap ${
          location.pathname.indexOf(path) === -1
            ? 'c-muted-1 b--transparent'
            : 'c-on-base b b--action-primary'
        }`}
    >
      {name}
    </Link>
  )
}

interface Props extends RouteComponentProps {
  path: string
  name: string
}

export default withRouter(MenuLink)
