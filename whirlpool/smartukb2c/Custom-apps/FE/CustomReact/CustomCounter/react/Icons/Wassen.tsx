import React from 'react';

export interface Props {
    className?: string;
}

export default class Wassen extends React.Component <Props> {
  render() {
    return (
        <svg className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 124.7 150">
            <defs><style></style></defs>
            <g className="cls-1">
                <g id="Livello_2" data-name="Livello 2">
                    <g id="CATEGORIE">
                        <g className="cls-2">
                            <path className="cls-3" d="M112.65,148.19v-1.8H12.05A8.47,8.47,0,0,1,3.61,138V12.05a8.47,8.47,0,0,1,8.44-8.44h100.6a8.47,8.47,0,0,1,8.43,8.44V138a8.47,8.47,0,0,1-8.43,8.44V150a12.08,12.08,0,0,0,12-12.05V12.05a12.08,12.08,0,0,0-12-12H12.05A12.08,12.08,0,0,0,0,12.05V138A12.08,12.08,0,0,0,12.05,150h100.6Z"/>
                            <polyline className="cls-3" points="1.59 31.18 122.68 31.18 122.68 27.56 1.59 27.56"/>
                            <path className="cls-3" d="M26,82.68H24.18A38.86,38.86,0,1,0,63,43.83,38.86,38.86,0,0,0,24.18,82.68H27.8A35.23,35.23,0,1,1,38.12,107.6,35.13,35.13,0,0,1,27.8,82.68Z"/>
                            <circle className="cls-3" cx="25.09" cy="15.82" r="4.52"/>
                            <ellipse className="cls-3" cx="85.18" cy="83.59" rx="4.07" ry="11.75"/>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
    )
  }
}