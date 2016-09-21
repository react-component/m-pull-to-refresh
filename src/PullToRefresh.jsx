import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import DOMScroller from 'zscroller';

// at lease 1s for ux
function fake() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

const defaultScrollerOptions = {
  scrollingX: false,
};

const PullToRefresh = React.createClass({
  propTypes: {
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
    children: PropTypes.any,
    scrollerOptions: PropTypes.object,
    outerContainer: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      prefixCls: 'rmc-pull-to-refresh',
      distanceToRefresh: 50,
    };
  },

  componentDidMount() {
    const { props, refs } = this;
    const { prefixCls, outerContainer } = props;
    let containerClassList;
    if (outerContainer) {
      containerClassList = ReactDOM.findDOMNode(this).parentNode.classList;
      refs.content.style.height = refs.ptr.style.height;
    } else {
      containerClassList = refs.container.classList;
    }
    this.domScroller = new DOMScroller(refs.content, {
      ...defaultScrollerOptions,
      ...props.scrollerOptions,
    });
    const scroller = this.domScroller.scroller;
    scroller.activatePullToRefresh(props.distanceToRefresh,
      () => {
        containerClassList.add(`${prefixCls}-active`);
      },
      () => {
        containerClassList.remove(`${prefixCls}-active`);
        containerClassList.remove(`${prefixCls}-loading`);
      },
      () => {
        containerClassList.add(`${prefixCls}-loading`);
        Promise.all([props.loadingFunction(), fake()])
          .then(this.finishPullToRefresh, this.finishPullToRefresh);
      });
  },

  // componentDidUpdate() {
  //   this.domScroller.reflow();
  // },

  componentWillUnMount() {
    this.domScroller.destroy();
  },

  finishPullToRefresh() {
    this.domScroller.scroller.finishPullToRefresh();
  },

  render() {
    const {
      prefixCls, children, icon, loading, className = '',
      style, contentStyle, contentClassName = '', outerContainer,
    } = this.props;
    const content = (
      <div
        ref="content"
        className={`${prefixCls}-content ${contentClassName}`}
        style={contentStyle}
      >
        <div key="ptr" ref="ptr" className={`${prefixCls}-ptr`}>
          <div className={`${prefixCls}-ptr-icon`}>{icon}</div>
          <div className={`${prefixCls}-ptr-loading`}>{loading}</div>
        </div>
        {outerContainer ? <div ref="placeholder" className={`${prefixCls}-placeholder`} /> : null}
        {children}
      </div>
    );
    if (outerContainer) {
      return content;
    }
    return (
      <div className={`${className} ${prefixCls}`} style={style} ref="container">
        {content}
      </div>
    );
  },
});

export default PullToRefresh;
