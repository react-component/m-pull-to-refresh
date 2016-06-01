// use jsx to render html, do not modify simple.html

import 'rmc-pull-to-refresh/assets/index.less';
import MPullToRefresh from 'rmc-pull-to-refresh';
import React from 'react';
import ReactDOM from 'react-dom';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';

let count = 1;
const App = React.createClass({
  getInitialState() {
    return {
      items: [
        <div key={`item-${count}`}>Item {count++}</div>,
      ],
    };
  },
  loadingFunction() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.addItem()) {
          resolve();
        } else {
          reject();
        }
      }, 2500);
    });
  },
  addItem() {
    this.state.items.push(<div key={`item-${count}`}>Item {count++}</div>);
    this.setState({
      items: this.state.items,
    });
    return true;
  },
  render() {
    return (
      <div>
        <style dangerouslySetInnerHTML={{
          __html: `
            .rmc-pull-to-refresh .pull {
                display: block;
             }
            .rmc-pull-to-refresh .release {
              display: none;
            }
            .rmc-pull-to-refresh.rmc-pull-to-refresh-refresh .pull {
                display: none;
            }
            .rmc-pull-to-refresh.rmc-pull-to-refresh-refresh .release {
              display: block;
            }
          `,
        }}
        />
        <MPullToRefresh
          loadingFunction={this.loadingFunction}
          icon={
            <div style={{ marginTop: 15 }}>
            <div className="pull">
            <Icon type="down" />  pull down to refresh
            </div>
            <div className="release">
             <Icon type="up" /> release to refresh
            </div>
            </div>
          }
          loading={<div style={{ marginTop: 15 }}><Icon type="loading" /> Loading</div>}
          distanceToRefresh={40}
          contentStyle={{
            height: '600px',
          }}
          style={{
            textAlign: 'center',
            width: 600,
            margin: '0 auto',
            border: '1px solid red',
          }}
        >
          <h3>Pull down to refresh</h3>
          <div>
            {this.state.items}
          </div>
        </MPullToRefresh>
      </div>
    );
  },
});

ReactDOM.render(<App />, document.getElementById('__react-content'));
