import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import ErrorBoundary from 'react-error-boundary';
import swal from 'sweetalert';
import App from './components/App/App';
import './index.css';

import { Provider } from 'react-redux'
import { store, resetStoreState } from './components/App/redux/App-store'

// This component is responsible for assigning Routes to different pages.
// In our case, we will assign a single Route to App
// If we want to add more pages in the future, we will assign them a Route from here
class Root extends Component {
    render() {
        return (
            // Note that because this app is deployed to GitHub Pages,
            // hashHistory is used instead of browserHistory
            <Router history={hashHistory}>
                <ErrorBoundary onError={AppErrorHandler}>
                    <Route path='/' component={App}></Route>
                    {/* ... More Routes */}
                </ErrorBoundary>
            </Router>
        );
    }
}

// Since every state update is saved to local storage, 
// App is bounded by Error Boundary. On any error, local storage
// will be cleaned
const AppErrorHandler = (error, componentStack) => {
    resetStoreState();
    swal('Unfortunately the application has crashed. Local storage was restored to its initial state');
};

ReactDOM.render(<Provider store={store}><Root /></Provider>, document.getElementById('root'));

