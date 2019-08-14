import React from 'react';
import { toast } from 'react-toastify';
import swal from 'sweetalert';
import Location from './components/Location/Location';
import LocationForm from './components/LocationForm/LocationForm';
import LocationViewer from './components/LocationViewer/LocationViewer';
import locationsIcon from '../../images/locations.svg';
import addIcon from '../../images/add.svg';
import editIcon from '../../images/edit.svg';
import removeIcon from '../../images/remove.svg';
import arrowIcon from './images/arrow.svg';
import './Locations.css';

import { connect } from 'react-redux';
import * as actions_operator from '../../redux/actions/Operator-actions';
import * as actions_data from '../../redux/actions/Data-actions';

const Locations = (props) => {

    const colors = ['blue', 'orange', 'red', 'purple', 'green'];

    // This function sets/cancels 'ADD' action to state (for Add mode)
    // Triggered by 'ADD' toolbar button
    const addLocation = () => {
        if (props.categories_data.length > 0) {
            disableCurrentAction(null, true);
            props.setAction('ADD');
        } else { // No categories yet
            swal('Before adding a location, please add at least 1 category through the Categories screen');
        }

    }

    // This function sets/cancels 'EDIT' action to state (for Edit mode)
    // Triggered by 'EDIT' toolbar button
    const editLocation = () => {
        if (props.locations_count > 0) {
            if (props.action === 'EDIT') { // Cancel action
                props.setAction('');
            } else { // Set new action
                disableCurrentAction(null, true);
                props.setAction('EDIT');
            }
        } else { // No locations to edit yet
            toast.warn('No locations to edit. Try adding one');
        }
    }

    // This function sets/cancels 'REMOVE' action to state (for Remove mode)
    // Triggered by 'REMOVE' toolbar button
    const removeLocation = () => {
        if (props.locations_count > 0) {
            if (props.action === 'REMOVE') { // Cancel action
                props.setAction('');
            } else { // Set new action
                disableCurrentAction(null, true);
                props.setAction('REMOVE');
            }
        } else { // No locations to remove yet
            toast.warn('No locations to remove. Try adding one');
        }
    }

    // This function disables any action (ADD/EDIT/REMOVE)
    const disableCurrentAction = (e, controlled = false) => {
        if (controlled || e.target === e.currentTarget) {
            props.setAction('');
            props.setViewMode('');
            props.setLocationDialogState(false);
            props.setSelectedLocation('');
            props.setSelectedCategory('');
            props.resetLocationInput();
        }
    }

    // This function ungroups a category
    const ungroupCategory = (e) => {
        const clicked_category = e.currentTarget.getAttribute('category');
        const locations_size = Number(e.currentTarget.getAttribute('locations_size'));

        // Only ungroup categories with locations
        if (e.currentTarget.classList.contains('grouped') && locations_size > 0) {
            props.setUngroupedCategory(clicked_category);
        }
    }

    // This function toggles a category
    const toggleCategory = (e) => {
        let clicked_category = e.target.getAttribute('category');
        let locations_size = Number(e.target.getAttribute('locations_size'));

        if (props.ungrouped_category === clicked_category) { // Same category
            props.setUngroupedCategory('');
        } else if (e.target.classList.contains('grouped') && locations_size > 0) { // Different category
            props.setUngroupedCategory(clicked_category);
        }
    }

    return (
        <div className="locations">
            <div className="component-header">
                <div className="component-header-icon-wrapper">
                    <img src={locationsIcon} width="25" alt="" /></div>
                <h1 className="heading-component h1">
                    Locations</h1>
                <div className="component-header-right-margin"></div>
            </div>
            <div className="seperator-2"></div>
            <div className="component-toolbar">
                <div className={`custom-button ${props.action === 'ADD' ? 'active' : 'inactive'}`} onClick={addLocation}>
                    <img src={addIcon} width="20" alt="" />
                    <h3 className="custom-heading">Add</h3>
                </div>
                <div className={`custom-button ${props.action === 'EDIT' ? 'active' : 'inactive'}`} onClick={editLocation}>
                    <img src={editIcon} width="20" alt="" />
                    <h3 className="custom-heading">Edit</h3>
                </div>
                <div className={`custom-button ${props.action === 'REMOVE' ? 'active' : 'inactive'}`} onClick={removeLocation}>
                    <img src={removeIcon} width="20" alt="" />
                    <h3 className="custom-heading">Remove</h3>
                </div>
            </div>
            <div className="seperator-3"></div>
            <div className="locations-list-container">
                {
                    props.categories_data.length > 0 ?
                        props.categories_data.map((category, i) => {
                            return <div className={`category ${props.ungrouped_category === category.name ? 'ungrouped' : 'grouped'}`}
                                key={i} category={category.name} locations_size={Object.keys(category.locations).length} onClick={ungroupCategory}>

                                <div className={`category-header ${props.ungrouped_category === category.name ? 'ungrouped' : 'grouped'}`}
                                    category={category.name} locations_size={Object.keys(category.locations).length} onClick={toggleCategory} >

                                    <img src={arrowIcon} category={category.name} width="20" alt="" className={`image-arrow-${props.ungrouped_category === category.name ? 'ungrouped' : 'grouped'}`} />
                                    <h1 category={category.name} className="h1 body heading-location-list-item" >Categoy: {category.name}</h1>
                                </div>

                                {props.ungrouped_category === category.name ? <div className="category-body">
                                    {
                                        Object.keys(category.locations).sort().map((location_name, j) => {
                                            return <Location name={location_name} category={category.name} key={j}
                                                color={colors[j % colors.length]} disableCurrentAction={disableCurrentAction} />;
                                        })
                                    }
                                </div> :
                                    <h6 className="category-item-sub-heading-2">{Object.keys(category.locations).length} locations in this category</h6>}
                            </div>
                        }) :
                        <div className="text-block">No categories yet. Go back to the Categories and add one!</div>

                }
                {props.action === 'VIEW' && <LocationViewer closeViewer={disableCurrentAction} />}
            </div>
            {(props.action === 'ADD' || (props.action === 'EDIT' && props.selected_location)) && <LocationForm closeForm={disableCurrentAction} />}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        action: state.operator.action,
        categories_data: state.data.categories,
        selected_location: state.data.selected_location,
        ungrouped_category: state.data.ungrouped_category,
        locations_count: state.data.locations_count
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAction: (action) => dispatch(actions_operator.setAction(action)),
        setUngroupedCategory: (category) => dispatch(actions_data.setUngroupedCategory(category)),
        setSelectedLocation: (name) => dispatch(actions_data.setSelectedLocation(name)),
        setSelectedCategory: (name) => dispatch(actions_data.setSelectedCategory(name)),
        setLocationDialogState: (state) => dispatch(actions_data.setLocationDialogState(state)),
        setViewMode: (mode) => dispatch(actions_data.setViewMode(mode)),
        resetLocationInput: () => dispatch(actions_data.resetLocationInput())
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Locations);