// use jsx to render html, do not modify simple.html

import 'rmc-pull-to-refresh/assets/index.less';
import MPullToRefresh from 'rmc-pull-to-refresh';
import React from 'react';
import ReactDOM from 'react-dom';
import { Icon } from 'antd';
import 'antd/dist/antd.css';

let count = 1;
let App = React.createClass({
  getInitialState() {
    return {
      items: [
        <div key={'item-' + count}>Item {count++}</div>
      ]
    };
  },
  handleRefresh(resolve, reject) {
    let self = this;
    setTimeout(function () {
      self.addItem() ? resolve() : reject();
    }, 2500);
  },
  addItem() {
    this.state.items.push(<div key={'item-' + count}>Item {count++}</div>);
    this.setState({
      items: this.state.items
    });
    return true;
  },
  render() {
    return (
      <MPullToRefresh onRefresh={this.handleRefresh}
        icon={<Icon type="down" />}
        loading={<Icon type="loading" />}
        distanceToRefresh="40"
        style={{
          textAlign: 'center'
        }}
      >
        <h3>Pull down to refresh</h3>
        <div>
          {this.state.items}
        </div>
      </MPullToRefresh>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('__react-content'));
