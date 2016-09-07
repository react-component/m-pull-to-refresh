import React, { PropTypes } from 'react';
import initWebPullToRefresh from './wptr.1.1';
import Hammer from 'react-hammerjs';

const emptyEvents = {
  onPanStart: undefined,
  onPan: undefined,
  onPanEnd: undefined,
};

export default class PullToRefresh extends React.Component {
  static propTypes = {
    loadingFunction: PropTypes.func.isRequired,
    icon: PropTypes.element,
    prefixCls: PropTypes.string,
    loading: PropTypes.element,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    contentClassName: PropTypes.string,
    contentStyle: PropTypes.object,
    distanceToRefresh: PropTypes.number,
    resistance: PropTypes.number,
    children: PropTypes.any,
    hammerOptions: PropTypes.object,
    onPan: PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'rmc-pull-to-refresh',
    onPan: () => { return true; },
  };

  componentWillMount() {
    this.webPullToRefresh = initWebPullToRefresh();
  }
  componentDidMount() {
    const { props, refs } = this;
    this.webPullToRefresh.init({
      contentEl: refs.content,
      containerEl: refs.container,
      ptrEl: refs.ptr,
      prefixCls: props.prefixCls,
      distanceToRefresh: props.distanceToRefresh,
      loadingFunction: props.loadingFunction,
      resistance: props.resistance,
      onPan: props.onPan,
    });
  }

  render() {
    const {
      prefixCls, children, icon, loading, disabled, className = '',
      style, contentStyle, contentClassName = '', hammerOptions = {},
    } = this.props;
    const events = disabled ? emptyEvents : this.webPullToRefresh.events;
    return (
      <div className={`${className} ${prefixCls}`} style={style} ref="container">
        <div ref="ptr" className={`${prefixCls}-ptr`}>
          <div className={`${prefixCls}-ptr-icon`}>{icon}</div>
          <div className={`${prefixCls}-ptr-loading`}>{loading}</div>
        </div>
        <Hammer direction="DIRECTION_ALL" {...events} options={hammerOptions}>
          <div
            ref="content"
            className={`${prefixCls}-content ${contentClassName}`}
            style={contentStyle}
          >
            {children}
          </div>
        </Hammer>
      </div>
    );
  }
}
