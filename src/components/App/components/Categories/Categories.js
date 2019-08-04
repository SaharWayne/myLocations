import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Category from './components/Category/Category';
import CategoryForm from './components/CategoryForm/CategoryForm';
import categoriesIcon from '../../images/categories.svg';
import addIcon from '../../images/add.svg';
import editIcon from '../../images/edit.svg';
import removeIcon from '../../images/remove.svg';
import './Categories.css';

import { connect } from 'react-redux';
import * as actions_operator from '../../redux/actions/Operator-actions';
import * as actions_data from '../../redux/actions/Data-actions';

class Categories extends Component {

    constructor(props) {
        super(props);
        this.addCategory = this.addCategory.bind(this);
        this.editCategory = this.editCategory.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
        this.disableCurrentAction = this.disableCurrentAction.bind(this);
    }

    // This function sets/cancels 'ADD' action to state (for Add mode)
    // Triggered by 'ADD' toolbar button
    addCategory() {
        this.disableCurrentAction(null, true);
        this.props.setAction('ADD');
    }

    // This function sets/cancels 'EDIT' action to state (for Edit mode)
    // Triggered by 'EDIT' toolbar button
    editCategory() {
        if (this.props.categories_data.length > 0) {
            if (this.props.action === 'EDIT') { // Cancel action
                this.props.setAction('');
            } else { // Set new action
                this.disableCurrentAction(null, true);
                this.props.setAction('EDIT');
            }
        } else { // No locations to edit yet
            toast.warn('No categories to edit. Try adding one');
        }
    }

    // This function sets/cancels 'REMOVE' action to state (for Remove mode)
    // Triggered by 'REMOVE' toolbar button
    removeCategory(e) {
        if (this.props.categories_data.length > 0) {
            if (this.props.action === 'REMOVE') { // Cancel action
                this.props.setAction('');
            } else { // Set new action
                this.disableCurrentAction(null, true);
                this.props.setAction('REMOVE');
            }
        } else { // No locations to remove yet
            toast.warn('No categories to remove. Try adding one');
        }
    }

    // This function disables any action (ADD/EDIT/REMOVE)
    disableCurrentAction(e, controlled = false) {
        if (controlled || e.target === e.currentTarget) {
            this.props.setAction('');
            this.props.setCategoryDialogState(false);
            this.props.setSelectedCategory('');
            this.props.resetCategoryInput();
        }
    }

    render() {
        return (
            <div className="categories">
                <div className="component-header">
                    <div className="component-header-icon-wrapper">
                        <img src={categoriesIcon} width="25" alt="" /></div>
                    <h1 className="heading-component h1">
                        Categories</h1>
                    <div className="component-header-right-margin"></div>
                </div>
                <div className="seperator-2"></div>
                <div className="component-toolbar">
                    <div className={`custom-button ${this.props.action === 'ADD' ? 'active' : 'inactive'}`} onClick={this.addCategory}>
                        <img src={addIcon} width="20" alt="" />
                        <h3 className="custom-heading">Add</h3>
                    </div>
                    <div className={`custom-button ${this.props.action === 'EDIT' ? 'active' : 'inactive'}`} onClick={this.editCategory}>
                        <img src={editIcon} width="20" alt="" />
                        <h3 className="custom-heading">Edit</h3>
                    </div>
                    <div className={`custom-button ${this.props.action === 'REMOVE' ? 'active' : 'inactive'}`} onClick={this.removeCategory}>
                        <img src={removeIcon} width="20" alt="" />
                        <h3 className="custom-heading">Remove</h3>
                    </div>
                </div>
                <div className="seperator-3"></div>
                <div className="categories-list-container">
                    {this.props.categories_data.length > 0 ?
                        this.props.categories_data.map((category, i) => {
                            return <Category name={category.name} date={category.date} key={i} disableCurrentAction={this.disableCurrentAction}/>
                        }) :
                        <div className="text-block">No categories yet. Click the 'Add' button above</div>}
                </div>
                {(this.props.action === 'ADD' || (this.props.action === 'EDIT' && this.props.selected_category)) && <CategoryForm closeForm={this.disableCurrentAction} />}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        action: state.operator.action,
        categories_data: state.data.categories,
        selected_category: state.data.selected_category,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAction: (action) => dispatch(actions_operator.setAction(action)),
        setSelectedCategory: (name) => dispatch(actions_data.setSelectedCategory(name)),
        setCategoryDialogState: (state) => dispatch(actions_data.setCategoryDialogState(state)),
        resetCategoryInput: () => dispatch(actions_data.resetCategoryInput())
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Categories);