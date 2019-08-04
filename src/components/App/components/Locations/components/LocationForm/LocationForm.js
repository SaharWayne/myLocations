import React, { Component } from 'react';
import { toast } from 'react-toastify';
import swal from 'sweetalert'
import ReactTooltip from 'react-tooltip';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import MapContainer from '../LocationViewer/components/MapContainer/MapContainer';
import '../../../../App.css';

import { connect } from 'react-redux';
import * as actions_data from '../../../../redux/actions/Data-actions';

class LocationForm extends Component {
    constructor(props) {
        super(props);

        this.inputRefs = {
            category: React.createRef(),
            name: React.createRef(),
            address: React.createRef(),
            lat: React.createRef(),
            lng: React.createRef()
        };
        this.formContainerRef = React.createRef();
        this.formAddressContainerRef = React.createRef();
        this.formSubmitRef = React.createRef();

        this.fillControlledElements = this.fillControlledElements.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.setCoords = this.setCoords.bind(this);
        this.updateCoords = this.updateCoords.bind(this);
        this.getLocationInputs = this.getLocationInputs.bind(this);
        this.getGeoCodeFromPlaceId = this.getGeoCodeFromPlaceId.bind(this);
        this.formFilled = false;
    }


    componentDidMount() {
        // If the used clicked 'EDIT', fill the form with the existing data
        if (this.props.action === 'EDIT') {
            this.fillControlledElements();
            this.formSubmitRef.current.classList.remove('inactive');
        }

        this.props.setLocationDialogState(true);
    }

    componentDidUpdate() {
        // On update, set 'this.formFilled'
        // This is used to bypass default functionality of <form/> element,
        // with the aim of activating/deactivating the form submit button (style wise)

        let userInputs = this.getLocationInputs();
        this.formFilled = Object.keys(userInputs)
            .filter((key) => { return !userInputs[key] || userInputs[key].length === 0 }).length === 0;

        if (this.formFilled) {
            this.formSubmitRef.current.classList.remove('inactive');
        } else {
            this.formSubmitRef.current.classList.add('inactive');
        }
    }

    // This function fills the form with the existing location data
    fillControlledElements() {
        let locationCategory = this.props.categories_data
            .find(val => val.name === this.props.selected_category);
        let location = locationCategory.locations[this.props.selected_location];


        this.inputRefs.name.current.value = this.props.selected_location;
        Object.keys(this.inputRefs).forEach((key) => {
            if (key !== 'name' && key !== 'category') {
                this.inputRefs[key].current.value = location[key];
            }
        });

        let userInputs = {
            category: this.props.selected_category,
            name: this.props.selected_location,
            address: location.address,
            lat: location.lat,
            lng: location.lng
        }

        this.props.updateLocationInput(userInputs);
        this.formFilled = true;
    }

    // This function sets the map coordinates to the input coordinates
    setCoords() {
        let userInput = this.getLocationInputs();
        let lat = this.inputRefs.lat.current.value;
        let lng = this.inputRefs.lng.current.value;

        let re = new RegExp(/^[-|+]?[0-9]*\.?[0-9]+$/g);
        let latValid = lat.match(re), lngValid = lng.match(re);
        let inputValid = latValid && lngValid;

        if (!inputValid) {
            toast.error('Coordinates must be valid numbers');
            setTimeout(() => {
                toast.info('Press \'SET\' to revalidate');
            }, 500);

            if (!latValid) {
                this.inputRefs.lat.current.classList.add('input-error');
                this.inputRefs.lat.current.focus();
            }
            if (!lngValid) {
                this.inputRefs.lng.current.classList.add('input-error');
                if (latValid) {
                    this.inputRefs.lng.current.focus();
                }
            }
        } else if (lat !== userInput.lat || lng !== userInput.lng) {
            userInput.lat = lat;
            userInput.lng = lng;

            this.props.updateLocationInput(userInput);
        }
    }

    // This function updates the coordinates inputs
    // Triggered by subcomponent MapContainer 
    // (Each time the user moves the marker manually, this function is called)
    updateCoords() {
        this.inputRefs.lat.current.value = this.props.input_location.lat;
        this.inputRefs.lng.current.value = this.props.input_location.lng;
    }

    // This function gets the location inputs from state
    getLocationInputs() {
        return {
            category: this.props.input_location.category,
            name: this.props.input_location.name,
            address: this.props.input_location.address,
            lat: this.props.input_location.lat,
            lng: this.props.input_location.lng
        }
    }

    // This nested function searches the coordinates of an address 
    // suggested from GoogleAutocomplete (address input) and when found,
    // sets it to the coordinates input
    getGeoCodeFromPlaceId(place_id) {
        geocodeByPlaceId(place_id)
            .then(results => {
                let location = results[0].geometry.location;
                let lat = location.lat();
                let lng = location.lng();

                this.inputRefs.lat.current.value = lat;
                this.inputRefs.lng.current.value = lng;
                this.inputRefs.lat.current.classList.remove('input-error');
                this.inputRefs.lng.current.classList.remove('input-error');

                let newInput = {
                    category: this.props.input_location.category,
                    name: this.props.input_location.name,
                    address: this.props.input_location.address,
                    lat: lat,
                    lng: lng
                }
                this.props.updateLocationInput(newInput);
            })
            .catch(error => console.error(error));
    }

    // This function updates state with changed input
    handleChange(e) {
        e.target.classList.remove('input-error');

        let userInputs = this.getLocationInputs();
        userInputs[e.target.name] = e.target.value;

        this.props.updateLocationInput(userInputs);
    }

    // This function updates the coordinates according to an address suggestion
    handleSelect(suggestion) {
        this.formAddressContainerRef.current.classList.remove('input-error');
        this.getGeoCodeFromPlaceId(suggestion.place_id);
    }

    // This function handles form submit
    handleSubmit(e) {
        e.preventDefault();

        let userInputs = this.getLocationInputs();

        // Form fully filled
        if (this.formFilled) {

            // Check if location name already exists in category
            let locationNameAlreadyExistsInCategory = false;
            Object.keys(this.props.categories_data.find(val => val.name === userInputs.category).locations).forEach((key) => {
                if (key === userInputs.name && key !== this.props.selected_location) {
                    locationNameAlreadyExistsInCategory = true;
                }
            })

            // Add 'input-error' class and focus if needed
            if (locationNameAlreadyExistsInCategory) {
                this.inputRefs.name.current.classList.add('input-error');
                swal('Location with this name already exists in this category!').then(() => {
                    this.inputRefs.name.current.focus();
                });
            } else {
                // Replace the original values of the coordinates if needed
                let timeoutAnimation = false;
                if (this.inputRefs.lat.current.value !== userInputs.lat) {
                    this.inputRefs.lat.current.value = userInputs.lat;
                    timeoutAnimation = true;
                }
                if (this.inputRefs.lng.current.value !== userInputs.lng) {
                    this.inputRefs.lng.current.value = userInputs.lng;
                    if (!timeoutAnimation) {
                        timeoutAnimation = true;
                    }
                }

                // Submit action
                switch (this.props.action) {
                    case 'ADD':
                        this.props.addLocation(userInputs);
                        break;
                    case 'EDIT':
                        this.props.editLocation(userInputs);
                        break;
                    default:
                        break;
                }

                // Close form
                if (timeoutAnimation) {
                    setTimeout(() => {
                        this.props.closeForm(this.formContainerRef);
                    }, 50);
                } else {
                    this.props.closeForm(this.formContainerRef);
                }

            }
        } else { // Form not fully filled

            // Add 'input-error' class to unfilled inputs
            let firstEmptyInputRef, currentInputRef;
            let addressEmpty = false;

            Object.keys(userInputs).forEach((key, i) => {
                if (!userInputs[key]) {

                    if (key === 'address') {
                        currentInputRef = this.formAddressContainerRef;
                        addressEmpty = true;
                    } else {
                        currentInputRef = this.inputRefs[key];
                    }

                    currentInputRef.current.classList.add('input-error');

                    if (!firstEmptyInputRef) {
                        firstEmptyInputRef = currentInputRef;
                    }
                }
            });

            // Toast information to user
            toast.error('Fill all fields first!');

            if (addressEmpty) {
                setTimeout(() => {
                    toast.info('Note that Address is autocomplete only');
                }, 500);
            }

            // Focus first unfilled input
            firstEmptyInputRef.current.focus();
        }
    }

    render() {
        return (
            <div className="component-form-container" onMouseDown={this.props.closeForm} ref={this.formContainerRef}>
                <div className="component-form w-form">
                    <form className="component-form-inner" onSubmit={this.handleSubmit}>
                        {this.props.action === 'ADD' && <label htmlFor="category" className="form-field-label">Location Category</label>}
                        {this.props.action === 'ADD' &&
                            <select data-name="category" name="category" required=""
                                className="select-field w-select" onChange={this.handleChange} ref={this.inputRefs.category}>
                                <option value="">Select category...</option>
                                {this.props.categories_data.map((category, i) => {
                                    return <option value={category.name} key={i}>{category.name}</option>
                                })}
                            </select>}
                        <label htmlFor="name" className="form-field-label">Location Name</label>
                        <input className="text-field-form w-input" maxLength="256" name="name" data-name="name"
                            placeholder="My Beach House" type="text" required="" autoComplete="off" onChange={this.handleChange} ref={this.inputRefs.name} />
                        <label htmlFor="address" className="form-field-label">Location Address</label>
                        <div className="google-places-autocomplete-container" ref={this.formAddressContainerRef}>
                            <GooglePlacesAutocomplete maxLength="256" name="address" data-name="address"
                                placeholder="18555 Collins Ave, Sunny Isles Beach, FL" type="text" required="" autoComplete="off"
                                initialValue={this.props.input_location.address} onSelect={this.handleSelect}
                                onChange={this.handleChange} ref={this.inputRefs.address} /></div>
                        <div className="component-form-coords">
                            <div className="component-form-coords-manual">
                                <label htmlFor="lat" className="form-field-label">lat</label>
                                <input className="component-form-coords-textfield w-input" maxLength="256" name="lat"
                                    data-name="lat" placeholder="25.761681" type="text" required="" autoComplete="off" ref={this.inputRefs.lat} />
                                <label htmlFor="lng" className="form-field-label">lng</label>
                                <input className="component-form-coords-textfield w-input" maxLength="256" name="lng"
                                    data-name="lng" placeholder="-80.191788" type="text" required="" autoComplete="off" ref={this.inputRefs.lng} />
                                <div className="component-form-coords-button" data-tip="Set the marker position by coordinates" onClick={this.setCoords}>SET</div>
                            </div>
                            <div className="component-form-coords-map"><MapContainer updateCoords={this.updateCoords} /></div>
                        </div>
                        <input type="submit" data-wait="Please wait..."
                            className="component-form-submit w-button inactive" value="APPLY" ref={this.formSubmitRef} />
                    </form>
                </div>
                <ReactTooltip />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        action: state.operator.action,
        categories_data: state.data.categories,
        selected_location: state.data.selected_location,
        selected_category: state.data.selected_category,
        input_location: state.data.input_location
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        addLocation: (name) => dispatch(actions_data.addLocation(name)),
        editLocation: (input) => dispatch(actions_data.editLocation(input)),
        updateLocationInput: (input) => dispatch(actions_data.updateLocationInput(input)),
        setLocationDialogState: (state) => dispatch(actions_data.setLocationDialogState(state))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationForm);