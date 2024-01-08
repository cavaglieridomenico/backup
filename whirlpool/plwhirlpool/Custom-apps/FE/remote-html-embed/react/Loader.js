import classnames from "classnames";
import { Spinner } from 'vtex.styleguide'

import style from "./style";

const Loader = (props) => {
  return (
    <div className={classnames(style.loaderWrapper)}>
      <Spinner />
    </div>
  )
}

export default Loader;
