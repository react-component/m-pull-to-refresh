import PullToRefresh from 'index';
import * as React from 'react';

const noop = () => null;
const style = { width: 100 };

export default <>
  <PullToRefresh onRefresh={noop} />

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
</>
