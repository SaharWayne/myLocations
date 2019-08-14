import React, { useEffect, useRef } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const MapViewer = (props) => {

    const mapContainerRef = useRef();

    useEffect(() => {
        mapContainerRef.current.firstChild.style = "maxWidth: '435px;'";
    }, []);

    return (
        <div className="view-location-map">
            <h1 className="heading-location-viewer">{props.data.name}</h1>
            <div className="seperator-4">
            </div>
            <div className="view-location-map-map-container" ref={mapContainerRef}>
                <Map
                    google={props.google}
                    zoom={18}
                    style={{ height: '450px', position: 'relative' }}
                    initialCenter={props.data.position}>
                    <Marker position={props.data.position} />
                </Map>
            </div>
            <button className="view-location-map-button w-button" onClick={props.closeViewer}>Close</button>
        </div>
    );
}

export default GoogleApiWrapper({ apiKey: 'AIzaSyB_FOwuZf9hp8EzcKh1Dky70NBETQBO_a8' })(MapViewer);