const dataReducer = (state = {}, action) => {

    switch (action.type) {
        case 'ADD_CATEGORY':
            state = {
                ...state,
                data: [{
                    name: action.payload,
                    locations: {},
                    date: new Date().toLocaleString()
                }, ...state.data]
            };
            break;
        case 'ADD_LOCATION':
            state = {
                ...state,
                data: state.data.map((val) => {
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
                data: state.data.map((val) => {
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
                data: state.data.map((val) => {
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
            let numLocations = Object.keys(state.data.find(category => 
                { return (category.name === action.payload); }).locations).length;
            state = {
                ...state,
                data: state.data.filter(val => val.name !== action.payload),
                action: state.data.length === 1 ? '' : state.action,
                locations_count: state.locations_count - numLocations
            };
            break;
        case 'REMOVE_LOCATION':

            let locationsLength = Object.keys(state.data.find(val =>
                val.name === state.selected_category).locations).length;
            state = {
                ...state,
                data: state.data.map((val) => {
                    if (val.name === state.selected_category) {
                        let updatedLocations = { ...val.locations };
                        delete updatedLocations[state.selected_location];
                        val['locations'] = updatedLocations;
                    }
                    return { ...val };
                }),
                action: locationsLength === 1 ? '' : state.action,
                ungrouped_category: locationsLength === 1 ? '' : state.ungrouped_category,
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