import React, { Component } from 'react';
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

class Locations extends Component {

    constructor(props) {
        super(props);
        this.addLocation = this.addLocation.bind(this);
        this.editLocation = this.editLocation.bind(this);
        this.removeLocation = this.removeLocation.bind(this);
        this.disableCurrentAction = this.disableCurrentAction.bind(this);
        this.ungroupCategory = this.ungroupCategory.bind(this);
        this.toggleCategory = this.toggleCategory.bind(this);

        this.colors = ['blue', 'orange', 'red', 'purple', 'green'];
    }

    // This function sets/cancels 'ADD' action to state (for Add mode)
    // Triggered by 'ADD' toolbar button
    addLocation() {
        if (this.props.categories_data.length > 0) {
            this.disableCurrentAction(null, true);
            this.props.setAction('ADD');
        } else { // No categories yet
            swal('Before adding a location, please add at least 1 category through the Categories screen');
        }

    }

    // This function sets/cancels 'EDIT' action to state (for Edit mode)
    // Triggered by 'EDIT' toolbar button
    editLocation() {
        if (this.props.locations_count > 0) {
            if (this.props.action === 'EDIT') { // Cancel action
                this.props.setAction('');
            } else { // Set new action
                this.disableCurrentAction(null, true);
                this.props.setAction('EDIT');
            }
        } else { // No locations to edit yet
            toast.warn('No locations to edit. Try adding one');
        }
    }

    // This function sets/cancels 'REMOVE' action to state (for Remove mode)
    // Triggered by 'REMOVE' toolbar button
    removeLocation() {
        if (this.props.locations_count > 0) {
            if (this.props.action === 'REMOVE') { // Cancel action
                this.props.setAction('');
            } else { // Set new action
                this.disableCurrentAction(null, true);
                this.props.setAction('REMOVE');
            }
        } else { // No locations to remove yet
            toast.warn('No locations to remove. Try adding one');
        }
    }

    // This function disables any action (ADD/EDIT/REMOVE)
    disableCurrentAction(e, controlled = false) {
        if (controlled || e.target === e.currentTarget) {
            this.props.setAction('');
            this.props.setViewMode('');
            this.props.setLocationDialogState(false);
            this.props.setSelectedLocation('');
            this.props.setSelectedCategory('');
            this.props.resetLocationInput();
        }
    }

    // This function ungroups a category
    ungroupCategory(e) {
        let clicked_category = e.currentTarget.getAttribute('category');
        let locations_size = Number(e.currentTarget.getAttribute('locations_size'));

        // Only ungroup categories with locations
        if (e.currentTarget.classList.contains('grouped') && locations_size > 0) {
            this.props.setUngroupedCategory(clicked_category);
        }
    }

    // This function toggles a category
    toggleCategory(e) {
        let clicked_category = e.target.getAttribute('category');
        let locations_size = Number(e.target.getAttribute('locations_size'));

        if (this.props.ungrouped_category === clicked_category) { // Same category
            this.props.setUngroupedCategory('');
        } else if (e.target.classList.contains('grouped') && locations_size > 0) { // Different category
            this.props.setUngroupedCategory(clicked_category);
        }
    }

    render() {
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
                    <div className={`custom-button ${this.props.action === 'ADD' ? 'active' : 'inactive'}`} onClick={this.addLocation}>
                        <img src={addIcon} width="20" alt="" />
                        <h3 className="custom-heading">Add</h3>
                    </div>
                    <div className={`custom-button ${this.props.action === 'EDIT' ? 'active' : 'inactive'}`} onClick={this.editLocation}>
                        <img src={editIcon} width="20" alt="" />
                        <h3 className="custom-heading">Edit</h3>
                    </div>
                    <div className={`custom-button ${this.props.action === 'REMOVE' ? 'active' : 'inactive'}`} onClick={this.removeLocation}>
                        <img src={removeIcon} width="20" alt="" />
                        <h3 className="custom-heading">Remove</h3>
                    </div>
                </div>
                <div className="seperator-3"></div>
                <div className="locations-list-container">
                    {
                        this.props.categories_data.length > 0 ?
                            this.props.categories_data.map((category, i) => {
                                return <div className={`category ${this.props.ungrouped_category === category.name ? 'ungrouped' : 'grouped'}`}
                                    key={i} category={category.name} locations_size={Object.keys(category.locations).length} onClick={this.ungroupCategory}>

                                    <div className={`category-header ${this.props.ungrouped_category === category.name ? 'ungrouped' : 'grouped'}`}
                                        category={category.name} locations_size={Object.keys(category.locations).length} onClick={this.toggleCategory} >

                                        <img src={arrowIcon} category={category.name} width="20" alt="" className={`image-arrow-${this.props.ungrouped_category === category.name ? 'ungrouped' : 'grouped'}`} />
                                        <h1 category={category.name} className="h1 body heading-location-list-item" >Categoy: {category.name}</h1>
                                    </div>

                                    {this.props.ungrouped_category === category.name ? <div className="category-body">
                                        {
                                            Object.keys(category.locations).sort().map((location_name, j) => {
                                                return <Location name={location_name} category={category.name} key={j}
                                                    color={this.colors[j % this.colors.length]} disableCurrentAction={this.disableCurrentAction}/>;
                                            })
                                        }
                                    </div> :
                                        <h6 className="category-item-sub-heading-2">{Object.keys(category.locations).length} locations in this category</h6>}
                                </div>
                            }) :
                            <div className="text-block">No categories yet. Go back to the Categories and add one!</div>

                    }
                    {this.props.action === 'VIEW' && <LocationViewer closeForm={this.disableCurrentAction} />}
                </div>
                {(this.props.action === 'ADD' || (this.props.action === 'EDIT' && this.props.selected_location)) && <LocationForm closeForm={this.disableCurrentAction} />}
            </div>
        )
    }
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