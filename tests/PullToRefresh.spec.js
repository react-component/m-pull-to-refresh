import React from 'react';
import { render } from 'enzyme';
import renderToJson from 'enzyme-to-json';
import PullToRefresh from '../src';

describe('basic', () => {
  it('base.', () => {
    const wrapper = render(
      <PullToRefresh>
        <div style={{ height: 50 }}>Item 1</div>
      </PullToRefresh>
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
});
