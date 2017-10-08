import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropsType from './PropsType';

export class StateType {
  pullUp: any;
  isTouching: boolean;
}

function setTransform(nodeStyle: any, value: any) {
  nodeStyle.transform = value;
  nodeStyle.webkitTransform = value;
  nodeStyle.MozTransform = value;
}

export default class PullToRefresh extends React.Component<PropsType, StateType> {
  static defaultProps = {
    prefixCls: 'rmc-pull-to-refresh',
    direction: 'down',
    distanceToRefresh: 25,
  } as PropsType;

  // https://github.com/yiminghe/zscroller/blob/2d97973287135745818a0537712235a39a6a62a1/src/Scroller.js#L355
  // states: `activate` / `deactivate` / `release` / `finish`
  state = {
    pullUp: '',
    isTouching: false,
  };

  pullUpStats: any = {
    activate: 'activate',
    deactivate: 'deactivate',
    release: 'release',
    finish: 'finish',
  };

  pullUpDisplay: any = {
    activate: '释放刷新',
    deactivate: '上拉 ↑',
    release: '加载中...',
    finish: '完成刷新',
  };

  containerRef: any;
  contentRef: any;
  _to: any;
  _pullUpScreenY: any;
  _pullUpStartScreenY: any;
  _pullUpLastScreenY: any;
  _pullUpTimer: any;

  componentDidUpdate(prevProps: any) {
    if (prevProps === this.props) {
      return;
    }
    const preRefreshing = prevProps.refreshing;
    const nowRefreshing = this.props.refreshing;
    if (preRefreshing && !nowRefreshing && !this._pullUpTimer) {
      this.pullUpFinish();
    } else if (!preRefreshing && nowRefreshing) {
      // this.triggerRefresh();
    }
  }

  componentDidMount() {
    if (this.props.getScrollContainer) {
      setTimeout(() => {
        this.initPullUp(this.props.getScrollContainer());
      });
    } else {
      this.initPullUp(ReactDOM.findDOMNode(this.containerRef));
    }
  }

  componentWillUnmount() {
    if (this.props.getScrollContainer) {
      this.destroyPullUp(this.props.getScrollContainer());
    } else {
      this.destroyPullUp(ReactDOM.findDOMNode(this.containerRef));
    }
  }

  genEvtHandler = (ele: any) => {
    return {
      touchstart: this.onTouchStart.bind(this, ele),
      touchmove: this.onTouchMove.bind(this, ele),
      touchend: this.onTouchEnd.bind(this, ele),
      touchcancel: this.onTouchEnd.bind(this, ele),
    };
  }

  initPullUp = (ele: any) => {
    this._to = this.genEvtHandler(ele);
    Object.keys(this._to).forEach(key => {
      ele.addEventListener(key, this._to[key]);
    });
    if (this.props.refreshing) {
      this.setState({ pullUp: this.pullUpStats.release }, () => {
        this._pullUpLastScreenY = - this.props.distanceToRefresh - 1;
        setTransform(this.contentRef.style,
          `translate3d(0px,${this._pullUpLastScreenY}px,0)`);
      });
    }
  }

  destroyPullUp = (ele: any) => {
    Object.keys(this._to).forEach(key => {
      ele.removeEventListener(key, this._to[key]);
    });
  }

  onTouchStart = (_ele: any, e: any) => {
    this._pullUpScreenY = this._pullUpStartScreenY = e.touches[0].screenY;
    // 一开始 refreshing 为 true 时 this._pullUpLastScreenY 有值
    this._pullUpLastScreenY = this._pullUpLastScreenY || 0;
    this.setState({ isTouching: true });
  }

  onTouchMove = (ele: any, e: any) => {

    // 使用 pageY 对比有问题
    const _screenY = e.touches[0].screenY;
    if (this._pullUpStartScreenY - _screenY > 0) {
      // console.log('is pull up', _screenY);

      let isReachBottom;
      if (this.props.getScrollContainer) {
        // In chrome61 `document.body.scrollTop` is invalid, here `ele === document.body`
        const scrollNode = document.scrollingElement ? document.scrollingElement : ele;
        isReachBottom = ele.scrollHeight - scrollNode.scrollTop <= window.innerHeight;
        // console.log(ele.scrollHeight, scrollNode.scrollTop, window.innerHeight);
      } else {
        isReachBottom = ele.scrollHeight - ele.scrollTop === ele.clientHeight;
      }
      if (isReachBottom) {
        const _diff = Math.round(_screenY - this._pullUpScreenY);
        this._pullUpScreenY = _screenY;
        this._pullUpLastScreenY += _diff;

        setTransform(this.contentRef.style,
          `translate3d(0px,${this._pullUpLastScreenY}px,0)`);

        if (Math.abs(this._pullUpLastScreenY) < this.props.distanceToRefresh) {
          if (this.state.pullUp !== this.pullUpStats.deactivate) {
            // console.log('back to the distance');
            this.setState({ pullUp: this.pullUpStats.deactivate });
          }
        } else {
          if (this.state.pullUp === this.pullUpStats.deactivate) {
            // console.log('reach to the distance');
            this.setState({ pullUp: this.pullUpStats.activate });
          }
        }
      }
    }
  }

  onTouchEnd = () => {
    this.setState({ isTouching: false });
    if (this.state.pullUp === this.pullUpStats.deactivate) {
      this.pullUpFinish();
    } else if (this.state.pullUp === this.pullUpStats.activate) {
      this.setState({ pullUp: this.pullUpStats.release });
      this._pullUpTimer = setTimeout(() => {
        if (!this.props.refreshing) {
          this.pullUpFinish();
        }
        this._pullUpTimer = undefined;
      }, 1000);
      this.props.onRefresh();
    }
  }

  pullUpFinish = () => {
    this._pullUpLastScreenY = 0;
    setTransform(this.contentRef.style, `translate3d(0px,0px,0)`);
    if (this.state.pullUp === this.pullUpStats.release) {
      this.setState({ pullUp: this.pullUpStats.finish });
    }
  }

  // triggerRefresh = () => {}

  render() {
    let {
      className, prefixCls, children, getScrollContainer,
      direction, onRefresh, renderer, distanceToRefresh, ...restProps,
    } = this.props;

    // delete restProps.refreshing

    const renderRefresh = () => {
      let defaultRenderer = this.pullUpDisplay.deactivate;
      switch (this.state.pullUp) {
        case 'activate':
        case 'deactivate':
        case 'release':
        case 'finish':
          defaultRenderer = this.pullUpDisplay[this.state.pullUp];
        default:
      }
      const cls = classNames(`${prefixCls}-content`,
        getScrollContainer && `${prefixCls}-${direction}`,
        !this.state.isTouching && this.state.pullUp && `${prefixCls}-transition`,
      );
      return (
        <div className={`${prefixCls}-content-wrapper`}>
          <div className={cls} ref={el => this.contentRef = el}>
            {children}
            <div className={`${prefixCls}-indicator`}>
              {renderer ? renderer(this.state.pullUp) : defaultRenderer}
            </div>
          </div>
        </div>
      );
    };

    if (getScrollContainer) {
      return renderRefresh();
    }
    return (
      <div
        ref={el => this.containerRef = el}
        className={classNames(className, prefixCls, `${prefixCls}-${direction}`)}
        {...restProps}
      >
        {renderRefresh()}
      </div>
    );
  }
}
