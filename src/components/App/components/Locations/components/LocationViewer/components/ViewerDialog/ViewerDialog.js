import React from 'react';
import '../../LocationViewer.css';

import { connect } from 'react-redux';
import * as actions_data from '../../../../../../redux/actions/Data-actions';

const ViewerDialog = (props) => {

    return (
        <div className="view-location-dialog">
            <div className='viewer-dialog-x-button-container'><h4 className='viewer-dialog-x-button' onClick={props.closeViewer}>✖</h4></div>
            <h5 className="heading-4">{props.selected_location}</h5>
            <div className="view-location-dialog-buttons">
                <button className="button w-button" onClick={() => { props.setViewMode('properties'); }}>View Properties</button>
                <button className="button w-button" onClick={() => { props.setViewMode('map'); }}>View Map</button>
            </div>
        </div>

    );
}

const mapStateToProps = (state) => {
    return {
        action: state.operator.action,
        selected_location: state.data.selected_location
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setViewMode: (mode) => dispatch(actions_data.setViewMode(mode)),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ViewerDialog);