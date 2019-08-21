import React from 'react';
import swal from 'sweetalert';
import categoryIcon from '../../images/category.svg'

import { connect } from 'react-redux';
import * as actions_data from '../../../../redux/actions/Data-actions';

const Category = (props) => {

    // This function handles location click according to the current action
    const handleCategoryClick = () => {
        if (props.action !== '') { // action ADD/EDIT/REMOVE
            props.setSelectedCategory(props.name);

            // If action is REMOVE and the category contains locations, 
            // ask the user for remove confirmation
            if (props.action === 'REMOVE') {

                // Define remove function
                const removeFunc = () => {
                    if (props.categories_data.length === 1) {
                        props.disableCurrentAction(null, true);
                    }
                    props.removeCategory(props.name);
                };

                // Get number of locations in this category
                let numLocations = Object.keys(props.categories_data.find(category => {
                    return (category.name === props.name);
                }).locations).length;
                let str = numLocations > 1 ? 'locatios' : 'location';

                // Display warning if nececssary
                if (numLocations > 0) {
                    swal({
                        title: 'Are you sure?',
                        text: `This category contains ${numLocations} ${str}. 
                        Removing it wiil also remove the ${str}. Proceed?`,
                        dangerMode: true,
                        buttons: ['Cancel', 'Remove']
                    }).then((willRemove) => {
                        if (willRemove) {
                            removeFunc();
                        }
                    })
                } else {
                    removeFunc();
                }
            }
        }
    }

    return (
        <div className={`category ${!props.is_category_dialog_open ?
            (props.action === 'EDIT' ?
                'shaking edit' : (props.action === 'REMOVE' ? 'shaking remove' : '')) : ''}`}
            onClick={handleCategoryClick}>
            <div className="category-header"><img src={categoryIcon} width="30" alt="" />
                <h1 className="heading-category-list-item h1 body">{props.name}</h1>
            </div>
            <h6 className="category-item-sub-heading">Created on: {props.date}</h6>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        action: state.operator.action,
        categories_data: state.data.categories,
        is_category_dialog_open: state.data.is_category_dialog_open,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        removeCategory: (name) => dispatch(actions_data.removeCategory(name)),
        setSelectedCategory: (name) => dispatch(actions_data.setSelectedCategory(name)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Category);
