import React, { Component } from 'react';
import LocationPicker from 'react-location-picker';
import { connect } from 'react-redux';
import * as actions_data from '../../../../../../redux/actions/Data-actions';

class MapContainer extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    // This function handles manual marker position change
    // It updates the state and the coordinates input
    handleChange(location) {
        let newInput = { ...this.props.input_location };
        newInput.address = location.address;
        newInput.lat = location.position.lat;
        newInput.lng = location.position.lng;

        this.props.updateLocationInput(newInput);
        this.props.updateCoords();
    }

    render() {
        return (
            <LocationPicker
                containerElement={<div style={{ height: '100%' }} />}
                mapElement={<div style={{ maxWidth: '450px', height: '173px' }} />}
                defaultPosition={{
                    lat: this.props.input_location.lat == null ?
                        25.761681 : Number(this.props.input_location.lat),
                    lng: this.props.input_location.lng == null ?
                        -80.191788 : Number(this.props.input_location.lng)
                }}
                onChange={this.handleChange}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        input_location: state.data.input_location
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateLocationInput: (input) => dispatch(actions_data.updateLocationInput(input))
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
