import React, { Component } from 'react';
import { toast } from 'react-toastify';
import '../../../../App.css';

import { connect } from 'react-redux';
import * as actions_data from '../../../../redux/actions/Data-actions';

class CategoryForm extends Component {
    constructor(props) {
        super(props);

        this.inputRefs = { name: React.createRef() };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.closeForm = this.closeForm.bind(this);

        this.formFilled = this.props.action === 'EDIT';
    }

    componentDidMount() {
        // If the used clicked 'EDIT', fill the form with the existing data
        if (this.props.action === 'EDIT') {
            this.inputRefs.name.current.value = this.props.selected_category;
        }

        this.props.setCategoryDialogState(true);
    }

    // This function updates state with changed input
    handleChange(e) {
        this.inputRefs.name.current.classList.remove('input-error');
        this.props.updateCategoryInput(e.target.value.trim());
        this.formFilled = e.target.value && e.target.value.trim().length > 0;
    }

    // This function handles form submit
    handleSubmit(e) {
        e.preventDefault();

        let userInput_category = this.props.input_category || this.props.selected_category;
        
        // Form fully filled
        if (this.formFilled) {
            let inputChanged = userInput_category !== this.props.selected_category;

            // Input did not change, close form
            if (!inputChanged) {
                this.closeForm();
            } else { // Input changed

                // Check if location name already exists in category
                if (this.props.categories_data.find(val => val.name === userInput_category)) {
                    this.inputRefs.name.current.classList.add('input-error');
                    toast.error('Category with this name already exists!');
                    this.inputRefs.name.current.focus();
                } else {

                    // Submit action
                    switch (this.props.action) {
                        case 'ADD':
                            this.props.addCategory(userInput_category);
                            break;
                        case 'EDIT':
                            this.props.editCategory(userInput_category);
                            break;
                        default:
                            break;
                    }

                    // Close form
                    this.closeForm();
                }
            }

        } else { // Form not fully filled

            // Add 'input-error' class to the unfilled input, toast information & focus
            this.inputRefs.name.current.classList.add('input-error');
            toast.error('Empty input!', { autoClose: 1500 });
            this.inputRefs.name.current.focus();
        }
    }

    // This function closes the form
    closeForm() {
        this.props.closeForm(null, true);
    }

    render() {
        return (
            <div className="component-form-container" onMouseDown={this.props.closeForm}>
                <div className="component-form w-form">
                    <form className="component-form-inner" onSubmit={this.handleSubmit}>
                        <div className='form-x-button-container'><h4 className='form-x-button' onClick={this.closeForm}>✖</h4></div>
                        <label htmlFor="name" className="form-field-label">Category Name</label>
                        <input className="text-field-form w-input" autoFocus={true} maxLength="256"
                            name="name" data-name="Name" placeholder="&quot;My Beach Houses&quot;" type="text"
                            id="name" required="" autoComplete="off" onChange={this.handleChange} ref={this.inputRefs.name} />
                        <input type="submit" data-wait="Please wait..."
                            className={`component-form-submit w-button ${this.formFilled ? 'active' : 'inactive'}`} value="OK" />
                    </form>
                </div>
            </div>
        );
    }
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