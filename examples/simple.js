// use jsx to render html, do not modify simple.html

import 'rmc-pull-to-refresh/assets/index.less';
import PullToRefresh from 'rmc-pull-to-refresh';
import React from 'react';
import ReactDOM from 'react-dom';
import Icon from 'antd/lib/icon';
import 'antd/lib/icon/style/css';

let count = 1;
const App = React.createClass({
  getInitialState() {
    return {
      items: [
        <div key={`item-${count}`} style={{ height: 50 }}>Item {count++}</div>,
      ],
    };
  },
  onPan(e) {
    if (document.body.scrollTop > 5 && e.additionalEvent === 'pandown') {
      return false;
    }
    return true;
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve();
    //   }, 500);
    // });
  },
  loadingFunction() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.addItem()) {
          resolve();
        } else {
          reject();
        }
      }, 500);
    });
  },
  addItem() {
    this.state.items.push(<div key={`item-${count}`} style={{ height: 100 }}>Item {count++}</div>);
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
        <PullToRefresh
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
          className="forTest"
          contentClassName="for-test"
          contentStyle={{
            minHeight: 300,
          }}
          style={{
            textAlign: 'center',
            width: '90%',
            margin: '0 auto',
            border: '1px solid red',
          }}
          hammerOptions={{
            touchAction: 'auto',
            recognizers: {
              pan: {
                threshold: 5,
              },
            },
          }}
          onPan={this.onPan}
        >
          <h3>Pull down to refresh</h3>
          {this.state.items}
        </PullToRefresh>
      </div>
    );
  },
});

ReactDOM.render(<App />, document.getElementById('__react-content'));
