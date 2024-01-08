import React from 'react';

export interface Props {
    className?: string;
}


export default class Vaatwassen extends React.Component<Props> {
  render() {
    return (
        <svg  className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84.81 100">
            <defs></defs>
            <g id="Livello_2" data-name="Livello 2">
                <g id="CATEGORIE">
                    <path className="cls-1" d="M76.37,98.73V97.47H8.44a5.94,5.94,0,0,1-5.91-5.91V8.44A5.94,5.94,0,0,1,8.44,2.53H76.37a5.94,5.94,0,0,1,5.91,5.91V91.56a5.94,5.94,0,0,1-5.91,5.91V100a8.45,8.45,0,0,0,8.44-8.44V8.44A8.45,8.45,0,0,0,76.37,0H8.44A8.45,8.45,0,0,0,0,8.44V91.56A8.45,8.45,0,0,0,8.44,100H76.37Z">
                    </path>
                        <polyline className="cls-1" points="1.11 20.78 83.39 20.78 83.39 18.25 1.11 18.25">
                        </polyline>
                        <rect className="cls-1" x="40.09" y="7.65" width="4.75" height="4.75">
                        </rect>
                    <ellipse className="cls-1" cx="43.42" cy="31.54" rx="8.23" ry="2.85"></ellipse>
                </g>
            </g>
        </svg>
    )
  }
}