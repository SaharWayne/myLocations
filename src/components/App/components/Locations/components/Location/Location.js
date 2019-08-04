import React, { Component } from 'react';

import { Vibration } from 'react-native';
import { connect } from 'react-redux';
import * as actions_operator from '../../../../redux/actions/Operator-actions';
import * as actions_data from '../../../../redux/actions/Data-actions';


class Location extends Component {

    constructor(props) {
        super(props);
        this.handleLocationClick = this.handleLocationClick.bind(this);
    }

    // This function handles location click according to the current action
    handleLocationClick() {
        this.props.setSelectedLocation(this.props.name);

        if (this.props.action !== '') { // action ADD/EDIT/REMOVE
            this.props.setSelectedCategory(this.props.category);

            if (this.props.action === 'REMOVE') {
                this.props.removeLocation(this.props.name);
            }
        } else { // No action - vibrate!
            Vibration.vibrate(500);
            this.props.setAction('VIEW');
        }
    }

    render() {
        return (
            <h6 className={`category-item-location ${this.props.color} 
            ${!this.props.is_location_dialog_open ?
                    (this.props.action === 'EDIT' ?
                        'shaking edit' : (this.props.action === 'REMOVE' ? 'shaking remove' : '')) : ''}`}
                onClick={this.handleLocationClick}>{this.props.name}</h6>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        action: state.operator.action,
        is_location_dialog_open: state.data.is_location_dialog_open
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAction: (action) => dispatch(actions_operator.setAction(action)),
        removeLocation: (name) => dispatch(actions_data.removeLocation(name)),
        setSelectedLocation: (name) => dispatch(actions_data.setSelectedLocation(name)),
        setSelectedCategory: (name) => dispatch(actions_data.setSelectedCategory(name))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Location);
