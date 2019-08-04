import React, { Component } from 'react';
import ViewerDialog from './components/ViewerDialog/ViewerDialog'
import PropertiesViewer from './components/PropertiesViewer/PropertiesViewer'
import MapViewer from './components/MapViewer/MapViewer';
import './LocationViewer.css';

import { connect } from 'react-redux';
import * as actions_data from '../../../../redux/actions/Data-actions';

class LocationViewer extends Component {

    constructor(props) {
        super(props);
        this.getViewData = this.getViewData.bind(this);
        this.data = this.getViewData();
    }

    componentDidMount() {
        this.props.setViewMode('dialog');
    }

    // This function gets the location data
    // It is used to pass the data to subcomponents later on
    getViewData() {
        let location = this.props.categories_data
        .find(val => val.name === this.props.ungrouped_category)
        .locations[this.props.selected_location];

        return {
            category: this.props.ungrouped_category,
            name: this.props.selected_location,
            address: location.address,
            position: {lat: location.lat, lng: location.lng}
        }
    }

    render() {
        return (
            <div className="view-location-container" onMouseDown={this.props.closeForm}>
                {this.props.view_mode === 'dialog' && <ViewerDialog />}
                {this.props.view_mode === 'properties' && <PropertiesViewer  closeForm={this.props.closeForm} data={this.data}/>}
                {this.props.view_mode === 'map' && <MapViewer closeForm={this.props.closeForm} data={this.data}/>}
            </div>
        );
    }
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