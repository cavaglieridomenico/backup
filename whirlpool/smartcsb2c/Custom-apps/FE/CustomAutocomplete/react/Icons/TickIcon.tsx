import React from 'react';

export interface Props {
  className?: string;
}
 
export default class TickIcon extends React.Component<Props> {
  render() {
    return (
        <svg className={this.props.className} xmlns="http://www.w3.org/2000/svg" version="1.1"viewBox="0 0 367.805 367.805">
            <g>
                <path style={{"fill":"#3BB54A"}}  d="M183.903,0.001c101.566,0,183.902,82.336,183.902,183.902s-82.336,183.902-183.902,183.902   S0.001,285.469,0.001,183.903l0,0C-0.288,82.625,81.579,0.29,182.856,0.001C183.205,0,183.554,0,183.903,0.001z"/>
                <polygon style={{"fill":"#fff"}} points="285.78,133.225 155.168,263.837 82.025,191.217 111.805,161.96 155.168,204.801    256.001,103.968  "/>
            </g>
        </svg>
    )
  }
}