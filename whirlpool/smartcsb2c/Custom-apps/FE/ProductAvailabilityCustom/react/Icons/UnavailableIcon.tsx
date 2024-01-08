import React from 'react';

export interface Props {
  className?: string;
}
 
export default class UnavailableIcon extends React.Component<Props> {
  render() {
    return (
        <svg style={{width:"20px", height:"20px"}} className={this.props.className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 368.022 368.022" >
            <g>
	        <path style={{fill:"#D7443E"}} d="M314.101,54.133c71.79,71.847,71.744,188.287-0.103,260.077s-188.287,71.744-260.077-0.103
		    c-71.75-71.806-71.75-188.167,0-259.974c71.381-71.847,187.49-72.224,259.337-0.843C313.54,53.57,313.821,53.851,314.101,54.133z"
		    />
	        <polygon style={{fill:"#FFF"}} points="275.439,124.663 215.88,184.223 275.439,243.782 243.57,275.651 184.011,216.092 
		    124.452,275.651 92.582,243.782 152.142,184.223 92.582,124.663 124.452,92.794 184.011,152.353 243.57,92.794 	"/>
            </g>
        </svg>
    )
  }
}