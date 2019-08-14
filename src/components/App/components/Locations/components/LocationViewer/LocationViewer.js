import React, { useEffect, useState } from 'react';
import ViewerDialog from './components/ViewerDialog/ViewerDialog'
import PropertiesViewer from './components/PropertiesViewer/PropertiesViewer'
import MapViewer from './components/MapViewer/MapViewer';
import './LocationViewer.css';

import { connect } from 'react-redux';
import * as actions_data from '../../../../redux/actions/Data-actions';

const LocationViewer = (props) => {

    const [viewData, setViewData] = useState({});

    useEffect(() => {
        props.setViewMode('dialog');
        setViewData(getViewData());
        //eslint-disable-next-line
    }, []);

    // This function gets the location data
    // It is used to pass the data to subcomponents later on
    const getViewData = () => {
        const location = props.categories_data
            .find(val => val.name === props.ungrouped_category)
            .locations[props.selected_location];

        return {
            category: props.ungrouped_category,
            name: props.selected_location,
            address: location.address,
            position: { lat: location.lat, lng: location.lng }
        }
    }

    return (
        <div className="view-location-container" onMouseDown={props.closeViewer}>
            {props.view_mode === 'dialog' && <ViewerDialog closeViewer={props.closeViewer} />}
            {props.view_mode === 'properties' && <PropertiesViewer closeViewer={props.closeViewer} data={viewData} />}
            {props.view_mode === 'map' && <MapViewer closeViewer={props.closeViewer} data={viewData} />}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        categories_data: state.data.categories,
        selected_location: state.data.selected_location,
        ungrouped_category: state.data.ungrouped_category,
        view_mode: state.data.view_mode
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setViewMode: (mode) => dispatch(actions_data.setViewMode(mode))
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LocationViewer);