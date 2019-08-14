import React from 'react';
import LocationPicker from 'react-location-picker';
import { connect } from 'react-redux';
import * as actions_data from '../../../../../../redux/actions/Data-actions';

const MapContainer = (props) => {

    // This function handles manual marker position change
    // It updates the state and the coordinates input
    const handleChange = (location) => {
        let newInput = { ...props.input_location };
        newInput.address = location.address;
        newInput.lat = location.position.lat;
        newInput.lng = location.position.lng;

        props.updateLocationInput(newInput);
        props.updateCoords();
    }

    return (
        <LocationPicker
            containerElement={<div style={{ height: '100%' }} />}
            mapElement={<div style={{ maxWidth: '450px', height: '173px' }} />}
            defaultPosition={{
                lat: props.input_location.lat == null ?
                    25.761681 : Number(props.input_location.lat),
                lng: props.input_location.lng == null ?
                    -80.191788 : Number(props.input_location.lng)
            }}
            onChange={handleChange}
        />
    );
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
