import React, { Component } from 'react';
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import 'react-toastify/dist/ReactToastify.css';
import copyIcon from '../../../../images/copy.svg';

class PropertiesViewer extends Component {

    constructor(props) {
        super(props);

        this.copyField = this.copyField.bind(this);
        this.fieldsRefs = {
            address: React.createRef(),
            coordinates: React.createRef(),
            category: React.createRef()
        }
    }

    // This function copies a property field to clipboard
    copyField(e) {
        let fieldToCopy = e.target.getAttribute('copy');
        let fieldText = this.fieldsRefs[fieldToCopy].current.innerText.replace(/\n/g, '');
        let input = document.createElement('input');

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

    render() {
        return (
            <div className="view-location-properties">
                <h1 className="heading-location-viewer">{this.props.data.name}</h1>
                <div className="seperator-4">
                </div>
                <h1 className="label">Address</h1>
                <div className="property-value-container">
                    <img src={copyIcon} onClick={this.copyField} copy="address" width="25" data-tip="Copy" alt="" className="image-copy-property" />
                    <h1 className="heading-location-property" ref={this.fieldsRefs.address}>{this.props.data.address}</h1>
                </div>
                <h1 className="label">Coordinates</h1>
                <div className="property-value-container">
                    <img src={copyIcon} onClick={this.copyField} copy="coordinates" data-tip="Copy" width="25" alt="" className="image-copy-property" />
                    <h1 className="heading-location-property" ref={this.fieldsRefs.coordinates}>
                        <strong>lat</strong>:&nbsp;{this.props.data.position.lat}
                        &#44;&nbsp;<strong>lng</strong>:{this.props.data.position.lng}</h1>
                </div>
                <h1 className="label">Category</h1>
                <div className="property-value-container">
                    <img src={copyIcon} onClick={this.copyField} copy="category" data-tip="Copy" width="25" alt="" className="image-copy-property" />

                    <h1 className="heading-location-property" ref={this.fieldsRefs.category}>{this.props.data.category}</h1>
                </div><button className="view-location-properties-button w-button" onClick={this.props.closeViewer}>Close</button>
                <ReactTooltip />

            </div>
        );
    }
}

export default PropertiesViewer;