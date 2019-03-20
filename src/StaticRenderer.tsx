import * as React from 'react';

export default class StaticRenderer extends React.Component<any, any> {
  shouldComponentUpdate(nextProps: any) {
    return nextProps.shouldUpdate;
  }
  render() {
    return <div>{this.props.render()}</div>;
  }
}
