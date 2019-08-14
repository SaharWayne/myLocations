import React, { useRef } from 'react';
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import 'react-toastify/dist/ReactToastify.css';
import copyIcon from '../../../../images/copy.svg';

const PropertiesViewer = (props) => {

    const fieldsRefs = {
        address: useRef(),
        coordinates: useRef(),
        category: useRef()
    }

    // This function copies a property field to clipboard
    const copyField = (e) => {
        const fieldToCopy = e.target.getAttribute('copy');
        const fieldText = fieldsRefs[fieldToCopy].current.innerText.replace(/\n/g, '');
        const input = document.createElement('input');

        input.style.opacity = '0';
        input.style['pointer-events'] = 'none';
        document.body.appendChild(input);
        input.value = fieldText;
        input.focus();
        input.select();
        document.execCommand('copy');
        input.remove();

        toast.info(`${fieldToCopy.charAt(0).toUpperCase()}${fieldToCopy.slice(1)} copied to clipboard!`, { autoClose: 1500 });
    }

    return (
        <div className="view-location-properties">
            <h1 className="heading-location-viewer">{props.data.name}</h1>
            <div className="seperator-4">
            </div>
            <h1 className="label">Address</h1>
            <div className="property-value-container">
                <img src={copyIcon} onClick={copyField} copy="address" width="25" data-tip="Copy" alt="" className="image-copy-property" />
                <h1 className="heading-location-property" ref={fieldsRefs.address}>{props.data.address}</h1>
            </div>
            <h1 className="label">Coordinates</h1>
            <div className="property-value-container">
                <img src={copyIcon} onClick={copyField} copy="coordinates" data-tip="Copy" width="25" alt="" className="image-copy-property" />
                <h1 className="heading-location-property" ref={fieldsRefs.coordinates}>
                    <strong>lat</strong>:&nbsp;{props.data.position.lat}
                    &#44;&nbsp;<strong>lng</strong>:{props.data.position.lng}</h1>
            </div>
            <h1 className="label">Category</h1>
            <div className="property-value-container">
                <img src={copyIcon} onClick={copyField} copy="category" data-tip="Copy" width="25" alt="" className="image-copy-property" />

                <h1 className="heading-location-property" ref={fieldsRefs.category}>{props.data.category}</h1>
            </div><button className="view-location-properties-button w-button" onClick={props.closeViewer}>Close</button>
            <ReactTooltip />

        </div>
    );
}

export default PropertiesViewer;