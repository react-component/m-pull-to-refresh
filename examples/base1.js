import '../assets/index.less';
import PullToRefresh from '../src';
import React from 'react';
import ReactDOM from 'react-dom';

class Lv extends React.Component {
  render() {
    let child = this.props.children;
    if (this.props.pullToRefresh) {
      child = React.cloneElement(this.props.pullToRefresh, {}, child);
    }
    return (
      <div style={{ height: 200, border: 1, overflow: 'auto' }}>
        {child}
      </div>
    );
  }
}

class App extends React.Component {
  state = {
    refreshing: false,
  };
  componentDidMount() {
    document.body.style.overflowY =
      navigator.userAgent.match(/Android|iPhone|iPad|iPod/i) ? 'hidden' : 'auto';
  }
  render() {
    return (
      <Lv
        pullToRefresh={
          <PullToRefresh
            className="forTest"
            direction="up"
            onRefresh={this.onRefresh}
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.setState({ refreshing: true });
              setTimeout(() => {
                this.setState({ refreshing: false });
              }, 1000);
            }}
          />
        }
      >
        {[1, 2, 3, 4, 5, 6, 7].map(i =>
          <div key={i} style={{ textAlign: 'center', padding: 20 }}>item {i}</div>)}
      </Lv>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('__react-content'));
