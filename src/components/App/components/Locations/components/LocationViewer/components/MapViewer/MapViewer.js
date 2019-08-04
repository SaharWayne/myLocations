import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

class MapViewer extends Component {

    constructor(props) {
        super(props);
        this.mapContainerRef = React.createRef();
    }

    componentDidMount() {
        this.mapContainerRef.current.firstChild.style = "maxWidth: '435px;'";
    }

    render() {
        return (
            <div className="view-location-map">
                <h1 className="heading-location-viewer">{this.props.data.name}</h1>
                <div className="seperator-4">
                </div>
                <div className="view-location-map-map-container" ref={this.mapContainerRef}>
                    <Map
                        google={this.props.google}
                        zoom={18}
                        style={{ height: '450px', position: 'relative' }}
                        initialCenter={this.props.data.position}>
                        <Marker position={this.props.data.position} />
                    </Map>
                </div>
                <button className="view-location-map-button w-button" onClick={this.props.closeForm}>Close</button>
            </div>
        );
    }
}

export default GoogleApiWrapper({ apiKey: 'AIzaSyB_FOwuZf9hp8EzcKh1Dky70NBETQBO_a8' })(MapViewer);