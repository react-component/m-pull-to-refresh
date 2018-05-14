import '../assets/index.less';
import PullToRefresh from '../src';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  state = {
    refreshing: false,
    switchContainer: false,
  };
  componentDidMount() {
    // setTimeout(() => { this.setState({ refreshing: true }); }, 10);
    // setTimeout(() => { this.setState({ refreshing: true }); }, 100);
    // setTimeout(() => { this.setState({ refreshing: false }); }, 3000);
  }
  render() {
    return (<div>
      <button
        style={{ display: 'inline-block', marginBottom: 30, border: 1 }}
        onClick={() => this.setState({ switchContainer: !this.state.switchContainer })}
      >
        switchContainer: {this.state.switchContainer ? 'true' : 'false'}
      </button>

      {/* todos: 现在如果 getScrollContainer 变化，需要设置新 key 来触发 componentWillUnmount */}
      <PullToRefresh
        key={this.state.switchContainer}
        style={{ height: 200, overflow: 'auto', border: '1px solid #ccc' }}
        {...(this.state.switchContainer ? { getScrollContainer: () => document.body } : {}) }
        className="forTest"
        direction="down"
        refreshing={this.state.refreshing}
        onRefresh={() => {
          this.setState({ refreshing: true });
          setTimeout(() => {
            this.setState({ refreshing: false });
          }, 1000);
        }}
        indicator={{ deactivate: '下拉' }}
        damping={150}
      >
        {[1, 2, 3, 4, 5, 6, 7].map(i =>
          <div key={i} style={{ textAlign: 'center', padding: 20 }} onClick={() => alert(1)}>item {i}</div>)}
      </PullToRefresh>

      <div dangerouslySetInnerHTML={{
        __html: navigator.userAgent.match(/Android|iPhone|iPad|iPod/i) ?
          '<style>#qrcode, .highlight{ display: none }</style>' : '',
      }}
      />
    </div>);
  }
}

ReactDOM.render(<App />, document.getElementById('__react-content'));
