
import React from 'react';

export interface Props {
  className?: string;
  role? :string;
  onClick?: any;
}

export default class SearchIcon extends React.Component<Props> {
  render() {
    return (
        <svg onClick={(e) =>{this.props.onClick(e)}} role={this.props.role} fill="none" width="16" height="16" viewBox="0 0 16 16" className={this.props.className} xmlns="http://www.w3.org/2000/svg" ><use href="#hpa-search"></use></svg>
    )
  }
}
