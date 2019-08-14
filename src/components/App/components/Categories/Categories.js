import React from 'react';
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

const Categories = (props) => {

    // This function sets/cancels 'ADD' action to state (for Add mode)
    // Triggered by 'ADD' toolbar button
    const addCategory = () => {
        disableCurrentAction(null, true);
        props.setAction('ADD');
    }

    // This function sets/cancels 'EDIT' action to state (for Edit mode)
    // Triggered by 'EDIT' toolbar button
    const editCategory = () => {
        if (props.categories_data.length > 0) {
            if (props.action === 'EDIT') { // Cancel action
                props.setAction('');
            } else { // Set new action
                disableCurrentAction(null, true);
                props.setAction('EDIT');
            }
        } else { // No locations to edit yet
            toast.warn('No categories to edit. Try adding one');
        }
    }

    // This function sets/cancels 'REMOVE' action to state (for Remove mode)
    // Triggered by 'REMOVE' toolbar button
    const removeCategory = (e) => {
        if (props.categories_data.length > 0) {
            if (props.action === 'REMOVE') { // Cancel action
                props.setAction('');
            } else { // Set new action
                disableCurrentAction(null, true);
                props.setAction('REMOVE');
            }
        } else { // No locations to remove yet
            toast.warn('No categories to remove. Try adding one');
        }
    }

    // This function disables any action (ADD/EDIT/REMOVE)
    const disableCurrentAction = (e, controlled = false) => {
        if (controlled || e.target === e.currentTarget) {
            props.setAction('');
            props.setCategoryDialogState(false);
            props.setSelectedCategory('');
            props.resetCategoryInput();
        }
    }

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
                <div className={`custom-button ${props.action === 'ADD' ? 'active' : 'inactive'}`} onClick={addCategory}>
                    <img src={addIcon} width="20" alt="" />
                    <h3 className="custom-heading">Add</h3>
                </div>
                <div className={`custom-button ${props.action === 'EDIT' ? 'active' : 'inactive'}`} onClick={editCategory}>
                    <img src={editIcon} width="20" alt="" />
                    <h3 className="custom-heading">Edit</h3>
                </div>
                <div className={`custom-button ${props.action === 'REMOVE' ? 'active' : 'inactive'}`} onClick={removeCategory}>
                    <img src={removeIcon} width="20" alt="" />
                    <h3 className="custom-heading">Remove</h3>
                </div>
            </div>
            <div className="seperator-3"></div>
            <div className="categories-list-container">
                {props.categories_data.length > 0 ?
                    props.categories_data.map((category, i) => {
                        return <Category name={category.name} date={category.date} key={i} disableCurrentAction={disableCurrentAction} />
                    }) :
                    <div className="text-block">No categories yet. Click the 'Add' button above</div>}
            </div>
            {(props.action === 'ADD' || (props.action === 'EDIT' && props.selected_category)) && <CategoryForm closeForm={disableCurrentAction} />}
        </div>
    )
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