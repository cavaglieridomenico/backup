import React from 'react';

export interface Props {
  className?: string;
}


export default class Wasdroog extends React.Component<Props> {

  
  render() {
    return (
      <svg className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34.5 41.5">
          <g id="Livello_2" data-name="Livello 2"><g id="Livello_1-2" data-name="Livello 1">
            <path className="cls-1" d="M31.17,41v-.5H3.33a2.28,2.28,0,0,1-1.64-.69A2.28,2.28,0,0,1,1,38.17V3.33a2.28,2.28,0,0,1,.69-1.64A2.28,2.28,0,0,1,3.33,1H31.17a2.28,2.28,0,0,1,1.64.69,2.28,2.28,0,0,1,.69,1.64V38.17a2.36,2.36,0,0,1-2.33,2.33v1a3.34,3.34,0,0,0,3.33-3.33V3.33A3.34,3.34,0,0,0,31.17,0H3.33A3.34,3.34,0,0,0,0,3.33V38.17A3.34,3.34,0,0,0,3.33,41.5H31.17Z"></path>
            <path className="cls-1" d="M26.42,34v-.5H7.58a2.36,2.36,0,0,1-2.33-2.33V16.33A2.36,2.36,0,0,1,7.58,14H26.42a2.36,2.36,0,0,1,2.33,2.33V31.17a2.36,2.36,0,0,1-2.33,2.33v1a3.34,3.34,0,0,0,3.33-3.33V16.33A3.34,3.34,0,0,0,26.42,13H7.58a3.34,3.34,0,0,0-3.33,3.33V31.17A3.34,3.34,0,0,0,7.58,34.5H26.42Z"></path>
            <polyline className="cls-1" points="0.44 8.63 33.94 8.63 33.94 7.63 0.44 7.63"></polyline>
            <circle className="cls-1" cx="6.94" cy="4.38" r="1.25"></circle>
            <ellipse className="cls-1" cx="17.56" cy="17.83" rx="3.25" ry="1.13"></ellipse>
          </g></g>
      </svg>
    )
  }
}