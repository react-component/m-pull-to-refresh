import React from 'react';
export default interface PropsType {
  getScrollContainer: () => React.ReactElement<any>;
  direction?: 'down' | 'up';
  refreshing?: boolean;
  distanceToRefresh: number;
  onRefresh: () => void;
  renderer: (arg: string) => any;
  prefixCls?: string;
  className?: string;
}
