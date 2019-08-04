import { combineReducers, createStore } from 'redux';
import operatorReducer from './reducers/Operator-reducer';
import dataReducer from './reducers/Data-reducer';

// Combine reducers
const rootReducer = combineReducers({
    operator: operatorReducer,
    data: dataReducer
});

// Set initial state
const initialState = {
    operator: {
        activeScreen: 'Categories',
        action: ''
    },
    data: {
        categories: [{
            date: '31.7.2019, 17:11:43',
            locations: {
                'Delaware Beach House': {
                    address: '51 Baltimore Ave, Rehoboth Beach, DE 19971, USA',
                    lat: 38.7171603,
                    lng: -75.0812477,
                },
                'Lincoln City Beach House': {
                    address: '4567 SW Beach Ave, Lincoln City, OR 97367, USA',
                    lat: 44.9319352,
                    lng: -124.02391790000001,
                },
                'Long Island Beach House': {
                    address: '55 S Elmwood Ave, Montauk, NY 11954, USA',
                    lat: 41.0339355,
                    lng: -71.94328710000002
                },
                'Miami Beach House': {
                    address: '200 S Biscayne Blvd, Miami, FL 33131, USA',
                    lat: 25.7721982,
                    lng: -80.1881477
                },
                'Outer Banks Beach House': {
                    address: '42050 Cedar Cir, Avon, NC 27915, USA',
                    lat: 35.3305316,
                    lng: -75.50870980000002
                }
            },
            name: 'My Beach Houses (Example)'
        }],
        locations_count: 5,
        input_category: '',
        view_mode: '',
        input_location: {},
        selected_category: '',
        selected_location: '',
        ungrouped_category: 'My Beach Houses (Example)',
        is_category_dialog_open: false,
        is_location_dialog_open: false
    }
}

// Set state: if previous state exists in local storage load it, 
// otherwise set initialState
const persistedState = localStorage.getItem('reduxState') ?
    JSON.parse(localStorage.getItem('reduxState')) : initialState;

const resetStoreState = () => {
    localStorage.setItem('reduxState', JSON.stringify(initialState));
}

// Create store
const store = createStore(rootReducer, persistedState);

// Subscribe to store state changes and save each new state to local storage
store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()));
});

export { resetStoreState, store };