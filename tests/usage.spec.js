// add spec here!
import '../assets/index.less';
import expect from 'expect.js';
// import TestUtils from 'react-addons-test-utils';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PullToRefresh from '../src/index';

describe('m-pull-to-refresh', () => {
  let instance;
  let div;
  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });
  afterEach(() => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  });

  function loadingFunction() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }
  it('should add css class of root dom node', () => {
    instance = ReactDOM.render(
      <PullToRefresh className="forTest"
        loadingFunction={loadingFunction}
        icon={
          <div style={{ marginTop: 15 }}>
            <div className="pull">
              pull down to refresh
            </div>
            <div className="release">
              release to refresh
            </div>
          </div>
        }
        loading={<div style={{ marginTop: 15 }}>Loading</div>}
        distanceToRefresh={40}
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
      >
        <div style={{ height: 50 }}>Item 1</div>
      </PullToRefresh>, div
    );
    expect(ReactDOM.findDOMNode(instance).className.indexOf('forTest') !== -1).to.be(true);
  });
});
