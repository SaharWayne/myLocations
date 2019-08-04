const operatorReducer = (state = {}, action) => {
    switch (action.type) {
        case 'ACTIVATE_SCREEN':
            state = { ...state, activeScreen: action.payload };
            break;
        case 'SET_ACTION':
            state = { ...state, action: action.payload };
            break;
        case 'RESET_ACTION':
            state = { ...state, action: '' };
            break;
        default:
            break;
    }

    return state;
}

export default operatorReducer;