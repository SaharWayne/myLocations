import React from 'react';

import { connect } from 'react-redux';
import * as actions_operator from '../../../../redux/actions/Operator-actions';
import * as actions_data from '../../../../redux/actions/Data-actions';


const Location = (props) => {

    // This function handles location click according to the current action
    const handleLocationClick = () => {
        props.setSelectedLocation(props.name);

        if (props.action !== '') { // action ADD/EDIT/REMOVE
            props.setSelectedCategory(props.category);

            if (props.action === 'REMOVE') {
                props.removeLocation(props.name);

                if (props.locations_count === 1) {
                    props.disableCurrentAction(null, true);
                    props.setUngroupedCategory('');
                }
            }
        } else {
            props.setAction('VIEW');
        }
    }

    return (
        <h6 className={`category-item-location ${props.color} 
            ${!props.is_location_dialog_open ?
                (props.action === 'EDIT' ?
                    'shaking edit' : (props.action === 'REMOVE' ? 'shaking remove' : '')) : ''}`}
            onClick={handleLocationClick}>{props.name}</h6>
    );
}

const mapStateToProps = (state) => {
    return {
        action: state.operator.action,
        is_location_dialog_open: state.data.is_location_dialog_open,
        locations_count: state.data.locations_count
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAction: (action) => dispatch(actions_operator.setAction(action)),
        removeLocation: (name) => dispatch(actions_data.removeLocation(name)),
        setSelectedLocation: (name) => dispatch(actions_data.setSelectedLocation(name)),
        setSelectedCategory: (name) => dispatch(actions_data.setSelectedCategory(name)),
        setUngroupedCategory: (name) => dispatch(actions_data.setUngroupedCategory(name))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Location);
