import * as React from 'react';
import * as Enzyme from 'enzyme';
import { render } from 'enzyme';
import renderToJson from 'enzyme-to-json';
import PullToRefresh from '../src';

// Adapter 类似 classnames 的导出，这里为了方便直接用 commonjs
// see https://github.com/JedWatson/classnames/pull/167
const Adapter = require('enzyme-adapter-react-16');

Enzyme.configure({ adapter: new Adapter() });

describe('basic', () => {
  it('base.', () => {
    const wrapper = render(
      <PullToRefresh>
        <div style={{ height: 50 }}>Item 1</div>
      </PullToRefresh>,
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
});
