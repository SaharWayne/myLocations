export function activateScreen(screen) {
    return { type: 'ACTIVATE_SCREEN', payload: screen };
}

export function setAction(action) {
    return { type: 'SET_ACTION', payload: action };
}

export function resetAction() {
    return { type: 'RESET_ACTION' }
}