import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import App from './components/App/App';
import './index.css';

import { Provider } from 'react-redux'
import store from './components/App/redux/App-store'


// This component is responsible for assigning Routes to different pages.
// In our case, we will assign a single Route to App
// If we want to add more pages in the future, we will assign them a Route from here
class Root extends Component {
    render() {
        return (
            // Note that because this app is deployed to GitHub Pages,
            // we use hashHistory instead of browserHistory because
            <Router history={hashHistory}>
                <Route path='/' component={App}></Route>
                {/* ... More Routes */}
            </Router>
        );
    }
}

ReactDOM.render(<Provider store={store}><Root /></Provider>, document.getElementById('root'));

