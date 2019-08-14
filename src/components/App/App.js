import React, { useEffect } from 'react';
import Locations from './components/Locations/Locations';
import Categories from './components/Categories/Categories';
import categoriesIcon from './images/categories.svg';
import locationsIcon from './images/locations.svg';
import './App.css';

import { ToastContainer } from 'react-toastify';
import { connect } from 'react-redux';
import * as actions_operator from './redux/actions/Operator-actions';

const App = (props) => {

  useEffect(() => {
    document.title = 'myLocations';
  }, []);

  // This function activates a screen (for example Categories/Locations)
  // Called from onClick listeners of the pages' icons
  const activateScreen = (ref) => {

    const target = ref.current || ref.currentTarget;
    const nextScreen = target.getAttribute('screen-ref');

    // Only activate an inactive screen
    if (nextScreen !== props.activeScreen) {
      props.updateActiveScreen(nextScreen);

      // Reset 'action' if icon clicked during an action (ADD/EDIT/REMOVE)
      if (props.action !== '') {
        props.resetAction();
      }

    }
  }

  return (
    <div className="app-body">
      <div className="ml-container">
        <div className="component-container">
          {props.activeScreen === 'Categories' && <Categories />}
          {props.activeScreen === 'Locations' && <Locations />}
        </div>
        <div className="seperator"></div>
        <div className="bottom-toolbar">
          <div className={`bottom-icon-wrapper ${props.activeScreen === 'Categories' ?
            'active' : 'inactive'}`} onClick={activateScreen} screen-ref="Categories">
            <img src={categoriesIcon} width="40" alt="" className="icon-bottom" />
            <div className="icon-bottom-underline"></div>
          </div>
          <div className={`bottom-icon-wrapper ${props.activeScreen === 'Locations' ?
            'active' : 'inactive'}`} onClick={activateScreen} screen-ref="Locations">
            <img src={locationsIcon} width="40" alt="" className="icon-bottom" />
            <div className="icon-bottom-underline"></div>
          </div>
        </div>
      </div>
      <ToastContainer hideProgressBar={true} autoClose={4500} />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    activeScreen: state.operator.activeScreen,
    action: state.operator.action
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateActiveScreen: (screen) => dispatch(actions_operator.activateScreen(screen)),
    resetAction: () => dispatch(actions_operator.resetAction())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
