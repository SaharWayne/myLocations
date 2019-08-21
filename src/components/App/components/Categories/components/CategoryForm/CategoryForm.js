import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import '../../../../App.css';

import { connect } from 'react-redux';
import * as actions_data from '../../../../redux/actions/Data-actions';

const CategoryForm = (props) => {

    const inputRefs = { name: useRef() };
    const [formFilled, setFormFilled] = useState(props.action === 'EDIT');

    useEffect(() => {
        // If the user clicked 'EDIT', fill the form with the existing data
        if (props.action === 'EDIT') {
            inputRefs.name.current.value = props.selected_category;
        }

        props.setCategoryDialogState(true);
    });

    // This function updates state with changed input
    const handleChange = (e) => {
        inputRefs.name.current.classList.remove('input-error');
        props.updateCategoryInput(e.target.value.trim());
        setFormFilled(e.target.value && e.target.value.trim().length > 0);
    }

    // This function handles form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        let userInput_category = props.input_category || props.selected_category;

        // Form fully filled
        if (formFilled) {
            let inputChanged = userInput_category !== props.selected_category;

            // Input did not change, close form
            if (!inputChanged) {
                closeForm();
            } else { // Input changed

                // Check if location name already exists in category
                if (props.categories_data.find(val => val.name === userInput_category)) {
                    inputRefs.name.current.classList.add('input-error');
                    toast.error('Category with this name already exists!');
                    inputRefs.name.current.focus();
                } else {

                    // Submit action
                    switch (props.action) {
                        case 'ADD':
                            props.addCategory(userInput_category);
                            break;
                        case 'EDIT':
                            props.editCategory(userInput_category);
                            break;
                        default:
                            break;
                    }

                    // Close form
                    closeForm();
                }
            }

        } else { // Form not fully filled

            // Add 'input-error' class to the unfilled input, toast information & focus
            inputRefs.name.current.classList.add('input-error');
            toast.error('Empty input!', { autoClose: 1500 });
            inputRefs.name.current.focus();
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
                    <label htmlFor="name" className="form-field-label">Category Name</label>
                    <input className="text-field-form w-input" autoFocus={true} maxLength="256"
                        name="name" data-name="Name" placeholder="&quot;My Beach Houses&quot;" type="text"
                        id="name" required="" autoComplete="off" onChange={handleChange} ref={inputRefs.name} />
                    <input type="submit" data-wait="Please wait..."
                        className={`component-form-submit w-button ${formFilled ? 'active' : 'inactive'}`} value="OK" />
                </form>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        action: state.operator.action,
        categories_data: state.data.categories,
        input_category: state.data.input_category,
        selected_category: state.data.selected_category
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        addCategory: (name) => dispatch(actions_data.addCategory(name)),
        editCategory: (input) => dispatch(actions_data.editCategory(input)),
        updateCategoryInput: (input) => dispatch(actions_data.updateCategoryInput(input)),
        setCategoryDialogState: (state) => dispatch(actions_data.setCategoryDialogState(state))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryForm);