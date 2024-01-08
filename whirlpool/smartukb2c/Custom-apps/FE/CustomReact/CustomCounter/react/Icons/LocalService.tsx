import React from 'react';

export interface Props {
  className?: string; 
}

export default class LocalService extends React.Component<Props> {
  render() {
    return ( 
        <svg className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 143 143">
            <defs></defs>
            <g id="Livello_2" data-name="Livello 2"><g id="banner_top">
                <path className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"2px"}} d="M39.86,85.41V62.8a31.31,31.31,0,0,1,62.61,0V85.41"/>
                <path className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"2px"}} d="M102.47,68h5.22a3.48,3.48,0,0,1,3.48,3.48V83.67a3.48,3.48,0,0,1-3.48,3.48h-5.22a0,0,0,0,1,0,0V68A0,0,0,0,1,102.47,68Z"/>
                <path className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"2px"}} d="M34.64,68h5.22a0,0,0,0,1,0,0V87.15a0,0,0,0,1,0,0H33.49a2.33,2.33,0,0,1-2.33-2.33V71.5A3.48,3.48,0,0,1,34.64,68Z"/>
                <path className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"2px"}} d="M76.38,106.28H95.51a7,7,0,0,0,7-7V87.15"/>
                <circle className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"2px"}} cx="71.16" cy="106.28" r="5.22"/>
                <polyline className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"2px"}} points="102.47 68.02 95.51 68.02 95.51 87.15 102.47 87.15"/>
                <polyline className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"2px"}} points="39.86 68.02 46.81 68.02 46.81 87.15 39.86 87.15"/>
                <path className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"2px"}} d="M93.3,40.67l-2.62,2.61a3.47,3.47,0,0,1-4.59.29,24.35,24.35,0,0,0-29.86,0,3.48,3.48,0,0,1-4.59-.29L49,40.67"/>
                <circle className="cls-2" style={{fill:"none", strokeMiterlimit: 10, stroke:"#deb01a"}} cx="71.5" cy="71.5" r="71"/>
            </g></g>
        </svg>
    )
  }
}   