export const activateScreen = screen => {
    return { type: 'ACTIVATE_SCREEN', payload: screen };
}

export const setAction = action => {
    return { type: 'SET_ACTION', payload: action };
}

export const resetAction = () => {
    return { type: 'RESET_ACTION' }
}