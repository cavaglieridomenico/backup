import React from 'react';

export interface Props {
  className?: string;
}

export default class Koelen extends React.Component<Props> {
  render() {
    return (
        <svg  className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.03 105.33">
            <defs></defs>
            <g id="Livello_2" data-name="Livello 2"><g id="CATEGORIE">
                    <path className="cls-1" d="M41.76,104.24v-1.09H7.27a5.1,5.1,0,0,1-5.09-5.09V7.27A5.09,5.09,0,0,1,7.27,2.18H41.76a5.09,5.09,0,0,1,5.09,5.09V98.06a5.09,5.09,0,0,1-5.09,5.09v2.18A7.28,7.28,0,0,0,49,98.06V7.27A7.28,7.28,0,0,0,41.76,0H7.27A7.28,7.28,0,0,0,0,7.27V98.06a7.28,7.28,0,0,0,7.27,7.27H41.76Z">
                    </path>
                    <polyline className="cls-1" points="0.18 33.78 47.22 33.78 47.22 31.6 0.18 31.6"></polyline>
                    <rect className="cls-1" x="6.9" y="14.44" width="4.36" height="10.35"></rect>
                    <rect className="cls-1" x="6.9" y="38.77" width="4.36" height="10.35"></rect>
            </g></g>
        </svg>
    )
  }
}