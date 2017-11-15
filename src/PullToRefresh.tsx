import React from 'react';
import classNames from 'classnames';
import { PropsType, Indicator } from './PropsType';

class StaticRenderer extends React.Component<any, any> {
  shouldComponentUpdate(nextProps: any) {
    return nextProps.shouldUpdate;
  }
  render() {
    return <div>{this.props.render()}</div>;
  }
}

function setTransform(nodeStyle: any, value: any) {
  nodeStyle.transform = value;
  nodeStyle.webkitTransform = value;
  nodeStyle.MozTransform = value;
}

const isWebView = typeof navigator !== 'undefined' &&
  /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
const DOWN = 'down';
const UP = 'up';
const INDICATOR = { activate: 'release', deactivate: 'pull', release: 'loading', finish: 'finish' };

export default class PullToRefresh extends React.Component<PropsType, any> {
  static defaultProps = {
    prefixCls: 'rmc-pull-to-refresh',
    getScrollContainer: () => undefined,
    direction: DOWN,
    distanceToRefresh: 25,
    indicator: INDICATOR as Indicator,
  } as PropsType;

  // https://github.com/yiminghe/zscroller/blob/2d97973287135745818a0537712235a39a6a62a1/src/Scroller.js#L355
  // currSt: `activate` / `deactivate` / `release` / `finish`
  state = {
    currSt: '',
    dragOnEdge: false,
  };

  containerRef: any;
  contentRef: any;
  _to: any;
  _ScreenY: any;
  _startScreenY: any;
  _lastScreenY: any;
  _timer: any;

  shouldUpdateChildren = false;

  shouldComponentUpdate(nextProps: any) {
    this.shouldUpdateChildren = this.props.children !== nextProps.children;
    return true;
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps === this.props || prevProps.refreshing === this.props.refreshing) {
      return;
    }
    // triggerPullToRefresh 需要尽可能减少 setState 次数
    this.triggerPullToRefresh();
  }

  componentDidMount() {
    // `getScrollContainer` most likely return React.Node at the next tick. Need setTimeout
    setTimeout(() => {
      this.init(this.props.getScrollContainer() || this.containerRef);
      this.triggerPullToRefresh();
    });
  }

  componentWillUnmount() {
    // Should have no setTimeout here!
    this.destroy(this.props.getScrollContainer() || this.containerRef);
  }

  triggerPullToRefresh = () => {
    // 在初始化时、用代码 自动 触发 pullToRefresh
    // 注意：当 direction 为 up 时，当 visible length < content length 时、则看不到效果
    if (!this.state.dragOnEdge) {
      if (this.props.refreshing) {
        if (this.props.direction === UP) {
          this._lastScreenY = - this.props.distanceToRefresh - 1;
        }
        if (this.props.direction === DOWN) {
          this._lastScreenY = this.props.distanceToRefresh + 1;
        }
        // change dom need after setState
        this.setState({ currSt: 'release' }, () => this.setContentStyle(this._lastScreenY));
      } else {
        this.setState({ currSt: 'finish' }, () => this.reset());
      }
    }
  }

  init = (ele: any) => {
    if (!ele) {
      // like return in destroy fn ???!!
      return;
    }
    this._to = {
      touchstart: this.onTouchStart.bind(this, ele),
      touchmove: this.onTouchMove.bind(this, ele),
      touchend: this.onTouchEnd.bind(this, ele),
      touchcancel: this.onTouchEnd.bind(this, ele),
    };
    Object.keys(this._to).forEach(key => {
      ele.addEventListener(key, this._to[key]);
    });
  }

  destroy = (ele: any) => {
    if (!this._to || !ele) {
      // componentWillUnmount fire before componentDidMount, like forceUpdate ???!!
      return;
    }
    Object.keys(this._to).forEach(key => {
      ele.removeEventListener(key, this._to[key]);
    });
  }

  onTouchStart = (_ele: any, e: any) => {
    this._ScreenY = this._startScreenY = e.touches[0].screenY;
    // 一开始 refreshing 为 true 时 this._lastScreenY 有值
    this._lastScreenY = this._lastScreenY || 0;
  }

  isEdge = (ele: any, direction: string) => {
    const container = this.props.getScrollContainer();
    if (container && container === document.body) {
      // In chrome61 `document.body.scrollTop` is invalid
      const scrollNode = document.scrollingElement ? document.scrollingElement : document.body;
      if (direction === UP) {
        return scrollNode.scrollHeight - scrollNode.scrollTop <= window.innerHeight;
      }
      if (direction === DOWN) {
        return scrollNode.scrollTop <= 0;
      }
    }
    if (direction === UP) {
      return ele.scrollHeight - ele.scrollTop === ele.clientHeight;
    }
    if (direction === DOWN) {
      return ele.scrollTop <= 0;
    }
  }

  onTouchMove = (ele: any, e: any) => {
    // 使用 pageY 对比有问题
    const _screenY = e.touches[0].screenY;
    const { direction } = this.props;

    // 拖动方向不符合的不处理
    if (direction === UP && this._startScreenY < _screenY ||
      direction === DOWN && this._startScreenY > _screenY) {
      return;
    }

    if (this.isEdge(ele, direction)) {
      if (!this.state.dragOnEdge) {
        this.setState({ dragOnEdge: true });
      }
      e.preventDefault();
      e.stopPropagation();

      const _diff = Math.round(_screenY - this._ScreenY);
      this._ScreenY = _screenY;
      this._lastScreenY += _diff;

      this.setContentStyle(this._lastScreenY);

      if (Math.abs(this._lastScreenY) < this.props.distanceToRefresh) {
        if (this.state.currSt !== 'deactivate') {
          // console.log('back to the distance');
          this.setState({ currSt: 'deactivate' });
        }
      } else {
        if (this.state.currSt === 'deactivate') {
          // console.log('reach to the distance');
          this.setState({ currSt: 'activate' });
        }
      }

      // https://github.com/ant-design/ant-design-mobile/issues/573#issuecomment-339560829
      // iOS UIWebView issue, It seems no problem in WKWebView
      if (isWebView && e.changedTouches[0].clientY < 0) {
        this.onTouchEnd();
      }
    }
  }

  onTouchEnd = () => {
    if (this.state.dragOnEdge) {
      this.setState({ dragOnEdge: false });
    }
    if (this.state.currSt === 'activate') {
      if (_this2.props.direction === UP) {
          _this2._lastScreenY = -_this2.props.distanceToRefresh - 1;
      }
      if (_this2.props.direction === DOWN) {
         _this2._lastScreenY = _this2.props.distanceToRefresh + 1;
      }
      _this2.setState({ currSt: 'release' }, function () {
          _this2.setContentStyle(_this2._lastScreenY);
      });
      this._timer = setTimeout(() => {
        if (!this.props.refreshing) {
          this.setState({ currSt: 'finish' }, () => this.reset());
        }
        this._timer = undefined;
      }, 1000);
      this.props.onRefresh();
    } else {
      this.reset();
    }
  }

  reset = () => {
    this._lastScreenY = 0;
    this.setContentStyle(0);
  }

  setContentStyle = (ty: number) => {
    // todos: Why sometimes do not have `this.contentRef` ?
    if (this.contentRef) {
      setTransform(this.contentRef.style, `translate3d(0px,${ty}px,0)`);
    }
  }

  render() {
    const {
      className, prefixCls, children, getScrollContainer,
      direction, onRefresh, refreshing, indicator, distanceToRefresh, ...restProps,
    } = this.props;

    const renderChildren = <StaticRenderer
      shouldUpdate={this.shouldUpdateChildren} render={() => children} />;

    const renderRefresh = (cls: string) => {
      const cla = classNames(cls, !this.state.dragOnEdge && `${prefixCls}-transition`);
      return (
        <div className={`${prefixCls}-content-wrapper`}>
          <div className={cla} ref={el => this.contentRef = el}>
            {direction === UP ? renderChildren : null}
            <div className={`${prefixCls}-indicator`}>
              {(indicator as any)[this.state.currSt] || (INDICATOR as any)[this.state.currSt]}
            </div>
            {direction === DOWN ? renderChildren : null}
          </div>
        </div>
      );
    };

    if (getScrollContainer()) {
      return renderRefresh(`${prefixCls}-content ${prefixCls}-${direction}`);
    }
    return (
      <div
        ref={el => this.containerRef = el}
        className={classNames(className, prefixCls, `${prefixCls}-${direction}`)}
        {...restProps}
      >
        {renderRefresh(`${prefixCls}-content`)}
      </div>
    );
  }
}
