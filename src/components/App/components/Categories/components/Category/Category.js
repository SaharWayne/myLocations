import React, { Component } from 'react';
import swal from 'sweetalert';
import categoryIcon from '../../images/category.svg'

import { connect } from 'react-redux';
import * as actions_data from '../../../../redux/actions/Data-actions';


class Category extends Component {

    constructor(props) {
        super(props);
        this.handleCategoryClick = this.handleCategoryClick.bind(this);
    }

    // This function handles location click according to the current action
    handleCategoryClick() {
        if (this.props.action !== '') { // action ADD/EDIT/REMOVE
            this.props.setSelectedCategory(this.props.name);

            // If action is REMOVE and the category contains locations, 
            // ask the user for remove confirmation
            if (this.props.action === 'REMOVE') {

                let numLocations = Object.keys(this.props.categories_data.find(category => {
                    return (category.name === this.props.name);
                }).locations).length;

                let str = numLocations > 1 ? 'locatios' : 'location';
                if (numLocations > 0) {
                    swal({
                        title: 'Are you sure?',
                        text: `This category contains ${numLocations} ${str}. 
                        Removing it wiil also remove the ${str}. Proceed?`,
                        dangerMode: true,
                        buttons: ['Cancel', 'Remove']
                    }).then((willRemove) => {
                        if (willRemove) {
                            this.props.removeCategory(this.props.name);
                            this.props.disableCurrentAction(null, true);
                        }
                    })
                } else {
                    this.props.removeCategory(this.props.name);
                    this.props.disableCurrentAction(null, true);
                }
            }
        }
    }

    render() {
        return (
            <div className={`category ${!this.props.is_category_dialog_open ?
                (this.props.action === 'EDIT' ?
                    'shaking edit' : (this.props.action === 'REMOVE' ? 'shaking remove' : '')) : ''}`}
                onClick={this.handleCategoryClick}>
                <div className="category-header"><img src={categoryIcon} width="30" alt="" />
                    <h1 className="heading-category-list-item h1 body">{this.props.name}</h1>
                </div>
                <h6 className="category-item-sub-heading">Created on: {this.props.date}</h6>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        action: state.operator.action,
        categories_data: state.data.categories,
        is_category_dialog_open: state.data.is_category_dialog_open
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        removeCategory: (name) => dispatch(actions_data.removeCategory(name)),
        setSelectedCategory: (name) => dispatch(actions_data.setSelectedCategory(name))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Category);
