import * as React from 'react';

export interface IIndicator {
  activate?: React.ReactNode;
  deactivate?: React.ReactNode;
  release?: React.ReactNode;
  finish?: React.ReactNode;
}

export interface IPropsType {
  onRefresh: () => void;
  getScrollContainer?: () => React.ReactNode;
  direction?: 'down' | 'up';
  refreshing?: boolean;
  distanceToRefresh?: number;
  indicator?: IIndicator;
  prefixCls?: string;
  className?: string;
  damping?: number;
  style?: React.CSSProperties;
}
