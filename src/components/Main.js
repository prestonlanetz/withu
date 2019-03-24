require('normalize.css/normalize.css');
require('styles/App.css');
import {BrowserRouter as Router,Route,Link,Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
// 和react native不同 webpack使用其他组件必须使用 import!
import DragBook from './DragBook';
import Login from './Login';
import React from 'react';
 


class AppComponent extends React.Component {
  constructor(props){
    super(props);
    this.state={

    }
  }

  render() {
      return(
        <Router history={history}>
             <div>
              <Route exact path="/" component={Login}/>
              <Route  path="/produce" component={DragBook}/>
             </div>
        </Router>
      );
  }
}
AppComponent.defaultProps = {
};
export default AppComponent;
