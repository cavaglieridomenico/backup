import React from 'react';

export interface Props {
  className?: string;
}
 
export default class PencilIcon extends React.Component<Props> {
  render() {
    return (
        <svg className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.91 18">
            <g id="Livello_2" data-name="Livello 2">
                <g id="BARRA_INFO" data-name="BARRA INFO">
                    <path className="cls-1" style={{fill:"#deb01a"}} d="M16.91,6.47A8.13,8.13,0,0,0,1,6.47,1.51,1.51,0,0,0,0,7.88V10.6a1.49,1.49,0,0,0,1.49,1.49h.15a1.5,1.5,0,0,0,1.5-1.49V7.88A1.51,1.51,0,0,0,2.08,6.45a7.07,7.07,0,0,1,13.74,0,1.51,1.51,0,0,0-1.05,1.43V10.6A1.5,1.5,0,0,0,15.89,12a7.38,7.38,0,0,1-5.15,4.73A.94.94,0,0,0,9.83,16H8.12a.94.94,0,0,0-.94.94v.09a.94.94,0,0,0,.94.94H9.83a1,1,0,0,0,.9-.69,7.89,7.89,0,0,0,5.7-5.22,1.5,1.5,0,0,0,1.48-1.49V7.88A1.5,1.5,0,0,0,16.91,6.47Z"/>
                </g>
            </g>
        </svg>)
  }
}