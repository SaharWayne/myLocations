import React, { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import ReactTooltip from 'react-tooltip';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { geocodeByPlaceId } from 'react-google-places-autocomplete';
import MapContainer from '../LocationViewer/components/MapContainer/MapContainer';
import '../../../../App.css';

import { connect } from 'react-redux';
import * as actions_data from '../../../../redux/actions/Data-actions';

const LocationForm = (props) => {

    const formAddressContainerRef = useRef();
    const formSubmitRef = useRef();
    const inputRefs = {
        category: useRef(),
        name: useRef(),
        address: useRef(),
        lat: useRef(),
        lng: useRef()
    };
    let formFilled = false;

    // On first mount, fill the form if opened on EDIT mode
    useEffect(() => {
        // If the used clicked 'EDIT', fill the form with the existing data
        if (props.action === 'EDIT') {
            fillControlledElements();
            formSubmitRef.current.classList.remove('inactive');
        }
        props.setLocationDialogState(true);
        //eslint-disable-next-line
    }, []);

    // On every render, update 'formFilled'
    useEffect(() => {
        updateFormFilled();
    });

    const updateFormFilled = (() => {
        // On update, set 'formFilled'
        // This is used to bypass default functionality of <form/> element,
        // with the aim of activating/deactivating the form submit button (style wise)
        let userInputs = getLocationInputs();

        //eslint-disable-next-line
        formFilled = Object.keys(userInputs)
            .filter((key) => { return !userInputs[key] || userInputs[key].length === 0 }).length === 0;

        if (formFilled) {
            formSubmitRef.current.classList.remove('inactive');
        } else {
            formSubmitRef.current.classList.add('inactive');
        }
    });

    // This function fills the form with the existing location data
    const fillControlledElements = () => {
        const locationCategory = props.categories_data
            .find(val => val.name === props.selected_category);
        const location = locationCategory.locations[props.selected_location];


        inputRefs.name.current.value = props.selected_location;
        Object.keys(inputRefs).forEach((key) => {
            if (key !== 'name' && key !== 'category') {
                inputRefs[key].current.value = location[key];
            }
        });

        let userInputs = {
            category: props.selected_category,
            name: props.selected_location,
            address: location.address,
            lat: location.lat,
            lng: location.lng
        }

        props.updateLocationInput(userInputs);
        formFilled = true;
    }

    // This function sets the coordinates input to state,
    // which in turn locates the map's marker accordingly
    const setCoords = () => {
        const userInput = getLocationInputs();
        const lat = inputRefs.lat.current.value;
        const lng = inputRefs.lng.current.value;

        const re = new RegExp(/^[-|+]?[0-9]*\.?[0-9]+$/g);
        const latPatternValid = lat.match(re), lngPatternValid = lng.match(re);
        const patternValid = latPatternValid && lngPatternValid;


        if (!patternValid) {

            toast.error('Coordinates must be valid numbers');
            setTimeout(() => {
                toast.info('Press \'SET\' to revalidate');
            }, 500);

            if (!latPatternValid) {
                inputRefs.lat.current.classList.add('input-error');
                inputRefs.lat.current.focus();
            }
            if (!lngPatternValid) {
                inputRefs.lng.current.classList.add('input-error');
                if (latPatternValid) {
                    inputRefs.lng.current.focus();
                }
            }
        } else {
            const _lat = Number(lat);
            const _lng = Number(lng);
            const latRangeValid = (_lat >= -90 && _lat <= 90), lngRangeValid = (_lng >= -180 && _lng <= 180);
            const rangeValid = latRangeValid && lngRangeValid;

            if (!rangeValid) {

                if (!latRangeValid) {
                    toast.error('Lat should be in the range of [-90, 90]');
                    inputRefs.lat.current.classList.add('input-error');
                    inputRefs.lat.current.focus();
                }
                if (!lngRangeValid) {
                    toast.error('Lng should be in the range of [-180, 180]');
                    inputRefs.lng.current.classList.add('input-error');
                    if (latRangeValid) {
                        inputRefs.lng.current.focus();
                    }
                }
                setTimeout(() => {
                    toast.info('Press \'SET\' to revalidate');
                }, 500);

            } else if (lat !== userInput.lat || lng !== userInput.lng) {

                inputRefs.lat.current.classList.remove('input-error');
                inputRefs.lng.current.classList.remove('input-error');

                userInput.lat = lat;
                userInput.lng = lng;

                props.updateLocationInput(userInput);
            }
        }
    }

    // This function updates the coordinates inputs
    // Triggered by subcomponent MapContainer 
    // (Each time the user moves the marker manually, this function is called)
    const updateCoords = () => {
        inputRefs.lat.current.classList.remove('input-error');
        inputRefs.lng.current.classList.remove('input-error');
        inputRefs.lat.current.value = props.input_location.lat;
        inputRefs.lng.current.value = props.input_location.lng;
    }

    // This function gets the location inputs from state
    const getLocationInputs = () => {
        return {
            category: props.input_location.category,
            name: props.input_location.name,
            address: props.input_location.address,
            lat: props.input_location.lat,
            lng: props.input_location.lng
        }
    }

    // This nested function searches the coordinates of an address 
    // suggested from GoogleAutocomplete (address input) and when found,
    // sets it to the coordinates input
    const getGeoCodeFromPlaceId = (place_id) => {
        geocodeByPlaceId(place_id)
            .then(results => {
                const location = results[0].geometry.location;
                const lat = location.lat();
                const lng = location.lng();

                inputRefs.lat.current.value = lat;
                inputRefs.lng.current.value = lng;
                inputRefs.lat.current.classList.remove('input-error');
                inputRefs.lng.current.classList.remove('input-error');

                const newInput = {
                    category: props.input_location.category,
                    name: props.input_location.name,
                    address: props.input_location.address,
                    lat: lat,
                    lng: lng
                }
                props.updateLocationInput(newInput);
            })
            .catch(error => console.error(error));
    }

    // This function updates state with changed input
    const handleChange = (e) => {
        e.target.classList.remove('input-error');

        let userInputs = getLocationInputs();
        userInputs[e.target.name] = e.target.value;

        props.updateLocationInput(userInputs);
    }

    // This function updates the coordinates according to an address suggestion
    const handleSelect = (suggestion) => {
        formAddressContainerRef.current.classList.remove('input-error');
        getGeoCodeFromPlaceId(suggestion.place_id);
    }

    // This function handles form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        let userInputs = getLocationInputs();

        // Form fully filled
        if (formFilled) {

            // Check if location name already exists in category
            let locationNameAlreadyExistsInCategory = false;
            Object.keys(props.categories_data.find(val => val.name === userInputs.category).locations).forEach((key) => {
                if (key === userInputs.name && key !== props.selected_location) {
                    locationNameAlreadyExistsInCategory = true;
                }
            })

            // Add 'input-error' class and focus if needed
            if (locationNameAlreadyExistsInCategory) {
                inputRefs.name.current.classList.add('input-error');
                toast.error('Location with this name already exists in this category!');
                inputRefs.name.current.focus();
            } else {
                // Replace the original values of the coordinates if needed
                let timeoutAnimation = false;
                if (inputRefs.lat.current.value !== userInputs.lat) {
                    inputRefs.lat.current.value = userInputs.lat;
                    timeoutAnimation = true;
                }
                if (inputRefs.lng.current.value !== userInputs.lng) {
                    inputRefs.lng.current.value = userInputs.lng;
                    if (!timeoutAnimation) {
                        timeoutAnimation = true;
                    }
                }

                // Submit action
                switch (props.action) {
                    case 'ADD':
                        props.addLocation(userInputs);
                        break;
                    case 'EDIT':
                        props.editLocation(userInputs);
                        break;
                    default:
                        break;
                }

                // Close form
                if (timeoutAnimation) {
                    setTimeout(() => {
                        closeForm();
                    }, 50);
                } else {
                    closeForm();
                }

            }
        } else { // Form not fully filled

            // Add 'input-error' class to unfilled inputs
            let firstEmptyInputRef, currentInputRef;
            let addressEmpty = false;

            Object.keys(userInputs).forEach((key, i) => {
                if (!userInputs[key]) {

                    if (key === 'address') {
                        currentInputRef = formAddressContainerRef;
                        addressEmpty = true;
                    } else {
                        currentInputRef = inputRefs[key];
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

    // This function closes the form
    const closeForm = () => {
        props.closeForm(null, true);
    }

    return (
        <div className="component-form-container" onMouseDown={props.closeForm}>
            <div className="component-form w-form">
                <form className="component-form-inner" onSubmit={handleSubmit}>
                    <div className='form-x-button-container'><h4 className='form-x-button' onClick={closeForm}>✖</h4></div>
                    {props.action === 'ADD' && <label htmlFor="category" className="form-field-label">Location Category</label>}
                    {props.action === 'ADD' &&
                        <select data-name="category" name="category" required=""
                            className="select-field w-select" onChange={handleChange} ref={inputRefs.category}>
                            <option value="">Select category...</option>
                            {props.categories_data.map((category, i) => {
                                return <option value={category.name} key={i}>{category.name}</option>
                            })}
                        </select>}
                    <label htmlFor="name" className="form-field-label">Location Name</label>
                    <input className="text-field-form w-input" maxLength="256" name="name" data-name="name"
                        placeholder="My Beach House" type="text" required="" autoComplete="off" onChange={handleChange} ref={inputRefs.name} />
                    <label htmlFor="address" className="form-field-label">Location Address</label>
                    <div className="google-places-autocomplete-container" ref={formAddressContainerRef}>
                        <GooglePlacesAutocomplete maxLength="256" name="address" data-name="address"
                            placeholder="18555 Collins Ave, Sunny Isles Beach, FL" type="text" required="" autoComplete="off"
                            initialValue={props.input_location.address} onSelect={handleSelect}
                            onChange={handleChange} ref={inputRefs.address} /></div>
                    <div className="component-form-coords">
                        <div className="component-form-coords-manual">
                            <label htmlFor="lat" className="form-field-label">lat</label>
                            <input className="component-form-coords-textfield w-input" maxLength="256" name="lat"
                                data-name="lat" placeholder="25.761681" type="text" required="" autoComplete="off" ref={inputRefs.lat} />
                            <label htmlFor="lng" className="form-field-label">lng</label>
                            <input className="component-form-coords-textfield w-input" maxLength="256" name="lng"
                                data-name="lng" placeholder="-80.191788" type="text" required="" autoComplete="off" ref={inputRefs.lng} />
                            <div className="component-form-coords-button" data-tip="Set the marker position by coordinates" onClick={setCoords}>SET</div>
                        </div>
                        <div className="component-form-coords-map"><MapContainer updateCoords={updateCoords} /></div>
                    </div>
                    <input type="submit" data-wait="Please wait..."
                        className="component-form-submit w-button inactive" value="APPLY" ref={formSubmitRef} />
                </form>
            </div>
            <ReactTooltip />
        </div>
    );
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