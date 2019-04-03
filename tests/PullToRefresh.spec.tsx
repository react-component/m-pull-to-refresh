import { render } from 'enzyme';
import * as React from 'react';
import PullToRefresh from '../src';

describe('basic', () => {
  it('base.', () => {
    const wrapper = render(
      <PullToRefresh
        onRefresh={() => null}
      >
        <div style={{ height: 50 }}>Item 1</div>
      </PullToRefresh>
    );
    expect(wrapper).toMatchSnapshot();
  });
  it('all props', () => {
    const noop = () => null;
    const style = { width: 100 };

    const wrapper = render(
      <PullToRefresh
        onRefresh={noop}
        getScrollContainer={noop}
        direction="up"
        refreshing={false}
        distanceToRefresh={1}
        indicator={{}}
        prefixCls="rmc"
        className="rmc"
        damping={2}
        style={style}
      >
        <span>111</span>
      </PullToRefresh>
    );
    expect(wrapper).toMatchSnapshot();
  })
});
