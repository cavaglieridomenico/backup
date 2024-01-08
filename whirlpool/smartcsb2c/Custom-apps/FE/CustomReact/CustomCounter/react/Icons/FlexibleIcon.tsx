import React from 'react';

export interface Props {
  className?: string; 
}

export default class FlexibleIcon extends React.Component<Props> {
  render() {
    return ( 
        <svg className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 143 143">
            <defs></defs><g id="Livello_2" data-name="Livello 2"><g id="banner_top">
                <path className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"1.9x"}} d="M61.73,44.36H40a6.39,6.39,0,0,0-6.51,6.51"/>
                <polyline className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"1.9x"}} points="100.81 53.04 100.81 44.36 81.27 44.36"/>
                <path className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"1.9x"}} d="M107.33,90v17.37H40a6.41,6.41,0,0,1-6.51-6.52V50.87A6.41,6.41,0,0,0,40,57.39h67.32v15.2"/>
                <polyline className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"1.9x"}} points="44.36 57.39 74.76 35.67 89.96 57.39"/>
                <path className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"1.9x"}} d="M107.33,72.59H87.79a8.69,8.69,0,1,0,0,17.37h19.54a2.17,2.17,0,0,0,2.17-2.17v-13A2.17,2.17,0,0,0,107.33,72.59Z"/>
                <line className="cls-1" style={{fill:"none", strokeMiterlimit: 10, stroke:"#666", strokeWidth:"1.9x"}} x1="87.79" y1="81.27" x2="92.13" y2="81.27"/>
                <circle className="cls-2" style={{fill:"none", strokeMiterlimit: 10, stroke:"#deb01a"}} cx="71.5" cy="71.5" r="71"/></g></g>
        </svg>
    )
  }
}   