import React, { PropTypes, Component } from 'react';
import WebPullToRefresh from './wptr.1.1';

export default class ReactPullToRefresh extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialized: false
    };
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  static defaultProps = {
    prefixCls: 'rmc-pull-to-refresh',
  }

  handleRefresh() {
    return new Promise((resolve, reject) => {
      this.props.onRefresh(resolve, reject);
    });
  }

  init() {
    if (!this.state.initialized) {
      WebPullToRefresh().init({
        contentEl: this.refs.refresh,
        ptrEl: this.refs.ptr,
        prefixCls: this.props.prefixCls,
        distanceToRefresh: this.props.distanceToRefresh || undefined,
        loadingFunction: this.handleRefresh,
        resistance: this.props.resistance || undefined
      });
      this.setState({
        initialized: true
      });
    }
  }

  componentDidMount() {
    if (!this.props.disabled) {
      this.init();
    }
  }

  componentDidUpdate() {
    if (!this.props.disabled) {
      this.init();
    }
  }

  render() {
    const { prefixCls, children, icon, loading, ...other } = this.props;
    if (this.props.disabled) {
      return (
        <div {...this.props}>
          {this.props.children}
        </div>
      );
    }
    return (
      <div {...other}>
        <div ref="ptr" className={`${prefixCls}-element`}>
          <span className={`${prefixCls}-icon`}>{icon}</span>
          <div className={`${prefixCls}-loading-ele`}>{loading}</div>
        </div>
        <div ref="refresh" className={`${prefixCls}-refresh-view`}>
          {children}
        </div>
      </div>
    );
  }
}

ReactPullToRefresh.propTypes = {
  onRefresh: PropTypes.func.isRequired,
  icon: PropTypes.element,
  loading: PropTypes.element,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  distanceToRefresh: PropTypes.number,
  resistance: PropTypes.number
};
