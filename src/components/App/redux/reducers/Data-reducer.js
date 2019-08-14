
const dataReducer = (state = {}, action) => {

    switch (action.type) {
        case 'ADD_CATEGORY':
            state = {
                ...state,
                categories: [{
                    name: action.payload,
                    locations: {},
                    date: new Date().toLocaleString()
                }, ...state.categories]
            };
            break;
        case 'ADD_LOCATION':
            state = {
                ...state,
                categories: state.categories.map((val) => {
                    if (val.name === action.payload.category) {
                        let newLocation = {
                            address: action.payload.address,
                            lat: action.payload.lat,
                            lng: action.payload.lng
                        }
                        return { ...val, locations: { ...val.locations, [action.payload.name]: newLocation } };
                    } else {
                        return { ...val };
                    }
                }),
                locations_count: state.locations_count + 1
            };
            break;
        case 'EDIT_CATEGORY':
            state = {
                ...state,
                categories: state.categories.map((val) => {
                    return {
                        ...val, name: val.name === state.selected_category ?
                            action.payload : val.name
                    };
                })
            };
            break;
        case 'EDIT_LOCATION':
            state = {
                ...state,
                categories: state.categories.map((val) => {
                    if (val.name === action.payload.category) {
                        let updatedLocations = { ...val.locations };
                        delete updatedLocations[state.selected_location];

                        updatedLocations[action.payload.name] = {
                            address: action.payload.address,
                            lat: action.payload.lat,
                            lng: action.payload.lng
                        }
                        val['locations'] = updatedLocations;
                    }
                    return { ...val };
                }),

            };
            break;
        case 'REMOVE_CATEGORY':
            let numLocations = Object.keys(state.categories.find(category => 
                { return (category.name === action.payload); }).locations).length;

            state = {
                ...state,
                categories: state.categories.filter(val => val.name !== action.payload),
                locations_count: state.locations_count - numLocations
            };
            break;
        case 'REMOVE_LOCATION':
            state = {
                ...state,
                categories: state.categories.map((val) => {
                    if (val.name === state.selected_category) {
                        let updatedLocations = { ...val.locations };
                        delete updatedLocations[state.selected_location];
                        val['locations'] = updatedLocations;
                    }
                    return { ...val };
                }),
                locations_count: state.locations_count - 1
            };
            break;
        case 'RESET_CATEGORY_INPUT':
            state = { ...state, input_category: '' };
            break;
        case 'RESET_LOCATION_INPUT':
            state = { ...state, input_location: {} };
            break;
        case 'SET_SELECTED_CATEGORY':
            state = { ...state, selected_category: action.payload };
            break;
        case 'SET_SELECTED_LOCATION':
            state = { ...state, selected_location: action.payload };
            break;
        case 'SET_UNGROUPED_CATEGPRY':
            state = { ...state, ungrouped_category: action.payload };
            break;
        case 'SET_LOCATION_DIALOG_STATE':
            state = { ...state, is_location_dialog_open: action.payload };
            break;
        case 'SET_CATEGORY_DIALOG_STATE':
            state = { ...state, is_category_dialog_open: action.payload };
            break;
        case 'SET_VIEW_MODE':
            state = { ...state, view_mode: action.payload };
            break;
        case 'UPDATE_CATEGORY_INPUT':
            state = { ...state, input_category: action.payload };
            break;
        case 'UPDATE_LOCATION_INPUT':
            console.log('sesms ok');
            state = { ...state, input_location: action.payload };
            break;
        case 'UPDATE_MAP_POSITION':
            state = { ...state, map_position: action.payload };
            break;
        case 'UPDATE_MAP_ADDRESS':
            state = { ...state, map_address: action.payload };
            break;
        default:
            break;
    }

    return state;
}

export default dataReducer;