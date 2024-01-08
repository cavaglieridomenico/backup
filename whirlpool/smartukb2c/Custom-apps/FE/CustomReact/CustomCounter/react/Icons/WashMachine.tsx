import * as React from 'react';
export interface Props {
    className?: string;
  }
const WashMachine = (props:Props) => {
    return (
<svg className={props.className} style={{height:"30px"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 22">
        <g fill="none" fill-rule="evenodd">
          <path fill="#0090d0" d="M.499 18H16.5V0H.499zM.499 19H16.5v3H.499z"></path>
          <path className="no-fill" fill="#FFF" d="M17.833 11c0 3.037-1.119 5.5-2.5 5.5-1.38 0-2.5-2.463-2.5-5.5 0-3.038 1.12-5.5 2.5-5.5 1.381 0 2.5 2.462 2.5 5.5"></path>
          <path stroke="#0090d0" d="M17.833 11c0 3.037-1.119 5.5-2.5 5.5-1.38 0-2.5-2.463-2.5-5.5 0-3.038 1.12-5.5 2.5-5.5 1.381 0 2.5 2.462 2.5 5.5z"></path>
          <path className="no-fill" fill="#FFF" d="M4.333 1.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0M11.333 3h3V1h-3zM8.5 7c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4m0 9c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5"></path>
        </g>
      </svg>
        )}

export default WashMachine;