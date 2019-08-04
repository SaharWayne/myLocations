import React, { Component } from 'react';
import '../../LocationViewer.css';

import { connect } from 'react-redux';
import * as actions_data from '../../../../../../redux/actions/Data-actions';

class ViewerDialog extends Component {

    render() {
        return (
            <div className="view-location-dialog">
                <div className='viewer-dialog-x-button-container'><h4 className='viewer-dialog-x-button' onClick={this.closeForm}>✖</h4></div>
                <h5 className="heading-4">{this.props.selected_location}</h5>
                <div className="view-location-dialog-buttons">
                    <button className="button w-button" onClick={() => { this.props.setViewMode('properties'); }}>View Properties</button>
                    <button className="button w-button" onClick={() => { this.props.setViewMode('map'); }}>View Map</button>
                </div>
            </div>

        );
    }
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