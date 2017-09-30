import '../assets/index.less';
import PullToRefresh from '../src';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  state = {
    refreshing: true,
  };
  componentDidMount() {
    setTimeout(() => this.setState({ refreshing: false }), 1000);
  }
  render() {
    return (<div>
      <PullToRefresh
        getScrollContainer={()=>document.body}
        onRefresh={this.onRefresh}
        className="forTest"
        direction="up"
        style={{ height: 200, overflow: 'auto', border: '1px solid #ccc' }}
        refreshing={this.state.refreshing}
        onRefresh={() => {
          this.setState({ refreshing: true });
          setTimeout(() => {
            this.setState({ refreshing: false });
          }, 1000);
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7].map(i =>
          <div key={i} style={{ textAlign: 'center', padding: 20 }}>item {i}</div>)}
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
